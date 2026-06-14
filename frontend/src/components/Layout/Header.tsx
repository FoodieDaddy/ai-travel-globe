import React from 'react';
import { Compass } from 'lucide-react';
import { motion } from 'framer-motion';

export const Header: React.FC = () => {
  return (
    <motion.header 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 p-6 pointer-events-none flex justify-between items-center"
    >
      <div className="flex items-center gap-3 pointer-events-auto cursor-pointer group">
        <div className="w-10 h-10 rounded-xl glass-card flex items-center justify-center border-white/20 group-hover:border-blue-400/50 transition-colors">
          <Compass className="w-6 h-6 text-blue-400 group-hover:rotate-45 transition-transform duration-500" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            AI Travel Atlas
            <span className="px-2 py-0.5 rounded text-[10px] bg-blue-500/20 text-blue-300 font-mono-tech border border-blue-500/30">BETA</span>
          </h1>
          <p className="text-xs text-slate-400 font-light tracking-wide">用 AI 重新探索世界</p>
        </div>
      </div>
      
      <div className="pointer-events-auto flex items-center gap-4">
        <a href="#" className="text-sm text-slate-300 hover:text-white transition-colors">About</a>
        <button className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-medium backdrop-blur-md transition-all border border-white/10 hover:border-white/20">
          Sign In
        </button>
      </div>
    </motion.header>
  );
};
