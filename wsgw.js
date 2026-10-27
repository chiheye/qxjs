/**
 * 网上国网 - 自动截取 Token / Cookie 脚本 (Quantumult X)
 */
const reqHeaders = $request.headers;
const token = reqHeaders["token"] || reqHeaders["Token"];
const accToken = reqHeaders["acctoken"] || reqHeaders["Acctoken"];
const authorization = reqHeaders["Authorization"] || reqHeaders["authorization"];

let updated = false;

if (token) {
  $prefs.setValueForKey(token, "wsgw_token");
  updated = true;
}

if (accToken) {
  $prefs.setValueForKey(accToken, "wsgw_acctoken");
  updated = true;
}

if (authorization) {
  $prefs.setValueForKey(authorization, "wsgw_authorization");
  updated = true;
}

// 检查请求体或 URL 中是否包含 userId / 户号，若有则一并保存
if ($request.body) {
  try {
    const bodyObj = JSON.parse($request.body);
    const userId = bodyObj?.quInfo?.userId || bodyObj?.userId || bodyObj?.data?.acctId;
    if (userId) {
      $prefs.setValueForKey(String(userId), "wsgw_userid");
    }
  } catch (e) {}
}

if (updated) {
  console.log("[网上国网] 成功捕获并更新凭证！");
  $notify("网上国网", "凭证抓取成功", "已更新 Token 与认证信息，可关闭重写开关或正常使用查询脚本。");
}

$done({});
