# 02. 系统架构

## 总体架构

```text
用户浏览器
  |
  | HTTPS
  v
前端 Web 应用
  |
  | REST API
  v
后端 API 服务
  |
  | 调用
  v
AI 模型服务

后端 API 服务
  |
  | 查询/保存
  v
PostgreSQL

后端 API 服务
  |
  | 地理编码
  v
地图/地理编码服务

前端 Web 应用
  |
  | 加载静态资源
  v
OSS/COS/S3 + CDN
```

## MVP 架构

MVP 可以简化为：

```text
React 前端
  -> Node/FastAPI 后端
    -> AI API
    -> Geocoding API
    -> PostgreSQL
```

如果只是 demo，也可以先做纯前端静态版：

```text
React 前端
  -> 本地 JSON 路线数据
```

## 推荐目录结构

```text
travel-globe-app/
├── apps/
│   ├── web/                 # React/Next 前端
│   └── api/                 # 后端 API
├── packages/
│   ├── shared/              # 共享类型、schema
│   └── ui/                  # 可选，共享 UI
├── docs/
├── docker-compose.yml
└── README.md
```

如果你想简单：

```text
travel-globe-app/
├── frontend/
├── backend/
├── docs/
└── docker-compose.yml
```

## 模块划分

### 前端模块

1. `TravelForm`：用户输入旅行需求。
2. `GlobeView`：3D 地球。
3. `RouteArcs`：路线飞线。
4. `PlaceMarkers`：城市点位。
5. `ItineraryPanel`：行程卡片。
6. `PlaceDetailModal`：城市详情。
7. `ShareButton`：分享路线。

### 后端模块

1. `TravelPlanController`：路线生成接口。
2. `AIPlannerService`：调用大模型。
3. `GeocodingService`：地理编码。
4. `PlanRepository`：保存计划。
5. `ValidationService`：JSON 校验。
6. `CacheService`：缓存 AI 和地理编码结果。

## 数据流

### 生成路线

```text
用户提交需求
  -> 前端 POST /api/travel-plans/generate
  -> 后端校验输入
  -> 调用 AI 生成路线草案
  -> 校验 AI JSON
  -> 对城市做地理编码
  -> 生成 arcs 路线数据
  -> 保存数据库
  -> 返回前端
  -> 前端渲染 3D 地球
```

### 打开分享链接

```text
用户访问 /share/:id
  -> 前端请求 GET /api/travel-plans/:id
  -> 后端查数据库
  -> 返回完整路线 JSON
  -> 前端渲染
```

## 部署拓扑

### 低成本部署

```text
1 台 ECS/CVM
  - Nginx
  - 前端静态文件
  - 后端 API
  - PostgreSQL
```

### 推荐生产部署

```text
CDN + OSS/COS：前端静态资源
ECS/CVM：后端 API
RDS PostgreSQL：数据库
Redis：缓存
AI 服务：第三方 API 或自建 Ollama
```

## 外部服务

| 服务 | 用途 | 可替代方案 |
|---|---|---|
| AI API | 生成旅行路线 | Ollama、DeepSeek、通义千问、OpenAI |
| Geocoding API | 城市转经纬度 | 高德、Mapbox、Google、OpenStreetMap Nominatim |
| Object Storage | 图片和静态资源 | OSS、COS、S3 |
| CDN | 加速资源 | 阿里云 CDN、腾讯云 CDN、Cloudflare |

## 关键设计原则

1. AI 输出必须结构化。
2. 经纬度必须可信，尽量通过地理编码验证。
3. 3D 地球只负责展示，不承担复杂业务逻辑。
4. 后端保存完整路线快照，避免每次打开都重新生成。
5. 所有外部 API 调用都要设置超时、重试和错误兜底。
