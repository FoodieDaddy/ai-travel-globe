import React, { useState, useEffect } from 'react';
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

export type AppPhase = 'landing' | 'planning' | 'generating' | 'result';

export const App: React.FC = () => {
  const { t } = useLanguage();
  const [appPhase, setAppPhase] = useState<AppPhase>('landing');
  const [planState, setPlanState] = useState<AIPlanResult>({ status: 'idle' });
  const [activeRoute, setActiveRoute] = useState<TravelRoute | null>(null);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);

  // New state for progressive rendering
  const [renderStep, setRenderStep] = useState<number>(-1); // -1 means all rendered

  const plannerService = React.useMemo(() => new AIPlannerMockService((result) => {
    setPlanState(result);
    
    if (result.status === 'success' && result.data) {
      setActiveRoute(result.data);
      setSelectedCity(null);
      setAppPhase('result');
      // Start sequential animation
      setRenderStep(0);
    }
  }), []);

  const handleStartPlanning = () => {
    setAppPhase('planning');
  };

  const handleGenerate = (pref: TravelPreference) => {
    setSelectedCity(null);
    setActiveRoute(null);
    setRenderStep(-1);
    setAppPhase('generating');
    plannerService.generatePlan(pref);
  };

  // Handle Progressive Rendering of Route
  useEffect(() => {
    if (renderStep >= 0 && activeRoute) {
      const maxSteps = activeRoute.places.length + activeRoute.arcs.length;
      if (renderStep < maxSteps) {
        const timer = setTimeout(() => {
          setRenderStep(prev => prev + 1);
        }, 1200); // 1.2s per segment
        return () => clearTimeout(timer);
      } else {
        // Animation complete
        setRenderStep(-1);
      }
    }
  }, [renderStep, activeRoute]);

  // Compute displayed points and arcs based on renderStep
  let activePoints = activeRoute?.places || [];
  let activeArcs = activeRoute?.arcs || [];

  if (renderStep >= 0 && activeRoute) {
    const pCount = Math.floor(renderStep / 2) + 1;
    const aCount = Math.floor((renderStep - 1) / 2) + 1;
    activePoints = activeRoute.places.slice(0, Math.max(0, pCount));
    activeArcs = activeRoute.arcs.slice(0, Math.max(0, aCount));
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
            onPlaceClick={(city) => setSelectedCity(city)}
            isAnimating={renderStep >= 0}
            appPhase={appPhase}
          />
        </div>
      </div>

      {/* UI Overlay Layer */}
      <div className="absolute inset-0 z-10 pointer-events-none flex justify-between p-8 pt-24 pb-10">
        
        {/* Central Landing Elements */}
        <AnimatePresence>
          {appPhase === 'landing' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
            >
              <div className="text-center pointer-events-auto bg-black/10 backdrop-blur-sm p-12 rounded-3xl border border-white/5 shadow-2xl">
                <h1 className="text-6xl font-light text-white tracking-tight mb-4">{t('landingTitle')}</h1>
                <p className="text-lg text-slate-400 font-light mb-12 tracking-wide max-w-md mx-auto">
                  {t('landingSubtitle')}
                </p>
                <button 
                  onClick={handleStartPlanning}
                  className="px-10 py-4 rounded-full bg-white text-black font-medium text-lg hover:bg-slate-200 transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(255,255,255,0.4)] hover:scale-105 active:scale-95"
                >
                  {t('startPlanning')}
                </button>
              </div>
            </motion.div>
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
