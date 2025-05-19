/*
Goodnotes 订阅请求重写脚本
最后更新：2025.5.19 23:15

[rewrite_local]
^https:\/\/isi\.csan\.goodnotes.*\/v1\/subscribers\/[a-f0-9\-]{36}$ script-request-header https://raw.githubusercontent.com/chiheye/qxjs/refs/heads/main/goodnotes_rewrite.js

[MITM]
hostname = isi.csan.goodnotes.com, isi.csan.goodnotes.com.*
*/

const url = $request.url;
const headers = $request.headers;
const targetHost = 'goodenotes6.lovebabyforever.workers.dev';

// 检查是否匹配目标 URL
if (/^https:\/\/isi\.csan\.goodnotes.*\/v1\/subscribers\/[a-f0-9\-]{36}$/.test(url)) {
    // 重写 URL，保留路径和参数
    const newUrl = url.replace(/^https:\/\/isi\.csan\.goodnotes.*\/v1\/subscribers\/[a-f0-9\-]{36}$/, 'https://goodenotes6.lovebabyforever.workers.dev');
    
    // 重写 Host 头部
    headers['Host'] = targetHost;
    
    // 调试信息
    $notify('Goodnotes Rewrite', 'URL Matched', `Original: ${url}\nNew: ${newUrl}\nHost: ${targetHost}`);
    
    // 返回修改后的请求
    $done({ url: newUrl, headers });
} else {
    // 不匹配，记录未匹配的 URL 以便调试
    $notify('Goodnotes Rewrite', 'URL Not Matched', `URL: ${url}`);
    $done({});
}