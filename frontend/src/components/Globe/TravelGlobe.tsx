import React, { useEffect, useRef, useMemo, useState } from 'react';
import Globe from 'globe.gl';
import * as THREE from 'three';
import { Place } from '../../types/travel';
import countriesData from '../../data/countries.json';

interface Props {
  places: Place[]; 
  selectedPlace: Place | null;
  onPlaceClick: (place: Place) => void;
  revealedVisitedIds: string[];
  revealedLines: any[];
}

// -------------------------------------------------------------
// 射线检测算法：判断一个经纬度坐标是否在多边形内部
// -------------------------------------------------------------
function isPointInPolygon(point: [number, number], polygon: number[][][]): boolean {
  const [x, y] = point;
  let inside = false;
  const ring = polygon[0]; // 外环
  if (!ring) return false;
  
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const xi = ring[i][0], yi = ring[i][1];
    const xj = ring[j][0], yj = ring[j][1];
    const intersect = ((yi > y) !== (yj > y))
        && (x < ((xj - xi) * (y - yi)) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

export const TravelGlobe: React.FC<Props> = ({ 
  places, 
  selectedPlace, 
  onPlaceClick,
  revealedVisitedIds,
  revealedLines
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<any>(null);
  const [globeOpacity, setGlobeOpacity] = useState(0);

  // 1. 开场淡入效果
  useEffect(() => {
    const timer = setTimeout(() => setGlobeOpacity(1), 100);
    return () => clearTimeout(timer);
  }, []);
  const globeData = useMemo(() => {
    const landPositions: number[] = [];
    const landColors: number[] = [];
    const baseSpherePositions: number[] = [];
    const borderPositions: number[] = [];
    
    const R = 100.15; // 陆地点阵稍微高于球体表面
    const R_base = 100.0; // 海洋底座底面
    const R_border = 100.22; // 边缘粒子稍微悬空，带来裸眼3D纵深感
    const features = countriesData.features || [];
    
    // 预计算 bounding box 提升检测速度
    const bboxes = features.map((f: any) => {
      let minLng = 180, maxLng = -180, minLat = 90, maxLat = -90;
      const geom = f.geometry;
      if (!geom) return { minLng, maxLng, minLat, maxLat, geom: null };
      
      const updateBBox = (ring: number[][]) => {
        for (let p of ring) {
          if (p[0] < minLng) minLng = p[0];
          if (p[0] > maxLng) maxLng = p[0];
          if (p[1] < minLat) minLat = p[1];
          if (p[1] > maxLat) maxLat = p[1];
        }
      };
      
      if (geom.type === 'Polygon') {
        updateBBox(geom.coordinates[0]);
      } else if (geom.type === 'MultiPolygon') {
        for (let poly of geom.coordinates) {
          updateBBox(poly[0]);
        }
      }
      return { minLng, maxLng, minLat, maxLat, geom };
    });

    // 1. 斐波那契螺旋点阵生成 (增加至 15,000 采样点使大陆内部更密集、对比更鲜明)
    const numPoints = 15000;
    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    const angleIncrement = 2 * Math.PI * goldenRatio;

    const leftColor = new THREE.Color(0xfed7aa);  // 暖橙色空间光（左侧）
    const rightColor = new THREE.Color(0x38bdf8); // 亮蓝色边缘光（右侧）
    const starColor = new THREE.Color(0xe2e8f0);  // 细密冷白光

    for (let i = 0; i < numPoints; i++) {
      // 竖直轴 Y 在 1 至 -1 之间均匀分布 (Y 轴作为自转的南北极高度轴)
      const t = i / (numPoints - 1);
      const y = 1 - t * 2;
      
      const radiusAtY = Math.sqrt(1 - y * y);
      const angle = angleIncrement * i;
      
      const x = Math.cos(angle) * radiusAtY;
      const z = Math.sin(angle) * radiusAtY;

      // 反算经纬度 lat 和 lng 用于大洲 boundary 检测 (Z 轴正向为本初子午线，X 轴正向为东经 90 度)
      const latRad = Math.asin(y);
      const lat = latRad * 180 / Math.PI;
      const lngRad = Math.atan2(x, z);
      const lng = lngRad * 180 / Math.PI;

      let inside = false;
      for (let box of bboxes) {
        if (!box.geom) continue;
        if (lng >= box.minLng && lng <= box.maxLng && lat >= box.minLat && lat <= box.maxLat) {
          if (box.geom.type === 'Polygon') {
            if (isPointInPolygon([lng, lat], box.geom.coordinates)) {
              inside = true;
              break;
            }
          } else if (box.geom.type === 'MultiPolygon') {
            for (let poly of box.geom.coordinates) {
              if (isPointInPolygon([lng, lat], poly)) {
                inside = true;
                break;
              }
            }
          }
        }
      }

      if (inside) {
        // 大洲陆地点：密度更密、更亮，加入极微量 Jitter 柔化螺旋感
        const jitterLat = (Math.random() - 0.5) * 0.12;
        const jitterLng = (Math.random() - 0.5) * 0.12;
        const finalLat = lat + jitterLat;
        const finalLng = lng + jitterLng;

        // 用 standard 经纬度转 3D 直角坐标公式 (Y 轴为南北极，本初子午线在 Z 轴正向)
        const phi = (90 - finalLat) * Math.PI / 180;
        const theta = (finalLng + 90) * Math.PI / 180;
        const px = R * Math.sin(phi) * Math.sin(theta);
        const py = R * Math.cos(phi);
        const pz = R * Math.sin(phi) * Math.cos(theta);

        landPositions.push(px, py, pz);

        // 顶点色彩线性插值，融合暖橙、亮蓝与冷白光
        const tCol = (px / R + 1) / 2;
        const mixedColor = new THREE.Color().copy(leftColor).lerp(rightColor, tCol);
        mixedColor.lerp(starColor, 0.5); // 增加亮色白光权重使其更亮
        landColors.push(mixedColor.r, mixedColor.g, mixedColor.b);
      } else {
        // 海洋底座点：降低保留概率至 10%，使其显著更暗、更稀疏
        if (Math.random() < 0.10) {
          const px = R_base * x;
          const py = R_base * y;
          const pz = R_base * z;
          baseSpherePositions.push(px, py, pz);
        }
      }
    }

    // 2. 提取并插值大洲边缘海岸线上的粒子点 (更细密、更亮以勾勒大陆地表结构)
    features.forEach((f: any) => {
      const geom = f.geometry;
      if (!geom) return;
      
      const processRing = (ring: number[][]) => {
        for (let i = 0; i < ring.length - 1; i++) {
          const p1 = ring[i];
          const p2 = ring[i + 1];
          const dLng = p2[0] - p1[0];
          const dLat = p2[1] - p1[1];
          const dist = Math.sqrt(dLng * dLng + dLat * dLat);
          
          // 根据地理度数距离进行沿线插值，步长大约 0.85 度
          const steps = Math.max(1, Math.floor(dist / 0.85));
          for (let s = 0; s <= steps; s++) {
            const t = s / steps;
            const lng = p1[0] + dLng * t;
            const lat = p1[1] + dLat * t;
            
            // 用 standard 经纬度转 3D 直角坐标公式 (Y 轴为南北极，本初子午线在 Z 轴正向)
            const phi = (90 - lat) * Math.PI / 180;
            const theta = (lng + 90) * Math.PI / 180;
            
            const px = R_border * Math.sin(phi) * Math.sin(theta);
            const py = R_border * Math.cos(phi);
            const pz = R_border * Math.sin(phi) * Math.cos(theta);
            
            borderPositions.push(px, py, pz);
          }
        }
      };
      
      if (geom.type === 'Polygon') {
        geom.coordinates.forEach((ring: number[][]) => processRing(ring));
      } else if (geom.type === 'MultiPolygon') {
        geom.coordinates.forEach((poly: number[][][]) => {
          poly.forEach((ring: number[][]) => processRing(ring));
        });
      }
    });

    return {
      landPositions: new Float32Array(landPositions),
      landColors: new Float32Array(landColors),
      baseSpherePositions: new Float32Array(baseSpherePositions),
      borderPositions: new Float32Array(borderPositions)
    };
  }, []);

  // 3. 生成 procedure 经纬网格线（极淡）
  const graticules = useMemo(() => {
    const lines: any[] = [];
    // 纬度线（每 30 度）
    for (let lat = -60; lat <= 60; lat += 30) {
      const line = [];
      for (let lng = -180; lng <= 180; lng += 10) {
        line.push([lat, lng]);
      }
      lines.push({ points: line, type: 'graticule', color: 'rgba(224, 231, 255, 0.03)', stroke: 0.08 });
    }
    // 经度线（每 30 度）
    for (let lng = -150; lng <= 180; lng += 30) {
      const line = [];
      for (let lat = -80; lat <= 80; lat += 10) {
        line.push([lat, lng]);
      }
      lines.push({ points: line, type: 'graticule', color: 'rgba(224, 231, 255, 0.03)', stroke: 0.08 });
    }
    return lines;
  }, []);

  // 4. 合并经纬线和动态生长的游历时间线 (增加 HMR 健壮性)
  const pathsData = useMemo(() => {
    const lines = Array.isArray(revealedLines) ? revealedLines : [];
    return [...graticules, ...lines];
  }, [graticules, revealedLines]);

  // 5. 初始化地球并添加点阵网格
  useEffect(() => {
    if (!containerRef.current) return;

    // @ts-ignore
    const globe = Globe()(containerRef.current)
      .showAtmosphere(true)
      .atmosphereColor('#38bdf8') // 柔和青蓝边缘光
      .atmosphereAltitude(0.18)
      .globeImageUrl('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=') // 1x1 透明像素占位，清理默认彩色地球贴图
      
      // 国界轮廓：仅显示极细的冷色描边
      .polygonsData(countriesData.features)
      .polygonAltitude(0.005)
      .polygonCapColor(() => 'rgba(0, 0, 0, 0)')
      .polygonSideColor(() => 'rgba(0, 0, 0, 0)')
      .polygonStrokeColor(() => 'rgba(56, 189, 248, 0.18)') // 提亮轮廓大洲线，保持极细

      // 景点点位展示
      .pointsData(places)
      .pointLat('lat')
      .pointLng('lng')
      .pointRadius((d: any) => {
        const isVisited = (revealedVisitedIds || []).includes(d.id);
        const isSelected = selectedPlace?.id === d.id;
        if (isSelected) return 1.25; // 选中略微变大
        if (isVisited) return 0.75;  // 已打卡点增大
        if (d.plannedDate) return 0.55; 
        return 0.35; // 探索小点
      })
      .pointAltitude(0.008)
      .pointColor((d: any) => {
        const isVisited = (revealedVisitedIds || []).includes(d.id);
        if (isVisited) return '#f59e0b'; // 柔和暖金
        if (d.plannedDate) return '#f97316'; // 计划去橙色
        return 'rgba(70, 90, 120, 0.5)'; // 未去过灰蓝点，略微提亮
      })

      // hover 时只显示未去过的地点名称，已去过地点通过 HTML Badge 展示
      .pointLabel((d: any) => {
        const isVisited = (revealedVisitedIds || []).includes(d.id);
        if (isVisited) return '';
        return `<div class="px-2 py-1 rounded backdrop-blur-md bg-slate-950/90 border border-white/10 text-slate-200 text-[10.5px] font-sans">${d.name} · ${d.country}</div>`;
      })

      // 地图路线和经纬网格渲染 (支持虚线微粒子流动感)
      .pathsData(pathsData)
      .pathPoints(d => d.points)
      .pathPointLat(p => p[0])
      .pathPointLng(p => p[1])
      .pathColor(d => d.color)
      .pathStroke(d => d.stroke)
      .pathDashLength(d => d.dashLength || 0)
      .pathDashGap(d => d.dashGap || 0)
      .pathDashAnimateTime(d => d.dashAnimateTime || 0)

      // 标签关闭，改由 HTML overlay 展示
      .labelsData([])

      // 脉冲波纹（仅在点亮地点或选中地点处扩散，显示柔和 pulse 光圈）
      .ringsData(places.filter(p => (revealedVisitedIds || []).includes(p.id) || selectedPlace?.id === p.id))
      .ringLat('lat')
      .ringLng('lng')
      .ringColor((d: any) => {
        const isVisited = (revealedVisitedIds || []).includes(d.id);
        if (isVisited) {
          return (t: number) => `rgba(245, 158, 11, ${0.45 - Math.sqrt(t) * 0.45})`; // 柔和暖金
        }
        return (t: number) => `rgba(56, 189, 248, ${0.45 - Math.sqrt(t) * 0.45})`; // 柔和青蓝
      })
      .ringMaxRadius(3.0) // 增大到 3.0
      .ringPropagationSpeed(0.18)
      .ringRepeatPeriod(2600);

    // 6. 三维大洲渐变点阵大陆网格生成叠加 (高密度)
    const pointsGeometry = new THREE.BufferGeometry();
    pointsGeometry.setAttribute('position', new THREE.BufferAttribute(globeData.landPositions, 3));
    pointsGeometry.setAttribute('color', new THREE.BufferAttribute(globeData.landColors, 3));
    const pointsMaterial = new THREE.PointsMaterial({
      size: 0.85, // 细密小点微调大
      transparent: true,
      opacity: 0.48, // 亮度提亮
      vertexColors: true,
      sizeAttenuation: true
    });
    const pointsMesh = new THREE.Points(pointsGeometry, pointsMaterial);
    globe.scene().add(pointsMesh);

    // 7. 三维海洋低底网格生成叠加 (低密度底座，勾勒球形)
    const baseGeometry = new THREE.BufferGeometry();
    baseGeometry.setAttribute('position', new THREE.BufferAttribute(globeData.baseSpherePositions, 3));
    const baseMaterial = new THREE.PointsMaterial({
      color: 0x2e4057, // 灰蓝微尘
      size: 0.45,
      transparent: true,
      opacity: 0.10, // 略微降低海洋微尘亮度
      sizeAttenuation: true
    });
    const baseMesh = new THREE.Points(baseGeometry, baseMaterial);
    globe.scene().add(baseMesh);

    // 7.5. 大洲边缘轮廓线粒子点阵生成叠加 (高可见度描边，更细、更亮)
    const borderGeometry = new THREE.BufferGeometry();
    borderGeometry.setAttribute('position', new THREE.BufferAttribute(globeData.borderPositions, 3));
    const borderMaterial = new THREE.PointsMaterial({
      color: 0xa5f3fc, // 极亮青白小星光
      size: 0.55,      // 更细
      transparent: true,
      opacity: 0.75,   // 极亮
      sizeAttenuation: true
    });
    const borderMesh = new THREE.Points(borderGeometry, borderMaterial);
    globe.scene().add(borderMesh);

    // 8. 地球底座材质 (深色透明球体底)
    const globeMaterial = globe.globeMaterial();
    globeMaterial.color = new THREE.Color(0x020512); // 深蓝黑
    globeMaterial.transparent = true;
    globeMaterial.opacity = 0.9;
    globeMaterial.roughness = 0.95;
    if (globeMaterial.map) {
      globeMaterial.map = null;
      globeMaterial.needsUpdate = true;
    }

    // 9. 柔和空间光源设计
    // 左侧弱橙色辅助空间光
    const orangeLight = new THREE.DirectionalLight(0xff5500, 1.8);
    orangeLight.position.set(-250, 60, 50);
    globe.scene().add(orangeLight);

    // 右侧青蓝边缘光源
    const cyanLight = new THREE.DirectionalLight(0x0ea5e9, 2.5);
    cyanLight.position.set(250, 60, 50);
    globe.scene().add(cyanLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    globe.scene().add(ambientLight);

    globe.onPointClick((d: any) => {
      onPlaceClick(d as Place);
    });

    globe.controls().autoRotate = true;
    globe.controls().autoRotateSpeed = 0.28; // 轻微自转
    globe.controls().enableZoom = true;
    
    // 初始展示东亚及太平洋板块，球体完整显示且大小适中
    globe.pointOfView({ lat: 26, lng: 125, altitude: 1.75 }, 0);
    
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
  }, [globeData]); // 仅点阵生成一次后缓存，地球初始化一次

  // 10. 动态同步状态数据
  useEffect(() => {
    if (!globeRef.current) return;
    globeRef.current.pointsData(places);
    globeRef.current.pathsData(pathsData);
    globeRef.current.ringsData(places.filter(p => (revealedVisitedIds || []).includes(p.id) || selectedPlace?.id === p.id));
  }, [places, pathsData, revealedVisitedIds, selectedPlace]);

  // 11. 浮动在点位旁边的小缩略图与标签指示
  useEffect(() => {
    if (!globeRef.current) return;

    // 只给已点亮的地点，或有照片的，以及当前选中的地点渲染缩略图
    const htmlData = places.filter(p => 
      ((revealedVisitedIds || []).includes(p.id) && p.userPhotos && p.userPhotos.length > 0) || 
      selectedPlace?.id === p.id
    );
    
    globeRef.current.htmlElementsData(htmlData);
    globeRef.current.htmlElement((d: any) => {
      const el = document.createElement('div');
      const isSelected = selectedPlace?.id === d.id;
      const isVisited = (revealedVisitedIds || []).includes(d.id);
      const hasPhoto = d.userPhotos && d.userPhotos.length > 0;
      
      el.className = `flex flex-col items-center justify-center transition-all duration-500 pointer-events-none ${
        isSelected ? 'opacity-100 scale-105 z-50' : 'opacity-75 scale-90 z-10'
      }`;
      
      let badgeHtml = '';
      if (isVisited && hasPhoto) {
        badgeHtml = `
          <div class="w-8 h-8 rounded-full border-2 border-amber-400/60 overflow-hidden shadow-[0_0_12px_rgba(245,158,11,0.4)] relative cursor-pointer pointer-events-auto transition-transform duration-300 hover:scale-110">
             <img src="${d.userPhotos[0]}" class="w-full h-full object-cover" />
             ${isSelected ? `<div class="absolute inset-0 border-2 border-amber-400 rounded-full animate-pulse"></div>` : ''}
          </div>
        `;
      } else if (isSelected) {
        badgeHtml = `
          <div class="w-3.5 h-3.5 rounded-full bg-amber-400 border border-white/80 shadow-[0_0_8px_rgba(245,158,11,0.6)] animate-ping"></div>
        `;
      }

      el.innerHTML = `
        <div class="flex flex-col items-center gap-1 group relative">
          ${badgeHtml}
          ${isSelected ? `
            <div class="px-2 py-0.5 rounded backdrop-blur-md bg-slate-950/90 border border-amber-400/40 shadow-[0_4px_12px_rgba(0,0,0,0.6)] mt-0.5">
              <span class="text-[10px] font-bold text-amber-400 tracking-wide">${d.name}</span>
            </div>
          ` : ''}
        </div>
      `;

      el.onmousedown = (e) => e.stopPropagation();
      el.onclick = (e) => {
        e.stopPropagation();
        onPlaceClick(d as Place);
      };

      return el;
    });
  }, [places, selectedPlace, revealedVisitedIds]);

  // 12. 点击某个地点时，地球视角流畅飞越对焦
  useEffect(() => {
    if (!globeRef.current) return;
    const controls = globeRef.current.controls();

    if (selectedPlace) {
      controls.autoRotateSpeed = 0.05; // 慢转
      globeRef.current.pointOfView({
        lat: selectedPlace.lat,
        lng: selectedPlace.lng,
        altitude: 1.25 // 精致聚焦且保持球体不被裁切
      }, 950);
    } else {
      controls.autoRotateSpeed = 0.28; // 恢复常规旋转
    }
  }, [selectedPlace]);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full" 
      style={{ 
        opacity: globeOpacity, 
        transition: 'opacity 2.2s ease-in-out' 
      }} 
    />
  );
};
