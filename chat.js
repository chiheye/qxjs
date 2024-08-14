const url = 'https://www.typingmind.com/api/license';

// 修改响应内容
if ($request.url.indexOf(url) != -1) {
  let body = JSON.parse($response.body);
  body.payload.plan = 'premium';
  $done({body: JSON.stringify(body)});
} else {
  $done({});
}
