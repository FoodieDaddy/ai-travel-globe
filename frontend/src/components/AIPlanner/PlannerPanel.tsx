import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Settings2 } from 'lucide-react';
import { TravelPreference } from '../../types/travel';
import { useLanguage } from '../../i18n/LanguageContext';

interface Props {
  onGenerate: (pref: TravelPreference) => void;
  disabled?: boolean;
}

const BUDGETS = ['Low', 'Medium', 'High', 'Luxury'] as const;
const STYLES = ["Cinematic", "Nature", "Urban", "Historical", "Family", "Honeymoon", "Photography", "Niche"] as const;

export const PlannerPanel: React.FC<Props> = ({ onGenerate, disabled }) => {
  const { t } = useLanguage();
  const [prompt, setPrompt] = useState('');
  const [budget, setBudget] = useState('High');
  const [styles, setStyles] = useState<string[]>(['Cinematic', 'Urban']);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const toggleStyle = (style: string) => {
    if (styles.includes(style)) setStyles(styles.filter(s => s !== style));
    else setStyles([...styles, style]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt) return;
    onGenerate({ destination: prompt, days: 14, budget, styles, extraContext: prompt });
  };

  return (
    <motion.div 
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
      className="w-full max-w-2xl font-sans"
    >
      <form onSubmit={handleSubmit} className="relative z-10">
        
        {/* Natural Language Prompt Input - Horizontal Bar */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-sky-400 to-purple-500 rounded-[2rem] blur-md opacity-40 group-hover:opacity-70 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative flex items-center bg-[#020612]/90 backdrop-blur-3xl rounded-[2rem] border border-white/20 p-2 shadow-2xl">
            <textarea 
              placeholder={t('promptPlaceholder')} 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="flex-1 bg-transparent text-slate-100 placeholder:text-slate-400 focus:outline-none text-lg px-6 py-4 resize-none h-[72px] leading-relaxed custom-scrollbar font-light"
              required
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            
            <div className="flex items-center gap-3 pr-2">
              <button 
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="w-14 h-14 flex items-center justify-center text-slate-400 hover:text-sky-300 hover:bg-white/10 rounded-2xl transition-all"
                title={t('moreOptions')}
              >
                <Settings2 className="w-6 h-6" />
              </button>
              
              <button 
                type="submit" 
                disabled={disabled || !prompt}
                className="h-14 px-8 rounded-2xl bg-gradient-to-r from-sky-400 via-indigo-500 to-purple-600 text-white font-medium text-base tracking-wide flex items-center gap-2 shadow-[0_0_30px_rgba(14,165,233,0.5)] hover:shadow-[0_0_50px_rgba(168,85,247,0.8)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed overflow-hidden group/btn relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover/btn:animate-[scan_1s_ease-in-out_infinite]" />
                <Sparkles className="w-5 h-5 relative z-10" />
                <span className="whitespace-nowrap relative z-10 font-bold">{t('generateOrbit')}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Collapsible Advanced Options */}
        <AnimatePresence>
          {showAdvanced && (
            <motion.div 
              initial={{ height: 0, opacity: 0, y: -10 }}
              animate={{ height: 'auto', opacity: 1, y: 0 }}
              exit={{ height: 0, opacity: 0, y: -10 }}
              className="overflow-hidden mt-4 bg-[#020612]/60 backdrop-blur-xl rounded-3xl border border-white/5 p-6 shadow-2xl"
            >
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-xs text-slate-500 uppercase tracking-wider font-medium">{t('travelMode')}</label>
                  <div className="flex gap-2 p-1 bg-black/20 rounded-xl border border-white/5">
                    {BUDGETS.map(b => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setBudget(b)}
                        className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all duration-300 ${
                          budget === b 
                            ? 'bg-sky-500/20 text-sky-300 shadow-[0_0_15px_rgba(14,165,233,0.2)]' 
                            : 'bg-transparent text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {t(`budget${b}` as any)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs text-slate-500 uppercase tracking-wider font-medium">{t('travelSignals')}</label>
                  <div className="flex flex-wrap gap-2">
                    {STYLES.map(style => {
                      const isSelected = styles.includes(style);
                      return (
                        <button
                          key={style}
                          type="button"
                          onClick={() => toggleStyle(style)}
                          className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-300 border ${
                            isSelected 
                              ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.2)]' 
                              : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200'
                          }`}
                        >
                          {t(`style${style}` as any)}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </motion.div>
  );
};
