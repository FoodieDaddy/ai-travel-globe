# AI 3D 交互式全球旅行地图：实现计划

这是一个面向「AI 旅行地图 / 3D 全球交互地图」的完整实现计划文件夹。目标是先做出可演示 MVP，再逐步产品化。

## 项目目标

用户输入旅行需求，例如：

> 我想去日本玩 7 天，喜欢动漫、美食和自然风景，预算中等。

系统输出：

1. AI 生成的旅行路线。
2. 3D 地球上展示城市点位。
3. 城市之间显示飞线动画。
4. 左侧显示每天行程卡片。
5. 点击城市，地球镜头飞到对应位置。
6. 支持保存、分享、重新生成路线。

## 推荐技术栈

| 模块 | 技术 |
|---|---|
| 前端 | React + Vite / Next.js |
| 3D 地球 | globe.gl / react-globe.gl / three-globe |
| UI | Tailwind CSS + shadcn/ui |
| 动效 | Framer Motion |
| 后端 | Node.js/NestJS 或 Python FastAPI |
| AI | OpenAI / DeepSeek / 通义千问 / Ollama 本地模型 |
| 地理编码 | 高德地图 / Mapbox / Google Geocoding |
| 数据库 | PostgreSQL，后期可加 PostGIS |
| 缓存 | Redis，可选 |
| 文件存储 | OSS/COS/S3，可选 |
| 部署 | Vercel / 阿里云 ECS / 腾讯云 CVM / Docker Compose |

## 文件结构

```text
ai-travel-globe-plan/
├── README.md
├── docs/
│   ├── 00-product-scope.md
│   ├── 01-constraints.md
│   ├── 02-architecture.md
│   ├── 03-frontend-implementation.md
│   ├── 04-backend-api.md
│   ├── 05-ai-route-generation.md
│   ├── 06-map-visualization.md
│   ├── 07-data-model.md
│   ├── 08-deployment.md
│   ├── 09-security-cost-ops.md
│   └── 10-roadmap.md
├── prompts/
│   ├── ai-route-planner-prompt.md
│   ├── geocoding-normalizer-prompt.md
│   └── frontend-codegen-prompt.md
├── schemas/
│   ├── travel-plan.schema.json
│   └── api-response-examples.md
└── checklists/
    ├── mvp-checklist.md
    ├── test-checklist.md
    └── launch-checklist.md
```

## MVP 标准

MVP 不追求复杂功能，先做出能展示的视频同款效果：

- 输入旅行偏好。
- AI 返回结构化 JSON。
- 前端 3D 地球显示点位和飞线。
- 左侧显示行程卡片。
- 支持点击点位、切换城市、重新生成。
- 支持部署到公网。

## 实施顺序

1. 静态数据版 3D 地球。
2. 接入后端 API。
3. 接入 AI 生成旅行 JSON。
4. 接入地理编码，保证经纬度准确。
5. 加保存和分享功能。
6. 加账户、历史记录、收藏。
7. 产品化部署和监控。

