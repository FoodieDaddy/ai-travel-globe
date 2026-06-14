import React from 'react';

export const Background: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none bg-[#020612] overflow-hidden">
      {/* Massive soft halo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140vw] h-[140vw] max-w-[1400px] max-h-[1400px] pointer-events-none">
        <div className="absolute inset-0 rounded-full blur-[120px] opacity-40" style={{
          background: 'radial-gradient(circle, rgba(14, 165, 233, 0.15) 0%, rgba(30, 58, 138, 0.1) 40%, transparent 70%)'
        }} />
      </div>

      {/* Subtle Noise Texture overlay for premium feel */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat'
      }} />
      
      {/* Very soft edge darkening */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(circle at center, transparent 50%, rgba(0,0,0,0.4) 100%)'
      }} />
    </div>
  );
};
