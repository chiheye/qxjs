/******************************************
 * @name ITHome 每日签到
 * @author chiheye
 * @update 2025.07
 * @version 1.0
 ******************************************
 脚本声明:
 1. 本脚本仅用于学习研究，禁止用于商业用途
 2. 本脚本不保证准确性、可靠性、完整性和及时性
 3. 请勿将本脚本用于商业用途，由此引起的问题与作者无关

 脚本说明:
 - 支持 MITM 自动获取 Authorization Token
 - 获取成功后可关闭 MITM 减少消耗
 - 建议配合定时任务每天执行一次

 ************************
 Stash / Surge / Quantumult X 配置:
 ************************

 [MITM]
 hostname = napi.ithome.com, my.ruanmei.com

 [Rewrite]
 # 获取 Token（仅第一次使用）
 ^https?://(napi\.ithome\.com|my\.ruanmei\.com)/api/ url script-request-header https://你的脚本地址/ithome.js

 # 签到执行（可长期保留）
 ^https?://napi\.ithome\.com/api/usersign/sign url script-response-body https://你的脚本地址/ithome.js

 [Task]
 # 每天早上 9 点执行签到（Stash 写法）
 0 9 * * * https://你的脚本地址/ithome.js, tag=ITHome签到, enabled=true
 ******************************************/

const $ = new Env("ITHome签到");

const SIGN_URL = "https://napi.ithome.com/api/usersign/sign";
const TOKEN_KEY = "ithome_auth_token";

// ====================== 获取 Token ======================
if ($request && $request.headers) {
    const auth = $request.headers["Authorization"] || $request.headers["authorization"];
    if (auth && auth.includes("Bearer")) {
        if ($.setdata(auth, TOKEN_KEY)) {
            $.msg("ITHome", "✅ Token 获取成功", "可关闭获取 Token 的 rewrite");
            console.log("Token 已保存: " + auth);
        }
    }
    $.done();
}

// ====================== 执行签到 ======================
const token = $.getdata(TOKEN_KEY);

if (!token) {
    $.msg("ITHome 签到", "❌ 未找到 Token", "请打开 App 登录后触发一次请求");
    // 自动打开 App
    $app.openURL("ithome://");
    $app.openURL("https://my.ruanmei.com/?page=sign");
    $.done();
}

const url = SIGN_URL + "?userHash=" + encodeURIComponent(token);
const headers = {
    "User-Agent": "ITHomeClient/9.31 (iPhone; iOS 18.3.2; Scale/3.00)",
    "Accept": "*/*",
    "Host": "napi.ithome.com",
    "Connection": "keep-alive"
};

$.get({ url: url, headers: headers }, (err, resp, data) => {
    if (err) {
        $.msg("ITHome 签到", "❌ 请求失败", err);
        $.done();
        return;
    }

    try {
        const res = JSON.parse(data);
        if (res.code === 0 || res.message?.includes("成功")) {
            $.msg("ITHome 签到", "🎉 签到成功", res.data?.exp ? `+${res.data.exp} 经验` : "今日签到完成");
        } else if (res.message?.includes("已签到")) {
            $.msg("ITHome 签到", "✅ 今日已签到", "");
        } else {
            $.msg("ITHome 签到", "⚠️ 签到异常", res.message || data);
        }
    } catch (e) {
        $.msg("ITHome 签到", "❌ 解析失败", data);
    }
    $.done();
});

// ====================== Env ======================
function Env(name) {
    this.name = name;
    this.getdata = (key) => $persistentStore.read(key);
    this.setdata = (val, key) => $persistentStore.write(val, key);
    this.msg = (title, subtitle, body) => $notification.post(title, subtitle, body);
    this.get = (options, callback) => $httpClient.get(options, callback);
    this.done = (val = {}) => $done(val);
}