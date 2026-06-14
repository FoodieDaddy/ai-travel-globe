import React, { useState, useEffect, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Background } from './components/Layout/Background';
import { Header } from './components/Layout/Header';
import { PlannerPanel } from './components/AIPlanner/PlannerPanel';
import { AIThinking } from './components/AIPlanner/AIThinking';
import { RouteList } from './components/Route/RouteList';
import { TravelGlobe } from './components/Globe/TravelGlobe';
import { AIPlannerMockService } from './services/aiPlannerMock';
import { TravelPreference, TravelRoute, City } from './types/travel';
import { PRESET_ROUTES } from './data/routes';
import { useLanguage } from './i18n/LanguageContext';
import { useTravelSceneMachine } from './scene/useTravelSceneMachine';
import { TravelSceneState } from './scene/TravelSceneState';

export const App: React.FC = () => {
  const { t } = useLanguage();
  const { sceneState, progress, renderStep, setRenderStep, startGeneration, resetHeroDemo } = useTravelSceneMachine();
  
  const [activeRoute, setActiveRoute] = useState<TravelRoute | null>(null);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);

  const plannerService = useMemo(() => new AIPlannerMockService((result) => {
    if (result.status === 'success' && result.data) {
      setActiveRoute(result.data);
      setSelectedCity(null);
    }
  }), []);

  const handleGenerate = (pref: TravelPreference) => {
    setSelectedCity(null);
    setActiveRoute(null);
    startGeneration();
    plannerService.generatePlan(pref);
  };

  const isDemo = sceneState === TravelSceneState.HERO_DEMO;
  const currentRoute = isDemo ? PRESET_ROUTES[0] : activeRoute;

  // Handle Progressive Rendering of Route
  useEffect(() => {
    if (renderStep >= 0 && currentRoute) {
      const maxSteps = currentRoute.places.length + currentRoute.arcs.length;
      
      if (renderStep < maxSteps) {
        const timer = setTimeout(() => {
          setRenderStep(prev => prev + 1);
        }, 1200); // 1.2s per segment
        return () => clearTimeout(timer);
      } else {
        if (isDemo) {
          // Loop the demo after holding for 5 seconds
          const holdTimer = setTimeout(() => {
            resetHeroDemo();
          }, 5000);
          return () => clearTimeout(holdTimer);
        } else {
          // If result animation finishes, keep it fully rendered
          setRenderStep(-1);
        }
      }
    }
  }, [renderStep, currentRoute, isDemo, resetHeroDemo, setRenderStep]);

  // Compute displayed points and arcs based on renderStep
  let activePoints = currentRoute?.places || [];
  let activeArcs = currentRoute?.arcs || [];

  if (renderStep >= 0 && currentRoute) {
    const pCount = Math.floor(renderStep / 2) + 1;
    const aCount = Math.floor((renderStep - 1) / 2) + 1;
    activePoints = currentRoute.places.slice(0, Math.max(0, pCount));
    
    // For progressive presentation, inject `demoStep` into cities
    activePoints = activePoints.map((p, idx) => ({ ...p, demoStep: idx * 2 }));
    
    activeArcs = currentRoute.arcs.slice(0, Math.max(0, aCount));
  }

  // Determine visibility of different UI elements based on state
  const isLandingVisible = sceneState === TravelSceneState.IDLE || sceneState === TravelSceneState.HERO_DEMO;
  const isAnalyzing = sceneState === TravelSceneState.ANALYZING || sceneState === TravelSceneState.SELECTING_CITIES;
  const isGeneratingVisible = sceneState !== TravelSceneState.IDLE && sceneState !== TravelSceneState.HERO_DEMO && sceneState !== TravelSceneState.COMPLETE;
  const showDemoSummary = isDemo && currentRoute && renderStep >= (currentRoute.places.length + currentRoute.arcs.length - 1);
  const showResultRoute = sceneState === TravelSceneState.COMPLETE && activeRoute;

  // Derive message for AI Thinking
  let aiMessage = '';
  if (sceneState === TravelSceneState.ANALYZING) aiMessage = t('analyzing');
  if (sceneState === TravelSceneState.SELECTING_CITIES) aiMessage = t('matching');
  if (sceneState === TravelSceneState.BUILDING_ROUTE) aiMessage = t('generating');
  if (sceneState === TravelSceneState.RENDERING_PATH) aiMessage = t('rendering');
  if (sceneState === TravelSceneState.COMPLETE) aiMessage = t('routeReady');

  return (
    <div className="w-screen h-screen overflow-hidden bg-black relative flex font-sans text-slate-200">
      <Background />
      {/* We can map state to a simplified appPhase for Header, or update Header to not care */}
      <Header appPhase={isLandingVisible ? 'landing' : (showResultRoute ? 'result' : 'generating')} />

      {/* 3D Globe Layer */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none overflow-visible">
        <div className="w-[120%] h-[120%] transform scale-[0.85] translate-x-[22%] pointer-events-auto">
          <TravelGlobe 
            places={activePoints}
            arcs={activeArcs}
            selectedPlace={selectedCity}
            onPlaceClick={(city) => {
              if (showResultRoute) setSelectedCity(city);
            }}
            isAnimating={renderStep >= 0}
            sceneState={sceneState}
            currentRenderStep={renderStep}
          />
        </div>
      </div>

      {/* UI Overlay Layer */}
      <div className="absolute inset-0 z-10 pointer-events-none flex justify-between p-8 pt-24 pb-10">
        
        {/* Central Landing Elements (Hero Search Bar) */}
        <AnimatePresence>
          {(isLandingVisible || isAnalyzing) && (
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)', scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="absolute left-[10%] top-1/2 -translate-y-1/2 pointer-events-auto max-w-2xl z-20"
            >
              <h1 className="text-6xl font-medium text-white tracking-wide mb-6 leading-tight drop-shadow-2xl">
                {t('landingTitle')}
              </h1>
              <p className="text-lg text-slate-300 font-light mb-12 leading-relaxed drop-shadow-md">
                {t('landingSubtitle')}
              </p>
              
              <PlannerPanel 
                onGenerate={handleGenerate} 
                disabled={isGeneratingVisible} 
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Demo Summary (Right) */}
        <AnimatePresence>
          {showDemoSummary && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2 }}
              className="absolute right-[5%] bottom-[10%] pointer-events-none z-20"
            >
              <div className="bg-black/20 backdrop-blur-md border border-white/10 px-6 py-3 rounded-2xl flex items-center gap-3 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-sm text-slate-200 font-medium tracking-wide">
                  {t('demoSummary')}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Right Side: Route List */}
        <AnimatePresence>
          {showResultRoute && (
            <motion.div 
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 50, opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.5 }}
              className="h-full flex flex-col justify-start ml-auto pointer-events-auto mt-4"
            >
              <RouteList 
                activePlan={activeRoute!}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Central Overlay: AI Thinking Animation */}
      <AIThinking 
        isVisible={isGeneratingVisible || (sceneState === TravelSceneState.COMPLETE && progress < 100)} 
        message={aiMessage} 
        progress={progress}
      />
    </div>
  );
};

export default App;
