# 03. 前端实现计划

## 技术选择

MVP 推荐：

```text
React + Vite + globe.gl + Tailwind CSS
```

如果想做成正式产品：

```text
Next.js + react-globe.gl + Tailwind CSS + shadcn/ui + Framer Motion
```

## 安装依赖

```bash
npm create vite@latest travel-globe-web -- --template react
cd travel-globe-web
npm install
npm install globe.gl three
npm install axios zod
npm install -D tailwindcss postcss autoprefixer
```

## 页面结构

```text
src/
├── App.jsx
├── main.jsx
├── components/
│   ├── GlobeView.jsx
│   ├── TravelForm.jsx
│   ├── ItineraryPanel.jsx
│   ├── PlaceCard.jsx
│   └── LoadingOverlay.jsx
├── services/
│   └── travelPlanApi.js
├── data/
│   └── demoPlan.js
└── styles/
    └── globals.css
```

## 核心组件

### 1. TravelForm

职责：

- 收集用户旅行需求。
- 包含目的地、天数、偏好、预算。
- 提交给后端生成路线。

字段：

```ts
type TravelRequest = {
  destination: string;
  days: number;
  preferences: string[];
  budgetLevel: 'low' | 'medium' | 'high';
  departureCity?: string;
};
```

### 2. GlobeView

职责：

- 初始化 3D 地球。
- 渲染城市点位。
- 渲染城市之间的 arcs 飞线。
- 点击城市后触发镜头移动。

数据：

```ts
type Place = {
  id: string;
  name: string;
  country: string;
  lat: number;
  lng: number;
  days: number;
  description: string;
};
```

### 3. ItineraryPanel

职责：

- 展示每天行程。
- 支持点击城市。
- 支持重新生成。
- 支持分享。

## MVP 交互流程

```text
打开页面
  -> 地球显示默认状态
  -> 用户输入旅行需求
  -> 点击生成
  -> 显示 loading
  -> 后端返回路线
  -> 地球飞到第一个城市
  -> 显示点位和飞线
  -> 左侧行程卡片更新
```

## Globe.gl 基础代码骨架

```jsx
import { useEffect, useRef } from 'react';
import Globe from 'globe.gl';

export function GlobeView({ places, arcs, selectedPlace, onPlaceClick }) {
  const containerRef = useRef(null);
  const globeRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const globe = Globe()(containerRef.current)
      .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
      .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')
      .pointsData(places)
      .pointLat('lat')
      .pointLng('lng')
      .pointRadius(0.35)
      .pointAltitude(0.05)
      .pointLabel(d => `${d.name} - ${d.country}`)
      .onPointClick(onPlaceClick)
      .arcsData(arcs)
      .arcStartLat('startLat')
      .arcStartLng('startLng')
      .arcEndLat('endLat')
      .arcEndLng('endLng')
      .arcAltitude(0.25)
      .arcDashLength(0.4)
      .arcDashGap(2)
      .arcDashAnimateTime(1800);

    globe.controls().autoRotate = true;
    globe.controls().autoRotateSpeed = 0.5;
    globeRef.current = globe;

    return () => {
      containerRef.current.innerHTML = '';
    };
  }, []);

  useEffect(() => {
    if (!globeRef.current) return;
    globeRef.current.pointsData(places);
    globeRef.current.arcsData(arcs);
  }, [places, arcs]);

  useEffect(() => {
    if (!globeRef.current || !selectedPlace) return;
    globeRef.current.pointOfView(
      { lat: selectedPlace.lat, lng: selectedPlace.lng, altitude: 1.5 },
      1200
    );
  }, [selectedPlace]);

  return <div ref={containerRef} className="w-full h-full" />;
}
```

## 样式要求

视觉方向：

- 深色背景。
- 玻璃拟态侧边栏。
- 城市点位高亮。
- 飞线使用青蓝、金色、紫色等科技感颜色。
- loading 使用 AI 生成中动效。

## 前端状态管理

MVP 可使用 React 内置状态：

```ts
const [plan, setPlan] = useState(null);
const [loading, setLoading] = useState(false);
const [selectedPlace, setSelectedPlace] = useState(null);
```

正式版可使用：

- Zustand。
- TanStack Query。
- Redux Toolkit，不是必须。

## 前端错误处理

必须处理：

- AI 生成失败。
- 后端超时。
- 地理编码失败。
- 返回数据为空。
- 浏览器不支持 WebGL。

错误文案：

```text
路线生成失败，请稍后重试。
地图加载失败，请检查浏览器是否支持 WebGL。
这个目的地暂时无法识别，请换个说法试试。
```

## 前端性能优化

- 地球组件只初始化一次。
- 数据更新时只调用 `.pointsData()` 和 `.arcsData()`。
- 不要频繁销毁重建 Globe。
- 点位数量超过 100 时要聚合。
- 图片纹理使用 CDN。
- 移动端降低效果，如关闭自动旋转或减少飞线。
