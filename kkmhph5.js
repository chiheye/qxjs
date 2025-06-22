/**
 * kuaikan_comic_price.js
 * 解锁快看漫画所有章节价格为0 + VIP标识
 */

let obj = JSON.parse($response.body);

// 强制设置 VIP 状态
obj.data.vip_info = {
  vip: true,
  is_vip: true
};

// 设置当前话已购买状态、价格为 0
obj.data.single_purchase_index = 0;
obj.data.entire_preferential = 1;
obj.data.kk_currency_balance = 999999;

// 清除「支付提示」横幅
if (obj.data.pic_text_banner) {
  obj.data.pic_text_banner.text1 = "本章节限时免费";
  obj.data.pic_text_banner.text2 = "";
  obj.data.pic_text_banner.pic = "";
  obj.data.pic_text_banner.speedup_available = false;
  obj.data.pic_text_banner.bubble_text = [];
  obj.data.pic_text_banner.text_type = 0;
}

// 清除 `pic_text_banners` 中所有提示文案
if (Array.isArray(obj.data.pic_text_banners)) {
  obj.data.pic_text_banners.forEach(banner => {
    banner.text1 = "本章节限时免费";
    banner.text2 = "";
    banner.pic = "";
    banner.bubble_text = [];
    banner.text_type = 0;
  });
}

// 解锁所有可批量购买章节
if (Array.isArray(obj.data.batch_purchase_list)) {
  obj.data.batch_purchase_list.forEach(item => {
    // 设置价格全部为0
    if (item.price_info) {
      item.price_info.origin_kk_currency = 0;
      item.price_info.selling_kk_currency = 0;
      item.price_info.vip_selling_kk_currency = 0;
      item.price_info.total_discount = 100;
      item.price_info.icon_text = "已解锁";
      item.price_info.deduction_texts = ["限免:-全部KK币"];
      item.price_info.discount = 100;
      item.price_info.platform_deduction = 0;
    }

    // 显示购买文字为“已解锁”
    item.text = "已解锁";

    // 标记已购买状态
    item.has_read_view = {
      target_comic_id: 0,
      show: true,
      all_read: true,
      read_num: item.batch_count || 1,
      has_un_read_remain: false
    };

    // 修改文本信息
    if (item.text_info) {
      item.text_info.vip_discount = 0;

      if (item.text_info.discount_label) {
        item.text_info.discount_label.left_text = "限免";
        item.text_info.discount_label.right_text = "0KK币";
      }

      if (item.text_info.market_text) {
        item.text_info.market_text.text = "限免中";
        item.text_info.market_text.discount_text = "";
      }
    }
  });
}

// 彻底关闭自动支付提醒
if (obj.data.auto_pay_reminder) {
  obj.data.auto_pay_reminder.show = false;
  obj.data.auto_pay_reminder.selected = false;
}

obj.data.is_auto_pay = true;
obj.data.autoPay = true;

// 完整解锁完毕
obj.message = "patched";

$done({ body: JSON.stringify(obj) });
