import { useState, useEffect } from 'react';
import { Play, Pause, Volume2, Mic } from 'lucide-react';

export function AudioPlayerPanel({ selectedPlace }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  // Reset when place changes
  useEffect(() => {
    setIsPlaying(true);
    setProgress(0);
  }, [selectedPlace]);

  // Mock progress
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          setIsPlaying(false);
          return 0;
        }
        return p + 1;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [isPlaying]);

  if (!selectedPlace) return null;

  return (
    <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 p-4 rounded-2xl w-80 shadow-2xl transition-all duration-500 hover:bg-slate-800/90 pointer-events-auto">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <div className="bg-blue-500/20 p-2 rounded-lg border border-blue-500/30">
            <Mic className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <h3 className="text-white font-medium text-sm flex items-center gap-2">
              导游解说
              {isPlaying && (
                <span className="flex gap-0.5">
                  <span className="w-1 h-3 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1 h-4 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </span>
              )}
            </h3>
            <p className="text-slate-400 text-xs">正在介绍：{selectedPlace.name}</p>
          </div>
        </div>
        <Volume2 className="w-4 h-4 text-slate-500 cursor-pointer hover:text-white transition-colors" />
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-10 h-10 rounded-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center text-white shadow-[0_0_15px_rgba(59,130,246,0.4)] transition-all"
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-1" />}
        </button>
        
        <div className="flex-1 space-y-1 cursor-pointer" onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left;
          setProgress((x / rect.width) * 100);
        }}>
          <div className="h-1.5 bg-slate-700/50 rounded-full overflow-hidden relative">
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>00:{(progress * 0.6).toFixed(0).padStart(2, '0')}</span>
            <span>01:00</span>
          </div>
        </div>
      </div>
    </div>
  );
}
