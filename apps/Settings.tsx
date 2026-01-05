
import React, { useState, useEffect } from 'react';
import { 
  Monitor, 
  Palette, 
  Wifi, 
  Volume2, 
  Info, 
  ChevronRight, 
  Check,
  Search,
  Sun,
  Laptop,
  Network,
  Moon
} from 'lucide-react';

type Category = 'system' | 'personalization' | 'network' | 'sound' | 'about';

interface SettingsProps {
  userName: string;
  wallpaper: string;
  setWallpaper: (url: string) => void;
  brightness: number;
  setBrightness: (val: number) => void;
  volume: number;
  setVolume: (val: number) => void;
  wifiEnabled: boolean;
  setWifiEnabled: (enabled: boolean) => void;
  connectedWifi: string;
  setConnectedWifi: (val: string) => void;
  accentColor: string;
  setAccentColor: (val: string) => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  initialCategory?: Category;
}

const WALLPAPERS = [
  'https://images.unsplash.com/photo-1635350736475-c8cef4b21906?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1620121692029-d088224ddc74?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1477346611705-65d1883cee1e?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=80',
];

const THEME_COLORS = [
  '#0078d4', // Windows Blue
  '#4a148c', // Purple
  '#1b5e20', // Green
  '#b71c1c', // Red
  '#e65100', // Orange
  '#008272', // Teal
  '#004e8c', // Dark Blue
  '#c30052', // Magenta
];

const WIFI_NETWORKS = [
  { name: "Neighbour's wifi", strength: 'Medium' },
  { name: 'Cool wifi', strength: 'Strong' },
];

const Settings: React.FC<SettingsProps> = ({ 
  userName, 
  wallpaper, 
  setWallpaper, 
  brightness, 
  setBrightness, 
  volume, 
  setVolume,
  wifiEnabled,
  setWifiEnabled,
  connectedWifi,
  setConnectedWifi,
  accentColor,
  setAccentColor,
  isDarkMode,
  setIsDarkMode,
  initialCategory
}) => {
  const [activeCategory, setActiveCategory] = useState<Category>('system');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (initialCategory) {
      setActiveCategory(initialCategory);
    }
  }, [initialCategory]);

  const sidebarItems = [
    { id: 'system', label: 'System', icon: <Monitor size={18} /> },
    { id: 'personalization', label: 'Personalization', icon: <Palette size={18} /> },
    { id: 'network', label: 'Network & internet', icon: <Network size={18} /> },
    { id: 'sound', label: 'Sound', icon: <Volume2 size={18} /> },
    { id: 'about', label: 'About', icon: <Info size={18} /> },
  ];

  const containerClasses = isDarkMode ? 'bg-[#1c1c1c] text-white' : 'bg-slate-50 text-slate-800';
  const sidebarClasses = isDarkMode ? 'bg-[#252525] border-white/5' : 'bg-slate-100/50 border-slate-200';
  const cardClasses = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white/50 border-slate-200';

  const renderContent = () => {
    switch (activeCategory) {
      case 'system':
        return (
          <div className="space-y-8 animate-start">
            <h2 className="text-2xl font-bold">System</h2>
            
            <section className={`${cardClasses} rounded-xl border p-6 space-y-6`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
                    <Sun size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold">Display</h3>
                    <p className="text-xs opacity-60">Brightness, night light, display profile</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-100/10">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Brightness</span>
                  <span className="text-xs font-bold opacity-60">{brightness}%</span>
                </div>
                <input 
                  type="range" 
                  min="10" max="100" 
                  value={brightness}
                  onChange={(e) => setBrightness(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-200/20 rounded-full appearance-none cursor-pointer"
                  style={{ accentColor }}
                />
              </div>
            </section>
          </div>
        );

      case 'personalization':
        return (
          <div className="space-y-8 animate-start">
            <h2 className="text-2xl font-bold">Personalization</h2>
            
            {/* Mode Toggle */}
            <section className={`${cardClasses} rounded-xl border p-6 space-y-4`}>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Choose your mode</h3>
              <div className="flex gap-4">
                <button 
                  onClick={() => setIsDarkMode(false)}
                  className={`flex-1 flex items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all ${!isDarkMode ? 'bg-white text-slate-900 border-white shadow-lg' : 'bg-white/5 border-transparent text-white hover:bg-white/10'}`}
                  style={{ borderColor: !isDarkMode ? accentColor : undefined }}
                >
                  <Sun size={20} />
                  <span className="font-semibold text-sm">Light</span>
                  {!isDarkMode && <Check size={16} className="ml-auto" style={{ color: accentColor }} />}
                </button>
                <button 
                  onClick={() => setIsDarkMode(true)}
                  className={`flex-1 flex items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all ${isDarkMode ? 'bg-white/10 border-white shadow-lg' : 'bg-white/40 border-transparent text-slate-700 hover:bg-white/60'}`}
                  style={{ borderColor: isDarkMode ? accentColor : undefined }}
                >
                  <Moon size={20} />
                  <span className="font-semibold text-sm">Dark</span>
                  {isDarkMode && <Check size={16} className="ml-auto" style={{ color: accentColor }} />}
                </button>
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Select Background</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {WALLPAPERS.map((url, i) => (
                  <button 
                    key={i}
                    onClick={() => setWallpaper(url)}
                    className={`relative aspect-video rounded-xl overflow-hidden border-2 transition-all hover:scale-[1.02] active:scale-[0.98] ${
                      wallpaper === url ? 'ring-4 ring-offset-2' : 'border-transparent'
                    }`}
                    style={{ ringColor: wallpaper === url ? accentColor : 'transparent', borderColor: wallpaper === url ? accentColor : 'transparent' }}
                  >
                    <img src={url} alt={`Wallpaper ${i}`} className="w-full h-full object-cover" />
                    {wallpaper === url && (
                      <div className="absolute top-2 right-2 text-white p-1 rounded-full shadow-lg" style={{ backgroundColor: accentColor }}>
                        <Check size={12} />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </section>

            <section className={`${cardClasses} rounded-xl border p-6 space-y-4`}>
               <h3 className="font-semibold">Theme Colors</h3>
               <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
                 {THEME_COLORS.map(color => (
                   <button 
                    key={color} 
                    onClick={() => setAccentColor(color)}
                    className="w-full aspect-square rounded-full border-2 border-white shadow-sm cursor-pointer hover:scale-110 transition-transform relative flex items-center justify-center group"
                    style={{ backgroundColor: color }}
                   >
                     {accentColor === color && (
                       <div className="bg-white/30 rounded-full p-1 border border-white/50">
                         <Check size={14} className="text-white" />
                       </div>
                     )}
                   </button>
                 ))}
               </div>
            </section>
          </div>
        );

      case 'network':
        return (
          <div className="space-y-8 animate-start">
            <h2 className="text-2xl font-bold">Network & internet</h2>

            <section className={`${cardClasses} rounded-xl border p-6 flex items-center justify-between`}>
               <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg transition-colors ${wifiEnabled ? 'text-white' : 'bg-slate-100 text-slate-500'}`} style={{ backgroundColor: wifiEnabled ? accentColor : undefined }}>
                  <Wifi size={24} />
                </div>
                <div>
                  <h3 className="font-semibold">Wi-Fi</h3>
                  <p className="text-xs opacity-60">{wifiEnabled ? `Connected to ${connectedWifi}` : 'Disconnected'}</p>
                </div>
              </div>
              <button 
                onClick={() => setWifiEnabled(!wifiEnabled)}
                className="w-12 h-6 rounded-full relative transition-colors bg-slate-400"
                style={{ backgroundColor: wifiEnabled ? accentColor : undefined }}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${wifiEnabled ? 'left-7' : 'left-1'}`} />
              </button>
            </section>

            {wifiEnabled && (
              <section className="space-y-2">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider px-2">Available Networks</h3>
                <div className={`${cardClasses} rounded-xl border overflow-hidden`}>
                  {WIFI_NETWORKS.map((net, i) => (
                    <div 
                      key={i} 
                      onClick={() => setConnectedWifi(net.name)}
                      className={`flex items-center justify-between p-4 hover:bg-white/10 cursor-pointer transition-colors border-b border-slate-100/10 last:border-0`}
                    >
                      <div className="flex items-center gap-3">
                        <Wifi size={16} className={connectedWifi === net.name ? '' : 'text-slate-600'} style={{ color: connectedWifi === net.name ? accentColor : undefined }} />
                        <span className={`text-sm font-medium ${connectedWifi === net.name ? '' : 'opacity-80'}`} style={{ color: connectedWifi === net.name ? accentColor : undefined }}>{net.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {connectedWifi === net.name && <span className="text-[10px] font-bold uppercase" style={{ color: accentColor }}>Connected</span>}
                        <ChevronRight size={14} className="opacity-40" />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        );

      default:
        return <div className="p-10 text-center opacity-50">Content for {activeCategory} is coming soon.</div>;
    }
  };

  return (
    <div className={`flex h-full select-text overflow-hidden ${containerClasses}`}>
      {/* Sidebar */}
      <div className={`w-64 border-r p-4 flex flex-col gap-6 ${sidebarClasses}`}>
        <div className="flex items-center gap-3 px-3 py-2">
           <div className="w-10 h-10 rounded-full bg-slate-300 overflow-hidden border-2 border-white/20 shadow-sm">
             <img src={`https://picsum.photos/seed/${userName}/40/40`} alt="User" />
           </div>
           <div className="flex flex-col overflow-hidden">
             <span className="text-xs font-bold truncate">{userName}</span>
             <span className="text-[10px] opacity-60 font-medium">Administrator</span>
           </div>
        </div>

        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Find a setting"
            className={`w-full border rounded-lg pl-9 pr-3 py-2 text-xs focus:ring-2 focus:ring-blue-500/30 outline-none transition-shadow ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-800'}`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <nav className="flex-1 flex flex-col gap-1">
          {sidebarItems.map(item => (
            <button 
              key={item.id}
              onClick={() => setActiveCategory(item.id as Category)}
              className={`flex items-center gap-4 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeCategory === item.id 
                  ? 'text-white shadow-lg' 
                  : 'text-slate-600 hover:bg-white/10 hover:shadow-sm'
              }`}
              style={{ backgroundColor: activeCategory === item.id ? accentColor : undefined, boxShadow: activeCategory === item.id ? `0 10px 15px -3px ${accentColor}40` : undefined }}
            >
              <span className={activeCategory === item.id ? 'text-white' : 'text-slate-400'}>
                {item.icon}
              </span>
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-10 max-w-4xl mx-auto w-full">
        {renderContent()}
      </div>
    </div>
  );
};

export default Settings;
