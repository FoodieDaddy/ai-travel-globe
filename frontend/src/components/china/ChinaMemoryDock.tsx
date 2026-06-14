import React from 'react';
import { motion } from 'framer-motion';
import { Search, Plus } from 'lucide-react';

interface Props {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddClick: () => void;
}

export const ChinaMemoryDock: React.FC<Props> = ({ 
  searchQuery, 
  onSearchChange,
  onAddClick
}) => {
  return (
    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-40 flex items-center justify-center pointer-events-none w-full max-w-xl px-4">
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
        className="flex items-center justify-between gap-5 px-5 py-2.5 rounded-2xl backdrop-blur-xl bg-slate-950/60 border border-white/15 shadow-[0_16px_40px_rgba(0,0,0,0.6),0_0_20px_rgba(56,189,248,0.04)] pointer-events-auto w-full transition-all"
      >
        {/* 搜索框 */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/10 focus-within:border-amber-400/40 focus-within:bg-white/[0.07] transition-all w-full">
          <Search className="w-3.5 h-3.5 text-white/55 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="搜索城市、省份或故事..."
            className="bg-transparent border-none outline-none text-xs text-white placeholder-white/35 w-full"
          />
        </div>

        {/* 分割线 */}
        <div className="w-[1px] h-5 bg-white/10 shrink-0" />

        {/* 添加打卡按钮 */}
        <button
          onClick={onAddClick}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition-all shadow-[0_4px_12px_rgba(245,158,11,0.2)] cursor-pointer hover:scale-[1.03] shrink-0"
        >
          <Plus className="w-3.5 h-3.5 stroke-[3]" />
          <span>点亮记忆</span>
        </button>
      </motion.div>
    </div>
  );
};
export default ChinaMemoryDock;
