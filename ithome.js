/******************************************
 * @name ITHome 每日签到
 * @author chiheye
 * @update 2026.08.25
 * @version 1.6
 ******************************************

// Quantumult X 配置说明：
******************************************
[MITM]
hostname = napi.ithome.com
******************************************
[rewrite_local]
# 获取 userHash（第一次使用，获取成功后建议禁用）
# 触发方式：打开 IT之家 App → 进入「签到」页面
^https:\/\/napi\.ithome\.com\/api\/usersign\/getsigninfo url script-request-header https://raw.githubusercontent.com/chiheye/qxjs/refs/heads/main/ithome.js
******************************************
[task_local]
# 每天 9 点执行签到
0 9 * * * https://raw.githubusercontent.com/chiheye/qxjs/refs/heads/main/ithome.js, tag=ITHome签到, img-url=https://raw.githubusercontent.com/Orz-3/mini/master/Color/ithome.png, enabled=true
******************************************/

const $ = new Env("ITHome签到");

const SIGN_API = "https://napi.ithome.com/api/usersign/sign";
const TOKEN_KEY = "ithome_userHash";

// ====================== 获取 userHash ======================
if (typeof $request !== "undefined" && $request.url) {
  try {
    const match = $request.url.match(/[?&]userHash=([^&]+)/i);
    if (match && match[1]) {
      const userHash = decodeURIComponent(match[1].trim());
      if (userHash && userHash.length > 10) {
        const old = $.getdata(TOKEN_KEY);
        $.setdata(userHash, TOKEN_KEY);
        if (old !== userHash) {
          $.msg("ITHome", "✅ userHash 获取/更新成功", "可禁用获取凭证的 rewrite");
        } else {
          console.log("✅ userHash 已存在且未变化");
        }
        console.log("✅ ITHome userHash 已保存: " + userHash.substring(0, 24) + "...");
      } else {
        $.msg("ITHome", "❌ userHash 无效", "请重新打开签到页面");
      }
    } else {
      console.log("未匹配到 userHash，URL: " + $request.url);
    }
  } catch (e) {
    console.log("获取 userHash 异常: " + e);
  }
  $.done();
}

// ====================== 执行签到 ======================
const userHash = $.getdata(TOKEN_KEY);

if (!userHash) {
  $.msg("ITHome 签到", "❌ 未找到 userHash", "请打开 IT之家 App 进入签到页面获取凭证");
  $.done();
}

const url = `${SIGN_API}?userHash=${encodeURIComponent(userHash)}`;

const headers = {
  "Accept": "*/*",
  "Accept-Language": "zh-Hans-CN;q=1, en-US;q=0.9",
  "Accept-Encoding": "gzip, deflate, br",
  "Connection": "keep-alive",
  "Content-Type": "application/x-www-form-urlencoded",
  "Host": "napi.ithome.com",
  "User-Agent": "ITHomeClient/9.32 (iPhone; iOS 18.3.2; Scale/3.00)"
};

$.get({ url, headers }, (err, resp, data) => {
  if (err) {
    $.msg("ITHome 签到", "❌ 请求失败", String(err));
    $.done();
    return;
  }

  try {
    const body = typeof data === "string" ? JSON.parse(data) : data;

    // 成功：ok === 1
    if (body.ok === 1) {
      const coin = body.coin || 0;
      const cdays = body.cdays || 0;
      const remain = body.remainday || 0;
      let reward = `+${coin} 金币`;

      if (body.message) {
        if (typeof body.message === "object") {
          reward = body.message["签到奖励"] || body.message.msg || reward;
        } else if (typeof body.message === "string") {
          reward = body.message;
        }
      }

      $.msg(
        "ITHome 签到",
        "🎉 签到成功",
        `${reward}\n连续签到 ${cdays} 天\n还需 ${remain} 天可领额外奖励`
      );
    }
    // 重复签到：ok === 0
    else if (body.ok === 0) {
      $.msg("ITHome 签到", "✅ 今日已