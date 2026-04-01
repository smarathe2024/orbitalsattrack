import React, { useState, useEffect } from 'react';
import { Satellite } from '../types';
import { getSatellitePosition } from '../services/satelliteService';
import { Radio, Navigation, Cloud, FlaskConical, Activity, Globe, Zap, ShieldCheck, Info, Cpu, Database } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import CommunicationTerminal from './CommunicationTerminal';

interface SatelliteDetailsProps {
  satellite: Satellite | null;
  onClose: () => void;
}

const SatelliteDetails: React.FC<SatelliteDetailsProps> = ({ satellite, onClose }) => {
  const [currentPos, setCurrentPos] = useState(satellite ? getSatellitePosition(satellite.tle) : null);

  useEffect(() => {
    if (!satellite) return;
    const interval = setInterval(() => {
      setCurrentPos(getSatellitePosition(satellite.tle));
    }, 1000);
    return () => clearInterval(interval);
  }, [satellite]);

  if (!satellite) return null;

  const getTypeIcon = (type: Satellite['type']) => {
    switch (type) {
      case 'COMMUNICATION': return <Radio className="w-4 h-4" />;
      case 'NAVIGATION': return <Navigation className="w-4 h-4" />;
      case 'WEATHER': return <Cloud className="w-4 h-4" />;
      case 'SCIENTIFIC': return <FlaskConical className="w-4 h-4" />;
      default: return <Radio className="w-4 h-4" />;
    }
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        className="fixed right-0 top-0 bottom-0 w-96 bg-[#151619] border-l border-white/10 shadow-2xl z-50 flex flex-col"
      >
        <div className="p-6 border-b border-white/10 flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1.5 bg-white/5 rounded-md border border-white/10">
                {getTypeIcon(satellite.type)}
              </div>
              <span className="text-[10px] font-mono text-white/40 tracking-widest uppercase">
                {satellite.type} SATELLITE
              </span>
            </div>
            <h2 className="text-2xl font-mono font-bold text-white tracking-tight">
              {satellite.name}
            </h2>
            <div className="text-[10px] font-mono text-white/20 mt-1">
              NORAD ID: {satellite.id}
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-md transition-colors text-white/40 hover:text-white"
          >
            <Zap className="w-4 h-4 rotate-45" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          {/* Mission Dossier */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Info className="w-3 h-3 text-blue-500" />
              <span className="text-[10px] font-mono text-white/60 tracking-widest uppercase">
                Mission Dossier
              </span>
            </div>
            <div className="p-4 bg-black/40 border border-white/5 rounded-lg space-y-4">
              <p className="text-xs font-mono text-white/80 leading-relaxed italic">
                "{satellite.mission}"
              </p>
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/5">
                <div>
                  <div className="text-[10px] font-mono text-white/40 mb-1 uppercase">Frequency</div>
                  <div className="text-xs font-mono text-blue-400">{satellite.frequency}</div>
                </div>
                <div>
                  <div className="text-[10px] font-mono text-white/40 mb-1 uppercase">Status</div>
                  <div className={`text-xs font-mono ${satellite.status === 'OPERATIONAL' ? 'text-green-500' : 'text-yellow-500'}`}>
                    {satellite.status}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Real-time Telemetry */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-3 h-3 text-green-500" />
              <span className="text-[10px] font-mono text-white/60 tracking-widest uppercase">
                Live Telemetry
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-black/40 border border-white/5 rounded-lg">
                <div className="text-[10px] font-mono text-white/40 mb-1 uppercase">Altitude</div>
                <div className="text-lg font-mono text-white">{Math.round(currentPos?.alt || 0)} <span className="text-xs opacity-40">KM</span></div>
              </div>
              <div className="p-4 bg-black/40 border border-white/5 rounded-lg">
                <div className="text-[10px] font-mono text-white/40 mb-1 uppercase">Velocity</div>
                <div className="text-lg font-mono text-white">{(currentPos?.velocity || 0).toFixed(2)} <span className="text-xs opacity-40">KM/S</span></div>
              </div>
              <div className="p-4 bg-black/40 border border-white/5 rounded-lg">
                <div className="text-[10px] font-mono text-white/40 mb-1 uppercase">Latitude</div>
                <div className="text-lg font-mono text-white">{(currentPos?.lat || 0).toFixed(4)}°</div>
              </div>
              <div className="p-4 bg-black/40 border border-white/5 rounded-lg">
                <div className="text-[10px] font-mono text-white/40 mb-1 uppercase">Longitude</div>
                <div className="text-lg font-mono text-white">{(currentPos?.lng || 0).toFixed(4)}°</div>
              </div>
            </div>
          </section>

          {/* Communication Terminal */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Cpu className="w-3 h-3 text-purple-500" />
              <span className="text-[10px] font-mono text-white/60 tracking-widest uppercase">
                Communication Terminal
              </span>
            </div>
            <CommunicationTerminal satelliteName={satellite.name} />
          </section>

          {/* Orbital Parameters */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-3 h-3 text-blue-500" />
              <span className="text-[10px] font-mono text-white/60 tracking-widest uppercase">
                Orbital Parameters
              </span>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-xs font-mono text-white/40">Inclination</span>
                <span className="text-xs font-mono text-white">{satellite.inclination.toFixed(2)}°</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-xs font-mono text-white/40">Orbital Period</span>
                <span className="text-xs font-mono text-white">{Math.round(satellite.period)} MIN</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-xs font-mono text-white/40">Mean Motion</span>
                <span className="text-xs font-mono text-white">{(1440 / satellite.period).toFixed(4)} REV/DAY</span>
              </div>
            </div>
          </section>

          {/* Communication Status */}
          <section className="p-4 bg-green-500/5 border border-green-500/20 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-full">
                <ShieldCheck className="w-4 h-4 text-green-500" />
              </div>
              <div>
                <div className="text-xs font-mono text-green-500 font-bold">LINK ESTABLISHED</div>
                <div className="text-[10px] font-mono text-green-500/60 uppercase">Secure Uplink Active</div>
              </div>
            </div>
          </section>
        </div>

        <div className="p-6 border-t border-white/10 bg-black/40">
          <button className="w-full bg-white text-black font-mono font-bold py-3 rounded-md hover:bg-white/90 transition-colors text-sm tracking-wider uppercase flex items-center justify-center gap-2">
            <Database className="w-4 h-4" />
            Establish Data Link
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SatelliteDetails;
