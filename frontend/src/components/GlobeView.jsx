import { useEffect, useRef } from 'react';
import Globe from 'globe.gl';

export function GlobeView({ places, arcs, selectedPlace, onPlaceClick }) {
  const containerRef = useRef(null);
  const globeRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const globe = Globe()(containerRef.current)
      .globeImageUrl('//unpkg.com/three-globe/example/img/earth-dark.jpg')
      .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')
      .showAtmosphere(true)
      .atmosphereColor('#3b82f6')
      .atmosphereAltitude(0.2)
      .pointsData(places)
      .pointLat('lat')
      .pointLng('lng')
      .pointRadius(0.5)
      .pointAltitude(0.01)
      .pointColor(() => '#60a5fa')
      .onPointClick(onPlaceClick)
      .arcsData(arcs)
      .arcStartLat('startLat')
      .arcStartLng('startLng')
      .arcEndLat('endLat')
      .arcEndLng('endLng')
      .arcColor(() => ['#3b82f6', '#8b5cf6'])
      .arcAltitude(0.3)
      .arcDashLength(0.4)
      .arcDashGap(2)
      .arcDashAnimateTime(2000)
      .htmlElement(d => {
        const el = document.createElement('div');
        el.className = 'w-48 bg-slate-900/80 backdrop-blur-md border border-white/20 rounded-xl overflow-hidden shadow-2xl transition-all hover:scale-105 pointer-events-auto cursor-pointer';
        el.innerHTML = `
          ${d.image ? `<img src="${d.image}" class="w-full h-24 object-cover" alt="${d.name}" />` : ''}
          <div class="p-3">
            <h3 class="text-white font-bold text-sm mb-1">${d.name}</h3>
            <p class="text-slate-300 text-xs line-clamp-2">${d.description}</p>
          </div>
        `;
        el.onclick = () => onPlaceClick(d);
        return el;
      });

    globe.controls().autoRotate = true;
    globe.controls().autoRotateSpeed = 0.5;
    globeRef.current = globe;

    // Handle resize
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
    globeRef.current.pointsData(places);
    globeRef.current.arcsData(arcs);
  }, [places, arcs]);

  useEffect(() => {
    if (!globeRef.current) return;
    
    // Show HTML card only for the selected place
    globeRef.current.htmlElementsData(selectedPlace ? [selectedPlace] : []);
    
    // Show pulsing ring for the selected place
    globeRef.current.ringsData(selectedPlace ? [selectedPlace] : [])
      .ringLat('lat')
      .ringLng('lng')
      .ringColor(() => t => `rgba(96, 165, 250, ${1-t})`)
      .ringMaxRadius(5)
      .ringPropagationSpeed(3)
      .ringRepeatPeriod(1000);

    if (selectedPlace) {
      globeRef.current.pointOfView(
        { lat: selectedPlace.lat, lng: selectedPlace.lng, altitude: 1.5 },
        1200
      );
    }
  }, [selectedPlace]);

  return <div ref={containerRef} className="w-full h-full" />;
}
