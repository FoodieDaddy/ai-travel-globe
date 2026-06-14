import React from 'react';
import { motion } from 'framer-motion';
import { Settings } from 'lucide-react';

interface Props {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  onSettingsClick?: () => void;
}

const FILTER_ITEMS = [
  { id: 'all', name: '全部', colorClass: 'bg-slate-350' },
  { id: 'heritage', name: '文化遗产', colorClass: 'bg-cyan-400' },
  { id: 'nature', name: '自然奇观', colorClass: 'bg-emerald-400' },
  { id: 'landmark', name: '现代地标', colorClass: 'bg-amber-400' },
  { id: 'custom', name: '自定义', colorClass: 'bg-purple-400' },
  { id: 'visited', name: '已打卡', colorClass: 'bg-amber-500' },
  { id: 'planned', name: '规划中', colorClass: 'bg-orange-500' }
];

export const Dock: React.FC<Props> = ({ 
  activeFilter, 
  onFilterChange,
  onSettingsClick 
}) => {
  return (
    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-40 flex items-center justify-center pointer-events-none">
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
        className="flex items-center gap-6 px-5 py-2.5 rounded-2xl backdrop-blur-xl bg-slate-950/70 border border-white/10 shadow-[0_16px_40px_rgba(0,0,0,0.6)] pointer-events-auto"
      >
        {/* 分类筛选器列表 */}
        <div className="flex items-center gap-1.5">
          {FILTER_ITEMS.map((item) => {
            const isActive = activeFilter === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onFilterChange(item.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                  isActive 
                    ? 'bg-white/10 text-white border border-white/10' 
                    : 'text-white/60 hover:text-white/95 hover:bg-white/[0.04] border border-transparent'
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

        {/* 右侧设置齿轮 */}
        <button 
          onClick={onSettingsClick || (() => alert("设置：Memory Atlas 引擎运行在 WebGL 2.0 极速模式下。"))}
          className="p-2 rounded-xl text-white/50 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
        >
          <Settings className="w-4 h-4" />
        </button>
      </motion.div>
    </div>
  );
};
