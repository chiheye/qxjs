/*
Goodnotes 订阅请求重写脚本
最后更新：2025.5.19 23:15

[rewrite_local]
^https:\/\/isi\.csan\.goodnotes.*\/v1\/subscribers\/[a-f0-9\-]{36}$ url script-request-body https://raw.githubusercontent.com/chiheye/qxjs/refs/heads/main/goodnotes_headers.js

[MITM]
hostname = isi.csan.goodnotes.com
*/




let body = {
  "code": 200,
  "message": "Success",
  "data": {
	"request_date_ms": 1728463564126,
	"request_date": "2024-10-09T08:46:04Z",
	"subscriber": {
		"non_subscriptions": {},
		"first_seen": "2024-10-09T08:46:04Z",
		"original_application_version": "1",
		"other_purchases": {},
		"subscriptions": {
			"com.goodnotes.plus.ai.premium_7dt_1y_2999": {
				"expires_date": "2222-12-22T22:22:22Z",
				"original_purchase_date": "2021-11-21T17:32:12Z",
				"purchase_date": "2021-11-21T17:32:12Z",
				"ownership_type": "PURCHASED",
				"store": "app_store",
				"is_sandbox": false
			},
			"com.goodnotes.premium_1y25off_1y_999": {
				"expires_date": "2222-12-22T22:22:22Z",
				"original_purchase_date": "2021-11-21T17:32:12Z",
				"purchase_date": "2021-11-21T17:32:12Z",
				"ownership_type": "PURCHASED",
				"store": "app_store",
				"is_sandbox": false
			},
			"com.goodnotes.premium_1y50off_1y_999": {
				"expires_date": "2222-12-22T22:22:22Z",
				"original_purchase_date": "2021-11-21T17:32:12Z",
				"purchase_date": "2021-11-21T17:32:12Z",
				"ownership_type": "PURCHASED",
				"store": "app_store",
				"is_sandbox": false
			},
			"com.goodnotes.premium_1yf_1y_999": {
				"expires_date": "2222-12-22T22:22:22Z",
				"original_purchase_date": "2021-11-21T17:32:12Z",
				"purchase_date": "2021-11-21T17:32:12Z",
				"ownership_type": "PURCHASED",
				"store": "app_store",
				"is_sandbox": false
			},
			"com.goodnotes.premium_7dt_1y_999": {
				"expires_date": "2222-12-22T22:22:22Z",
				"original_purchase_date": "2021-11-21T17:32:12Z",
				"purchase_date": "2021-11-21T17:32:12Z",
				"ownership_type": "PURCHASED",
				"store": "app_store",
				"is_sandbox": false
			},
			"com.goodnotes.premium_7dt": {
				"expires_date": "2222-12-22T22:22:22Z",
				"original_purchase_date": "2021-11-21T17:32:12Z",
				"purchase_date": "2021-11-21T17:32:12Z",
				"ownership_type": "PURCHASED",
				"store": "app_store",
				"is_sandbox": false
			},
			"com.goodnotes.one_time_unlock_legacy": {
				"expires_date": "2222-12-22T22:22:22Z",
				"original_purchase_date": "2021-11-21T17:32:12Z",
				"purchase_date": "2021-11-21T17:32:12Z",
				"ownership_type": "PURCHASED",
				"store": "app_store",
				"is_sandbox": false
			},
			"com.goodnotes.one_time_unlock_th_feb_2023": {
				"expires_date": "2222-12-22T22:22:22Z",
				"original_purchase_date": "2021-11-21T17:32:12Z",
				"purchase_date": "2021-11-21T17:32:12Z",
				"ownership_type": "PURCHASED",
				"store": "app_store",
				"is_sandbox": false
			},
			"com.goodnotes.one_time_unlock_alt": {
				"expires_date": "2222-12-22T22:22:22Z",
				"original_purchase_date": "2021-11-21T17:32:12Z",
				"purchase_date": "2021-11-21T17:32:12Z",
				"ownership_type": "PURCHASED",
				"store": "app_store",
				"is_sandbox": false
			},
			"com.goodnotes.one_time_unlock_free": {
				"expires_date": "2222-12-22T22:22:22Z",
				"original_purchase_date": "2021-11-21T17:32:12Z",
				"purchase_date": "2021-11-21T17:32:12Z",
				"ownership_type": "PURCHASED",
				"store": "app_store",
				"is_sandbox": false
			},
			"com.goodnotes.one_time_unlock": {
				"expires_date": "2222-12-22T22:22:22Z",
				"original_purchase_date": "2021-11-21T17:32:12Z",
				"purchase_date": "2021-11-21T17:32:12Z",
				"ownership_type": "PURCHASED",
				"store": "app_store",
				"is_sandbox": false
			},
			"com.goodnotes.gn6_one_time_unlock_2999": {
				"expires_date": "2222-12-22T22:22:22Z",
				"original_purchase_date": "2021-11-21T17:32:12Z",
				"purchase_date": "2021-11-21T17:32:12Z",
				"ownership_type": "PURCHASED",
				"store": "app_store",
				"is_sandbox": false
			},
			"com.goodnotes.gn6_one_time_unlock_3499": {
				"expires_date": "2222-12-22T22:22:22Z",
				"original_purchase_date": "2021-11-21T17:32:12Z",
				"purchase_date": "2021-11-21T17:32:12Z",
				"ownership_type": "PURCHASED",
				"store": "app_store",
				"is_sandbox": false
			},
			"com.goodnotes.gn6_one_time_unlock_3749": {
				"expires_date": "2222-12-22T22:22:22Z",
				"original_purchase_date": "2021-11-21T17:32:12Z",
				"purchase_date": "2021-11-21T17:32:12Z",
				"ownership_type": "PURCHASED",
				"store": "app_store",
				"is_sandbox": false
			},
			"com.goodnotes.gn6_one_time_unlock_3999": {
				"expires_date": "2222-12-22T22:22:22Z",
				"original_purchase_date": "2021-11-21T17:32:12Z",
				"purchase_date": "2021-11-21T17:32:12Z",
				"ownership_type": "PURCHASED",
				"store": "app_store",
				"is_sandbox": false
			}
		},
		"entitlements": {
			"ai_premium_202504": {
				"expires_date": "2222-12-22T22:22:22Z",
				"original_purchase_date": "2021-11-21T17:32:12Z",
				"purchase_date": "2021-11-21T17:32:12Z",
				"ownership_type": "PURCHASED",
				"store": "app_store",
				"is_sandbox": false,
				"product_identifier": "com.goodnotes.plus.ai.premium_7dt_1y_2999"
			},
			"apple_access": {
				"expires_date": "2222-12-22T22:22:22Z",
				"original_purchase_date": "2021-11-21T17:32:12Z",
				"purchase_date": "2021-11-21T17:32:12Z",
				"ownership_type": "PURCHASED",
				"store": "app_store",
				"is_sandbox": false,
				"product_identifier": "com.goodnotes.gn6_one_time_unlock_3999"
			},
			"crossplatform_access": {
				"expires_date": "2222-12-22T22:22:22Z",
				"original_purchase_date": "2021-11-21T17:32:12Z",
				"purchase_date": "2021-11-21T17:32:12Z",
				"ownership_type": "PURCHASED",
				"store": "app_store",
				"is_sandbox": false,
				"product_identifier": "com.goodnotes.premium_7dt"
			},
			"premium": {
				"expires_date": "2222-12-22T22:22:22Z",
				"original_purchase_date": "2021-11-21T17:32:12Z",
				"purchase_date": "2021-11-21T17:32:12Z",
				"ownership_type": "PURCHASED",
				"store": "app_store",
				"is_sandbox": false,
				"product_identifier": "com.goodnotes.premium_7dt"
			},
			"gn5": {
				"expires_date": "2222-12-22T22:22:22Z",
				"original_purchase_date": "2021-11-21T17:32:12Z",
				"purchase_date": "2021-11-21T17:32:12Z",
				"ownership_type": "PURCHASED",
				"store": "app_store",
				"is_sandbox": false,
				"product_identifier": "com.goodnotes.one_time_unlock"
			}
		},
		"original_purchase_date": "2024-06-10T11:12:09Z",
		"original_app_user_id": "$RCAnonymousID:c6c7b7d107034590bf95e0ad80a13b37",
		"last_seen": "2024-10-09T08:46:04Z"
	}
}
};

// 将 JSON 对象转换为字符串并返回
$done({ body: JSON.stringify(body) });
