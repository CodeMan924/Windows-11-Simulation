
import React, { useState } from 'react';
import { Wifi, Volume2, Battery, Bluetooth, Moon, Plane, ShieldCheck, ChevronRight, Settings, WifiOff, VolumeX, Volume1 } from 'lucide-react';
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
}

const QuickSettings: React.FC<QuickSettingsProps> = ({ 
  isOpen, 
  onClose,
  brightness,
  setBrightness,
  volume,
  setVolume,
  wifiEnabled,
  setWifiEnabled,
  connectedWifi,
  setConnectedWifi,
  onOpenApp,
  accentColor
}) => {
  const [isWifiListOpen, setIsWifiListOpen] = useState(false);
  
  const wifis = [
    { name: "Neighbour's wifi", strength: 2 },
    { name: 'Cool wifi', strength: 4 },
  ];

  const toggleWifi = (e: React.MouseEvent) => {
    e.stopPropagation();
    setWifiEnabled(!wifiEnabled);
  };

  const handleMoreWifiSettings = () => {
    onOpenApp('settings', { category: 'network' });
    onClose();
    setIsWifiListOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed bottom-14 right-2 w-80 mica rounded-xl border border-white/20 shadow-2xl z-[10001] p-4 flex flex-col gap-4 animate-start origin-bottom-right"
      onClick={(e) => e.stopPropagation()}
    >
      {!isWifiListOpen ? (
        <>
          {/* Main Grid Toggles */}
          <div className="grid grid-cols-3 gap-2">
            <div className="relative group flex flex-col">
              <button 
                onClick={() => setIsWifiListOpen(true)}
                className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all shadow-sm h-full ${
                  wifiEnabled 
                    ? 'text-white' 
                    : 'bg-white/40 text-slate-700 hover:bg-white/60'
                }`}
                style={{ backgroundColor: wifiEnabled ? accentColor : undefined }}
              >
                <div onClick={toggleWifi} className="p-1 -m-1 hover:bg-black/10 rounded-md transition-colors" title={wifiEnabled ? "Turn Off" : "Turn On"}>
                  {wifiEnabled ? <Wifi size={20} /> : <WifiOff size={20} />}
                </div>
                <span className="text-[10px] font-semibold truncate w-full px-1">
                  {wifiEnabled ? connectedWifi : 'Off'}
                </span>
              </button>
            </div>
            
            <button className="flex flex-col items-center gap-1 p-2 bg-white/40 text-slate-700 rounded-lg hover:bg-white/60 transition-colors">
              <Bluetooth size={20} />
              <span className="text-[10px] font-semibold">On</span>
            </button>
            <button className="flex flex-col items-center gap-1 p-2 bg-white/40 text-slate-700 rounded-lg hover:bg-white/60 transition-colors">
              <Plane size={20} />
              <span className="text-[10px] font-semibold">Off</span>
            </button>
            <button className="flex flex-col items-center gap-1 p-2 bg-white/40 text-slate-700 rounded-lg hover:bg-white/60 transition-colors">
              <Moon size={20} />
              <span className="text-[10px] font-semibold">Night</span>
            </button>
            <button className="flex flex-col items-center gap-1 p-2 bg-white/40 text-slate-700 rounded-lg hover:bg-white/60 transition-colors">
              <ShieldCheck size={20} />
              <span className="text-[10px] font-semibold">Saving</span>
            </button>
            <button className="flex flex-col items-center gap-1 p-2 bg-white/40 text-slate-700 rounded-lg hover:bg-white/60 transition-colors">
              <div className="rotate-90"><Battery size={20} /></div>
              <span className="text-[10px] font-semibold">82%</span>
            </button>
          </div>

          {/* Sliders Area */}
          <div className="space-y-4 px-1">
            {/* Volume Slider */}
            <div className="flex items-center gap-3">
              {volume === 0 ? <VolumeX size={18} className="text-slate-600" /> : volume < 50 ? <Volume1 size={18} className="text-slate-600" /> : <Volume2 size={18} className="text-slate-600" />}
              <div className="flex-1 relative flex items-center group">
                <input 
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => setVolume(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-full appearance-none cursor-pointer"
                  style={{ accentColor }}
                />
              </div>
            </div>

            {/* Brightness Slider */}
            <div className="flex items-center gap-3">
               <div className="w-[18px] flex justify-center text-slate-600">🔆</div>
               <div className="flex-1 relative flex items-center group">
                <input 
                  type="range"
                  min="10"
                  max="100"
                  value={brightness}
                  onChange={(e) => setBrightness(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-full appearance-none cursor-pointer"
                  style={{ accentColor }}
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-white/20">
             <div className="flex items-center gap-2 text-slate-600">
               <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
               <span className="text-[10px] font-bold">Battery fully charged</span>
             </div>
             <button onClick={() => { onOpenApp('settings'); onClose(); }} className="p-1.5 hover:bg-white/40 rounded-md transition-colors text-slate-700">
               <Settings size={16} />
             </button>
          </div>
        </>
      ) : (
        <div className="flex flex-col h-[320px]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsWifiListOpen(false)}
                className="p-1 hover:bg-white/40 rounded-md transition-colors"
              >
                <ChevronRight size={18} className="rotate-180" />
              </button>
              <span className="text-sm font-bold text-slate-800">Wi-Fi</span>
            </div>
            {/* Toggle Switch in List View */}
            <button 
              onClick={() => setWifiEnabled(!wifiEnabled)}
              className={`w-10 h-5 rounded-full relative transition-colors ${wifiEnabled ? '' : 'bg-slate-400'}`}
              style={{ backgroundColor: wifiEnabled ? accentColor : undefined }}
            >
              <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${wifiEnabled ? 'left-6' : 'left-1'}`} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1 pr-1">
            {!wifiEnabled ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-4">
                <div className="bg-slate-100 p-4 rounded-full mb-3">
                  <WifiOff size={32} className="text-slate-400" />
                </div>
                <h3 className="text-sm font-bold text-slate-800">Wi-Fi is turned off</h3>
                <p className="text-[11px] text-slate-500 mt-1 mb-4">Turn on Wi-Fi to see available networks and connect to the internet.</p>
                <button 
                  onClick={() => setWifiEnabled(true)}
                  className="text-white text-xs font-bold px-6 py-2 rounded-lg transition-colors shadow-sm"
                  style={{ backgroundColor: accentColor }}
                >
                  Turn on
                </button>
              </div>
            ) : (
              wifis.map((wifi) => (
                <div 
                  key={wifi.name}
                  onClick={() => setConnectedWifi(wifi.name)}
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all border border-transparent ${wifi.name === connectedWifi ? 'shadow-sm' : 'hover:bg-white/40'}`}
                  style={{ backgroundColor: wifi.name === connectedWifi ? `${accentColor}15` : undefined, borderColor: wifi.name === connectedWifi ? `${accentColor}33` : undefined }}
                >
                  <div className="flex items-center gap-3">
                    <Wifi size={16} className={wifi.name === connectedWifi ? '' : 'text-slate-600'} style={{ color: wifi.name === connectedWifi ? accentColor : undefined }} />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold" style={{ color: wifi.name === connectedWifi ? accentColor : '#1e293b' }}>{wifi.name}</span>
                      {wifi.name === connectedWifi && <span className="text-[10px] font-medium" style={{ color: accentColor }}>Connected, secured</span>}
                    </div>
                  </div>
                  {wifi.name === connectedWifi && <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColor }} />}
                </div>
              ))
            )}
          </div>

          {wifiEnabled && (
            <div className="mt-4 pt-2 border-t border-white/20">
              <button 
                onClick={handleMoreWifiSettings}
                className="w-full text-center text-xs font-bold hover:bg-white/40 py-2 rounded-lg transition-colors"
                style={{ color: accentColor }}
              >
                More Wi-Fi settings
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuickSettings;
