import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Activity, Target } from 'lucide-react';
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
      className="w-[460px] h-[calc(100vh-140px)] mr-4 mt-24 flex flex-col pointer-events-auto border-l border-r border-indigo-500/20 bg-[#02040A]/80 backdrop-blur-md relative"
    >
      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-indigo-400" />
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-indigo-400" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-indigo-400" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-indigo-400" />

      <div className="border-b border-indigo-500/20 p-4 flex items-center justify-between bg-indigo-500/5">
        <div className="flex items-center gap-3">
          <Database className="w-5 h-5 text-indigo-400" />
          <div>
            <h2 className="text-sm font-bold text-indigo-200 tracking-[0.2em] uppercase">AI Route Candidates</h2>
            <p className="text-[9px] text-slate-500 tracking-wider">FOUND: {routesToShow.length} RESULTS</p>
          </div>
        </div>
        <Activity className="w-4 h-4 text-indigo-500/50" />
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
        {routesToShow.map((route) => {
          const isSelected = selectedRouteId === route.id;
          const isAiGenerated = route === activePlan;

          return (
            <div key={route.id} className="relative group">
              <div 
                onClick={() => onSelectRoute(route)}
                onMouseEnter={() => onHoverRoute && onHoverRoute(route)}
                onMouseLeave={() => onHoverRoute && onHoverRoute(null)}
                className={`p-5 transition-all duration-300 cursor-pointer border relative overflow-hidden ${
                  isSelected 
                    ? 'border-indigo-400 bg-indigo-500/10 shadow-[inset_0_0_20px_rgba(99,102,241,0.2)]' 
                    : 'border-white/10 bg-black/40 hover:border-indigo-500/40 hover:bg-indigo-500/5'
                }`}
              >
                {/* HUD Grid Background */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
                  backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
                  backgroundSize: '20px 20px'
                }} />

                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className={`text-lg font-bold tracking-widest uppercase transition-colors mb-1 ${isSelected ? 'text-indigo-300 text-glow' : 'text-slate-200'}`}>
                        {route.title}
                      </h3>
                      {isAiGenerated && (
                        <span className="inline-block text-[9px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 border border-indigo-500/30 tracking-widest uppercase mb-2">
                          SYS_GENERATED
                        </span>
                      )}
                    </div>
                    
                    <div className="flex flex-col items-end">
                      <div className="flex items-center gap-1.5 text-emerald-400 mb-1">
                        <Target className="w-3.5 h-3.5" />
                        <span className="font-mono-tech text-sm font-bold">{route.matchScore || 90}%</span>
                      </div>
                      <span className="text-[9px] text-slate-500 tracking-wider">MATCH SCORE</span>
                    </div>
                  </div>

                  {/* Horizontal Node Map */}
                  <div className="flex items-center justify-between w-full mb-6 relative">
                    <div className="absolute top-1/2 left-0 right-0 h-px bg-slate-700 -translate-y-1/2 z-0" />
                    {route.places.slice(0, 4).map((p, i, arr) => (
                      <div key={p.id} className="relative z-10 flex flex-col items-center gap-2 bg-black/60 px-1">
                        <div className={`w-2.5 h-2.5 rounded-full border-2 ${
                          i === 0 ? 'border-emerald-500 bg-[#02040A]' : 
                          i === arr.length - 1 ? 'border-rose-500 bg-[#02040A]' : 
                          'border-indigo-400 bg-indigo-400'
                        }`} />
                        <span className="text-[9px] text-slate-400 font-mono-tech uppercase tracking-wider">{p.name}</span>
                      </div>
                    ))}
                    {route.places.length > 4 && (
                      <div className="relative z-10 flex flex-col items-center gap-2 bg-black/60 px-1">
                        <span className="text-slate-500 text-xs">...</span>
                      </div>
                    )}
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-2 border-t border-white/10 pt-4">
                    <div className="space-y-1">
                      <div className="text-[9px] text-slate-500 tracking-wider">MOOD</div>
                      <div className="text-xs text-indigo-200 font-mono-tech truncate">{route.mood || 'EXPLORATORY'}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-[9px] text-slate-500 tracking-wider">PACE</div>
                      <div className="text-xs text-indigo-200 font-mono-tech truncate">{route.pace || 'MODERATE'}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-[9px] text-slate-500 tracking-wider">SEASON FIT</div>
                      <div className="text-xs text-indigo-200 font-mono-tech truncate">{route.seasonFit || 'OPTIMAL'}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-[9px] text-slate-500 tracking-wider">AI CONFIDENCE</div>
                      <div className="text-xs text-indigo-200 font-mono-tech truncate">{route.aiConfidence || 'HIGH'}</div>
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
                    className="overflow-hidden bg-[#050505] border border-t-0 border-indigo-500/20"
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
