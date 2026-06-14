import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  status: 'idle' | 'analyzing' | 'matching' | 'generating' | 'rendering' | 'success' | 'error';
  message?: string;
}

export const AIThinking: React.FC<Props> = ({ status, message }) => {
  return (
    <AnimatePresence>
      {(status === 'analyzing' || status === 'matching' || status === 'generating') && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          className="absolute top-12 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none"
        >
          <div className="bg-[#020612]/60 backdrop-blur-2xl px-6 py-3 rounded-full border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex items-center gap-4">
            
            {/* Elegant Spinner */}
            <div className="relative w-5 h-5 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-slate-700" />
              <div className="absolute inset-0 rounded-full border-2 border-sky-400 border-t-transparent animate-spin" />
              <div className="absolute inset-0 rounded-full bg-sky-400/20 blur-md animate-pulse" />
            </div>

            <h3 className="text-sm font-medium text-slate-200 tracking-wide">
              {message}
            </h3>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
