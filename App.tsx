
import React, { useState, useCallback, useRef } from 'react';
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
import TaskManager from './apps/TaskManager';
import Word from './apps/Word';

const App: React.FC = () => {
  // OS Boot/Session State
  const [bootPhase, setBootPhase] = useState<'login' | 'welcome' | 'desktop'>('login');
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  // Global File System
  const [files, setFiles] = useState<VirtualFile[]>([
    { id: 'initial-readme', name: 'readme', content: 'Welcome to Windows 11 Simulation!', parentFolder: 'Documents', extension: 'txt', type: 'file' },
    { id: 'initial-projects', name: 'Projects', content: '', parentFolder: 'Documents', extension: '', type: 'folder' }
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

  const desktopRef = useRef<HTMLDivElement>(null);

  const handleLogin = (user: string) => {
    setCurrentUser(user);
    setBootPhase('welcome');
    setTimeout(() => {
      setBootPhase('desktop');
    }, 2000);
  };

  const handleLogOff = useCallback(() => {
    setBootPhase('login');
    setCurrentUser(null);
    setWindows([]);
  }, []);

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
      y: 50 + (windows.length * 40),
      width: appId === 'terminal' ? 700 : (appId === 'settings' ? 900 : (appId === 'taskmanager' ? 600 : (appId === 'word' ? 1000 : 800))),
      height: appId === 'terminal' ? 450 : (appId === 'settings' ? 650 : (appId === 'taskmanager' ? 500 : (appId === 'word' ? 700 : 550))),
      payload
    };

    setWindows(prev => [...prev, newWindow]);
    setMaxZIndex(prev => prev + 1);
  }, [windows, maxZIndex, closeMenus]);

  const saveFile = (file: VirtualFile) => {
    setFiles(prev => {
      const exists = prev.find(f => f.name === file.name && f.parentFolder === file.parentFolder && f.type === file.type);
      if (exists) {
        return prev.map(f => f.id === exists.id ? file : f);
      }
      return [...prev, file];
    });
  };

  const renameFile = (id: string, newName: string) => {
    setFiles(prev => prev.map(f => f.id === id ? { ...f, name: newName } : f));
  };

  const addFolder = (name: string, parentId: string) => {
    const newFolder: VirtualFile = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      content: '',
      parentFolder: parentId,
      extension: '',
      type: 'folder'
    };
    setFiles(prev => [...prev, newFolder]);
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
      case 'explorer': return <Explorer {...commonProps} addFolder={addFolder} renameFile={renameFile} />;
      case 'notepad': return <Notepad {...commonProps} initialFile={win.payload} />;
      case 'word': return <Word {...commonProps} initialFile={win.payload} />;
      case 'copilot': return <Copilot />;
      case 'browser': return <Browser initialUrl={win.payload?.url} />;
      case 'terminal': return <Terminal {...commonProps} initialScript={win.payload} onLogOff={handleLogOff} addFolder={addFolder} />;
      case 'taskmanager': return <TaskManager windows={windows} closeWindow={closeWindow} />;
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
      ref={desktopRef}
      className="w-screen h-screen relative overflow-hidden bg-cover bg-center transition-all duration-500"
      style={{ 
        backgroundImage: `url(${wallpaper})`,
        filter: `brightness(${brightness}%)`
      }}
      onClick={closeMenus}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Desktop Icons */}
      <div className="absolute top-0 left-0 bottom-12 p-2 flex flex-col flex-wrap gap-2 content-start z-0">
        {DESKTOP_ICONS.map(icon => (
          <button
            key={icon.id}
            onClick={(e) => { e.stopPropagation(); }}
            onDoubleClick={() => openApp(icon.id)}
            className="w-20 h-20 flex flex-col items-center justify-center gap-1 rounded hover:bg-white/10 group transition-colors"
          >
            <div className="group-hover:scale-105 transition-transform">
               {getIcon(icon.icon, 36)}
            </div>
            <span className="text-xs text-white text-center drop-shadow-md line-clamp-2 leading-tight">{icon.label}</span>
          </button>
        ))}
      </div>

      {/* Windows */}
      {windows.map(win => (
        <WindowFrame
          key={win.id}
          window={win}
          onClose={closeWindow}
          onMinimize={(id) => setWindows(prev => prev.map(w => w.id === id ? { ...w, isMinimized: true } : w))}
          onMaximize={(id) => setWindows(prev => prev.map(w => w.id === id ? { ...w, isMaximized: !w.isMaximized } : w))}
          onFocus={(id) => {
            setWindows(prev => prev.map(w => w.id === id ? { ...w, zIndex: maxZIndex + 1 } : w));
            setMaxZIndex(prev => prev + 1);
          }}
          onMove={(id, x, y) => setWindows(prev => prev.map(w => w.id === id ? { ...w, x, y } : w))}
          isDarkMode={isDarkMode}
        >
          {renderAppContent(win)}
        </WindowFrame>
      ))}

      {/* Start Menu */}
      <StartMenu 
        isOpen={isStartOpen} 
        onOpenApp={openApp}
        userName={currentUser || 'User'}
        isDarkMode={isDarkMode}
      />

      {/* Quick Settings */}
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

      {/* Taskbar */}
      <Taskbar 
        windows={windows} 
        onStartClick={() => setIsStartOpen(!isStartOpen)}
        onAppClick={(id) => {
          const win = windows.find(w => w.appId === id);
          if (win) {
            if (win.isMinimized) {
              setWindows(prev => prev.map(w => w.id === win.id ? { ...w, isMinimized: false, zIndex: maxZIndex + 1 } : w));
              setMaxZIndex(prev => prev + 1);
            } else {
              // Focus
              setWindows(prev => prev.map(w => w.id === win.id ? { ...w, zIndex: maxZIndex + 1 } : w));
              setMaxZIndex(prev => prev + 1);
            }
          } else {
            openApp(id);
          }
        }}
        onQuickSettingsClick={() => setIsQuickSettingsOpen(!isQuickSettingsOpen)}
        activeAppId={windows.sort((a, b) => b.zIndex - a.zIndex)[0]?.appId}
        accentColor={accentColor}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};

export default App;
