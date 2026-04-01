import React, { useRef, useEffect, useState, useMemo } from 'react';
import * as THREE from 'three';
import GlobeGL from 'react-globe.gl';
import { Satellite } from '../types';
import { getSatellitePosition, getOrbitalTrail } from '../services/satelliteService';

interface GlobeProps {
  satellites: Satellite[];
  selectedSatellite: Satellite | null;
  onSelectSatellite: (sat: Satellite | null) => void;
}

const Globe: React.FC<GlobeProps> = ({ satellites, selectedSatellite, onSelectSatellite }) => {
  const globeEl = useRef<any>();
  const [time, setTime] = useState(new Date());

  // Update satellite positions in real-time
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Update positions for display
  const displaySats = useMemo(() => satellites.map(sat => {
    const pos = getSatellitePosition(sat.tle, time);
    return {
      ...sat,
      lat: pos.lat,
      lng: pos.lng,
      alt: pos.alt / 6371, // Normalize to Earth radius for GlobeGL
    };
  }), [satellites, time]);

  // Generate paths for orbital trails (last 30 minutes)
  const pathsData = useMemo(() => {
    if (!selectedSatellite) return [];
    return [getOrbitalTrail(selectedSatellite.tle, 1800, 50)];
  }, [selectedSatellite]);

  useEffect(() => {
    if (globeEl.current) {
      globeEl.current.controls().autoRotate = !selectedSatellite;
      globeEl.current.controls().autoRotateSpeed = 0.5;
      
      // Atmosphere and Lighting
      const scene = globeEl.current.scene();
      const ambientLight = scene.children.find((c: any) => c.type === 'AmbientLight');
      if (ambientLight) ambientLight.intensity = 0.5;
      
      const directionalLight = scene.children.find((c: any) => c.type === 'DirectionalLight');
      if (directionalLight) {
        directionalLight.intensity = 2;
        directionalLight.position.set(1, 1, 1);
      }
    }
  }, [selectedSatellite]);

  // Focus on selected satellite
  useEffect(() => {
    if (selectedSatellite && globeEl.current) {
      const pos = getSatellitePosition(selectedSatellite.tle, new Date());
      globeEl.current.pointOfView({
        lat: pos.lat,
        lng: pos.lng,
        altitude: 1.5
      }, 1000);
    }
  }, [selectedSatellite]);

  return (
    <div className="w-full h-full bg-black relative overflow-hidden">
      <GlobeGL
        ref={globeEl}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        showAtmosphere={true}
        atmosphereColor="#3a228a"
        atmosphereAltitude={0.15}
        objectsData={displaySats}
        objectLat="lat"
        objectLng="lng"
        objectAltitude="alt"
        objectLabel="name"
        objectColor={d => (d as any).id === selectedSatellite?.id ? '#00ff00' : '#ffffff'}
        onObjectClick={(obj: any) => onSelectSatellite(obj as any)}
        objectThreeObject={() => {
          // Custom satellite mesh
          const geometry = new THREE.SphereGeometry(0.005, 8, 8);
          const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
          return new THREE.Mesh(geometry, material);
        }}
        pathsData={pathsData}
        pathColor={() => '#00ff00'}
        pathDashLength={0.01}
        pathDashGap={0.004}
        pathDashAnimateTime={2000}
        pathStroke={2}
      />
      
      {/* Overlay for Command Center feel */}
      <div className="absolute inset-0 pointer-events-none border-[20px] border-white/5 border-double"></div>
      <div className="absolute top-4 left-4 pointer-events-none">
        <div className="text-[10px] font-mono text-white/40 tracking-[0.2em] uppercase">
          Orbital Satellite Tracker v4.2
        </div>
        <div className="text-[10px] font-mono text-white/20 tracking-[0.2em] uppercase">
          Status: Operational / Latency: 42ms
        </div>
      </div>
    </div>
  );
};

export default Globe;
