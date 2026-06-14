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
    <div className="glass-card p-5 rounded-3xl w-[340px] transition-all duration-700 hover:scale-[1.02] pointer-events-auto group relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/20 blur-3xl rounded-full pointer-events-none" />

      <div className="flex justify-between items-center mb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="bg-blue-500/10 p-2.5 rounded-xl border border-blue-500/20 relative">
            <Mic className="w-5 h-5 text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.8)]" />
            {isPlaying && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-blue-400 rounded-full animate-ping" />
            )}
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm flex items-center gap-2 tracking-wide">
              AI 导游解说
              {isPlaying && (
                <span className="flex gap-1 h-3 items-end">
                  <span className="w-1 bg-blue-400 rounded-full animate-pulse h-2" style={{ animationDelay: '0ms' }} />
                  <span className="w-1 bg-blue-400 rounded-full animate-pulse h-3" style={{ animationDelay: '150ms' }} />
                  <span className="w-1 bg-blue-400 rounded-full animate-pulse h-1.5" style={{ animationDelay: '300ms' }} />
                </span>
              )}
            </h3>
            <p className="text-blue-300/70 text-[11px] font-mono-tech mt-0.5">TARGET: {selectedPlace.name.toUpperCase()}</p>
          </div>
        </div>
        <Volume2 className="w-5 h-5 text-slate-400 cursor-pointer hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-all" />
      </div>

      <div className="flex items-center gap-4 relative z-10">
        <button 
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-12 h-12 shrink-0 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 flex items-center justify-center text-white shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all transform active:scale-95 border border-white/20"
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-1" />}
        </button>
        
        <div className="flex-1 space-y-2 cursor-pointer group-hover:opacity-100 opacity-90 transition-opacity" onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left;
          setProgress((x / rect.width) * 100);
        }}>
          <div className="h-2 bg-slate-800/80 rounded-full overflow-hidden relative border border-white/5 shadow-inner">
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 transition-all duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute top-0 right-0 bottom-0 w-4 bg-white/30 blur-[2px]" />
            </div>
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 font-mono-tech tracking-widest">
            <span>00:{(progress * 0.6).toFixed(0).padStart(2, '0')}</span>
            <span>01:00</span>
          </div>
        </div>
      </div>
    </div>
  );
}
