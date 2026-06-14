import React, { useState, useEffect } from 'react';
import { Background } from './components/Layout/Background';
import { Header } from './components/Layout/Header';
import { PlannerPanel } from './components/AIPlanner/PlannerPanel';
import { AIThinking } from './components/AIPlanner/AIThinking';
import { RouteList } from './components/Route/RouteList';
import { TravelGlobe } from './components/Globe/TravelGlobe';
import { AIPlannerMockService } from './services/aiPlannerMock';
import { AIPlanResult, TravelPreference, TravelRoute, City } from './types/travel';
import { PRESET_ROUTES } from './data/routes';

export const App: React.FC = () => {
  const [planState, setPlanState] = useState<AIPlanResult>({ status: 'idle' });
  const [activeRoute, setActiveRoute] = useState<TravelRoute | null>(PRESET_ROUTES[0]);
  const [hoveredRoute, setHoveredRoute] = useState<TravelRoute | null>(null);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);

  // New state for progressive rendering
  const [renderStep, setRenderStep] = useState<number>(-1); // -1 means all rendered

  const plannerService = React.useMemo(() => new AIPlannerMockService((result) => {
    setPlanState(result);
    
    if (result.status === 'success' && result.data) {
      setActiveRoute(result.data);
      setSelectedCity(null);
      // Start sequential animation
      setRenderStep(0);
    }
  }), []);

  const handleGenerate = (pref: TravelPreference) => {
    setSelectedCity(null);
    setActiveRoute(null);
    setRenderStep(-1);
    plannerService.generatePlan(pref);
  };

  const handleSelectRoute = (route: TravelRoute) => {
    if (activeRoute?.id === route.id) {
      setActiveRoute(null);
    } else {
      setActiveRoute(route);
      setRenderStep(0); // Trigger sequence on click as well for cool effect
    }
    setSelectedCity(null);
    setPlanState({ status: 'idle' }); 
  };

  const handleHoverRoute = (route: TravelRoute | null) => {
    setHoveredRoute(route);
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

  const hoveredPoints = hoveredRoute?.places || [];
  const hoveredArcs = hoveredRoute?.arcs || [];

  return (
    <div className="w-screen h-screen overflow-hidden bg-black relative flex font-sans text-slate-200">
      <Background />
      <Header />

      {/* 3D Globe Layer */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
        <div className="w-full h-full transform scale-[1.15] pointer-events-auto">
          <TravelGlobe 
            places={activePoints}
            arcs={activeArcs}
            selectedPlace={selectedCity}
            hoveredRoutePlaces={hoveredPoints}
            hoveredRouteArcs={hoveredArcs}
            onPlaceClick={(city) => setSelectedCity(city)}
            isAnimating={renderStep >= 0}
          />
        </div>
      </div>

      {/* UI Overlay Layer */}
      <div className="absolute inset-0 z-10 pointer-events-none flex justify-between p-8 pt-24 pb-10">
        {/* Left Side: AI Planner Panel */}
        <div className="h-full flex flex-col justify-center">
          <PlannerPanel 
            onGenerate={handleGenerate} 
            disabled={['analyzing', 'matching', 'generating'].includes(planState.status)} 
          />
        </div>

        {/* Right Side: Route List */}
        <div className="h-full flex flex-col justify-start">
          <RouteList 
            activePlan={planState.status === 'success' ? planState.data : undefined}
            selectedRouteId={activeRoute?.id}
            onSelectRoute={handleSelectRoute}
            onHoverRoute={handleHoverRoute}
          />
        </div>
      </div>

      {/* Central Overlay: AI Thinking Animation */}
      <AIThinking status={planState.status} message={planState.message} />
    </div>
  );
};

export default App;
