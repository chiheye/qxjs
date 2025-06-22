/**
 * kuaikan_encrypt_buy.js
 * 伪造快看漫画支付成功结果，绕过 encrypt_buy_h5 验证
 */

const response = {
  code: 200,
  message: "ok",
  data: {
    status: 0,
    has_coupon: false,
    actual_kk_currency: 0,
    discount: 100,
    origin_kk_currency: 0,
    show_auto_pay_tip: false,
    balance_enough: true,
    coupon_info: null,
    coupon_used: false,
    auto_pay_selected: true,
    unlock_success: true
  },
  request_id: "fake-patched-id"
};

$done({ body: JSON.stringify(response) });
