/************************************
极狐签到脚本
************************
QuantumultX 远程脚本配置:
************************  
[rewrite_local]
# 获取arcfoxCookie
^https:\/\/mg\.arcfox\.cn\/mall-integral\/public\/integral url script-request-header https://raw.githubusercontent.com/chiheye/qxjs/main/arcfoxqd.js
[mitm] 
hostname= mg.arcfox.cn
************************************/

// 这个脚本将捕获所有响应头并提取Set-Cookie

const url = $request.url;  // 获取请求的URL
const method = $request.method;
const headers = $response.headers || {};

// 检查响应头是否包含Set-Cookie
const setCookie = headers['Set-Cookie'] || headers['set-cookie'];
if (setCookie) {
    console.log('URL:', url);
    console.log('Set-Cookie:', setCookie);

    // 发送通知（可选）
    $notify('Cookie获取成功', `URL: ${url}`, `Set-Cookie: ${setCookie}`);
} else {
    console.log('没有找到Set-Cookie header');
}

$done({});  // 完成处理

