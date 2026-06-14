import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe2 } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

interface Props {
  appPhase?: 'landing' | 'planning' | 'generating' | 'result';
}

export const Header: React.FC<Props> = ({ appPhase = 'planning' }) => {
  const { t, language, setLanguage } = useLanguage();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-8 py-6 pointer-events-none">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between">
        {/* Left Branding (Hidden in landing phase) */}
        <AnimatePresence>
          {appPhase !== 'landing' && (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex items-center gap-4 pointer-events-auto"
            >
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                <Globe2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-medium tracking-tight text-white">{t('appName')}</h1>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-medium">{t('appDesc')}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Right Actions */}
        <div className="flex items-center gap-6 pointer-events-auto ml-auto">
          {/* Language Switcher */}
          <div className="flex items-center gap-1 bg-white/5 backdrop-blur-md rounded-full p-1 border border-white/10">
            <button 
              onClick={() => setLanguage('zh')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${language === 'zh' ? 'bg-white text-black shadow-md' : 'text-slate-400 hover:text-white'}`}
            >
              中文
            </button>
            <button 
              onClick={() => setLanguage('en')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${language === 'en' ? 'bg-white text-black shadow-md' : 'text-slate-400 hover:text-white'}`}
            >
              EN
            </button>
          </div>

          {/* Sign In */}
          <button className="px-5 py-2 rounded-full border border-white/20 text-white/80 text-sm font-medium hover:bg-white hover:text-black transition-all backdrop-blur-md">
            {t('signIn')}
          </button>
        </div>
      </div>
    </header>
  );
};
