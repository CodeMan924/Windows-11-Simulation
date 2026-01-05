
import React from 'react';
import { Power, ChevronRight, Clock } from 'lucide-react';
import { DESKTOP_ICONS, getIcon } from '../constants';
import { AppID } from '../types';

interface StartMenuProps {
  onOpenApp: (id: AppID) => void;
  isOpen: boolean;
  userName: string;
  isDarkMode?: boolean;
}

const StartMenu: React.FC<StartMenuProps> = ({ onOpenApp, isOpen, userName, isDarkMode }) => {
  const mockApps = ['Word', 'Excel', 'Store', 'Solitaire', 'Mail', 'Photos'];

  if (!isOpen) return null;

  return (
    <div 
      className={`absolute bottom-14 left-2 w-[540px] h-[600px] mica rounded-2xl overflow-hidden border shadow-[0_20px_60px_-10px_rgba(0,0,0,0.3)] z-[9999] flex flex-col animate-start origin-bottom-left ${isDarkMode ? 'border-white/10' : 'border-white/30'}`}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Menu Header */}
      <div className="p-8 pb-4 pt-10">
        <h1 className="text-xl font-bold">Welcome, {userName}</h1>
        <p className={`text-xs font-medium ${isDarkMode ? 'text-white/60' : 'text-slate-500'}`}>Quickly access your pinned apps and recent files.</p>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 px-8 py-4 overflow-y-auto custom-scrollbar">
        {/* Pinned Section */}
        <div>
          <div className="flex items-center justify-between mb-4 px-1">
            <span className={`text-[11px] font-bold uppercase tracking-wider opacity-60`}>Pinned</span>
            <button className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold transition-all border ${isDarkMode ? 'bg-white/5 border-white/5 hover:bg-white/10' : 'bg-white/40 border-black/5 hover:bg-white/70'}`}>
              All apps <ChevronRight size={10} strokeWidth={3} />
            </button>
          </div>
          
          <div className="grid grid-cols-6 gap-y-8">
            {DESKTOP_ICONS.map(icon => (
              <button 
                key={icon.id}
                onClick={() => onOpenApp(icon.id)}
                className="flex flex-col items-center gap-2 group app-item-hover p-2 rounded-xl"
              >
                <div className="w-12 h-12 flex items-center justify-center">
                  {getIcon(icon.icon, 32, "group-hover:scale-110 transition-transform duration-300")}
                </div>
                <span className="text-[10px] font-semibold text-center line-clamp-2">{icon.label}</span>
              </button>
            ))}
            {mockApps.map(app => (
              <button key={app} className="flex flex-col items-center gap-2 group app-item-hover p-2 rounded-xl opacity-80">
                <div className="w-12 h-12 flex items-center justify-center">
                  {getIcon('monitor', 32, isDarkMode ? 'text-white/40' : 'text-slate-400')}
                </div>
                <span className="text-[10px] font-semibold text-center line-clamp-2">{app}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Recommended Section */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-4 px-1">
            <span className="text-[11px] font-bold uppercase tracking-wider opacity-60">Recommended</span>
            <button className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-all border ${isDarkMode ? 'bg-white/5 border-white/5 hover:bg-white/10' : 'bg-white/40 border-black/5 hover:bg-white/70'}`}>
              More <ChevronRight size={10} strokeWidth={3} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { name: 'Financial Report.pdf', time: '2h ago' },
              { name: 'Vacation Plan', time: 'Yesterday' },
              { name: 'Meeting Notes', time: '3h ago' },
              { name: 'Project Roadmap', time: 'Monday' },
            ].map((file, i) => (
              <div key={i} className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer group transition-all border shadow-sm hover:shadow-md ${isDarkMode ? 'hover:bg-white/5 border-transparent hover:border-white/5' : 'hover:bg-white/50 border-transparent hover:border-white/50'}`}>
                <div className={`p-2 rounded-lg shadow-sm group-hover:scale-105 transition-transform ${isDarkMode ? 'bg-white/10' : 'bg-white/80'}`}>
                  {getIcon('file-text', 20)}
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-[11px] font-bold truncate">{file.name}</span>
                  <span className={`text-[10px] flex items-center gap-1 font-medium ${isDarkMode ? 'text-white/40' : 'text-slate-500'}`}>
                    <Clock size={10} /> {file.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className={`h-16 border-t px-8 flex items-center justify-between ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white/30 border-white/20'}`}>
        <div className={`flex items-center gap-3 p-2 px-4 rounded-xl transition-all cursor-pointer group active:scale-95 border ${isDarkMode ? 'hover:bg-white/5 border-transparent hover:border-white/5' : 'hover:bg-white/50 border-transparent hover:border-white/40'}`}>
          <div className="w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center text-slate-600 overflow-hidden border-2 border-white/80 shadow-sm">
             <img src={`https://picsum.photos/seed/${userName === 'Administrator' ? 'admin' : 'user'}/32/32`} alt="User" />
          </div>
          <span className="text-[11px] font-bold">{userName}</span>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="p-2.5 hover:bg-red-500/10 hover:text-red-600 rounded-xl transition-all group active:scale-90" title="Sign out"
        >
          <Power size={18} />
        </button>
      </div>
    </div>
  );
};

export default StartMenu;
