# API 响应示例

## 生成路线成功

```json
{
  "success": true,
  "data": {
    "id": "plan_japan_7d_001",
    "title": "日本 7 日动漫美食旅行",
    "summary": "从东京的动漫街区到京都的传统文化，再到大阪的美食和乐园。",
    "destination": "日本",
    "days": 7,
    "places": [
      {
        "id": "tokyo",
        "name": "东京",
        "country": "日本",
        "lat": 35.6762,
        "lng": 139.6503,
        "days": 3,
        "description": "适合动漫、购物和城市探索。",
        "tags": ["动漫", "美食", "城市"]
      },
      {
        "id": "kyoto",
        "name": "京都",
        "country": "日本",
        "lat": 35.0116,
        "lng": 135.7681,
        "days": 2,
        "description": "适合传统文化、神社和古街区。",
        "tags": ["文化", "寺庙", "摄影"]
      }
    ],
    "arcs": [
      {
        "from": "东京",
        "to": "京都",
        "startLat": 35.6762,
        "startLng": 139.6503,
        "endLat": 35.0116,
        "endLng": 135.7681
      }
    ],
    "itinerary": [
      {
        "day": 1,
        "city": "东京",
        "title": "抵达东京与浅草体验",
        "items": ["抵达东京", "浅草寺", "秋叶原夜游"]
      }
    ]
  }
}
```

## 生成路线失败

```json
{
  "success": false,
  "error": {
    "code": "AI_GENERATION_FAILED",
    "message": "路线生成失败，请稍后重试"
  }
}
```

## 输入不合法

```json
{
  "success": false,
  "error": {
    "code": "INVALID_INPUT",
    "message": "旅行天数必须在 1 到 30 天之间"
  }
}
```
