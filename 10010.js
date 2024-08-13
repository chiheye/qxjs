/*
吾爱破解签到脚本
************************
QuantumultX 远程脚本配置:
************************


    
[rewrite_local]
# 获取10010Cookie
https:\/\/activity\.10010\.com\/sixPalaceGridTurntableLottery\/signin\/daySign url script-request-header https://raw.githubusercontent.com/chiheye/qxjs/main/10010.js

[mitm] 
hostname= activity.10010.com
*/

// 获取并保存 Cookie
function GetCookie() {
    const cookie = $request.headers['Cookie'] || $request.headers['cookie'];
    if (cookie) {
        console.log('收到的请求头：', JSON.stringify($request.headers));
        console.log('Cookie：' + cookie);
        $prefs.setValueForKey(cookie, '10010_cookie');
        $notify("中国联通", "Cookie保存成功", "Cookie已保存，可以进行签到操作。");
    } else {
        console.log('获取Cookie失败');
        $notify("中国联通", "Cookie获取失败", "未能获取到Cookie，请检查设置。");
    }
    $done();
}

// 调用获取 Cookie 脚本
if ($request) {
    GetCookie(); // 获取 Cookie 的情况下调用
} else {
    $notify("中国联通", "错误", "脚本未在请求中运行。");
    $done();
}


// 签到脚本
function SignIn() {
    const url = "https://activity.10010.com/sixPalaceGridTurntableLottery/signin/daySign";
    const headers = {
        "Sec-Fetch-Dest": "empty",
        "Connection": "keep-alive",
        "Accept-Encoding": "gzip, deflate, br",
        "Content-Type": "application/x-www-form-urlencoded",
        "Sec-Fetch-Site": "same-site",
        "Origin": "https://img.client.10010.com",
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_7_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 unicom{version:iphone_c@11.0602}",
        "Sec-Fetch-Mode": "cors",
        "Cookie": $prefs.valueForKey('10010_cookie') || "",
        "Host": "activity.10010.com",
        "Referer": "https://img.client.10010.com/",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept": "application/json, text/plain, */*"
    };

    const body = `shareCl=&shareCode=`;

    const myRequest = {
        url: url,
        method: "POST",
        headers: headers,
        body: body
    };

    $task.fetch(myRequest).then(response => {
        const data = JSON.parse(response.body);
        if (data.code === "0000") {
            $notify("签到成功", "奖励", data.data.redSignMessage);
        } else if (data.code === "0002") {
            $notify("重复任务", "提示", data.desc);
        } else {
            $notify("签到失败", "未知错误", data.desc);
        }
        $done();
    }).catch(error => {
        $notify("签到失败", "错误", error.message);
        $done();
    });
}

// // 调用签到脚本
SignIn();



// 注意：GetCookie() 函数应在获取到 Cookie 后自动触发，
// 可以将 GetCookie() 函数与自动化脚本的执行逻辑结合，确保 Cookie 获取成功后再执行 SignIn() 函数。
