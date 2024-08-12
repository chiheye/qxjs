[rewrite_local]
# 拦截指定请求并提取Cookie
^https:\/\/mg\.arcfox\.cn\/user\/public\/account\/getUserInfo url script-response-header https://raw.githubusercontent.com/chiheye/qxjs/main/get_arcfoxcookie.js

[mitm]
hostname=mg.arcfox.cn




let url = $request.url;
let method = $request.method;
let headers = $request.headers;

if (url.includes("mg.arcfox.cn/user/public/account/getUserInfo") && method === "GET") {
  let cookie = headers["Cookie"];
  let user_token = headers["token"];

  if (cookie) {
    $prefs.setValueForKey(cookie, "arcfox_cookie");
    $prefs.setValueForKey(user_token, "arcfox_token");
    $notify("Cookie获取成功", "Cookie和Token已成功保存", "");
  }
  $done();
