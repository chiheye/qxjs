/*
极狐签到脚本
************************
QuantumultX 远程脚本配置:
************************

[task_local]
# 每天早上8点签到
0 8 * * * https://your.script.url/your_script_name.js, tag=自动签到, enabled=true
    
[rewrite_local]
# 获取arcfoxCookie

https://mg.arcfox.cn/mall-integral/public/integral/syncIntegral url script-request-header https://raw.githubusercontent.com/chiheye/qxjs/main/arcfoxqd.js

[mitm] 

hostname= mg.arcfox.cn


*/


// Define the key for storing cookies
const COOKIE_KEY = "ARCFOX_COOKIE";
const URL_KEY = "ARCFOX_URL";

const method = `GET`;
const body = ``;

let url = $request ? $request.url : $prefs.valueForKey(URL_KEY);
let headers = $request ? $request.headers : JSON.parse($prefs.valueForKey(COOKIE_KEY));

if ($request) {
    // Save the Cookie and URL
    $prefs.setValueForKey(JSON.stringify($request.headers), COOKIE_KEY);
    $prefs.setValueForKey($request.url, URL_KEY);
    $notify("Arcfox", "Cookie捕获成功", "");
    $done({});
} else {
    // Send the request with the saved Cookie
    const myRequest = {
        url: url,
        method: method,
        headers: headers,
        body: body
    };

    $task.fetch(myRequest).then(response => {
        if (response.statusCode == 200) {
            $notify("Arcfox", "签到成功", "积分已同步");
        } else {
            $notify("Arcfox", "签到失败", response.statusCode + "\n\n" + response.body);
        }
        $done();
    }, reason => {
        $notify("Arcfox", "签到请求失败", reason.error);
        $done();
    });
}
