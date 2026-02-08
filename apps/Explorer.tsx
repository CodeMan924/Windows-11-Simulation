
import React, { useState } from 'react';
import { 
  ChevronRight, Home, Download, Image, 
  FileText, Star, ArrowUp, Search, FolderPlus,
  LayoutGrid, List, FileCode, Plus
} from 'lucide-react';
import { VirtualFile, AppID } from '../types';
import { getIcon } from '../constants';

interface ExplorerProps {
  files: VirtualFile[];
  openApp: (appId: AppID, payload?: any) => void;
  addFolder: (name: string, parentId: string) => void;
}

const Explorer: React.FC<ExplorerProps> = ({ files, openApp, addFolder }) => {
  const [currentFolder, setCurrentFolder] = useState<string>('Home');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [history, setHistory] = useState<string[]>(['Home']);
  const [historyIndex, setHistoryIndex] = useState(0);

  const navItems = [
    { icon: <Star size={16} className="text-yellow-500" />, label: 'Favorites', key: 'Home' },
    { icon: <Home size={16} className="text-blue-500" />, label: 'Home', key: 'Home' },
    { icon: <FileText size={16} className="text-blue-400" />, label: 'Documents', key: 'Documents' },
    { icon: <Download size={16} className="text-emerald-500" />, label: 'Downloads', key: 'Downloads' },
    { icon: <Image size={16} className="text-orange-500" />, label: 'Pictures', key: 'Home' },
  ];

  const filteredFiles = files.filter(f => {
    const matchesFolder = currentFolder === 'Home' || f.parentFolder === currentFolder;
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFolder && matchesSearch;
  });

  const getFileIcon = (file: VirtualFile) => {
    if (file.type === 'folder') return getIcon('folder', 32);
    if (file.type === 'batch') return <FileCode size={32} className="text-orange-500" />;
    return <FileText size={32} className="text-blue-400" />;
  };

  const handleNavigate = (newFolder: string) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newFolder);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setCurrentFolder(newFolder);
  };

  const handleBack = () => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1);
      setCurrentFolder(history[historyIndex - 1]);
    }
  };

  const handleForward = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prev => prev + 1);
      setCurrentFolder(history[historyIndex + 1]);
    }
  };

  const handleUp = () => {
    // If current is Home, do nothing
    if (currentFolder === 'Home') return;

    // Check if current folder is a root one
    if (['Documents', 'Downloads', 'Desktop'].includes(currentFolder)) {
      handleNavigate('Home');
      return;
    }

    // Otherwise find the parent object
    const currentFolderObj = files.find(f => f.id === currentFolder);
    if (currentFolderObj) {
      handleNavigate(currentFolderObj.parentFolder);
    } else {
      // Fallback
      handleNavigate('Home');
    }
  };

  const handleFileOpen = (file: VirtualFile) => {
    if (file.type === 'folder') {
      handleNavigate(file.id);
    } else if (file.type === 'batch') {
      openApp('terminal', file);
    } else {
      openApp('notepad', file);
    }
  };

  const createNewFolder = () => {
    if (currentFolder === 'Home') return; // Prevent creating in root aggregation
    const baseName = "New Folder";
    let name = baseName;
    let count = 1;
    // Simple collision avoidance
    while (files.some(f => f.parentFolder === currentFolder && f.name === name)) {
      count++;
      name = `${baseName} (${count})`;
    }
    addFolder(name, currentFolder);
  };

  const currentFolderName = ['Home', 'Documents', 'Downloads', 'Desktop'].includes(currentFolder) 
    ? currentFolder 
    : (files.find(f => f.id === currentFolder)?.name || currentFolder);

  return (
    <div className="flex flex-col h-full bg-white text-slate-900 select-text">
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border-b border-gray-200">
         <div className="flex gap-1">
            <button 
              onClick={handleBack} 
              disabled={historyIndex === 0}
              className="p-1 hover:bg-gray-200 rounded disabled:opacity-30 transition-colors"
            >
              <ChevronRight size={16} className="rotate-180" />
            </button>
            <button 
              onClick={handleForward}
              disabled={historyIndex === history.length - 1}
              className="p-1 hover:bg-gray-200 rounded disabled:opacity-30 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
            <button 
              onClick={handleUp}
              disabled={currentFolder === 'Home'}
              className="p-1 hover:bg-gray-200 rounded disabled:opacity-30 transition-colors"
            >
              <ArrowUp size={16} />
            </button>
         </div>

         <div className="flex-1 flex items-center bg-white border border-gray-300 rounded px-3 py-1 text-sm text-gray-700 mx-2">
            <Home size={14} className="mr-2 text-gray-500" />
            <span className="font-medium">Home</span>
            <ChevronRight size={14} className="mx-2 text-gray-400" />
            <span className="truncate">{currentFolderName}</span>
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

      {/* Toolbar */}
      <div className="px-4 py-2 border-b border-gray-200 bg-white flex gap-2">
         <button 
           onClick={createNewFolder}
           disabled={currentFolder === 'Home'}
           className="flex items-center gap-2 px-3 py-1 hover:bg-gray-100 rounded text-sm disabled:opacity-50 transition-colors"
         >
            <Plus size={16} className="text-blue-600"/> New
         </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-48 bg-gray-50 p-2 space-y-1 border-r border-gray-200">
          {navItems.map((item, i) => (
            <div 
              key={i} 
              onClick={() => {
                handleNavigate(item.key);
                // Reset history stack when clicking sidebar for simplicity in this demo
                setHistory([item.key]); 
                setHistoryIndex(0);
              }}
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
             <h2 className="text-sm font-bold text-gray-600">{currentFolderName}</h2>
             <div className="flex gap-2">
               <button onClick={() => setViewMode('grid')} className="p-1 hover:bg-gray-100 rounded"><LayoutGrid size={16} /></button>
               <button onClick={() => setViewMode('list')} className="p-1 hover:bg-gray-100 rounded"><List size={16} /></button>
             </div>
          </div>

          <div className={`grid gap-2 ${viewMode === 'grid' ? 'grid-cols-2 sm:grid-cols-4 md:grid-cols-6' : 'grid-cols-1'}`}>
            {/* Show fixed folders if in Home */}
            {currentFolder === 'Home' && (
              <>
                 <div 
                   onClick={() => handleNavigate('Documents')}
                   className={`group cursor-pointer rounded border border-transparent hover:bg-blue-50 hover:border-blue-100 p-2 ${viewMode === 'grid' ? 'flex flex-col items-center gap-2' : 'flex items-center gap-3'}`}
                 >
                   {getIcon('folder', 32)}
                   <span className="text-sm text-center line-clamp-1">Documents</span>
                 </div>
                 <div 
                   onClick={() => handleNavigate('Downloads')}
                   className={`group cursor-pointer rounded border border-transparent hover:bg-blue-50 hover:border-blue-100 p-2 ${viewMode === 'grid' ? 'flex flex-col items-center gap-2' : 'flex items-center gap-3'}`}
                 >
                   {getIcon('folder', 32)}
                   <span className="text-sm text-center line-clamp-1">Downloads</span>
                 </div>
              </>
            )}

            {filteredFiles.map(file => (
              <div 
                key={file.id} 
                onDoubleClick={() => handleFileOpen(file)}
                className={`group cursor-pointer rounded border border-transparent hover:bg-blue-50 hover:border-blue-100 p-2 ${viewMode === 'grid' ? 'flex flex-col items-center gap-2' : 'flex items-center gap-3'}`}
              >
                {getFileIcon(file)}
                <span className="text-sm text-center line-clamp-1">{file.name}{file.type !== 'folder' && file.extension ? `.${file.extension}` : ''}</span>
              </div>
            ))}
            
            {filteredFiles.length === 0 && currentFolder !== 'Home' && (
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
