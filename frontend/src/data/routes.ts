import { TravelRoute } from '../types/travel';
import { GLOBAL_CITIES } from './cities';

function getCity(id: string) {
  return GLOBAL_CITIES.find(c => c.id === id)!;
}

export const PRESET_ROUTES: TravelRoute[] = [
  {
    id: "route_asia_1",
    title: "亚洲灵感路线",
    summary: "穿梭于东亚都会与东南亚海岛的灵感之旅。",
    destination: "Asia",
    days: 14,
    budget: "Medium",
    style: ["城市", "美食", "文化"],
    places: [
      { ...getCity("tokyo"), days: 4, description: "现代都会与传统文化的碰撞。", tags: ["动漫", "科技"] },
      { ...getCity("shanghai"), days: 3, description: "魔都的繁华与历史交融。", tags: ["外滩", "美食"] },
      { ...getCity("singapore"), days: 3, description: "花园城市，未来感与热带风情。", tags: ["花园", "建筑"] },
      { ...getCity("bali"), days: 4, description: "心灵之旅，冲浪与悬崖落日。", tags: ["海岛", "放松"] }
    ],
    arcs: [
      { from: "Tokyo", to: "Shanghai", startLat: 35.6762, startLng: 139.6503, endLat: 31.2304, endLng: 121.4737 },
      { from: "Shanghai", to: "Singapore", startLat: 31.2304, startLng: 121.4737, endLat: 1.3521, endLng: 103.8198 },
      { from: "Singapore", to: "Bali", startLat: 1.3521, startLng: 103.8198, endLat: -8.4095, endLng: 115.1889 }
    ],
    itinerary: []
  },
  {
    id: "route_eu_1",
    title: "欧洲经典路线",
    summary: "探寻古典艺术、浪漫之都与地中海阳光。",
    destination: "Europe",
    days: 12,
    budget: "High",
    style: ["历史", "艺术", "浪漫"],
    places: [
      { ...getCity("london"), days: 4, description: "雾都的古典与现代交织。", tags: ["大本钟", "博物馆"] },
      { ...getCity("paris"), days: 4, description: "浪漫之都，艺术的殿堂。", tags: ["卢浮宫", "时尚"] },
      { ...getCity("rome"), days: 4, description: "永恒之城，古罗马的废墟之上。", tags: ["斗兽场", "历史"] }
    ],
    arcs: [
      { from: "London", to: "Paris", startLat: 51.5074, startLng: -0.1278, endLat: 48.8566, endLng: 2.3522 },
      { from: "Paris", to: "Rome", startLat: 48.8566, startLng: 2.3522, endLat: 41.9028, endLng: 12.4964 }
    ],
    itinerary: []
  },
  {
    id: "route_us_1",
    title: "美洲西海岸之旅",
    summary: "从繁华纽约到阳光加州，横跨美洲大陆。",
    destination: "USA",
    days: 10,
    budget: "High",
    style: ["城市", "娱乐", "海岸"],
    places: [
      { ...getCity("new_york"), days: 5, description: "世界十字路口，不夜城。", tags: ["华尔街", "百老汇"] },
      { ...getCity("los_angeles"), days: 5, description: "天使之城，好莱坞的阳光海岸。", tags: ["好莱坞", "海滩"] }
    ],
    arcs: [
      { from: "New York", to: "Los Angeles", startLat: 40.7128, startLng: -74.0060, endLat: 34.0522, endLng: -118.2437 }
    ],
    itinerary: []
  }
];
