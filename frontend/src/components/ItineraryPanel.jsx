import { MapPin, Navigation, Calendar } from 'lucide-react';

export function ItineraryPanel({ plan, selectedPlaceId, onPlaceSelect }) {
  if (!plan) return null;

  return (
    <div className="bg-[#0B1120]/85 backdrop-blur-2xl flex flex-col h-full w-[380px] shadow-[-20px_0_40px_rgba(0,0,0,0.5)] overflow-hidden relative border-l border-blue-500/10">
      {/* Header */}
      <div className="p-6 border-b border-white/10 flex-shrink-0 bg-gradient-to-b from-blue-900/40 to-transparent relative z-10">
        <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-2">
          <Navigation className="w-5 h-5 text-blue-400" />
          我的旅行轨迹
        </h2>
        <div className="flex gap-2 text-xs mb-3">
          <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded-md border border-blue-500/30">
            {plan.destination}
          </span>
          <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded-md border border-purple-500/30">
            {plan.days} 天
          </span>
        </div>
        <p className="text-sm text-slate-300 line-clamp-2">{plan.summary}</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-700 relative z-10">
        {/* Stepper Timeline */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-[11px] top-4 bottom-4 w-px bg-slate-700" />
          
          <div className="space-y-6">
            {plan.places?.map((place, idx) => {
              const isSelected = selectedPlaceId === place.id;
              
              return (
                <div 
                  key={place.id}
                  onClick={() => onPlaceSelect(place)}
                  className="relative pl-8 cursor-pointer group"
                >
                  {/* Stepper Dot */}
                  <div className={`absolute left-0 top-1.5 w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors ${
                    isSelected 
                      ? 'border-blue-400 bg-blue-500/20 shadow-[0_0_10px_rgba(96,165,250,0.5)]' 
                      : 'border-slate-600 bg-slate-900 group-hover:border-slate-400'
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${isSelected ? 'bg-blue-400' : 'bg-slate-600 group-hover:bg-slate-400'}`} />
                  </div>
                  
                  {/* Card */}
                  <div className={`p-4 rounded-xl transition-all border ${
                    isSelected 
                      ? 'bg-blue-900/20 border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.2)]' 
                      : 'bg-slate-800/30 border-white/5 hover:bg-slate-800/50 hover:border-white/10'
                  }`}>
                    {/* Header */}
                    <div className="flex justify-between items-start mb-2">
                      <h4 className={`font-medium ${isSelected ? 'text-blue-300' : 'text-white'}`}>
                        {place.name}
                      </h4>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {place.days}天
                      </span>
                    </div>

                    {/* Image */}
                    {place.image && (
                      <div className="w-full h-24 rounded-lg overflow-hidden mb-3 border border-white/10">
                        <img 
                          src={place.image} 
                          alt={place.name} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                    )}
                    
                    {/* Description */}
                    <p className="text-xs text-slate-400 mb-3 line-clamp-2">
                      {place.description}
                    </p>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {place.tags?.map(tag => (
                        <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-700/50 text-slate-300 border border-slate-600">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
