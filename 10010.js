/*
吾爱破解签到脚本
************************
QuantumultX 远程脚本配置:
************************


    
[rewrite_local]
# 获取10010Cookie
https://activity.10010.com/sixPalaceGridTurntableLottery/signin/daySign script-request-header https://raw.githubusercontent.com/chiheye/qxjs/main/10010.js


[mitm] 
hostname= activity.10010.com
*/

/**
 * @fileoverview 自动签到脚本
 */

// 获取保存的 Cookie
const cookie = $prefs.valueForKey("unicom_cookie");

if (!cookie) {
    console.log("未找到已保存的 Cookie，请确保已成功捕获 Cookie！");
    $done();
    return;
}

const url = `https://activity.10010.com/sixPalaceGridTurntableLottery/signin/daySign`;
const method = `POST`;
const headers = {
    'Sec-Fetch-Dest': `empty`,
    'Connection': `keep-alive`,
    'Accept-Encoding': `gzip, deflate, br`,
    'Content-Type': `application/x-www-form-urlencoded`,
    'Sec-Fetch-Site': `same-site`,
    'Origin': `https://img.client.10010.com`,
    'User-Agent': `Mozilla/5.0 (iPhone; CPU iPhone OS 16_7_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 unicom{version:iphone_c@11.0602}`,
    'Sec-Fetch-Mode': `cors`,
    'Cookie': cookie,  // 使用自动捕获的 Cookie
    'Host': `activity.10010.com`,
    'Referer': `https://img.client.10010.com/`,
    'Accept-Language': `en-US,en;q=0.9`,
    'Accept': `application/json, text/plain, */*`
};
const body = `shareCl=&shareCode=`;

const myRequest = {
    url: url,
    method: method,
    headers: headers,
    body: body
};

$task.fetch(myRequest).then(response => {
    const result = JSON.parse(response.body);
    
    if (result.code === "0000") {
        console.log("签到成功！");
    } else if (result.code === "0002") {
        console.log("您今天已经签到过了。");
    } else {
        console.log("签到失败，返回信息：" + result.desc);
    }

    $done();
}, reason => {
    console.log("请求失败，错误信息：" + reason.error);
    $done();
});

