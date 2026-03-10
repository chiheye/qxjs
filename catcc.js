/*
*******************************
 * CatVPN → Clash/Stash 节点生成
 *******************************
[rewrite_local]
# > CatVPN节点提取
^https?:\/\/firebaseremoteconfig\.googleapis\.com\/v1\/projects url script-response-body https://raw.githubusercontent.com/WeiGiegie/666/main/catvpn_extract.js

[mitm]
hostname = firebaseremoteconfig.googleapis.com
*******************************
*/



const ENV = {
  isQX: typeof $task !== "undefined",
  isLoon: typeof $loon !== "undefined",
  isSurge: typeof $httpClient !== "undefined" && typeof $loon === "undefined"
};

function safeJsonParse(str) { try { return JSON.parse(str) } catch { return null } }
function done(resp={}) { if (typeof $done !== "undefined") $done(resp) }
function notify(title, sub, msg) {
  if (ENV.isQX) $notify(title, sub, msg)
  else if (ENV.isLoon) $notification.post(title, sub, msg)
  else if (ENV.isSurge) $notification.post(title, sub, msg)
}
function log(msg){ console.log(`[CatVPN→Clash] ${msg}`) }

// Base64 decode
function b64decode(str){
  if (typeof atob !== "undefined") return atob(str)
  if (typeof $crypto !== "undefined") return $crypto.base64Decode(str)
  throw new Error("当前环境不支持 Base64 解码")
}

/* -----------------------------
   Clash/Stash 节点生成函数
------------------------------*/

// VLESS Reality → Clash/Stash
function clashVless(server, isPro){
  const { host, port, uuid, country_name, id } = server
  const name = `${isPro?"Pro":"Free"}-${country_name}-${id}`

  return {
    name,
    type: "vless",
    server: host,
    port: port,
    uuid: uuid,
    network: "tcp",
    reality: {
      enabled: true,
      public_key: "OyGxax1037g3nQrsIW0PtXHik3WI1ikOT2pxm9c7fxw",
      short_id: "6ba85179e30d4fc2",
      spider_x: "",
      server_name: "osxapps.itunes.apple.com"
    },
    tls: {
      enabled: true,
      insecure: true
    }
  }
}

// Hysteria2 → Clash/Stash
function clashHysteria2(server, isPro){
  const { host, port, uuid, country_name, id } = server
  const name = `${isPro?"Pro":"Free"}-${country_name}-${id}`

  return {
    name,
    type: "hysteria2",
    server: host,
    port: port,
    password: uuid,
    sni: "lenta.ru",
    skip_cert_verify: true
  }
}

// 根据 template 选择节点类型
function convertServer(server, isPro){
  const tpl = server?.conf?.template
  const conf = server?.conf?.conf
  if (!conf) return null

  const info = {
    host: conf.host,
    port: conf.port,
    uuid: conf.uuid,
    country_name: server.country_name,
    id: server.id
  }

  if (tpl === "s_direct") return clashVless(info, isPro)
  if (tpl === "h_direct") return clashHysteria2(info, isPro)
  return null
}

/* -----------------------------
   主逻辑
------------------------------*/

function handle(){
  const body = $response.body
  if (!body) return done({body})

  const json = safeJsonParse(body)
  if (!json?.entries?.wind_servers){
    notify("CatVPN 提取失败", "", "未找到 wind_servers 字段")
    return done({body})
  }

  try{
    const decoded = b64decode(json.entries.wind_servers)
    const wind = JSON.parse(decoded)

    const free = wind.free_servers || []
    const pro  = wind.pro_servers  || []

    const nodes = []

    free.forEach(s => {
      const n = convertServer(s, false)
      if (n) nodes.push(n)
    })

    pro.forEach(s => {
      const n = convertServer(s, true)
      if (n) nodes.push(n)
    })

    if (nodes.length === 0) throw new Error("未生成任何 Clash/Stash 节点")

    // 生成 YAML
    const yaml = [
      "proxies:",
      ...nodes.map(n => "  - " + JSON.stringify(n).replace(/\"([^"]+)\":/g, "$1:"))
    ].join("\n")

    notify("CatVPN → Clash/Stash", `共生成 ${nodes.length} 个节点`, yaml)
    log("生成成功")

  }catch(e){
    notify("CatVPN 提取失败", "", e.message)
    log("错误：" + e.message)
  }

  done({body})
}

handle()
