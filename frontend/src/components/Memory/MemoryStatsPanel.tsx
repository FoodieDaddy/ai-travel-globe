import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Place } from '../../types/travel';
import { MapPin, Eye, Globe2, Plane, X } from 'lucide-react';

interface Props {
  places: Place[];
  onPlaceSelect: (place: Place) => void;
  onStartImmersive: () => void;
  onResetView: () => void;
  onClose?: () => void;
}

export const MemoryStatsPanel: React.FC<Props> = ({ 
  places, 
  onPlaceSelect, 
  onStartImmersive,
  onResetView,
  onClose
}) => {
  // 过滤出所有已打卡的地点，并按时间降序排序
  const visitedPlaces = useMemo(() => {
    return [...places]
      .filter(p => p.visited && p.visitedAt)
      .sort((a, b) => b.visitedAt!.localeCompare(a.visitedAt!));
  }, [places]);

  // 动态统计指标
  const stats = useMemo(() => {
    const countries = new Set(visitedPlaces.map(p => p.country));
    return {
      checkIns: visitedPlaces.length,
      spots: visitedPlaces.length,
      countries: countries.size
    };
  }, [visitedPlaces]);

  return (
    <motion.div 
      initial={{ x: 80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 80, opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-[360px] h-[calc(100vh-140px)] flex flex-col font-sans backdrop-blur-xl bg-slate-950/70 border border-white/10 rounded-2xl shadow-[0_16px_48px_rgba(0,0,0,0.65)] overflow-hidden relative pointer-events-auto"
    >
      {/* 顶部标题栏 */}
      <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-amber-400" />
          <h2 className="text-lg font-bold text-white tracking-wide">我的旅行轨迹</h2>
        </div>
        {onClose && (
          <button 
            onClick={onClose}
            className="p-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all text-white/50 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* 滚动内容区域 */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {/* 三格统计 */}
        <div className="grid grid-cols-3 gap-3">
          <div className="flex flex-col items-center justify-center py-2.5 px-2 bg-white/[0.03] border border-white/5 rounded-xl text-center">
            <span className="text-2xl font-bold font-mono text-amber-400">{stats.checkIns}</span>
            <span className="text-[10px] text-white/40 mt-0.5">打卡次数</span>
          </div>
          <div className="flex flex-col items-center justify-center py-2.5 px-2 bg-white/[0.03] border border-white/5 rounded-xl text-center">
            <span className="text-2xl font-bold font-mono text-amber-400">{stats.spots}</span>
            <span className="text-[10px] text-white/40 mt-0.5">景点数量</span>
          </div>
          <div className="flex flex-col items-center justify-center py-2.5 px-2 bg-white/[0.03] border border-white/5 rounded-xl text-center">
            <span className="text-2xl font-bold font-mono text-amber-400">{stats.countries}</span>
            <span className="text-[10px] text-white/40 mt-0.5">到访国家</span>
          </div>
        </div>

        {/* 2026 时间线 */}
        <div className="space-y-4 relative pl-4">
          {/* 左侧垂直线 */}
          <div className="absolute left-1.5 top-2 bottom-2 w-0.5 bg-gradient-to-b from-amber-400/60 to-white/10"></div>
          
          <div className="text-[11px] font-bold text-amber-400/80 tracking-widest uppercase mb-1 -ml-1">2026</div>

          {visitedPlaces.map((place) => {
            const hasPhoto = place.userPhotos && place.userPhotos.length > 0;
            return (
              <div key={place.id} className="relative group/timeline">
                {/* 节点原点 */}
                <div className="absolute -left-[18.5px] top-1.5 w-2.5 h-2.5 rounded-full bg-amber-400 border border-slate-950 group-hover/timeline:scale-125 transition-transform"></div>
                
                {/* 节点时间 */}
                <div className="text-[10px] text-white/40 font-mono mb-1">{place.visitedAt}</div>
                
                {/* 节点卡片 */}
                <button
                  onClick={() => onPlaceSelect(place)}
                  className="w-full text-left p-3.5 bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 hover:border-white/10 rounded-xl transition-all group/card flex flex-col gap-2 shadow-[0_4px_12px_rgba(0,0,0,0.15)]"
                >
                  <div>
                    <h4 className="text-sm font-bold text-white/90 group-hover/card:text-amber-400 transition-colors">{place.name}</h4>
                    <p className="text-[11px] text-white/40 mt-0.5">{place.country}</p>
                  </div>
                  {hasPhoto && (
                    <div className="w-full h-20 rounded-lg overflow-hidden border border-white/10 shadow-inner">
                      <img 
                        src={place.userPhotos![0]} 
                        alt={place.name} 
                        className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-700" 
                      />
                    </div>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 底部功能按钮区 */}
      <div className="p-4 border-t border-white/5 bg-slate-950/40 grid grid-cols-3 gap-2">
        <button 
          onClick={onStartImmersive}
          className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/25 hover:border-amber-500/40 transition-all text-amber-300 font-medium group cursor-pointer"
        >
          <Eye className="w-4 h-4 mb-1 group-hover:scale-110 transition-transform" />
          <span className="text-[10px]">沉浸式体验</span>
        </button>
        <button 
          onClick={onResetView}
          className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-white/15 transition-all text-white/70 hover:text-white group cursor-pointer"
        >
          <Globe2 className="w-4 h-4 mb-1 group-hover:scale-110 transition-transform" />
          <span className="text-[10px]">全局视角</span>
        </button>
        <button 
          onClick={() => alert("飞线配置：已自动启用最高级发光虚线公路网络。")}
          className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-white/15 transition-all text-white/70 hover:text-white group cursor-pointer"
        >
          <Plane className="w-4 h-4 mb-1 group-hover:scale-110 transition-transform" />
          <span className="text-[10px]">飞线配置</span>
        </button>
      </div>
    </motion.div>
  );
};
