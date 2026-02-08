
export type AppID = 'explorer' | 'notepad' | 'settings' | 'copilot' | 'calculator' | 'browser' | 'weather' | 'terminal' | 'taskmanager' | 'word';

export interface VirtualFile {
  id: string;
  name: string;
  content: string; // For folders, this can be empty or a description
  parentFolder: string; // Changed from strict union to string to support folder IDs
  extension: string; // For folders, this can be empty
  type: 'file' | 'batch' | 'folder';
}

export interface WindowState {
  id: string;
  appId: AppID;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  x: number;
  y: number;
  width: number;
  height: number;
  payload?: any; // To pass data to apps (like opening a file)
}

export interface DesktopIcon {
  id: AppID;
  label: string;
  icon: string;
}
