/*
 * 功能：解锁快看漫画h5网页端支付窗口
 * 目标URL：https://m.kuaikanmanhua.com/v2/comicbuy/comic_price_info_h5
 */

// 检查是否是目标请求
if ($request.url.includes("/v2/comicbuy/comic_price_info_h5")) {
  // 解析服务器返回的原始 JSON 数据
  let obj = JSON.parse($response.body);

  // 安全地访问 price_info
  const priceInfo = obj?.data?.price_info;

  if (priceInfo) {
    // 1. 修改VIP信息，伪装成VIP
    if (priceInfo.vip_info) {
      priceInfo.vip_info.vip = true;
      priceInfo.vip_info.is_vip = true;
    }

    // 2. 修改KK币余额，显示一个较大的数字
    priceInfo.kk_currency_balance = 999999;

    // 3. 关闭自动支付的弹窗提示
    if (priceInfo.auto_pay_reminder) {
      priceInfo.auto_pay_reminder.show = false;
    }

    // 4. 遍历所有购买选项（本话、10话、剩余全部等）
    if (Array.isArray(priceInfo.batch_purchase_list)) {
      priceInfo.batch_purchase_list.forEach(item => {
        // 修改价格信息
        if (item.price_info) {
          item.price_info.origin_kk_currency = 0;
          item.price_info.selling_kk_currency = 0;
          item.price_info.vip_selling_kk_currency = 0;
          item.price_info.platform_deduction = 0;
          item.price_info.total_discount = 100; // 100% 折扣
          item.price_info.deduction_texts = ["限时免费"];
          item.price_info.icon_text = "已解锁";
        }

        // 修改按钮文案
        if (item.icon) {
          item.icon.copywriting = "已拥有";
        }
        item.text = `已解锁 (${item.text})`; // 例如: "已解锁 (本话)"

        // 修改文本详情
        if (item.text_info) {
          item.text_info.market_text = {
            text: "限免中",
            discount_text: ""
          };
          if (item.text_info.discount_label) {
            item.text_info.discount_label.left_text = "限免";
            item.text_info.discount_label.right_text = "0 KK币";
          }
        }
      });
    }

    // 如果有单独购买的选项也一并修改
    if (priceInfo.single_purchase && priceInfo.single_purchase.price_info) {
        priceInfo.single_purchase.price_info.origin_kk_currency = 0;
        priceInfo.single_purchase.price_info.selling_kk_currency = 0;
        priceInfo.single_purchase.price_info.vip_selling_kk_currency = 0;
    }
  }
  
  // 修改外层 message，方便调试时确认脚本已生效
  obj.message = "patched by Gemini";

  // 将修改后的对象变回 JSON 字符串，作为新的返回体
  $done({ body: JSON.stringify(obj) });

} else {
  // 如果不是目标 URL，不做任何操作
  $done({});
}