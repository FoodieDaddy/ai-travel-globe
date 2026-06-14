import React, { useState } from 'react';
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

  // Note: Creating service inside component is usually bad practice as it resets state,
  // but it's acceptable for this simple mock demo. Using useMemo to prevent recreation.
  const plannerService = React.useMemo(() => new AIPlannerMockService((result) => {
    setPlanState(result);
    if (result.status === 'success' && result.data) {
      setActiveRoute(result.data);
      setSelectedCity(null);
    }
  }), []);

  const handleGenerate = (pref: TravelPreference) => {
    setSelectedCity(null);
    plannerService.generatePlan(pref);
  };

  const handleSelectRoute = (route: TravelRoute) => {
    if (activeRoute?.id === route.id) {
      // Toggle off if clicking the same route
      setActiveRoute(null);
    } else {
      setActiveRoute(route);
    }
    setSelectedCity(null);
    setPlanState({ status: 'idle' }); 
  };

  const handleHoverRoute = (route: TravelRoute | null) => {
    setHoveredRoute(route);
  };

  const activePoints = activeRoute?.places || [];
  const activeArcs = activeRoute?.arcs || [];
  
  const hoveredPoints = hoveredRoute?.places || [];
  const hoveredArcs = hoveredRoute?.arcs || [];

  return (
    <div className="w-screen h-screen overflow-hidden bg-black relative flex font-sans text-slate-200">
      <Background />
      <Header />

      {/* 3D Globe Layer */}
      <div className="absolute inset-0 z-0">
        <TravelGlobe 
          places={activePoints}
          arcs={activeArcs}
          selectedPlace={selectedCity}
          hoveredRoutePlaces={hoveredPoints}
          hoveredRouteArcs={hoveredArcs}
          onPlaceClick={(city) => setSelectedCity(city)}
        />
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
