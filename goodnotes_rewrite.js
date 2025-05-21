/*
Goodnotes 订阅请求重写脚本
最后更新：2025.5.19 23:15

[rewrite_local]
^https:\/\/isi\.csan\.goodnotes.*\/v1\/subscribers\/[a-f0-9\-]{36}$ url script-request-header https://raw.githubusercontent.com/chiheye/qxjs/refs/heads/main/goodnotes_headers.js

[MITM]
hostname = isi.csan.goodnotes.com,goodenotes6.lovebabyforever.workers.dev
*/



const urlPattern = /^https:\/\/isi\.csan\.goodnotes.*\/v1\/subscribers\/[a-f0-9\-]{36}$/;
const targetUrl = "https://goodenotes6.lovebabyforever.workers.dev/";
const targetHost = "goodenotes6.lovebabyforever.workers.dev";

if (urlPattern.test($request.url)) {
    // 修改 Host 头部
    let headers = $request.headers;
    headers['Host'] = targetHost;

    // 返回重定向 URL 和修改后的头部
    $done({
        url: targetUrl,
        headers: headers
    });
} else {
    // 不匹配时，继续原始请求
    $done({});
}