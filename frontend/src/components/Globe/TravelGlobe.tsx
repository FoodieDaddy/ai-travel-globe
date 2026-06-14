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
    return Array.from({ length: 300 }).map(() => ({
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
      .atmosphereColor('#0ea5e9') // Sky blue, lighter edge
      .atmosphereAltitude(0.2)
      .pointsData(allPoints)
      .pointLat('lat')
      .pointLng('lng')
      .pointRadius((d: any) => d.isBg ? d.size : 1.2)
      .pointAltitude((d: any) => d.isBg ? 0.01 : 0.03)
      .pointColor((d: any) => {
        if (d.isBg) return '#1e3a8a';
        if (d.isStart) return '#06b6d4'; // Cyan
        if (d.isEnd) return '#f59e0b';   // Amber/Gold
        return '#38bdf8';                // Light Blue
      })
      .labelsData(displayPlaces) // Floating labels for all active route cities
      .labelLat('lat')
      .labelLng('lng')
      .labelText('name')
      .labelSize(1.5)
      .labelDotRadius(0.5)
      .labelColor(() => 'rgba(255, 255, 255, 0.8)')
      .labelResolution(3)
      .labelAltitude(0.06) // Suspend slightly above point
      .onPointClick((d: any) => {
        if (!d.isBg && onPlaceClick) onPlaceClick(d as City);
      })
      .arcsData(displayArcs)
      .arcStartLat('startLat')
      .arcStartLng('startLng')
      .arcEndLat('endLat')
      .arcEndLng('endLng')
      .arcColor(() => ['#0ea5e9', '#6366f1']) // Cyan to Indigo
      .arcAltitudeAutoScale(0.5)
      .arcStroke(1.5) // Slightly thicker
      .arcDashLength(0.6)
      .arcDashGap(1.5)
      .arcDashInitialGap(() => Math.random() * 2)
      .arcDashAnimateTime(2500)
      .htmlElement((d: any) => {
        const el = document.createElement('div');
        el.className = 'w-72 glass-panel rounded-2xl overflow-hidden transition-all duration-500 ease-out pointer-events-auto cursor-pointer group relative scale-in-center bg-[#020612]/60 backdrop-blur-2xl border border-white/10 shadow-2xl';
        el.innerHTML = `
          <div class="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>
          ${d.image ? `<div class="relative h-36 overflow-hidden p-2 pb-0">
            <div class="w-full h-full rounded-xl overflow-hidden relative">
              <div class="absolute inset-0 bg-gradient-to-t from-[#020612] to-transparent z-10"></div>
              <img src="${d.image}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="${d.name}" />
              <div class="absolute top-2 right-2 z-20 px-2 py-0.5 bg-black/40 backdrop-blur-md rounded-full text-[10px] font-medium text-white/80 border border-white/10">
                ${d.country}
              </div>
            </div>
          </div>` : ''}
          <div class="p-5 relative z-20">
            <h3 class="text-white font-medium text-xl mb-2 tracking-wide">${d.name}</h3>
            
            <div class="flex flex-wrap gap-1.5 mb-4">
              ${d.tags ? d.tags.map((t: string) => `<span class="px-2 py-0.5 rounded-full bg-white/10 border border-white/5 text-[10px] text-slate-300 font-medium">${t}</span>`).join('') : ''}
              <span class="px-2 py-0.5 rounded-full bg-sky-500/20 border border-sky-500/20 text-[10px] text-sky-300 font-medium">${d.days} Days</span>
            </div>

            <p class="text-slate-400 text-xs leading-relaxed font-light">
              <span class="text-sky-400 font-medium text-[10px] uppercase block mb-1">AI Recommendation</span>
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
    globeMaterial.color = new THREE.Color(0x060b19); // Very deep navy
    globeMaterial.emissive = new THREE.Color(0x02040a);
    globeMaterial.emissiveIntensity = 0.5;
    globeMaterial.shininess = 0.9; // More reflective

    // Holographic Meshes & Scanners
    const R = globe.getGlobeRadius();
    
    // 1. Subtle Holographic Grid
    const wireframe = new THREE.Mesh(
      new THREE.SphereGeometry(R * 1.002, 36, 18),
      new THREE.MeshBasicMaterial({ color: 0x0ea5e9, wireframe: true, transparent: true, opacity: 0.05 })
    );

    // 2. Multi-axis faint orbital rings
    const ring1 = new THREE.Mesh(
      new THREE.TorusGeometry(R * 1.15, 0.2, 16, 100),
      new THREE.MeshBasicMaterial({ color: 0x6366f1, transparent: true, opacity: 0.15 })
    );
    ring1.rotation.x = Math.PI / 2;

    const ring2 = new THREE.Mesh(
      new THREE.TorusGeometry(R * 1.25, 0.1, 16, 100),
      new THREE.MeshBasicMaterial({ color: 0x0ea5e9, transparent: true, opacity: 0.1 })
    );
    ring2.rotation.y = Math.PI / 4;
    ring2.rotation.x = Math.PI / 8;

    const ring3 = new THREE.Mesh(
      new THREE.TorusGeometry(R * 1.35, 0.05, 16, 100),
      new THREE.MeshBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.1 })
    );
    ring3.rotation.y = -Math.PI / 4;
    ring3.rotation.x = -Math.PI / 8;

    globe.scene().add(wireframe);
    globe.scene().add(ring1);
    globe.scene().add(ring2);
    globe.scene().add(ring3);

    (function rotateHolo() {
      ring1.rotation.z += 0.002;
      ring2.rotation.z -= 0.001;
      ring3.rotation.z += 0.0015;
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
    globeRef.current.labelsData(displayPlaces);
  }, [allPoints, displayArcs, displayPlaces]);

  useEffect(() => {
    if (!globeRef.current) return;
    
    // HTML Card for selected place
    globeRef.current.htmlElementsData(selectedPlace ? [selectedPlace] : []);
    
    // Pulse rings for ALL places
    const ringData = selectedPlace ? [selectedPlace] : displayPlaces;

    globeRef.current.ringsData(ringData)
      .ringLat('lat')
      .ringLng('lng')
      .ringColor((d: any) => (t: number) => {
        if (d === selectedPlace) return `rgba(14, 165, 233, ${1-Math.sqrt(t)})`; // Bright cyan for selected
        return `rgba(56, 189, 248, ${0.4 - Math.sqrt(t)*0.4})`; // Light cyan
      })
      .ringMaxRadius((d: any) => d === selectedPlace ? 12 : 6)
      .ringPropagationSpeed(3)
      .ringRepeatPeriod((d: any) => d === selectedPlace ? 800 : 1200);

    // Camera movement
    if (isAnimating && displayPlaces.length > 0) {
      const latestPlace = displayPlaces[displayPlaces.length - 1];
      globeRef.current.pointOfView(
        { lat: latestPlace.lat, lng: latestPlace.lng, altitude: 2.0 },
        800 
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
