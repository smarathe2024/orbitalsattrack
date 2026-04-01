import React from 'react';
import { Satellite } from '../types';
import { Search, Radio, Navigation, Cloud, FlaskConical } from 'lucide-react';
import { cn } from '../lib/utils';

interface SatelliteListProps {
  satellites: Satellite[];
  selectedSatellite: Satellite | null;
  onSelectSatellite: (sat: Satellite) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const SatelliteList: React.FC<SatelliteListProps> = ({
  satellites,
  selectedSatellite,
  onSelectSatellite,
  searchQuery,
  setSearchQuery
}) => {
  const filteredSats = satellites.filter(sat => 
    sat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTypeIcon = (type: Satellite['type']) => {
    switch (type) {
      case 'COMMUNICATION': return <Radio className="w-3 h-3" />;
      case 'NAVIGATION': return <Navigation className="w-3 h-3" />;
      case 'WEATHER': return <Cloud className="w-3 h-3" />;
      case 'SCIENTIFIC': return <FlaskConical className="w-3 h-3" />;
      default: return <Radio className="w-3 h-3" />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#151619] border-r border-white/10 w-80">
      <div className="p-4 border-b border-white/10">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            type="text"
            placeholder="Search Satellites..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-md py-2 pl-10 pr-4 text-xs font-mono text-white focus:outline-none focus:border-white/20 transition-colors"
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="p-2 space-y-1">
          {filteredSats.map((sat) => (
            <button
              key={sat.id}
              onClick={() => onSelectSatellite(sat)}
              className={cn(
                "w-full text-left p-3 rounded-md transition-all group relative overflow-hidden",
                selectedSatellite?.id === sat.id 
                  ? "bg-white/10 border border-white/20" 
                  : "hover:bg-white/5 border border-transparent"
              )}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-mono font-bold text-white tracking-wider truncate">
                  {sat.name}
                </span>
                <span className="text-[10px] text-white/40 font-mono">
                  #{sat.id}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-white/40 font-mono">
                <span className="flex items-center gap-1">
                  {getTypeIcon(sat.type)}
                  {sat.type}
                </span>
                <span className="w-1 h-1 rounded-full bg-white/20"></span>
                <span>{Math.round(sat.alt)}km</span>
              </div>
              
              {selectedSatellite?.id === sat.id && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
              )}
            </button>
          ))}
        </div>
      </div>
      
      <div className="p-4 border-t border-white/10 bg-black/20">
        <div className="flex justify-between items-center text-[10px] font-mono text-white/40">
          <span>TRACKING: {filteredSats.length}</span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            LIVE FEED
          </span>
        </div>
      </div>
    </div>
  );
};

export default SatelliteList;
