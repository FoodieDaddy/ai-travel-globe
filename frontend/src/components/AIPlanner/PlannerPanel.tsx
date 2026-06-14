import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ScanText, Terminal, MapPin } from 'lucide-react';
import { TravelPreference } from '../../types/travel';

interface Props {
  onGenerate: (pref: TravelPreference) => void;
  disabled?: boolean;
}

const STYLES = ["Cinematic", "Nature", "Urban", "Historical", "Family", "Honeymoon", "Photography", "Niche"];
const BUDGETS = [
  { id: 'Low', label: 'Econ' },
  { id: 'Medium', label: 'Balanced' },
  { id: 'High', label: 'Premium' },
  { id: 'Luxury', label: 'Luxury' }
];

export const PlannerPanel: React.FC<Props> = ({ onGenerate, disabled }) => {
  const [destination, setDestination] = useState('');
  const [days, setDays] = useState<number | ''>(14);
  const [budget, setBudget] = useState('High');
  const [styles, setStyles] = useState<string[]>(['Cinematic', 'Urban']);
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
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-[420px] pointer-events-auto flex flex-col font-mono-tech border-l border-r border-indigo-500/20 bg-[#02040A]/80 backdrop-blur-md relative"
    >
      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-indigo-400" />
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-indigo-400" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-indigo-400" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-indigo-400" />

      {/* Header */}
      <div className="border-b border-indigo-500/20 p-4 flex items-center gap-3 bg-indigo-500/5">
        <Terminal className="w-5 h-5 text-indigo-400" />
        <div>
          <h2 className="text-sm font-bold text-indigo-200 tracking-[0.2em] uppercase">Sys.Console</h2>
          <p className="text-[9px] text-slate-500 tracking-wider">AWAITING_INPUT_COMMAND</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 text-sm text-slate-300 flex-1 overflow-y-auto custom-scrollbar">
        
        <div className="mb-6 bg-black/40 border border-white/5 p-4 rounded-sm relative group">
          <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-indigo-500/50" />
          <p className="leading-relaxed font-light text-slate-300">
            &gt; PLAN A <br/>
            <input 
              type="number" 
              min="1" max="60"
              value={days}
              onChange={(e) => setDays(Number(e.target.value) || '')}
              className="inline-block w-12 bg-transparent border-b border-indigo-500/50 text-indigo-300 text-center mx-1 px-1 focus:outline-none focus:border-indigo-300 font-bold appearance-none"
              required
            />
            -DAY TRIP TO <br/>
            <input 
              type="text" 
              placeholder="Tokyo, Paris..." 
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="inline-block w-full bg-transparent border-b border-indigo-500/50 text-indigo-300 focus:outline-none focus:border-indigo-300 mt-2 px-1 pb-1 font-bold tracking-wide"
              required
            />
          </p>
        </div>

        <div className="mb-6 space-y-2">
          <label className="text-[10px] text-indigo-400 tracking-widest uppercase block">&gt; BUDGET_REQ_</label>
          <div className="flex gap-2">
            {BUDGETS.map(b => (
              <button
                key={b.id}
                type="button"
                onClick={() => setBudget(b.id)}
                className={`flex-1 py-1.5 text-[10px] tracking-wider uppercase border transition-all ${
                  budget === b.id 
                    ? 'bg-indigo-500/20 border-indigo-400 text-indigo-200' 
                    : 'bg-transparent border-white/10 text-slate-500 hover:border-white/30 hover:text-slate-300'
                }`}
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6 space-y-2">
          <label className="text-[10px] text-indigo-400 tracking-widest uppercase block">&gt; STYLE_VECTORS_</label>
          <div className="flex flex-wrap gap-1.5">
            {STYLES.map(style => {
              const isSelected = styles.includes(style);
              return (
                <button
                  key={style}
                  type="button"
                  onClick={() => toggleStyle(style)}
                  className={`px-2 py-1 text-[10px] tracking-wider uppercase border transition-all ${
                    isSelected 
                      ? 'bg-purple-500/20 border-purple-400 text-purple-200 shadow-[0_0_10px_rgba(168,85,247,0.3)]' 
                      : 'bg-transparent border-white/5 text-slate-500 hover:border-white/20'
                  }`}
                >
                  {style}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mb-8 space-y-2">
          <label className="text-[10px] text-indigo-400 tracking-widest uppercase block">&gt; EXTRA_PARAMS_</label>
          <textarea 
            placeholder="e.g. Must include an omakase dinner..." 
            value={extraContext}
            onChange={(e) => setExtraContext(e.target.value)}
            className="w-full bg-black/40 border border-white/10 p-3 text-slate-300 placeholder:text-slate-700 focus:outline-none focus:border-indigo-500/50 text-xs font-light resize-none h-16"
          />
        </div>

        <button 
          type="submit" 
          disabled={disabled || !destination || !days}
          className="w-full h-12 bg-indigo-600/20 border border-indigo-500 hover:bg-indigo-500/30 text-indigo-300 font-bold text-xs tracking-[0.2em] uppercase flex items-center justify-center gap-2 shadow-[inset_0_0_20px_rgba(99,102,241,0.2)] hover:shadow-[inset_0_0_30px_rgba(99,102,241,0.4)] transition-all disabled:opacity-30 disabled:cursor-not-allowed group relative overflow-hidden"
        >
          <div className="absolute top-0 bottom-0 left-0 w-1 bg-indigo-400 group-hover:w-2 transition-all" />
          <ScanText className="w-4 h-4" />
          INIT_ORBIT_PLAN
          
          {/* Scanner sweep effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[scan_1.5s_ease-in-out_infinite]" />
        </button>
      </form>
    </motion.div>
  );
};
