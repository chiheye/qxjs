/******************************************
 * @name ITHome 每日签到
 * @author chiheye
 * @update 2026.08.25
 * @version 1.7
 ******************************************

// Quantumult X 配置：
******************************************
[MITM]
hostname = napi.ithome.com
******************************************
[rewrite_local]
# 获取凭证：打开 IT之家 App → 进入签到页面
^https:\/\/napi\.ithome\.com\/api\/usersign\/getsigninfo url script-request-header https://raw.githubusercontent.com/chiheye/qxjs/refs/heads/main/ithome.js
******************************************
[task_local]
0 9 * * * https://raw.githubusercontent.com/chiheye/qxjs/refs/heads/main/ithome.js, tag=ITHome签到, img-url=https://raw.githubusercontent.com/Orz-3/mini/master/Color/ithome.png, enabled=true
******************************************/

const $ = new Env("ITHome签到");

const SIGN_API = "https://napi.ithome.com/api/usersign/sign";
const TOKEN_KEY = "ithome_userHash";

// ====================== 获取凭证 ======================
if (typeof $request !== "undefined") {
  let userHash = null;

  // 1) 优先从 URL 取 userHash（你给的这种：userHash=Bearer%20eyJ...）
  if ($request.url) {
    const m = $request.url.match(/[?&]userHash=([^&]+)/i);
    if (m && m[1]) {
      userHash = decodeURIComponent(m[1].trim());
    }
  }

  // 2) 没有则从 Authorization 头取（Bearer xxx）
  if (!userHash && $request.headers) {
    const h = $request.headers;
    const auth =
      h["Authorization"] ||
      h["authorization"] ||
      h["AUTHORIZATION"];
    if (auth && /^Bearer\s+\S+/i.test(auth)) {
      userHash = auth.trim();
    }
  }

  if (userHash && userHash.length > 20) {
    // 统一成 "Bearer xxx" 形式（若只有 JWT 则补上）
    if (!/^Bearer\s+/i.test(userHash) && userHash.indexOf(".") > 0) {
      userHash = "Bearer " + userHash;
    }
    const old = $.getdata(TOKEN_KEY);
    $.setdata(userHash, TOKEN_KEY);
    if (old !== userHash) {
      $.msg("ITHome", "✅ 凭证获取成功", "可禁用 rewrite，保留定时任务即可");
    }
    console.log("saved userHash: " + userHash.substring(0, 30) + "...");
  } else {
    console.log("未获取到有效凭证, url=" + ($request.url || ""));
  }
  $.done();
}

// ====================== 执行签到 ======================
const userHash = $.getdata(TOKEN_KEY);

if (!userHash) {
  $.msg(
    "ITHome 签到",
    "❌ 未找到凭证",
    "请打开 IT之家 App 进入签到页获取（会触发 getsigninfo）"
  );
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
  "User-Agent": "ITHomeClient/9.32 (iPhone; iOS 18.3.2; Scale/3.00)",
  // 部分环境也会校验头，一并带上
  Authorization: userHash
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
      const tip = body.title || body.msg || String(data).substring(0, 120);
      $.msg("ITHome 签到", "⚠️ 签到异常", tip);
    }
  } catch (e) {
    $.msg("ITHome 签到", "❌ 解析失败", String(data).substring(0, 150));
    console.log("parse error: " + e);
  }

  $.done();
});

// ====================== Env ======================
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