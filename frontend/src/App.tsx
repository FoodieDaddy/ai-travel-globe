import React, { useState, useMemo, useEffect } from 'react';
import { Background } from './components/Layout/Background';
import { Header } from './components/Layout/Header';
import { TravelGlobe } from './components/Globe/TravelGlobe';
import { MemoryStatsPanel } from './components/Memory/MemoryStatsPanel';
import { PlaceDetailPanel } from './components/Memory/PlaceDetailPanel';
import { GuideCommentaryPanel } from './components/Memory/GuideCommentaryPanel';
import { Dock } from './components/Memory/Dock';
import { INITIAL_PLACES } from './data/places';
import { Place } from './types/travel';
import { X, Play } from 'lucide-react';

function App() {
  const [places, setPlaces] = useState<Place[]>(INITIAL_PLACES);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(() => {
    // 默认选中最近点亮/起点地点 “武陵源” 以防加载时右侧空白，完美吻合 demo 视频第一帧
    return INITIAL_PLACES.find(p => p.id === 'p_wulingyuan') || null;
  });

  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [immersiveActive, setImmersiveActive] = useState<boolean>(false);
  const [isGuideVisible, setIsGuideVisible] = useState<boolean>(true);

  // 1. 过滤逻辑：根据底部 Dock 筛选器条件过滤点位数据
  const filteredPlaces = useMemo(() => {
    return places.filter(place => {
      if (activeFilter === 'all') return true;
      if (activeFilter === 'visited') return place.visited;
      if (activeFilter === 'planned') return place.plannedDate && !place.visited;
      // 类别筛选: heritage, nature, landmark, custom
      return place.type === activeFilter;
    });
  }, [places, activeFilter]);

  // 2. TTS 语音播报状态管理
  const speakText = (text: string, onEnd: () => void) => {
    if (!window.speechSynthesis) {
      onEnd();
      return;
    }
    // 取消当前任何正在播放的语音
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    utterance.rate = 0.95; // 稍微放慢，让播报听起来更生动高级
    
    utterance.onend = () => {
      onEnd();
    };
    utterance.onerror = (e) => {
      console.error("Speech Synthesis Error:", e);
      onEnd();
    };
    window.speechSynthesis.speak(utterance);
  };

  // 小车驶达站点时触发
  const handleReachPlace = (place: Place, onSpeechEnd: () => void) => {
    // 聚焦小车所在的当前景点
    setSelectedPlace(place);
    
    // 如果有传说故事，调用 TTS 语音解说
    if (place.legendStory) {
      speakText(place.legendStory, onSpeechEnd);
    } else {
      setTimeout(onSpeechEnd, 1500);
    }
  };

  // 退出沉浸式体验
  const handleExitImmersive = () => {
    setImmersiveActive(false);
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel(); // 停止发声
    }
    // 返回默认聚焦
    setSelectedPlace(places.find(p => p.id === 'p_wulingyuan') || null);
  };

  // 地图点位点击回调
  const handlePlaceClick = (place: Place) => {
    setSelectedPlace(place);
  };

  // 景点详情打卡回调
  const handleMarkVisited = (placeId: string) => {
    const today = new Date();
    const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    setPlaces(prev => prev.map(p => {
      if (p.id === placeId) {
        return {
          ...p,
          visited: true,
          visitedAt: dateStr,
          plannedDate: undefined // 打卡后移除规划状态
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
  };

  // 景点详情加入规划回调
  const handleTogglePlanned = (placeId: string) => {
    const today = new Date();
    const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    setPlaces(prev => prev.map(p => {
      if (p.id === placeId) {
        const isPlanned = !!p.plannedDate;
        return {
          ...p,
          plannedDate: isPlanned ? undefined : dateStr
        };
      }
      return p;
    }));

    setSelectedPlace(prev => {
      if (prev && prev.id === placeId) {
        const isPlanned = !!prev.plannedDate;
        return {
          ...prev,
          plannedDate: isPlanned ? undefined : dateStr
        };
      }
      return prev;
    });
  };

  // 全局视角重置
  const handleResetView = () => {
    setSelectedPlace(null);
  };

  return (
    <div className="w-full h-screen bg-[#02040a] text-white overflow-hidden relative font-sans selection:bg-amber-500/30">
      {/* 极简星空毛玻璃背景 */}
      <Background />
      
      {/* 顶部 Branding 标题 */}
      <Header appPhase={immersiveActive ? 'landing' : 'planning'} />

      {/* 3D 互动地球主画布 */}
      <div className="absolute inset-0 z-0">
        <TravelGlobe 
          places={filteredPlaces}
          selectedPlace={selectedPlace}
          onPlaceClick={handlePlaceClick}
          immersiveActive={immersiveActive}
          onReachPlace={handleReachPlace}
        />
      </div>

      {/* 顶部沉浸模式状态条 */}
      {immersiveActive && (
        <div className="absolute top-8 left-1/2 -translate-x-1/2 z-50 flex items-center justify-center pointer-events-auto">
          <button 
            onClick={handleExitImmersive}
            className="px-6 py-2.5 rounded-full backdrop-blur-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 hover:border-rose-500/60 shadow-[0_4px_20px_rgba(244,63,94,0.3)] transition-all font-bold text-xs text-rose-200 tracking-widest flex items-center gap-1.5 cursor-pointer animate-pulse"
          >
            <X className="w-4 h-4" />
            退出视角
          </button>
        </div>
      )}

      {/* 常规 UI 面板图层 */}
      {!immersiveActive && (
        <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between p-8">
          {/* 中间核心交互层 */}
          <div className="flex-1 flex justify-between items-center w-full mt-16 mb-20">
            {/* 左下角导游解说卡片 */}
            <div className="self-end justify-self-start">
              <GuideCommentaryPanel 
                onStartCommentary={() => setImmersiveActive(true)}
                onClose={() => setIsGuideVisible(false)}
                visible={isGuideVisible}
              />
            </div>

            {/* 右侧交互侧边栏（Timeline 与 Detail 双模态切换） */}
            <div className="self-stretch flex items-center ml-auto">
              {selectedPlace ? (
                <PlaceDetailPanel 
                  place={selectedPlace}
                  onMarkVisited={handleMarkVisited}
                  onTogglePlanned={handleTogglePlanned}
                  onClose={() => setSelectedPlace(null)}
                  onCenterPlace={(p) => setSelectedPlace(p)}
                />
              ) : (
                <MemoryStatsPanel 
                  places={places}
                  onPlaceSelect={handlePlaceClick}
                  onStartImmersive={() => setImmersiveActive(true)}
                  onResetView={handleResetView}
                />
              )}
            </div>
          </div>

          {/* 底部 Dock 分类筛选器 */}
          <Dock 
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />
        </div>
      )}
    </div>
  );
}

export default App;
