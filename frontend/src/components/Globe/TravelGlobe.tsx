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
  appPhase?: 'landing' | 'planning' | 'generating' | 'result';
  currentRenderStep?: number;
}

export const TravelGlobe: React.FC<Props> = ({ 
  places, 
  arcs, 
  selectedPlace, 
  hoveredRoutePlaces = [],
  hoveredRouteArcs = [],
  onPlaceClick,
  isAnimating = false,
  appPhase = 'planning',
  currentRenderStep
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
  
  // Dual arcs for solid track + flying particle
  const baseArcs = hoveredRouteArcs.length > 0 ? hoveredRouteArcs : arcs;
  const displayArcs = useMemo(() => baseArcs.map(a => ({ ...a, isTrack: true })), [baseArcs]);
  const particleArcs = useMemo(() => baseArcs.map(a => ({ ...a, isParticle: true })), [baseArcs]);
  const allArcs = useMemo(() => [...displayArcs, ...particleArcs], [displayArcs, particleArcs]);

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
      .pointRadius((d: any) => d.isBg ? d.size : (d.isStart ? 1.6 : d.isEnd ? 1.8 : 1.2))
      .pointAltitude((d: any) => d.isBg ? 0.01 : 0.03)
      .pointColor((d: any) => {
        if (d.isBg) return '#1e3a8a';
        if (d.isStart) return '#00f6ff'; // Electric Cyan
        if (d.isEnd) return '#ffaa00';   // Bright Gold
        return '#38bdf8';                // Light Blue
      })
      .labelsData(displayPlaces)
      .labelLat('lat')
      .labelLng('lng')
      .labelText('name')
      .labelSize(1.5)
      .labelDotRadius(0.5)
      .labelColor(() => 'rgba(255, 255, 255, 0.8)')
      .labelResolution(3)
      .labelAltitude(0.06)
      .onPointClick((d: any) => {
        if (!d.isBg && onPlaceClick) onPlaceClick(d as City);
      })
      .arcsData(allArcs)
      .arcStartLat('startLat')
      .arcStartLng('startLng')
      .arcEndLat('endLat')
      .arcEndLng('endLng')
      .arcColor((d: any) => {
        const isCompleted = appPhase === 'landing' && currentRenderStep !== undefined && d.demoStep !== undefined && d.demoStep < currentRenderStep;
        if (isCompleted) {
          return ['rgba(14, 165, 233, 0.15)', 'rgba(168, 85, 247, 0.15)'];
        }
        return ['rgba(0, 246, 255, 0.9)', 'rgba(168, 85, 247, 0.9)']; // Brighter cyan to purple
      })
      .arcAltitudeAutoScale(0.3)
      .arcStroke((d: any) => d.isParticle ? 3 : 0.8)
      .arcDashLength((d: any) => d.isParticle ? 0.25 : 1)
      .arcDashGap((d: any) => d.isParticle ? 2 : 0)
      .arcDashInitialGap((d: any) => d.isParticle ? Math.random() * 1 : 0)
      .arcDashAnimateTime((d: any) => d.isParticle ? 1500 : 0)
      .arcCurveResolution(64)
      .ringsData(displayPlaces.filter((p: any) => !p.isBg))
      .ringColor((d: any) => {
        if (d.isStart) return 'rgba(0, 246, 255, 0.8)'; // Electric Cyan
        if (d.isEnd) return 'rgba(255, 170, 0, 0.8)';   // Bright Gold
        return 'rgba(56, 189, 248, 0.6)';                // Light Blue
      })
      .ringMaxRadius(4)
      .ringPropagationSpeed(2)
      .ringRepeatPeriod(1000)
      .htmlElement((d: any) => {
        // Image-Rich Destination Cards
        const el = document.createElement('div');
        const isCurrent = appPhase === 'landing' && currentRenderStep !== undefined && d.demoStep !== undefined && d.demoStep >= currentRenderStep - 1;
        const opacityClass = isCurrent ? 'opacity-100 scale-100' : 'opacity-50 scale-95 hover:opacity-100 hover:scale-100';
        
        el.className = `w-56 glass-panel rounded-2xl overflow-hidden transition-all duration-700 ease-out pointer-events-auto cursor-pointer group relative bg-[#020612]/70 backdrop-blur-2xl border border-white/20 shadow-2xl transform -translate-x-1/2 -translate-y-[120%] ${opacityClass}`;
        
        let tags = "City / Explore";
        let desc = "Explore this beautiful destination.";
        let imgUrl = "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=400&q=80"; // Default travel

        if (d.name === 'Tokyo') {
          tags = "美食 / 夜景 / 科技";
          desc = "霓虹灯下的赛博朋克不眠夜。";
          imgUrl = "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=400&q=80";
        }
        if (d.name === 'Bali') {
          tags = "海岛 / 日落 / 放松";
          desc = "沉醉于印度洋的绝美橘色日落。";
          imgUrl = "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=400&q=80";
        }
        if (d.name === 'Singapore') {
          tags = "花园城市 / 建筑 / 夜游";
          desc = "漫步在超级树下的热带绿洲。";
          imgUrl = "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=400&q=80";
        }
        if (d.name === 'Shanghai') {
          tags = "外滩 / 都市 / 美食";
          desc = "穿梭于历史与未来的繁华魔都。";
          imgUrl = "https://images.unsplash.com/photo-1505820013142-f86a3439c5b2?auto=format&fit=crop&w=400&q=80";
        }

        el.innerHTML = `
          <div class="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none z-10"></div>
          <div class="relative h-32 overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-t from-[#020612] via-[#020612]/50 to-transparent z-10"></div>
            <img src="${imgUrl}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="${d.name}" />
          </div>
          <div class="px-5 pb-5 pt-2 relative z-20 flex flex-col gap-1.5 -mt-8">
            <span class="text-lg font-semibold tracking-wide text-white drop-shadow-md">${d.name}</span>
            <span class="text-xs text-sky-300 font-medium tracking-wider">${tags}</span>
            <span class="text-[11px] text-slate-300 font-light leading-relaxed mt-1">${desc}</span>
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

    // Space Stage Elements
    const R = globe.getGlobeRadius();

    // 1. Sun Light & Lens Flare
    const sunLight = new THREE.DirectionalLight(0xffeedd, 2.0); // Softer warm rim light
    sunLight.position.set(-200, 100, -100);
    globe.scene().add(sunLight);

    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    const grad = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
    // Cinematic lens flare colors: warm gold center to deep purple edge
    grad.addColorStop(0, 'rgba(255, 240, 210, 0.6)');
    grad.addColorStop(0.15, 'rgba(230, 180, 255, 0.2)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);
    const sunSprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(canvas), blending: THREE.AdditiveBlending }));
    sunSprite.scale.set(600, 600, 1);
    sunSprite.position.set(-300, 150, -250);
    globe.scene().add(sunSprite);

    // 2. Moon & Distant Planet
    // Make moon much smaller (25% of current), push to far background right, add transparency
    const moonGeo = new THREE.SphereGeometry(R * 0.04, 32, 32);
    const moonMat = new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.8, transparent: true, opacity: 0.6 });
    const moon = new THREE.Mesh(moonGeo, moonMat);
    moon.position.set(220, -100, -300);
    globe.scene().add(moon);

    // Faint Mars silhouette
    const mars = new THREE.Mesh(new THREE.SphereGeometry(R * 0.02, 16, 16), new THREE.MeshBasicMaterial({ color: 0xcf543f, transparent: true, opacity: 0.2 }));
    mars.position.set(-200, -80, -350);
    globe.scene().add(mars);

    // 3. Space Dust
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(800 * 3);
    for(let i=0; i<dustPos.length; i++) dustPos[i] = (Math.random() - 0.5) * 800;
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    const dust = new THREE.Points(dustGeo, new THREE.PointsMaterial({ color: 0x88ccff, size: 0.8, transparent: true, opacity: 0.4 }));
    globe.scene().add(dust);

    // 4. Background Ambient Halo
    const haloCtx = document.createElement('canvas').getContext('2d')!;
    haloCtx.canvas.width = 512; haloCtx.canvas.height = 512;
    const haloGrad = haloCtx.createRadialGradient(256, 256, 0, 256, 256, 256);
    haloGrad.addColorStop(0, 'rgba(60, 40, 120, 0.3)');
    haloGrad.addColorStop(0.5, 'rgba(20, 50, 100, 0.1)');
    haloGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    haloCtx.fillStyle = haloGrad;
    haloCtx.fillRect(0, 0, 512, 512);
    const haloSprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(haloCtx.canvas), blending: THREE.AdditiveBlending }));
    haloSprite.scale.set(R*4, R*4, 1);
    haloSprite.position.set(0, 0, -R*1.5);
    globe.scene().add(haloSprite);
    
    // 5. Subtle Holographic Grid & Rings
    const wireframe = new THREE.Mesh(
      new THREE.SphereGeometry(R * 1.002, 36, 18),
      new THREE.MeshBasicMaterial({ color: 0x0ea5e9, wireframe: true, transparent: true, opacity: 0.05 })
    );

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

    globe.scene().add(wireframe);
    globe.scene().add(ring1);
    globe.scene().add(ring2);

    (function rotateHolo() {
      ring1.rotation.z += 0.002;
      ring2.rotation.z -= 0.001;
      moon.rotation.y += 0.001; // subtle moon spin
      dust.rotation.y += 0.0002; // slow dust drift
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
  }, []); // Run once on mount

  useEffect(() => {
    if (!globeRef.current) return;
    const controls = globeRef.current.controls();
    controls.autoRotateSpeed = 0.5;
  }, []);

  // Update Dynamic Data Layer
  useEffect(() => {
    if (!globeRef.current) return;
    globeRef.current.pointsData(allPoints);
    globeRef.current.arcsData(allArcs);
    
    // Only show simple labels in result phase or during generation
    if (appPhase === 'result' || appPhase === 'generating') {
      globeRef.current.labelsData(displayPlaces);
    } else {
      globeRef.current.labelsData([]);
    }
  }, [allPoints, allArcs, displayPlaces, appPhase]);

  // Update Interactive/HTML Layer
  useEffect(() => {
    if (!globeRef.current) return;
    
    // HTML Card for selected place
    let htmlData = selectedPlace ? [selectedPlace] : [];

    // Add floating cards for demo based on render step
    if (appPhase === 'landing' && currentRenderStep !== undefined) {
      const demoCards = displayPlaces.filter(p => p.demoStep !== undefined && p.demoStep <= currentRenderStep);
      htmlData = [...htmlData, ...demoCards];
    }

    globeRef.current.htmlElementsData(htmlData);
    
    // Pulse rings
    let ringData: any[] = selectedPlace ? [selectedPlace] : displayPlaces;

    // Add a massive scanning ring if generating
    if (appPhase === 'generating') {
      ringData = [{
        lat: 35.6895, // Tokyo as center for scanning
        lng: 139.6917,
        isScanner: true
      }];
    }

    globeRef.current.ringsData(ringData)
      .ringLat('lat')
      .ringLng('lng')
      .ringColor((d: any) => {
        if (d.isScanner) return (t: number) => `rgba(168, 85, 247, ${1 - t})`; // Purple scanner
        if (d === selectedPlace) return (t: number) => `rgba(14, 165, 233, ${1 - Math.sqrt(t)})`;
        return (t: number) => `rgba(56, 189, 248, ${0.4 - Math.sqrt(t) * 0.4})`;
      })
      .ringMaxRadius((d: any) => d.isScanner ? 180 : 5)
      .ringPropagationSpeed((d: any) => d.isScanner ? 5 : 2)
      .ringRepeatPeriod((d: any) => d.isScanner ? 800 : 1000);

    // Camera movement
    if (isAnimating && displayPlaces.length > 0) {
      const latestPlace = displayPlaces[displayPlaces.length - 1];
      globeRef.current.pointOfView({
        lat: latestPlace.lat - 10,
        lng: latestPlace.lng,
        altitude: 1.8
      }, 1000);
    } else if (selectedPlace) {
      globeRef.current.pointOfView({
        lat: selectedPlace.lat - 5,
        lng: selectedPlace.lng,
        altitude: 1.2
      }, 1000);
    }
  }, [displayPlaces, selectedPlace, appPhase, currentRenderStep, isAnimating]);

  return <div ref={containerRef} className="w-full h-full" />;
};
