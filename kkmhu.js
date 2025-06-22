/**
 * kuaikan_user_me.js
 * 修改快看用户信息，伪装 VIP、改昵称等
 */

let obj = JSON.parse($response.body);

obj.data.phone_login_user.nickname = "我是尊贵的VIP用户";
obj.data.user.nickname = "我是尊贵的VIP用户";
obj.data.user.vip_type = 6;  // 伪装 VIP 类型（1普通VIP，2超级VIP）
obj.data.user.avatar_url = "https://i.imgur.com/QZJ1bXU.jpg";  // 自定义头像
obj.data.user.avatar_url_jpg = "https://i.imgur.com/QZJ1bXU.jpg";

obj.data.user.grade = 10; // 用户等级
obj.data.user.vip_icon = "https://i.imgur.com/xzQbaPt.png"; // 自定义VIP图标（可空）

// 添加铭牌或勋章
obj.data.user.nameplate_id = 999;
obj.data.user.nameplate_image = "https://i.imgur.com/I1Xldgu.png";

// 添加用户标签
obj.data.user.userTagList = [
  {
    "tag_type": 1,
    "tag_name": "老司机认证",
    "tag_id": 123,
    "style_type": 2,
    "tag_color": "#FF6600",
    "background_color": "#FFF2E8"
  }
];

// 修改背景图
obj.data.base_info.back_groud_url = "https://i.imgur.com/3mCzEiS.jpg";

// 修改引导语、介绍
obj.data.base_info.uintro = "我是VIP，开车不迷路 🚗";
obj.data.base_info.intro = "专注解锁快看漫画三十年";

$done({ body: JSON.stringify(obj) });
