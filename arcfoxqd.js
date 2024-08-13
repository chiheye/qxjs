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
const requestUrl = 'https://mg.arcfox.cn/mall-integral/public/integral/getUserIntegral';
const method = 'GET';

// 首先从特定 URL 抓取动态参数
const paramUrl = 'https://mg.arcfox.cn/mall-integral/getParams';  // 假设的参数获取 URL

function fetchParams() {
    const headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Connection': 'keep-alive'
    };

    $task.fetch({ url: paramUrl, method: method, headers: headers }).then(response => {
        const responseBody = response.body;
        const json = JSON.parse(responseBody);

        if (json && json.data) {
            const { appkey, nonce, sign, token } = json.data;

            if (appkey && nonce && sign && token) {
                console.log(`获取到参数：appkey=${appkey}, nonce=${nonce}, sign=${sign}, token=${token}`);
                autoCheckIn(appkey, nonce, sign, token);
            } else {
                console.log('未能获取到所有必需的参数');
                $notify("ArcFox 签到", "获取参数失败", "请检查获取参数的 URL 或服务是否正常。");
                $done();
            }
        } else {
            console.log('获取参数失败，返回数据不合法');
            $notify("ArcFox 签到", "获取参数失败", "返回的数据不合法，请检查脚本或联系支持。");
            $done();
        }
    }, reason => {
        console.log('获取参数请求失败: ' + reason.error);
        $notify("ArcFox 签到", "获取参数失败", reason.error);
        $done();
    });
}

function autoCheckIn(appkey, nonce, sign, token) {
    const url = `${requestUrl}?appkey=${appkey}&nonce=${nonce}&sign=${sign}&signt=${Date.now()}&token=${token}`;

    const headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Connection': 'keep-alive'
    };

    $task.fetch({ url: url, method: method, headers: headers }).then(response => {
        const responseBody = response.body;
        const json = JSON.parse(responseBody);

        if (json.status === 'SUCCEED') {
            console.log('签到成功：' + responseBody);
            $notify("ArcFox 签到", "签到成功", "签到成功！");
        } else {
            console.log('签到失败：' + responseBody);
            $notify("ArcFox 签到", "签到失败", "签到失败，返回数据：" + responseBody);
        }
        $done();
    }, reason => {
        console.log('签到请求失败: ' + reason.error);
        $notify("ArcFox 签到", "签到失败", reason.error);
        $done();
    });
}

// 启动脚本
fetchParams();
