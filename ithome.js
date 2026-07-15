/******************************************
 * @name ITHome 每日签到
 * @author chiheye
 * @update 2025.07.15
 * @version 1.0
 ******************************************/

// Quantumult X 配置说明：
/*
[MITM]
hostname = napi.ithome.com, my.ruanmei.com

[rewrite_local]
# 获取 Token（第一次使用，获取后可禁用）
^https?://(napi\.ithome\.com|my\.ruanmei\.com)/api/ url script-request-header ithome_sign.js

# 执行签到
^https?://napi\.ithome\.com/api/usersign/sign url script-response-body ithome_sign.js

[task_local]
# 每天 9 点执行签到
0 9 * * * ithome_sign.js, tag=ITHome签到, img-url=https://raw.githubusercontent.com/Orz-3/mini/master/Color/ithome.png, enabled=true
*/

const $ = new Env("ITHome签到");

const SIGN_API = "https://napi.ithome.com/api/usersign/sign";
const TOKEN_KEY = "ithome_token";

// ====================== 获取 Token ======================
if ($request && $request.headers) {
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
    $.msg("ITHome 签到", "❌ 未找到 Token", "请打开 ITHome App 登录后重新触发");
    // 自动打开 App
    $app.openURL("ithome://");
    $app.openURL("https://my.ruanmei.com/?page=sign");
    $.done();
}

const url = `${SIGN_API}?userHash=${encodeURIComponent(token)}`;

const headers = {
    "Accept-Encoding": "gzip, deflate, br",
    "Accept": "*/*",
    "Connection": "keep-alive",
    "Host": "napi.ithome.com",
    "User-Agent": "ITHomeClient/9.31 (iPhone; iOS 18.3.2; Scale/3.00)",
    "Accept-Language": "zh-Hans-CN;q=1"
};

$.get({ url, headers }, (err, resp, data) => {
    if (err) {
        $.msg("ITHome 签到", "❌ 请求失败", err);
        $.done();
        return;
    }

    try {
        const body = JSON.parse(data);
        
        if (body.code === 0 || /成功|已签到/.test(body.message)) {
            const exp = body.data?.exp ? ` +${body.data.exp}经验` : "";
            $.msg("ITHome 签到", "🎉 签到成功", exp || "今日签到完成");
        } else {
            $.msg("ITHome 签到", "⚠️ 签到提示", body.message || "未知状态");
        }
    } catch (e) {
        $.msg("ITHome 签到", "❌ 响应解析失败", data);
    }
    
    $.done();
});

// ====================== Quantumult X Env ======================
function Env(name) {
    this.name = name;
    this.getdata = (key) => $prefs.valueForKey(key);
    this.setdata = (val, key) => $prefs.setValueForKey(val, key);
    this.msg = (title, subtitle, body) => $notify(title, subtitle, body);
    this.get = (option, callback) => $task.fetch(option).then(response => callback(null, response, response.body)).catch(err => callback(err));
    this.done = (val = {}) => $done(val);
}