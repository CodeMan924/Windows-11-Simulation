
import React from 'react';
import { Wifi, Volume2, Battery, Bluetooth, Moon, Plane, ShieldCheck, Sun } from 'lucide-react';
import { AppID } from '../types';

interface QuickSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  brightness: number;
  setBrightness: (val: number) => void;
  volume: number;
  setVolume: (val: number) => void;
  wifiEnabled: boolean;
  setWifiEnabled: (val: boolean) => void;
  connectedWifi: string;
  setConnectedWifi: (val: string) => void;
  onOpenApp: (appId: AppID, payload?: any) => void;
  accentColor: string;
  isDarkMode?: boolean;
}

const QuickSettings: React.FC<QuickSettingsProps> = ({ 
  isOpen, 
  brightness,
  setBrightness,
  volume,
  setVolume,
  wifiEnabled,
  setWifiEnabled,
  accentColor,
  isDarkMode
}) => {
  if (!isOpen) return null;

  const bgClass = isDarkMode ? 'bg-[#202020] text-white border-gray-700' : 'bg-[#f3f3f3] text-slate-800 border-gray-200';

  return (
    <div 
      className={`fixed bottom-14 right-4 w-80 rounded-xl border shadow-xl z-[10001] p-4 flex flex-col gap-4 animate-panel-up ${bgClass}`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="grid grid-cols-3 gap-2">
         <button 
            onClick={() => setWifiEnabled(!wifiEnabled)}
            className={`flex flex-col items-center justify-center p-3 rounded h-20 transition-all active:scale-95 ${wifiEnabled ? 'bg-blue-500 text-white' : (isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-50')}`}
            style={{ backgroundColor: wifiEnabled ? accentColor : undefined }}
         >
           <Wifi size={20} />
           <span className="text-xs mt-2 font-medium">Wi-Fi</span>
         </button>
         <button className={`flex flex-col items-center justify-center p-3 rounded h-20 transition-all active:scale-95 ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-50'}`}>
           <Bluetooth size={20} />
           <span className="text-xs mt-2 font-medium">Bluetooth</span>
         </button>
         <button className={`flex flex-col items-center justify-center p-3 rounded h-20 transition-all active:scale-95 ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-50'}`}>
           <Plane size={20} />
           <span className="text-xs mt-2 font-medium">Airplane</span>
         </button>
         <button className={`flex flex-col items-center justify-center p-3 rounded h-20 transition-all active:scale-95 ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-50'}`}>
           <Battery size={20} />
           <span className="text-xs mt-2 font-medium">Saver</span>
         </button>
         <button className={`flex flex-col items-center justify-center p-3 rounded h-20 transition-all active:scale-95 ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-50'}`}>
           <Moon size={20} />
           <span className="text-xs mt-2 font-medium">Night</span>
         </button>
         <button className={`flex flex-col items-center justify-center p-3 rounded h-20 transition-all active:scale-95 ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-50'}`}>
           <ShieldCheck size={20} />
           <span className="text-xs mt-2 font-medium">Accessibility</span>
         </button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
           <Sun size={18} />
           <input 
             type="range" 
             className="flex-1 h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer"
             min="0" max="100" 
             value={brightness}
             onChange={(e) => setBrightness(parseInt(e.target.value))}
           />
        </div>
        <div className="flex items-center gap-3">
           <Volume2 size={18} />
           <input 
             type="range" 
             className="flex-1 h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer"
             min="0" max="100" 
             value={volume}
             onChange={(e) => setVolume(parseInt(e.target.value))}
           />
        </div>
      </div>
    </div>
  );
};

export default QuickSettings;
