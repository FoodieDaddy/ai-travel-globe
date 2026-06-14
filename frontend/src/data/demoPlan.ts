export const demoPlan = {
  id: "plan_japan_7d_001",
  title: "日本 7 日动漫美食旅行",
  summary: "从东京的动漫街区到京都的传统文化，再到大阪的美食和乐园。",
  destination: "日本",
  days: 7,
  places: [
    {
      id: "tokyo",
      name: "东京",
      country: "日本",
      lat: 35.6762,
      lng: 139.6503,
      days: 3,
      description: "适合动漫、购物和城市探索。",
      tags: ["动漫", "美食", "城市"],
      image: "https://picsum.photos/seed/tokyo/400/300"
    },
    {
      id: "kyoto",
      name: "京都",
      country: "日本",
      lat: 35.0116,
      lng: 135.7681,
      days: 2,
      description: "适合传统文化、神社和古街区。",
      tags: ["文化", "寺庙", "摄影"],
      image: "https://picsum.photos/seed/kyoto/400/300"
    },
    {
      id: "osaka",
      name: "大阪",
      country: "日本",
      lat: 34.6937,
      lng: 135.5023,
      days: 2,
      description: "环球影城和道顿堀美食中心。",
      tags: ["乐园", "美食", "购物"],
      image: "https://picsum.photos/seed/osaka/400/300"
    }
  ],
  arcs: [
    {
      from: "东京",
      to: "京都",
      startLat: 35.6762,
      startLng: 139.6503,
      endLat: 35.0116,
      endLng: 135.7681
    },
    {
      from: "京都",
      to: "大阪",
      startLat: 35.0116,
      startLng: 135.7681,
      endLat: 34.6937,
      endLng: 135.5023
    }
  ],
  itinerary: [
    {
      day: 1,
      city: "东京",
      title: "抵达东京与浅草体验",
      items: ["抵达东京", "浅草寺", "秋叶原夜游"]
    },
    {
      day: 2,
      city: "东京",
      title: "动漫巡礼与涩谷",
      items: ["三鹰之森吉卜力美术馆", "涩谷十字路口", "新宿夜景"]
    },
    {
      day: 3,
      city: "东京",
      title: "台场与启程准备",
      items: ["台场高达", "银座购物", "准备乘坐新干线"]
    },
    {
      day: 4,
      city: "京都",
      title: "古都初探",
      items: ["新干线抵达京都", "伏见稻荷大社", "花见小路"]
    },
    {
      day: 5,
      city: "京都",
      title: "金阁寺与岚山",
      items: ["金阁寺", "岚山竹林", "品尝汤豆腐"]
    },
    {
      day: 6,
      city: "大阪",
      title: "美食与城郭",
      items: ["前往大阪", "大阪城公园", "道顿堀吃蟹道乐"]
    },
    {
      day: 7,
      city: "大阪",
      title: "乐园一日与返程",
      items: ["日本环球影城 (USJ)", "心斋桥最后血拼", "前往机场返程"]
    }
  ]
};
