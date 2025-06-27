/*
 * 脚本名称: 喜马拉雅价格接口修改
 * 脚本作者: Gemini
 * 更新时间: 2025-06-27
 * 脚本功能: 修改专辑价格接口的返回数据，实现解锁效果。
 * 使用方法: 配合QuanX重写规则使用。
 *
 * QuanX重写规则:
 * ^https://mobile\.ximalaya\.com/product/promotion/v1/album/price/ts-\d+ script-response-body xmly.js
 */

// 获取原始的服务器响应体
let body = $response.body;

// 尝试将响应体解析为JSON对象
try {
  let obj = JSON.parse(body);

  // 检查关键数据结构是否存在
  if (obj && obj.data && obj.data.behaviors) {
    console.log("喜马拉雅价格接口：成功匹配并开始修改响应...");

    // 核心修改 1: 修改提示文案，提供视觉反馈
    obj.data.afterSampleTitle = "已为您成功解锁";
    obj.data.afterSampleSubTitle = "请畅享完整版内容";

    // 核心修改 2: 清空行为数组
    // App通过这个数组来决定显示“购买”还是“开会员”等按钮。
    // 将其清空后，App通常会认为没有需要用户操作的行为，从而直接放行。
    obj.data.behaviors = [];
    
    // (可选) 核心修改 3: 如果清空behaviors无效，可以尝试伪造一个“已拥有”的行为
    // 通常清空即可，此部分作为备用方案。如果上面的方法无效，可以注释掉上面的 obj.data.behaviors = []; 换成下面这段。
    /*
    obj.data.behaviors = [
      {
        "type": "owned", // 伪造成“已拥有”
        "code": "SUCCESS",
        "isHidden": false
      }
    ];
    */

    // 将修改后的JSON对象转换回字符串格式
    body = JSON.stringify(obj);
    
    console.log("喜马拉雅价格接口：响应修改成功！");

  } else {
    console.log("喜马拉雅价格接口：响应JSON结构不匹配，未进行修改。");
  }

  // 结束脚本，并将修改后的响应体返回给App
  $done({ body });

} catch (e) {
  // 如果解析失败，打印错误日志并返回原始响应，避免App出错
  console.log("喜马拉雅价格接口脚本错误: " + e);
  $done({});
}
