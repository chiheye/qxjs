/******************************************
 * @name ITHome 每日签到
 * @author chiheye
 * @update 2026.07.15
 * @version 1.1
 ******************************************/

// Quantumult X 配置说明：
/*
[MITM]
hostname = napi.ithome.com, my.ruanmei.com

[rewrite_local]
# 获取 Token（第一次使用，获取后可禁用）
^https?://(napi\.ithome\.com|my\.ruanmei\.com)/api/ url script-request-header ithome_sign.js

[task_local]
# 每天 9 点执行签到
0 9 * * * ithome_sign.js, tag=ITHome签到, img-url=https://raw.githubusercontent.com/Orz-3/mini/master/Color/ithome.png, enabled=true
*/

const $ = new Env("ITHome签到");

const SIGN_API = "https://napi.ithome.com/api/usersign/sign";
const TOKEN_KEY = "ithome_token";

// 识别当前运行环境：判断是 Rewrite 触发还是 定时任务 触发
const isRequest = typeof $request !== "undefined";

if (isRequest) {
    // ====================== 获取 Token (Rewrite) ======================
    if ($request.headers) {
        const headers = $request.headers;
        // 兼容大小写
        const authorization = headers["Authorization"] || headers["authorization"];
        
        if (authorization) {
            $.setdata(authorization, TOKEN_KEY);
            $.msg("ITHome 签到", "✅ Token 获取成功", "已保存，可以去禁用获取 Token 的 Rewrite 规则了");
            console.log(`✅ ITHome Token 已保存: ${authorization}`);
        }
    }
    $.done(); // 获取完立即结束，避免执行下方签到逻辑
} else {
    // ====================== 执行签到 (Task) ======================
    const token = $.getdata(TOKEN_KEY);

    if (!token) {
        $.msg("ITHome 签到", "❌ 未找到 Token", "请打开 ITHome App 登录并刷新页面，获取 Token 后重新触发");
        $.done();
    } else {
        const url = `${SIGN_API}?userHash=${encodeURIComponent(token)}`;

        const headers = {
            "Accept-Encoding": "gzip, deflate, br",
            "Accept": "*/*",
            "Connection": "keep-alive",
            "Host": "napi.ithome.com",
            "User-Agent": "ITHomeClient/9.31 (iPhone; iOS 18.3.2; Scale/3.00)",
            "Accept-Language": "zh-Hans-CN;q=1",
            "Authorization": token // 补充请求头，部分接口强校验该字段
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
                    $.msg("ITHome 签到", "🎉 签到成功", exp || body.message || "今日签到完成");
                } else {
                    $.msg("ITHome 签到", "⚠️ 签到提示", body.message || "未知状态");
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
