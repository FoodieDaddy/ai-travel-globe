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
  const [selectedCity, setSelectedCity] = useState<City | null>(null);

  const plannerService = new AIPlannerMockService((result) => {
    setPlanState(result);
    if (result.status === 'success' && result.data) {
      setActiveRoute(result.data);
      setSelectedCity(null);
    }
  });

  const handleGenerate = (pref: TravelPreference) => {
    setSelectedCity(null);
    plannerService.generatePlan(pref);
  };

  const handleSelectRoute = (route: TravelRoute) => {
    setActiveRoute(route);
    setSelectedCity(null);
    setPlanState({ status: 'idle' }); // clear AI generation state if selecting another route
  };

  // Extract all points for the globe from the active route
  const globePoints = activeRoute?.places || [];
  const globeArcs = activeRoute?.arcs || [];

  return (
    <div className="w-screen h-screen overflow-hidden bg-black relative flex font-sans text-slate-200">
      <Background />
      <Header />

      {/* 3D Globe Layer */}
      <div className="absolute inset-0 z-0">
        <TravelGlobe 
          places={globePoints}
          arcs={globeArcs}
          selectedPlace={selectedCity}
          onPlaceClick={(city) => setSelectedCity(city)}
        />
      </div>

      {/* UI Overlay Layer */}
      <div className="absolute inset-0 z-10 pointer-events-none flex justify-between p-6 pt-24 pb-10">
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
          />
        </div>
      </div>

      {/* Central Overlay: AI Thinking Animation */}
      <AIThinking status={planState.status} message={planState.message} />
    </div>
  );
};

export default App;
