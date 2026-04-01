import React, { useState, useEffect } from 'react';
import Globe from './components/Globe';
import SatelliteList from './components/SatelliteList';
import SatelliteDetails from './components/SatelliteDetails';
import { fetchActiveSatellites } from './services/satelliteService';
import { Satellite } from './types';
import { Menu, X, Satellite as SatelliteIcon, Activity, Settings, Database } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [satellites, setSatellites] = useState<Satellite[]>([]);
  const [selectedSatellite, setSelectedSatellite] = useState<Satellite | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSatellites = async () => {
      setIsLoading(true);
      const data = await fetchActiveSatellites(500);
      setSatellites(data);
      setIsLoading(false);
    };
    loadSatellites();
  }, []);

  return (
    <div className="flex h-screen bg-black text-white font-sans overflow-hidden select-none">
      {/* Sidebar Toggle (Mobile) */}
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-4 left-4 z-50 p-2 bg-black/80 border border-white/10 rounded-md lg:hidden"
      >
        {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <motion.div
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            className="fixed inset-y-0 left-0 z-40 lg:relative lg:flex"
          >
            <SatelliteList 
              satellites={satellites}
              selectedSatellite={selectedSatellite}
              onSelectSatellite={(sat) => {
                setSelectedSatellite(sat);
                if (window.innerWidth < 1024) setIsSidebarOpen(false);
              }}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 relative flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 border-b border-white/10 bg-[#151619]/80 backdrop-blur-md flex items-center justify-between px-6 z-30">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-white/5 rounded-lg border border-white/10">
              <SatelliteIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-mono font-bold tracking-[0.2em] uppercase">Orbital Satellite Tracker</h1>
              <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                System Online / Global Network Active
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-mono text-white/40 uppercase">Active Nodes</span>
              <span className="text-xs font-mono font-bold">{satellites.length}</span>
            </div>
            <div className="w-px h-8 bg-white/10"></div>
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-mono text-white/40 uppercase">Network Load</span>
                <span className="text-xs font-mono font-bold text-green-500">14.2 GB/S</span>
              </div>
              <div className="w-px h-8 bg-white/10"></div>
              <button className="p-2 hover:bg-white/5 rounded-md transition-colors text-white/40 hover:text-white">
                <Activity className="w-4 h-4" />
              </button>
              <button className="p-2 hover:bg-white/5 rounded-md transition-colors text-white/40 hover:text-white">
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Globe View */}
        <div className="flex-1 relative">
          {isLoading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-50">
              <div className="w-16 h-16 border-4 border-white/10 border-t-white rounded-full animate-spin mb-4"></div>
              <div className="text-xs font-mono text-white/40 tracking-[0.3em] uppercase animate-pulse">
                Initializing Orbital Link...
              </div>
            </div>
          ) : (
            <Globe 
              satellites={satellites}
              selectedSatellite={selectedSatellite}
              onSelectSatellite={setSelectedSatellite}
            />
          )}

          {/* HUD Overlays - Global Dashboard Feel */}
          <div className="absolute top-6 right-6 z-20 pointer-events-none hidden lg:block">
            <div className="p-4 bg-black/60 border border-white/10 backdrop-blur-md rounded-lg space-y-4 w-64">
              <div>
                <div className="text-[10px] font-mono text-white/40 mb-2 uppercase tracking-widest">Global Coverage</div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 w-[84%]"></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 bg-white/5 rounded border border-white/5">
                  <div className="text-[8px] font-mono text-white/20 uppercase">Uplink</div>
                  <div className="text-[10px] font-mono text-green-500">STABLE</div>
                </div>
                <div className="p-2 bg-white/5 rounded border border-white/5">
                  <div className="text-[8px] font-mono text-white/20 uppercase">Downlink</div>
                  <div className="text-[10px] font-mono text-green-500">STABLE</div>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-6 left-6 z-20 pointer-events-none">
            <div className="p-4 bg-black/60 border border-white/10 backdrop-blur-md rounded-lg">
              <div className="text-[10px] font-mono text-white/40 mb-2 uppercase tracking-widest">Signal Strength</div>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                  <div key={i} className={`w-1.5 h-4 rounded-sm ${i < 7 ? 'bg-green-500' : 'bg-white/10'}`}></div>
                ))}
              </div>
            </div>
          </div>

          {/* Brutalist Scanline Effect */}
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] opacity-20"></div>
        </div>

        {/* Satellite Details Panel */}
        <SatelliteDetails 
          satellite={selectedSatellite} 
          onClose={() => setSelectedSatellite(null)} 
        />
      </main>
    </div>
  );
}
