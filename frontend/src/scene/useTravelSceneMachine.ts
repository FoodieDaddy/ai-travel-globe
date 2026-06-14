import { useState, useCallback, useRef, useEffect } from 'react';
import { TravelSceneState } from './TravelSceneState';

export function useTravelSceneMachine() {
  const [state, setState] = useState<TravelSceneState>(TravelSceneState.HERO_DEMO);
  
  // Progress values for rendering (0 to 100)
  const [progress, setProgress] = useState(0);
  // Optional step counter for route elements
  const [renderStep, setRenderStep] = useState(-1);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const resetHeroDemo = useCallback(() => {
    setState(TravelSceneState.HERO_DEMO);
    setProgress(0);
    setRenderStep(0); // Starts the looping demo
  }, []);

  const startGeneration = useCallback(() => {
    setState(TravelSceneState.ANALYZING);
    setProgress(0);
    setRenderStep(-1);
    
    // Simulate analyzing
    setTimeout(() => setState(TravelSceneState.SELECTING_CITIES), 1000);
    
    // Simulate matching cities
    setTimeout(() => setState(TravelSceneState.BUILDING_ROUTE), 2000);
    
    // Simulate route calculation
    setTimeout(() => setState(TravelSceneState.RENDERING_PATH), 3000);
    
    // Finish
    setTimeout(() => {
      setState(TravelSceneState.COMPLETE);
      setRenderStep(0); // Start sequential rendering of the user's route
    }, 4500);

  }, []);

  // Update progress score quickly when in COMPLETE
  useEffect(() => {
    if (state === TravelSceneState.COMPLETE) {
      let current = 0;
      const interval = setInterval(() => {
        current += 5;
        if (current >= 98) {
          setProgress(98);
          clearInterval(interval);
        } else {
          setProgress(current);
        }
      }, 50);
      return () => clearInterval(interval);
    }
  }, [state]);

  return {
    sceneState: state,
    progress,
    renderStep,
    setRenderStep,
    startGeneration,
    resetHeroDemo
  };
}
