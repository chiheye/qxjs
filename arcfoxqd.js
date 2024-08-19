/*
极狐签到脚本
************************
QuantumultX 远程脚本配置:
************************

[task_local]
# 每天早上8点签到
0 8 * * * https://your.script.url/your_script_name.js, tag=自动签到, enabled=true
    
[rewrite_local]
# 获取arcfoxCookie

https://mg.arcfox.cn/mall-integral/public/integral/syncIntegral url script-request-header https://raw.githubusercontent.com/chiheye/qxjs/main/arcfoxqd.js

[mitm] 

hostname= mg.arcfox.cn


*/



/*
Quantumult X 脚本: Arcfox 自动签到

描述: 每天自动签到获取积分。

使用方法:
1. 第一次运行脚本时会自动获取 `cookie`。
2. 后续运行时将使用获取到的 `cookie` 进行签到。

作者: ChatGPT
*/

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

