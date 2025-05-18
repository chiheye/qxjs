/*
2025.5.19 23.15



[rewrite_local]﻿ 
^https:\/\/isi\.csan\.goodnotes.*\/v1\/subscribers\/[a-f0-9\-]{36}$ url script-request-header https://raw.githubusercontent.com/chiheye/qxjs/refs/heads/main/goodnotes_rewrite.js
[MITM]
hostname = %APPEND% isi.csan.goodnotes.com.*, isi.csan.goodnotes.com


*/
// GoodNotes 请求重写脚本
var modifiedUrl = "https://goodenotes6.lovebabyforever.workers.dev/";
var headers = $request.headers;
headers.Host = "goodenotes6.lovebabyforever.workers.dev";

var newRequest = {
    url: modifiedUrl,
    headers: headers
};

$done(newRequest);