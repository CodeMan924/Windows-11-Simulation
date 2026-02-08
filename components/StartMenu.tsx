
import React from 'react';
import { Power, User, Monitor } from 'lucide-react';
import { DESKTOP_ICONS, getIcon } from '../constants';
import { AppID } from '../types';

interface StartMenuProps {
  onOpenApp: (id: AppID) => void;
  isOpen: boolean;
  userName: string;
  isDarkMode?: boolean;
}

const StartMenu: React.FC<StartMenuProps> = ({ onOpenApp, isOpen, userName, isDarkMode }) => {
  if (!isOpen) return null;

  return (
    <div 
      className={`absolute bottom-14 left-1/2 -translate-x-1/2 w-[600px] h-[650px] mica rounded-lg overflow-hidden shadow-xl z-[9999] flex flex-col animate-start-menu ${isDarkMode ? 'border-gray-700' : 'border-gray-300'}`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex-1 p-8">
        <h3 className={`text-xs font-bold mb-4 animate-item ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Pinned</h3>
        <div className="grid grid-cols-6 gap-4">
          {DESKTOP_ICONS.map((icon, index) => (
            <button 
              key={icon.id}
              onClick={() => onOpenApp(icon.id)}
              className={`flex flex-col items-center gap-2 p-2 rounded hover:bg-white/10 transition-colors duration-200 hover:scale-105 active:scale-95 animate-item`}
              style={{ animationDelay: `${index * 0.04}s` }}
            >
              {getIcon(icon.icon, 32)}
              <span className={`text-xs text-center ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{icon.label}</span>
            </button>
          ))}
          {/* Mock extra apps */}
          {['Word', 'Excel', 'Store', 'Solitaire'].map((app, index) => (
             <button 
                key={app} 
                className="flex flex-col items-center gap-2 p-2 rounded hover:bg-white/10 transition-colors duration-200 hover:scale-105 active:scale-95 animate-item"
                style={{ animationDelay: `${(DESKTOP_ICONS.length + index) * 0.04}s` }}
             >
               <Monitor size={32} className={isDarkMode ? 'text-white' : 'text-slate-600'} />
               <span className={`text-xs text-center ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{app}</span>
             </button>
          ))}
        </div>
      </div>

      <div className={`h-16 border-t px-8 flex items-center justify-between ${isDarkMode ? 'bg-black/20 border-white/10' : 'bg-gray-100 border-gray-200'}`}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center overflow-hidden">
             {userName === 'Administrator' ? <img src={`https://picsum.photos/seed/admin/32/32`} alt="User" /> : <User size={20} className="text-white" />}
          </div>
          <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{userName}</span>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="p-2 rounded hover:bg-black/10 transition-colors active:scale-95"
        >
          <Power size={20} className={isDarkMode ? 'text-white' : 'text-slate-800'} />
        </button>
      </div>
    </div>
  );
};

export default StartMenu;
