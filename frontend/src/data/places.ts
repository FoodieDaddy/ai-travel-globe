import { Place } from '../types/travel';

// 5个已去过的地点（数据完美对应 demo.mov 视频）
const STATIC_VISITED_PLACES: Place[] = [
  {
    id: "p_wulingyuan",
    name: "武陵源",
    country: "中国",
    type: "nature",
    lat: 29.7453,
    lng: 110.5300,
    description: "张家界的核心景区，三千奇峰，八百秀水，令人叹为观止的自然迷宫。",
    visited: true,
    visitedAt: "2026-04-28",
    userNote: "百龙天梯直插云霄，杨家界一步登天极其震撼，金鞭溪的微风很惬意。",
    userTags: ["自然", "山水", "奇峰"],
    userPhotos: [
      "https://images.unsplash.com/photo-1549693578-d683be217e58?w=400&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80"
    ],
    introduction: "世界自然遗产，张家界核心景区外的另一片奇峰异石。天子山、杨家界、索溪峪各具特色，百龙天梯垂直上升326米。",
    legendStory: "武陵源有一个关于桃花源的传说。陶渊明笔下的桃花源，据说就在武陵源深处。传说一位渔夫沿溪而行，穿过狭窄的水口，豁然开朗，看到一片与世隔绝的田园。村民告诉他，祖上为避秦时战乱来此，此后再未出去。渔夫离开时做了标记，却再也找不到入口。武陵源的石英砂岩峰林，据说就是桃花源的天然屏障，守护着那片永恒的乐土。",
    ticketPrice: "225元(4日有效), 百龙天梯72元单程",
    bestTime: "4-6月 / 9-11月",
    travelSuggestions: "百龙天梯上行看全景。杨家界一步登天观景台最刺激。金鞭溪徒步5公里轻松惬意。",
    avoidPitfalls: "雨天路滑注意安全；景区大需合理规划路线；节假日常住酒店需提前预订"
  },
  {
    id: "p_kerala",
    name: "喀拉拉背水",
    country: "印度",
    type: "nature",
    lat: 9.4981,
    lng: 76.3388,
    description: "宁静的椰林水道迷宫，在水上船屋中慢悠悠地度过时光。",
    visited: true,
    visitedAt: "2026-05-13",
    userNote: "坐着慢悠悠的船屋，两旁是茂密的椰子树，仿佛时间在这里慢了下来。",
    userTags: ["慢旅行", "椰林", "水乡"],
    userPhotos: [
      "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=400&q=80"
    ],
    introduction: "印度南部的‘椰林水乡’，由淡水湖泊、河流和运河组成的独特水上世界，是全球最负盛名的慢旅行目的地之一。",
    legendStory: "传说椰林背水是印度神明水神伐楼那为了赐予渔民安宁而劈开的避风港。在很久以前，当地的捕鱼部落经常受到阿拉伯海暴风雨的袭击。水神听到渔民的哀求，用三叉戟在陆地与海洋之间划出了一道长达数百公里的内陆水道迷宫，两旁种满了高耸的椰子树，让暴风雨无法吹散这里的平静，保护着驾小木船的渔民世世代代安居乐业。",
    ticketPrice: "免费，租用传统水上船屋(Houseboat)约800-1500元/晚",
    bestTime: "11月至次年2月",
    travelSuggestions: "预订一日或两日的水上船屋旅行，在船上享用传统香蕉叶午餐，吹着微风看日落。",
    avoidPitfalls: "夏季蚊虫极多，务必带足防蚊液；船屋空调一般仅限晚上开启，预订时需确认。"
  },
  {
    id: "p_jiuzhaigou",
    name: "九寨沟",
    country: "中国",
    type: "nature",
    lat: 33.2612,
    lng: 103.9186,
    description: "童话般的水之天堂，九寨归来不看水。",
    visited: true,
    visitedAt: "2026-05-27",
    userNote: "五彩池的蓝色简直不真实，彩林倒映在水面如同油画。",
    userTags: ["水景", "自然遗产", "四川"],
    userPhotos: [
      "https://images.unsplash.com/photo-1549046468-b74704f4a3f2?w=400&q=80"
    ],
    introduction: "世界自然遗产，中国川西高原上的童话世界。以翠海、叠瀑、彩林、雪峰、藏情五绝著称，拥有108个清澈的高山海子。",
    legendStory: "传说很久以前，掌管万物神灵的男神达戈，用风云磨成一面宝镜送给美丽的女神色嫫。色嫫极其喜爱，不幸在接镜子时，因一时慌张手滑，宝镜落入人间，碎成了108块碎片。这些晶莹剔透的碎片散落在崇山峻岭间，化作了108个清澈见底的翠海，从此九寨沟拥有了人间最斑斓的水色。",
    ticketPrice: "门票190元/车票90元",
    bestTime: "10月中下旬(彩林最盛期)",
    travelSuggestions: "建议乘观光车先到原始森林或长海，然后自上而下步行游览。五花海和五彩池是核心看点。",
    avoidPitfalls: "海拔2000-3100米，注意防高反；早晚温差极大，带厚外套；避开国庆黄金周拥挤人流。"
  },
  {
    id: "p_pamir",
    name: "帕米尔高原",
    country: "塔吉克斯坦",
    type: "nature",
    lat: 38.2167,
    lng: 73.1500,
    description: "荒凉而雄伟的世界屋脊，丝绸之路上的高原屏障。",
    visited: true,
    visitedAt: "2026-05-29",
    userNote: "行驶在帕米尔公路上，周围都是巨大的雪山和荒野，感觉自己非常渺小。",
    userTags: ["高原", "雪山", "荒原"],
    userPhotos: [
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80"
    ],
    introduction: "被称为‘世界屋脊’，是亚洲多个主要山脉的交汇处，拥有壮丽的冰川、荒凉的峡谷和深邃的塔吉克游牧文化。",
    legendStory: "在塔吉克族史诗中，帕米尔高原被称为‘万山之祖’，也是白鹰飞翔的圣所。传说在远古的冰川纪，大地上洪水滔天，世界陷入一片漆黑。为了寻找光明，一只神圣的白鹰飞上了世界的屋脊，用双翼撞击了帕米尔最高处的雪峰，撞碎了永恒的坚冰，取出了火种洒向人间。帕米尔高原的雪峰和塔吉克族的鹰舞，便是为了纪念这只带来火种的白鹰。",
    ticketPrice: "免费，但需办理塔吉克斯坦边境通行证(GBAO permit)",
    bestTime: "6月至9月",
    travelSuggestions: "包车走著名的帕米尔公路(M41)，观赏卡拉库里湖的倒影，并在当地游牧帐篷中住宿一晚。",
    avoidPitfalls: "全线海拔多在3500米以上，极易发生严重高反；沿途医疗和物资匮乏，需备足药品。"
  },
  {
    id: "p_palmyra",
    name: "巴尔米拉古城",
    country: "叙利亚",
    type: "heritage",
    lat: 34.5600,
    lng: 38.2700,
    description: "荒漠中的废墟史诗，罗马柱廊倾诉着昔日女王的辉煌。",
    visited: true,
    visitedAt: "2026-05-30",
    userNote: "夕阳把高大的石柱染成金红色，荒废的神庙廊柱下只有风沙的吟唱。",
    userTags: ["历史遗迹", "废墟", "丝绸之路"],
    userPhotos: [
      "https://images.unsplash.com/photo-1547989453-11e67ffb3885?w=400&q=80"
    ],
    introduction: "叙利亚沙漠中的古代遗迹，曾是丝绸之路上的关键绿洲枢纽，融汇了希腊罗马式与波斯风情的宏伟柱廊和神庙废墟。",
    legendStory: "传说巴尔米拉由所罗门王亲自建造，是沙漠中的‘绿洲之珠’，由神灵在泉水旁堆砌石块而成。后来在罗马时期，著名的芝诺比娅女王反抗罗马帝国，战败后她被用金锁链缚住带往罗马。在女王战败前夜，她曾在巴尔米拉的主神庙下祈祷，神庙前的廊柱在深夜里发出了幽蓝的光芒，据说那是沙漠之神为庇护这片绿洲遗留下的永恒火花，如今在废墟柱廊间还能听到风沙吟唱女王的旧曲。",
    ticketPrice: "约合人民币30元(目前需跟随官方向导进入)",
    bestTime: "10月至次年4月(避开炎夏)",
    travelSuggestions: "在黄昏时分拍摄科隆纳街（大柱廊），夕阳会将整座古城的石柱染成金色，是极其震撼的视觉体验。",
    avoidPitfalls: "目前地区局势虽有改善但仍需谨慎，建议提前通过叙利亚当地专业旅行社申请特殊准入证件。"
  }
];

// 2个规划中的地点（数据对应视频）
const STATIC_PLANNED_PLACES: Place[] = [
  {
    id: "p_huangshan",
    name: "黄山",
    country: "中国",
    type: "nature",
    lat: 30.1293,
    lng: 118.1719,
    description: "五岳归来不看山，黄山归来不看岳。奇松云海，天下绝景。",
    visited: false,
    plannedDate: "2026-05-30",
    userPhotos: [
      "https://images.unsplash.com/photo-1520262454473-a1a82276a574?w=400&q=80"
    ],
    introduction: "世界文化与自然双重遗产，中国最著名的奇山。以奇松、怪石、云海、温泉、冬雪‘五绝’冠绝天下。",
    legendStory: "黄山相传是中华民族始祖轩辕黄帝在此修炼飞升的地方。黄帝曾率领群臣在桃花峰下炼丹，仙丹练成后，黄帝服下并在此沐浴温泉，重返青春，最后骑乘火龙在此飞升上天。为了纪念黄帝，这座山在唐代被赐名为‘黄山’，山上的迎客松也承载着千百年来迎接八方仙客的传说。",
    ticketPrice: "旺季门票190元/索道单程80-90元",
    bestTime: "四季皆宜，春秋最佳，冬季看雾凇",
    travelSuggestions: "建议在山顶住宿一晚，以便清晨在光明顶或始信峰观赏壮丽的黄山日出和翻腾的云海。",
    avoidPitfalls: "上山台阶极多，极其考验体力，不建议带重行李；雨天雾气过大时可能什么都看不见，需提前看天气。"
  },
  {
    id: "p_mogao",
    name: "敦煌莫高窟",
    country: "中国",
    type: "heritage",
    lat: 40.0435,
    lng: 94.8098,
    description: "大漠中断崖上的千年佛国，举世瞩目的敦煌艺术宝库。",
    visited: false,
    plannedDate: "2026-06-02",
    userPhotos: [
      "https://images.unsplash.com/photo-1608976404981-d1f5e8211db4?w=400&q=80"
    ],
    introduction: "世界文化遗产，甘肃敦煌的佛教艺术圣地。开凿于沙鸣山东麓的断崖上，是世界上现存规模最大、内容最丰富的佛教艺术地。",
    legendStory: "公元366年，乐尊和尚手执锡杖，西游至沙鸣山下。当时恰逢黄昏，他正欲寻找栖身之所，忽然抬头望向对面三危山，只见金光万道，仿佛有千万尊金身佛陀在光芒中显现。乐尊被这神迹所震撼，认为这是佛祖显灵的宝地，于是在崖壁上开凿了第一个洞窟。此后，丝绸之路上的商人、信徒、僧侣纷纷在此开窟造像，形成了如今宏伟的莫高窟。",
    ticketPrice: "A类票238元(需提前预约), 包含数字电影与8个洞窟参观",
    bestTime: "5-10月",
    travelSuggestions: "务必提前一个月在线上预约门票；参观时携带手电筒，跟随专业讲解员的步伐，仔细品味唐代和北魏飞天壁画。",
    avoidPitfalls: "石窟内严禁拍照，使用闪光灯会加速壁画氧化；沙尘暴天气时石窟可能临时关闭，行程需留出余量。"
  }
];

// 核心目的地种子库，用于生成探索点
const DESTINATIONS = [
  { name: "北京", country: "中国", lat: 39.9042, lng: 116.4074 },
  { name: "西安", country: "中国", lat: 34.3416, lng: 108.9398 },
  { name: "拉萨", country: "中国", lat: 29.6524, lng: 91.1172 },
  { name: "乌鲁木齐", country: "中国", lat: 43.8256, lng: 87.6168 },
  { name: "丽江", country: "中国", lat: 26.8708, lng: 100.2224 },
  { name: "桂林", country: "中国", lat: 25.2736, lng: 110.2901 },
  { name: "广州", country: "中国", lat: 23.1291, lng: 113.2644 },
  { name: "哈尔滨", country: "中国", lat: 45.8038, lng: 126.5350 },
  
  { name: "东京", country: "日本", lat: 35.6762, lng: 139.6503 },
  { name: "奈良", country: "日本", lat: 34.6851, lng: 135.8048 },
  { name: "札幌", country: "日本", lat: 43.0618, lng: 141.3545 },
  
  { name: "首尔", country: "韩国", lat: 37.5665, lng: 126.9780 },
  { name: "新加坡", country: "新加坡", lat: 1.3521, lng: 103.8198 },
  { name: "曼谷", country: "泰国", lat: 13.7563, lng: 100.5018 },
  { name: "巴厘岛", country: "印度尼西亚", lat: -8.4095, lng: 115.1889 },
  { name: "吴哥窟", country: "柬埔寨", lat: 13.4125, lng: 103.8670 },
  
  { name: "巴黎", country: "法国", lat: 48.8566, lng: 2.3522 },
  { name: "伦敦", country: "英国", lat: 51.5074, lng: -0.1278 },
  { name: "罗马", country: "意大利", lat: 41.9028, lng: 12.4964 },
  { name: "威尼斯", country: "意大利", lat: 45.4408, lng: 12.3155 },
  { name: "巴塞罗那", country: "西班牙", lat: 41.3851, lng: 2.1734 },
  { name: "雅典", country: "希腊", lat: 37.9838, lng: 23.7275 },
  { name: "柏林", country: "德国", lat: 52.5200, lng: 13.4050 },
  { name: "维也纳", country: "奥地利", lat: 48.2082, lng: 16.3738 },
  
  { name: "开罗", country: "埃及", lat: 30.0444, lng: 31.2357 },
  { name: "迪拜", country: "阿联酋", lat: 25.2048, lng: 55.2708 },
  { name: "德黑兰", country: "伊朗", lat: 35.6892, lng: 51.3890 },
  
  { name: "纽约", country: "美国", lat: 40.7128, lng: -74.0060 },
  { name: "洛杉矶", country: "美国", lat: 34.0522, lng: -118.2437 },
  { name: "旧金山", country: "美国", lat: 37.7749, lng: -122.4194 },
  { name: "黄石公园", country: "美国", lat: 44.4280, lng: -110.5885 },
  { name: "温哥华", country: "加拿大", lat: 49.2827, lng: -123.1207 },
  { name: "墨西哥城", country: "墨西哥", lat: 19.4326, lng: -99.1332 },
  
  { name: "里约热内卢", country: "巴西", lat: -22.9068, lng: -43.1729 },
  { name: "布宜诺斯艾利斯", country: "阿根廷", lat: -34.6037, lng: -58.3816 },
  { name: "马丘比丘", country: "秘鲁", lat: -13.1631, lng: -72.5450 },
  
  { name: "悉尼", country: "澳大利亚", lat: -33.8688, lng: 151.2093 },
  { name: "墨尔本", country: "澳大利亚", lat: -37.8136, lng: 144.9631 },
  { name: "奥克兰", country: "新西兰", lat: -36.8485, lng: 174.7633 },
  
  { name: "开普敦", country: "南非", lat: -33.9249, lng: 18.4241 },
  { name: "内罗毕", country: "肯尼亚", lat: -1.2921, lng: 36.8219 }
];

const CATEGORIES: ("heritage" | "nature" | "landmark" | "custom")[] = [
  "heritage",
  "nature",
  "landmark",
  "custom"
];

const CATEGORY_NAMES = {
  heritage: "文化遗产",
  nature: "自然奇观",
  landmark: "现代地标",
  custom: "自定义"
};

// 动态生成 400 多个点位
const generateExplorePlaces = (): Place[] => {
  const generated: Place[] = [];
  let idCounter = 1;

  // 为每个种子目的地生成若干个周边点位
  DESTINATIONS.forEach((dest) => {
    // 每个目的地生成 10 个周边探索点，分布在 500 公里范围内
    for (let i = 1; i <= 10; i++) {
      const type = CATEGORIES[(idCounter) % CATEGORIES.length];
      const offsetLat = (Math.random() - 0.5) * 4; // 稍微发散
      const offsetLng = (Math.random() - 0.5) * 4;
      
      const lat = dest.lat + offsetLat;
      const lng = dest.lng + offsetLng;
      
      generated.push({
        id: `gen_place_${idCounter}`,
        name: `${dest.name}景区-${i}`,
        country: dest.country,
        type: type,
        lat: Number(lat.toFixed(4)),
        lng: Number(lng.toFixed(4)),
        description: `这是位于${dest.country}${dest.name}周边的${CATEGORY_NAMES[type]}探索点，包含独特的风土人情与游览风光。`,
        visited: false,
        
        // 赋予基本的介绍数据
        introduction: `这里是${dest.name}地区知名的${CATEGORY_NAMES[type]}观光区。这里保留了最原始的生态特色或人文景观，是深度行游该地区的理想之选。`,
        legendStory: `在当地老人的传说中，这里曾是仙人驻足的地方，传说在满月之夜，微风中会夹杂着悠长而神秘的钟声，听到的人能获得终身的好运。`,
        ticketPrice: `${Math.floor(Math.random() * 120 + 20)}元/人`,
        bestTime: "春秋两季",
        travelSuggestions: "适合徒步观光与户外摄影，建议带上防雨器具和相机。",
        avoidPitfalls: "早晚有蚊虫，注意防蚊；有些区域山路陡峭，请注意脚下安全。"
      });
      idCounter++;
    }
  });

  return generated;
};

const DYNAMIC_PLACES = generateExplorePlaces();

// 整合所有的景点数据（5个已打卡，2个规划中，400多个探索点）
export const INITIAL_PLACES: Place[] = [
  ...STATIC_VISITED_PLACES,
  ...STATIC_PLANNED_PLACES,
  ...DYNAMIC_PLACES
];
