import { useEffect, useRef, useMemo } from 'react';
import Globe from 'globe.gl';

export function GlobeView({ places, arcs, selectedPlace, onPlaceClick }) {
  const containerRef = useRef(null);
  const globeRef = useRef(null);

  // Generate background dots for cyber look
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

    const globe = Globe()(containerRef.current)
      .globeImageUrl('//unpkg.com/three-globe/example/img/earth-dark.jpg')
      .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')
      .showAtmosphere(true)
      .atmosphereColor('#3b82f6')
      .atmosphereAltitude(0.25)
      .pointsData(allPoints)
      .pointLat('lat')
      .pointLng('lng')
      .pointRadius(d => d.isBg ? d.size : 0.8)
      .pointAltitude(d => d.isBg ? 0.01 : 0.02)
      .pointColor(d => d.isBg ? '#1e3a8a' : '#38bdf8')
      .onPointClick((d) => {
        if (!d.isBg && onPlaceClick) onPlaceClick(d);
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
      .htmlElement(d => {
        const el = document.createElement('div');
        el.className = 'w-64 glass-card rounded-2xl overflow-hidden transition-all hover:scale-105 pointer-events-auto cursor-pointer group relative';
        el.innerHTML = `
          <!-- Tech corner accent -->
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
            <p class="text-blue-300/80 text-[10px] font-mono-tech mb-2 tracking-widest uppercase border-b border-white/10 pb-2">COORD: ${d.lat.toFixed(2)}, ${d.lng.toFixed(2)}</p>
            <p class="text-slate-300/90 text-sm line-clamp-2 leading-relaxed font-light">${d.description}</p>
          </div>
        `;
        el.onclick = () => onPlaceClick(d);
        return el;
      });

    globe.controls().autoRotate = true;
    globe.controls().autoRotateSpeed = 0.05; // Slow down rotation significantly
    globe.controls().enableZoom = true; // Allow zoom so users can explore
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
  }, []); // Re-initialize only on mount

  // Update points/arcs dynamically
  useEffect(() => {
    if (!globeRef.current) return;
    globeRef.current.pointsData(allPoints);
    globeRef.current.arcsData(arcs);
  }, [allPoints, arcs]);

  useEffect(() => {
    if (!globeRef.current) return;
    
    // Show HTML card only for the selected place
    globeRef.current.htmlElementsData(selectedPlace ? [selectedPlace] : []);
    
    // Show pulsing ring for the selected place
    globeRef.current.ringsData(selectedPlace ? [selectedPlace] : [])
      .ringLat('lat')
      .ringLng('lng')
      .ringColor(() => t => `rgba(56, 189, 248, ${1-Math.sqrt(t)})`)
      .ringMaxRadius(8)
      .ringPropagationSpeed(3)
      .ringRepeatPeriod(1000);

    if (selectedPlace) {
      // Use setTimeout to ensure globe is fully rendered before jumping
      setTimeout(() => {
        globeRef.current.pointOfView(
          { lat: selectedPlace.lat, lng: selectedPlace.lng, altitude: 1.8 },
          1500
        );
      }, 100);
    }
  }, [selectedPlace]);

  return <div ref={containerRef} className="w-full h-full" />;
}
