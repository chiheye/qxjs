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



/*
Quantumult X 脚本: Arcfox 自动签到

描述: 每天自动签到获取积分。

使用方法:
1. 第一次运行脚本时会自动获取 `cookie`。
2. 后续运行时将使用获取到的 `cookie` 进行签到。

作者: ChatGPT
*/

const signInURL = `https://mg.arcfox.cn/mall-integral/public/integral/syncIntegral?appkey`;
const method = `GET`;
const headers = {
  'Connection': `keep-alive`,
  'Accept-Encoding': `gzip;q=1.0, compress;q=0.5`,
  'appcode': `537`,
  'vin': ``,
  'appversion': `2.0.57`,
  'User-Agent': `BMSuperApp/2.0.57 (com.bxbe.arcfox; build:537; iOS 16.7.2) Alamofire/4.9.1`,
  'platform': `iOS`,
  'ip': `1123213`,
  'Cookie': $prefs.valueForKey('arcfox_cookie') || '', // 使用已保存的cookie
  'Host': `mg.arcfox.cn`,
  'Accept-Language': `zh-Hans-CN;q=1.0, en-CN;q=0.9, zh-Hant-CN;q=0.8`,
  'Accept': `*/*`
};

// 获取Cookie
if (!$prefs.valueForKey('arcfox_cookie')) {
  const request = {
    url: signInURL,
    method: method,
    headers: headers
  };

  $task.fetch(request).then(response => {
    const setCookie = response.headers['Set-Cookie'];
    if (setCookie) {
      const cookie = setCookie.split(';')[0];
      $prefs.setValueForKey(cookie, 'arcfox_cookie'); // 保存Cookie
      console.log(`Cookie已保存: ${cookie}`);
    } else {
      console.log('无法获取Cookie');
    }
    $done();
  }, reason => {
    console.log(`获取Cookie失败: ${reason.error}`);
    $done();
  });
} else {
  // 自动签到
  const request = {
    url: signInURL,
    method: method,
    headers: headers
  };

  $task.fetch(request).then(response => {
    const result = JSON.parse(response.body);
    if (result.status === "SUCCEED") {
      console.log(`签到成功: ${result.data.checkToast}`);
    } else {
      console.log('签到失败');
    }
    $done();
  }, reason => {
    console.log(`签到请求失败: ${reason.error}`);
    $done();
  });
}

