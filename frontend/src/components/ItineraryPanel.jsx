import { MapPin, Navigation, Calendar } from 'lucide-react';

export function ItineraryPanel({ plan, selectedPlaceId, onPlaceSelect }) {
  if (!plan) return null;

  return (
    <div className="glass-panel flex flex-col h-full w-[400px] border-l-0 border-r-0 relative z-20">
      {/* Header */}
      <div className="p-8 border-b border-white/5 flex-shrink-0 relative z-10">
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 flex items-center gap-3 mb-3">
          <Navigation className="w-6 h-6 text-blue-400" />
          <span className="tracking-wide">我的旅行轨迹</span>
        </h2>
        <div className="flex gap-2 text-xs mb-4 font-mono-tech">
          <span className="px-3 py-1.5 bg-blue-500/10 text-blue-300 rounded border border-blue-500/20 tech-border">
            {plan.destination}
          </span>
          <span className="px-3 py-1.5 bg-purple-500/10 text-purple-300 rounded border border-purple-500/20 tech-border">
            {plan.days} DAYS
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
                  <div className={`p-5 rounded-2xl transition-all duration-300 border ${
                    isSelected 
                      ? 'glass-card border-blue-500/40 scale-[1.02]' 
                      : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05]'
                  }`}>
                    {/* Header */}
                    <div className="flex justify-between items-start mb-3">
                      <h4 className={`text-lg font-semibold tracking-wide ${isSelected ? 'text-blue-300 text-glow' : 'text-slate-200'}`}>
                        {place.name}
                      </h4>
                      <span className="text-[10px] uppercase tracking-widest text-slate-400 flex items-center gap-1.5 font-mono-tech bg-black/30 px-2 py-1 rounded">
                        <Calendar className="w-3 h-3 text-blue-400" />
                        {place.days} DAY{place.days > 1 ? 'S' : ''}
                      </span>
                    </div>

                    {/* Image */}
                    {place.image && (
                      <div className="w-full h-28 rounded-xl overflow-hidden mb-4 relative">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                        <img 
                          src={place.image} 
                          alt={place.name} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      </div>
                    )}
                    
                    {/* Description */}
                    <p className="text-sm text-slate-400/90 mb-4 leading-relaxed font-light">
                      {place.description}
                    </p>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {place.tags?.map(tag => (
                        <span key={tag} className="text-[10px] px-2.5 py-1 rounded border border-white/10 bg-white/5 text-slate-300 uppercase tracking-wider font-mono-tech">
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
