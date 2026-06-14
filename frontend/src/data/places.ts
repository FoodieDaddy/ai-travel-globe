import { Place } from '../types/travel';

// 4个已访问过的主打城市，顺序为新加坡 -> 上海 -> 京都 -> 东京
const STATIC_VISITED_PLACES: Place[] = [
  {
    id: "p_singapore",
    name: "Singapore",
    country: "Singapore",
    type: "nature",
    lat: 1.3521,
    lng: 103.8198,
    description: "未来感城市与热带夜景交汇的超级花园。",
    visited: true,
    visitedAt: "2023 冬",
    userNote: "滨海湾的超级树灯光秀，让人仿佛置身于阿凡达的潘多拉星球，温室花穹里四季如春。",
    userTags: ["未来城市", "热带花园", "夜景"],
    userPhotos: [
      "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=500&q=80"
    ],
    highlights: ["滨海湾花园", "鱼尾狮公园", "超级树灯光秀"],
    introduction: "新加坡是坐落于马来半岛南端的热带岛国，被誉为‘花园城市’。它融合了摩登的摩天大楼与茂密的自然绿植，拥有多民族交汇的多元文化魅力。",
    legendStory: "传说苏门答腊的桑尼拉乌塔玛王子在14世纪航海来到这个岛屿时，看到了一只形似狮子的神秘野兽。他认为这是一个祥瑞的征兆，决定将此地建为城池，并命名为‘新加坡拉’（Singapura，梵语意为狮子城）。自此，狮子的勇敢之魂便守护着这片热带港湾，演化为如今吐水迎客的鱼尾狮象征。",
    ticketPrice: "免费，滨海湾温室双馆约150元",
    bestTime: "11月 - 次年2月 (气候较为凉爽)",
    travelSuggestions: "傍晚时分前往滨海湾花园（Gardens by the Bay）散步，躺在草坪上观赏 19:45 或 20:45 的超级树音乐灯光秀。",
    avoidPitfalls: "常年高温多雨，随身携带雨伞与防晒霜；乱扔垃圾、随地吐痰会面临极高额罚款。"
  },
  {
    id: "p_shanghai",
    name: "Shanghai",
    country: "China",
    type: "landmark",
    lat: 31.2304,
    lng: 121.4737,
    description: "在万国建筑与陆家嘴天际线中切换旅行节奏。",
    visited: true,
    visitedAt: "2024 夏",
    userNote: "深夜在外滩吹着黄浦江的晚风，看对岸三件套亮起璀璨灯火，那是现代都市最震撼的节奏。",
    userTags: ["万国建筑", "魔都", "黄浦江"],
    userPhotos: [
      "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=500&q=80"
    ],
    highlights: ["外滩万国建筑群", "陆家嘴三件套", "武康路老洋房"],
    introduction: "上海是中国最大的经济中心城市，也是一座极具海派风情的国际大都市。黄浦江将城市分为浦西与浦东，一边是万国历史建筑群，一边是高耸入云的现代摩天群楼。",
    legendStory: "古时上海是一片渔村，当地人发明了一种竹制的捕鱼工具叫‘扈’。当时江海交汇的松江（今苏州河一带）被称为‘下海线’，渔民们在此日出而作，日入而息。因吴淞江古称‘沪水’，故上海简称为‘沪’。相传江中曾有神仙化为大鱼庇护渔舟，避开东海狂浪，使得这片退滩绿洲逐渐繁盛，成为了东海之滨的璀璨明珠。",
    ticketPrice: "外滩观光免费，上海中心观光厅约180元",
    bestTime: "10月 - 11月 (秋高气爽，老洋房梧桐落叶最美)",
    travelSuggestions: "下午在武康路或思南路漫步，欣赏法式老洋房与梧桐落叶；日落时分步行至外滩，静待 19:00 江两岸景观灯同时点亮的瞬间。",
    avoidPitfalls: "外滩周末及节假日人流量极大，请注意错峰出行；乘坐地铁尽量避开上下班高峰期。"
  },
  {
    id: "p_kyoto",
    name: "Kyoto",
    country: "Japan",
    type: "heritage",
    lat: 35.0116,
    lng: 135.7681,
    description: "静谧的寺庙里只有风声，岚山红叶如火烧一般璀璨。",
    visited: true,
    visitedAt: "2025 秋",
    userNote: "秋天的岚山红叶如火，静谧的古刹里只有清脆的木鱼与落叶风声。在祇园的石板路上，还偶遇了步履匆匆的艺伎。",
    userTags: ["千年古都", "枫叶季", "禅意庙宇"],
    userPhotos: [
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=500&q=80"
    ],
    highlights: ["伏见稻荷大社", "岚山竹林", "金阁寺与清水寺"],
    introduction: "京都曾作为日本首都长达千余年，是日本传统文化的精神故乡。这里完好地保留了大量的古建寺庙、枯山水庭院与古典日式街道，禅意深远。",
    legendStory: "传说古京都是由守护四方的青龙（鸭川）、朱雀（巨椋池）、白虎（山阴道）和玄武（船冈山）四神所庇护的灵地。在千百年前迁都平安京时，阴阳师们依循风水秘术在此筑城，深信山水环绕的盆地能阻挡厉鬼侵扰。时至今日，伏见稻荷大社那绵延数公里的千本鸟居，依然被视为神明与凡尘的交界，狐狸使者在林间静静传递着祈愿。",
    ticketPrice: "大多数寺庙门票约30 - 50元",
    bestTime: "11月中下旬 (京都红叶全盛期) 或 4月初 (樱花季)",
    travelSuggestions: "清晨7点前前往伏见稻荷大社，避开人流攀登千本鸟居；下午去岚山竹林散步，体验渡月桥的古典风情。",
    avoidPitfalls: "京都市内公交车比地铁更常用，建议购买一日乘车券；传统料亭多数需要提前预约，且需遵守安静用餐的礼仪。"
  },
  {
    id: "p_tokyo",
    name: "Tokyo",
    country: "Japan",
    type: "landmark",
    lat: 35.6762,
    lng: 139.6503,
    description: "霓虹都市与深夜食堂，璀璨绚烂的现代梦境。",
    visited: true,
    visitedAt: "2026 春",
    userNote: "第一次看到涩谷十字路口如潮水般的人流，在秋叶原淘到了绝版手办，深夜在新宿的居酒屋里吃到了最暖胃的烤串。",
    userTags: ["霓虹夜景", "二次元圣地", "美食天堂"],
    userPhotos: [
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=500&q=80"
    ],
    highlights: ["涩谷十字路口", "秋叶原动漫街", "新宿居酒屋"],
    introduction: "东京是日本的首都及世界超级都市圈，集科技、潮流、动漫与美食于一身。从历史悠久的浅草寺到前卫时尚的涩谷、新宿，现代与传统在此高度融合。",
    legendStory: "古时东京称为‘江户’，即江之入口。传说在远古的荒原上，曾有一位名为日本武尊的英雄东征至此。当时海上风暴大作，他的妻子弟橘媛为了平息海神之怒，毅然跳入汹涌的波涛中自我牺牲。风暴平息后，武尊在崖顶凝视大海，悲恸地呼唤‘吾妻啊’（Azuma），这一带遂被称为东国。几百年后，这座城市在填海防波中崛起，化为了东方最璀璨的千灯之城。",
    ticketPrice: "浅草寺免费，东京晴空塔约150元",
    bestTime: "3月下旬 - 4月上旬 (樱花盛开期) 或 10月 - 11月",
    travelSuggestions: "傍晚登上涩谷 Sky（Shibuya Sky）俯瞰涩谷十字路口与落日下的富士山；夜晚前往新宿的‘忆横丁’狭窄小巷寻找日式居酒屋。",
    avoidPitfalls: "东京地铁线路极其复杂，建议下载专门的换乘App；自动扶梯在东京习惯靠左站立（大阪靠右），请注意随大流。"
  }
];

// 4个规划中的目的地
const STATIC_PLANNED_PLACES: Place[] = [
  {
    id: "p_bali",
    name: "Bali",
    country: "Indonesia",
    type: "nature",
    lat: -8.4095,
    lng: 115.1889,
    description: "神明居住的绮丽岛屿，用蔚蓝海水与乌布稻香荡涤心灵。",
    visited: false,
    plannedDate: "2026 夏",
    introduction: "巴厘岛是印度尼西亚著名的旅游度假胜地，以其独特的印度教文化、宏伟的火山悬崖、苍翠的梯田以及梦幻的白沙滩闻名于世。",
    legendStory: "在印尼神话中，巴厘岛是神明为自己创造的游乐园。传说战神因陀罗为了击败邪恶的魔王，用神剑刺穿大地，引出了带有治愈圣水的泉眼（即今天的圣泉寺）。圣水流经之处，荒芜的红土化为了繁茂的森林与绿油油的梯田，使得这片土地四季常青，居民在音乐与祭祀中过着与神同行的宁静生活。",
    ticketPrice: "免费，大部分庙宇门票约15 - 30元",
    bestTime: "4月 - 10月 (旱季，风和日丽，最适合海岛度假)"
  },
  {
    id: "p_paris",
    name: "Paris",
    country: "France",
    type: "heritage",
    lat: 48.8566,
    lng: 2.3522,
    description: "塞纳河畔的古典浪漫，莫奈画笔下的温润光影。",
    visited: false,
    plannedDate: "2027 春",
    introduction: "巴黎是法国的首都，全球著名的艺术、时尚与浪漫之都。从标志性的埃菲尔铁塔、馆藏丰富的卢浮宫，到充满波西米亚风情的蒙马特高地，整座城市本身就是一座露天博物馆。",
    legendStory: "传说在罗马时期，巴黎的守护圣人圣丹尼斯在此传播福音，却在蒙马特高地被异教徒斩首。然而，被斩首后的圣丹尼斯神迹般地站立起来，双手捧着自己的头颅，一路吟唱着赞美诗向北步行了数公里，直到他倒下的地方建起了宏伟的圣丹尼斯大教堂。他的勇气与信仰成为了巴黎的基石，赋予了这座城市对艺术与自由永恒追求的浪漫骨血。",
    ticketPrice: "卢浮宫门票约160元，埃菲尔铁塔登顶约220元",
    bestTime: "5月 - 9月 (春暖花开，塞纳河畔微风最宜人)"
  },
  {
    id: "p_nyc",
    name: "New York",
    country: "USA",
    type: "landmark",
    lat: 40.7128,
    lng: -74.0060,
    description: "摩天林立的“大苹果”，百老汇的璀璨与中央公园的静谧。",
    visited: false,
    plannedDate: "2027 秋",
    introduction: "纽约是全球最大的国际大都市之一，由曼哈顿、皇后区等五大区构成。它是世界金融、时尚与文化的心脏，以标志性的摩天大楼天际线和多元文化的交汇著称。",
    legendStory: "最初这片土地是印第安阿尔冈琴部落的捕猎森林。1626年，荷兰人仅用价值约24美元的布料与小工艺品，向印第安人‘买下’了整座曼哈顿岛，并将其命名为‘新阿姆斯特丹’。后来英国人接管此地，以约克公爵之名改称‘纽约’。传说在这座‘不夜城’底下，有一颗巨大的金色苹果心在跳动，散发着诱人的财富与梦想微光，吸引着全球的逐梦人前来咬上一口。",
    ticketPrice: "大都会博物馆建议门票制/约200元，帝国大厦观光约300元",
    bestTime: "9月 - 11月 (纽约秋季，中央公园枫叶红透最美)"
  },
  {
    id: "p_seoul",
    name: "Seoul",
    country: "South Korea",
    type: "custom",
    lat: 37.5665,
    lng: 126.9780,
    description: "在潮流街区与古老宫殿之间感受现代律动。",
    visited: false,
    plannedDate: "2028 春",
    introduction: "首尔是韩国的首都，是一座古典与现代高度融合的城市。这里既有高耸入云的乐天世界塔和前卫的潮流商圈，也有沉静的景福宫与传统的北村韩屋村。",
    legendStory: "传说朝鲜半岛的始祖檀君是由天神之子与一只化为女子的熊所生。在建国时，神雀指引着他的后代寻找建都的吉地。神雀飞过重重山峦，最后在汉江之畔停下，双翼一振洒下一片金沙，江水顿时变得清澈温润，四面环山挡住了凛冽的北风。这片土地便成为了汉阳（今首尔），千百年来承载着白衣民族的平安祈愿，延绵至今。",
    ticketPrice: "景福宫门票约18元，首尔塔约70元",
    bestTime: "4月 (樱花季) 或 10月 (枫叶银杏季)"
  }
];

// 核心目的地的主要经纬度，用于生成探索点位
const SEED_DESTINATIONS = [
  { name: "北京", country: "中国", lat: 39.9042, lng: 116.4074 },
  { name: "西安", country: "中国", lat: 34.3416, lng: 108.9398 },
  { name: "拉萨", country: "中国", lat: 29.6524, lng: 91.1172 },
  { name: "成都", country: "中国", lat: 30.5728, lng: 104.0668 },
  { name: "杭州", country: "中国", lat: 30.2741, lng: 120.1551 },
  { name: "丽江", country: "中国", lat: 26.8708, lng: 100.2224 },
  { name: "哈尔滨", country: "中国", lat: 45.8038, lng: 126.5350 },
  { name: "厦门", country: "中国", lat: 24.4798, lng: 118.0894 },
  { name: "札幌", country: "日本", lat: 43.0618, lng: 141.3545 },
  { name: "曼谷", country: "泰国", lat: 13.7563, lng: 100.5018 },
  { name: "伦敦", country: "英国", lat: 51.5074, lng: -0.1278 },
  { name: "罗马", country: "意大利", lat: 41.9028, lng: 12.4964 },
  { name: "威尼斯", country: "意大利", lat: 45.4408, lng: 12.3155 },
  { name: "巴塞罗那", country: "西班牙", lat: 41.3851, lng: 2.1734 },
  { name: "洛杉矶", country: "美国", lat: 34.0522, lng: -118.2437 },
  { name: "旧金山", country: "美国", lat: 37.7749, lng: -122.4194 },
  { name: "温哥华", country: "加拿大", lat: 49.2827, lng: -123.1207 },
  { name: "里约热内卢", country: "巴西", lat: -22.9068, lng: -43.1729 },
  { name: "悉尼", country: "澳大利亚", lat: -33.8688, lng: 151.2093 },
  { name: "奥克兰", country: "新西兰", lat: -36.8485, lng: 174.7633 },
  { name: "开普敦", country: "南非", lat: -33.9249, lng: 18.4241 },
  { name: "开罗", country: "埃及", lat: 30.0444, lng: 31.2357 }
];

const CATEGORIES: ("heritage" | "nature" | "landmark" | "custom")[] = [
  "heritage",
  "nature",
  "landmark",
  "custom"
];

// 生成约 400 个探索小点，分布于世界各地
const generateExplorePlaces = (): Place[] => {
  const generated: Place[] = [];
  let idCounter = 1;

  SEED_DESTINATIONS.forEach((dest) => {
    // 每个目的地生成 20 个轻量散落点
    for (let i = 1; i <= 20; i++) {
      const type = CATEGORIES[idCounter % CATEGORIES.length];
      const offsetLat = (Math.random() - 0.5) * 5; // 较大范围散布
      const offsetLng = (Math.random() - 0.5) * 5;
      
      generated.push({
        id: `gen_explore_${idCounter}`,
        name: `${dest.name}探索点-${i}`,
        country: dest.country,
        type: type,
        lat: Number((dest.lat + offsetLat).toFixed(4)),
        lng: Number((dest.lng + offsetLng).toFixed(4)),
        description: `这里是属于${dest.country}${dest.name}周边风景秀丽的旅行探索点位。`,
        visited: false
      });
      idCounter++;
    }
  });

  return generated;
};

export const INITIAL_PLACES: Place[] = [
  ...STATIC_VISITED_PLACES,
  ...STATIC_PLANNED_PLACES,
  ...generateExplorePlaces()
];
