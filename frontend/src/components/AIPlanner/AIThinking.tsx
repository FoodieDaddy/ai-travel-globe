import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  isVisible: boolean;
  message?: string;
  progress?: number;
}

export const AIThinking: React.FC<Props> = ({ isVisible, message, progress }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 1.05, y: -20 }}
          className="absolute top-12 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none"
        >
          <div className="bg-[#020612]/80 backdrop-blur-3xl px-8 py-4 rounded-full border border-sky-400/30 shadow-[0_8px_32px_rgba(14,165,233,0.3)] flex items-center gap-5">
            
            {/* Elegant Spinner */}
            <div className="relative w-6 h-6 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-slate-700" />
              <div className="absolute inset-0 rounded-full border-2 border-sky-400 border-t-transparent animate-spin" />
              <div className="absolute inset-0 rounded-full bg-sky-400/20 blur-md animate-pulse" />
            </div>

            <div className="flex flex-col">
              <h3 className="text-sm font-medium text-slate-100 tracking-wide">
                {message}
              </h3>
              {progress !== undefined && progress > 0 && (
                <div className="w-full bg-slate-800 h-1 mt-2 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: `${progress}%` }} 
                    className="h-full bg-gradient-to-r from-sky-400 to-purple-500"
                  />
                </div>
              )}
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
