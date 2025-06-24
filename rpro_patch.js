/*
------------------------------------------
# R-model 解锁
# 更新日期：2025.06.24
------------------------------------------
[Script]
Raycast_pro = type=http-response,pattern=^https:\/\/backend\.raycast\.com\/api\/v1\/(me|ai\/models|me\/sync.*)$,requires-body=1,max-size=0,script-path=https://raw.githubusercontent.com/chiheye/qxjs/refs/heads/main/rpro_patch.js

[MITM]
hostname = %APPEND% backend.raycast.com
*/

console.log("[Raycast] Script started for URL: " + $request.url);

try {
    let body = $response.body;
    if (!body) {
        console.log("[Raycast] No response body for URL: " + $request.url);
        $done({});
    } else {
        console.log("[Raycast] Original body: " + body);
        let obj = JSON.parse(body);

        let modified = false;
        function replacePeriodEnd(data) {
            if (typeof data !== "object" || data === null) return;
            for (let key in data) {
                if (key === "current_period_end") {
                    data[key] = 4102444800;
                    modified = true;
                    console.log("[Raycast] Set current_period_end to 4102444800 for key: " + key);
                } else if (typeof data[key] === "object") {
                    replacePeriodEnd(data[key]);
                }
            }
        }

        if ($request.url.includes("/api/v1/me") && !$request.url.includes("/sync")) {
    console.log("[Raycast] Processing /api/v1/me with extensive modifications...");
    if (obj) { // 确保 obj 存在
        // --- 新增的修改 ---
        obj.has_pro_features = true;
        obj.has_active_subscription = true;
        obj.has_running_subscription = true;
        obj.eligible_for_pro_features = true;
        obj.eligible_for_raycast_notes_beta = true;
        obj.has_better_ai = true;
        obj.eligible_for_ai = true;
        obj.eligible_for_file_search_beta = true;
        obj.eligible_for_bext = true;
        obj.has_developer_extensions = true;
        obj.eligible_for_cloud_sync = true;
        obj.publishing_bot = true;
        obj.has_better_ai = true;
        obj.eligible_for_windows = true;
        obj.can_modify_subscription_interval = true;
        obj.eligible_for_hyper_key = true;
        obj.broken_raycast_client = true;
        obj.eligible_for_gpt4 = true;
        obj.eligible_for_developer_hub = true;
        obj.has_contributions_or_extensions = true;
        obj.can_use_referral_codes = true;
        obj.any_organization_has_active_subscription = true;
        obj.eligible_for_application_settings = true;
        
        
        // --- 修改 mobile_subscription 对象内部 ---
        if (obj.mobile_subscription) {
            obj.mobile_subscription.status = "active"; // 将 "expired" 改为 "active"
            obj.mobile_subscription.running = true;
            obj.mobile_subscription.interval =  "year";
            obj.mobile_subscription.has_better_ai = true;
        }

        // --- 保留原始的核心修改 ---
        if (obj.mobile_subscription && "current_period_end" in obj.mobile_subscription) {
            obj.mobile_subscription.current_period_end = 4102444800;
        } else if (obj.mobile_subscription) {
            // 如果原本没有 current_period_end，也给它加上
            obj.mobile_subscription.current_period_end = 4102444800;
        }

        modified = true;
        console.log("[Raycast] Set multiple Pro flags to true.");
    }
}


        if ($request.url.includes("/api/v1/ai/models") || $request.url.includes("/api/v1/me/sync")) {
            console.log("[Raycast] Processing " + ($request.url.includes("/ai/models") ? "/api/v1/ai/models" : "/api/v1/me/sync"));
            replacePeriodEnd(obj);
            if (!modified) {
                console.log("[Raycast] No current_period_end found in " + ($request.url.includes("/ai/models") ? "/api/v1/ai/models" : "/api/v1/me/sync"));
            }
        }

        body = JSON.stringify(obj);
        console.log("[Raycast] Modified body: " + body);
        $done({ body });
    }
} catch (e) {
    console.log("[Raycast] Error: " + e.message);
    $done({ body: $response.body });
}
