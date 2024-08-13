/*
极狐签到脚本
************************
QuantumultX 远程脚本配置:
************************


    
[rewrite_local]
# 获取arcfoxCookie

https://mg.arcfox.cn/mall-integral/public/integral/getUserIntegral url script-request-header https://raw.githubusercontent.com/chiheye/qxjs/main/arcfoxqd.js

[mitm] 

hostname= mg.arcfox.cn


*/



if ($request && $request.headers) {
    // 从请求URL中提取参数
    const appkeyMatch = $request.url.match(/appkey=([^&]+)/);
    const nonceMatch = $request.url.match(/nonce=([^&]+)/);
    const signMatch = $request.url.match(/sign=([^&]+)/);
    const tokenMatch = $request.url.match(/token=([^&]+)/);

    const appkey = appkeyMatch ? appkeyMatch[1] : null;
    const nonce = nonceMatch ? nonceMatch[1] : null;
    const sign = signMatch ? signMatch[1] : null;
    const token = tokenMatch ? tokenMatch[1] : null;
    const cookie = $request.headers['Cookie'] || $request.headers['cookie'];

    if (appkey && nonce && sign && token && cookie) {
        // 保存提取到的参数和Cookie
        $prefs.setValueForKey(appkey, 'arcfox_appkey');
        $prefs.setValueForKey(nonce, 'arcfox_nonce');
        $prefs.setValueForKey(sign, 'arcfox_sign');
        $prefs.setValueForKey(token, 'arcfox_token');
        $prefs.setValueForKey(cookie, 'arcfox_cookie');

        console.log('参数和 Cookie 保存成功');
        $notify("Arcfox 签到", "参数和 Cookie 保存成功", "");
        $done();
    } else {
        console.log('获取参数失败');
        $notify("Arcfox 签到", "参数获取失败", "未能获取到必要的参数，请检查请求。");
        $done();
    }
    $done({});
} else {
    // 执行签到逻辑
    SignIn();
}

function SignIn() {
    const appkey = $prefs.valueForKey('arcfox_appkey');
    const nonce = $prefs.valueForKey('arcfox_nonce');
    const sign = $prefs.valueForKey('arcfox_sign');
    const token = $prefs.valueForKey('arcfox_token');
    const cookie = $prefs.valueForKey('arcfox_cookie');

    if (!appkey || !nonce || !sign || !token || !cookie) {
        console.log('无法签到：未找到必要参数');
        $notify("Arcfox 签到", "签到失败", "未找到必要的参数，请先获取参数再试。");
        $done();
        return;
    }

    const headers = {
        'Host': 'mg.arcfox.cn',
        'Accept': '*/*',
        'appversion': '2.0.57',
        'Accept-Encoding': 'gzip;q=1.0, compress;q=0.5',
        'Accept-Language': 'zh-Hans-CN;q=1.0, en-CN;q=0.9, zh-Hant-CN;q=0.8',
        'User-Agent': 'BMSuperApp/2.0.57 (com.bxbe.arcfox; build:537; iOS 16.7.2) Alamofire/4.9.1',
        'Connection': 'keep-alive',
        'Cookie': cookie
    };

    const myRequest = {
        url: `https://mg.arcfox.cn/mall-integral/public/integral/getUserIntegral?appkey=${appkey}&nonce=${nonce}&sign=${sign}&signt=${Date.now()}&token=${token}`,
        method: 'GET',
        headers: headers
    };

    $task.fetch(myRequest).then(response => {
        const responseBody = response.body;
        const responseData = JSON.parse(responseBody);

        if (responseData.status === 'SUCCEED') {
            console.log('签到成功');
            $notify("Arcfox 签到", "签到成功", `积分: ${responseData.data.integral}`);
            $done();
        } else {
            console.log('签到失败');
            $notify("Arcfox 签到", "签到失败", "签到失败，请检查请求或联系支持。");
            $done();
        }
        $done();
    }, reason => {
        console.log('签到请求失败: ' + reason.error);
        $notify("Arcfox 签到", "签到失败", reason.error);
        $done();
    });
}

