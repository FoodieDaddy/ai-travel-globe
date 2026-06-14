import React, { useState, useMemo, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Background } from './components/Layout/Background';
import { Header } from './components/Layout/Header';
import { TravelGlobe } from './components/Globe/TravelGlobe';
import { MemoryStatsPanel } from './components/Memory/MemoryStatsPanel';
import { PlaceDetailPanel } from './components/Memory/PlaceDetailPanel';
import { Dock } from './components/Memory/Dock';
import { INITIAL_PLACES } from './data/places';
import { Place } from './types/travel';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

// -------------------------------------------------------------
// 三维大圆航线坐标插值函数（用于生成淡雅的已走过足迹线段）
// -------------------------------------------------------------
function latLngToVector3(lat: number, lng: number): THREE.Vector3 {
  const latRad = (lat * Math.PI) / 180;
  const lngRad = (lng * Math.PI) / 180;
  const x = Math.cos(latRad) * Math.cos(lngRad);
  const y = Math.cos(latRad) * Math.sin(lngRad);
  const z = Math.sin(latRad);
  return new THREE.Vector3(x, y, z);
}

function vector3ToLatLng(v: THREE.Vector3): { lat: number; lng: number } {
  const r = v.length();
  const lat = Math.asin(v.z / r) * (180 / Math.PI);
  const lng = Math.atan2(v.y, v.x) * (180 / Math.PI);
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
// 自定义城市 Mock 经纬度映射词典（优先查询）
// -------------------------------------------------------------
const CITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  "巴黎": { lat: 48.8566, lng: 2.3522 },
  "纽约": { lat: 40.7128, lng: -74.0060 },
  "伦敦": { lat: 51.5074, lng: -0.1278 },
  "北京": { lat: 39.9042, lng: 116.4074 },
  "悉尼": { lat: -33.8688, lng: 151.2093 },
  "里约热内卢": { lat: -22.9068, lng: -43.1729 },
  "开罗": { lat: 30.0444, lng: 31.2357 },
  "首尔": { lat: 37.5665, lng: 126.9780 },
  "Paris": { lat: 48.8566, lng: 2.3522 },
  "New York": { lat: 40.7128, lng: -74.0060 },
  "London": { lat: 51.5074, lng: -0.1278 },
  "Beijing": { lat: 39.9042, lng: 116.4074 },
  "Sydney": { lat: -33.8688, lng: 151.2093 },
  "Cairo": { lat: 30.0444, lng: 31.2357 }
};

const getCoordsForCity = (cityName: string): { lat: number; lng: number } => {
  const normalized = cityName.trim();
  if (CITY_COORDINATES[normalized]) {
    return CITY_COORDINATES[normalized];
  }
  // 稳定性哈希落点，确保随机生成的自定义城市都落在欧亚/非洲大陆上，避免跌落深海
  let hash = 0;
  for (let i = 0; i < normalized.length; i++) {
    hash = normalized.charCodeAt(i) + ((hash << 5) - hash);
  }
  const lat = 25 + Math.abs(hash % 30); // 25N to 55N
  const lng = 30 + Math.abs((hash >> 8) % 85); // 30E to 115E
  return { lat, lng };
};

function App() {
  const [places, setPlaces] = useState<Place[]>(INITIAL_PLACES);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  // 筛选与定位过滤器
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // -------------------------------------------------------------
  // 开场动画演出参数与状态机
  // -------------------------------------------------------------
  const [onboardingFinished, setOnboardingFinished] = useState<boolean>(false);
  const [revealedVisitedIds, setRevealedVisitedIds] = useState<string[]>([]);
  const [revealedLines, setRevealedLines] = useState<any[]>([]);
  const onboardingStarted = useRef<boolean>(false);

  // 已打卡地点（显式排序：上海 -> 新加坡 -> 京都 -> 东京）
  const visitedOrdered = useMemo(() => {
    const customOrder = ['p_shanghai', 'p_singapore', 'p_kyoto', 'p_tokyo'];
    return [...places]
      .filter(p => p.visited)
      .sort((a, b) => {
        const indexA = customOrder.indexOf(a.id);
        const indexB = customOrder.indexOf(b.id);
        if (indexA !== -1 && indexB !== -1) {
          return indexA - indexB;
        }
        if (indexA !== -1) return -1;
        if (indexB !== -1) return 1;
        return (a.visitedAt || '').localeCompare(b.visitedAt || '');
      });
  }, [places]);

  useEffect(() => {
    // 防止 HMR 或是 places 修改导致 onboarding 重复运行
    if (onboardingStarted.current) return;
    onboardingStarted.current = true;

    if (visitedOrdered.length < 4) return;

    let timers: NodeJS.Timeout[] = [];

    // 1. 点亮首站 新加坡
    timers.push(setTimeout(() => {
      setRevealedVisitedIds([visitedOrdered[0].id]);
    }, 800));

    // 2. 点亮第二站 上海，并生长虚线粒子流动连线
    timers.push(setTimeout(() => {
      setRevealedVisitedIds(prev => [...prev, visitedOrdered[1].id]);
      setRevealedLines(prev => [
        ...prev,
        {
          points: interpolateLine(visitedOrdered[0], visitedOrdered[1]),
          color: 'rgba(251, 191, 36, 0.55)', // 淡淡的暖金色流动虚线
          stroke: 0.75,
          dashLength: 0.25,
          dashGap: 0.15,
          dashAnimateTime: 1800
        }
      ]);
    }, 1700));

    // 3. 点亮第三站 京都，并生长线段
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

    // 4. 点亮第四站 东京，并生长线段
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

    // 5. 演出完成，聚焦 Kyoto 并浮现照片浮卡、启动左侧数字滚数
    timers.push(setTimeout(() => {
      setOnboardingFinished(true);
      const kyoto = visitedOrdered.find(p => p.id === 'p_kyoto');
      if (kyoto) {
        setSelectedPlace(kyoto);
      }
    }, 4200));

    return () => {
      timers.forEach(t => clearTimeout(t));
    };
  }, []); // 空依赖数组，只在 mount 时执行一次

  // -------------------------------------------------------------
  // 地图过滤与搜索点位
  // -------------------------------------------------------------
  const filteredPlaces = useMemo(() => {
    return places.filter(p => {
      let matchesFilter = true;
      if (activeFilter === 'all') matchesFilter = true;
      else if (activeFilter === 'visited') matchesFilter = p.visited;
      else if (activeFilter === 'planned') matchesFilter = p.plannedDate && !p.visited;
      else matchesFilter = p.type === activeFilter;

      let matchesSearch = true;
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        matchesSearch = 
          p.name.toLowerCase().includes(query) || 
          p.country.toLowerCase().includes(query) ||
          (p.userNote && p.userNote.toLowerCase().includes(query)) ||
          (p.userTags && p.userTags.some(t => t.toLowerCase().includes(query)));
      }

      return matchesFilter && matchesSearch;
    });
  }, [places, activeFilter, searchQuery]);

  // 监听搜索词唯一匹配时自动定位聚焦
  useEffect(() => {
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      const matched = places.filter(p => 
        (p.visited || p.plannedDate) && (
          p.name.toLowerCase().includes(query) || 
          p.country.toLowerCase().includes(query)
        )
      );
      if (matched.length === 1) {
        setSelectedPlace(matched[0]);
      }
    }
  }, [searchQuery, places]);

  // 定位与打卡回调
  const handlePlaceSelect = (place: Place) => {
    setSelectedPlace(place);
  };

  const handleMarkVisited = (placeId: string) => {
    const today = new Date();
    const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    setPlaces(prev => prev.map(p => {
      if (p.id === placeId) {
        return {
          ...p,
          visited: true,
          visitedAt: dateStr,
          plannedDate: undefined
        };
      }
      return p;
    }));

    setSelectedPlace(prev => {
      if (prev && prev.id === placeId) {
        return {
          ...prev,
          visited: true,
          visitedAt: dateStr,
          plannedDate: undefined
        };
      }
      return prev;
    });

    // 确保打卡点被动态计入已点亮列表中
    if (!revealedVisitedIds.includes(placeId)) {
      setRevealedVisitedIds(prev => [...prev, placeId]);
      
      // 并寻找上一个最近已打卡节点，动态增加足迹流动线
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

    showToast("目的地足迹点亮成功！已接入回忆网络！");
  };

  // 模拟照片上传回调
  const handlePhotoUpload = (placeId: string, photoUrl: string) => {
    setPlaces(prev => prev.map(p => {
      if (p.id === placeId) {
        return {
          ...p,
          userPhotos: [...(p.userPhotos || []), photoUrl]
        };
      }
      return p;
    }));

    setSelectedPlace(prev => {
      if (prev && prev.id === placeId) {
        return {
          ...prev,
          userPhotos: [...(prev.userPhotos || []), photoUrl]
        };
      }
      return prev;
    });
    
    showToast("旅行记忆照片上传成功，地球点位亮度已增强！");
  };

  // -------------------------------------------------------------
  // 添加新的旅行记录 Modal 与 Toast 系统
  // -------------------------------------------------------------
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newCityName, setNewCityName] = useState('');
  const [newCountry, setNewCountry] = useState('');
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
    if (!newCityName.trim() || !newCountry.trim()) {
      showToast("请填写城市名称和国家！");
      return;
    }

    const coords = getCoordsForCity(newCityName);
    const today = new Date();
    const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    const newPlace: Place = {
      id: `custom_${Date.now()}`,
      name: newCityName.trim(),
      country: newCountry.trim(),
      type: 'custom',
      lat: coords.lat,
      lng: coords.lng,
      visited: true,
      visitedAt: dateStr,
      userNote: newNote.trim() || "在未知的角落，留下一份探索足迹。",
      userTags: newTags.split(/[,，]/).map(t => t.trim()).filter(Boolean),
      userPhotos: [
        "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=500&q=80"
      ],
      highlights: ["探索新回忆地标"]
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
    setNewCountry('');
    setNewNote('');
    setNewTags('');

    showToast(`成功点亮新回忆城市: ${newPlace.name}！`);
  };

  return (
    <div className="w-full h-screen bg-[#020512] text-white overflow-hidden relative font-sans select-none">
      {/* 极简星空毛玻璃背景 */}
      <Background />

      {/* 顶部 Branding 标题 */}
      <Header appPhase="planning" />

      {/* 3D 点阵地球画布图层 (地球位于页面中心偏右，占满 60% 的主视觉区域，不被裁切) */}
      <div className="absolute top-0 right-0 bottom-0 left-[40vw] z-0">
        <TravelGlobe 
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
          
          {/* 左侧：我的打卡指标统计浮层 */}
          <div className="self-end justify-self-start">
            <AnimatePresence>
              <MemoryStatsPanel 
                places={places}
                onPlaceSelect={handlePlaceSelect}
                animateStats={true}
              />
            </AnimatePresence>
          </div>

          {/* 右侧：景点“照片记忆浮层” */}
          <div className="self-stretch flex items-center ml-auto">
            <AnimatePresence mode="wait">
              {onboardingFinished && selectedPlace && (
                <PlaceDetailPanel 
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

        {/* 底部 Dock 轻量地图工具栏 */}
        <AnimatePresence>
          <Dock 
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onAddClick={() => setAddModalOpen(true)}
          />
        </AnimatePresence>
      </div>

      {/* 添加旅行记忆模态框 */}
      <AnimatePresence>
        {addModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-auto bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="w-[380px] backdrop-blur-xl bg-slate-950/75 border border-white/15 rounded-2xl p-6 shadow-[0_24px_60px_rgba(0,0,0,0.8),0_0_30px_rgba(56,189,248,0.05)] text-white space-y-4"
            >
              <div className="flex justify-between items-center pb-2 border-b border-white/10">
                <h3 className="text-sm font-black tracking-widest text-white uppercase">点亮新的记忆</h3>
                <button
                  onClick={() => setAddModalOpen(false)}
                  className="p-1 rounded-full text-white/50 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3.5 text-xs">
                <div className="flex flex-col gap-1.5">
                  <label className="text-white/60 font-semibold tracking-wider">城市名称</label>
                  <input
                    type="text"
                    value={newCityName}
                    onChange={(e) => setNewCityName(e.target.value)}
                    placeholder="例如: Paris 或 巴黎"
                    className="px-3 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-white outline-none focus:border-amber-400/40"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-white/60 font-semibold tracking-wider">国家/地区</label>
                  <input
                    type="text"
                    value={newCountry}
                    onChange={(e) => setNewCountry(e.target.value)}
                    placeholder="例如: France"
                    className="px-3 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-white outline-none focus:border-amber-400/40"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-white/60 font-semibold tracking-wider">记录我的日记</label>
                  <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="写下一句记忆深刻的旅行记录..."
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
                    placeholder="例如: 浪漫, 塞纳河, 艺术"
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

      {/* Toast 提示 */}
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
}

export default App;
