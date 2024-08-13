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
const url = 'https://mg.arcfox.cn/mall-integral/public/integral/getUserIntegral';

// 请求头字段
const headers = {
    'Host': 'mg.arcfox.cn',
    'Accept': '*/*',
    'appversion': '2.0.57',
    'Accept-Encoding': 'gzip;q=1.0, compress;q=0.5',
    'Accept-Language': 'zh-Hans-CN;q=1.0, en-CN;q=0.9, zh-Hant-CN;q=0.8',
    'User-Agent': 'BMSuperApp/2.0.57 (com.bxbe.arcfox; build:537; iOS 16.7.2) Alamofire/4.9.1',
    'Connection': 'keep-alive'
};

// 获取动态参数和 Cookie 的请求
const fetchParamsAndCookie = () => {
    const paramsUrl = 'https://mg.arcfox.cn/mall-integral/public/integral/getUserIntegralParams'; // 假设存在此 URL 获取动态参数
    $task.fetch({ url: paramsUrl, method: 'GET', headers: headers }).then(response => {
        if (response.statusCode !== 200) {
            console.log('获取动态参数失败');
            $notify("Arcfox 签到", "获取动态参数失败", "请检查请求地址或网络连接");
            $done();
            return;
        }

        const data = JSON.parse(response.body);
        const { appkey, nonce, sign, token } = data;

        // 保存动态参数和 Cookie
        $prefs.setValueForKey(appkey, 'arcfox_appkey');
        $prefs.setValueForKey(nonce, 'arcfox_nonce');
        $prefs.setValueForKey(sign, 'arcfox_sign');
        $prefs.setValueForKey(token, 'arcfox_token');
        $prefs.setValueForKey(response.headers['Set-Cookie'], 'arcfox_cookie');

        console.log('动态参数和 Cookie 保存成功');
        $notify("Arcfox 签到", "动态参数和 Cookie 保存成功", "");
        $done();

        // 执行签到
        SignIn();
    }, reason => {
        console.log('获取动态参数失败: ' + reason.error);
        $notify("Arcfox 签到", "获取动态参数失败", reason.error);
        $done();
    });
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

    const requestHeaders = {
        ...headers,
        'Cookie': cookie
    };

    const myRequest = {
        url: `${url}?appkey=${appkey}&nonce=${nonce}&sign=${sign}&signt=${Date.now()}&token=${token}`,
        method: 'GET',
        headers: requestHeaders
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

// 执行脚本
fetchParamsAndCookie();

