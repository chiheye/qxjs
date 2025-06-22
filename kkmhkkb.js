/*
 * kkmhkkb.js - 修改快看钱包接口响应
 */

let body = $response.body;
let obj = JSON.parse(body);

// 修改钱包余额
if (obj?.data?.wallet) {
  obj.data.wallet.ios_balance = 99999;
  obj.data.wallet.nios_balance = 99999;
  obj.data.wallet.latest_present_balance = 88888;
  obj.data.wallet.total_charge_cnt = 99;
}

// 修改活动文案和图片
if (obj?.data?.activity) {
  obj.data.activity.activity_word = "无限送币";
  obj.data.activity.button_title = "点击立送99999金币";
  obj.data.activity.activity_img = "https://your-custom-image.com/banner.png";
  obj.data.activity.activity_id = 999999;
}

// 修改绑定手机号
obj.data.bind_phone = "18888888888";

// 强制 code 为 200
obj.code = 200;
obj.message = "patched";

$done({ body: JSON.stringify(obj) });
