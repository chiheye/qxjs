/*
2025.5.19 23.15



[rewrite_local]﻿
^https:\/\/isi\.csan\.goodnotes.*\/v1\/subscribers\/[a-f0-9\-]{36}$ script-request-header https://raw.githubusercontent.com/chiheye/qxjs/refs/heads/main/goodnotes_rewrite.js
^https:\/\/isi\.csan\.goodnotes.*\/v1\/subscribers\/[a-f0-9\-]{36}$ script-request-body https://raw.githubusercontent.com/chiheye/qxjs/refs/heads/main/goodnotes_rewrite.js

[MITM]
hostname = %APPEND% isi.csan.goodnotes.com.*, isi.csan.goodnotes.com


*/



// goodnotes_rewrite.js
const url = $request.url;
const headers = $request.headers;
const targetHost = 'goodenotes6.lovebabyforever.workers.dev';
const targetUrl = 'https://goodenotes6.lovebabyforever.workers.dev/';

// 检查是否匹配目标 URL
if (/^https:\/\/isi\.csan\.goodnotes.*\/v1\/subscribers\/[a-f0-9\-]{36}$/.test(url)) {
    // 重写 URL
    let newUrl = targetUrl;
    
    // 重写 Host 头部
    headers['Host'] = targetHost;
    
    // 返回修改后的请求
    $done({
        url: newUrl,
        headers: headers
    });
} else {
    // 不匹配，直接返回原请求
    $done({});
}