import { useEffect, useRef } from 'react';
import Globe from 'globe.gl';

export function GlobeView({ places, arcs, selectedPlace, onPlaceClick }) {
  const containerRef = useRef(null);
  const globeRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const globe = Globe()(containerRef.current)
      .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
      .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')
      .pointsData(places)
      .pointLat('lat')
      .pointLng('lng')
      .pointRadius(0.35)
      .pointAltitude(0.05)
      .pointLabel(d => `
        <div style="background: rgba(0,0,0,0.8); padding: 8px; border-radius: 4px; color: white;">
          <b style="color: #60a5fa">${d.name}</b> - ${d.country}<br/>
          <span>${d.days} 天</span><br/>
          <span style="font-size: 12px; color: #cbd5e1">${d.description}</span>
        </div>
      `)
      .pointColor(() => '#3b82f6')
      .onPointClick(onPlaceClick)
      .arcsData(arcs)
      .arcStartLat('startLat')
      .arcStartLng('startLng')
      .arcEndLat('endLat')
      .arcEndLng('endLng')
      .arcColor(() => ['#60a5fa', '#a78bfa'])
      .arcAltitude(0.25)
      .arcDashLength(0.4)
      .arcDashGap(2)
      .arcDashAnimateTime(1800);

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
    if (!globeRef.current || !selectedPlace) return;
    globeRef.current.pointOfView(
      { lat: selectedPlace.lat, lng: selectedPlace.lng, altitude: 1.5 },
      1200
    );
  }, [selectedPlace]);

  return <div ref={containerRef} className="w-full h-full" />;
}
