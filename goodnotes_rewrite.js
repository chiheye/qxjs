/*
Goodnotes 订阅请求重写脚本
最后更新：2025.5.19 23:15

[rewrite_local]
^https:\/\/isi\.csan\.goodnotes.*\/v1\/subscribers\/[a-f0-9\-]{36}$\/* url script-request-header https://raw.githubusercontent.com/chiheye/qxjs/refs/heads/main/goodnotes_rewrite.js

[MITM]
hostname = %APPEND% isi.csan.goodnotes.com.*, isi.csan.goodnotes.com
*/

const url = $request.url;
const headers = $request.headers;
const targetHost = 'goodenotes6.lovebabyforever.workers.dev';


// 构建新URL
const url = `https://${targetHost}`;

// 修改Host头
headers['Host'] = targetHost;

// 仅在调试模式下显示通知
const debug = true;
if (debug) {
  $notify('Goodnotes Rewrite', 'Success', `Original: ${url}\nNew: ${newUrl}`);
}

// 返回修改后的请求
$done({ url: newUrl, headers });
