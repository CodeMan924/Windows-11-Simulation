
import React, { useState, useCallback, useEffect } from 'react';
import Taskbar from './components/Taskbar';
import StartMenu from './components/StartMenu';
import QuickSettings from './components/QuickSettings';
import WindowFrame from './components/WindowFrame';
import LoginScreen from './components/LoginScreen';
import { AppID, WindowState, VirtualFile } from './types';
import { DESKTOP_ICONS, getIcon } from './constants';

// App components
import Explorer from './apps/Explorer';
import Notepad from './apps/Notepad';
import Copilot from './apps/Copilot';
import Browser from './apps/Browser';
import Terminal from './apps/Terminal';
import Settings from './apps/Settings';

const App: React.FC = () => {
  // OS Boot/Session State
  const [bootPhase, setBootPhase] = useState<'login' | 'welcome' | 'desktop'>('login');
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  // Global File System
  const [files, setFiles] = useState<VirtualFile[]>([
    { id: 'initial-readme', name: 'readme', content: 'Welcome to Windows 11 Simulation!', parentFolder: 'Documents', extension: 'txt', type: 'file' }
  ]);

  const [windows, setWindows] = useState<WindowState[]>([]);
  const [isStartOpen, setIsStartOpen] = useState(false);
  const [isQuickSettingsOpen, setIsQuickSettingsOpen] = useState(false);
  const [maxZIndex, setMaxZIndex] = useState(10);
  const [wallpaper, setWallpaper] = useState('https://images.unsplash.com/photo-1635350736475-c8cef4b21906?auto=format&fit=crop&w=1920&q=80');
  
  // System states
  const [brightness, setBrightness] = useState(100);
  const [volume, setVolume] = useState(65);
  const [wifiEnabled, setWifiEnabled] = useState(true);
  const [connectedWifi, setConnectedWifi] = useState("Neighbour's wifi");
  const [accentColor, setAccentColor] = useState('#0078d4');
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleLogin = (user: string) => {
    setCurrentUser(user);
    setBootPhase('welcome');
    setTimeout(() => {
      setBootPhase('desktop');
    }, 2000);
  };

  const closeMenus = useCallback(() => {
    setIsStartOpen(false);
    setIsQuickSettingsOpen(false);
  }, []);

  const closeWindow = useCallback((id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
  }, []);

  const openApp = useCallback((appId: AppID, payload?: any) => {
    closeMenus();
    
    const existing = windows.find(w => w.appId === appId);
    if (existing) {
      setWindows(prev => prev.map(w => w.id === existing.id ? { 
        ...w, 
        isMinimized: false, 
        zIndex: maxZIndex + 1,
        payload: payload || w.payload 
      } : w));
      setMaxZIndex(prev => prev + 1);
      return;
    }

    const appInfo = DESKTOP_ICONS.find(i => i.id === appId);
    const newWindow: WindowState = {
      id: Math.random().toString(36).substr(2, 9),
      appId,
      title: payload?.name ? `${payload.name}.${payload.extension} - ${appInfo?.label}` : (appInfo?.label || 'Application'),
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      zIndex: maxZIndex + 1,
      x: 100 + (windows.length * 40),
      y: 100 + (windows.length * 40),
      width: appId === 'terminal' ? 700 : (appId === 'settings' ? 900 : 800),
      height: appId === 'terminal' ? 450 : (appId === 'settings' ? 650 : 550),
      payload
    };

    setWindows(prev => [...prev, newWindow]);
    setMaxZIndex(prev => prev + 1);
  }, [windows, maxZIndex, closeMenus]);

  const saveFile = (file: VirtualFile) => {
    setFiles(prev => {
      const exists = prev.find(f => f.name === file.name && f.parentFolder === file.parentFolder);
      if (exists) {
        return prev.map(f => f.id === exists.id ? file : f);
      }
      return [...prev, file];
    });
  };

  const renderAppContent = (win: WindowState) => {
    const commonProps = {
      userName: currentUser || 'User',
      files,
      saveFile,
      openApp,
      onClose: () => closeWindow(win.id)
    };

    switch (win.appId) {
      case 'explorer': return <Explorer {...commonProps} />;
      case 'notepad': return <Notepad {...commonProps} initialFile={win.payload} />;
      case 'copilot': return <Copilot />;
      case 'browser': return <Browser />;
      case 'terminal': return <Terminal {...commonProps} initialScript={win.payload} />;
      case 'settings': return (
        <Settings 
          {...commonProps}
          wallpaper={wallpaper}
          setWallpaper={setWallpaper}
          brightness={brightness}
          setBrightness={setBrightness}
          volume={volume}
          setVolume={setVolume}
          wifiEnabled={wifiEnabled}
          setWifiEnabled={setWifiEnabled}
          connectedWifi={connectedWifi}
          setConnectedWifi={setConnectedWifi}
          accentColor={accentColor}
          setAccentColor={setAccentColor}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          initialCategory={win.payload?.category}
        />
      );
      default: return (
        <div className="flex flex-col items-center justify-center h-full text-slate-400 p-8 text-center">
          {getIcon('monitor', 64, "mb-4 opacity-50")}
          <h3 className="text-lg font-medium text-slate-600">Application not found</h3>
          <p className="text-sm">This feature is coming soon in the next Windows Update.</p>
        </div>
      );
    }
  };

  if (bootPhase === 'login' || bootPhase === 'welcome') {
    return (
      <LoginScreen 
        wallpaper={wallpaper} 
        onLogin={handleLogin} 
        isWelcomePhase={bootPhase === 'welcome'}
        userName={currentUser || ''}
      />
    );
  }

  return (
    <div 
      className={`w-screen h-screen relative overflow-hidden bg-cover bg-center transition-all duration-700 animate-start ${isDarkMode ? 'dark-theme' : ''}`}
      style={{ 
        backgroundImage: `url(${wallpaper})`,
        // @ts-ignore
        '--win-accent': accentColor,
        '--win-accent-soft': `${accentColor}33`
      }}
      onClick={closeMenus}
    >
      <div 
        className="fixed inset-0 pointer-events-none z-[99999] bg-black transition-opacity duration-300" 
        style={{ opacity: (100 - brightness) * 0.008 }} 
      />

      <div className="grid grid-flow-col grid-rows-[repeat(auto-fill,100px)] gap-2 p-4 w-fit">
        {DESKTOP_ICONS.map(icon => (
          <button 
            key={icon.id}
            onDoubleClick={() => openApp(icon.id)}
            className="w-24 h-24 flex flex-col items-center justify-center gap-1 hover:bg-white/10 rounded-md group transition-colors focus:bg-white/20"
          >
            <div className="drop-shadow-lg group-hover:scale-110 transition-transform">
              {getIcon(icon.icon, 40)}
            </div>
            <span className="text-xs text-white drop-shadow-md font-medium px-1 text-center line-clamp-2">
              {icon.label}
            </span>
          </button>
        ))}
      </div>

      {windows.map(win => (
        <WindowFrame
          key={win.id}
          window={win}
          onClose={closeWindow}
          onMinimize={(id) => setWindows(prev => prev.map(w => w.id === id ? { ...w, isMinimized: !w.isMinimized } : w))}
          onMaximize={(id) => setWindows(prev => prev.map(w => w.id === id ? { ...w, isMaximized: !w.isMaximized } : w))}
          onFocus={(id) => {
            setWindows(prev => prev.map(w => w.id === id ? { ...w, zIndex: maxZIndex + 1, isMinimized: false } : w));
            setMaxZIndex(prev => prev + 1);
          }}
          onMove={(id, x, y) => setWindows(prev => prev.map(w => w.id === id ? { ...w, x, y } : w))}
          isDarkMode={isDarkMode}
        >
          {renderAppContent(win)}
        </WindowFrame>
      ))}

      <StartMenu isOpen={isStartOpen} onOpenApp={openApp} userName={currentUser || 'User'} isDarkMode={isDarkMode} />
      <QuickSettings 
        isOpen={isQuickSettingsOpen} 
        onClose={() => setIsQuickSettingsOpen(false)}
        brightness={brightness}
        setBrightness={setBrightness}
        volume={volume}
        setVolume={setVolume}
        wifiEnabled={wifiEnabled}
        setWifiEnabled={setWifiEnabled}
        connectedWifi={connectedWifi}
        setConnectedWifi={setConnectedWifi}
        onOpenApp={openApp}
        accentColor={accentColor}
        isDarkMode={isDarkMode}
      />
      
      <Taskbar 
        windows={windows} 
        onStartClick={() => {
          setIsStartOpen(!isStartOpen);
          setIsQuickSettingsOpen(false);
        }} 
        onQuickSettingsClick={() => {
          setIsQuickSettingsOpen(!isQuickSettingsOpen);
          setIsStartOpen(false);
        }}
        onAppClick={openApp}
        activeAppId={windows.find(w => !w.isMinimized && w.zIndex === maxZIndex)?.appId}
        accentColor={accentColor}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};

export default App;
