/******************************************
 * @name ITHome 每日签到
 * @author chiheye
 * @update 2026.08.25
 * @version 1.6.1
 ******************************************

[MITM]
hostname = napi.ithome.com

[rewrite_local]
# 获取 userHash：打开 App → 进入签到页
^https:\/\/napi\.ithome\.com\/api\/usersign\/getsigninfo url script-request-header https://raw.githubusercontent.com/chiheye/qxjs/refs/heads/main/ithome.js

[task_local]
0 9 * * * https://raw.githubusercontent.com/chiheye/qxjs/refs/heads/main/ithome.js, tag=ITHome签到, img-url=https://raw.githubusercontent.com/Orz-3/mini/master/Color/ithome.png, enabled=true
******************************************/

const $ = new Env("ITHome签到");

const SIGN_API = "https://napi.ithome.com/api/usersign/sign";
const TOKEN_KEY = "ithome_userHash";

// ---------- 获取 userHash ----------
if (typeof $request !== "undefined" && $request.url) {
  try {
    const m = $request.url.match(/[?&]userHash=([^&]+)/i);
    if (m && m[1]) {
      const userHash = decodeURIComponent(m[1].trim());
      if (userHash.length > 10) {
        const old = $.getdata(TOKEN_KEY);
        $.setdata(userHash, TOKEN_KEY);
        if (old !== userHash) {
          $.msg("ITHome", "✅ userHash 获取成功", "可禁用获取凭证的 rewrite");
        }
        console.log("userHash saved: " + userHash.substring(0, 20) + "...");
      } else {
        $.msg("ITHome", "❌ userHash 无效", "请重新打开签到页");
      }
    } else {
      console.log("no userHash in: " + $request.url);
    }
  } catch (e) {
    console.log("get hash error: " + e);
  }
  $.done();
}

// ---------- 签到 ----------
const userHash = $.getdata(TOKEN_KEY);

if (!userHash) {
  $.msg("ITHome 签到", "❌ 未找到 userHash", "请打开 IT之家 App 进入签到页获取凭证");
  $.done();
}

const url = SIGN_API + "?userHash=" + encodeURIComponent(userHash);

const headers = {
  Accept: "*/*",
  "Accept-Language": "zh-Hans-CN;q=1, en-US;q=0.9",
  "Accept-Encoding": "gzip, deflate, br",
  Connection: "keep-alive",
  "Content-Type": "application/x-www-form-urlencoded",
  Host: "napi.ithome.com",
  "User-Agent": "ITHomeClient/9.32 (iPhone; iOS 18.3.2; Scale/3.00)"
};

$.get({ url: url, headers: headers }, function (err, resp, data) {
  if (err) {
    $.msg("ITHome 签到", "❌ 请求失败", String(err));
    $.done();
    return;
  }

  try {
    const body = typeof data === "string" ? JSON.parse(data) : data;

    if (body.ok === 1) {
      const coin = body.coin || 0;
      const cdays = body.cdays || 0;
      const remain = body.remainday || 0;
      let reward = "+" + coin + " 金币";
      if (body.message) {
        if (typeof body.message === "object" && body.message["签到奖励"]) {
          reward = body.message["签到奖励"];
        } else if (typeof body.message === "string") {
          reward = body.message;
        }
      }
      $.msg(
        "ITHome 签到",
        "🎉 签到成功",
        reward + "\n连续签到 " + cdays + " 天\n还需 " + remain + " 天可领额外奖励"
      );
    } else if (body.ok === 0) {
      $.msg("ITHome 签到", "✅ 今日已签到", body.title || body.msg || "明天再来吧");
    } else {
      var tip = body.title || body.msg || String(data).substring(0, 120);
      $.msg("ITHome 签到", "⚠️ 签到异常", tip);
    }
  } catch (e) {
    $.msg("ITHome 签到", "❌ 解析失败", String(data).substring(0, 150));
    console.log("parse error: " + e);
  }

  $.done();
});

// ---------- Env ----------
function Env(name) {
  this.name = name;
  this.getdata = function (key) {
    return $prefs.valueForKey(key);
  };
  this.setdata = function (val, key) {
    return $prefs.setValueForKey(val, key);
  };
  this.msg = function (title, subtitle, body) {
    $notify(title, subtitle, body);
  };
  this.get = function (option, callback) {
    $task.fetch(option).then(
      function (response) {
        callback(null, response, response.body);
      },
      function (err) {
        callback(err.error || err, null, null);
      }
    );
  };
  this.done = function (val) {
    $done(val || {});
  };
}