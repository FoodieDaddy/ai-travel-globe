import React, { useEffect, useRef, useMemo, useState } from 'react';
import Globe from 'globe.gl';
import * as THREE from 'three';
import { ChinaPlace } from '../../types/china';
import countriesData from '../../data/countries.json';

interface Props {
  places: ChinaPlace[];
  selectedPlace: ChinaPlace | null;
  onPlaceClick: (place: ChinaPlace) => void;
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

export const ChinaMemoryScene: React.FC<Props> = ({
  places,
  selectedPlace,
  onPlaceClick,
  revealedVisitedIds,
  revealedLines
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<any>(null);
  const [globeOpacity, setGlobeOpacity] = useState(0);

  // 1. 开场渐显效果
  useEffect(() => {
    const timer = setTimeout(() => setGlobeOpacity(1), 100);
    return () => clearTimeout(timer);
  }, []);

  // 2. 生成中国聚焦的 3D 星尘点阵
  const globeData = useMemo(() => {
    const chinaLandPositions: number[] = [];
    const chinaColors: number[] = [];
    const foreignLandPositions: number[] = [];
    const baseSpherePositions: number[] = [];
    const chinaBorderPositions: number[] = [];

    const R = 100.15; // 大陆高度
    const R_base = 100.0; // 海洋高度
    const R_border = 100.22; // 中国边界悬空高度

    const features = countriesData.features || [];
    
    // A. 提取中国 Feature
    const chinaFeature = features.find((f: any) => 
      f.properties && (f.properties.ISO_A3 === 'CHN' || f.properties.NAME === 'China')
    );

    // B. 预计算所有国家的 bounding boxes
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

    // C. 计算中国的专属 bounding box
    let chinaBBox = { minLng: 180, maxLng: -180, minLat: 90, maxLat: -90, geom: null as any };
    if (chinaFeature && chinaFeature.geometry) {
      chinaBBox.geom = chinaFeature.geometry;
      const updateBBox = (ring: number[][]) => {
        for (let p of ring) {
          if (p[0] < chinaBBox.minLng) chinaBBox.minLng = p[0];
          if (p[0] > chinaBBox.maxLng) chinaBBox.maxLng = p[0];
          if (p[1] < chinaBBox.minLat) chinaBBox.minLat = p[1];
          if (p[1] > chinaBBox.maxLat) chinaBBox.maxLat = p[1];
        }
      };
      if (chinaBBox.geom.type === 'Polygon') {
        updateBBox(chinaBBox.geom.coordinates[0]);
      } else if (chinaBBox.geom.type === 'MultiPolygon') {
        for (let poly of chinaBBox.geom.coordinates) {
          updateBBox(poly[0]);
        }
      }
    }

    const isPointInChina = (lng: number, lat: number): boolean => {
      if (!chinaBBox.geom) return false;
      if (lng < chinaBBox.minLng || lng > chinaBBox.maxLng || lat < chinaBBox.minLat || lat > chinaBBox.maxLat) {
        return false;
      }
      if (chinaBBox.geom.type === 'Polygon') {
        return isPointInPolygon([lng, lat], chinaBBox.geom.coordinates);
      } else if (chinaBBox.geom.type === 'MultiPolygon') {
        for (let poly of chinaBBox.geom.coordinates) {
          if (isPointInPolygon([lng, lat], poly)) {
            return true;
          }
        }
      }
      return false;
    };

    // D. 斐波那契均匀螺旋采样 (采样 15,000 个点以保证高分辨率)
    const numPoints = 15000;
    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    const angleIncrement = 2 * Math.PI * goldenRatio;

    const leftColor = new THREE.Color(0xfed7aa);  // 暖橙色（中国版左翼空间光）
    const rightColor = new THREE.Color(0x38bdf8); // 亮蓝色（中国版右翼边缘光）
    const starColor = new THREE.Color(0xe2e8f0);  // 细密冷白银光

    for (let i = 0; i < numPoints; i++) {
      const t = i / (numPoints - 1);
      const y = 1 - t * 2; // Y 轴作为高度轴
      
      const radiusAtY = Math.sqrt(1 - y * y);
      const angle = angleIncrement * i;
      
      const x = Math.cos(angle) * radiusAtY;
      const z = Math.sin(angle) * radiusAtY;

      // 映射为经纬度用于区域判定
      const latRad = Math.asin(y);
      const lat = latRad * 180 / Math.PI;
      const lngRad = Math.atan2(x, z);
      const lng = lngRad * 180 / Math.PI;

      // 判定是否在陆地里
      let isLand = false;
      for (let box of bboxes) {
        if (!box.geom) continue;
        if (lng >= box.minLng && lng <= box.maxLng && lat >= box.minLat && lat <= box.maxLat) {
          if (box.geom.type === 'Polygon') {
            if (isPointInPolygon([lng, lat], box.geom.coordinates)) {
              isLand = true;
              break;
            }
          } else if (box.geom.type === 'MultiPolygon') {
            for (let poly of box.geom.coordinates) {
              if (isPointInPolygon([lng, lat], poly)) {
                isLand = true;
                break;
              }
            }
          }
        }
      }

      if (isLand) {
        // 进一步判定是否在中国境内
        const inChina = isPointInChina(lng, lat);
        
        if (inChina) {
          // 中国高亮陆地：加入极微量抖动柔化线条，呈现华丽冷暖星沙
          const jitterLat = (Math.random() - 0.5) * 0.12;
          const jitterLng = (Math.random() - 0.5) * 0.12;
          const finalLat = lat + jitterLat;
          const finalLng = lng + jitterLng;

          const phi = (90 - finalLat) * Math.PI / 180;
          const theta = (finalLng + 90) * Math.PI / 180;
          const px = R * Math.sin(phi) * Math.sin(theta);
          const py = R * Math.cos(phi);
          const pz = R * Math.sin(phi) * Math.cos(theta);

          chinaLandPositions.push(px, py, pz);

          // 渐变着色，高比例的冷白混色保证极亮质感
          const tCol = (px / R + 1) / 2;
          const mixedColor = new THREE.Color().copy(leftColor).lerp(rightColor, tCol);
          mixedColor.lerp(starColor, 0.55);
          chinaColors.push(mixedColor.r, mixedColor.g, mixedColor.b);
        } else {
          // 国外陆地：以 12% 概率极稀疏加入，设为极度淡化的灰蓝色以弱化显示
          if (Math.random() < 0.12) {
            const phi = (90 - lat) * Math.PI / 180;
            const theta = (lng + 90) * Math.PI / 180;
            const px = R * Math.sin(phi) * Math.sin(theta);
            const py = R * Math.cos(phi);
            const pz = R * Math.sin(phi) * Math.cos(theta);
            foreignLandPositions.push(px, py, pz);
          }
        }
      } else {
        // 海洋底座点：以 8% 概率极淡渲染，仅用于若隐若现渲染球体外轮廓
        if (Math.random() < 0.08) {
          const px = R_base * x;
          const py = R_base * y;
          const pz = R_base * z;
          baseSpherePositions.push(px, py, pz);
        }
      }
    }

    // E. 仅针对“中国疆界轮廓”进行高频沿线粒子点插值 (更亮更细的雄鸡轮廓)
    if (chinaFeature && chinaFeature.geometry) {
      const geom = chinaFeature.geometry;
      
      const processRing = (ring: number[][]) => {
        for (let i = 0; i < ring.length - 1; i++) {
          const p1 = ring[i];
          const p2 = ring[i + 1];
          const dLng = p2[0] - p1[0];
          const dLat = p2[1] - p1[1];
          const dist = Math.sqrt(dLng * dLng + dLat * dLat);
          
          // 密集插值，步长大约 0.6 度，形成高精度的中国海岸/国界边框
          const steps = Math.max(1, Math.floor(dist / 0.6));
          for (let s = 0; s <= steps; s++) {
            const t = s / steps;
            const lng = p1[0] + dLng * t;
            const lat = p1[1] + dLat * t;
            
            const phi = (90 - lat) * Math.PI / 180;
            const theta = (lng + 90) * Math.PI / 180;
            
            const px = R_border * Math.sin(phi) * Math.sin(theta);
            const py = R_border * Math.cos(phi);
            const pz = R_border * Math.sin(phi) * Math.cos(theta);
            
            chinaBorderPositions.push(px, py, pz);
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
    }

    return {
      chinaLandPositions: new Float32Array(chinaLandPositions),
      chinaColors: new Float32Array(chinaColors),
      foreignLandPositions: new Float32Array(foreignLandPositions),
      baseSpherePositions: new Float32Array(baseSpherePositions),
      chinaBorderPositions: new Float32Array(chinaBorderPositions)
    };
  }, []);

  // 3. 极淡的经纬度线（仅为地球结构提供参考）
  const graticules = useMemo(() => {
    const lines: any[] = [];
    for (let lat = -60; lat <= 60; lat += 30) {
      const line = [];
      for (let lng = -180; lng <= 180; lng += 10) line.push([lat, lng]);
      lines.push({ points: line, color: 'rgba(224, 231, 255, 0.02)', stroke: 0.08 });
    }
    for (let lng = -150; lng <= 180; lng += 30) {
      const line = [];
      for (let lat = -80; lat <= 80; lat += 10) line.push([lat, lng]);
      lines.push({ points: line, color: 'rgba(224, 231, 255, 0.02)', stroke: 0.08 });
    }
    return lines;
  }, []);

  const pathsData = useMemo(() => {
    const lines = Array.isArray(revealedLines) ? revealedLines : [];
    return [...graticules, ...lines];
  }, [graticules, revealedLines]);

  // 4. 地球初始化及 scene 图层叠加
  useEffect(() => {
    if (!containerRef.current) return;

    // 过滤出国界数据，用于极淡地表投影
    // 仅显示中国边界描边，国外全透明隐藏，以此突出“中国记忆星球”主题
    const geoData = countriesData.features.map((f: any) => {
      const isChina = f.properties && (f.properties.ISO_A3 === 'CHN' || f.properties.NAME === 'China');
      return {
        ...f,
        properties: {
          ...f.properties,
          __isChina: isChina
        }
      };
    });

    // @ts-ignore
    const globe = Globe()(containerRef.current)
      .showAtmosphere(true)
      .atmosphereColor('#38bdf8') // 亮眼蓝边缘 Fresnel
      .atmosphereAltitude(0.18)
      .globeImageUrl('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=')
      
      .polygonsData(geoData)
      .polygonAltitude(0.005)
      .polygonCapColor(() => 'rgba(0, 0, 0, 0)')
      .polygonSideColor(() => 'rgba(0, 0, 0, 0)')
      .polygonStrokeColor((d: any) => 
        d.properties.__isChina ? 'rgba(56, 189, 248, 0.35)' : 'rgba(255, 255, 255, 0.01)'
      )

      // 城市点位
      .pointsData(places)
      .pointLat('lat')
      .pointLng('lng')
      .pointRadius((d: any) => {
        const isVisited = (revealedVisitedIds || []).includes(d.id);
        const isSelected = selectedPlace?.id === d.id;
        if (isSelected) return 1.35;
        if (isVisited) return 0.85;
        return 0.35;
      })
      .pointAltitude(0.01)
      .pointColor((d: any) => {
        const isVisited = (revealedVisitedIds || []).includes(d.id);
        if (isVisited) return '#f59e0b'; // 已去过暖金
        return 'rgba(70, 90, 120, 0.5)'; // 计划中/未去过灰蓝
      })
      .pointLabel((d: any) => {
        const isVisited = (revealedVisitedIds || []).includes(d.id);
        if (isVisited) return '';
        return `<div class="px-2 py-1 rounded backdrop-blur-md bg-slate-950/90 border border-white/10 text-slate-200 text-[10px] font-sans">${d.name} · ${d.province}</div>`;
      })

      // 虚线飞路
      .pathsData(pathsData)
      .pathPoints(d => d.points)
      .pathPointLat(p => p[0])
      .pathPointLng(p => p[1])
      .pathColor(d => d.color)
      .pathStroke(d => d.stroke)
      .pathDashLength(d => d.dashLength || 0)
      .pathDashGap(d => d.dashGap || 0)
      .pathDashAnimateTime(d => d.dashAnimateTime || 0)

      .labelsData([])

      // 脉冲波纹 (选中和已访问都有)
      .ringsData(places.filter(p => (revealedVisitedIds || []).includes(p.id) || selectedPlace?.id === p.id))
      .ringLat('lat')
      .ringLng('lng')
      .ringColor((d: any) => {
        const isVisited = (revealedVisitedIds || []).includes(d.id);
        if (isVisited) {
          return (t: number) => `rgba(245, 158, 11, ${0.45 - Math.sqrt(t) * 0.45})`; // 暖金
        }
        return (t: number) => `rgba(56, 189, 248, ${0.45 - Math.sqrt(t) * 0.45})`; // 柔和青蓝
      })
      .ringMaxRadius(3.0)
      .ringPropagationSpeed(0.18)
      .ringRepeatPeriod(2600);

    // F. 三层 custom 点阵网格叠加

    // 1) 中国高亮星沙大陆
    const chinaGeom = new THREE.BufferGeometry();
    chinaGeom.setAttribute('position', new THREE.BufferAttribute(globeData.chinaLandPositions, 3));
    chinaGeom.setAttribute('color', new THREE.BufferAttribute(globeData.chinaColors, 3));
    const chinaMat = new THREE.PointsMaterial({
      size: 0.85,
      transparent: true,
      opacity: 0.52,
      vertexColors: true,
      sizeAttenuation: true
    });
    const chinaMesh = new THREE.Points(chinaGeom, chinaMat);
    globe.scene().add(chinaMesh);

    // 2) 国外极弱化背景大陆
    const foreignGeom = new THREE.BufferGeometry();
    foreignGeom.setAttribute('position', new THREE.BufferAttribute(globeData.foreignLandPositions, 3));
    const foreignMat = new THREE.PointsMaterial({
      color: 0x1e293b, // 暗灰蓝
      size: 0.35,      // 极细
      transparent: true,
      opacity: 0.08,   // 几乎完全暗淡
      sizeAttenuation: true
    });
    const foreignMesh = new THREE.Points(foreignGeom, foreignMat);
    globe.scene().add(foreignMesh);

    // 3) 海洋稀疏微尘底座
    const oceanGeom = new THREE.BufferGeometry();
    oceanGeom.setAttribute('position', new THREE.BufferAttribute(globeData.baseSpherePositions, 3));
    const oceanMat = new THREE.PointsMaterial({
      color: 0x0f172a, // 极暗海洋色
      size: 0.3,
      transparent: true,
      opacity: 0.06,
      sizeAttenuation: true
    });
    const oceanMesh = new THREE.Points(oceanGeom, oceanMat);
    globe.scene().add(oceanMesh);

    // 4) 中国专属疆界发光粒子边框 (悬空 3D Coastline)
    const borderGeom = new THREE.BufferGeometry();
    borderGeom.setAttribute('position', new THREE.BufferAttribute(globeData.chinaBorderPositions, 3));
    const borderMat = new THREE.PointsMaterial({
      color: 0xa5f3fc, // 亮蓝白
      size: 0.55,
      transparent: true,
      opacity: 0.80,   // 高对比亮度
      sizeAttenuation: true
    });
    const borderMesh = new THREE.Points(borderGeom, borderMat);
    globe.scene().add(borderMesh);

    // G. 球体表面半透明底色
    const globeMaterial = globe.globeMaterial();
    globeMaterial.color = new THREE.Color(0x020512); // 深墨蓝黑
    globeMaterial.transparent = true;
    globeMaterial.opacity = 0.93;
    globeMaterial.roughness = 0.95;
    if (globeMaterial.map) {
      globeMaterial.map = null;
      globeMaterial.needsUpdate = true;
    }

    // H. 双光源渲染，冷暖辉映
    const orangeLight = new THREE.DirectionalLight(0xff4500, 2.0); // 加强暖色光源
    orangeLight.position.set(-250, 80, 50);
    globe.scene().add(orangeLight);

    const cyanLight = new THREE.DirectionalLight(0x00d2ff, 2.5); // 加强冷蓝边缘光
    cyanLight.position.set(250, 80, 50);
    globe.scene().add(cyanLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.45);
    globe.scene().add(ambientLight);

    // I. 交互和视角配置
    globe.onPointClick((d: any) => {
      onPlaceClick(d as ChinaPlace);
    });

    globe.controls().autoRotate = false; // 初始聚焦不自转以突出图卷展开感
    globe.controls().enableZoom = true;
    // 限制镜头深度，保留裸眼 3D
    globe.controls().minDistance = 140;
    globe.controls().maxDistance = 240;

    // 初始展示东亚及太平洋板块，球体聚焦于中国上方 (lat: 33, lng: 104) 且高度适中
    globe.pointOfView({ lat: 33, lng: 104, altitude: 1.15 }, 0);

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
  }, [globeData]);

  // 5. 同步数据属性变化
  useEffect(() => {
    if (!globeRef.current) return;
    globeRef.current.pointsData(places);
    globeRef.current.pathsData(pathsData);
    globeRef.current.ringsData(places.filter(p => (revealedVisitedIds || []).includes(p.id) || selectedPlace?.id === p.id));
  }, [places, pathsData, revealedVisitedIds, selectedPlace]);

  // 6. 浮动在点位旁边的小缩略图与指示
  useEffect(() => {
    if (!globeRef.current) return;

    // 渲染有照片的，以及当前选中的地点
    const htmlData = places.filter(p =>
      ((revealedVisitedIds || []).includes(p.id) && p.photos && p.photos.length > 0) ||
      selectedPlace?.id === p.id
    );

    globeRef.current.htmlElementsData(htmlData);
    globeRef.current.htmlElement((d: any) => {
      const el = document.createElement('div');
      const isSelected = selectedPlace?.id === d.id;
      const isVisited = (revealedVisitedIds || []).includes(d.id);
      const hasPhoto = d.photos && d.photos.length > 0;

      el.className = `flex flex-col items-center justify-center transition-all duration-500 pointer-events-none ${
        isSelected ? 'opacity-100 scale-105 z-50' : 'opacity-75 scale-90 z-10'
      }`;

      let badgeHtml = '';
      if (isSelected) {
        // 当前选中的城市：在上方展示一个精致的照片日记浮动卡，带一根淡金细连接线
        const photoUrl = hasPhoto ? d.photos[0] : "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=80&q=80";
        const noteExcerpt = d.note ? (d.note.length > 18 ? d.note.substring(0, 18) + '...' : d.note) : (isVisited ? "记录我的旅行日记" : "探索新目的地");
        
        badgeHtml = `
          <div class="flex flex-col items-center pointer-events-auto select-none">
            <!-- 悬浮小照片卡 -->
            <div class="mb-1.5 backdrop-blur-xl bg-slate-950/85 border border-amber-400/45 rounded-xl p-2 flex items-center gap-2.5 shadow-[0_12px_36px_rgba(0,0,0,0.8)] w-44 hover:scale-[1.02] transition-transform duration-300">
              <div class="w-11 h-11 rounded-lg overflow-hidden shrink-0 border border-white/10 bg-slate-900">
                <img src="${photoUrl}" class="w-full h-full object-cover" />
              </div>
              <div class="flex flex-col gap-0.5 min-w-0 text-left">
                <span class="text-[11px] font-black text-white truncate">${d.name}</span>
                <span class="text-[8px] text-white/50 font-mono tracking-wider">${d.visitedAt || d.season || (isVisited ? '已点亮' : '计划中')}</span>
                <span class="text-[8.5px] text-amber-400/90 truncate font-light leading-relaxed italic">"${noteExcerpt}"</span>
              </div>
            </div>
            <!-- 细连接线 -->
            <div class="w-[1px] h-3 bg-gradient-to-b from-amber-400/50 to-transparent"></div>
            <!-- 点位头像 -->
            <div class="w-8 h-8 rounded-full border-2 border-amber-400 overflow-hidden shadow-[0_0_12px_rgba(245,158,11,0.6)] relative animate-pulse">
               <img src="${photoUrl}" class="w-full h-full object-cover" />
            </div>
          </div>
        `;
      } else if (isVisited && hasPhoto) {
        // 已去过但未选中的城市：仅仅在点位显示圆形头像缩略图
        badgeHtml = `
          <div class="w-8 h-8 rounded-full border-2 border-white/20 overflow-hidden shadow-[0_0_8px_rgba(255,255,255,0.2)] relative cursor-pointer pointer-events-auto transition-all duration-300 hover:scale-110 hover:border-amber-400/60">
             <img src="${d.photos[0]}" class="w-full h-full object-cover" />
          </div>
        `;
      } else {
        // 未去过且未选中的点位
        badgeHtml = `
          <div class="w-2.5 h-2.5 rounded-full bg-slate-500/40 border border-white/25 shadow-sm"></div>
        `;
      }

      el.innerHTML = `
        <div class="flex flex-col items-center gap-1 group relative">
          ${badgeHtml}
        </div>
      `;

      el.onmousedown = (e) => e.stopPropagation();
      el.onclick = (e) => {
        e.stopPropagation();
        onPlaceClick(d as ChinaPlace);
      };

      return el;
    });
  }, [places, selectedPlace, revealedVisitedIds]);

  // 7. 定位飞越
  useEffect(() => {
    if (!globeRef.current || !selectedPlace) return;
    globeRef.current.pointOfView({
      lat: selectedPlace.lat,
      lng: selectedPlace.lng,
      altitude: 1.15 // 聚焦中国且不被裁剪
    }, 950);
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
export default ChinaMemoryScene;
