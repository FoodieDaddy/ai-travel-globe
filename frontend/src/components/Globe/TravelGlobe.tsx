import React, { useEffect, useRef, useMemo } from 'react';
import Globe from 'globe.gl';
import * as THREE from 'three';
import { City } from '../../types/travel';

interface Props {
  places: City[]; 
  arcs: any[];    
  selectedPlace: City | null;
  hoveredPlace?: City | null;
  hoveredRoutePlaces?: City[];
  hoveredRouteArcs?: any[];
  onPlaceClick: (city: City) => void;
  isAnimating?: boolean;
}

export const TravelGlobe: React.FC<Props> = ({ 
  places, 
  arcs, 
  selectedPlace, 
  hoveredRoutePlaces = [],
  hoveredRouteArcs = [],
  onPlaceClick,
  isAnimating = false
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
    return [...bgDots, ...displayPlaces.map((p, i) => ({ 
      ...p, 
      isBg: false,
      isStart: i === 0,
      isEnd: i === displayPlaces.length - 1 && displayPlaces.length > 1
    }))];
  }, [displayPlaces, bgDots]);

  useEffect(() => {
    if (!containerRef.current) return;

    // @ts-ignore
    const globe = Globe()(containerRef.current)
      .globeImageUrl('//unpkg.com/three-globe/example/img/earth-night.jpg')
      .showAtmosphere(true)
      .atmosphereColor('#6366f1') // Intense purple/blue
      .atmosphereAltitude(0.25)
      .pointsData(allPoints)
      .pointLat('lat')
      .pointLng('lng')
      .pointRadius((d: any) => d.isBg ? d.size : (d.isStart || d.isEnd ? 1.5 : 1.0))
      .pointAltitude((d: any) => d.isBg ? 0.01 : 0.03)
      .pointColor((d: any) => {
        if (d.isBg) return '#1e3a8a';
        if (d.isStart) return '#10b981'; // Emerald start
        if (d.isEnd) return '#f43f5e';   // Rose end
        return '#38bdf8';                // Blue intermediate
      })
      .pointLabel((d: any) => {
        if (d.isBg) return '';
        return `<div class="px-2 py-1 bg-black/80 backdrop-blur-md rounded border border-white/10 text-[10px] font-mono-tech text-indigo-300 shadow-[0_0_10px_rgba(99,102,241,0.3)]">[ NODE: ${d.name.toUpperCase()} ]</div>`;
      })
      .onPointClick((d: any) => {
        if (!d.isBg && onPlaceClick) onPlaceClick(d as City);
      })
      .arcsData(displayArcs)
      .arcStartLat('startLat')
      .arcStartLng('startLng')
      .arcEndLat('endLat')
      .arcEndLng('endLng')
      .arcColor(() => ['#818cf8', '#c084fc']) // Blue to Purple
      .arcAltitudeAutoScale(0.6) // Higher orbital arcs
      .arcStroke(1.2)
      .arcDashLength(0.4)
      .arcDashGap(2)
      .arcDashInitialGap(() => Math.random() * 2)
      .arcDashAnimateTime(2000)
      .htmlElement((d: any) => {
        const el = document.createElement('div');
        el.className = 'w-72 glass-panel rounded-xl overflow-hidden transition-all duration-500 ease-out pointer-events-auto cursor-pointer group relative scale-in-center border border-indigo-500/30 bg-[#050505]/80 backdrop-blur-xl shadow-[0_0_30px_rgba(99,102,241,0.2)]';
        el.innerHTML = `
          <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-transparent opacity-50"></div>
          ${d.image ? `<div class="relative h-32 overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent z-10"></div>
            <img src="${d.image}" class="w-full h-full object-cover opacity-60 mix-blend-screen transition-transform duration-700 group-hover:scale-110" alt="${d.name}" />
            <div class="absolute top-3 right-3 z-20 px-2 py-1 bg-indigo-500/20 backdrop-blur-md rounded text-[9px] font-mono-tech text-indigo-200 border border-indigo-500/30">
              SYS_LOC // ${d.country.toUpperCase()}
            </div>
          </div>` : ''}
          <div class="p-5 relative z-20 -mt-4">
            <h3 class="text-white font-bold text-xl mb-1 tracking-wider uppercase">${d.name}</h3>
            
            <div class="flex flex-wrap gap-1 mb-4 border-b border-white/5 pb-3">
              ${d.tags ? d.tags.map((t: string) => `<span class="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[9px] text-slate-400 font-mono-tech">[${t.toUpperCase()}]</span>`).join('') : ''}
              <span class="px-1.5 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-[9px] text-indigo-300 font-mono-tech">DUR: ${d.days}D</span>
            </div>

            <p class="text-slate-400 text-xs line-clamp-3 leading-relaxed font-light mb-1">
              <span class="text-indigo-400 font-medium text-[10px] font-mono-tech tracking-wider block mb-1">> AI_ANALYSIS_</span>
              ${d.description}
            </p>
          </div>
        `;
        el.onclick = (e) => {
          e.stopPropagation();
          onPlaceClick(d as City);
        };
        return el;
      });

    const globeMaterial = globe.globeMaterial();
    globeMaterial.color = new THREE.Color(0x0a0f1c);
    globeMaterial.emissive = new THREE.Color(0x02040a);
    globeMaterial.emissiveIntensity = 0.5;
    globeMaterial.shininess = 0.8;

    // Holographic Mesh & Scanner
    const R = globe.getGlobeRadius();
    
    // 1. Wireframe Sphere
    const wireframe = new THREE.Mesh(
      new THREE.SphereGeometry(R * 1.002, 36, 18),
      new THREE.MeshBasicMaterial({ color: 0x4338ca, wireframe: true, transparent: true, opacity: 0.15 })
    );

    // 2. Equatorial Scanner Ring
    const scannerRing = new THREE.Mesh(
      new THREE.TorusGeometry(R * 1.05, 0.5, 16, 100),
      new THREE.MeshBasicMaterial({ color: 0xa855f7, transparent: true, opacity: 0.4 })
    );
    scannerRing.rotation.x = Math.PI / 2;

    globe.scene().add(wireframe);
    globe.scene().add(scannerRing);

    (function rotateHolo() {
      scannerRing.rotation.z += 0.005;
      requestAnimationFrame(rotateHolo);
    })();

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
    const ringData = selectedPlace ? [selectedPlace] : displayPlaces;

    globeRef.current.ringsData(ringData)
      .ringLat('lat')
      .ringLng('lng')
      .ringColor((d: any) => (t: number) => {
        if (d === selectedPlace) return `rgba(167, 139, 250, ${1-Math.sqrt(t)})`; 
        return `rgba(56, 189, 248, ${0.5 - Math.sqrt(t)*0.5})`; 
      })
      .ringMaxRadius((d: any) => d === selectedPlace ? 15 : 8)
      .ringPropagationSpeed(3)
      .ringRepeatPeriod((d: any) => d === selectedPlace ? 600 : 1000);

    // Camera movement tracking latest point during animation
    if (isAnimating && displayPlaces.length > 0) {
      const latestPlace = displayPlaces[displayPlaces.length - 1];
      globeRef.current.pointOfView(
        { lat: latestPlace.lat, lng: latestPlace.lng, altitude: 2.0 },
        800 // fast pan
      );
    } else if (selectedPlace) {
      setTimeout(() => {
        if (!globeRef.current) return;
        globeRef.current.pointOfView(
          { lat: selectedPlace.lat, lng: selectedPlace.lng, altitude: 1.2 },
          1500
        );
      }, 50);
    } else if (displayPlaces.length > 0 && !isAnimating) {
      // Show full route overview
      setTimeout(() => {
        if (!globeRef.current) return;
        globeRef.current.pointOfView(
          { lat: displayPlaces[0].lat, lng: displayPlaces[0].lng, altitude: 2.2 },
          2000
        );
      }, 50);
    }
  }, [selectedPlace, displayPlaces, isAnimating]);

  return <div ref={containerRef} className="w-full h-full" />;
};
