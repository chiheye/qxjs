/**
 * 漫步者社区 获取签到请求体
 * 使用方法：
 * 1. 配置 rewrite 后，打开 App 手动点一次「签到」
 * 2. 看到通知「获取签到数据成功」即可
 */

const url = $request.url;
const body = $request.body;

if (url.includes("/community/save") && body) {
  $prefs.setValueForKey(body, "edifier_sign_body");
  $notify("漫步者签到", "获取签到数据成功", "已保存请求体，可关闭 rewrite");
  console.log("已保存 body:\n" + body);
}

$done({});