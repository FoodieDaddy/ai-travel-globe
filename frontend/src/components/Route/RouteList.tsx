import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Activity } from 'lucide-react';
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
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
      className="w-[480px] h-[calc(100vh-140px)] flex flex-col pointer-events-auto bg-[#020612]/30 backdrop-blur-[40px] rounded-3xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden relative"
    >
      <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
      }} />

      <div className="px-8 pt-8 pb-4 relative z-10 border-b border-white/5">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-medium text-white tracking-wide">AI Route Candidates</h2>
          <Activity className="w-5 h-5 text-slate-500" />
        </div>
        <p className="text-sm text-slate-400 font-light">Generated from your travel signals and seasonal fit.</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar relative z-10">
        {routesToShow.map((route) => {
          const isSelected = selectedRouteId === route.id;
          const isAiGenerated = route === activePlan;

          return (
            <div key={route.id} className="relative group">
              <div 
                onClick={() => onSelectRoute(route)}
                onMouseEnter={() => onHoverRoute && onHoverRoute(route)}
                onMouseLeave={() => onHoverRoute && onHoverRoute(null)}
                className={`p-6 rounded-2xl transition-all duration-500 cursor-pointer border relative overflow-hidden ${
                  isSelected 
                    ? 'border-sky-500/30 bg-sky-500/5 shadow-[inset_0_0_30px_rgba(14,165,233,0.1)]' 
                    : 'border-white/5 bg-black/20 hover:border-white/20 hover:bg-white/5'
                }`}
              >
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <div className="pr-4">
                      <h3 className={`text-xl font-medium tracking-wide transition-colors mb-2 ${isSelected ? 'text-sky-400' : 'text-slate-200'}`}>
                        {route.title}
                      </h3>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-medium text-slate-400">{route.days} Days</span>
                        <div className="w-1 h-1 rounded-full bg-slate-600" />
                        <span className="text-xs font-light text-slate-400 truncate">
                          {route.places.map(p => p.name).join(' → ')}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end shrink-0">
                      <div className="flex items-center gap-1.5 text-cyan-400 mb-1">
                        <span className="text-2xl font-light tracking-tight">{route.matchScore || 90}</span>
                        <span className="text-sm font-medium">%</span>
                      </div>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">Match Score</span>
                    </div>
                  </div>

                  {/* Elegant 2x2 Metrics Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-2 bg-black/20 p-4 rounded-xl border border-white/5">
                    <div className="space-y-1">
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">Travel Mood</div>
                      <div className="text-sm text-slate-200 font-light truncate">{route.mood || 'Exploratory'}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">Pace</div>
                      <div className="text-sm text-slate-200 font-light truncate">{route.pace || 'Moderate'}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">Season Fit</div>
                      <div className="text-sm text-slate-200 font-light truncate">{route.seasonFit || 'Optimal'}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">AI Confidence</div>
                      <div className="text-sm text-slate-200 font-light truncate">{route.aiConfidence || 'High'}</div>
                    </div>
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
                    className="overflow-hidden bg-[#020612]/50 rounded-b-2xl -mt-4 pt-4 border border-t-0 border-sky-500/30 backdrop-blur-md"
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
