/************************************
极狐签到脚本
************************
QuantumultX 远程脚本配置:
************************  
[rewrite_local]
# 获取arcfoxCookie
//^https:\/\/mg\.arcfox\.cn\/arcfox-brand\/public\/buriedPoint? url script-request-header https://raw.githubusercontent.com/chiheye/qxjs/main/arcfoxqd.js
^https:\/\/mg\.arcfox\.cn url script-request-header https://raw.githubusercontent.com/chiheye/qxjs/main/arcfoxqd.js
[mitm] 
hostname= mg.arcfox.cn
************************************/

// 这个脚本将捕获所有响应头并提取Set-Cookie

let cookie = "";
let cookieCaptured = false;

// 捕获响应头中的Set-Cookie
$network.addEventListener("response", (event) => {
  const { response } = event;
  const cookies = response.headers["Set-Cookie"] || [];
  cookies.forEach((item) => {
    if (item.includes(cookieKey)) {
      cookie = item.split(";")[0];
      cookieCaptured = true;
      console.log("Captured cookie:", cookie);
    }
  });

  // 提示Cookie获取失败
  if (!cookieCaptured) {
    console.log("Failed to capture cookie");
  }
});

$done({});  // 完成处理

