import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Send, ChevronRight } from 'lucide-react';

interface CommunicationTerminalProps {
  satelliteName: string;
}

const CommunicationTerminal: React.FC<CommunicationTerminalProps> = ({ satelliteName }) => {
  const [history, setHistory] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHistory([
      `[SYSTEM] Initializing secure uplink to ${satelliteName}...`,
      `[SYSTEM] Handshake successful. Protocol: AES-256-GCM`,
      `[SYSTEM] Connection stable. Ready for commands.`
    ]);
  }, [satelliteName]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const cmd = input.trim().toUpperCase();
    setHistory(prev => [...prev, `> ${cmd}`]);
    setInput('');
    setIsTyping(true);

    // Simulate response
    setTimeout(() => {
      let response = '';
      switch (cmd) {
        case 'PING': response = `[${satelliteName}] PONG - Latency: 42ms`; break;
        case 'STATUS': response = `[${satelliteName}] All systems nominal. Fuel: 84%. Temp: -40°C`; break;
        case 'TELEMETRY': response = `[${satelliteName}] Batch 0x4F2A received. CRC check passed.`; break;
        case 'DOWNLINK': response = `[${satelliteName}] Initiating data burst... 1.2GB/s transfer rate.`; break;
        case 'HELP': response = `[SYSTEM] Available commands: PING, STATUS, TELEMETRY, DOWNLINK, CLEAR`; break;
        case 'CLEAR': setHistory([]); setIsTyping(false); return;
        default: response = `[SYSTEM] Unknown command: ${cmd}. Type HELP for options.`;
      }
      setHistory(prev => [...prev, response]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <div className="flex flex-col h-64 bg-black/60 border border-white/10 rounded-lg overflow-hidden font-mono text-[10px]">
      <div className="bg-white/5 px-3 py-2 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2 text-white/60">
          <Terminal className="w-3 h-3" />
          <span>SECURE TERMINAL</span>
        </div>
        <div className="flex gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500/40"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-yellow-500/40"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-green-500/40"></div>
        </div>
      </div>
      
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
        {history.map((line, i) => (
          <div key={i} className={line.startsWith('>') ? 'text-green-500' : 'text-white/60'}>
            {line}
          </div>
        ))}
        {isTyping && <div className="text-white/40 animate-pulse">Processing...</div>}
      </div>

      <form onSubmit={handleCommand} className="p-2 bg-black/40 border-t border-white/10 flex items-center gap-2">
        <ChevronRight className="w-3 h-3 text-green-500" />
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter command..."
          className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-white/20"
        />
        <button type="submit" className="text-white/40 hover:text-white transition-colors">
          <Send className="w-3 h-3" />
        </button>
      </form>
    </div>
  );
};

export default CommunicationTerminal;
