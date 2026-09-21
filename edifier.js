/******************************************
 * @name 漫步者社区签到
 * @author chiheye
 * @update 2026.09.21
 * @version 1.0
 ******************************************

// Quantumult X 配置：
******************************************
[MITM]
hostname = analytics.edifier.com
******************************************
[rewrite_local]
# 获取签到数据：打开漫步者 App → 手动签到一次
^https:\/\/analytics\.edifier\.com:8911\/community\/save url script-request-body https://raw.githubusercontent.com/chiheye/qxjs/refs/heads/main/edifier.js
******************************************
[task_local]
0 9 * * * edifier.js, tag=漫步者签到, img-url=https://raw.githubusercontent.com/Orz-3/mini/master/Color/edifier.png, enabled=true
******************************************/

/**
 * 漫步者社区 签到脚本（合并版）
 * 兼容 Quantumult X
 * 
 * 使用说明：
 * 1. 配置 rewrite + MITM 后，打开 App 手动签到一次获取数据
 * 2. 看到「获取数据成功」通知后，注释掉 rewrite 规则
 * 3. 手动运行一次任务测试，成功后开启定时
 */

const title = "漫步者签到";

// ==================== 获取数据部分 ====================
if (typeof $request !== "undefined") {
  // 当前是 rewrite 环境（拦截请求）
  const url = $request.url;
  const method = $request.method;
  const body = $request.body;

  if (url.includes("analytics.edifier.com") && url.includes("/community/save") && method === "POST" && body) {
    $prefs.setValueForKey(body, "edifier_sign_body");

    try {
      const json = JSON.parse(body);
      if (json.sign) $prefs.setValueForKey(json.sign, "edifier_sign");
      if (json.common?.user_id) $prefs.setValueForKey(String(json.common.user_id), "edifier_user_id");
    } catch (e) {}

    $notify(title, "获取数据成功 ✅", "请求体已保存，可以关闭 rewrite");
    console.log("===== 已保存签到数据 =====\n" + body);
  }

  $done({});
}

// ==================== 签到部分 ====================
else {
  // 当前是 task 环境（定时任务）
  !(async () => {
    let bodyStr = $prefs.valueForKey("edifier_sign_body");

    if (!bodyStr) {
      $notify(title, "未获取到数据", "请先配置 rewrite 并手动签到一次");
      return;
    }

    // 更新所有时间戳为当前时间（秒）
    const now = Math.floor(Date.now() / 1000);
    bodyStr = bodyStr
      .replace(/"timestamp":\d+/g, `"timestamp":${now}`)
      .replace(/"access_time":\d+/g, `"access_time":${now}`);

    const headers = {
      "Accept": "*/*",
      "Accept-Encoding": "gzip, deflate, br",
      "Connection": "keep-alive",
      "Content-Type": "application/json",
      "Host": "analytics.edifier.com:8911",
      "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 18_3_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Html5Plus/1.0 (Immersed/47) uni-app",
      "Accept-Language": "zh-CN,zh-Hans;q=0.9"
    };

    const request = {
      url: "https://analytics.edifier.com:8911/community/save",
      method: "POST",
      headers: headers,
      body: bodyStr
    };

    try {
      const resp = await $task.fetch(request);
      const status = resp.statusCode;
      const resBody = resp.body || "";

      console.log(`状态码: ${status}`);
      console.log(`响应: ${resBody}`);

      if (status === 200) {
        try {
          const json = JSON.parse(resBody);
          if (json.code === 200 && json.msg === "success") {
            const uuid = json.data?.reportUuid || "";
            $notify(title, "签到成功 ✅", `reportUuid: ${uuid}`);
          } else {
            $notify(title, "签到失败", `code: ${json.code}\nmsg: ${json.msg || resBody}`);
          }
        } catch (e) {
          $notify(title, "解析失败", resBody);
        }
      } else {
        $notify(title, "请求失败", `状态码 ${status}\n${resBody}`);
      }
    } catch (err) {
      console.log(err);
      $notify(title, "错误", err.error || err.message || String(err));
    }
  })().finally(() => $done());
}