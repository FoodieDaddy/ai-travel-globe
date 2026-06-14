import React, { useEffect, useRef, useMemo, useState } from 'react';
import Globe from 'globe.gl';
import * as THREE from 'three';
import { Place } from '../../types/travel';
import countriesData from '../../data/countries.json';

interface Props {
  places: Place[]; 
  selectedPlace: Place | null;
  onPlaceClick: (place: Place) => void;
  immersiveActive: boolean;
  onReachPlace?: (place: Place, onSpeechEnd: () => void) => void;
}

// -------------------------------------------------------------
// 经纬度与三维向量互转工具函数（用于大圆航线插值）
// -------------------------------------------------------------
function latLngToVector3(lat: number, lng: number): THREE.Vector3 {
  const latRad = (lat * Math.PI) / 180;
  const lngRad = (lng * Math.PI) / 180;
  const x = Math.cos(latRad) * Math.cos(lngRad);
  const y = Math.cos(latRad) * Math.sin(lngRad);
  const z = Math.sin(latRad);
  return new THREE.Vector3(x, y, z);
}

function vector3ToLatLng(v: THREE.Vector3): { lat: number; lng: number } {
  const r = v.length();
  const lat = Math.asin(v.z / r) * (180 / Math.PI);
  const lng = Math.atan2(v.y, v.x) * (180 / Math.PI);
  return { lat, lng };
}

// 两个坐标间的大圆航线 Slerp 插值
function interpolateGeodesic(
  p1: { lat: number; lng: number },
  p2: { lat: number; lng: number },
  steps: number
): [number, number][] {
  const v1 = latLngToVector3(p1.lat, p1.lng);
  const v2 = latLngToVector3(p2.lat, p2.lng);
  const points: [number, number][] = [];
  const angle = v1.angleTo(v2);

  if (angle < 0.001) {
    for (let i = 0; i <= steps; i++) {
      points.push([p1.lat, p1.lng]);
    }
    return points;
  }

  const sinAngle = Math.sin(angle);
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const f1 = Math.sin((1 - t) * angle) / sinAngle;
    const f2 = Math.sin(t * angle) / sinAngle;
    const vSlerp = new THREE.Vector3()
      .addScaledVector(v1, f1)
      .addScaledVector(v2, f2)
      .normalize();
    const coord = vector3ToLatLng(vSlerp);
    points.push([coord.lat, coord.lng]);
  }
  return points;
}

// 计算两点之间的方位角（Bearing，弧度），用于旋转小车
function getBearing(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const lat1Rad = (lat1 * Math.PI) / 180;
  const lat2Rad = (lat2 * Math.PI) / 180;

  const y = Math.sin(dLng) * Math.cos(lat2Rad);
  const x =
    Math.cos(lat1Rad) * Math.sin(lat2Rad) -
    Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLng);

  return Math.atan2(y, x);
}

// -------------------------------------------------------------
// 拼装 3D 卡车模型
// -------------------------------------------------------------
function createCarMesh(): THREE.Object3D {
  const car = new THREE.Group();

  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0xffffff, // 视频中的白色车身
    roughness: 0.3,
    metalness: 0.4
  });
  
  const cabinMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b, // 深色车窗
    roughness: 0.1,
    metalness: 0.9
  });
  
  const wheelMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a, // 黑色轮胎
    roughness: 0.9
  });

  const lightMat = new THREE.MeshBasicMaterial({
    color: 0xfef08a // 黄色大灯
  });

  // 车身底盘 (长, 高, 宽)
  const bodyGeom = new THREE.BoxGeometry(1.4, 0.45, 0.7);
  const body = new THREE.Mesh(bodyGeom, bodyMat);
  body.position.y = 0.225;
  car.add(body);

  // 车头驾驶室
  const cabinGeom = new THREE.BoxGeometry(0.7, 0.45, 0.62);
  const cabin = new THREE.Mesh(cabinGeom, cabinMat);
  cabin.position.set(0.3, 0.675, 0);
  car.add(cabin);

  // 货箱或车尾盖板
  const bedGeom = new THREE.BoxGeometry(0.65, 0.35, 0.62);
  const bed = new THREE.Mesh(bedGeom, bodyMat);
  bed.position.set(-0.325, 0.625, 0);
  car.add(bed);

  // 车前灯
  const lightGeom = new THREE.BoxGeometry(0.08, 0.1, 0.1);
  const lightL = new THREE.Mesh(lightGeom, lightMat);
  lightL.position.set(0.71, 0.28, 0.22);
  const lightR = lightL.clone();
  lightR.position.z = -0.22;
  car.add(lightL);
  car.add(lightR);

  // 4个轮子
  const wheelGeom = new THREE.CylinderGeometry(0.16, 0.16, 0.12, 12);
  wheelGeom.rotateX(Math.PI / 2); // 横向对齐
  
  const wFL = new THREE.Mesh(wheelGeom, wheelMat);
  wFL.position.set(0.42, 0.16, 0.37);
  
  const wFR = wFL.clone();
  wFR.position.z = -0.37;
  
  const wRL = wFL.clone();
  wRL.position.x = -0.42;
  
  const wRR = wFR.clone();
  wRR.position.x = -0.42;

  car.add(wFL);
  car.add(wFR);
  car.add(wRL);
  car.add(wRR);

  // 整体微缩放置在地球表面
  car.scale.set(0.8, 0.8, 0.8);

  return car;
}

export const TravelGlobe: React.FC<Props> = ({ 
  places, 
  selectedPlace, 
  onPlaceClick,
  immersiveActive,
  onReachPlace
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<any>(null);
  
  // 动画状态引用，防止 effect 闭包
  const animRef = useRef<{
    active: boolean;
    progress: number;
    isSpeaking: boolean;
    lastSpokenIndex: number;
    roadCoords: [number, number][];
    visitedPlaces: Place[];
  }>({
    active: false,
    progress: 0,
    isSpeaking: false,
    lastSpokenIndex: -1,
    roadCoords: [],
    visitedPlaces: []
  });

  // 已打卡地点（按时间升序）
  const visitedPlaces = useMemo(() => {
    return [...places]
      .filter(p => p.visited && p.visitedAt)
      .sort((a, b) => a.visitedAt!.localeCompare(b.visitedAt!));
  }, [places]);

  // 计算连线公路的完整经纬度序列
  const roadCoords = useMemo(() => {
    if (visitedPlaces.length < 2) return [];
    let allPoints: [number, number][] = [];
    const STEPS_PER_SEGMENT = 80; // 每段插值80个点，保证小车跑得更丝滑

    for (let i = 0; i < visitedPlaces.length - 1; i++) {
      const segPoints = interpolateGeodesic(visitedPlaces[i], visitedPlaces[i+1], STEPS_PER_SEGMENT);
      if (i > 0) {
        allPoints = allPoints.concat(segPoints.slice(1));
      } else {
        allPoints = allPoints.concat(segPoints);
      }
    }
    return allPoints;
  }, [visitedPlaces]);

  // 同步动画参数到 ref
  useEffect(() => {
    animRef.current.active = immersiveActive;
    animRef.current.roadCoords = roadCoords;
    animRef.current.visitedPlaces = visitedPlaces;
    
    if (!immersiveActive) {
      // 退出沉浸式模式，重置动画参数
      animRef.current.progress = 0;
      animRef.current.isSpeaking = false;
      animRef.current.lastSpokenIndex = -1;
      if (globeRef.current) {
        globeRef.current.customLayerData([]);
        globeRef.current.controls().autoRotate = true;
      }
    } else {
      if (globeRef.current) {
        globeRef.current.controls().autoRotate = false;
      }
    }
  }, [immersiveActive, roadCoords, visitedPlaces]);

  // 道路路径数据（三层叠加渲染双线公路车道）
  const pathsData = useMemo(() => {
    if (roadCoords.length === 0) return [];
    return [
      // 1. 公路暗灰色地基
      { points: roadCoords, color: 'rgba(15, 23, 42, 0.9)', stroke: 4.8 },
      // 2. 公路两侧边缘白光
      { points: roadCoords, color: 'rgba(14, 165, 233, 0.3)', stroke: 3.8 },
      // 3. 中间白黄虚线
      { points: roadCoords, color: 'rgba(255, 255, 255, 0.85)', stroke: 0.6, isDashed: true }
    ];
  }, [roadCoords]);

  // 1. 初始化地球
  useEffect(() => {
    if (!containerRef.current) return;

    // @ts-ignore
    const globe = Globe()(containerRef.current)
      .showAtmosphere(true)
      .atmosphereColor('#0ea5e9') // 大气层颜色
      .atmosphereAltitude(0.18)
      
      // 点阵大陆网格设置
      .hexPolygonsData(countriesData.features)
      .hexPolygonResolution(3)
      .hexPolygonMargin(0.12)
      .hexPolygonUseDots(true)
      .hexPolygonColor(() => 'rgba(255, 255, 255, 0.28)')
      .hexPolygonAltitude(0.005)

      // 景点标记点
      .pointsData(places)
      .pointLat('lat')
      .pointLng('lng')
      .pointRadius((d: any) => d.visited ? 0.9 : 0.45)
      .pointAltitude(0.008)
      .pointColor((d: any) => {
        if (d.visited) return '#f59e0b'; // 已打卡为暖黄色
        if (d.plannedDate) return '#fb923c'; // 计划中为橙色
        return 'rgba(241, 245, 249, 0.6)'; // 探索点为淡灰色
      })
      
      // 道路绘制
      .pathsData(pathsData)
      .pathPoints(d => d.points)
      .pathPointLat(p => p[0])
      .pathPointLng(p => p[1])
      .pathColor(d => d.color)
      .pathStroke(d => d.stroke)
      .pathDashLength(d => d.isDashed ? 0.35 : 0)
      .pathDashGap(d => d.isDashed ? 0.25 : 0)
      .pathDashAnimateTime(d => d.isDashed ? 2200 : 0)

      // 标签关闭
      .labelsData([])

      // 地球环状波动效果（仅针对已打卡点）
      .ringsData(places.filter(p => p.visited))
      .ringLat('lat')
      .ringLng('lng')
      .ringColor(() => (t: number) => `rgba(245, 158, 11, ${0.18 - Math.sqrt(t) * 0.18})`)
      .ringMaxRadius(2.2)
      .ringPropagationSpeed(0.25)
      .ringRepeatPeriod(2500);

    // 2. 自定义地球基底材质
    const globeMaterial = globe.globeMaterial();
    globeMaterial.color = new THREE.Color(0x060813); // 极深邃接近黑色的深蓝
    globeMaterial.transparent = true;
    globeMaterial.opacity = 0.92;
    globeMaterial.roughness = 0.8;
    globeMaterial.metalness = 0.1;

    // 3. 增强冷暖对比光源
    // 左侧红橙色聚光模拟日出晨曦
    const orangeLight = new THREE.DirectionalLight(0xff5500, 2.5);
    orangeLight.position.set(-300, 80, 80);
    globe.scene().add(orangeLight);

    // 右侧冷青色聚光模拟太空冷光
    const cyanLight = new THREE.DirectionalLight(0x0ea5e9, 2.5);
    cyanLight.position.set(300, 80, 80);
    globe.scene().add(cyanLight);

    // 弱环境底光
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    globe.scene().add(ambientLight);

    // 4. 地理层点击事件
    globe.onPointClick((d: any) => {
      onPlaceClick(d as Place);
    });

    globe.controls().autoRotate = true;
    globe.controls().autoRotateSpeed = 0.4;
    globe.controls().enableZoom = true;
    
    // 默认初始视角
    globe.pointOfView({ lat: 25, lng: 110, altitude: 1.15 }, 0);
    
    globeRef.current = globe;

    const handleResize = () => {
      if (containerRef.current) {
        globe.width(containerRef.current.clientWidth);
        globe.height(containerRef.current.clientHeight);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();

    // 5. 3D 小车及自定义图层初始化
    globe.customLayerData([])
      .customThreeObject(() => createCarMesh())
      .customThreeObjectUpdate((obj, d: any) => {
        obj.rotation.y = d.rotationY;
      });

    return () => {
      window.removeEventListener('resize', handleResize);
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, []);

  // 6. 动态更新过滤点位和道路数据
  useEffect(() => {
    if (!globeRef.current) return;
    globeRef.current.pointsData(places);
    globeRef.current.pathsData(pathsData);
    globeRef.current.ringsData(places.filter(p => p.visited));
  }, [places, pathsData]);

  // 7. 浮动在点位上的微缩图片标注
  useEffect(() => {
    if (!globeRef.current) return;

    // 仅已打卡且有图片的点，或当前选中的点在地球上显示浮动缩略图
    const htmlData = places.filter(p => (p.visited && p.userPhotos && p.userPhotos.length > 0) || selectedPlace?.id === p.id);
    
    globeRef.current.htmlElementsData(htmlData);
    globeRef.current.htmlElement((d: any) => {
      const el = document.createElement('div');
      const isSelected = selectedPlace?.id === d.id;
      const hasPhoto = d.visited && d.userPhotos && d.userPhotos.length > 0;
      
      el.className = `flex flex-col items-center justify-center transition-all duration-500 pointer-events-none ${
        isSelected ? 'opacity-100 scale-110 z-50' : 'opacity-70 scale-90 z-10'
      }`;
      
      let photoHtml = '';
      if (hasPhoto) {
        photoHtml = `
          <div class="w-8 h-8 rounded-full border border-white/40 overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.6)] relative group-hover:scale-110 transition-transform duration-500 cursor-pointer pointer-events-auto">
             <img src="${d.userPhotos[0]}" class="w-full h-full object-cover" />
             ${isSelected ? `<div class="absolute inset-0 border-2 border-amber-400 rounded-full"></div>` : ''}
          </div>
        `;
      } else if (isSelected) {
        photoHtml = `
          <div class="w-4 h-4 rounded-full bg-amber-400 border border-white animate-pulse shadow-[0_0_8px_#fbbf24]"></div>
        `;
      }

      el.innerHTML = `
        <div class="flex flex-col items-center gap-1 group relative">
          ${photoHtml}
          ${isSelected ? `
            <div class="px-2 py-0.5 rounded backdrop-blur-md bg-black/60 border border-white/20 shadow-[0_4px_10px_rgba(0,0,0,0.6)] mt-0.5">
              <span class="text-[9px] font-bold text-white tracking-wide">${d.name}</span>
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
  }, [places, selectedPlace]);

  // 8. 非沉浸模式下，点击左侧或右侧卡片，摄像机聚焦旋转
  useEffect(() => {
    if (!globeRef.current || immersiveActive) return;
    const controls = globeRef.current.controls();

    if (selectedPlace) {
      controls.autoRotateSpeed = 0.05;
      globeRef.current.pointOfView({
        lat: selectedPlace.lat,
        lng: selectedPlace.lng,
        altitude: 0.75
      }, 900);
    } else {
      controls.autoRotateSpeed = 0.4;
    }
  }, [selectedPlace, immersiveActive]);

  // 9. 沉浸式小车动画与追踪循环
  useEffect(() => {
    let animationFrameId: number;
    
    const tick = () => {
      const { active, progress, isSpeaking, lastSpokenIndex, roadCoords, visitedPlaces } = animRef.current;
      
      if (!active || roadCoords.length === 0 || visitedPlaces.length === 0) {
        animationFrameId = requestAnimationFrame(tick);
        return;
      }

      // 如果正在进行语音播报，小车暂停在原地
      if (isSpeaking) {
        animationFrameId = requestAnimationFrame(tick);
        return;
      }

      const totalSteps = roadCoords.length;
      const STEPS_PER_SEGMENT = 80;

      // 检查当前小车所在位置是否对应某个足迹点
      // 每一个足迹点对应坐标序列中的 index = placeIndex * STEPS_PER_SEGMENT
      const currentFloatIndex = progress;
      const roundedIndex = Math.round(currentFloatIndex);
      const placeIndex = roundedIndex / STEPS_PER_SEGMENT;

      if (Number.isInteger(placeIndex) && placeIndex < visitedPlaces.length && roundedIndex !== lastSpokenIndex) {
        const place = visitedPlaces[placeIndex];
        
        // 触发播报
        animRef.current.isSpeaking = true;
        animRef.current.lastSpokenIndex = roundedIndex;
        
        if (globeRef.current) {
          // 摄像机极近对焦
          globeRef.current.pointOfView({
            lat: place.lat,
            lng: place.lng,
            altitude: 0.55
          }, 800);
        }

        if (onReachPlace) {
          onReachPlace(place, () => {
            // 语音播报结束的回调，恢复小车行驶
            animRef.current.isSpeaking = false;
          });
        } else {
          // 如果没有播报组件，1.5秒后自动继续
          setTimeout(() => {
            animRef.current.isSpeaking = false;
          }, 1500);
        }

        animationFrameId = requestAnimationFrame(tick);
        return;
      }

      // 更新位置进度，速度设置为每帧前进 0.15 个单位
      let newProgress = progress + 0.12;
      
      if (newProgress >= totalSteps - 1) {
        // 到达终点，停止行驶
        newProgress = totalSteps - 1;
        animRef.current.active = false;
      }

      animRef.current.progress = newProgress;

      // 插值计算当前坐标及下一步坐标以算出朝向
      const index1 = Math.floor(newProgress);
      const index2 = Math.min(index1 + 1, totalSteps - 1);
      const ratio = newProgress - index1;

      const coord1 = roadCoords[index1];
      const coord2 = roadCoords[index2];

      if (coord1 && coord2) {
        const carLat = coord1[0] + (coord2[0] - coord1[0]) * ratio;
        const carLng = coord1[1] + (coord2[1] - coord1[1]) * ratio;

        // 计算方位角
        const bearing = getBearing(coord1[0], coord1[1], coord2[0], coord2[1]);
        // Y 轴本地旋转，对齐公路
        const rotationY = Math.PI / 2 - bearing;

        if (globeRef.current) {
          // 更新 3D 小车
          globeRef.current.customLayerData([{
            lat: carLat,
            lng: carLng,
            altitude: 0.003,
            rotationY
          }]);

          // 摄像机跟随镜头平滑转动
          globeRef.current.pointOfView({
            lat: carLat,
            lng: carLng,
            altitude: 0.62
          }, 0);
        }
      }

      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [onReachPlace]);

  return <div ref={containerRef} className="w-full h-full" />;
};
