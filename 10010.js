/*
吾爱破解签到脚本
************************
QuantumultX 远程脚本配置:
************************


    
[rewrite_local]
# 获取10010Cookie
^https:\/\/activity\.10010\.com\/sixPalaceGridTurntableLottery\/signin\/daySign url script-request-header https://raw.githubusercontent.com/chiheye/qxjs/main/10010.js

[mitm] 
hostname= activity.10010.com
*/

// 获取并保存 Cookie
function GetCookie() {
    const cookie = $request.headers['Cookie'] || $request.headers['cookie'];
    console.log(cookie);
    if (cookie) {
        const saved = $prefs.setValueForKey(cookie, '10010_cookie');
        if (saved) {
            console.log('Cookie保存成功：' + cookie);
            $notify("中国联通", "Cookie保存成功", "Cookie已保存，可以进行签到操作。");
        } else {
            console.log('Cookie保存失败');
            $notify("中国联通", "Cookie保存失败", "无法保存Cookie，请检查脚本设置。");
        }
    } else {
        console.log('获取Cookie失败');
        $notify("中国联通", "Cookie获取失败", "未能获取到Cookie，请检查设置。");
    }
    $done();
}

// 签到脚本
function SignIn() {
    const cookie = $prefs.valueForKey('10010_cookie');
    if (!cookie) {
        console.log('未找到Cookie，无法进行签到');
        $notify("签到失败", "原因", "未找到有效的Cookie，请先获取Cookie。");
        $done();
        return;
    }

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
        "Cookie": cookie, // 使用保存的 Cookie
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
        try {
            const data = JSON.parse(response.body);
            if (data.code === "0000") {
                $notify("签到成功", "奖励", data.data.redSignMessage);
            } else if (data.code === "0002") {
                $notify("重复任务", "提示", data.desc);
            } else {
                $notify("签到失败", "未知错误", data.desc);
            }
        } catch (error) {
            $notify("签到失败", "解析错误", "无法解析响应内容：" + error.message);
        }
        $done();
    }).catch(error => {
        $notify("签到失败", "请求错误", error.message);
        $done();
    });
}

// 判断是获取 Cookie 还是签到操作
if ($request && $request.headers) {
    GetCookie();
} else {
    SignIn();
}




// 注意：GetCookie() 函数应在获取到 Cookie 后自动触发，
// 可以将 GetCookie() 函数与自动化脚本的执行逻辑结合，确保 Cookie 获取成功后再执行 SignIn() 函数。
