/************************************
极狐签到脚本
************************
QuantumultX 远程脚本配置:
************************  
[rewrite_local]
# 获取arcfoxCookie
^https:\/\/mg\.arcfox\.cn(/[\w-]+/public/[\w-]+\?) url script-request-header https://raw.githubusercontent.com/chiheye/qxjs/main/arcfoxqd.js
[mitm] 
hostname= mg.arcfox.cn
************************************/

const userInfoUrl = 'https://mg.arcfox.cn/user/public/account/getUserInfo?';
const method = 'GET';

if ($request && $request.headers) {
    // 自动获取并保存Cookie和请求参数
    getCookieAndHeaders();
    $done({});
} else {
    // 获取用户信息
    getUserInfo();
}

function getCookieAndHeaders() {
    const urlParts = $request.url.split('?'); // 获取URL的两部分：基础部分和参数部分
    const urlParams = urlParts[1] || ''; // 参数部分
    const queryParams = new URLSearchParams(urlParams); // 使用 URLSearchParams 解析参数

    // 提取各个参数
    const appkey = queryParams.get('appkey');
    const nonce = queryParams.get('nonce');
    const sign = queryParams.get('sign');
    const signt = queryParams.get('signt');
    const token = queryParams.get('token');

    // 输出参数到控制台（可以删除）
    console.log('URL参数：', { appkey, nonce, sign, signt, token });

    const headers = $request.headers;

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

    // 保存请求头
    $prefs.setValueForKey(JSON.stringify(necessaryHeaders), 'arcfox_headers');
    console.log('请求头参数保存成功：' + JSON.stringify(necessaryHeaders));

    // 保存各个参数
    $prefs.setValueForKey(appkey, 'arcfox_appkey');
    $prefs.setValueForKey(nonce, 'arcfox_nonce');
    $prefs.setValueForKey(sign, 'arcfox_sign');
    $prefs.setValueForKey(signt, 'arcfox_signt');
    $prefs.setValueForKey(token, 'arcfox_token');
    
    console.log('URL参数保存成功：' + JSON.stringify({ appkey, nonce, sign, signt, token }));

    $notify("极狐", "请求头和参数保存成功", JSON.stringify({ appkey, nonce, sign, signt, token }));

    $done();  // 结束脚本
}

function getUserInfo() {
    // 从存储中读取必要的请求头
    const necessaryHeaders = JSON.parse($prefs.valueForKey('arcfox_headers'));

    const appkey = $prefs.valueForKey('arcfox_appkey');
    const nonce = $prefs.valueForKey('arcfox_nonce');
    const sign = $prefs.valueForKey('arcfox_sign');
    const signt = $prefs.valueForKey('arcfox_signt');
    const token = $prefs.valueForKey('arcfox_token');

    const requestUrl = `${userInfoUrl}&appkey=${appkey}&nonce=${nonce}&sign=${sign}&signt=${signt}&token=${token}`;

    console.log('即将发送的请求 URL：' + requestUrl);

    const request = {
        url: requestUrl,
        method: method,
        headers: necessaryHeaders, // 使用正确的 headers
        timeout: 10000 // 设置请求超时为10秒
    };

    $task.fetch(request).then(response => {
        console.log('请求完成，状态码：' + response.statusCode);
        console.log('响应体：' + (response.body || '空响应体'));

        if (response.statusCode === 200 && response.body) {
            try {
                const data = JSON.parse(response.body);
                console.log('解析后的数据：' + JSON.stringify(data));

                if (data && data.data && data.data.nickname) {
                    console.log('用户名称获取成功：' + data.data.nickname);
                    $notify("极狐", "用户名称获取成功", "昵称：" + data.data.nickname);
                } else {
                    console.log('用户名称获取失败，响应数据中没有找到nickname字段');
                    $notify("极狐", "用户名称获取失败", "未能找到昵称信息，请检查响应数据。");
                }
            } catch (error) {
                console.log('JSON 解析失败：' + error.message);
                $notify("极狐", "用户信息获取失败", "响应数据解析错误：" + error.message);
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

