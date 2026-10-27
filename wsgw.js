/**
 * 网上国网凭证捕获与电费直连查询 (All-in-One 整合版)
 * 
 * [rewrite_local]
 * ^https?:\/\/(?:api|www)\.95598\.cn\/(?:osg-open-bc|osg-open-uc|osg-web) url script-request-header https://raw.githubusercontent.com/chiheye/qxjs/refs/heads/main/wsgw.js
 * ^https?:\/\/api\.wsgw-rewrite\.com\/electricity\/bill\/all url script-response-body https://raw.githubusercontent.com/chiheye/qxjs/refs/heads/main/wsgw.js
 * 
 * [mitm]
 * hostname = api.95598.cn, www.95598.cn, api.wsgw-rewrite.com
 */

const SCRIPT_NAME = "网上国网";
const BASE_URL = "https://www.95598.cn";
const reqUrl = typeof $request !== "undefined" ? $request.url : "";

// 工具函数
function jsonParse(str) {
  try { return JSON.parse(str); } catch (e) { return null; }
}

function jsonStr(obj) {
  try { return JSON.stringify(obj); } catch (e) { return ""; }
}

function getBeforeDate(days) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

const request = (options) => {
  return new Promise((resolve, reject) => {
    $task.fetch(options).then(
      (resp) => {
        const body = jsonParse(resp.body) || resp.body;
        resolve(body);
      },
      (err) => reject(err.error || err)
    );
  });
};

// ========================【分支 A：截获并保存凭证】========================
function handleCaptureCookie() {
  const reqHeaders = $request.headers || {};
  const token = reqHeaders["token"] || reqHeaders["Token"];
  const accToken = reqHeaders["acctoken"] || reqHeaders["Acctoken"];
  const authorization = reqHeaders["Authorization"] || reqHeaders["authorization"];

  let isUpdated = false;

  if (token) {
    const oldToken = $prefs.valueForKey("wsgw_token");
    if (token !== oldToken) {
      $prefs.setValueForKey(token, "wsgw_token");
      isUpdated = true;
    }
  }

  if (accToken) {
    $prefs.setValueForKey(accToken, "wsgw_acctoken");
  }

  if (authorization) {
    $prefs.setValueForKey(authorization, "wsgw_authorization");
  }

  if ($request.body) {
    try {
      const bodyObj = JSON.parse($request.body);
      const userId = bodyObj?.quInfo?.userId || bodyObj?.userId || bodyObj?.data?.acctId;
      if (userId) {
        $prefs.setValueForKey(String(userId), "wsgw_userid");
      }
    } catch (e) {}
  }

  if (isUpdated) {
    console.log(`[${SCRIPT_NAME}] 成功更新登录凭证 Token！`);
    $notify(SCRIPT_NAME, "凭证捕获成功", "已成功更新国网 Token，可正常使用电费小组件。");
  }

  $done({});
}

// ========================【分支 B：直连国网接口查询数据】====================
function getCommonHeaders(token, accToken) {
  const headers = {
    "Content-Type": "application/json;charset=UTF-8",
    "Accept": "application/json, text/plain, */*",
    "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148",
  };
  if (token) headers["token"] = token;
  if (accToken) headers["acctoken"] = accToken;
  return headers;
}

// 1. 获取已绑定用电户号列表
async function getBindUserList(token, accToken, userId) {
  const opt = {
    url: `${BASE_URL}/api/osg-open-uc0001/member/c9/f02`,
    method: "POST",
    headers: getCommonHeaders(token, accToken),
    body: JSON.stringify({
      serviceCode: "0101183",
      source: "SGAPP",
      target: "32101",
      uscInfo: { member: "0902", devciceIp: "", devciceId: "", tenant: "state_grid" },
      quInfo: { userId: userId || "" },
      token: token,
      Channels: "web"
    })
  };
  const res = await request(opt);
  if (res?.data?.bizrt?.powerUserList) {
    return res.data.bizrt.powerUserList;
  }
  return Promise.reject(res?.message || "获取户号列表失败，凭证可能已失效");
}

// 2. 查询电费及欠费
async function queryElecBill(user, token, accToken, userId) {
  const opt = {
    url: `${BASE_URL}/api/osg-open-bc0001/member/c05/f01`,
    method: "POST",
    headers: getCommonHeaders(token, accToken),
    body: JSON.stringify({
      data: {
        srvCode: "",
        serialNo: "",
        channelCode: "0902",
        funcCode: "WEBA1007200",
        acctId: userId || "",
        userName: "",
        promotType: "1",
        promotCode: "1",
        userAccountId: userId || "",
        list: [{
          consNoSrc: user.consNo_dst,
          proCode: user.proNo,
          sceneType: user.constType,
          consNo: user.consNo,
          orgNo: user.orgNo
        }]
      },
      serviceCode: "0101143",
      source: "SGAPP",
      target: user.proNo || user.provinceId
    })
  };
  const res = await request(opt);
  return res?.data?.list?.[0] || {};
}

// 3. 查询近7日用电量
async function queryDayElec(user, token, accToken, userId) {
  const opt = {
    url: `${BASE_URL}/api/osg-web0004/member/c24/f01`,
    method: "POST",
    headers: getCommonHeaders(token, accToken),
    body: JSON.stringify({
      params1: {
        serviceCode: "0101154",
        source: "SGAPP",
        target: "32101",
        uscInfo: { member: "0902", devciceIp: "", devciceId: "", tenant: "state_grid" },
        quInfo: { userId: userId || "" },
        token: token
      },
      params3: {
        data: {
          acctId: userId || "",
          consNo: user.consNo_dst,
          consType: user.constType === "02" ? "02" : "01",
          endTime: getBeforeDate(1),
          orgNo: user.orgNo,
          queryYear: new Date().getFullYear().toString(),
          proCode: user.proNo || user.provinceId,
          startTime: getBeforeDate(6),
          userName: "",
          funcCode: "WEBALIPAY_01",
          channelCode: "0902",
          clearCache: "11",
          promotCode: "1",
          promotType: "1"
        },
        serviceCode: "BCP_000026",
        source: "app",
        target: user.proNo || user.provinceId
      },
      params4: "010103"
    })
  };
  const res = await request(opt);
  return res?.data || {};
}

// 4. 查询月用电量
async function queryMonthElec(user, token, accToken, userId) {
  const opt = {
    url: `${BASE_URL}/api/osg-web0004/member/c24/f01`,
    method: "POST",
    headers: getCommonHeaders(token, accToken),
    body: JSON.stringify({
      params1: {
        serviceCode: "0101154",
        source: "SGAPP",
        target: "32101",
        uscInfo: { member: "0902", devciceIp: "", devciceId: "", tenant: "state_grid" },
        quInfo: { userId: userId || "" },
        token: token
      },
      params3: {
        data: {
          acctId: userId || "",
          consNo: user.consNo_dst,
          consType: user.constType === "02" ? "02" : "01",
          orgNo: user.orgNo,
          proCode: user.proNo || user.provinceId,
          provinceCode: user.proNo || user.provinceId,
          queryYear: new Date().getFullYear().toString(),
          userName: "",
          funcCode: "WEBALIPAY_01",
          channelCode: "0902",
          clearCache: "11",
          promotCode: "1",
          promotType: "1"
        },
        serviceCode: "BCP_000026",
        source: "app",
        target: user.proNo || user.provinceId
      },
      params4: "010102"
    })
  };
  const res = await request(opt);
  return res?.data || {};
}

async function handleQueryData() {
  const token = $prefs.valueForKey("wsgw_token");
  const accToken = $prefs.valueForKey("wsgw_acctoken");
  const userId = $prefs.valueForKey("wsgw_userid");

  if (!token) {
    $notify(SCRIPT_NAME, "缺少登录凭证", "请先打开网上国网 App 或微信小程序抓取 Token。");
    $done({
      status: "HTTP/1.1 401 Unauthorized",
      headers: { "Content-Type": "application/json;charset=utf-8" },
      body: JSON.stringify({ error: "本地未找到国网 Token，请先登录国网应用进行抓取" })
    });
    return;
  }

  try {
    const userList = await getBindUserList(token, accToken, userId);
    const results = [];

    for (let i = 0; i < userList.length; i++) {
      const user = userList[i];
      const [bill, dayElec, monthElec] = await Promise.all([
        queryElecBill(user, token, accToken, userId).catch(() => ({})),
        queryDayElec(user, token, accToken, userId).catch(() => ({})),
        queryMonthElec(user, token, accToken, userId).catch(() => ({}))
      ]);

      const isArrears = Number(bill?.historyOwe || "0") > 0 || Number(bill?.sumMoney || "0") < 0;

      results.push({
        userInfo: user,
        eleBill: bill,
        dayElecQuantity: dayElec,
        monthElecQuantity: monthElec,
        arrearsOfFees: isArrears
      });
    }

    $done({
      status: "HTTP/1.1 200 OK",
      headers: { "Content-Type": "application/json;charset=utf-8" },
      body: jsonStr(results)
    });
  } catch (err) {
    console.log(`[${SCRIPT_NAME}] 查询失败: ${err}`);
    if (/失效|登录|token/i.test(String(err))) {
      $notify(SCRIPT_NAME, "凭证已过期", "国网 Token 已失效，请打开网上国网 App 刷新凭证。");
    }
    $done({
      status: "HTTP/1.1 500 Internal Server Error",
      headers: { "Content-Type": "application/json;charset=utf-8" },
      body: JSON.stringify({ error: String(err) })
    });
  }
}

// ========================【执行路由入口】========================
if (/95598\.cn/.test(reqUrl)) {
  handleCaptureCookie();
} else if (/wsgw-rewrite\.com/.test(reqUrl)) {
  handleQueryData();
} else {
  $done({});
}
