import { useState } from 'react';
import { GlobeView } from './components/GlobeView';
import { TravelForm } from './components/TravelForm';
import { ItineraryPanel } from './components/ItineraryPanel';
import { AudioPlayerPanel } from './components/AudioPlayerPanel';
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
        
        {/* Left: Form & Player overlay */}
        <div className="h-full flex-1 flex flex-col justify-between p-8 pointer-events-none">
          {/* Top-Left: Re-generate button (if plan exists) or Form (if no plan) */}
          <div className="pointer-events-auto w-full max-w-sm">
            {!plan && (
              <>
                <TravelForm onSubmit={handleGenerate} loading={loading} />
                {error && (
                  <div className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm shadow-xl backdrop-blur">
                    {error}
                  </div>
                )}
              </>
            )}
            {plan && (
              <button 
                onClick={() => { setPlan(null); setError(null); }}
                className="bg-slate-900/80 hover:bg-slate-800 text-white backdrop-blur px-6 py-3 rounded-xl border border-white/10 transition-all shadow-2xl cursor-pointer font-medium"
              >
                重新生成路线
              </button>
            )}
          </div>
          
          {/* Bottom-Left: Audio Player */}
          {plan && selectedPlace && (
            <div className="pointer-events-auto">
              <AudioPlayerPanel selectedPlace={selectedPlace} />
            </div>
          )}
        </div>

        {/* Right Itinerary Panel */}
        <div className="h-full pointer-events-auto transition-transform duration-500 ease-in-out transform shadow-[-10px_0_30px_rgba(0,0,0,0.5)]">
          {plan ? (
            <ItineraryPanel 
              plan={plan} 
              selectedPlaceId={selectedPlaceId}
              onPlaceSelect={(p) => setSelectedPlaceId(p.id)}
            />
          ) : null}
        </div>



      </div>
    </div>
  );
}

export default App;
