export interface Place {
  id: string;
  name: string;
  country: string;
  type: "heritage" | "nature" | "landmark" | "custom"; // 文化遗产, 自然奇观, 现代地标, 自定义
  lat: number;
  lng: number;
  description: string;
  highlights?: string[];
  bestFor?: string[];
  visited: boolean;
  visitedAt?: string; // e.g. "2026-05-30"
  plannedDate?: string; // e.g. "2026-06-02" (用于规划中的地点)
  userNote?: string;
  userTags?: string[];
  userPhotos?: string[];
  
  // 详情数据字段，对应视频中武陵源详情页面的各个板块
  introduction?: string;      // 简介
  legendStory?: string;       // 传说故事
  ticketPrice?: string;       // 票价
  bestTime?: string;          // 最佳时间
  travelSuggestions?: string; // 游览建议
  avoidPitfalls?: string;     // 避坑指南
}

export interface City {
  id: string;
  name: string;
  country: string;
  lat: number;
  lng: number;
  image: string;
}
