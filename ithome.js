/******************************************
 * @name ITHome 每日签到
 * @author chiheye
 * @update 2026.07.15
 * @version 1.3
 ******************************************/

// Quantumult X 配置说明：
/*
[MITM]
hostname = *.napi.ithome.com

[rewrite_local]
# 获取 Token（第一次使用，获取后可禁用）
# 触发方式：在 IT之家 App 内手动点击一次“签到”
^https?:\/\/napi\.ithome\.com/api/usersign/sign url script-request-header https://raw.githubusercontent.com/chiheye/qxjs/refs/heads/main/ithome.js

[task_local]
# 每天 9 点执行签到
0 9 * * * ithome_sign.js, tag=ITHome签到, img-url=https://raw.githubusercontent.com/Orz-3/mini/master/Color/ithome.png, enabled=true
*/

const $ = new Env("ITHome签到");

const SIGN_API = "https://napi.ithome.com/api/usersign/sign";
const TOKEN_KEY = "ithome_token";

const isRequest = typeof $request !== "undefined";

if (isRequest) {
    // ====================== 获取 Token (Rewrite) ======================
    // 由于抓包显示 Token 在 URL 参数 userHash 中，我们优先从 URL 提取
    let token = "";
    
    if ($request.url) {
        const urlMatch = $request.url.match(/userHash=([^&]+)/);
        if (urlMatch && urlMatch[1]) {
            // 将类似 Bearer%20xxx 解码为 Bearer xxx
            token = decodeURIComponent(urlMatch[1]);
        }
    }
    
    // 兼容逻辑：如果 URL 没找到，尝试从请求头找
    if (!token && $request.headers) {
        const headers = $request.headers;
        token = headers["Authorization"] || headers["authorization"];
    }

    if (token && token.startsWith("Bearer")) {
        $.setdata(token, TOKEN_KEY);
        $.msg("ITHome 签到", "✅ Token 获取成功", "已保存，可以去 QX 禁用获取 Token 的 Rewrite 规则了");
        console.log(`✅ ITHome Token 已保存: ${token}`);
    }
    $.done(); 
} else {
    // ====================== 执行签到 (Task) ======================
    const token = $.getdata(TOKEN_KEY);

    if (!token) {
        $.msg("ITHome 签到", "❌ 未找到 Token", "请开启 Rewrite 并在 App 内手动签到一次来获取");
        $.done();
    } else {
        // 根据抓包数据，构造带 userHash 的 URL
        const url = `${SIGN_API}?userHash=${encodeURIComponent(token)}`;

        // 完全按照抓包提供的 headers 构造
        const headers = {
            "Accept-Encoding": "gzip, deflate, br",
            "Accept": "*/*",
            "Connection": "keep-alive",
            "Content-Type": "application/x-www-form-urlencoded",
            "Host": "napi.ithome.com",
            "User-Agent": "ITHomeClient/9.31 (iPhone; iOS 18.3.2; Scale/3.00)",
            "Accept-Language": "en-US;q=1, zh-Hans-US;q=0.9"
        };

        $.get({ url, headers }, (err, resp, data) => {
            if (err) {
                $.msg("ITHome 签到", "❌ 请求失败", err);
                $.done();
                return;
            }

            try {
                const body = JSON.parse(data);
                
                // 根据新的 JSON 响应体格式进行解析
                if (body.ok === 1 || body.title === "签到成功") {
                    // 提取金币奖励
                    const reward = (body.message && body.message["签到奖励"]) ? body.message["签到奖励"] : "今日签到完成";
                    const totalDays = body.cdays ? `已连续签到 ${body.cdays} 天` : "";
                    
                    $.msg("ITHome 签到", `🎉 ${body.title || "签到成功"}`, `${reward}\n${totalDays}`);
                } else if (/已经签到/.test(JSON.stringify(body))) {
                    $.msg("ITHome 签到", "⚠️ 今日已签到", "请勿重复签到");
                } else {
                    $.msg("ITHome 签到", "⚠️ 签到提示", JSON.stringify(body));
                }
            } catch (e) {
                $.msg("ITHome 签到", "❌ 响应解析失败", data);
                console.log(`❌ 响应内容: ${data}`);
            }
            
            $.done();
        });
    }
}

// ====================== Quantumult X Env ======================
function Env(name) {
    this.name = name;
    this.getdata = (key) => $prefs.valueForKey(key);
    this.setdata = (val, key) => $prefs.setValueForKey(val, key);
    this.msg = (title, subtitle, body) => $notify(title, subtitle, body);
    this.get = (option, callback) => {
        $task.fetch(option).then(
            response => callback(null, response, response.body),
            err => callback(err.error || "请求网络异常", null, null)
        );
    };
    this.done = (val = {}) => $done(val);
}
