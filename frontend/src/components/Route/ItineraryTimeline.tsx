import React from 'react';
import { motion } from 'framer-motion';
import { TravelRoute } from '../../types/travel';
import { MapPin } from 'lucide-react';

interface Props {
  route: TravelRoute;
}

export const ItineraryTimeline: React.FC<Props> = ({ route }) => {
  if (!route.places || route.places.length === 0) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-4 p-5 glass-panel rounded-2xl border border-white/5"
    >
      <h3 className="text-sm font-bold text-slate-200 mb-4 tracking-wide flex items-center gap-2">
        行程概览
        <span className="text-xs font-mono-tech text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full">{route.days} DAYS</span>
      </h3>
      
      <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-indigo-500/50 before:via-purple-500/50 before:to-transparent">
        {route.places.map((place, idx) => {
          // Mocking the days. Assuming each place takes 'place.days'
          const startDay = route.places.slice(0, idx).reduce((acc, p) => acc + p.days, 1);
          const endDay = startDay + place.days - 1;

          return (
            <div key={place.id} className="relative flex items-start gap-4">
              <div className="absolute left-0 mt-1.5 w-5 h-5 rounded-full bg-[#0B1120] border-2 border-indigo-400 flex items-center justify-center shadow-[0_0_10px_rgba(99,102,241,0.5)] z-10">
                <div className="w-1.5 h-1.5 bg-indigo-300 rounded-full" />
              </div>
              <div className="ml-8 w-full">
                <div className="flex items-baseline justify-between mb-1">
                  <h4 className="text-slate-200 font-bold text-sm">{place.name}</h4>
                  <span className="text-xs font-mono-tech text-indigo-300">
                    Day {startDay}{startDay !== endDay ? `-${endDay}` : ''}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed font-light line-clamp-2">
                  {place.description}
                </p>
                <div className="flex gap-1 mt-2">
                  {place.tags?.slice(0, 2).map(tag => (
                    <span key={tag} className="text-[9px] bg-white/5 border border-white/10 text-slate-300 px-1.5 py-0.5 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};
