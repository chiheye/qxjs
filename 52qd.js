const url = 'https://www.52pojie.cn/home.php?mod=task&do=apply&id=2';
const method = 'GET';
const userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_7_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.50(0x18003237) NetType/WIFI Language/zh_CN';

// 判断是否在请求模式下获取 Cookie
if ($request && $request.headers) {
    GetCookie();
    $done({});
} else {
    SignIn();
}

function GetCookie() {
    const TM = $prefs.valueForKey("TIME");
    const CK = $request.headers['Cookie'] || $request.headers['cookie'];
    if (CK && CK.includes('_auth=')) {
        $prefs.setValueForKey(CK, "COOKIE");
        if (!TM || (TM && (Date.now() - TM) / 1000 >= 21600)) {
            $notify("吾爱破解", "", `写入Cookie成功 🎉`);
            $prefs.setValueForKey(Date.now().toString(), "TIME");
        } else {
            console.log("吾爱破解\n写入Cookie成功 🎉");
        }
    } else {
        console.log("吾爱破解\n写入Cookie失败, 关键值缺失");
    }
    $done();
}

function SignIn() {
    const cookie = $prefs.valueForKey("COOKIE");

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
