import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Search, Plus } from 'lucide-react';

interface Props {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddClick: () => void;
  onSettingsClick?: () => void;
}

const FILTER_ITEMS = [
  { id: 'all', name: '全部', colorClass: 'bg-slate-350' },
  { id: 'heritage', name: '文化', colorClass: 'bg-cyan-400' },
  { id: 'nature', name: '自然', colorClass: 'bg-emerald-400' },
  { id: 'landmark', name: '地标', colorClass: 'bg-amber-400' },
  { id: 'custom', name: '足迹', colorClass: 'bg-purple-400' },
  { id: 'visited', name: '已去过', colorClass: 'bg-amber-500' },
  { id: 'planned', name: '计划中', colorClass: 'bg-orange-500' }
];

export const Dock: React.FC<Props> = ({ 
  activeFilter, 
  onFilterChange,
  searchQuery,
  onSearchChange,
  onAddClick,
  onSettingsClick 
}) => {
  return (
    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-40 flex items-center justify-center pointer-events-none w-full max-w-4xl px-4">
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
        className="flex items-center justify-between gap-5 px-5 py-2.5 rounded-2xl backdrop-blur-xl bg-slate-950/60 border border-white/15 shadow-[0_16px_40px_rgba(0,0,0,0.6),0_0_20px_rgba(56,189,248,0.04)] pointer-events-auto w-full transition-all"
      >
        {/* 左侧：搜索框 */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/10 focus-within:border-amber-400/40 focus-within:bg-white/[0.07] transition-all shrink-0">
          <Search className="w-3.5 h-3.5 text-white/55" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="搜索记录、国家或标签..."
            className="bg-transparent border-none outline-none text-xs text-white placeholder-white/35 w-36 focus:w-44 transition-all"
          />
        </div>

        {/* 分割线 */}
        <div className="w-[1px] h-5 bg-white/10 hidden md:block" />

        {/* 中间：分类筛选器列表 */}
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-0.5">
          {FILTER_ITEMS.map((item) => {
            const isActive = activeFilter === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onFilterChange(item.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
                  isActive 
                    ? 'bg-white/10 text-white border border-white/10 shadow-sm' 
                    : 'text-white/60 hover:text-white hover:bg-white/[0.04] border border-transparent'
                }`}
              >
                {/* 彩色圆点 */}
                <div className={`w-2 h-2 rounded-full ${item.colorClass} shadow-[0_0_6px_currentColor]`}></div>
                <span>{item.name}</span>
              </button>
            );
          })}
        </div>

        {/* 分割线 */}
        <div className="w-[1px] h-5 bg-white/10" />

        {/* 右侧：添加记忆 + 设置 */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onAddClick}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition-all shadow-[0_4px_12px_rgba(245,158,11,0.2)] cursor-pointer hover:scale-[1.03]"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span className="hidden sm:inline">添加记忆</span>
          </button>
          
          <button 
            onClick={onSettingsClick}
            className="p-2 rounded-xl text-white/50 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
            title="地图设置"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
