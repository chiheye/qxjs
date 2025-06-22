/*
 * kuaikan_comic_price.js - 修改漫画价格接口返回
 */

let obj = JSON.parse($response.body);

// 设置 VIP 状态
obj.data.vip_info = {
  vip: true,
  is_vip: true
};

// 清除提示横幅文字
if (obj.data.pic_text_banner) {
  obj.data.pic_text_banner.text1 = "本漫画限时免费";
  obj.data.pic_text_banner.text2 = "";
  obj.data.pic_text_banner.pic = "";
}

// 修改所有批量购买项为免费
if (Array.isArray(obj.data.batch_purchase_list)) {
  obj.data.batch_purchase_list.forEach(item => {
    if (item.price_info) {
      item.price_info.origin_kk_currency = 0;
      item.price_info.selling_kk_currency = 0;
      item.price_info.vip_selling_kk_currency = 0;
      item.price_info.total_discount = 100;
      item.price_info.icon_text = "限免";
      item.price_info.deduction_texts = ["限时免费: -全部KK币"];
      item.price_info.discount = 100;
    }
    if (item.text_info?.discount_label) {
      item.text_info.discount_label.right_text = "0KK币";
      item.text_info.discount_label.left_text = "限免";
    }
    if (item.text_info?.market_text) {
      item.text_info.market_text.text = "限时免费中";
    }
    item.text = "本话限免";
  });
}

// 也可以设置 auto_pay 相关字段
obj.data.is_auto_pay = true;
obj.data.autoPay = true;

obj.message = "patched";

$done({ body: JSON.stringify(obj) });
