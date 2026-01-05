
import React, { useState, useRef, useEffect } from 'react';
import { ChevronRight, Home, HardDrive, Download, Image, Music, Film, FileText, Star, Plus, FolderPlus, Edit2, Trash2, Search, FileCode } from 'lucide-react';
import { VirtualFile, AppID } from '../types';

interface ExplorerProps {
  files: VirtualFile[];
  openApp: (appId: AppID, payload?: any) => void;
}

const Explorer: React.FC<ExplorerProps> = ({ files, openApp }) => {
  const [currentFolder, setCurrentFolder] = useState<'Documents' | 'Desktop' | 'Downloads' | 'Home'>('Home');
  const [searchQuery, setSearchQuery] = useState('');

  const navItems = [
    { icon: <Star size={16} className="text-yellow-500" />, label: 'Favorites', key: 'Home' as const },
    { icon: <Home size={16} className="text-blue-500" />, label: 'Home', key: 'Home' as const },
    { icon: <FileText size={16} className="text-blue-400" />, label: 'Documents', key: 'Documents' as const },
    { icon: <Download size={16} className="text-emerald-500" />, label: 'Downloads', key: 'Downloads' as const },
    { icon: <Image size={16} className="text-orange-500" />, label: 'Pictures', key: 'Home' as const },
  ];

  const filteredFiles = files.filter(f => {
    const matchesFolder = currentFolder === 'Home' || f.parentFolder === currentFolder;
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFolder && matchesSearch;
  });

  const getFileIcon = (file: VirtualFile) => {
    if (file.type === 'batch') return <FileCode size={32} className="text-orange-500" />;
    return <FileText size={32} className="text-blue-400" />;
  };

  const handleFileOpen = (file: VirtualFile) => {
    if (file.type === 'batch') {
      // Opening a batch script triggers execution in Terminal
      openApp('terminal', file);
    } else {
      // Regular files open in Notepad
      openApp('notepad', file);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white text-slate-900 select-text">
      <div className="flex items-center gap-2 px-4 py-2 border-b border-slate-100 bg-slate-50/30">
        <div className="flex items-center gap-4 text-slate-400">
          <ChevronRight size={18} className="rotate-180 hover:text-slate-600 cursor-pointer" />
          <ChevronRight size={18} className="hover:text-slate-600 cursor-pointer" />
        </div>
        <div className="flex-1 flex items-center bg-white border border-slate-200 rounded px-2 py-1 text-xs text-slate-600 shadow-sm">
          <Home size={14} className="mr-2 text-blue-500" />
          <span>Home</span>
          <ChevronRight size={12} className="mx-1 opacity-50" />
          <span>{currentFolder}</span>
        </div>
        <div className="w-48 flex items-center bg-white border border-slate-200 rounded px-2 py-1 text-xs text-slate-400 shadow-sm focus-within:ring-1 focus-within:ring-blue-500/30">
          <Search size={14} className="mr-2" />
          <input 
            type="text" 
            placeholder={`Search ${currentFolder}`} 
            className="w-full bg-transparent outline-none text-slate-700"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-48 bg-slate-50/50 border-r border-slate-100 p-2 space-y-1">
          {navItems.map((item, i) => (
            <div 
              key={i} 
              onClick={() => setCurrentFolder(item.key)}
              className={`flex items-center gap-3 px-3 py-1.5 rounded cursor-pointer transition-colors group ${currentFolder === item.key ? 'bg-blue-100/50' : 'hover:bg-slate-200/50'}`}
            >
              <span className="group-hover:scale-110 transition-transform">{item.icon}</span>
              <span className={`text-xs font-medium ${currentFolder === item.key ? 'text-blue-700' : 'text-slate-700'}`}>{item.label}</span>
            </div>
          ))}
        </div>

        <div className="flex-1 p-6 overflow-y-auto bg-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">{currentFolder} Content</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {filteredFiles.map(file => (
              <div 
                key={file.id} 
                onDoubleClick={() => handleFileOpen(file)}
                className="flex flex-col items-center gap-1.5 p-3 hover:bg-slate-50 rounded-xl cursor-pointer group transition-all border border-transparent hover:border-slate-100"
              >
                <div className="group-hover:scale-105 transition-transform drop-shadow-sm">
                  {getFileIcon(file)}
                </div>
                <span className="text-[11px] font-medium text-slate-600 text-center line-clamp-1 w-full">
                  {file.name}.{file.extension}
                </span>
              </div>
            ))}
            
            {filteredFiles.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-12 opacity-30 grayscale">
                <FolderPlus size={48} />
                <p className="text-xs font-bold mt-2">No files here yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explorer;
