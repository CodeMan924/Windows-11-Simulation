
import React from 'react';
import { 
  Folder, 
  FileText, 
  Settings, 
  MessageSquare, 
  Calculator, 
  Globe, 
  CloudSun,
  Monitor,
  Search,
  LayoutGrid,
  Terminal as TerminalIcon,
  Activity,
  File
} from 'lucide-react';
import { DesktopIcon } from './types';

export const DESKTOP_ICONS: DesktopIcon[] = [
  { id: 'explorer', label: 'This PC', icon: 'folder' },
  { id: 'browser', label: 'Edge', icon: 'globe' },
  { id: 'word', label: 'Word', icon: 'word' },
  { id: 'notepad', label: 'Notepad', icon: 'file-text' },
  { id: 'terminal', label: 'Terminal', icon: 'terminal' },
  { id: 'copilot', label: 'Copilot', icon: 'message-square' },
  { id: 'calculator', label: 'Calculator', icon: 'calculator' },
  { id: 'settings', label: 'Settings', icon: 'settings' },
  { id: 'taskmanager', label: 'Task Manager', icon: 'activity' },
];

export const getIcon = (iconName: string, size = 24, className = "") => {
  switch (iconName) {
    case 'windows':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <path d="M1.5 1.5H11V11H1.5V1.5Z" fill="#0078D4"/>
          <path d="M13 1.5H22.5V11H13V1.5Z" fill="#0078D4"/>
          <path d="M1.5 13H11V22.5H1.5V13Z" fill="#0078D4"/>
          <path d="M13 13H22.5V22.5H13V13Z" fill="#0078D4"/>
        </svg>
      );
    case 'folder': return <Folder size={size} className={`text-yellow-500 ${className}`} />;
    case 'file-text': return <FileText size={size} className={`text-slate-500 ${className}`} />;
    case 'word': return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <FileText size={size} className="text-blue-700" fill="currentColor" fillOpacity={0.1} />
        <span className="absolute text-[8px] font-bold text-white mb-1">W</span>
      </div>
    );
    case 'settings': return <Settings size={size} className={`text-slate-500 ${className}`} />;
    case 'message-square': return <MessageSquare size={size} className={`text-indigo-500 ${className}`} />;
    case 'calculator': return <Calculator size={size} className={`text-emerald-500 ${className}`} />;
    case 'globe': return <Globe size={size} className={`text-blue-400 ${className}`} />;
    case 'cloud-sun': return <CloudSun size={size} className={`text-orange-400 ${className}`} />;
    case 'search': return <Search size={size} className={className} />;
    case 'terminal': return <TerminalIcon size={size} className={`text-slate-700 ${className}`} />;
    case 'layout-grid': return <LayoutGrid size={size} className={className} />;
    case 'activity': return <Activity size={size} className={`text-cyan-500 ${className}`} />;
    default: return <Monitor size={size} className={className} />;
  }
};
