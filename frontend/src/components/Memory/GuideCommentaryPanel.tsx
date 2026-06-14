import React from 'react';
import { motion } from 'framer-motion';
import { Megaphone, Play, X } from 'lucide-react';

interface Props {
  onStartCommentary: () => void;
  onClose?: () => void;
  visible: boolean;
}

export const GuideCommentaryPanel: React.FC<Props> = ({ 
  onStartCommentary, 
  onClose,
  visible 
}) => {
  if (!visible) return null;

  return (
    <motion.div 
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 50, opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-[280px] p-4 font-sans backdrop-blur-xl bg-slate-950/70 border border-white/10 rounded-2xl shadow-[0_12px_36px_rgba(0,0,0,0.55)] flex flex-col gap-3 pointer-events-auto relative"
    >
      {/* 关闭按钮 */}
      {onClose && (
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 text-white/40 hover:text-white transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}

      {/* 标题 */}
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
          <Megaphone className="w-4 h-4" />
        </div>
        <h3 className="text-sm font-bold text-white tracking-wide">导游解说</h3>
      </div>

      {/* 简介描述 */}
      <p className="text-xs text-white/55 leading-relaxed font-light">
        开启导游解说，随小车在地球上奔驰，聆听每处打卡景点的精彩故事与传说。
      </p>

      {/* 开启导游按钮 */}
      <button 
        onClick={onStartCommentary}
        className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 transition-colors text-slate-950 font-extrabold text-xs tracking-wider flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_4px_12px_rgba(245,158,11,0.2)]"
      >
        <Play className="w-3.5 h-3.5 fill-current" />
        开启导游
      </button>
    </motion.div>
  );
};
