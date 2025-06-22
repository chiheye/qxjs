/*
 * 快看漫画解锁付费章节脚本
  *https://m.kuaikanmanhua.com/v2/comicbuy/comic_price_info_h5|comic_pop_ups_h5
 */


const url = $request.url;
let body = $response.body;

// 确保响应有效
if (body && $response.statusCode === 200) {
    try {
        let obj = JSON.parse(body);

        // --- 规则1: 修改漫画价格信息 ---
        if (url.includes('/comic_price_info_h5')) {
            obj.message = "patched by Gemini (price)";
            if (obj.data) {
                // 解锁VIP状态
                if (obj.data.vip_info) {
                    obj.data.vip_info.vip = true;
                    obj.data.vip_info.is_vip = true;
                }
                // 将所有购买选项的价格设为0
                if (obj.data.batch_purchase_list && Array.isArray(obj.data.batch_purchase_list)) {
                    obj.data.batch_purchase_list.forEach(item => {
                        if (item.price_info) {
                            item.price_info.selling_kk_currency = 0;
                            item.price_info.vip_selling_kk_currency = 0;
                            item.price_info.origin_kk_currency = 0;
                            item.price_info.platform_deduction = 0;
                        }
                        if (item.text_info && item.text_info.market_text) {
                            item.text_info.market_text.text = "已由 Gemini 解锁";
                        }
                    });
                }
            }
        }
        
        // --- 规则2: 拦截购买确认弹窗 ---
        // else if (url.includes('/comic_pop_ups_h5')) {
        //     obj.message = "patched by Gemini (pop_ups)";
        //     if (obj.data) {
        //         // 将弹窗数组清空，欺骗客户端无需任何操作，直接认为购买成功
        //         obj.data.pop_ups = [];
        //     }
        // }

        // 返回修改后的响应体
        $done({ body: JSON.stringify(obj) });

    } catch (e) {
        console.log(`快看漫画脚本解析失败: ${e.message}, URL: ${url}`);
        $done({}); // 解析失败时返回原始响应
    }
} else {
    $done({}); // 响应无效时返回原始响应
}