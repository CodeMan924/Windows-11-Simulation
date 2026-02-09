
import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, Home, Download, Image, 
  FileText, Star, ArrowUp, Search, FolderPlus,
  LayoutGrid, List, FileCode, Plus, Monitor,
  Type, Terminal, Edit2, Check, X, ChevronDown
} from 'lucide-react';
import { VirtualFile, AppID } from '../types';
import { getIcon } from '../constants';

interface ExplorerProps {
  files: VirtualFile[];
  openApp: (appId: AppID, payload?: any) => void;
  addFolder: (name: string, parentId: string) => void;
  renameFile: (id: string, newName: string) => void;
}

const Explorer: React.FC<ExplorerProps> = ({ files, openApp, addFolder, renameFile }) => {
  const [currentFolder, setCurrentFolder] = useState<string>('Home');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [history, setHistory] = useState<string[]>(['Home']);
  const [historyIndex, setHistoryIndex] = useState(0);
  
  // New State for selection
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  
  // State for renaming
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState('');

  // State for Open With Menu
  const [showOpenWithMenu, setShowOpenWithMenu] = useState(false);

  // Reset rename state and menu when selection changes
  useEffect(() => {
    setIsRenaming(false);
    setRenameValue('');
    setShowOpenWithMenu(false);
  }, [selectedFileId]);

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

  const getFileIcon = (file: VirtualFile, size = 32) => {
    if (file.type === 'folder') return getIcon('folder', size);
    if (file.type === 'batch') return <FileCode size={size} className="text-orange-500" />;
    return <FileText size={size} className="text-blue-400" />;
  };

  const handleNavigate = (newFolder: string) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newFolder);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setCurrentFolder(newFolder);
    setSelectedFileId(null); // Clear selection on navigation
  };

  const handleBack = () => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1);
      setCurrentFolder(history[historyIndex - 1]);
      setSelectedFileId(null);
    }
  };

  const handleForward = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prev => prev + 1);
      setCurrentFolder(history[historyIndex + 1]);
      setSelectedFileId(null);
    }
  };

  const handleUp = () => {
    if (currentFolder === 'Home') return;

    if (['Documents', 'Downloads', 'Desktop'].includes(currentFolder)) {
      handleNavigate('Home');
      return;
    }

    const currentFolderObj = files.find(f => f.id === currentFolder);
    if (currentFolderObj) {
      handleNavigate(currentFolderObj.parentFolder);
    } else {
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
    if (currentFolder === 'Home') return;
    const baseName = "New Folder";
    let name = baseName;
    let count = 1;
    while (files.some(f => f.parentFolder === currentFolder && f.name === name)) {
      count++;
      name = `${baseName} (${count})`;
    }
    addFolder(name, currentFolder);
  };

  const handleRenameSubmit = () => {
    if (selectedFileId && renameValue.trim()) {
      renameFile(selectedFileId, renameValue.trim());
      setIsRenaming(false);
    }
  };

  const currentFolderName = ['Home', 'Documents', 'Downloads', 'Desktop'].includes(currentFolder) 
    ? currentFolder 
    : (files.find(f => f.id === currentFolder)?.name || currentFolder);

  const selectedFile = files.find(f => f.id === selectedFileId);

  return (
    <div className="flex flex-col h-full bg-white text-slate-900 select-none">
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
        <div className="w-48 bg-gray-50 p-2 space-y-1 border-r border-gray-200 flex-shrink-0">
          {navItems.map((item, i) => (
            <div 
              key={i} 
              onClick={() => {
                handleNavigate(item.key);
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

        {/* Content Area - Split between Files and Preview */}
        <div className="flex flex-1 overflow-hidden">
          {/* Files Grid */}
          <div 
            className="flex-1 p-4 overflow-y-auto"
            onClick={() => setSelectedFileId(null)} // Click background to deselect
          >
            <div className="mb-4 flex items-center justify-between">
               <h2 className="text-sm font-bold text-gray-600">{currentFolderName}</h2>
               <div className="flex gap-2">
                 <button onClick={(e) => { e.stopPropagation(); setViewMode('grid'); }} className="p-1 hover:bg-gray-100 rounded"><LayoutGrid size={16} /></button>
                 <button onClick={(e) => { e.stopPropagation(); setViewMode('list'); }} className="p-1 hover:bg-gray-100 rounded"><List size={16} /></button>
               </div>
            </div>

            <div className={`grid gap-2 ${viewMode === 'grid' ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5' : 'grid-cols-1'}`}>
              {/* Show fixed folders if in Home */}
              {currentFolder === 'Home' && (
                <>
                   <div 
                     onClick={(e) => { e.stopPropagation(); handleNavigate('Documents'); }}
                     className={`group cursor-pointer rounded border p-2 ${viewMode === 'grid' ? 'flex flex-col items-center gap-2' : 'flex items-center gap-3'} border-transparent hover:bg-blue-50 hover:border-blue-100`}
                   >
                     {getIcon('folder', 32)}
                     <span className="text-sm text-center line-clamp-1">Documents</span>
                   </div>
                   <div 
                     onClick={(e) => { e.stopPropagation(); handleNavigate('Downloads'); }}
                     className={`group cursor-pointer rounded border p-2 ${viewMode === 'grid' ? 'flex flex-col items-center gap-2' : 'flex items-center gap-3'} border-transparent hover:bg-blue-50 hover:border-blue-100`}
                   >
                     {getIcon('folder', 32)}
                     <span className="text-sm text-center line-clamp-1">Downloads</span>
                   </div>
                </>
              )}

              {filteredFiles.map(file => (
                <div 
                  key={file.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFileId(file.id);
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    handleFileOpen(file);
                  }}
                  className={`group cursor-pointer rounded border p-2 ${
                    viewMode === 'grid' ? 'flex flex-col items-center gap-2' : 'flex items-center gap-3'
                  } ${
                    selectedFileId === file.id 
                      ? 'bg-blue-100 border-blue-300' 
                      : 'border-transparent hover:bg-blue-50 hover:border-blue-100'
                  }`}
                >
                  {getFileIcon(file)}
                  <span className="text-sm text-center line-clamp-1 select-none">{file.name}{file.type !== 'folder' && file.extension ? `.${file.extension}` : ''}</span>
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

          {/* Preview Panel (Visible when a file is selected) */}
          {selectedFile && (
            <div className="w-72 bg-gray-50 border-l border-gray-200 flex flex-col p-6 animate-item overflow-y-auto">
              <div className="flex flex-col items-center text-center mb-6">
                 <div className="mb-4 transform scale-125">
                    {getFileIcon(selectedFile, 64)}
                 </div>
                 
                 {/* Title / Rename Input */}
                 {isRenaming ? (
                    <div className="flex flex-col items-center gap-2 w-full animate-item">
                      <input 
                        value={renameValue} 
                        onChange={(e) => setRenameValue(e.target.value)}
                        className="border border-blue-500 rounded px-2 py-1 text-center w-full outline-none text-sm"
                        autoFocus
                        onKeyDown={(e) => {
                           if (e.key === 'Enter') handleRenameSubmit();
                           if (e.key === 'Escape') setIsRenaming(false);
                        }}
                      />
                      <div className="flex gap-2">
                          <button 
                            onClick={handleRenameSubmit} 
                            className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                            title="Save"
                          >
                            <Check size={14} />
                          </button>
                          <button 
                            onClick={() => setIsRenaming(false)} 
                            className="p-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                            title="Cancel"
                          >
                            <X size={14} />
                          </button>
                      </div>
                    </div>
                 ) : (
                   <h3 className="text-lg font-semibold text-gray-800 break-all">
                      {selectedFile.name}{selectedFile.type !== 'folder' ? `.${selectedFile.extension}` : ''}
                   </h3>
                 )}

                 <p className="text-xs text-gray-500 mt-1 uppercase font-bold tracking-wider">
                    {selectedFile.type === 'folder' ? 'File Folder' : `${selectedFile.extension.toUpperCase()} File`}
                 </p>
              </div>

              {/* Preview Content */}
              {selectedFile.type !== 'folder' && (
                <div className="bg-white border border-gray-200 rounded-lg p-3 mb-6 shadow-sm min-h-[120px] max-h-[200px] overflow-hidden relative">
                   <p className="text-xs text-gray-500 font-mono whitespace-pre-wrap break-words">
                      {selectedFile.content || <span className="italic opacity-50">No content available for preview.</span>}
                   </p>
                   {selectedFile.content && (
                     <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent" />
                   )}
                </div>
              )}

              {/* Actions */}
              <div className="space-y-3">
                 {/* Rename Button for Folders */}
                 {selectedFile.type === 'folder' && !isRenaming && (
                    <button 
                       onClick={() => {
                          setIsRenaming(true);
                          setRenameValue(selectedFile.name);
                       }}
                       className="w-full flex items-center gap-3 px-4 py-2 bg-white hover:bg-blue-50 border border-gray-300 hover:border-blue-300 rounded-lg transition-all shadow-sm group"
                     >
                        <div className="bg-orange-500 text-white p-1 rounded">
                           <Edit2 size={16} />
                        </div>
                        <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700">Rename Folder</span>
                     </button>
                 )}

                 {/* Open Options for Files */}
                 {selectedFile.type !== 'folder' && (
                    <div className="space-y-2">
                       {/* Primary Open */}
                       <button 
                          onClick={() => handleFileOpen(selectedFile)}
                          className="w-full flex items-center gap-3 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-all shadow-sm justify-center group"
                       >
                          <span className="text-sm font-medium">Open</span>
                       </button>

                       {/* Open With Dropdown */}
                       <div className="relative">
                          <button 
                             onClick={() => setShowOpenWithMenu(!showOpenWithMenu)}
                             className="w-full flex items-center justify-between px-4 py-2 bg-white hover:bg-blue-50 border border-gray-300 hover:border-blue-300 rounded-lg transition-all shadow-sm group"
                          >
                             <span className="text-sm font-medium text-gray-700">Open with...</span>
                             <ChevronDown size={14} className={`text-gray-500 transition-transform duration-200 ${showOpenWithMenu ? 'rotate-180' : ''}`} />
                          </button>

                          {showOpenWithMenu && (
                             <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-20 overflow-hidden animate-item flex flex-col p-1">
                                <button 
                                   onClick={() => openApp('notepad', selectedFile)}
                                   className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded-md text-left transition-colors"
                                >
                                   {getIcon('notepad', 16)}
                                   <span className="text-sm text-gray-700">Notepad</span>
                                </button>
                                <button 
                                   onClick={() => openApp('word', selectedFile)}
                                   className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded-md text-left transition-colors"
                                >
                                   {getIcon('word', 16)}
                                   <span className="text-sm text-gray-700">Word</span>
                                </button>
                                {selectedFile.type === 'batch' && (
                                   <button 
                                      onClick={() => openApp('terminal', selectedFile)}
                                      className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded-md text-left transition-colors"
                                   >
                                      {getIcon('terminal', 16)}
                                      <span className="text-sm text-gray-700">Terminal</span>
                                   </button>
                                )}
                             </div>
                          )}
                       </div>
                    </div>
                 )}

                 {/* Default Open for Folders */}
                 {selectedFile.type === 'folder' && (
                    <button 
                       onClick={() => handleNavigate(selectedFile.id)}
                       className="w-full flex items-center gap-3 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-all shadow-sm justify-center"
                     >
                        <span className="text-sm font-medium">Open Folder</span>
                     </button>
                 )}
              </div>
              
              <div className="mt-auto pt-6 text-xs text-gray-400">
                 <p>Size: {selectedFile.content.length} bytes</p>
                 <p>Location: {currentFolder}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Explorer;
