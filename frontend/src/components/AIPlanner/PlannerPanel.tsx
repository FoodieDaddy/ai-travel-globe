import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Compass, ChevronDown, ChevronUp } from 'lucide-react';
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
  const [destination, setDestination] = useState('');
  const [days, setDays] = useState<number | ''>(14);
  const [budget, setBudget] = useState('High');
  const [styles, setStyles] = useState<string[]>(['Cinematic', 'Urban']);
  const [extraContext, setExtraContext] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

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
      className="w-[380px] pointer-events-auto flex flex-col font-sans bg-[#020612]/30 backdrop-blur-[40px] rounded-3xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden relative"
    >
      {/* Subtle Noise Overlay inside the panel */}
      <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
      }} />

      <form onSubmit={handleSubmit} className="p-8 text-sm text-slate-300 flex-1 overflow-y-auto custom-scrollbar relative z-10">
        
        {/* Natural Language Input */}
        <div className="mb-8 mt-2 text-2xl font-light text-slate-200 leading-[1.6]">
          {t('planA')} <br/>
          <input 
            type="number" 
            min="1" max="60"
            value={days}
            onChange={(e) => setDays(Number(e.target.value) || '')}
            className="inline-block w-14 bg-transparent border-b border-slate-600 text-sky-400 text-center mx-1 px-1 focus:outline-none focus:border-sky-400 appearance-none font-normal"
            required
          />
          {t('dayJourneyTo')} <br/>
          <input 
            type="text" 
            placeholder={t('destinationPlaceholder')} 
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="inline-block w-full bg-transparent border-b border-slate-600 text-sky-400 focus:outline-none focus:border-sky-400 mt-2 px-1 pb-1 font-normal placeholder:text-slate-600"
            required
          />
        </div>

        <div className="mb-6 space-y-3">
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

        {/* Collapsible Advanced Options */}
        <div className="mb-8">
          <button 
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 text-xs text-slate-500 hover:text-slate-300 transition-colors uppercase tracking-wider font-medium mb-4"
          >
            {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            {showAdvanced ? t('hideOptions') : t('moreOptions')}
          </button>

          <AnimatePresence>
            {showAdvanced && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden space-y-6"
              >
                <div className="space-y-3 pt-2">
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

                <div className="space-y-3">
                  <label className="text-xs text-slate-500 uppercase tracking-wider font-medium">{t('extraPrompt')}</label>
                  <textarea 
                    placeholder={t('extraPromptPlaceholder')} 
                    value={extraContext}
                    onChange={(e) => setExtraContext(e.target.value)}
                    className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-sky-500/50 focus:bg-black/30 transition-all text-sm font-light resize-none h-20"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button 
          type="submit" 
          disabled={disabled || !destination || !days}
          className="w-full h-14 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-medium text-sm tracking-wide flex items-center justify-center gap-2 shadow-[0_10px_30px_rgba(14,165,233,0.3)] hover:shadow-[0_15px_40px_rgba(14,165,233,0.5)] transition-all duration-500 disabled:opacity-40 disabled:cursor-not-allowed group relative overflow-hidden"
        >
          <Sparkles className="w-4 h-4" />
          {t('generateOrbit')}
          
          {/* Sweeping light effect */}
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-[scan_1.5s_ease-in-out_infinite]" />
        </button>
      </form>
    </motion.div>
  );
};
