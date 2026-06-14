# 07. 数据模型

## 数据库选择

MVP 使用 PostgreSQL 即可。

后期如果要做地理距离、附近推荐、空间查询，可以加 PostGIS。

## 表设计

### travel_plans

保存一次生成的旅行计划。

```sql
CREATE TABLE travel_plans (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  summary TEXT,
  destination TEXT NOT NULL,
  days INTEGER NOT NULL,
  budget_level TEXT,
  departure_city TEXT,
  request_json JSONB NOT NULL,
  plan_json JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### places

可选。MVP 可以只存 JSON，不拆 places 表。正式版建议拆。

```sql
CREATE TABLE places (
  id TEXT PRIMARY KEY,
  plan_id TEXT REFERENCES travel_plans(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  country TEXT NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  days INTEGER,
  description TEXT,
  tags JSONB,
  sort_order INTEGER NOT NULL
);
```

### geocoding_cache

缓存地理编码结果。

```sql
CREATE TABLE geocoding_cache (
  query TEXT PRIMARY KEY,
  name TEXT,
  country TEXT,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  provider TEXT,
  raw_json JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### ai_generation_logs

记录 AI 调用，不要保存敏感信息。

```sql
CREATE TABLE ai_generation_logs (
  id TEXT PRIMARY KEY,
  request_hash TEXT,
  model TEXT,
  status TEXT,
  latency_ms INTEGER,
  error_code TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 核心 JSON 结构

```json
{
  "id": "plan_abc123",
  "title": "日本 7 日动漫美食旅行",
  "summary": "适合第一次去日本的路线。",
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
      "description": "动漫、美食和购物中心。",
      "tags": ["动漫", "美食", "城市"]
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
      "title": "抵达东京",
      "items": ["抵达", "浅草寺", "秋叶原"]
    }
  ]
}
```

## 索引建议

```sql
CREATE INDEX idx_travel_plans_destination ON travel_plans(destination);
CREATE INDEX idx_travel_plans_created_at ON travel_plans(created_at DESC);
CREATE INDEX idx_places_plan_id ON places(plan_id);
```

如果使用 PostGIS：

```sql
CREATE EXTENSION IF NOT EXISTS postgis;
ALTER TABLE places ADD COLUMN geom geography(Point, 4326);
CREATE INDEX idx_places_geom ON places USING GIST (geom);
```

## 是否拆表？

MVP 建议：

- `travel_plans` 里保存完整 `plan_json`。
- 简单、快、改动少。

正式版建议：

- 保留 `plan_json` 快照。
- 同时拆 `places` 表，便于搜索和统计。

## 数据保留策略

- 未登录用户生成的路线保留 7-30 天。
- 登录用户路线长期保留。
- AI 调用日志保留 30-90 天。
- 地理编码缓存长期保留。
