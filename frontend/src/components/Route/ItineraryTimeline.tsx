import React from 'react';
import { motion } from 'framer-motion';
import { TravelRoute } from '../../types/travel';
import { MapPin } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

interface Props {
  route: TravelRoute;
}

export const ItineraryTimeline: React.FC<Props> = ({ route }) => {
  const { t } = useLanguage();
  
  if (!route.places || route.places.length === 0) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-6 pt-4"
    >
      <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-3">
        <MapPin className="w-4 h-4 text-sky-400" />
        <h3 className="text-sm font-medium text-white tracking-wide">
          {t('journeyTimeline')}
        </h3>
      </div>
      
      <div className="space-y-8 relative before:absolute before:inset-0 before:ml-[3px] before:-translate-x-px before:h-full before:w-[1px] before:bg-white/10">
        {route.places.map((place, idx) => {
          const startDay = route.places.slice(0, idx).reduce((acc, p) => acc + p.days, 1);
          const endDay = startDay + place.days - 1;

          return (
            <div key={place.id} className="relative flex items-start gap-6 group">
              {/* Elegant Node Indicator */}
              <div className="absolute left-0 mt-1.5 w-2 h-2 rounded-full bg-sky-400 shadow-[0_0_10px_rgba(14,165,233,0.8)] z-10 transition-transform duration-300 group-hover:scale-150" />
              
              <div className="ml-6 w-full">
                <div className="flex items-baseline mb-2 gap-3">
                  <h4 className="text-white font-medium text-base tracking-wide">
                    {place.name}
                  </h4>
                  <div className="flex-1 border-b border-dashed border-white/10 translate-y-[-4px]" />
                  <span className="text-xs font-medium text-sky-400">
                    {t('days')} {startDay}{startDay !== endDay ? `-${endDay}` : ''}
                  </span>
                </div>
                
                <p className="text-sm text-slate-400 leading-relaxed font-light mb-3">
                  {place.description}
                </p>
                <div className="flex gap-2">
                  {place.tags?.map(tag => (
                    <span key={tag} className="text-[10px] text-slate-500 font-medium px-2 py-1 bg-white/5 rounded-md border border-white/5">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};
