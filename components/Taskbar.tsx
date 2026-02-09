
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
  language?: string;
}

const Taskbar: React.FC<TaskbarProps> = ({ windows, onStartClick, onAppClick, onQuickSettingsClick, activeAppId, accentColor, isDarkMode, language = 'en-US' }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={`h-12 w-full fixed bottom-0 left-0 flex items-center justify-between px-4 mica border-t z-[10000] transition-colors duration-300 ${isDarkMode ? 'bg-[#202020] border-gray-700' : 'bg-[#f3f3f3] border-gray-300'}`}>
      
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1">
        <button 
          onClick={(e) => { e.stopPropagation(); onStartClick(); }}
          className="p-2 rounded taskbar-icon hover:bg-white/50"
        >
           {getIcon('windows', 24)}
        </button>

        {DESKTOP_ICONS.map(icon => {
          const isOpen = windows.some(w => w.appId === icon.id);
          const isActive = activeAppId === icon.id;
          
          return (
            <button 
              key={icon.id}
              onClick={() => onAppClick(icon.id)}
              className={`p-2 rounded taskbar-icon relative hover:bg-white/50 ${isActive ? 'bg-white/40' : ''}`}
            >
              {getIcon(icon.icon, 24)}
              {isOpen && <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full transition-all duration-300 ${isActive ? 'w-4 h-1 bg-blue-500' : 'bg-gray-400'}`} />}
            </button>
          );
        })}
      </div>

      <div className="w-10"></div>

      <div className={`flex items-center gap-4 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
        <button className="p-1 hover:bg-white/10 rounded transition-colors"><ChevronUp size={16} /></button>
        <div 
          onClick={(e) => { e.stopPropagation(); onQuickSettingsClick(); }}
          className="flex items-center gap-3 hover:bg-white/10 px-2 py-1 rounded cursor-pointer transition-colors"
        >
             <Wifi size={18} />
             <Volume2 size={18} />
             <Battery size={18} />
        </div>

        <div className="flex flex-col items-end cursor-default">
          <span className="text-xs">{time.toLocaleTimeString(language, { hour: 'numeric', minute: '2-digit' })}</span>
          <span className="text-xs">{time.toLocaleDateString(language)}</span>
        </div>
      </div>
    </div>
  );
};

export default Taskbar;
