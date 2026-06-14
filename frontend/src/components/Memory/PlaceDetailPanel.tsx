import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Place } from '../../types/travel';
import { 
  Compass, 
  MapPin, 
  CheckCircle2, 
  Calendar, 
  ArrowLeft, 
  X, 
  Info, 
  BookOpen, 
  Ticket, 
  Clock, 
  Compass as SuggestionIcon, 
  AlertTriangle,
  Copy
} from 'lucide-react';

interface Props {
  place: Place | null;
  onMarkVisited: (placeId: string) => void;
  onTogglePlanned: (placeId: string) => void;
  onClose: () => void;
  onCenterPlace: (place: Place) => void;
}

export const PlaceDetailPanel: React.FC<Props> = ({ 
  place, 
  onMarkVisited, 
  onTogglePlanned,
  onClose,
  onCenterPlace
}) => {

  const handleCopyCoords = () => {
    if (!place) return;
    navigator.clipboard.writeText(`${place.lat}, ${place.lng}`);
    alert("经纬度坐标已复制到剪贴板！");
  };

  if (!place) return null;

  // 根据分类获取对应的样式和名称
  const categoryConfig = {
    heritage: { name: '文化遗产', colorClass: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-400' },
    nature: { name: '自然奇观', colorClass: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' },
    landmark: { name: '现代地标', colorClass: 'border-amber-500/30 bg-amber-500/10 text-amber-400' },
    custom: { name: '自定义', colorClass: 'border-purple-500/30 bg-purple-500/10 text-purple-400' }
  };

  const currentCat = categoryConfig[place.type] || categoryConfig.custom;

  // 使用 Unsplash 默认美图，如果用户有上传照片则使用用户照片
  const imageUrl = useMemo(() => {
    if (place.userPhotos && place.userPhotos.length > 0) {
      return place.userPhotos[0];
    }
    // 默认提供精美底图
    if (place.name === '武陵源') return "https://images.unsplash.com/photo-1549693578-d683be217e58?w=600&q=80";
    if (place.name === '九寨沟') return "https://images.unsplash.com/photo-1549046468-b74704f4a3f2?w=600&q=80";
    if (place.name === '帕米尔高原') return "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80";
    if (place.name === '巴尔米拉古城') return "https://images.unsplash.com/photo-1547989453-11e67ffb3885?w=600&q=80";
    if (place.name === '喀拉拉背水') return "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=600&q=80";
    if (place.name === '黄山') return "https://images.unsplash.com/photo-1520262454473-a1a82276a574?w=600&q=80";
    if (place.name === '敦煌莫高窟') return "https://images.unsplash.com/photo-1608976404981-d1f5e8211db4?w=600&q=80";
    return `https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&q=80`;
  }, [place]);

  return (
    <motion.div 
      initial={{ x: 80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 80, opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-[360px] h-[calc(100vh-140px)] flex flex-col font-sans backdrop-blur-xl bg-slate-950/70 border border-white/10 rounded-2xl shadow-[0_16px_48px_rgba(0,0,0,0.65)] overflow-hidden relative pointer-events-auto"
    >
      {/* 顶部背景图部分 */}
      <div className="relative h-44 w-full shrink-0">
        <img 
          src={imageUrl} 
          className="w-full h-full object-cover" 
          alt={place.name} 
        />
        {/* 暗色渐变遮罩 */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-black/40"></div>

        {/* 顶部悬浮控制按键 */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full bg-black/40 hover:bg-black/60 border border-white/10 hover:border-white/20 transition-all text-white/80 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full bg-black/40 hover:bg-black/60 border border-white/10 hover:border-white/20 transition-all text-white/80 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 标题与地区标记 */}
        <div className="absolute bottom-3 left-5 right-5">
          <div className="flex items-center gap-1.5 mb-1">
            <h2 className="text-xl font-bold text-white tracking-wide">{place.name}</h2>
            <button 
              onClick={handleCopyCoords}
              className="p-1 text-white/40 hover:text-white/80 transition-colors" 
              title="复制坐标"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${currentCat.colorClass}`}>
              {place.country} | {currentCat.name}
            </span>
            <span className="text-[10px] text-white/40 font-mono">
              纬度 {place.lat.toFixed(4)}° 经度 {place.lng.toFixed(4)}°
            </span>
          </div>
        </div>
      </div>

      {/* 滚动内容区 */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {/* 1. 简介 */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-white/80">
            <div className="w-1 h-3.5 bg-amber-400 rounded-sm"></div>
            <span className="tracking-wide">简介</span>
          </div>
          <p className="text-xs text-white/60 leading-relaxed font-light">
            {place.introduction || place.description}
          </p>
        </div>

        {/* 2. 传说故事 */}
        {(place.legendStory) && (
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-white/80">
              <div className="w-1 h-3.5 bg-amber-400 rounded-sm"></div>
              <span className="tracking-wide">传说故事</span>
            </div>
            <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl">
              <p className="text-xs text-amber-100/75 italic leading-relaxed font-light">
                {place.legendStory}
              </p>
            </div>
          </div>
        )}

        {/* 3. 各种小板块 */}
        <div className="grid grid-cols-2 gap-4">
          {place.ticketPrice && (
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-white/40 uppercase tracking-wider">
                <Ticket className="w-3.5 h-3.5" />
                <span>票价</span>
              </div>
              <p className="text-xs text-white/70 font-light">{place.ticketPrice}</p>
            </div>
          )}
          {place.bestTime && (
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-white/40 uppercase tracking-wider">
                <Clock className="w-3.5 h-3.5" />
                <span>最佳时间</span>
              </div>
              <p className="text-xs text-white/70 font-light">{place.bestTime}</p>
            </div>
          )}
        </div>

        {/* 4. 游览建议 */}
        {place.travelSuggestions && (
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-white/80">
              <div className="w-1 h-3.5 bg-amber-400 rounded-sm"></div>
              <span className="tracking-wide">游览建议</span>
            </div>
            <p className="text-xs text-white/60 leading-relaxed font-light">
              {place.travelSuggestions}
            </p>
          </div>
        )}

        {/* 5. 避坑指南 */}
        {place.avoidPitfalls && (
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-white/85">
              <div className="w-1 h-3.5 bg-rose-500 rounded-sm"></div>
              <span className="tracking-wide">避坑指南</span>
            </div>
            <div className="p-3 bg-rose-500/5 border border-rose-500/15 rounded-xl flex gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <p className="text-xs text-rose-300/80 leading-relaxed font-light">
                {place.avoidPitfalls}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 底部按钮栏 */}
      <div className="p-4 border-t border-white/5 bg-slate-950/40 flex items-center gap-3">
        {/* 定位按钮 */}
        <button 
          onClick={() => onCenterPlace(place)}
          className="p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-white/15 transition-all text-white/65 hover:text-white shrink-0 cursor-pointer"
          title="定位景点"
        >
          <Compass className="w-4.5 h-4.5" />
        </button>

        {/* 规划中按钮 */}
        <button 
          onClick={() => onTogglePlanned(place.id)}
          className={`flex-1 py-3 rounded-xl border font-bold text-xs tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            place.plannedDate || (place.visited === false && place.plannedDate !== undefined)
              ? 'bg-amber-500/10 border-amber-500/25 text-amber-300 hover:bg-amber-500/15'
              : 'bg-white/[0.03] border-white/5 hover:bg-white/[0.08] text-white/70 hover:text-white'
          }`}
        >
          <Calendar className="w-4 h-4" />
          {place.plannedDate ? '规划中' : '加入规划'}
        </button>

        {/* 打卡按钮 */}
        <button 
          onClick={() => onMarkVisited(place.id)}
          className={`flex-1 py-3 rounded-xl border font-bold text-xs tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            place.visited
              ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20'
              : 'bg-amber-400 text-slate-950 border-amber-400 hover:bg-amber-300 font-extrabold'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          {place.visited ? '已打卡' : '我要打卡'}
        </button>
      </div>
    </motion.div>
  );
};
