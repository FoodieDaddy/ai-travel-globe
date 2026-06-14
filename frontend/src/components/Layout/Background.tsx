import React from 'react';

export const Background: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none bg-[#020617]">
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(circle at 50% 50%, rgba(79, 70, 229, 0.25) 0%, rgba(15, 23, 42, 0) 65%)'
      }} />
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(circle at 100% 0%, rgba(56, 189, 248, 0.15) 0%, transparent 50%)'
      }} />
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(circle at 0% 100%, rgba(168, 85, 247, 0.15) 0%, transparent 50%)'
      }} />
      <div className="absolute inset-0 backdrop-blur-[60px]" />
      
      {/* Global Vignette for cinematic feel */}
      <div className="absolute inset-0 bg-black/60" style={{
        maskImage: 'radial-gradient(circle at center, transparent 30%, black 100%)',
        WebkitMaskImage: 'radial-gradient(circle at center, transparent 30%, black 100%)'
      }} />
    </div>
  );
};
