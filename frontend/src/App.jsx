import { useState } from 'react';
import { GlobeView } from './components/GlobeView';
import { TravelForm } from './components/TravelForm';
import { ItineraryPanel } from './components/ItineraryPanel';
import { demoPlan } from './data/demoPlan';
import axios from 'axios';

function App() {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedPlaceId, setSelectedPlaceId] = useState(null);
  const [error, setError] = useState(null);

  const selectedPlace = plan?.places?.find(p => p.id === selectedPlaceId);

  const handleGenerate = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('http://localhost:3000/api/travel-plans/generate', formData);
      setPlan(response.data.data);
      if (response.data.data?.places?.length > 0) {
        setSelectedPlaceId(response.data.data.places[0].id);
      }
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.error?.message || '路线生成失败，请稍后重试');
      setLoading(false);
    }
  };

  const handlePlaceClick = (place) => {
    setSelectedPlaceId(place.id);
  };

  return (
    <div className="w-screen h-screen overflow-hidden bg-black relative flex">
      {/* 3D Globe Background */}
      <div className="absolute inset-0 z-0">
        <GlobeView 
          places={plan?.places || []} 
          arcs={plan?.arcs || []} 
          selectedPlace={selectedPlace}
          onPlaceClick={handlePlaceClick}
        />
      </div>

      {/* Main UI Overlay */}
      <div className="relative z-10 flex w-full h-full pointer-events-none">
        
        {/* Left Itinerary Panel */}
        <div className="h-full pointer-events-auto transition-transform duration-500 ease-in-out transform">
          {plan ? (
            <ItineraryPanel 
              plan={plan} 
              selectedPlaceId={selectedPlaceId}
              onPlaceSelect={(p) => setSelectedPlaceId(p.id)}
            />
          ) : null}
        </div>

        {/* Center/Right Content */}
        <div className="flex-1 flex flex-col justify-center items-center pointer-events-none p-8">
          {!plan && (
            <div className="pointer-events-auto w-full max-w-sm">
              <TravelForm onSubmit={handleGenerate} loading={loading} />
              {error && (
                <div className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm">
                  {error}
                </div>
              )}
            </div>
          )}
          {plan && (
            <div className="absolute top-6 right-6 pointer-events-auto">
              <button 
                onClick={() => { setPlan(null); setError(null); }}
                className="bg-slate-800/80 hover:bg-slate-700/80 text-white backdrop-blur px-4 py-2 rounded-lg border border-white/10 transition-colors shadow-lg cursor-pointer"
              >
                重新生成路线
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default App;
