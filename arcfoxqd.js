/************************************
极狐签到脚本
************************
QuantumultX 远程脚本配置:
************************  
[rewrite_local]
# 获取arcfoxCookie
//^https:\/\/mg\.arcfox\.cn\/arcfox-brand\/public\/buriedPoint? url script-request-header https://raw.githubusercontent.com/chiheye/qxjs/main/arcfoxqd.js
^https:\/\/mg\.arcfox\.cn\/update-center\/checkVersion? url script-request-header https://raw.githubusercontent.com/chiheye/qxjs/main/arcfoxqd.js
[mitm] 
hostname= mg.arcfox.cn
************************************/


if ($request && $request.headers) {
    // 自动获取并保存Cookie和请求参数
    GetCookieAndHeaders();
    $done({});
}

function GetCookieAndHeaders() {
    const urlParams = $request.url.split('?')[1]; // 获取URL中的参数部分
    const headers = $request.headers;
    const cookie = headers['Cookie'] || headers['cookie'];

    const necessaryHeaders = {
        'Connection': headers['Connection'],
        'Accept-Encoding': headers['Accept-Encoding'],
        'appcode': headers['appcode'],
        'mobile': headers['mobile'],
        'vin': headers['vin'],
        'appversion': headers['appversion'],
        'deviceId': headers['deviceId'],
        'User-Agent': headers['User-Agent'],
        'platform': headers['platform'],
        'ip': headers['ip'],
        'deviceModel': headers['deviceModel'],
        'Host': headers['Host'],
        'Accept-Language': headers['Accept-Language'],
        'Accept': headers['Accept'],
        'aid': headers['aid']
    };

    if (cookie) {
        $prefs.setValueForKey(cookie, 'arcfox_cookie');
        console.log('Cookie保存成功：' + cookie);
        $notify("极狐", "Cookie保存成功", ""); 
    } else {
        console.log('获取Cookie失败');
        $notify("极狐", "Cookie获取失败", "未能获取到Cookie，请检查设置。");
    }

    $prefs.setValueForKey(JSON.stringify(necessaryHeaders), 'arcfox_headers');
    console.log('请求头参数保存成功：' + JSON.stringify(necessaryHeaders));
    $prefs.setValueForKey(urlParams, 'arcfox_url_params');
    console.log('URL参数保存成功：' + urlParams);

    $notify("极狐", "请求头和参数保存成功", "");
    $done();  // 结束脚本
}
