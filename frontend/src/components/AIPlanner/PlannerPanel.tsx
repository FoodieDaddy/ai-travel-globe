import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PlaneTakeoff, Sparkles } from 'lucide-react';
import { PreferenceSelector } from './PreferenceSelector';
import { TravelPreference } from '../../types/travel';

interface Props {
  onGenerate: (pref: TravelPreference) => void;
  disabled?: boolean;
}

export const PlannerPanel: React.FC<Props> = ({ onGenerate, disabled }) => {
  const [destination, setDestination] = useState('');
  const [days, setDays] = useState(7);
  const [budget, setBudget] = useState('Medium');
  const [styles, setStyles] = useState<string[]>([]);
  const [extraContext, setExtraContext] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination) return;
    onGenerate({ destination, days, budget, styles, extraContext });
  };

  return (
    <motion.div 
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
      className="w-[380px] glass-panel rounded-3xl p-6 pointer-events-auto relative overflow-hidden"
    >
      <div className="absolute -top-20 -left-20 w-40 h-40 bg-blue-500/10 blur-3xl rounded-full pointer-events-none" />
      
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <PlaneTakeoff className="w-6 h-6 text-blue-400" />
          开始探索
        </h2>
        <p className="text-sm text-slate-400 mt-1">告诉 AI 你想要怎样的旅行</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-300 uppercase tracking-wider">我想去</label>
          <input 
            type="text" 
            placeholder="例如：日本、欧洲、海岛..." 
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
            required
          />
        </div>

        <div className="flex gap-4">
          <div className="space-y-1.5 flex-1">
            <label className="text-xs font-medium text-slate-300 uppercase tracking-wider">天数</label>
            <input 
              type="number" 
              min="1" max="30"
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 transition-all font-mono-tech"
            />
          </div>
          <div className="space-y-1.5 flex-1">
            <label className="text-xs font-medium text-slate-300 uppercase tracking-wider">预算</label>
            <select 
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 transition-all appearance-none"
            >
              <option value="Low">经济 (Low)</option>
              <option value="Medium">中等 (Medium)</option>
              <option value="High">宽裕 (High)</option>
              <option value="Luxury">奢华 (Luxury)</option>
            </select>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-300 uppercase tracking-wider">偏好风格</label>
          <PreferenceSelector selectedTags={styles} onChange={setStyles} />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-300 uppercase tracking-wider">更多具体想法（选填）</label>
          <textarea 
            placeholder="比如：一定要带去吃一次正宗怀石料理..." 
            rows={2}
            value={extraContext}
            onChange={(e) => setExtraContext(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 transition-all text-sm resize-none"
          />
        </div>

        <button 
          type="submit" 
          disabled={disabled || !destination}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98] tech-border"
        >
          <Sparkles className="w-4 h-4" />
          生成 AI 路线
        </button>
      </form>
    </motion.div>
  );
};
