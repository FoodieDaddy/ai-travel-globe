# 前端代码生成 Prompt

适合交给 Cursor、Claude Code、ChatGPT 等代码助手生成项目。

```text
请帮我实现一个 React + Vite 的 AI 3D 旅行地图 MVP。

技术栈：
- React
- Vite
- globe.gl
- Tailwind CSS
- 原生 fetch 调用后端 API

页面要求：
1. 全屏深色背景。
2. 中间是 3D 地球。
3. 左侧是玻璃拟态行程面板。
4. 顶部有旅行需求输入表单。
5. 支持输入 destination、days、preferences、budgetLevel。
6. 点击生成后请求 POST /api/travel-plans/generate。
7. 返回 places 和 arcs 后在地球上显示点位和飞线。
8. 点击点位或行程卡片时，地球镜头飞到对应城市。
9. loading 状态要好看。
10. 错误状态要有提示。

请生成完整文件：
- package.json
- src/main.jsx
- src/App.jsx
- src/components/GlobeView.jsx
- src/components/TravelForm.jsx
- src/components/ItineraryPanel.jsx
- src/services/travelPlanApi.js
- src/data/demoPlan.js
- src/index.css

约束：
- 不要使用 Redux。
- Globe 实例只初始化一次。
- 先支持 mock 数据，如果 API 失败就回退 demoPlan。
- 所有样式用 Tailwind。
```
