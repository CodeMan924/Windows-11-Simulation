
import React, { useState } from 'react';
import { 
  ChevronRight, Home, Download, Image, 
  FileText, Star, ArrowUp, Search, FolderPlus,
  LayoutGrid, List, FileCode
} from 'lucide-react';
import { VirtualFile, AppID } from '../types';

interface ExplorerProps {
  files: VirtualFile[];
  openApp: (appId: AppID, payload?: any) => void;
}

const Explorer: React.FC<ExplorerProps> = ({ files, openApp }) => {
  const [currentFolder, setCurrentFolder] = useState<'Documents' | 'Desktop' | 'Downloads' | 'Home'>('Home');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

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
      openApp('terminal', file);
    } else {
      openApp('notepad', file);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white text-slate-900 select-text">
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border-b border-gray-200">
         <button className="p-1 hover:bg-gray-200 rounded"><ChevronRight size={16} className="rotate-180" /></button>
         <button className="p-1 hover:bg-gray-200 rounded"><ChevronRight size={16} /></button>
         <button className="p-1 hover:bg-gray-200 rounded"><ArrowUp size={16} /></button>

         <div className="flex-1 flex items-center bg-white border border-gray-300 rounded px-3 py-1 text-sm text-gray-700 mx-2">
            <Home size={14} className="mr-2 text-gray-500" />
            <span className="font-medium">Home</span>
            <ChevronRight size={14} className="mx-2 text-gray-400" />
            <span>{currentFolder}</span>
         </div>

         <div className="w-48 flex items-center bg-white border border-gray-300 rounded px-3 py-1 text-sm">
            <Search size={14} className="mr-2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search" 
              className="w-full bg-transparent outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
         </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-48 bg-gray-50 p-2 space-y-1 border-r border-gray-200">
          {navItems.map((item, i) => (
            <div 
              key={i} 
              onClick={() => setCurrentFolder(item.key)}
              className={`flex items-center gap-3 px-3 py-2 rounded cursor-pointer ${currentFolder === item.key ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
            >
              {item.icon}
              <span className="text-sm text-gray-700">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="mb-4 flex items-center justify-between">
             <h2 className="text-sm font-bold text-gray-600">{currentFolder}</h2>
             <div className="flex gap-2">
               <button onClick={() => setViewMode('grid')} className="p-1 hover:bg-gray-100 rounded"><LayoutGrid size={16} /></button>
               <button onClick={() => setViewMode('list')} className="p-1 hover:bg-gray-100 rounded"><List size={16} /></button>
             </div>
          </div>

          <div className={`grid gap-2 ${viewMode === 'grid' ? 'grid-cols-2 sm:grid-cols-4 md:grid-cols-6' : 'grid-cols-1'}`}>
            {filteredFiles.map(file => (
              <div 
                key={file.id} 
                onDoubleClick={() => handleFileOpen(file)}
                className={`group cursor-pointer rounded border border-transparent hover:bg-blue-50 hover:border-blue-100 p-2 ${viewMode === 'grid' ? 'flex flex-col items-center gap-2' : 'flex items-center gap-3'}`}
              >
                {getFileIcon(file)}
                <span className="text-sm text-center line-clamp-1">{file.name}.{file.extension}</span>
              </div>
            ))}
            {filteredFiles.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-20 opacity-40">
                <FolderPlus size={48} />
                <p className="text-sm mt-2">Empty folder</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explorer;
