import React, { useState, useMemo, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Background } from '../components/Layout/Background';
import { Header } from '../components/Layout/Header';
import { ChinaMemoryScene } from '../components/china/ChinaMemoryScene';
import { ChinaMemoryStats } from '../components/china/ChinaMemoryStats';
import { ChinaMemoryCard } from '../components/china/ChinaMemoryCard';
import { ChinaMemoryDock } from '../components/china/ChinaMemoryDock';
import { INITIAL_CHINA_PLACES } from '../data/chinaPlaces';
import { ChinaPlace } from '../types/china';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Award, Map, Compass } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

// -------------------------------------------------------------
// 三维大圆航线坐标插值函数（用于生成淡雅的已走过足迹线段）
// -------------------------------------------------------------
function latLngToVector3(lat: number, lng: number): THREE.Vector3 {
  const latRad = (lat * Math.PI) / 180;
  const lngRad = (lng * Math.PI) / 180;
  // 对齐 Y-up 坐标系
  const phi = (90 - lat) * Math.PI / 180;
  const theta = (lng + 90) * Math.PI / 180;
  const x = Math.sin(phi) * Math.sin(theta);
  const y = Math.cos(phi);
  const z = Math.sin(phi) * Math.cos(theta);
  return new THREE.Vector3(x, y, z);
}

function vector3ToLatLng(v: THREE.Vector3): { lat: number; lng: number } {
  const r = v.length();
  const lat = Math.asin(v.y / r) * (180 / Math.PI);
  const lng = Math.atan2(v.x, v.z) * (180 / Math.PI);
  return { lat, lng };
}

function interpolateLine(
  p1: { lat: number; lng: number },
  p2: { lat: number; lng: number },
  steps = 35
): [number, number][] {
  const v1 = latLngToVector3(p1.lat, p1.lng);
  const v2 = latLngToVector3(p2.lat, p2.lng);
  const points: [number, number][] = [];
  const angle = v1.angleTo(v2);

  if (angle < 0.001) {
    for (let i = 0; i <= steps; i++) points.push([p1.lat, p1.lng]);
    return points;
  }

  const sinAngle = Math.sin(angle);
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const f1 = Math.sin((1 - t) * angle) / sinAngle;
    const f2 = Math.sin(t * angle) / sinAngle;
    const vSlerp = new THREE.Vector3()
      .addScaledVector(v1, f1)
      .addScaledVector(v2, f2)
      .normalize();
    const coord = vector3ToLatLng(vSlerp);
    points.push([coord.lat, coord.lng]);
  }
  return points;
}

// -------------------------------------------------------------
// 中国城市预设 Mock 经纬度映射字典 (用于点亮打卡)
// -------------------------------------------------------------
const CHINA_CITY_COORDINATES: Record<string, { lat: number; lng: number; province: string; region: any }> = {
  "北京": { lat: 39.9042, lng: 116.4074, province: "北京", region: "华北" },
  "南京": { lat: 32.0603, lng: 118.7969, province: "江苏", region: "华东" },
  "西安": { lat: 34.3416, lng: 108.9398, province: "陕西", region: "西北" },
  "成都": { lat: 30.5728, lng: 104.0668, province: "四川", region: "西南" },
  "重庆": { lat: 29.5630, lng: 106.5516, province: "重庆", region: "西南" },
  "哈尔滨": { lat: 45.8038, lng: 126.5350, province: "黑龙江", region: "东北" },
  "大理": { lat: 25.6899, lng: 100.2224, province: "云南", region: "西南" },
  "厦门": { lat: 24.4798, lng: 118.0894, province: "福建", region: "华南" },
  "青岛": { lat: 36.0671, lng: 120.3826, province: "山东", region: "华东" },
  "长沙": { lat: 28.1941, lng: 112.9823, province: "湖南", region: "华中" },
  "广州": { lat: 23.1291, lng: 113.2644, province: "广东", region: "华南" },
  "深圳": { lat: 22.5431, lng: 114.0579, province: "广东", region: "华南" },
  "桂林": { lat: 25.2736, lng: 110.2901, province: "广西", region: "华南" }
};

const getCoordsForChinaCity = (cityName: string): { lat: number; lng: number; province: string; region: any } => {
  const normalized = cityName.trim();
  if (CHINA_CITY_COORDINATES[normalized]) {
    return CHINA_CITY_COORDINATES[normalized];
  }
  // 哈希落点，确保随机中国城市也落在国内版图内 (30N to 40N, 100E to 120E)
  let hash = 0;
  for (let i = 0; i < normalized.length; i++) {
    hash = normalized.charCodeAt(i) + ((hash << 5) - hash);
  }
  const lat = 30 + Math.abs(hash % 10);
  const lng = 100 + Math.abs((hash >> 8) % 20);
  return { lat, lng, province: "其他省份", region: "西南" };
};

const ChinaMemoryPage: React.FC = () => {
  const { language } = useLanguage();
  const [places, setPlaces] = useState<ChinaPlace[]>(INITIAL_CHINA_PLACES);
  const [selectedPlace, setSelectedPlace] = useState<ChinaPlace | null>(null);

  // 搜索和过滤
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Onboarding 载入状态
  const [onboardingFinished, setOnboardingFinished] = useState<boolean>(false);
  const [revealedVisitedIds, setRevealedVisitedIds] = useState<string[]>([]);
  const [revealedLines, setRevealedLines] = useState<any[]>([]);
  const onboardingStarted = useRef<boolean>(false);

  // 已点亮城市升序顺序：上海 -> 苏州 -> 杭州 -> 拉萨
  const visitedOrdered = useMemo(() => {
    const customOrder = ['c_shanghai', 'c_suzhou', 'c_hangzhou', 'c_lhasa'];
    return [...places]
      .filter(p => p.visited)
      .sort((a, b) => {
        const indexA = customOrder.indexOf(a.id);
        const indexB = customOrder.indexOf(b.id);
        if (indexA !== -1 && indexB !== -1) return indexA - indexB;
        if (indexA !== -1) return -1;
        if (indexB !== -1) return 1;
        return (a.visitedAt || '').localeCompare(b.visitedAt || '');
      });
  }, [places]);

  // 1. 开场加载演出：背景淡入 -> 地球渐显 -> 上海、苏州、杭州、拉萨依次点亮生长飞线 -> 聚焦杭州 -> UI滑入
  useEffect(() => {
    if (onboardingStarted.current) return;
    onboardingStarted.current = true;

    if (visitedOrdered.length < 4) return;

    let timers: NodeJS.Timeout[] = [];

    // 0.8s: 点亮 上海
    timers.push(setTimeout(() => {
      setRevealedVisitedIds([visitedOrdered[0].id]);
    }, 800));

    // 1.7s: 点亮 苏州，生长 上海 -> 苏州
    timers.push(setTimeout(() => {
      setRevealedVisitedIds(prev => [...prev, visitedOrdered[1].id]);
      setRevealedLines(prev => [
        ...prev,
        {
          points: interpolateLine(visitedOrdered[0], visitedOrdered[1]),
          color: 'rgba(251, 191, 36, 0.55)', // 淡淡的暖金色粒子虚线
          stroke: 0.75,
          dashLength: 0.25,
          dashGap: 0.15,
          dashAnimateTime: 1800
        }
      ]);
    }, 1700));

    // 2.6s: 点亮 杭州，生长 苏州 -> 杭州
    timers.push(setTimeout(() => {
      setRevealedVisitedIds(prev => [...prev, visitedOrdered[2].id]);
      setRevealedLines(prev => [
        ...prev,
        {
          points: interpolateLine(visitedOrdered[1], visitedOrdered[2]),
          color: 'rgba(251, 191, 36, 0.55)',
          stroke: 0.75,
          dashLength: 0.25,
          dashGap: 0.15,
          dashAnimateTime: 1800
        }
      ]);
    }, 2600));

    // 3.5s: 点亮 拉萨，生长 杭州 -> 拉萨
    timers.push(setTimeout(() => {
      setRevealedVisitedIds(prev => [...prev, visitedOrdered[3].id]);
      setRevealedLines(prev => [
        ...prev,
        {
          points: interpolateLine(visitedOrdered[2], visitedOrdered[3]),
          color: 'rgba(251, 191, 36, 0.55)',
          stroke: 0.75,
          dashLength: 0.25,
          dashGap: 0.15,
          dashAnimateTime: 1800
        }
      ]);
    }, 3500));

    // 4.2s: 聚焦默认地点 杭州，滑入右侧照片卡与 floating 照片浮层，触发滚数
    timers.push(setTimeout(() => {
      setOnboardingFinished(true);
      const hangzhou = visitedOrdered.find(p => p.id === 'c_hangzhou');
      if (hangzhou) {
        setSelectedPlace(hangzhou);
      }
    }, 4200));

    return () => {
      timers.forEach(t => clearTimeout(t));
    };
  }, []);

  // 2. 搜索过滤
  const filteredPlaces = useMemo(() => {
    return places.filter(p => {
      let matchesSearch = true;
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        matchesSearch = 
          p.name.toLowerCase().includes(query) || 
          p.province.toLowerCase().includes(query) ||
          p.region.toLowerCase().includes(query) ||
          (p.note && p.note.toLowerCase().includes(query)) ||
          (p.tags && p.tags.some(t => t.toLowerCase().includes(query)));
      }
      return matchesSearch;
    });
  }, [places, searchQuery]);

  // 监听唯一搜索结果对焦
  useEffect(() => {
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      const matched = places.filter(p => 
        (p.visited || p.season) && (
          p.name.toLowerCase().includes(query) || 
          p.province.toLowerCase().includes(query)
        )
      );
      if (matched.length === 1) {
        setSelectedPlace(matched[0]);
      }
    }
  }, [searchQuery, places]);

  // 3. 经典旅行路线大区交互 (江南、西北、西南等图卷)
  const chinaRoutes = [
    {
      name: "江南烟雨图卷",
      desc: "上海 → 苏州 → 杭州",
      points: ["c_shanghai", "c_suzhou", "c_hangzhou"],
      color: "rgba(56, 189, 248, 0.65)" // 青蓝色飞线
    },
    {
      name: "雪域云巅长歌",
      desc: "成都 → 重庆 → 大理 → 拉萨",
      points: ["c_chengdu", "c_chongqing", "c_dali", "c_lhasa"],
      color: "rgba(251, 191, 36, 0.65)" // 暖金色飞线
    }
  ];

  const handlePlayRoute = (route: typeof chinaRoutes[0]) => {
    showToast(`正在展开旅行图卷: ${route.name}`);
    
    // 自动将整条线路的节点“标记为去过”，并生长流动飞线
    let delay = 0;
    route.points.forEach((placeId, index) => {
      setTimeout(() => {
        setPlaces(prev => prev.map(p => p.id === placeId ? { ...p, visited: true, visitedAt: "2026 夏" } : p));
        if (!revealedVisitedIds.includes(placeId)) {
          setRevealedVisitedIds(prev => [...prev, placeId]);
        }
        
        const currentPlace = places.find(p => p.id === placeId);
        if (currentPlace) {
          setSelectedPlace(currentPlace);
        }

        // 生长与上一个点的连接飞线
        if (index > 0) {
          const prevPlace = places.find(p => p.id === route.points[index - 1]);
          const currPlace = places.find(p => p.id === placeId);
          if (prevPlace && currPlace) {
            setRevealedLines(prev => [
              ...prev,
              {
                points: interpolateLine(prevPlace, currPlace),
                color: route.color,
                stroke: 0.85,
                dashLength: 0.25,
                dashGap: 0.15,
                dashAnimateTime: 1800
              }
            ]);
          }
        }
      }, delay);
      delay += 1200; // 每个城市间隔 1.2 秒飞越
    });
  };

  // 4. 交互回调
  const handlePlaceSelect = (place: ChinaPlace) => {
    setSelectedPlace(place);
  };

  const handleMarkVisited = (placeId: string) => {
    const today = new Date();
    const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    setPlaces(prev => prev.map(p => {
      if (p.id === placeId) {
        return { ...p, visited: true, visitedAt: dateStr, season: undefined };
      }
      return p;
    }));

    setSelectedPlace(prev => {
      if (prev && prev.id === placeId) {
        return { ...prev, visited: true, visitedAt: dateStr, season: undefined };
      }
      return prev;
    });

    if (!revealedVisitedIds.includes(placeId)) {
      setRevealedVisitedIds(prev => [...prev, placeId]);
      
      const visited = places.filter(p => p.visited);
      if (visited.length > 0) {
        const last = visited[visited.length - 1];
        const current = places.find(p => p.id === placeId);
        if (current) {
          setRevealedLines(prev => [
            ...prev,
            {
              points: interpolateLine(last, current),
              color: 'rgba(251, 191, 36, 0.55)',
              stroke: 0.75,
              dashLength: 0.25,
              dashGap: 0.15,
              dashAnimateTime: 1800
            }
          ]);
        }
      }
    }

    showToast("已点亮这段中国记忆！");
  };

  const handlePhotoUpload = (placeId: string, photoUrl: string) => {
    setPlaces(prev => prev.map(p => {
      if (p.id === placeId) {
        return { ...p, photos: [...(p.photos || []), photoUrl] };
      }
      return p;
    }));

    setSelectedPlace(prev => {
      if (prev && prev.id === placeId) {
        return { ...prev, photos: [...(prev.photos || []), photoUrl] };
      }
      return prev;
    });

    showToast("旅行照片上传成功！已在点位与卡片中实时呈现！");
  };

  // 添加新足迹 Modal 和 Toast
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newCityName, setNewCityName] = useState('');
  const [newNote, setNewNote] = useState('');
  const [newTags, setNewTags] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
  };

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(null), 3200);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const handleSaveNewPlace = () => {
    if (!newCityName.trim()) {
      showToast("请填写城市名称！");
      return;
    }

    const cityMeta = getCoordsForChinaCity(newCityName);
    const today = new Date();
    const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    const newPlace: ChinaPlace = {
      id: `custom_china_${Date.now()}`,
      name: newCityName.trim(),
      province: cityMeta.province,
      region: cityMeta.region,
      type: 'custom',
      lat: cityMeta.lat,
      lng: cityMeta.lng,
      visited: true,
      visitedAt: dateStr,
      description: "在未知的角落，留下一份神州探索足迹。",
      highlights: ["探索新回忆地标"],
      tags: newTags.split(/[,，]/).map(t => t.trim()).filter(Boolean),
      note: newNote.trim() || "探索祖国壮丽河山，点亮专属足迹。",
      photos: ["https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=500&q=80"]
    };

    setPlaces(prev => [...prev, newPlace]);
    setRevealedVisitedIds(prev => [...prev, newPlace.id]);

    const activeVisited = places.filter(p => p.visited);
    if (activeVisited.length > 0) {
      const lastPlace = activeVisited[activeVisited.length - 1];
      setRevealedLines(prev => [
        ...prev,
        {
          points: interpolateLine(lastPlace, newPlace),
          color: 'rgba(251, 191, 36, 0.55)',
          stroke: 0.75,
          dashLength: 0.25,
          dashGap: 0.15,
          dashAnimateTime: 1800
        }
      ]);
    }

    setSelectedPlace(newPlace);
    setAddModalOpen(false);

    // 重置表单
    setNewCityName('');
    setNewNote('');
    setNewTags('');

    showToast(`已成功点亮新回忆城市: ${newPlace.name}！`);
  };

  return (
    <div className="w-full h-screen bg-[#020512] text-white overflow-hidden relative font-sans select-none">
      {/* 极简星空毛玻璃背景 */}
      <Background />

      {/* 顶部 Branding 标题 (中国专属) */}
      <Header appPhase="planning" />

      {/* 3D 中国聚焦球体画布 (居中偏右 60% 宽度，完美锁焦中国) */}
      <div className="absolute top-0 right-0 bottom-0 left-[40vw] z-0">
        <ChinaMemoryScene 
          places={filteredPlaces}
          selectedPlace={selectedPlace}
          onPlaceClick={handlePlaceSelect}
          revealedVisitedIds={revealedVisitedIds}
          revealedLines={revealedLines}
        />
      </div>

      {/* 常规 UI 轻量浮卡面板 */}
      <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between p-6">
        <div className="flex-1 flex justify-between items-center w-full mt-16 mb-20">
          
          {/* 左侧：中国足迹指标统计浮层 与 图卷路线面板 */}
          <div className="self-end justify-self-start flex flex-col gap-4 pointer-events-auto">
            
            {/* 1) 数据统计 */}
            <AnimatePresence>
              <ChinaMemoryStats 
                places={places}
                onPlaceSelect={handlePlaceSelect}
                animateStats={true}
              />
            </AnimatePresence>

            {/* 2) 经典足迹路线图卷展示 */}
            <motion.div
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
              className="w-[300px] backdrop-blur-xl bg-slate-950/25 border border-white/15 rounded-2xl p-4 shadow-[0_16px_40px_rgba(0,0,0,0.5)] flex flex-col gap-2.5"
            >
              <div className="flex items-center gap-1 text-[9px] font-extrabold tracking-widest text-amber-400 uppercase">
                <Map className="w-3.5 h-3.5" />
                <span>足迹路线图卷展开</span>
              </div>
              <div className="flex flex-col gap-2">
                {chinaRoutes.map((route) => (
                  <button
                    key={route.name}
                    onClick={() => handlePlayRoute(route)}
                    className="w-full text-left p-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.08] border border-white/10 hover:border-amber-400/40 transition-all flex flex-col gap-0.5 cursor-pointer group"
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-[11.5px] font-bold text-white/95 group-hover:text-amber-400 transition-colors">{route.name}</span>
                      <Compass className="w-3.5 h-3.5 text-white/40 group-hover:text-amber-400 group-hover:animate-spin transition-all" />
                    </div>
                    <span className="text-[9.5px] text-white/50">{route.desc}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>

          {/* 右侧：中国照片记忆详情卡 */}
          <div className="self-stretch flex items-center ml-auto">
            <AnimatePresence mode="wait">
              {onboardingFinished && selectedPlace && (
                <ChinaMemoryCard 
                  key={selectedPlace.id}
                  place={selectedPlace}
                  onMarkVisited={handleMarkVisited}
                  onPhotoUpload={handlePhotoUpload}
                  onClose={() => setSelectedPlace(null)}
                  onCenterPlace={handlePlaceSelect}
                />
              )}
            </AnimatePresence>
          </div>

        </div>

        {/* 底部 Dock 搜索/打卡 */}
        <AnimatePresence>
          <ChinaMemoryDock 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onAddClick={() => setAddModalOpen(true)}
          />
        </AnimatePresence>
      </div>

      {/* 新增打卡模态框 */}
      <AnimatePresence>
        {addModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-auto bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="w-[380px] backdrop-blur-xl bg-slate-950/75 border border-white/15 rounded-2xl p-6 shadow-[0_24px_60px_rgba(0,0,0,0.8)] text-white space-y-4"
            >
              <div className="flex justify-between items-center pb-2 border-b border-white/10">
                <h3 className="text-sm font-black tracking-widest text-white uppercase">点亮一段中国记忆</h3>
                <button
                  onClick={() => setAddModalOpen(false)}
                  className="p-1 rounded-full text-white/50 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3.5 text-xs">
                <div className="flex flex-col gap-1.5">
                  <label className="text-white/60 font-semibold tracking-wider">打卡城市</label>
                  <input
                    type="text"
                    value={newCityName}
                    onChange={(e) => setNewCityName(e.target.value)}
                    placeholder="例如: 北京, 西安, 成都..."
                    className="px-3 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-white outline-none focus:border-amber-400/40"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-white/60 font-semibold tracking-wider">旅行日记</label>
                  <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="写下一两句深深刻在心里的旅行感悟..."
                    rows={3}
                    className="px-3 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-white outline-none focus:border-amber-400/40 resize-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-white/60 font-semibold tracking-wider">旅行标签 (以逗号分隔)</label>
                  <input
                    type="text"
                    value={newTags}
                    onChange={(e) => setNewTags(e.target.value)}
                    placeholder="例如: 古都, 火锅, 山水"
                    className="px-3 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-white outline-none focus:border-amber-400/40"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setAddModalOpen(false)}
                  className="flex-1 py-2 rounded-xl border border-white/10 hover:bg-white/5 transition-all text-xs font-semibold cursor-pointer text-white/70 hover:text-white"
                >
                  取消
                </button>
                <button
                  onClick={handleSaveNewPlace}
                  className="flex-1 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-extrabold transition-all shadow-[0_4px_12px_rgba(245,158,11,0.2)] cursor-pointer"
                >
                  点亮打卡
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] px-5 py-3 rounded-xl bg-slate-950/90 border border-amber-400/40 shadow-[0_8px_32px_rgba(245,158,11,0.2)] flex items-center gap-2 pointer-events-auto"
          >
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs font-bold text-white tracking-wide">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChinaMemoryPage;
