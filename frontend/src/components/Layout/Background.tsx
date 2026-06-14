import React from 'react';

export const Background: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none bg-[#050505] overflow-hidden">
      {/* Massive Central Halo for Earth */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vh] h-[120vh] max-w-[1200px] max-h-[1200px] pointer-events-none">
        <div className="absolute inset-0 rounded-full blur-[100px]" style={{
          background: 'radial-gradient(circle, rgba(79, 70, 229, 0.25) 0%, rgba(56, 189, 248, 0.1) 40%, transparent 70%)'
        }} />
      </div>

      {/* Grid pattern overlay (Data Grid) */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `
          linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
        `,
        backgroundSize: '100px 100px'
      }} />
      
      {/* Edge Vignette */}
      <div className="absolute inset-0 bg-black/50" style={{
        maskImage: 'radial-gradient(circle at center, transparent 40%, black 100%)',
        WebkitMaskImage: 'radial-gradient(circle at center, transparent 40%, black 100%)'
      }} />
    </div>
  );
};
