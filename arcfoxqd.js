/************************************
极狐签到脚本
************************
QuantumultX 远程脚本配置:
************************  
[rewrite_local]
# 获取arcfoxCookie
^https:\/\/mg\.arcfox\.cn\/arcfox-brand\/public\/buriedPoint? url script-request-header https://raw.githubusercontent.com/chiheye/qxjs/main/arcfoxqd.js

[mitm] 
hostname= mg.arcfox.cn
************************************/

// 这个脚本将捕获所有响应头并提取Set-Cookie

const headers = $response.headers || {};

// 检查响应头是否包含Set-Cookie
const setCookie = headers['Set-Cookie'] || headers['set-cookie'];

if (setCookie) {
    console.log('Set-Cookie:', setCookie);

    // 发送通知（可选）
    $notify('Cookie获取成功', '', `Set-Cookie: ${setCookie}`);
} else {
    console.log('没有找到Set-Cookie header');
}

$done({});  // 完成处理

