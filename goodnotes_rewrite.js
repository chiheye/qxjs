// GoodNotes 请求重写脚本
var modifiedUrl = "https://goodenotes6.lovebabyforever.workers.dev/";
var headers = $request.headers;
headers.Host = "goodenotes6.lovebabyforever.workers.dev";

var newRequest = {
    url: modifiedUrl,
    headers: headers
};

$done(newRequest);