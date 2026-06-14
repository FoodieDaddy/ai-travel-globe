import React, { useMemo } from 'react';

export const Background: React.FC = () => {
  // Generate some faint static stars
  const stars = useMemo(() => {
    return Array.from({ length: 150 }).map((_, i) => {
      const top = Math.random() * 100;
      const left = Math.random() * 100;
      const size = Math.random() * 2 + 0.5;
      const opacity = Math.random() * 0.4 + 0.1;
      return (
        <div 
          key={i} 
          className="absolute rounded-full bg-white" 
          style={{
            top: `${top}%`,
            left: `${left}%`,
            width: `${size}px`,
            height: `${size}px`,
            opacity: opacity
          }} 
        />
      );
    });
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none bg-[#020612] overflow-hidden">
      
      {/* Static very faint stars */}
      {stars}

      {/* Gentle Radial Glow behind the Earth (Center-Right) */}
      <div className="absolute top-1/2 left-[60%] -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vw] max-w-[1200px] max-h-[1200px] pointer-events-none">
        <div className="absolute inset-0 rounded-full blur-[100px] opacity-30" style={{
          background: 'radial-gradient(circle, rgba(14, 165, 233, 0.15) 0%, rgba(15, 23, 42, 0.3) 40%, transparent 70%)'
        }} />
      </div>

      {/* Subtle Noise Texture overlay for premium feel */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat'
      }} />
      
    </div>
  );
};
