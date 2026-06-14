import { ChinaPlace } from '../types/china';

// 中国专属旅行记忆的静态已访问城市与规划城市
const STATIC_CHINA_VISITED_PLACES: ChinaPlace[] = [
  {
    id: "c_shanghai",
    name: "上海",
    province: "上海",
    region: "华东",
    type: "city",
    lat: 31.2304,
    lng: 121.4737,
    description: "在万国建筑与陆家嘴天际线中切换都市旅行的魔幻节奏。",
    highlights: ["外滩万国建筑", "武康路老洋房", "陆家嘴三件套"],
    tags: ["都市", "夜景", "海派文化"],
    visited: true,
    visitedAt: "2023 秋",
    season: "金秋十月",
    note: "深夜站在外滩吹着微凉的江风，黄浦江对岸的陆家嘴高楼耸入云间，一侧是百年的万国建筑，一侧是极具未来感的摩天大楼，海派魔都的魅力在黑夜里展现得淋漓尽致。",
    photos: [
      "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800&q=80"
    ],
    introduction: "上海是极具海派风情的国际大都市，融汇了东西方历史文化的精髓。黄浦江两岸见证了上海从一个小渔村到世界级金融中心的百年沧桑巨变。",
    legendStory: "传说古时上海常遭潮汛水患，百姓捕鱼困难。松江上游有一灵龟化为退滩绿洲，庇护江边渔舟避开狂浪风暴，渔民遂以竹扈捕鱼维持生计，上海因而简称为“沪”。",
    ticketPrice: "外滩观光免费，东方明珠塔约199元",
    bestTime: "9月 - 11月 (梧桐落叶，秋高气爽)",
    travelSuggestions: "下午在武康路慢跑或散步，喝一杯手冲咖啡；傍晚乘轮渡横渡黄浦江，在外滩静静等待 19:00 两岸华灯初上的惊艳瞬间。",
    avoidPitfalls: "外滩节假日游客极其密集，建议避开高峰期；南京东路步行街的部分网红店排队严重，可前往弄堂深处寻找本地特色生煎。"
  },
  {
    id: "c_suzhou",
    name: "苏州",
    province: "江苏",
    region: "华东",
    type: "landmark",
    lat: 31.2990,
    lng: 120.5853,
    description: "拙政园里一步一景，平江路石板路上听一曲吴侬软语的评弹。",
    highlights: ["拙政园", "平江路古街", "寒山寺", "虎丘"],
    tags: ["园林", "江南水乡", "昆曲苏绣"],
    visited: true,
    visitedAt: "2024 春",
    season: "烟雨江南",
    note: "雨天的平江路别有一番风味。撑着一把油纸伞踩在斑驳的青石板上，旁边的小河里有手摇船吱呀划过，茶馆里传来吴侬软语的评弹《声声慢》，时间仿佛在这一刻慢了下来。",
    photos: [
      "https://images.unsplash.com/photo-1599581561565-d05051e5e6e3?w=800&q=80"
    ],
    introduction: "苏州拥有两千五百多年的历史，是著名的江南水乡古城，以精致典雅的苏式园林和幽深的古街小巷闻名中外，被誉为“人间天堂”。",
    legendStory: "相传春秋时期，吴王阖闾命伍子胥建吴国都城，风水象天法地。城墙筑成后，吴王曾梦见仙人赠予金砖，铺设在阖闾大城地基之中，预示着苏州千年的富庶与安定。",
    ticketPrice: "拙政园旺季约80元，虎丘约60元",
    bestTime: "3月 - 5月 (桃花盛开，烟雨江南最迷人)",
    travelSuggestions: "早上8点前入园拙政园以避开人群，静心体验一步一景的造园艺术；下午去平江路坐一次手摇船，听船娘吟唱水乡民谣。",
    avoidPitfalls: "不要轻信景区周边的黑车和低价一日游；苏式糕点虽然精美，但糖分较高，一次不宜购买过多。"
  },
  {
    id: "c_hangzhou",
    name: "杭州",
    province: "浙江",
    region: "华东",
    type: "nature",
    lat: 30.2741,
    lng: 120.1551,
    description: "西湖十景如诗如画，灵隐古刹里云烟袅袅，龙井村中漫山绿意。",
    highlights: ["西湖断桥", "灵隐寺与飞来峰", "龙井茶村", "良渚遗址"],
    tags: ["山水", "人文历史", "茶文化"],
    visited: true,
    visitedAt: "2025 秋",
    season: "桂花飘香",
    note: "秋天的西湖飘满了桂花香。灵隐寺飞来峰前，古树参天，深山古刹的钟声震荡林间，让人忘却尘嚣。在龙井村的茶山顶喝一杯明前龙井，满眼都是绿意昂然的开阔与松弛。",
    photos: [
      "https://images.unsplash.com/photo-1528164344705-47542687000d?w=800&q=80"
    ],
    introduction: "杭州历史悠久，山水秀美。以西湖为核心的自然人文景观，千百年来吸引了无数文人墨客在此留下赞美诗篇，是著名的浪漫与文化之都。",
    legendStory: "传说西湖是天上一颗璀璨的明珠坠落人间化成的。玉龙和金凤在天河边雕琢出一颗闪光的玉石，王母娘娘想据为己有。争夺中玉石坠落凡尘，落水成了西湖，玉龙和金凤也化成了玉皇山和凤凰山，世代守护着西湖。",
    ticketPrice: "西湖景区免费，三潭印月游船约55元",
    bestTime: "9月 - 11月 (满城桂花，秋意最浓)",
    travelSuggestions: "清晨骑自行车沿着苏堤漫步，享受雾气迷蒙的静谧西湖；下午去法喜寺请一串御守，感受深山黄墙古寺的禅意。",
    avoidPitfalls: "周末的西湖周边容易严重堵车，出行尽量选择地铁或骑行；灵隐寺门口请香要谨防拉客的野导游。"
  },
  {
    id: "c_lhasa",
    name: "拉萨",
    province: "西藏",
    region: "西南",
    type: "heritage",
    lat: 29.6524,
    lng: 91.1172,
    description: "日光之城仰望庄严的布达拉宫，八廓街上摩肩接踵的虔诚朝圣者。",
    highlights: ["布达拉宫", "大昭寺", "八廓街", "纳木措"],
    tags: ["信仰", "雪域高原", "藏传佛教"],
    visited: true,
    visitedAt: "2026 春",
    season: "日光倾城",
    note: "当我真正站在大昭寺门前，看着磕着长头的藏民，阳光毫无遮拦地倾泻在布达拉宫金顶之上，耳边只有低沉宏亮的经文吟诵。那一瞬间，来自雪域高原的宁静直击心灵，眼眶湿热。",
    photos: [
      "https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=80"
    ],
    introduction: "拉萨藏语意为“圣地”，是西藏政治、经济、文化和宗教中心，也是著名的日光之城，拥有灿烂的藏族传统文化与雄伟的高原雪域风光。",
    legendStory: "传说公元7世纪，吐蕃赞普松赞干布在红山上建布达拉宫以迎娶文成公主。大昭寺动工之初，这里是一片湖泊，文成公主依阴阳五行推算出此湖为魔女心血，命千只白山羊驮土填湖，建起了如今宏伟的圣殿。",
    ticketPrice: "布达拉宫旺季约200元 (需提前预约)",
    bestTime: "5月 - 10月 (含氧量较高，气候温和)",
    travelSuggestions: "第一天抵达后切忌剧烈运动和洗澡，在房间静养以适应高反；傍晚去药王山观景台，拍摄20元人民币背面的经典布达拉宫全景图。",
    avoidPitfalls: "朝圣和参观寺庙时请勿大声喧哗，尊重当地宗教风俗，不要拍摄转经群众；防晒和高反药物必须提前备齐。"
  }
];

const STATIC_CHINA_PLANNED_PLACES: ChinaPlace[] = [
  {
    id: "c_beijing",
    name: "北京",
    province: "北京",
    region: "华北",
    type: "city",
    lat: 39.9042,
    lng: 116.4074,
    description: "漫步紫禁城红墙金顶，感受古老都城的厚重底蕴与胡同深处的烟火气。",
    highlights: ["故宫博物院", "天坛公园", "颐和园", "南锣鼓巷胡同"],
    tags: ["古都", "历史建筑", "京味文化"],
    visited: false,
    season: "秋高气爽",
    introduction: "北京是中国的首都，拥有三千余年的建城史和八百余年的建都史，是全球拥有世界文化遗产数量最多的城市，现代与古老在此剧烈碰撞。"
  },
  {
    id: "c_xian",
    name: "西安",
    province: "陕西",
    region: "西北",
    type: "landmark",
    lat: 34.3416,
    lng: 108.9398,
    description: "一眼越过秦砖汉瓦，在古老城墙下骑行，尝一碗热气腾腾的牛羊肉泡馍。",
    highlights: ["秦始皇兵马俑", "大雁塔南北广场", "西安古城墙", "回民街美食"],
    tags: ["古都", "秦汉唐遗风", "关中美食"],
    visited: false,
    season: "长安秋色",
    introduction: "西安古称长安，是中华文明的重要发祥地之一，曾有十三个王朝在此建都，是古丝绸之路的起点，被誉为世界四大古都之一。"
  },
  {
    id: "c_chengdu",
    name: "成都",
    province: "四川",
    region: "西南",
    type: "food",
    lat: 30.5728,
    lng: 104.0668,
    description: "在人民公园喝一碗盖碗茶，看憨态可掬的国宝熊猫，沉浸在麻辣鲜香的火锅气里。",
    highlights: ["大熊猫繁育基地", "都江堰", "宽窄巷子", "锦里老街"],
    tags: ["慢生活", "川味美食", "国宝熊猫"],
    visited: false,
    season: "天府之春",
    introduction: "成都是联合国教科文组织授予的“美食之都”，是一座来了就不想走的休闲城市，以悠闲的慢生活节奏和麻辣鲜香的川菜享誉海内外。"
  },
  {
    id: "c_chongqing",
    name: "重庆",
    province: "重庆",
    region: "西南",
    type: "landmark",
    lat: 29.5630,
    lng: 106.5516,
    description: "穿行于8D立体魔幻山城，看千与千寻般的洪崖洞夜景，坐一回跨越江河的索道。",
    highlights: ["洪崖洞夜景", "长江索道", "李子坝轻轨穿楼", "磁器口古镇"],
    tags: ["山城8D", "魔幻夜景", "九宫格火锅"],
    visited: false,
    season: "山城迷雾",
    introduction: "重庆是著名的“山城”与“江城”，起伏的地形造就了其独特的立体交通与错落有致的建筑景观，重工业底蕴与现代赛博魔幻感交融。"
  },
  {
    id: "c_harbin",
    name: "哈尔滨",
    province: "黑龙江",
    region: "东北",
    type: "nature",
    lat: 45.8038,
    lng: 126.5350,
    description: "在冰雪大世界看璀璨的冰雕城堡，漫步中央大街，啃一根马迭尔冰棍。",
    highlights: ["冰雪大世界", "圣索菲亚大教堂", "中央大街步行街"],
    tags: ["冰雪童话", "俄式风情", "东北铁锅炖"],
    visited: false,
    season: "银装素裹",
    introduction: "哈尔滨因其充满欧陆风情的建筑与极具魅力的冬季冰雪文化，被誉为“东方莫斯科”和“东方小巴黎”，是一座充满浪漫气息的冰雪之城。"
  },
  {
    id: "c_dali",
    name: "大理",
    province: "云南",
    region: "西南",
    type: "nature",
    lat: 25.6899,
    lng: 100.2224,
    description: "环洱海骑行吹吹海风，在喜洲古镇品尝粑粑，仰望巍峨的苍山雪影。",
    highlights: ["洱海环湖路", "大理古城", "苍山洗马潭", "喜洲古镇"],
    tags: ["风花雪月", "风情海景", "慢生活"],
    visited: false,
    season: "风花雪月",
    introduction: "大理是白族自治州的首府，以“风花雪月”（下关风、上关花、苍山雪、洱海月）自然景观著称，历史悠久，充满了松弛惬意的文艺气息。"
  },
  {
    id: "c_xiamen",
    name: "厦门",
    province: "福建",
    region: "华南",
    type: "nature",
    lat: 24.4798,
    lng: 118.0894,
    description: "登鼓浪屿听海风与琴声，在沙坡尾寻找文艺小店，环岛路上看日出日落。",
    highlights: ["鼓浪屿琴岛", "沙坡尾避风坞", "环岛路海滩", "曾厝垵"],
    tags: ["海滨小城", "文艺清新", "闽南美食"],
    visited: false,
    season: "海滨盛夏",
    introduction: "厦门是一座风光旖旎、气候宜人的海滨港口城市，融合了南洋风情的骑楼建筑与清新的文艺气息，被公认为最适宜漫步的城市之一。"
  },
  {
    id: "c_nanjing",
    name: "南京",
    province: "江苏",
    region: "华东",
    type: "landmark",
    lat: 32.0603,
    lng: 118.7969,
    description: "钟山风雨起苍黄，在中山陵俯瞰石象路上的金秋红枫，夜泊秦淮近酒家。",
    highlights: ["明孝陵石象路", "中山陵", "夫子庙秦淮河", "鸡鸣寺"],
    tags: ["六朝古都", "秋景如画", "金陵人文"],
    visited: false,
    season: "金陵秋色",
    introduction: "南京古称金陵、建康，是六朝古都、十朝都会。拥有厚重的历史古迹，十里秦淮至今流淌着古典的才子佳人神韵，秋天的钟山风景区美如画卷。"
  }
];

export const MOCK_CHINA_EXPLORE_PLACES: ChinaPlace[] = [
  // 散布在神州大地的 100 个轻量探索景点，用于丰富地图点阵
  { id: "e_gugong", name: "故宫博物院", province: "北京", region: "华北", type: "museum", lat: 39.9163, lng: 116.3972, description: "明清两代皇家宫殿，红墙黄瓦的东方建筑巅峰。", highlights: ["太和殿", "乾清宫", "御花园"], tags: ["古都", "宫殿建筑", "国宝"], visited: false },
  { id: "e_tiantan", name: "天坛公园", province: "北京", region: "华北", type: "landmark", lat: 39.8822, lng: 116.4117, description: "明清两代帝王祭天祈谷的神圣坛庙。", highlights: ["祈年殿", "回音壁"], tags: ["祭祀文化", "明代古建"], visited: false },
  { id: "e_huoqiu", name: "虎丘山风景区", province: "江苏", region: "华东", type: "nature", lat: 31.3444, lng: 120.5794, description: "吴中第一名胜，拥有著名的苏式斜塔。", highlights: ["云岩寺塔", "剑池"], tags: ["山水古建", "苏吴遗风"], visited: false },
  { id: "e_hanlao", name: "良渚古城遗址", province: "浙江", region: "华东", type: "museum", lat: 30.4357, lng: 119.9928, description: "实证中华五千年文明史的圣地，以精美玉器闻名。", highlights: ["反山王陵", "良渚博物馆"], tags: ["史前遗址", "玉文化"], visited: false },
  { id: "e_fuxi", name: "法喜寺", province: "浙江", region: "华东", type: "landmark", lat: 30.2227, lng: 120.1065, description: "西湖深山之中的黄墙禅寺，深受年轻群体的追捧。", highlights: ["法喜大殿", "祈福御守"], tags: ["黄墙寺庙", "禅意清修"], visited: false },
  { id: "e_yaowang", name: "药王山观景台", province: "西藏", region: "西南", type: "landmark", lat: 29.6515, lng: 91.1118, description: "拍摄20元人民币背景图的绝佳机位，直面布宫侧翼。", highlights: ["摩崖石刻", "观景台"], tags: ["网红机位", "布宫全景"], visited: false },
  { id: "e_bingma", name: "秦始皇兵马俑", province: "陕西", region: "西北", type: "museum", lat: 34.3841, lng: 109.2785, description: "被誉为“世界第八大奇迹”的秦代地下陶俑军队。", highlights: ["一号坑", "铜车马"], tags: ["秦代军事", "世界奇迹"], visited: false },
  { id: "e_qingcheng", name: "青城山", province: "四川", region: "西南", type: "nature", lat: 30.8988, lng: 103.5785, description: "青城天下幽，中国道教四大名山之一，林木葱郁。", highlights: ["建福宫", "天师洞"], tags: ["道教祖庭", "森林避暑"], visited: false },
  { id: "e_hongyading", name: "洪崖洞民俗风貌区", province: "重庆", region: "西南", type: "landmark", lat: 29.5645, lng: 106.5791, description: "依山而建的悬崖吊脚楼，夜晚金碧辉煌，酷似《千与千寻》场景。", highlights: ["悬崖吊脚楼", "千厮门大桥"], tags: ["网红夜景", "巴渝民俗"], visited: false },
  { id: "e_yulong", name: "玉龙雪山", province: "云南", region: "西南", type: "nature", lat: 27.0988, lng: 100.2455, description: "纳西族的神山，十三座雪峰连绵不绝，宛如玉龙横卧。", highlights: ["冰川公园", "蓝月谷"], tags: ["雪山冰川", "纳西圣地"], visited: false },
  { id: "e_gulang", name: "鼓浪屿风琴博物馆", province: "福建", region: "华南", type: "museum", lat: 24.4518, lng: 118.0652, description: "钢琴与风琴的历史藏馆，琴岛独特的西洋浪漫音乐底蕴。", highlights: ["巨型管风琴", "八卦楼"], tags: ["音乐文化", "西洋古建"], visited: false },
  { id: "e_qinhe", name: "夫子庙秦淮河", province: "江苏", region: "华东", type: "landmark", lat: 32.0227, lng: 118.7891, description: "金陵历史文化核心，桨声灯影里流淌着百年的文墨歌吟。", highlights: ["江南贡院", "画舫游船"], tags: ["桨声灯影", "科举文化"], visited: false }
];

export const INITIAL_CHINA_PLACES: ChinaPlace[] = [
  ...STATIC_CHINA_VISITED_PLACES,
  ...STATIC_CHINA_PLANNED_PLACES,
  ...MOCK_CHINA_EXPLORE_PLACES
];
