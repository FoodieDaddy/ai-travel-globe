import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, MapPin } from 'lucide-react';
import { TravelPreference } from '../../types/travel';

interface Props {
  onGenerate: (pref: TravelPreference) => void;
  disabled?: boolean;
}

const STYLES = ["美食", "自然风景", "城市探索", "历史人文", "亲子游", "蜜月度假", "摄影", "小众体验"];
const BUDGETS = [
  { id: 'Low', label: '经济实惠的' },
  { id: 'Medium', label: '性价比高的' },
  { id: 'High', label: '预算宽裕的' },
  { id: 'Luxury', label: '极致奢华的' }
];

export const PlannerPanel: React.FC<Props> = ({ onGenerate, disabled }) => {
  const [destination, setDestination] = useState('');
  const [days, setDays] = useState<number | ''>(7);
  const [budget, setBudget] = useState('Medium');
  const [styles, setStyles] = useState<string[]>([]);
  const [extraContext, setExtraContext] = useState('');

  const toggleStyle = (style: string) => {
    if (styles.includes(style)) setStyles(styles.filter(s => s !== style));
    else setStyles([...styles, style]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination || !days) return;
    onGenerate({ destination, days: Number(days), budget, styles, extraContext });
  };

  return (
    <motion.div 
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
      className="w-[420px] glass-panel rounded-[32px] p-8 pointer-events-auto relative overflow-hidden"
    >
      <div className="absolute -top-32 -left-32 w-64 h-64 bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none" />
      
      <div className="mb-8 relative z-10">
        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 mb-5 shadow-inner">
          <MapPin className="w-6 h-6 text-indigo-400" />
        </div>
        <h2 className="text-3xl font-bold text-white tracking-tight leading-tight">
          Hello,<br/>想去哪里探索？
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="relative z-10 text-slate-300 text-lg leading-loose font-light">
        <p className="mb-6">
          "Hi AI，我想去
          <input 
            type="text" 
            placeholder="日本 / 欧洲 / 海岛..." 
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="inline-block w-40 bg-transparent border-b-2 border-indigo-500/40 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-400 text-center mx-2 px-1 transition-colors"
            required
          />
          玩
          <input 
            type="number" 
            min="1" max="60"
            value={days}
            onChange={(e) => setDays(Number(e.target.value) || '')}
            className="inline-block w-16 bg-transparent border-b-2 border-indigo-500/40 text-white text-center mx-2 px-1 focus:outline-none focus:border-indigo-400 font-mono-tech transition-colors appearance-none"
            required
          />
          天。
        </p>

        <p className="mb-6">
          我希望这是一次
          <select 
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="inline-block bg-white/5 border border-white/10 rounded-lg text-indigo-300 px-3 py-1 mx-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer text-base appearance-none"
          >
            {BUDGETS.map(b => (
              <option key={b.id} value={b.id} className="bg-[#0B1120]">{b.label}</option>
            ))}
          </select>
          旅行，<br />并且比较偏好以下体验：
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          {STYLES.map(style => {
            const isSelected = styles.includes(style);
            return (
              <button
                key={style}
                type="button"
                onClick={() => toggleStyle(style)}
                className={`px-4 py-2 rounded-xl text-sm transition-all duration-300 border ${
                  isSelected 
                    ? 'bg-indigo-500/20 border-indigo-400 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.3)]' 
                    : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:border-white/20 hover:text-slate-200'
                }`}
              >
                {style}
              </button>
            );
          })}
        </div>

        <p className="mb-8">
          补充需求：
          <input 
            type="text" 
            placeholder="比如：一定要带去吃一次正宗怀石料理..." 
            value={extraContext}
            onChange={(e) => setExtraContext(e.target.value)}
            className="w-full mt-2 bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 transition-all text-base"
          />
        </p>

        <button 
          type="submit" 
          disabled={disabled || !destination || !days}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(99,102,241,0.4)] hover:shadow-[0_0_40px_rgba(99,102,241,0.6)] transition-all disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98] relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-white/20 group-hover:translate-x-full -translate-x-full transform transition-transform duration-700 ease-in-out skew-x-12" />
          <Sparkles className="w-5 h-5" />
          <span className="text-lg tracking-wide">生成 AI 路线</span>
        </button>
      </form>
    </motion.div>
  );
};
