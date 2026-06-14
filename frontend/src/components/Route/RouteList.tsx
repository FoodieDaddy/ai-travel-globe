import React from 'react';
import { motion } from 'framer-motion';
import { Map, Calendar, Navigation, Sparkles } from 'lucide-react';
import { TravelRoute } from '../../types/travel';
import { PRESET_ROUTES } from '../../data/routes';

interface Props {
  selectedRouteId?: string;
  onSelectRoute: (route: TravelRoute) => void;
  activePlan?: TravelRoute | null;
}

export const RouteList: React.FC<Props> = ({ selectedRouteId, onSelectRoute, activePlan }) => {
  const routesToShow = activePlan ? [activePlan, ...PRESET_ROUTES] : PRESET_ROUTES;

  return (
    <motion.div 
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
      className="w-[420px] h-[calc(100vh-140px)] mr-6 mt-24 flex flex-col gap-4 pointer-events-auto"
    >
      <div className="flex justify-between items-end px-2 mb-2">
        <h2 className="text-white font-bold text-xl flex items-center gap-2 tracking-wide">
          <Map className="w-5 h-5 text-indigo-400" />
          推荐探索路线
        </h2>
        <span className="text-slate-400 text-xs font-mono-tech">{routesToShow.length} RESULTS</span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-2 pb-10">
        {routesToShow.map((route, idx) => {
          const isSelected = selectedRouteId === route.id;
          const isAiGenerated = route === activePlan;

          return (
            <div 
              key={route.id}
              onClick={() => onSelectRoute(route)}
              className={`p-5 rounded-2xl transition-all duration-300 cursor-pointer border relative overflow-hidden group ${
                isSelected 
                  ? 'glass-card border-blue-500/40 scale-[1.02]' 
                  : 'bg-[#0B1120]/60 backdrop-blur-md border-white/10 hover:bg-[#0B1120]/80'
              }`}
            >
              {isAiGenerated && (
                <div className="absolute top-0 right-0 bg-gradient-to-l from-emerald-500/20 to-transparent w-32 h-32 blur-2xl pointer-events-none" />
              )}
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-3">
                  <h3 className={`text-lg font-bold tracking-wide ${isSelected ? 'text-blue-300 text-glow' : 'text-slate-200'}`}>
                    {route.title}
                  </h3>
                  {isAiGenerated && (
                    <span className="flex items-center gap-1 text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded border border-emerald-500/30">
                      <Sparkles className="w-3 h-3" />
                      AI 专属推荐
                    </span>
                  )}
                </div>

                <p className="text-sm text-slate-400/90 mb-4 line-clamp-2 font-light">
                  {route.summary}
                </p>

                <div className="flex gap-4 mb-4 text-xs font-mono-tech text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-indigo-400" />
                    <span>{route.days} DAYS</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Navigation className="w-4 h-4 text-purple-400" />
                    <span>{route.places.length} CITIES</span>
                  </div>
                </div>

                {/* Cities preview */}
                <div className="flex items-center gap-2 flex-wrap">
                  {route.places.slice(0, 4).map((p, i) => (
                    <React.Fragment key={p.id}>
                      <span className="text-[11px] text-slate-300 bg-white/5 px-2 py-1 rounded border border-white/10">
                        {p.name}
                      </span>
                      {i < Math.min(route.places.length, 4) - 1 && (
                        <span className="text-slate-600 text-[10px]">-</span>
                      )}
                    </React.Fragment>
                  ))}
                  {route.places.length > 4 && <span className="text-[11px] text-slate-500">...</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};
