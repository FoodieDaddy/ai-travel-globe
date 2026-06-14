import React, { useEffect, useRef, useMemo } from 'react';
import Globe from 'globe.gl';
import * as THREE from 'three';
import { City } from '../../types/travel';

interface Props {
  places: City[]; // active route cities
  arcs: any[];    // active route arcs
  selectedPlace: City | null;
  hoveredPlace?: City | null;
  hoveredRoutePlaces?: City[];
  hoveredRouteArcs?: any[];
  onPlaceClick: (city: City) => void;
}

export const TravelGlobe: React.FC<Props> = ({ 
  places, 
  arcs, 
  selectedPlace, 
  hoveredPlace,
  hoveredRoutePlaces = [],
  hoveredRouteArcs = [],
  onPlaceClick 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<any>(null);

  // Background dots for cyber look
  const bgDots = useMemo(() => {
    return Array.from({ length: 400 }).map(() => ({
      lat: (Math.random() - 0.5) * 180,
      lng: (Math.random() - 0.5) * 360,
      size: Math.random() * 0.1 + 0.05,
      isBg: true
    }));
  }, []);

  const displayPlaces = hoveredRoutePlaces.length > 0 ? hoveredRoutePlaces : places;
  const displayArcs = hoveredRouteArcs.length > 0 ? hoveredRouteArcs : arcs;

  const allPoints = useMemo(() => {
    return [...bgDots, ...displayPlaces.map(p => ({ ...p, isBg: false }))];
  }, [displayPlaces, bgDots]);

  useEffect(() => {
    if (!containerRef.current) return;

    // @ts-ignore
    const globe = Globe()(containerRef.current)
      .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
      // No background image, we use CSS gradient in Layout
      .showAtmosphere(true)
      .atmosphereColor('#4f46e5') // Indigo glow
      .atmosphereAltitude(0.2)
      .pointsData(allPoints)
      .pointLat('lat')
      .pointLng('lng')
      .pointRadius((d: any) => d.isBg ? d.size : 1.2)
      .pointAltitude((d: any) => d.isBg ? 0.01 : 0.02)
      .pointColor((d: any) => d.isBg ? '#1e3a8a' : '#818cf8')
      .pointLabel((d: any) => {
        if (d.isBg) return '';
        return `<div class="px-2 py-1 bg-black/80 backdrop-blur-md rounded border border-white/10 text-xs font-medium text-slate-200">${d.name}</div>`;
      })
      .onPointClick((d: any) => {
        if (!d.isBg && onPlaceClick) onPlaceClick(d as City);
      })
      .arcsData(displayArcs)
      .arcStartLat('startLat')
      .arcStartLng('startLng')
      .arcEndLat('endLat')
      .arcEndLng('endLng')
      .arcColor(() => ['#38bdf8', '#c084fc']) // Blue to Purple
      .arcAltitude(0.3)
      .arcStroke(1)
      .arcDashLength(0.6)
      .arcDashGap(2)
      .arcDashInitialGap(() => Math.random() * 2)
      .arcDashAnimateTime(1500)
      .htmlElement((d: any) => {
        const el = document.createElement('div');
        el.className = 'w-72 glass-panel rounded-2xl overflow-hidden transition-all duration-500 ease-out pointer-events-auto cursor-pointer group relative scale-in-center';
        el.innerHTML = `
          <div class="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-indigo-400 rounded-tl-2xl z-20 opacity-60"></div>
          ${d.image ? `<div class="relative h-36 overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-t from-[#0B1120] to-transparent z-10"></div>
            <img src="${d.image}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="${d.name}" />
            <div class="absolute top-3 right-3 z-20 px-2 py-1 bg-black/40 backdrop-blur-md rounded text-[10px] font-mono-tech text-slate-300 border border-white/10">
              ${d.country}
            </div>
          </div>` : ''}
          <div class="p-5 relative z-20 -mt-6">
            <div class="absolute top-0 right-5 w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center border-4 border-[#0B1120] shadow-[0_0_20px_rgba(99,102,241,0.5)] transform -translate-y-1/2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
            <h3 class="text-white font-bold text-xl mb-1 tracking-wide text-glow">${d.name}</h3>
            
            <div class="flex flex-wrap gap-1 mb-3">
              ${d.tags ? d.tags.map((t: string) => `<span class="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] text-indigo-300">${t}</span>`).join('') : ''}
              <span class="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-300">${d.days} Days</span>
            </div>

            <p class="text-slate-300/90 text-sm line-clamp-3 leading-relaxed font-light mb-2">
              <span class="text-indigo-400 font-medium text-xs uppercase block mb-1">AI Recommendation</span>
              ${d.description}
            </p>
          </div>
        `;
        // Close button or click on card to dismiss
        el.onclick = (e) => {
          e.stopPropagation();
          onPlaceClick(d as City); // re-clicking can trigger close if handled in parent
        };
        return el;
      });

    // Tuning the earth material
    const globeMaterial = globe.globeMaterial();
    globeMaterial.color = new THREE.Color(0x1a233a);
    globeMaterial.emissive = new THREE.Color(0x111827);
    globeMaterial.emissiveIntensity = 0.2;
    globeMaterial.shininess = 0.5;

    // Add Cloud Layer
    new THREE.TextureLoader().load('//unpkg.com/three-globe/example/img/earth-clouds10k.png', (cloudsTexture: THREE.Texture) => {
      const clouds = new THREE.Mesh(
        new THREE.SphereGeometry(globe.getGlobeRadius() * 1.01, 75, 75),
        new THREE.MeshPhongMaterial({ map: cloudsTexture, transparent: true, opacity: 0.3 })
      );
      globe.scene().add(clouds);
      
      (function rotateClouds() {
        clouds.rotation.y -= 0.002 * Math.PI / 180;
        requestAnimationFrame(rotateClouds);
      })();
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
    globeRef.current.arcsData(displayArcs);
  }, [allPoints, displayArcs]);

  useEffect(() => {
    if (!globeRef.current) return;
    
    // HTML Card for selected place
    globeRef.current.htmlElementsData(selectedPlace ? [selectedPlace] : []);
    
    // Pulse rings for ALL places in the current active/hovered route
    // plus the selected place (which glows differently/stronger)
    const ringData = selectedPlace ? [selectedPlace] : displayPlaces;

    globeRef.current.ringsData(ringData)
      .ringLat('lat')
      .ringLng('lng')
      .ringColor((d: any) => (t: number) => {
        if (d === selectedPlace) return `rgba(167, 139, 250, ${1-Math.sqrt(t)})`; // Purple glow for selected
        return `rgba(56, 189, 248, ${0.5 - Math.sqrt(t)*0.5})`; // Blue glow for route points
      })
      .ringMaxRadius((d: any) => d === selectedPlace ? 10 : 5)
      .ringPropagationSpeed(3)
      .ringRepeatPeriod((d: any) => d === selectedPlace ? 800 : 1200);

    // Camera movement
    if (selectedPlace) {
      setTimeout(() => {
        if (!globeRef.current) return;
        globeRef.current.pointOfView(
          { lat: selectedPlace.lat, lng: selectedPlace.lng, altitude: 1.5 },
          1500
        );
      }, 50);
    } else if (displayPlaces.length > 0) {
      setTimeout(() => {
        if (!globeRef.current) return;
        globeRef.current.pointOfView(
          { lat: displayPlaces[0].lat, lng: displayPlaces[0].lng, altitude: 2.2 },
          2000
        );
      }, 50);
    }
  }, [selectedPlace, displayPlaces]);

  return <div ref={containerRef} className="w-full h-full" />;
};
