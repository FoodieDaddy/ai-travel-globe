import React from 'react';
import { motion } from 'framer-motion';
import { TravelRoute } from '../../types/travel';
import { TerminalSquare } from 'lucide-react';

interface Props {
  route: TravelRoute;
}

export const ItineraryTimeline: React.FC<Props> = ({ route }) => {
  if (!route.places || route.places.length === 0) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-5"
    >
      <div className="flex items-center gap-2 mb-6 border-b border-indigo-500/20 pb-2">
        <TerminalSquare className="w-4 h-4 text-indigo-400" />
        <h3 className="text-xs font-bold text-indigo-300 tracking-[0.15em] uppercase">
          Mission Nodes
        </h3>
        <span className="ml-auto text-[9px] font-mono-tech text-slate-500 tracking-wider">
          DURATION: {route.days}D
        </span>
      </div>
      
      <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px before:h-full before:w-[2px] before:bg-indigo-500/20">
        {route.places.map((place, idx) => {
          const startDay = route.places.slice(0, idx).reduce((acc, p) => acc + p.days, 1);
          const endDay = startDay + place.days - 1;

          return (
            <div key={place.id} className="relative flex items-start gap-5 group">
              {/* Node Indicator */}
              <div className="absolute left-0 w-6 h-6 rounded-full bg-[#02040A] border-2 border-indigo-500/50 flex items-center justify-center z-10 group-hover:border-indigo-400 group-hover:shadow-[0_0_10px_rgba(99,102,241,0.5)] transition-all">
                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse" />
              </div>
              
              <div className="ml-8 w-full">
                <div className="flex items-baseline justify-between mb-2">
                  <h4 className="text-indigo-200 font-mono-tech font-bold text-sm tracking-wider">
                    [ NODE: {place.name.toUpperCase()} ]
                  </h4>
                  <span className="text-[10px] font-mono-tech text-indigo-400/80 bg-indigo-500/10 px-1.5 py-0.5 border border-indigo-500/20">
                    DAY {startDay}{startDay !== endDay ? `-${endDay}` : ''}
                  </span>
                </div>
                
                <div className="bg-black/40 border border-white/5 p-3 rounded-sm relative">
                  <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-indigo-500/30 group-hover:bg-indigo-400 transition-colors" />
                  <p className="text-[11px] text-slate-400 leading-relaxed font-light mb-2">
                    {place.description}
                  </p>
                  <div className="flex gap-1.5">
                    {place.tags?.map(tag => (
                      <span key={tag} className="text-[9px] text-slate-500 font-mono-tech uppercase tracking-wider before:content-['#']">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};
