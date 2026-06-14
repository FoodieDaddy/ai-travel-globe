import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, Calendar, Navigation, Sparkles, DollarSign, CloudSun } from 'lucide-react';
import { TravelRoute } from '../../types/travel';
import { PRESET_ROUTES } from '../../data/routes';
import { ItineraryTimeline } from './ItineraryTimeline';

interface Props {
  selectedRouteId?: string;
  onSelectRoute: (route: TravelRoute) => void;
  onHoverRoute?: (route: TravelRoute | null) => void;
  activePlan?: TravelRoute | null;
}

export const RouteList: React.FC<Props> = ({ 
  selectedRouteId, 
  onSelectRoute, 
  onHoverRoute, 
  activePlan 
}) => {
  const routesToShow = activePlan ? [activePlan, ...PRESET_ROUTES] : PRESET_ROUTES;

  return (
    <motion.div 
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
      className="w-[440px] h-[calc(100vh-140px)] mr-6 mt-24 flex flex-col gap-4 pointer-events-auto"
    >
      <div className="flex justify-between items-end px-2 mb-2">
        <h2 className="text-white font-bold text-xl flex items-center gap-2 tracking-wide">
          <Map className="w-5 h-5 text-indigo-400" />
          推荐探索路线
        </h2>
        <span className="text-slate-400 text-xs font-mono-tech">{routesToShow.length} RESULTS</span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-2 pb-10 custom-scrollbar">
        {routesToShow.map((route) => {
          const isSelected = selectedRouteId === route.id;
          const isAiGenerated = route === activePlan;

          return (
            <div key={route.id} className="relative">
              <div 
                onClick={() => onSelectRoute(route)}
                onMouseEnter={() => onHoverRoute && onHoverRoute(route)}
                onMouseLeave={() => onHoverRoute && onHoverRoute(null)}
                className={`p-5 rounded-[24px] transition-all duration-300 cursor-pointer border relative overflow-hidden group ${
                  isSelected 
                    ? 'glass-card border-indigo-500/40 transform -translate-y-1 shadow-[0_10px_30px_rgba(99,102,241,0.2)]' 
                    : 'bg-[#0B1120]/60 backdrop-blur-md border-white/5 hover:bg-[#0B1120]/80 hover:border-white/10 hover:-translate-y-0.5'
                }`}
              >
                {isAiGenerated && (
                  <div className="absolute top-0 right-0 bg-gradient-to-l from-emerald-500/20 to-transparent w-32 h-32 blur-[40px] pointer-events-none" />
                )}
                
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className={`text-xl font-bold tracking-wide transition-colors ${isSelected ? 'text-indigo-300 text-glow' : 'text-slate-200 group-hover:text-white'}`}>
                      {route.title}
                    </h3>
                    {isAiGenerated && (
                      <span className="flex items-center gap-1 text-[10px] bg-emerald-500/10 text-emerald-300 px-2 py-1 rounded-full border border-emerald-500/20 font-medium tracking-wider">
                        <Sparkles className="w-3 h-3" />
                        AI GENERATED
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-slate-400 mb-4 line-clamp-2 font-light leading-relaxed">
                    {route.summary}
                  </p>

                  <div className="flex gap-4 mb-4 text-[11px] font-mono-tech text-slate-300 border-t border-white/5 pt-3">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{route.days} DAYS</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Navigation className="w-3.5 h-3.5 text-purple-400" />
                      <span>{route.places.length} CITIES</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{route.budget?.toUpperCase() || 'MEDIUM'}</span>
                    </div>
                  </div>

                  {/* Themes preview */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {route.style?.map((tag) => (
                      <span key={tag} className="text-[10px] text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Timeline dropdown if selected */}
              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <ItineraryTimeline route={route} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};
