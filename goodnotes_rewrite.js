/*
Goodnotes 订阅请求重写脚本
最后更新：2025.5.19 23:15

[rewrite_local]
^https:\/\/goodenotes6\.lovebabyforever\.workers\.dev\/ url script-request-header https://raw.githubusercontent.com/chiheye/qxjs/refs/heads/main/goodnotes_headers.js

[MITM]
hostname = %APPEND% isi.csan.goodnotes.com,goodenotes6.lovebabyforever.workers.dev


*/

const originalHeaders = $request.headers;
const targetHost = 'goodenotes6.lovebabyforever.workers.dev';
// const originalUrl = $request.url;

// Quantumult X Rewrite Script
// 用于重定向特定的 Goodnotes 请求

// 定义需要匹配的 URL 正则表达式
const urlPattern = /^https:\/\/isi\.csan\.goodnotes.*\/v1\/subscribers\/[a-f0-9\-]{36}$/;

// 检查当前请求的 URL 是否匹配模式
if (urlPattern.test($request.url)) {
    // 如果匹配，将请求重定向到新的 URL
    $done({ url: "https://goodenotes6.lovebabyforever.workers.dev/" });
} else {
    // 如果不匹配，继续处理原始请求
    $done({});
}

//修改请求的Url
//const url = originalUrl.replace(/^https:\/\/isi\.csan\.goodnotes.*\/v1\/subscribers\/[a-f0-9\-]{36}$/, `https://${targetHost}`);


// 修改 Host 头
originalHeaders['Host'] = targetHost;

// 返回修改后的请求
$done({ headers: originalHeaders });