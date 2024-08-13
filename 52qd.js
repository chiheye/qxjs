/*个人使用*/

const url = 'https://www.52pojie.cn/home.php?mod=task&do=apply&id=2';
const method = 'GET';
let cookie = $prefs.valueForKey('cookie_52pojie'); // 从存储中读取cookie

if (!cookie) {
    // 如果没有cookie，则尝试获取cookie
    console.log('未发现Cookie，尝试获取...');
    // 你需要在请求之前已经通过浏览器登录并手动抓取Cookie，或用其他方式获取
    $notify("52pojie 签到", "签到失败", "未检测到有效的Cookie，请先登录并获取Cookie。");
    $done(); // 终止脚本执行
} else {
    console.log('Cookie获取成功，开始签到...');
}

const headers = {
    'Host': 'www.52pojie.cn',
    'Sec-Fetch-Site': 'none',
    'Cookie': cookie, // 使用从存储中获取的cookie
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1',
    'Sec-Fetch-Mode': 'navigate',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_7_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.50(0x18003237) NetType/WIFI Language/zh_CN',
    'Accept-Language': 'en-US,en;q=0.9'
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
        $notify("52pojie 签到", "签到失败", "您已申请过此任务，请下期再来");
    } else if (responseBody.includes('申请任务成功')) {
        console.log("任务申请成功");
        $notify("52pojie 签到", "签到成功", "任务申请成功！");
    } else {
        console.log("未知状态，返回的数据: " + responseBody);
        $notify("52pojie 签到", "签到异常", "返回的结果无法解析，请检查脚本或联系支持。");
    }
}, reason => {
    console.log("签到请求失败: " + reason.error);
    $notify("52pojie 签到", "签到失败", reason.error);
});
