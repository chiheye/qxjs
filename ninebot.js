/**
 * @name         九号出行签到
 * @description  自动签到领N币Token 抓取
 * @version      2.0.0
 * 
 * * === Quantumult X 配置 ===
 * * [rewrite_local]
 * ^https:\/\/cn-cbu-gateway\.ninebot\.com\/portal\/api\/user-sign\/.* url script-request-header https://raw.githubusercontent.com/chiheye/qxjs/refs/heads/main/ninebot.js
 * * [task_local]
 * 0 8 * * * ninebot.js, tag=九号出行签到, img-url=https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Car.png, enabled=true
 * * [mitm]
 * hostname = cn-cbu-gateway.ninebot.com
 */

const CACHE_KEY = "Ninebot.Accounts";
const BASE_URL = "https://cn-cbu-gateway.ninebot.com";

// 完美契合你抓包的请求头
function getHeaders(token, deviceId) {
    return {
        "Accept": "application/json, text/plain, */*",
        "Authorization": token,
        "Content-Type": "application/json",
        "device_id": deviceId,
        "language": "zh",
        "sys_language": "zh-CN",
        "platform": "h5",
        "Origin": "https://h5-bj.ninebot.com",
        "Referer": "https://h5-bj.ninebot.com/",
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 18_3_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Segway v6"
    };
}

// 解析本地存储的账号格式 (deviceId:token;deviceId:token)
function parseAccounts(dataStr) {
    if (!dataStr) return [];
    return dataStr.split(";").map(s => s.trim()).filter(Boolean).map(s => {
        const idx = s.indexOf(":");
        return idx < 0 ? null : { deviceId: s.substring(0, idx), token: s.substring(idx + 1) };
    }).filter(Boolean);
}

// 保存提取到的账号 Token
function saveAccount(deviceId, token) {
    let accountsStr = $prefs.valueForKey(CACHE_KEY) || "";
    let accounts = accountsStr.split(";").map(s => s.trim()).filter(Boolean);
    const newRecord = `${deviceId}:${token}`;
    const index = accounts.findIndex(a => a.startsWith(deviceId + ":"));
    if (index >= 0) {
        accounts[index] = newRecord; // 更新老 Token
    } else {
        accounts.push(newRecord); // 增加新账号
    }
    $prefs.setValueForKey(accounts.join(";"), CACHE_KEY);
}

// ---------------- 抓取逻辑 (Rewrite) ----------------
if (typeof $request !== "undefined") {
    if ($request.url.includes("user-sign")) {
        const headers = $request.headers;
        // 兼容请求头大小写差异
        const getHeader = (key) => headers[key] || headers[key.toLowerCase()] || "";
        const token = getHeader("Authorization") || getHeader("authorization");
        const deviceId = getHeader("device_id") || getHeader("device-id") || getHeader("Device_Id");

        if (token && deviceId) {
            const accounts = parseAccounts($prefs.valueForKey(CACHE_KEY));
            const exist = accounts.find(a => a.deviceId === deviceId);
            
            // 如果本地没有，或者 Token 发生了变化才进行更新并弹窗，防打扰
            if (!exist || exist.token !== token) {
                saveAccount(deviceId, token);
                $notify("九号出行 签到", "🎉 获取成功", exist ? "Token 已更新" : "Token 已持久化保存");
            }
        } else {
            console.log("[Ninebot] 抓取失败：缺少 Authorization 或 device_id");
        }
    }
    $done({});
} 
// ---------------- 签到逻辑 (Task) ----------------
else {
    (async () => {
        const accounts = parseAccounts($prefs.valueForKey(CACHE_KEY));
        if (accounts.length === 0) {
            $notify("九号出行 签到", "⚠️ 错误", "未配置账号，请打开 App 签到页抓取 Token");
            $done({});
            return;
        }

        let results = [];
        for (const acc of accounts) {
            try {
                let msg = await doSign(acc);
                results.push(msg);
            } catch (e) {
                console.log("[Ninebot] 执行报错: " + e);
                results.push(`账号执行失败`);
            }
        }
        $notify("九号出行 签到", "", results.join("\n"));
        $done({});
    })();
}

// 查询签到状态接口
function fetchStatus(acc) {
    return new Promise((resolve, reject) => {
        const url = `${BASE_URL}/portal/api/user-sign/v2/status?t=${Date.now()}`;
        const req = { url, headers: getHeaders(acc.token, acc.deviceId) };
        $task.fetch(req).then(response => {
            try {
                resolve(JSON.parse(response.body));
            } catch (e) {
                reject("状态解析失败");
            }
        }, reason => reject(reason.error));
    });
}

// 发起签到接口
function submitSign(acc) {
    return new Promise((resolve, reject) => {
        const url = `${BASE_URL}/portal/api/user-sign/v2/sign`;
        const req = { 
            url, 
            method: "POST", 
            headers: getHeaders(acc.token, acc.deviceId), 
            body: JSON.stringify({ deviceId: acc.deviceId }) 
        };
        $task.fetch(req).then(response => {
            try {
                resolve(JSON.parse(response.body));
            } catch (e) {
                reject("签到返回解析失败");
            }
        }, reason => reject(reason.error));
    });
}

// 主签到流程
async function doSign(acc) {
    // 1. 先查状态
    const statusData = await fetchStatus(acc);
    if (statusData.code !== 0) return statusData.msg || "查询失败";
    
    const data = statusData.data || {};
    const days = data.consecutiveDays || 0;
    
    // 如果返回 1，说明今天已经签过
    if (data.currentSignStatus === 1) {
        return `已签 | 连签 ${days} 天`;
    }

    // 2. 没签过则执行签到
    const signData = await submitSign(acc);
    if (signData.code !== 0) return signData.msg || "签到接口失败";

    // 3. 解析获得的奖励
    const rewards = (signData.data?.rewardList || [])
        .map(r => r.rewardValue ? `+${r.rewardValue} N币` : "")
        .filter(Boolean).join(" ");
    
    // 4. 再查一次状态以获取最新的连签天数
    const newStatus = await fetchStatus(acc);
    const newDays = newStatus.data?.consecutiveDays || (days + 1);

    return `连签 ${newDays} 天${rewards ? ` | ${rewards}` : ""} | 成功`;
}
