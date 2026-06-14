import { MapPin, Navigation } from 'lucide-react';

export function ItineraryPanel({ plan, selectedPlaceId, onPlaceSelect }) {
  if (!plan) return null;

  return (
    <div className="bg-slate-900/80 backdrop-blur-md flex flex-col h-full border-r border-white/10 w-80 shadow-2xl overflow-hidden">
      <div className="p-6 border-b border-white/10 flex-shrink-0 bg-gradient-to-br from-slate-800/50 to-transparent">
        <h2 className="text-xl font-bold text-white mb-2">{plan.title}</h2>
        <p className="text-sm text-slate-300">{plan.summary}</p>
        <div className="mt-4 flex gap-2 text-xs">
          <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded-md border border-blue-500/30">
            {plan.destination}
          </span>
          <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded-md border border-purple-500/30">
            {plan.days} 天
          </span>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-700">
        <div>
          <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">经停城市</h3>
          <div className="space-y-2">
            {plan.places?.map((place) => (
              <div 
                key={place.id}
                onClick={() => onPlaceSelect(place)}
                className={`p-3 rounded-xl cursor-pointer transition-all border ${
                  selectedPlaceId === place.id 
                    ? 'bg-blue-600/20 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.15)]' 
                    : 'bg-slate-800/40 border-white/5 hover:bg-slate-800/80 hover:border-white/10'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-medium text-white flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-blue-400" />
                    {place.name}
                  </h4>
                  <span className="text-xs text-slate-400">{place.days}天</span>
                </div>
                <p className="text-xs text-slate-400 mb-2 line-clamp-2">{place.description}</p>
                <div className="flex flex-wrap gap-1">
                  {place.tags?.map(tag => (
                    <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-700/50 text-slate-300">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">每日行程</h3>
          <div className="space-y-4">
            {plan.itinerary?.map((day) => (
              <div key={day.day} className="relative pl-4 border-l border-slate-700 pb-2">
                <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-blue-500 ring-4 ring-slate-900" />
                <h4 className="text-sm font-medium text-white">第 {day.day} 天：{day.city}</h4>
                <p className="text-xs text-blue-300 mb-2">{day.title}</p>
                <ul className="space-y-1">
                  {day.items?.map((item, idx) => (
                    <li key={idx} className="text-xs text-slate-300 flex items-start gap-1.5">
                      <Navigation className="w-3 h-3 text-slate-500 shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
