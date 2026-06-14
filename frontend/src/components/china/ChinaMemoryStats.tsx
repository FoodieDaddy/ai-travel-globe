import React, { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChinaPlace } from '../../types/china';
import { Compass, Layers, Image, Award } from 'lucide-react';

interface Props {
  places: ChinaPlace[];
  onPlaceSelect: (place: ChinaPlace) => void;
  animateStats: boolean;
}

const AnimatedNumber: React.FC<{ value: number; trigger: boolean }> = ({ value, trigger }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!trigger) {
      setDisplayValue(0);
      return;
    }
    let start = 0;
    const end = value;
    if (end === 0) return;

    const duration = 1200;
    let startTime: number | null = null;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setDisplayValue(Math.floor(progress * (end - start) + start));
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, [value, trigger]);

  return <>{displayValue}</>;
};

export const ChinaMemoryStats: React.FC<Props> = ({ 
  places, 
  onPlaceSelect,
  animateStats
}) => {
  const visitedPlaces = useMemo(() => {
    return [...places]
      .filter(p => p.visited && p.visitedAt)
      .sort((a, b) => b.visitedAt!.localeCompare(a.visitedAt!));
  }, [places]);

  const stats = useMemo(() => {
    const provinces = new Set(visitedPlaces.map(p => p.province));
    const photoCount = visitedPlaces.reduce((acc, p) => acc + (p.photos?.length || 0), 0);
    return {
      cities: visitedPlaces.length,
      provinces: provinces.size,
      photos: photoCount
    };
  }, [visitedPlaces]);

  const recentMemories = useMemo(() => {
    return visitedPlaces.slice(0, 3);
  }, [visitedPlaces]);

  return (
    <motion.div 
      initial={{ x: -30, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="w-[300px] flex flex-col font-sans backdrop-blur-xl bg-slate-950/25 border border-white/15 rounded-2xl p-5 shadow-[0_16px_40px_rgba(0,0,0,0.5),0_0_20px_rgba(56,189,248,0.03)] pointer-events-auto select-none"
    >
      {/* 标题 */}
      <div className="mb-4">
        <h2 className="text-sm font-black text-white tracking-widest uppercase">China Memory Atlas</h2>
        <p className="text-[10px] text-amber-400 tracking-wider mt-0.5 font-medium">点亮我走过的中国城市与风景</p>
      </div>

      {/* 统计浮格 (高对比度) */}
      <div className="flex flex-col gap-3.5 mb-5 pt-3 border-t border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-amber-500/15 text-amber-400">
            <Compass className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10.5px] text-white/60 font-semibold tracking-wider">已点亮城市</span>
            <span className="text-xl font-bold font-mono text-white mt-0.5 leading-none">
              <AnimatedNumber value={stats.cities} trigger={animateStats} />
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-cyan-500/15 text-cyan-400">
            <Layers className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10.5px] text-white/60 font-semibold tracking-wider">已走过省份</span>
            <span className="text-xl font-bold font-mono text-white mt-0.5 leading-none">
              <AnimatedNumber value={stats.provinces} trigger={animateStats} />
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-400">
            <Image className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10.5px] text-white/60 font-semibold tracking-wider">已上传照片</span>
            <span className="text-xl font-bold font-mono text-white mt-0.5 leading-none">
              <AnimatedNumber value={stats.photos} trigger={animateStats} />
            </span>
          </div>
        </div>
      </div>

      {/* 最近记录回忆摘要 */}
      {recentMemories.length > 0 && (
        <div className="pt-4 border-t border-white/10 space-y-3">
          <div className="text-[9px] font-extrabold tracking-widest text-white/45 uppercase flex items-center gap-1">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>神州旅行回忆</span>
          </div>
          <div className="space-y-2.5 max-h-[200px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/10">
            {recentMemories.map((place) => (
              <button
                key={place.id}
                onClick={() => onPlaceSelect(place)}
                className="w-full text-left p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.07] border border-white/10 hover:border-amber-400/30 transition-all flex flex-col gap-1 cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white/90 group-hover:text-amber-400 transition-colors">{place.name}</span>
                  <span className="text-[9.5px] text-white/40 font-mono">{place.visitedAt || place.season}</span>
                </div>
                {place.note && (
                  <p className="text-[10.5px] text-white/60 leading-relaxed font-light line-clamp-2 italic group-hover:text-white/80 transition-colors">
                    "{place.note}"
                  </p>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};
export default ChinaMemoryStats;
