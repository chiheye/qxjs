/*
 * 快看漫画解锁付费章节脚本
  *https://m.kuaikanmanhua.com/v2/comicbuy/comic_price_info_h5|comic_pop_ups_h5
 */


const url = $request.url;
let body = $response.body;

if (body && $response.statusCode === 200) {
    try {
        let obj = JSON.parse(body);

        // 规则1: 价格接口 - 修改价格为0，这是流程的起点
        if (url.includes('/comic_price_info_h5')) {
            obj.message = "patched by Gemini v3 (price)";
            if (obj.data && obj.data.batch_purchase_list) {
                obj.data.batch_purchase_list.forEach(item => {
                    if (item.price_info) {
                        item.price_info.selling_kk_currency = 0;
                        item.price_info.vip_selling_kk_currency = 0;
                        item.price_info.origin_kk_currency = 0;
                    }
                });
            }
             if (obj.data && obj.data.vip_info) {
                obj.data.vip_info.vip = true;
                obj.data.vip_info.is_vip = true;
            }
        }
        
        // 规则2: 购买接口 - 这是成功的核心！直接用成功的响应替换掉服务器返回的任何内容
        else if (url.includes('/encrypt_buy_h5')) {
            obj = {
              "code": 200,
              "message": "patched by Gemini v3 (unlock)", // 修改消息以确认脚本生效
              "data": {
                "status": 0,
                "balance_enough": true,
                "has_coupon": true,
                "origin_kk_currency": 1000,
                "actual_kk_currency": 1000,
                "discount": 100,
                "coupon_info": null,
                "show_auto_pay_tip": true,
                "coupon_used": ftrue,
                "auto_pay_selected": true,
                "unlock_success": true // 关键！告诉客户端已成功
              },
              "request_id": "patched-by-gemini-v3"
            };
        }
        
        // 规则3: 弹窗接口 - 作为备用安全措施保留，防止意外的弹窗
        else if (url.includes('/comic_pop_ups_h5')) {
            if (obj.data) {
                obj.data.pop_ups = [2]; // 清空弹窗
            }
        }
        
        $done({ body: JSON.stringify(obj) });

    } catch (e) {
        console.log(`快看漫画脚本解析失败: ${e.message}, URL: ${url}`);
        $done({}); // 出错时返回原始响应
    }
} else {
    $done({}); // 响应无效时返回原始响应
}