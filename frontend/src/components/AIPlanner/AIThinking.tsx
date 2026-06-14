import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, Cpu } from 'lucide-react';

interface Props {
  status: 'idle' | 'analyzing' | 'matching' | 'generating' | 'success' | 'error';
  message?: string;
}

export const AIThinking: React.FC<Props> = ({ status, message }) => {
  const [dataStream, setDataStream] = useState<string[]>([]);

  useEffect(() => {
    if (status === 'idle' || status === 'success') {
      setDataStream([]);
      return;
    }

    const interval = setInterval(() => {
      const hex = Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0').toUpperCase();
      const newLog = `> [SYS_OK] Processing node 0x${hex} ...`;
      setDataStream(prev => [...prev.slice(-4), newLog]);
    }, 150);

    return () => clearInterval(interval);
  }, [status]);

  return (
    <AnimatePresence>
      {(status === 'analyzing' || status === 'matching' || status === 'generating') && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
        >
          <div className="w-[400px] border border-indigo-500/30 bg-[#02040A]/90 backdrop-blur-xl p-8 relative overflow-hidden flex flex-col items-center justify-center shadow-[0_0_50px_rgba(99,102,241,0.2)]">
            
            {/* Corner decorations */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-indigo-500" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-indigo-500" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-indigo-500" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-indigo-500" />

            <div className="relative mb-6">
              <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-20 animate-pulse" />
              <Cpu className="w-12 h-12 text-indigo-400 animate-pulse relative z-10" />
            </div>

            <h3 className="text-xl font-bold text-white tracking-[0.2em] uppercase mb-4 text-center">
              {message}
            </h3>

            {/* Data Stream */}
            <div className="w-full bg-black/50 border border-white/5 p-3 rounded h-[80px] overflow-hidden flex flex-col justify-end">
              {dataStream.map((log, i) => (
                <div key={i} className="text-[10px] font-mono-tech text-indigo-500/70 tracking-widest leading-relaxed">
                  {log}
                </div>
              ))}
            </div>

            {/* Scanner line */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-indigo-400 shadow-[0_0_10px_#818cf8] animate-[scan_2s_ease-in-out_infinite]" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
