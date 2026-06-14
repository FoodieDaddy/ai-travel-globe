export type Language = 'zh' | 'en';

export const translations = {
  zh: {
    // App Base
    appName: 'Travel Memory Globe',
    appDesc: '我的旅行记忆点亮地球',
    signIn: '登录',
    
    // Left Panel (Stats & Search)
    memoryPanelTitle: '我的旅行足迹',
    memoryPanelSubtitle: '点亮你去过的城市，记录每一段旅程。',
    statCities: '已点亮城市',
    statCountries: '已访问国家/地区',
    statPhotos: '已上传照片',
    recentMemories: '最近记录',
    recentlyLit: '最近点亮',
    searchPlaceholder: '搜索城市、景点或国家...',
    addMemoryBtn: '添加旅行记录',
    
    // Right Panel (Detail)
    selectPlaceHint: '选择地球上的一个地点，查看景点和你的记录。',
    whatsHere: '这里有什么：',
    bestFor: '适合：',
    statusLabel: '状态：',
    statusNotVisited: '你还没有点亮这里',
    statusVisited: '已点亮',
    markVisitedBtn: '标记为去过',
    uploadPhotoBtn: '上传照片',
    uploadMoreBtn: '继续上传照片',
    myTags: '我的标签：',
    myNotes: '我的记录：',
    myPhotos: '我的照片：',
    editNoteBtn: '编辑记录',
    litUpSuccess: '已点亮这个地方！',

    // Mock places tags/descriptions (can be used as fallback)
    tokyoTags: '美食 / 夜景 / 科技',
    tokyoDesc: '霓虹都市与深夜食堂的第一站。',
    baliTags: '海岛 / 日落 / 放松',
    baliDesc: '用日落和海风结束整段旅程。',
    singaporeTags: '花园城市 / 建筑 / 夜游',
    singaporeDesc: '未来感城市与热带夜景交汇。',
    shanghaiTags: '外滩 / 都市 / 美食',
    shanghaiDesc: '在城市天际线中切换旅行节奏。',
  },
  en: {
    // App Base
    appName: 'Travel Memory Globe',
    appDesc: 'My Travel Memory Globe',
    signIn: 'Sign In',
    
    // Left Panel (Stats & Search)
    memoryPanelTitle: 'My Travel Footprints',
    memoryPanelSubtitle: 'Light up places you have visited, record every journey.',
    statCities: 'Cities Lit Up',
    statCountries: 'Countries Visited',
    statPhotos: 'Photos Uploaded',
    recentMemories: 'Recent Memories',
    recentlyLit: 'Recently Lit Up',
    searchPlaceholder: 'Search city, landmark or country...',
    addMemoryBtn: 'Add Travel Memory',
    
    // Right Panel (Detail)
    selectPlaceHint: 'Select a place on the globe to view highlights and your memories.',
    whatsHere: "What's here:",
    bestFor: 'Best for:',
    statusLabel: 'Status:',
    statusNotVisited: "You haven't lit up this place yet.",
    statusVisited: 'Lit Up',
    markVisitedBtn: 'Mark as visited',
    uploadPhotoBtn: 'Upload Photos',
    uploadMoreBtn: 'Upload more photos',
    myTags: 'My Tags:',
    myNotes: 'My Notes:',
    myPhotos: 'My Photos:',
    editNoteBtn: 'Edit Note',
    litUpSuccess: 'Place lit up!',

    // Mock places tags/descriptions (can be used as fallback)
    tokyoTags: 'Food / Nightscape / Tech',
    tokyoDesc: 'First stop for neon lights and late-night diners.',
    baliTags: 'Island / Sunset / Relax',
    baliDesc: 'End your journey with sunsets and sea breeze.',
    singaporeTags: 'Garden City / Architecture / Night Tour',
    singaporeDesc: 'A blend of futuristic city and tropical nights.',
    shanghaiTags: 'Bund / Urban / Food',
    shanghaiDesc: 'Switch travel rhythms amidst the city skyline.',
  }
};
