import React, { useEffect, useRef, useMemo } from 'react';
import Globe from 'globe.gl';
import { City } from '../../types/travel';

interface Props {
  places: City[];
  arcs: any[];
  selectedPlace: City | null;
  onPlaceClick: (city: City) => void;
}

export const TravelGlobe: React.FC<Props> = ({ places, arcs, selectedPlace, onPlaceClick }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<any>(null);

  // Background dots for cyber look
  const bgDots = useMemo(() => {
    return Array.from({ length: 800 }).map(() => ({
      lat: (Math.random() - 0.5) * 180,
      lng: (Math.random() - 0.5) * 360,
      size: Math.random() * 0.1 + 0.05,
      isBg: true
    }));
  }, []);

  const allPoints = useMemo(() => {
    return [...bgDots, ...places.map(p => ({ ...p, isBg: false }))];
  }, [places, bgDots]);

  useEffect(() => {
    if (!containerRef.current) return;
    // @ts-ignore
    const globe = Globe()(containerRef.current)
      .globeImageUrl('//unpkg.com/three-globe/example/img/earth-dark.jpg')
      .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')
      .showAtmosphere(true)
      .atmosphereColor('#3b82f6')
      .atmosphereAltitude(0.25)
      .pointsData(allPoints)
      .pointLat('lat')
      .pointLng('lng')
      .pointRadius((d: any) => d.isBg ? d.size : 0.8)
      .pointAltitude((d: any) => d.isBg ? 0.01 : 0.02)
      .pointColor((d: any) => d.isBg ? '#1e3a8a' : '#38bdf8')
      .onPointClick((d: any) => {
        if (!d.isBg && onPlaceClick) onPlaceClick(d as City);
      })
      .arcsData(arcs)
      .arcStartLat('startLat')
      .arcStartLng('startLng')
      .arcEndLat('endLat')
      .arcEndLng('endLng')
      .arcColor(() => ['#38bdf8', '#c084fc'])
      .arcAltitude(0.35)
      .arcDashLength(0.4)
      .arcDashGap(2)
      .arcDashAnimateTime(2000)
      .htmlElement((d: any) => {
        const el = document.createElement('div');
        el.className = 'w-64 glass-card rounded-2xl overflow-hidden transition-all hover:scale-105 pointer-events-auto cursor-pointer group relative';
        el.innerHTML = `
          <div class="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-blue-400 rounded-tl-2xl z-20 opacity-50"></div>
          ${d.image ? `<div class="relative h-32 overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-t from-[#0f172a] to-transparent z-10"></div>
            <img src="${d.image}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="${d.name}" />
          </div>` : ''}
          <div class="p-5 relative z-20 -mt-8">
            <div class="absolute top-0 right-4 w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center border-4 border-[#0f172a] shadow-[0_0_15px_rgba(59,130,246,0.6)] transform -translate-y-1/2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            </div>
            <h3 class="text-white font-bold text-lg mb-1 tracking-wide">${d.name}</h3>
            <p class="text-blue-300/80 text-[10px] font-mono-tech mb-2 tracking-widest uppercase border-b border-white/10 pb-2">COORD: ${Number(d.lat).toFixed(2)}, ${Number(d.lng).toFixed(2)}</p>
            <p class="text-slate-300/90 text-sm line-clamp-2 leading-relaxed font-light">${d.description}</p>
          </div>
        `;
        el.onclick = () => onPlaceClick(d as City);
        return el;
      });

    globe.controls().autoRotate = true;
    globe.controls().autoRotateSpeed = 0.05;
    globe.controls().enableZoom = true;
    globeRef.current = globe;

    const handleResize = () => {
      if (containerRef.current) {
        globe.width(containerRef.current.clientWidth);
        globe.height(containerRef.current.clientHeight);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, []);

  useEffect(() => {
    if (!globeRef.current) return;
    globeRef.current.pointsData(allPoints);
    globeRef.current.arcsData(arcs);
  }, [allPoints, arcs]);

  useEffect(() => {
    if (!globeRef.current) return;
    
    globeRef.current.htmlElementsData(selectedPlace ? [selectedPlace] : []);
    
    globeRef.current.ringsData(selectedPlace ? [selectedPlace] : [])
      .ringLat('lat')
      .ringLng('lng')
      .ringColor(() => (t: number) => `rgba(56, 189, 248, ${1-Math.sqrt(t)})`)
      .ringMaxRadius(8)
      .ringPropagationSpeed(3)
      .ringRepeatPeriod(1000);

    if (selectedPlace) {
      setTimeout(() => {
        globeRef.current.pointOfView(
          { lat: selectedPlace.lat, lng: selectedPlace.lng, altitude: 1.8 },
          1500
        );
      }, 100);
    } else if (places.length > 0) {
      // If a route is selected but no specific place, fly to the first place of the route
      setTimeout(() => {
        globeRef.current.pointOfView(
          { lat: places[0].lat, lng: places[0].lng, altitude: 2.5 },
          2000
        );
      }, 100);
    }
  }, [selectedPlace, places]);

  return <div ref={containerRef} className="w-full h-full" />;
};
