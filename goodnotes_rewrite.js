/*
2025.5.19 23.15



[rewrite_local]﻿ 
^https:\/\/isi\.csan\.goodnotes.*\/v1\/subscribers\/[a-f0-9\-]{36}$ url script-request-header https://raw.githubusercontent.com/chiheye/qxjs/refs/heads/main/goodnotes_rewrite.js
[MITM]
hostname = %APPEND% isi.csan.goodnotes.com.*, isi.csan.goodnotes.com


*/



// goodnotes_host_rewrite.js
let url = $request.url.replace(
    /^https:\/\/isi\.csan\.goodnotes.*\/v1\/subscribers\/([a-f0-9\-]{36})$/,
    "https://goodenotes6.lovebabyforever.workers.dev/v1/subscribers/$1"
);
let headers = Object.assign({}, $request.headers, {
    Host: "goodenotes6.lovebabyforever.workers.dev"
});
$done({ url, headers });