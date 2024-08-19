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
    // 自动获取并保存Cookie
    GetCookie();
    $done({});
} else {
    // 获取用户信息
    GetUserInfo();
}

function GetCookie() {
    const cookie = $request.headers['Cookie'] || $request.headers['cookie'];
    if (cookie) {
        $prefs.setValueForKey(cookie, 'arcfox_cookie');
        console.log('Cookie保存成功：' + cookie);
        $notify("极狐", "Cookie保存成功", "");
    } else {
        console.log('获取Cookie失败');
        $notify("极狐", "Cookie获取失败", "未能获取到Cookie，请检查设置。");
    }
}

function GetUserInfo() {
    const cookie = $prefs.valueForKey('arcfox_cookie');
    if (!cookie) {
        console.log('获取用户信息失败：未找到有效的Cookie');
        $notify("极狐", "获取用户信息失败", "未找到有效的Cookie，请先获取Cookie。");
        return;
    }

    const request = {
        url: userInfoUrl,
        method: method,
        headers: {
            'Cookie': cookie
        }
    };

    $task.fetch(request).then(response => {
        const data = JSON.parse(response.body);
        if (data && data.nickname) {
            console.log('用户名称获取成功：' + data.nickname);
            $notify("极狐", "用户名称获取成功", "昵称：" + data.nickname);
        } else {
            console.log('用户名称获取失败，响应：' + response.body);
            $notify("极狐", "用户名称获取失败", "未能找到昵称信息，请检查响应数据。");
        }
    }, reason => {
        console.log('获取用户信息请求失败：' + reason.error);
        $notify("极狐", "获取用户信息失败", "网络或服务器错误：" + reason.error);
    });
}
