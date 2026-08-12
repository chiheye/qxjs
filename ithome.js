/******************************************
 * @name ITHome 每日签到
 * @author chiheye
 * @update 2026.08.13
 * @version 1.5
 ******************************************

// Quantumult X 配置说明：
******************************************
[MITM]
hostname = napi.ithome.com
******************************************
[rewrite_local]
# 获取 Token（第一次使用，获取后可禁用）
# 触发方式：在 IT之家 App 内打开签到页面即可触发
^https?://(napi\.ithome\.com|my\.ruanmei\.com)/api/ url script-request-header https://raw.githubusercontent.com/chiheye/qxjs/refs/heads/main/ithome.js

# 执行签到（可保留）
^https?://napi\.ithome\.com/api/usersign/sign url script-response-body https://raw.githubusercontent.com/chiheye/qxjs/refs/heads/main/ithome.js
******************************************
[task_local]
# 每天 9 点执行签到
0 9 * * * https://raw.githubusercontent.com/chiheye/qxjs/refs/heads/main/ithome.js, tag=ITHome签到, img-url=https://raw.githubusercontent.com/Orz-3/mini/master/Color/ithome.png, enabled=true
******************************************/

const $ = new Env("ITHome签到");

const SIGN_API = "https://napi.ithome.com/api/usersign/sign";
const TOKEN_KEY = "ithome_token";

// ====================== 获取 Token ======================
if (typeof $request !== "undefined" && $request.headers) {
    const authorization = $request.headers["Authorization"] || $request.headers["authorization"];
    
    if (authorization && authorization.startsWith("Bearer ")) {
        $.setdata(authorization, TOKEN_KEY);
        $.msg("ITHome", "✅ Token 获取成功", "可禁用获取Token的rewrite");
        console.log("✅ ITHome Token 已保存");
    }
    $.done();
}

// ====================== 执行签到 ======================
const token = $.getdata(TOKEN_KEY);

if (!token) {
    $.msg("ITHome 签到", "❌ 未找到 Token", "请打开 ITHome App 登录后重新触发一次请求");
    $app.openURL("ithome://");
    $app.openURL("https://my.ruanmei.com/?page=sign");
    $.done();
}

const url = `${SIGN_API}?userHash=${encodeURIComponent(token)}`;

const headers = {
    "Accept": "*/*",
    "Accept-Language": "en-US;q=1, zh-Hans-US;q=0.9",
    "Accept-Encoding": "gzip, deflate, br",
    "Connection": "keep-alive",
    "Content-Type": "application/x-www-form-urlencoded",
    "Host": "napi.ithome.com",
    "User-Agent": "ITHomeClient/9.32 (iPhone; iOS 18.3.2; Scale/3.00)"
};

$.get({ url, headers }, (err, resp, data) => {
    if (err) {
        $.msg("ITHome 签到", "❌ 请求失败", String(err));
        $.done();
        return;
    }

    try {
        const body = JSON.parse(data);
        
        // 成功：ok === 1
        if (body.ok === 1) {
            const coin = body.coin || 0;
            const cdays = body.cdays || 0;
            const remain = body.remainday || 0;
            const reward = body.message?.["签到奖励"] || `+${coin}金币`;
            
            $.msg(
                "ITHome 签到",
                "🎉 签到成功",
                `${reward}\n连续签到 ${cdays} 天\n还需 ${remain} 天可领额外奖励`
            );
        } 
        // 重复签到：ok === 0
        else if (body.ok === 0) {
            $.msg("ITHome 签到", "✅ 今日已签到", "明天再来吧");
        } 
        else {
            $.msg("ITHome 签到", "⚠️ 签到异常", body.title || body.msg || data);
        }
    } catch (e) {
        $.msg("ITHome 签到", "❌ 解析失败", data);
        console.log("解析错误:", e);
    }
    
    $.done();
});

// ====================== Quantumult X Env ======================
function Env(name) {
    this.name = name;
    this.getdata = (key) => $prefs.valueForKey(key);
    this.setdata = (val, key) => $prefs.setValueForKey(val, key);
    this.msg = (title, subtitle, body) => $notify(title, subtitle, body);
    this.get = (option, callback) => {
        $task.fetch(option).then(
            response => callback(null, response, response.body),
            err => callback(err.error || err, null, null)
        );
    };
    this.done = (val = {}) => $done(val);
}