import React, { useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { Place } from '../../types/travel';
import { 
  MapPin, 
  Compass, 
  Camera, 
  Edit3, 
  X,
  Tag
} from 'lucide-react';

interface Props {
  place: Place | null;
  onMarkVisited: (placeId: string) => void;
  onPhotoUpload: (placeId: string, photoUrl: string) => void;
  onClose: () => void;
  onCenterPlace: (place: Place) => void;
}

export const PlaceDetailPanel: React.FC<Props> = ({ 
  place, 
  onMarkVisited, 
  onPhotoUpload,
  onClose,
  onCenterPlace
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && place) {
      const file = e.target.files[0];
      const objectUrl = URL.createObjectURL(file);
      onPhotoUpload(place.id, objectUrl);
    }
  };

  if (!place) return null;

  const hasPhotos = place.userPhotos && place.userPhotos.length > 0;

  // 使用精美 Unsplash 照片做备用
  const imageUrl = useMemo(() => {
    if (hasPhotos) {
      return place.userPhotos![0];
    }
    if (place.name === 'Kyoto') return "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=500&q=80";
    if (place.name === 'Tokyo') return "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=500&q=80";
    if (place.name === 'Shanghai') return "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=500&q=80";
    if (place.name === 'Singapore') return "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=500&q=80";
    return `https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=500&q=80`;
  }, [place, hasPhotos]);

  return (
    <motion.div 
      initial={{ x: 30, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 30, opacity: 0 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="w-[320px] flex flex-col font-sans backdrop-blur-xl bg-slate-950/25 border border-white/15 rounded-2xl shadow-[0_16px_40px_rgba(0,0,0,0.5),0_0_20px_rgba(56,189,248,0.05)] overflow-hidden pointer-events-auto select-none"
    >
      {/* 顶部主图区域 */}
      <div className="relative h-48 w-full shrink-0">
        <img 
          src={imageUrl} 
          className="w-full h-full object-cover" 
          alt={place.name} 
        />
        {/* 调亮图片渐变，只保留底部微弱暗角以保证文字可读性 */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent"></div>

        {/* 悬浮右上角关闭按钮 */}
        <button 
          onClick={onClose}
          className="absolute top-3.5 right-3.5 p-1.5 rounded-full bg-slate-950/60 hover:bg-slate-900/80 border border-white/15 transition-all text-white/80 hover:text-white cursor-pointer hover:scale-105"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        {/* 浮动文字定位 */}
        <div className="absolute bottom-3.5 left-4 right-4 z-10">
          <h3 className="text-xl font-extrabold text-white tracking-wide drop-shadow-md">{place.name}</h3>
          <div className="flex items-center gap-2 mt-1.5">
            <span className={`text-[9px] px-1.5 py-0.5 rounded font-extrabold tracking-wider uppercase ${
              place.visited ? 'bg-amber-400 text-slate-950' : 'bg-white/15 text-white/80 border border-white/10'
            }`}>
              {place.visited ? '已点亮' : '计划中'}
            </span>
            <span className="text-[11px] text-white/90 font-medium drop-shadow flex items-center gap-0.5">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              {place.country} {place.visitedAt ? `· ${place.visitedAt}` : (place.plannedDate ? `· ${place.plannedDate}` : '')}
            </span>
          </div>
        </div>
      </div>

      {/* 详情内容区域 */}
      <div className="p-4.5 space-y-4 max-h-[280px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {/* 已去过显示：精致的旅行日记引用框 */}
        {place.visited && place.userNote && (
          <div className="bg-white/[0.03] border border-white/5 rounded-xl p-3.5 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-amber-400 to-orange-500" />
            <span className="text-[9px] font-bold text-white/30 tracking-widest uppercase block mb-1">旅行记忆</span>
            <p className="text-xs text-white/90 leading-relaxed font-light italic">
              “ {place.userNote} ”
            </p>
          </div>
        )}

        {/* 未去过显示：状态及计划时间 */}
        {!place.visited && (
          <div className="flex items-center justify-between text-[10.5px] text-white/50 bg-white/[0.02] border border-white/5 rounded-xl p-3">
            <span className="font-medium">尚未探索此目的地</span>
            {place.plannedDate && <span className="font-mono text-amber-400/80">计划时间: {place.plannedDate}</span>}
          </div>
        )}

        {/* 标签 */}
        {place.userTags && place.userTags.length > 0 && (
          <div className="space-y-1.5">
            <div className="flex items-center gap-1 text-[9px] font-extrabold text-white/40 uppercase tracking-widest">
              <Tag className="w-3 h-3" />
              <span>分类标签</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {place.userTags.map(tag => (
                <span key={tag} className="px-2.5 py-0.5 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-[10px] font-medium text-cyan-300">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 这里有什么 (Highlights) - 简化为单行精简子弹点 */}
        {place.highlights && place.highlights.length > 0 && (
          <div className="text-[11px] text-white/50 flex flex-wrap gap-x-2 gap-y-1 items-center pt-2.5 border-t border-white/5">
            <span className="text-[9px] font-extrabold text-white/30 uppercase tracking-widest shrink-0">特色看点:</span>
            {place.highlights.map((h, i) => (
              <span key={i} className="text-white/80 font-light">
                {h}{i < place.highlights!.length - 1 ? ' ·' : ''}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 底部悬浮操作栏 */}
      <div className="p-3 border-t border-white/5 bg-slate-950/20 flex items-center gap-2.5 shrink-0">
        {/* 定位按钮 */}
        <button 
          onClick={() => onCenterPlace(place)}
          className="p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/15 transition-all text-white/70 hover:text-white shrink-0 cursor-pointer"
          title="定位景点"
        >
          <Compass className="w-4 h-4" />
        </button>

        {/* 动态主按钮：我要打卡 / 上传照片 */}
        {!place.visited ? (
          <button 
            onClick={() => onMarkVisited(place.id)}
            className="flex-1 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 transition-all text-slate-950 font-extrabold text-xs tracking-wider flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_4px_12px_rgba(245,158,11,0.2)] hover:scale-[1.01]"
          >
            点亮足迹
          </button>
        ) : (
          <div className="flex-1 flex gap-2">
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-[10px] text-white/80 font-bold flex items-center justify-center gap-1 cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5" />
              上传照片
            </button>
            <button 
              onClick={() => onMarkVisited(place.id)} // click edit just updates status or fires alert, we'll keep it simple
              className="flex-1 py-2 rounded-xl bg-transparent hover:bg-white/5 border border-white/10 transition-colors text-[10px] text-white/50 hover:text-white/80 font-bold flex items-center justify-center gap-1 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              保存记录
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};
