/*
Goodnotes 订阅请求重写脚本
最后更新：2025.5.19 23:15

[rewrite_local]
^https:\/\/isi\.csan\.goodnotes.*\/v1\/subscribers\/[a-f0-9\-]{36}$ url 302 https://goodenotes6.lovebabyforever.workers.dev
^https:\/\/goodenotes6\.lovebabyforever\.workers\.dev\/ url script-request-header https://raw.githubusercontent.com/chiheye/qxjs/refs/heads/main/goodnotes_headers.js

[MITM]
hostname = %APPEND% isi.csan.goodnotes.com,goodenotes6.lovebabyforever.workers.dev


*/

const originalHeaders = $request.headers;
const targetHost = 'goodenotes6.lovebabyforever.workers.dev';



// 修改 Host 头
originalHeaders['Host'] = targetHost;

// 返回修改后的请求
$done({ headers: originalHeaders });