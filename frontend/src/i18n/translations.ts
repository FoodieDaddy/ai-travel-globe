export type Language = 'zh' | 'en';

export const translations = {
  zh: {
    // Landing
    landingTitle: '一句话，生成你的全球旅行路线',
    landingSubtitle: '输入时间、预算与偏好，AI 会在 3D 地球上生成可视化行程。',
    startPlanning: '开始规划',
    viewDemo: '查看演示',
    demoSummary: '亚洲灵感路线 · 14天 · 98% 匹配',
    
    // Header
    appName: 'Travel OS',
    appDesc: 'AI Travel Intelligence',
    signIn: '登录',
    
    // Planner Panel
    promptLabel: '描述你的旅行愿景',
    promptPlaceholder: '例如：我想从东京出发，14天，想去海岛、美食和城市夜景...',
    travelMode: '旅行模式',
    travelSignals: '旅行偏好信号',
    generateOrbit: '生成旅行路线',
    moreOptions: '高级选项',
    hideOptions: '收起选项',
    
    // HTML Floating Cards (Demo)
    tokyoTags: '美食 / 夜景 / 科技',
    tokyoDesc: '霓虹都市与深夜食堂的第一站。',
    baliTags: '海岛 / 日落 / 放松',
    baliDesc: '用日落和海风结束整段旅程。',
    singaporeTags: '花园城市 / 建筑 / 夜游',
    singaporeDesc: '未来感城市与热带夜景交汇。',
    shanghaiTags: '外滩 / 都市 / 美食',
    shanghaiDesc: '在城市天际线中切换旅行节奏。',
    
    // Budgets
    budgetLow: '经济',
    budgetMedium: '平衡',
    budgetHigh: '轻奢',
    budgetLuxury: '奢华',

    // Styles
    styleCinematic: '电影感',
    styleNature: '自然',
    styleUrban: '城市',
    styleHistorical: '历史',
    styleFamily: '家庭',
    styleHoneymoon: '蜜月',
    stylePhotography: '摄影',
    styleNiche: '小众',
    
    // AI Thinking
    analyzing: '正在理解你的旅行偏好...',
    matching: '正在匹配最佳城市...',
    generating: '正在计算路线节奏...',
    rendering: '正在生成 3D 轨道路线...',
    routeReady: '路线已生成',
    
    // Route List
    aiRouteCandidates: 'AI 推荐路线',
    routeSubtitle: '基于您的偏好信号与季节匹配度生成。',
    matchScore: '匹配度',
    days: '天',
    travelMood: '旅行氛围',
    pace: '节奏',
    seasonFit: '季节适宜度',
    aiConfidence: 'AI 置信度',
    viewDetails: '查看详情',
    hideDetails: '收起详情',
    
    // Timeline
    journeyTimeline: '行程时间线',
    aiRecommendation: 'AI 推荐',
    
  },
  en: {
    // Landing
    landingTitle: 'Let AI generate your next journey on Earth',
    landingSubtitle: 'Input your time, budget, and preferences. AI will generate a visualized global route.',
    startPlanning: 'Start Planning',
    viewDemo: 'View Demo',
    demoSummary: 'Asia Inspiration Route · 14 Days · 98% Match',
    
    // Header
    appName: 'Travel OS',
    appDesc: 'AI Travel Intelligence',
    signIn: 'Sign In',
    
    // Planner Panel
    promptLabel: 'Describe your travel vision',
    promptPlaceholder: 'e.g., I want a 14-day trip starting from Tokyo, medium budget, focusing on islands, food, and niche cities...',
    travelMode: 'Travel Mode',
    travelSignals: 'Travel Signals',
    generateOrbit: 'Generate Travel Route',
    moreOptions: 'More Options',
    hideOptions: 'Hide Options',
    
    // HTML Floating Cards (Demo)
    tokyoTags: 'Food / Nightscape / Tech',
    tokyoDesc: 'First stop for neon lights and late-night diners.',
    baliTags: 'Island / Sunset / Relax',
    baliDesc: 'End your journey with sunsets and sea breeze.',
    singaporeTags: 'Garden City / Architecture / Night Tour',
    singaporeDesc: 'A blend of futuristic city and tropical nights.',
    shanghaiTags: 'Bund / Urban / Food',
    shanghaiDesc: 'Switch travel rhythms amidst the city skyline.',
    
    // Budgets
    budgetLow: 'Econ',
    budgetMedium: 'Balanced',
    budgetHigh: 'Premium',
    budgetLuxury: 'Luxury',

    // Styles
    styleCinematic: 'Cinematic',
    styleNature: 'Nature',
    styleUrban: 'Urban',
    styleHistorical: 'Historical',
    styleFamily: 'Family',
    styleHoneymoon: 'Honeymoon',
    stylePhotography: 'Photography',
    styleNiche: 'Niche',
    
    // AI Thinking
    analyzing: 'Understanding your preferences...',
    matching: 'Matching optimal cities...',
    generating: 'Calculating route rhythm...',
    rendering: 'Rendering 3D orbit path...',
    routeReady: 'Route ready',
    
    // Route List
    aiRouteCandidates: 'AI Route Candidates',
    routeSubtitle: 'Generated from your travel signals and seasonal fit.',
    matchScore: 'Match Score',
    days: 'Days',
    travelMood: 'Travel Mood',
    pace: 'Pace',
    seasonFit: 'Season Fit',
    aiConfidence: 'AI Confidence',
    viewDetails: 'View Details',
    hideDetails: 'Hide Details',
    
    // Timeline
    journeyTimeline: 'Journey Timeline',
    aiRecommendation: 'AI Recommendation',
  }
};
