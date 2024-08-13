/*
吾爱破解签到脚本
************************
QuantumultX 远程脚本配置:
************************


    
[rewrite_local]
# 获取Cookie
https:\/\/www\.52pojie\.cn\/home\.php\? url script-request-header https://raw.githubusercontent.com/NobyDa/Script/master/52pojie-DailyBonus/52pojie.js

[mitm] 
hostname= www.52pojie.cn


*/
const url = 'https://www.52pojie.cn/home.php?mod=task&do=apply&id=2';
const method = 'GET';
const userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_7_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.50(0x18003237) NetType/WIFI Language/zh_CN';

if ($request && $request.headers) {
    // 自动获取并保存Cookie
    GetCookie();
    $done({});
} else {
    // 执行签到
    SignIn();
}

function GetCookie() {
    const cookie = $request.headers['Cookie'] || $request.headers['cookie'];
    if (cookie) {
        $prefs.setValueForKey(cookie, '52pojie_cookie');
        console.log('Cookie保存成功：' + cookie);
        $notify("吾爱破解", "Cookie保存成功", "");
    } else {
        console.log('获取Cookie失败');
        $notify("吾爱破解", "Cookie获取失败", "未能获取到Cookie，请检查设置。");
    }
}

function SignIn() {
    const cookie = $prefs.valueForKey('52pojie_cookie');

    if (!cookie) {
        console.log('无法签到：未找到cookie');
        $notify("吾爱破解", "签到失败", "未找到Cookie，请先获取Cookie再试。");
        $done();
        return;
    }

    const headers = {
        'Host': 'www.52pojie.cn',
        'Sec-Fetch-Site': 'none',
        'Cookie': cookie,
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Mode': 'navigate',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'User-Agent': userAgent,
        'Accept-Language': 'zh-CN,zh;q=0.9'
    };

    const myRequest = {
        url: url,
        method: method,
        headers: headers
    };

    $task.fetch(myRequest).then(response => {
        const responseBody = response.body;

        if (responseBody.includes('抱歉，本期您已申请过此任务，请下期再来')) {
            console.log("您已申请过此任务");
            $notify("吾爱破解", "签到失败", "您已申请过此任务，请下期再来");
        } else if (responseBody.includes('申请任务成功')) {
            console.log("任务申请成功");
            $notify("吾爱破解", "签到成功", "任务申请成功！");
        } else {
            console.log("未知状态，返回的数据: " + responseBody);
            $notify("吾爱破解", "签到异常", "返回的结果无法解析，请检查脚本或联系支持。");
        }
    }, reason => {
        console.log("签到请求失败: " + reason.error);
        $notify("吾爱破解", "签到失败", reason.error);
    });
}
