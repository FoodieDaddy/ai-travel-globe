# 04. 后端 API 设计

## 技术选择

任选其一：

### Node.js 方案

```text
NestJS / Express / Fastify
```

适合前后端都用 TypeScript。

### Python 方案

```text
FastAPI
```

适合后续做 AI、数据处理、地理数据。

## API 列表

### 1. 生成旅行路线

```http
POST /api/travel-plans/generate
```

请求：

```json
{
  "destination": "日本",
  "days": 7,
  "preferences": ["动漫", "美食", "自然风景"],
  "budgetLevel": "medium",
  "departureCity": "上海"
}
```

响应：

```json
{
  "success": true,
  "data": {
    "id": "plan_abc123",
    "title": "日本 7 日动漫美食旅行",
    "destination": "日本",
    "days": 7,
    "places": [],
    "arcs": [],
    "itinerary": []
  }
}
```

### 2. 获取路线详情

```http
GET /api/travel-plans/:id
```

### 3. 保存路线

```http
POST /api/travel-plans
```

### 4. 删除路线

```http
DELETE /api/travel-plans/:id
```

### 5. 重新生成路线

```http
POST /api/travel-plans/:id/regenerate
```

## 统一响应格式

成功：

```json
{
  "success": true,
  "data": {}
}
```

失败：

```json
{
  "success": false,
  "error": {
    "code": "AI_GENERATION_FAILED",
    "message": "路线生成失败，请稍后重试"
  }
}
```

## 错误码

| code | 含义 |
|---|---|
| INVALID_INPUT | 用户输入不合法 |
| AI_TIMEOUT | AI 调用超时 |
| AI_GENERATION_FAILED | AI 生成失败 |
| AI_JSON_INVALID | AI 返回 JSON 不合法 |
| GEOCODING_FAILED | 地理编码失败 |
| PLAN_NOT_FOUND | 路线不存在 |
| INTERNAL_ERROR | 服务内部错误 |

## 后端生成路线流程

```text
1. 校验用户输入
2. 生成 prompt
3. 调用 AI
4. 提取 JSON
5. 用 schema 校验 JSON
6. 对城市执行地理编码
7. 生成 arcs
8. 保存数据库
9. 返回前端
```

## 输入校验规则

```ts
const rules = {
  destination: '必填，1-50 字',
  days: '1-30 天',
  preferences: '最多 10 个，每个 1-20 字',
  budgetLevel: 'low | medium | high',
  departureCity: '可选，1-50 字'
};
```

## AI 调用超时

建议：

```text
AI 请求超时：30 秒
地理编码超时：5 秒
整个生成接口超时：45 秒
```

## 伪代码

```ts
async function generateTravelPlan(input) {
  validateInput(input);

  const prompt = buildPlannerPrompt(input);
  const aiResult = await aiService.generateJson(prompt, { timeout: 30000 });
  const plan = validateTravelPlanSchema(aiResult);

  for (const place of plan.places) {
    const geo = await geocodingService.resolve(place.name, place.country);
    place.lat = geo.lat;
    place.lng = geo.lng;
  }

  plan.arcs = buildArcs(plan.places);
  plan.id = generateId();

  await planRepository.save(plan);
  return plan;
}
```

## 后端安全要求

- 限制请求频率。
- 限制输入长度。
- API Key 只存服务端环境变量。
- 不把 AI 原始错误完整返回给前端。
- 生产环境开启 CORS 白名单。
- 重要接口加鉴权。
