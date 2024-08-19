/************************************
极狐签到脚本
************************
QuantumultX 远程脚本配置:
************************  
[rewrite_local]
# 获取arcfoxCookie
//^https:\/\/mg\.arcfox\.cn\/arcfox-brand\/public\/buriedPoint? url script-request-header https://raw.githubusercontent.com/chiheye/qxjs/main/arcfoxqd.js
^https:\/\/mg\.arcfox\.cn url script-request-header https://raw.githubusercontent.com/chiheye/qxjs/main/arcfoxqd.js
[mitm] 
hostname= mg.arcfox.cn
************************************/



