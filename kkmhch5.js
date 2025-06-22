/*
 * kkmhch5.js - 修改快看charge_h5接口返回内容
 */

let obj = JSON.parse($response.body);

// 修改 VIP 信息
if (obj?.data?.vip) {
  obj.data.vip.auto_pay = true;
  obj.data.vip.vip_identity = "超级会员";
  obj.data.vip.vip_fate_sum = 99999;
  obj.data.vip.payment_sum = 99999;
  obj.data.vip.balance_sum = 99999;
}

// 修改用户分类信息
if (obj?.data?.user_classify) {
  obj.data.user_classify.total_consume_kkb = 999999;
  obj.data.user_classify.last_month_consume_kkb = 88888;
}

// 修改充值记录
if (obj?.data?.charge_values) {
  obj.data.charge_values.total_charge_cnt = 999;
  obj.data.charge_values.last_charge_time = Date.now();
  obj.data.charge_values.total_charge_value = 999999;
}

// 自定义 VIP 专属内容
if (obj?.data?.topic) {
  obj.data.topic.title = "会员专属热血专区";
  obj.data.topic.vip_only = true;
}

// 漫画专区
if (obj?.data?.comic) {
  obj.data.comic.title = "本漫画为会员专享";
  obj.data.comic.ticket_comic = true;
}

obj.message = "patched";
$done({ body: JSON.stringify(obj) });
