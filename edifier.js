/******************************************
 * @name 漫步者社区签到
 * @author chiheye
 * @update 2026.10.07
 * @version 2.0
 ******************************************

// Quantumult X 配置：
******************************************
[MITM]
hostname = bbs-user-api.edifier.com
******************************************
[rewrite_local]
# 获取凭证：打开漫步者 App → 进入签到页面并手动签到一次
^https:\/\/bbs-user-api\.edifier\.com\/api\/operation\/signin\/v1\/ url script-request-header https://raw.githubusercontent.com/chiheye/qxjs/refs/heads/main/edifier.js
******************************************
[task_local]
0 9 * * * https://raw.githubusercontent.com/chiheye/qxjs/refs/heads/main/edifier.js, tag=漫步者签到, img-url=https://raw.githubusercontent.com/Orz-3/mini/master/Color/edifier.png, enabled=true
******************************************/

/**
 * 漫步者社区 签到脚本
 * 兼容 Quantumult X
 *
 * 使用说明：
 * 1. 配置 rewrite + MITM 后，打开 App 手动签到一次获取 jb-authorization
 * 2. 看到「获取凭证成功」通知后，注释掉 rewrite 规则
 * 3. 手动运行一次任务测试，成功后开启定时
 */

const title = "漫步者签到";
const key = "edifier_jb_authorization";

// ==================== 获取凭证部分 ====================
if (typeof $request !== "undefined") {
  // 当前是 rewrite 环境
  const auth = $request.headers["jb-authorization"] || $request.headers["Jb-Authorization"];

  if (auth) {
    $prefs.setValueForKey(auth, key);
    $notify(title, "获取凭证成功 ✅", "jb-authorization 已保存，可以关闭 rewrite");
    console.log("已保存 jb-authorization:\n" + auth);
  } else {
    $notify(title, "获取失败", "未找到 jb-authorization 头");
  }

  $done({});
}

// ==================== 签到部分 ====================
else {
  // 当前是 task 环境
  !(async () => {
    const auth = $prefs.valueForKey(key);

    if (!auth) {
      $notify(title, "未获取到凭证", "请先配置 rewrite 并手动签到一次");
      return;
    }

    const headers = {
      "Accept": "*/*",
      "Accept-Encoding": "gzip, deflate, br",
      "Connection": "keep-alive",
      "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      "Host": "bbs-user-api.edifier.com",
      "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 18_3_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Html5Plus/1.0 (Immersed/47) uni-app",
      "Accept-Language": "zh-CN,zh-Hans;q=0.9",
      "jb-authorization": auth
    };

    const request = {
      url: "https://bbs-user-api.edifier.com/api/operation/signin/v1/",
      method: "POST",
      headers: headers,
      body: "activityId=1"
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
          // 根据实际返回结构调整判断（常见成功字段）
          if (json.code === 200 || json.code === 0 || json.success === true || json.msg === "success" || json.message === "success") {
            $notify(title, "签到成功 ✅", json.msg || json.message || "今日签到完成");
          } else {
            $notify(title, "签到结果", `code: ${json.code}\nmsg: ${json.msg || json.message || resBody}`);
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