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


const userInfoUrl = 'https://mg.arcfox.cn/user/public/account/getUserInfo?';
const method = 'GET';

if ($request && $request.headers) {
    // 自动获取并保存Cookie和请求参数
    GetCookieAndHeaders();
    $done({});
} else {
    // 获取用户信息
    GetUserInfo();
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
        'aid': headers['aid'],
        'Cookie': headers['Cookie']
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

function GetUserInfo() {
    const cookie = $prefs.valueForKey('arcfox_cookie');
    const headers = JSON.parse($prefs.valueForKey('arcfox_headers'));

    if (!cookie) {
        console.log('获取用户信息失败：未找到有效的Cookie');
        $notify("极狐", "获取用户信息失败", "未找到有效的Cookie，请先获取Cookie。");
        $done();  // 结束脚本
        return;
    }

    //console.log('开始获取用户信息，URL：' + userInfoUrl);
    //console.log('请求头参数：' + JSON.stringify(headers));

    const GetUserbody = ``;

    const request = {
        url: userInfoUrl,
        method: method,
        headers: headers,
        GetUserbody: body,
        timeout: 10000 // 设置请求超时为10秒
    };

    $task.fetch(request).then(response => {
        console.log('LOG'+'\n'+'请求完成，状态码：' + response.statusCode);
        console.log('原始响应内容：' + response.body);

        if (response.statusCode === 200) {
            // 检查响应的类型
            console.log('响应类型：' + typeof response.body);
            
            // 如果 response.body 是 Buffer 对象或其他类型，请转换为字符串
            const responseBody = typeof response.body === 'string' ? response.body : String(response.body);
            console.log('转换后的响应内容：' + responseBody);

            try {
                const data = JSON.parse(responseBody);
                console.log('解析后的数据：' + JSON.stringify(data));
                if (data && data.data && data.data.nickname) {
                    console.log('用户名称获取成功：' + data.data.nickname);
                    $notify("极狐", "用户名称获取成功", "昵称：" + data.data.nickname);
                } else {
                    console.log('用户名称获取失败，响应数据中没有找到nickname字段');
                    $notify("极狐", "用户名称获取失败", "未能找到昵称信息，请检查响应数据。");
                }
            } catch (error) {
                console.log('JSON 解析失败：' + error);
                $notify("极狐", "用户信息获取失败", "响应数据解析错误：" + error);
            }
        } else {
            console.log('请求失败，状态码：' + response.statusCode);
            $notify("极狐", "获取用户信息失败", "状态码：" + response.statusCode);
        }
        $done();  // 结束脚本
    }, reason => {
        console.log('获取用户信息请求失败：' + reason.error);
        $notify("极狐", "获取用户信息失败", "网络或服务器错误：" + reason.error);
        $done();  // 结束脚本
    });
}
