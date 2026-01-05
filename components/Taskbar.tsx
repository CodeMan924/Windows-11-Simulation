
import React, { useState, useEffect } from 'react';
import { Wifi, Volume2, Battery, ChevronUp } from 'lucide-react';
import { DESKTOP_ICONS, getIcon } from '../constants';
import { WindowState, AppID } from '../types';

interface TaskbarProps {
  windows: WindowState[];
  onStartClick: () => void;
  onAppClick: (appId: AppID) => void;
  onQuickSettingsClick: () => void;
  activeAppId?: AppID;
  accentColor: string;
  isDarkMode?: boolean;
}

const Taskbar: React.FC<TaskbarProps> = ({ windows, onStartClick, onAppClick, onQuickSettingsClick, activeAppId, accentColor, isDarkMode }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={`h-12 w-full fixed bottom-0 left-0 flex items-center px-2 mica border-t z-[10000] ${isDarkMode ? 'border-white/5' : 'border-white/10'}`}>
      {/* Left Aligned Section: Start and Apps */}
      <div className="flex items-center gap-1">
        {/* Windows Start Button */}
        <button 
          onClick={(e) => { e.stopPropagation(); onStartClick(); }}
          className={`p-2 rounded-lg transition-all group active:scale-90 taskbar-icon ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-white/40'}`}
          title="Start"
        >
          <div className="group-hover:drop-shadow-[0_0_8px_rgba(0,120,212,0.4)] transition-all">
            {getIcon('windows', 24, "group-hover:scale-110 transition-transform")}
          </div>
        </button>

        <div className={`h-6 w-[1px] mx-1 ${isDarkMode ? 'bg-white/10' : 'bg-white/20'}`} />

        {/* Pinned/Open Apps */}
        <div className="flex items-center gap-0.5">
          {DESKTOP_ICONS.map(icon => {
            const isOpen = windows.some(w => w.appId === icon.id && w.isOpen);
            const isActive = activeAppId === icon.id;
            
            return (
              <button 
                key={icon.id}
                onClick={() => onAppClick(icon.id)}
                className={`p-2 rounded-lg transition-all relative flex flex-col items-center group active:scale-90 taskbar-icon ${isActive ? (isDarkMode ? 'bg-white/10' : 'bg-white/50') : (isDarkMode ? 'hover:bg-white/10' : 'hover:bg-white/40')}`}
                title={icon.label}
              >
                <div className="transition-transform">
                  {getIcon(icon.icon, 24)}
                </div>
                {isOpen && (
                  <div 
                    className={`absolute bottom-0.5 h-[3px] rounded-full transition-all duration-300 ease-out ${isActive ? 'w-4 shadow-lg' : 'w-1.5 bg-slate-400'}`} 
                    style={{ 
                      backgroundColor: isActive ? accentColor : undefined,
                      boxShadow: isActive ? `0 0 8px ${accentColor}99` : undefined
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right side: System Tray */}
      <div className={`flex items-center gap-1 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
        <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors cursor-pointer group mr-2 ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-white/30'}`}>
          <div className="text-emerald-600 group-hover:scale-110 transition-transform">{getIcon('cloud-sun', 18)}</div>
          <div className="flex flex-col leading-tight">
            <span className="text-[10px] font-bold">22°C</span>
            <span className={`text-[9px] font-semibold uppercase ${isDarkMode ? 'text-white/40' : 'text-slate-500'}`}>Cloudy</span>
          </div>
        </div>

        <button className={`p-1.5 rounded-md transition-colors ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-white/30'}`}>
          <ChevronUp size={14} />
        </button>
        
        <div 
          onClick={(e) => { e.stopPropagation(); onQuickSettingsClick(); }}
          className={`flex items-center gap-3 px-2 py-1.5 rounded-lg cursor-pointer transition-colors group ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-white/30'}`}
        >
          <div className="flex items-center gap-2.5">
             <Wifi size={14} className="group-hover:scale-110 transition-transform" />
             <Volume2 size={14} />
             <Battery size={14} className="rotate-90" />
          </div>
        </div>

        <div className={`flex flex-col items-end px-3 py-0.5 rounded-lg transition-colors cursor-pointer text-[11px] leading-tight font-semibold ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-white/30'}`}>
          <span>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          <span className="opacity-70">{time.toLocaleDateString([], { month: 'numeric', day: 'numeric', year: 'numeric' })}</span>
        </div>

        <div className={`w-[1px] h-8 mx-1 ${isDarkMode ? 'bg-white/10' : 'bg-slate-400/20'}`} />
        <div className={`w-1.5 h-full cursor-pointer transition-colors ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-white/40'}`} title="Show desktop" />
      </div>
    </div>
  );
};

export default Taskbar;
