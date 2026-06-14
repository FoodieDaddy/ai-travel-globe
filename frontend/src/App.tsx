import React, { useState, useEffect, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Background } from './components/Layout/Background';
import { Header } from './components/Layout/Header';
import { PlannerPanel } from './components/AIPlanner/PlannerPanel';
import { AIThinking } from './components/AIPlanner/AIThinking';
import { RouteList } from './components/Route/RouteList';
import { TravelGlobe } from './components/Globe/TravelGlobe';
import { AIPlannerMockService } from './services/aiPlannerMock';
import { AIPlanResult, TravelPreference, TravelRoute, City } from './types/travel';
import { PRESET_ROUTES } from './data/routes';
import { useLanguage } from './i18n/LanguageContext';
import { Play } from 'lucide-react';

export type AppPhase = 'landing' | 'planning' | 'generating' | 'result';

export const App: React.FC = () => {
  const { t } = useLanguage();
  const [appPhase, setAppPhase] = useState<AppPhase>('landing');
  const [planState, setPlanState] = useState<AIPlanResult>({ status: 'idle' });
  const [activeRoute, setActiveRoute] = useState<TravelRoute | null>(null);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);

  // New state for progressive rendering
  const [renderStep, setRenderStep] = useState<number>(0);

  const plannerService = useMemo(() => new AIPlannerMockService((result) => {
    setPlanState(result);
    
    if (result.status === 'success' && result.data) {
      setActiveRoute(result.data);
      setSelectedCity(null);
      setAppPhase('result');
      setRenderStep(0); // Start user route sequential animation
    }
  }), []);

  const handleStartPlanning = () => {
    setAppPhase('planning');
    setRenderStep(-1); // Stop demo animation
    setActiveRoute(null);
  };

  const handleViewDemo = () => {
    // Restart the demo animation manually if wanted
    setRenderStep(0);
  };

  const handleGenerate = (pref: TravelPreference) => {
    setSelectedCity(null);
    setActiveRoute(null);
    setRenderStep(-1);
    setAppPhase('generating');
    plannerService.generatePlan(pref);
  };

  const currentRoute = appPhase === 'landing' ? PRESET_ROUTES[0] : activeRoute;

  // Handle Progressive Rendering of Route (Both Demo and Result)
  useEffect(() => {
    if (renderStep >= 0 && currentRoute) {
      const maxSteps = currentRoute.places.length + currentRoute.arcs.length;
      if (renderStep < maxSteps) {
        const timer = setTimeout(() => {
          setRenderStep(prev => prev + 1);
        }, 1200); // 1.2s per segment
        return () => clearTimeout(timer);
      } else {
        // If landing demo finishes, maybe keep it or loop it. Let's just keep it fully rendered.
        if (appPhase !== 'landing') {
          setRenderStep(-1);
        }
      }
    }
  }, [renderStep, currentRoute, appPhase]);

  // Compute displayed points and arcs based on renderStep
  let activePoints = currentRoute?.places || [];
  let activeArcs = currentRoute?.arcs || [];

  if (renderStep >= 0 && currentRoute) {
    const pCount = Math.floor(renderStep / 2) + 1;
    const aCount = Math.floor((renderStep - 1) / 2) + 1;
    activePoints = currentRoute.places.slice(0, Math.max(0, pCount));
    activeArcs = currentRoute.arcs.slice(0, Math.max(0, aCount));
  }

  return (
    <div className="w-screen h-screen overflow-hidden bg-black relative flex font-sans text-slate-200">
      <Background />
      <Header appPhase={appPhase} />

      {/* 3D Globe Layer */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
        <div className="w-full h-full transform scale-[1.15] pointer-events-auto">
          <TravelGlobe 
            places={activePoints}
            arcs={activeArcs}
            selectedPlace={selectedCity}
            onPlaceClick={(city) => {
              if (appPhase === 'result') setSelectedCity(city);
            }}
            isAnimating={renderStep >= 0}
            appPhase={appPhase}
          />
        </div>
      </div>

      {/* UI Overlay Layer */}
      <div className="absolute inset-0 z-10 pointer-events-none flex justify-between p-8 pt-24 pb-10">
        
        {/* Central Landing Elements (Now Hero Left) */}
        <AnimatePresence>
          {appPhase === 'landing' && (
            <>
              {/* Hero Text */}
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="absolute left-[10%] top-1/2 -translate-y-1/2 pointer-events-auto max-w-lg z-20"
              >
                <h1 className="text-5xl font-medium text-white tracking-wide mb-6 leading-tight drop-shadow-2xl">
                  {t('landingTitle')}
                </h1>
                <p className="text-lg text-slate-300 font-light mb-10 leading-relaxed drop-shadow-md">
                  {t('landingSubtitle')}
                </p>
                <div className="flex items-center gap-6">
                  <button 
                    onClick={handleStartPlanning}
                    className="px-8 py-4 rounded-full bg-white text-black font-medium hover:bg-slate-200 transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(255,255,255,0.4)] hover:scale-105 active:scale-95"
                  >
                    {t('startPlanning')}
                  </button>
                  <button 
                    onClick={handleViewDemo}
                    className="px-8 py-4 rounded-full bg-white/5 border border-white/20 text-white font-medium hover:bg-white/10 transition-all flex items-center gap-2 backdrop-blur-md"
                  >
                    <Play className="w-4 h-4" />
                    {t('viewDemo')}
                  </button>
                </div>
              </motion.div>

              {/* Floating Demo Summary (Right) */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, delay: 0.5 }}
                className="absolute right-[5%] bottom-[10%] pointer-events-none z-20"
              >
                <div className="bg-black/20 backdrop-blur-md border border-white/10 px-6 py-3 rounded-2xl flex items-center gap-3 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-sm text-slate-200 font-medium tracking-wide">
                    {t('demoSummary')}
                  </span>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Left Side: AI Planner Panel */}
        <AnimatePresence>
          {(appPhase === 'planning' || appPhase === 'generating') && (
            <motion.div 
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="h-full flex flex-col justify-center"
            >
              <PlannerPanel 
                onGenerate={handleGenerate} 
                disabled={appPhase === 'generating'} 
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Right Side: Route List */}
        <AnimatePresence>
          {appPhase === 'result' && activeRoute && (
            <motion.div 
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 50, opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="h-full flex flex-col justify-start ml-auto"
            >
              <RouteList 
                activePlan={activeRoute}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Central Overlay: AI Thinking Animation */}
      <AIThinking status={planState.status} message={planState.message} />
    </div>
  );
};

export default App;
