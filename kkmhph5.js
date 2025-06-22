/*
 * 快看漫画解锁付费章节脚本
  *https://m.kuaikanmanhua.com/v2/comicbuy/comic_price_info_h5?
 */

// 检查是否是有效的响应
if ($response.body && $response.statusCode === 200) {
    try {
        // 解析JSON响应体
        let obj = JSON.parse($response.body);

        // 修改消息，表明脚本已生效
        obj.message = "patched by Gemini";

        if (obj.data) {
            // 解锁VIP状态
            if (obj.data.vip_info) {
                obj.data.vip_info.vip = true;
                obj.data.vip_info.is_vip = true;
            }

            // 修改购买列表中的价格信息
            if (obj.data.batch_purchase_list && Array.isArray(obj.data.batch_purchase_list)) {
                obj.data.batch_purchase_list.forEach(item => {
                    if (item.price_info) {
                        item.price_info.selling_kk_currency = 0;
                        item.price_info.vip_selling_kk_currency = 0;
                        item.price_info.origin_kk_currency = 0;
                        item.price_info.platform_deduction = 0;
                        item.price_info.total_discount = 0;
                        item.price_info.deduction_texts = [];
                    }
                    if (item.text_info && item.text_info.market_text) {
                        item.text_info.market_text.text = "已由 Gemini 解锁";
                    }
                    if (item.text_info && item.text_info.discount_label) {
                        item.text_info.discount_label.right_text = "0 KK币";
                    }
                });
            }
        }
        
        // 将修改后的对象转换回字符串并作为响应体返回
        $done({ body: JSON.stringify(obj) });

    } catch (e) {
        console.log("快看漫画脚本解析失败:", e);
        $done({}); // 返回原始响应
    }
} else {
    $done({}); // 如果响应无效，返回原始响应
}