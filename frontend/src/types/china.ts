export interface ChinaPlace {
  id: string;
  name: string;
  province: string;
  region: "华北" | "华东" | "华南" | "西南" | "西北" | "东北" | "华中";
  lat: number;
  lng: number;
  type: "city" | "landmark" | "nature" | "museum" | "food" | "route" | "custom";
  description: string;
  highlights: string[];
  tags: string[];
  visited: boolean;
  visitedAt?: string;
  season?: string;
  note?: string;
  photos?: string[];

  // 叙事详情字段，适配精细卡片展示
  introduction?: string;      // 简介
  legendStory?: string;       // 传说故事
  ticketPrice?: string;       // 票价
  bestTime?: string;          // 最佳时间
  travelSuggestions?: string; // 游览建议
  avoidPitfalls?: string;     // 避坑指南
}
