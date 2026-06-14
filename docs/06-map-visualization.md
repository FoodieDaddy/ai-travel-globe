# 06. 地图可视化实现

## 目标效果

视觉目标类似短视频里的 AI 旅行地图：

- 深色宇宙背景。
- 3D 地球。
- 城市发光点。
- 城市之间飞线。
- 侧边栏行程卡片。
- 点击城市镜头飞过去。
- 自动旋转。

## 推荐库

### MVP

```text
globe.gl
```

优势：

- 上手最快。
- 支持 points、arcs、labels、rings。
- 基于 Three.js。
- 适合酷炫展示。

### React 封装

```text
react-globe.gl
```

适合 React 项目。

### 更专业 GIS

```text
CesiumJS
```

适合数字孪生、真实地理、3D 城市，不建议 MVP 一开始上。

## 数据结构

### 点位数据

```ts
type GlobePoint = {
  id: string;
  name: string;
  country: string;
  lat: number;
  lng: number;
  days: number;
  description: string;
  tags: string[];
};
```

### 飞线数据

```ts
type GlobeArc = {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  from: string;
  to: string;
};
```

## 从 places 生成 arcs

```ts
function buildArcs(places) {
  const arcs = [];

  for (let i = 0; i < places.length - 1; i++) {
    arcs.push({
      from: places[i].name,
      to: places[i + 1].name,
      startLat: places[i].lat,
      startLng: places[i].lng,
      endLat: places[i + 1].lat,
      endLng: places[i + 1].lng
    });
  }

  return arcs;
}
```

## 交互设计

### 悬浮点位

显示：

- 城市名。
- 国家。
- 停留天数。
- 推荐理由。

### 点击点位

行为：

- 左侧选中城市卡片。
- 地球镜头飞到城市。
- 点位高亮。

### 点击行程卡片

行为：

- 地球镜头飞到对应城市。
- 显示城市详情。

## 镜头移动

```js
globe.pointOfView({
  lat: place.lat,
  lng: place.lng,
  altitude: 1.5
}, 1200);
```

## 视觉参数建议

| 项目 | 建议值 |
|---|---|
| pointRadius | 0.2 - 0.5 |
| pointAltitude | 0.03 - 0.08 |
| arcAltitude | 0.15 - 0.35 |
| arcDashAnimateTime | 1500 - 2500 |
| autoRotateSpeed | 0.2 - 0.8 |

## 移动端策略

移动端性能弱，建议：

- 降低点位数量。
- 飞线数量少于 20。
- 关闭复杂背景。
- 降低纹理分辨率。
- 侧边栏改为底部抽屉。

## 备用方案

如果 WebGL 不支持：

- 显示 2D 地图。
- 或显示纯行程卡片。
- 给出提示：当前浏览器不支持 3D 地球。

## 常见问题

### 地球不显示

检查：

- 容器高度是否为 0。
- WebGL 是否可用。
- three/globe.gl 是否安装。
- 纹理图片是否加载失败。

### 点位偏移

检查：

- 经纬度是否反了。
- `lat` 是纬度，`lng` 是经度。
- 中国城市经纬度如果来自高德/百度，可能有坐标系偏移。全球展示一般建议使用 WGS84。

### 页面卡顿

处理：

- 减少点位和飞线。
- 不使用过多 HTML Marker。
- 降低地球纹理分辨率。
- 不要频繁重建 Globe 实例。
