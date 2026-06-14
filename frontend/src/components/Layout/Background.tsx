import React from 'react';

export const Background: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <div className="absolute inset-0 bg-[#030712]" />
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(circle at 50% 50%, rgba(30, 58, 138, 0.15) 0%, transparent 60%)'
      }} />
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(circle at 100% 0%, rgba(56, 189, 248, 0.1) 0%, transparent 50%)'
      }} />
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(circle at 0% 100%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)'
      }} />
      <div className="absolute inset-0 backdrop-blur-[100px]" />
      
      {/* Global Vignette */}
      <div className="absolute inset-0 bg-black/40" style={{
        maskImage: 'radial-gradient(circle, transparent 40%, black 100%)',
        WebkitMaskImage: 'radial-gradient(circle, transparent 40%, black 100%)'
      }} />
    </div>
  );
};
