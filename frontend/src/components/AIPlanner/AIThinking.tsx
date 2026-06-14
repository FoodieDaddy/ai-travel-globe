import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Loader2, BrainCircuit, Route, MapPin } from 'lucide-react';

interface Props {
  status: 'idle' | 'analyzing' | 'matching' | 'generating' | 'success' | 'error';
  message?: string;
}

const getIcon = (status: string) => {
  switch(status) {
    case 'analyzing': return <BrainCircuit className="w-8 h-8 text-blue-400" />;
    case 'matching': return <MapPin className="w-8 h-8 text-indigo-400" />;
    case 'generating': return <Route className="w-8 h-8 text-purple-400" />;
    case 'success': return <Sparkles className="w-8 h-8 text-emerald-400" />;
    default: return <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />;
  }
};

export const AIThinking: React.FC<Props> = ({ status, message }) => {
  if (status === 'idle' || status === 'error') return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: -20 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-50 glass-panel px-8 py-6 rounded-2xl flex items-center gap-6 min-w-[320px] shadow-[0_0_50px_rgba(59,130,246,0.3)] pointer-events-none"
      >
        <div className="relative">
          {status !== 'success' && (
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 border-2 border-blue-500/30 border-t-blue-500 rounded-full w-12 h-12 -m-2"
            />
          )}
          <div className="w-8 h-8 flex items-center justify-center relative z-10">
            {getIcon(status)}
          </div>
        </div>
        
        <div>
          <h3 className="text-white font-bold tracking-wider mb-1 flex items-center gap-2">
            AI 引擎运行中
            <span className="flex gap-1 h-3 items-end">
              <span className="w-1 bg-blue-400 rounded-full animate-pulse h-2" style={{ animationDelay: '0ms' }} />
              <span className="w-1 bg-blue-400 rounded-full animate-pulse h-3" style={{ animationDelay: '150ms' }} />
              <span className="w-1 bg-blue-400 rounded-full animate-pulse h-1.5" style={{ animationDelay: '300ms' }} />
            </span>
          </h3>
          <p className="text-slate-300 text-sm font-mono-tech tracking-wide">
            {message}
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
