/*
Goodnotes 订阅请求重写脚本
最后更新：2025.5.19 23:15

[rewrite_local]
^https:\/\/isi\.csan\.goodnotes.*\/v1\/subscribers\/[a-f0-9\-]{36}$ url script-request-header https://raw.githubusercontent.com/chiheye/qxjs/refs/heads/main/goodnotes_headers.js

[MITM]
hostname = isi.csan.goodnotes.com
*/



const urlPattern = /^https:\/\/isi\.csan\.goodnotes.*\/v1\/subscribers\/[a-f0-9\-]{36}$/;
const targetUrl = "https://raw.githubusercontent.com/chiheye/qxjs/refs/heads/main/goodenotes.json";
const targetHost = "raw.githubusercontent.com/chiheye/qxjs/refs/heads/main/goodenotes.json";

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
