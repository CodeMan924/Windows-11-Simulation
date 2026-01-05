
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Save, FileCode, Folder, X, Check, Search, ChevronDown, ChevronUp } from 'lucide-react';
import { VirtualFile } from '../types';

interface NotepadProps {
  initialFile?: VirtualFile;
  saveFile: (file: VirtualFile) => void;
}

const Notepad: React.FC<NotepadProps> = ({ initialFile, saveFile }) => {
  const [content, setContent] = useState(initialFile?.content || '');
  const [fileName, setFileName] = useState(initialFile?.name || 'Untitled');
  const [extension, setExtension] = useState(initialFile?.extension || 'txt');
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<'Documents' | 'Desktop' | 'Downloads'>('Documents');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved'>('idle');

  // Find Feature States
  const [isFindOpen, setIsFindOpen] = useState(false);
  const [findQuery, setFindQuery] = useState('');
  const [matchCount, setMatchCount] = useState(0);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(-1);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (initialFile) {
      setContent(initialFile.content);
      setFileName(initialFile.name);
      setExtension(initialFile.extension);
    }
  }, [initialFile]);

  const handleSave = () => {
    const newFile: VirtualFile = {
      id: initialFile?.id || Math.random().toString(36).substr(2, 9),
      name: fileName,
      content,
      parentFolder: selectedFolder,
      extension: extension,
      type: extension === 'bat' ? 'batch' : 'file'
    };
    saveFile(newFile);
    setIsSaveDialogOpen(false);
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 2000);
  };

  const createBatchScript = () => {
    setContent('@echo off\necho Hello World!\npause');
    setFileName('myscript');
    setExtension('bat');
  };

  // Find Logic
  const findInText = useCallback((query: string, direction: 'next' | 'prev' = 'next') => {
    if (!query || !textareaRef.current) return;

    const text = content.toLowerCase();
    const search = query.toLowerCase();
    const cursor = direction === 'next' 
      ? textareaRef.current.selectionEnd 
      : textareaRef.current.selectionStart - 1;

    let index = -1;
    if (direction === 'next') {
      index = text.indexOf(search, cursor);
      if (index === -1) index = text.indexOf(search); // Wrap around
    } else {
      index = text.lastIndexOf(search, cursor);
      if (index === -1) index = text.lastIndexOf(search); // Wrap around
    }

    if (index !== -1) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(index, index + search.length);
      
      // Scroll to view
      const lineHeight = 20; // estimate
      const charsPerLine = textareaRef.current.cols || 80;
      const lineNum = text.substr(0, index).split('\n').length;
      textareaRef.current.scrollTop = (lineNum - 5) * lineHeight;
    }
  }, [content]);

  useEffect(() => {
    if (findQuery) {
      const matches = content.toLowerCase().split(findQuery.toLowerCase()).length - 1;
      setMatchCount(matches);
    } else {
      setMatchCount(0);
    }
  }, [findQuery, content]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey && e.key === 'f') {
      e.preventDefault();
      setIsFindOpen(true);
    }
  };

  return (
    <div className="flex flex-col h-full select-text bg-white relative" onKeyDown={handleKeyDown}>
      {/* Menu Bar */}
      <div className="flex items-center justify-between px-4 py-1 bg-slate-50 border-b border-slate-100 text-[11px] text-slate-600 select-none">
        <div className="flex items-center gap-4">
          <div className="group relative">
            <span className="hover:text-black cursor-pointer">File</span>
            <div className="absolute top-full left-0 hidden group-hover:flex flex-col bg-white border border-slate-200 shadow-lg rounded-md py-1 z-20 w-48">
              <button onClick={() => {setContent(''); setFileName('Untitled'); setExtension('txt');}} className="px-4 py-1.5 hover:bg-slate-100 text-left">New</button>
              <button onClick={createBatchScript} className="px-4 py-1.5 hover:bg-slate-100 text-left flex items-center justify-between">
                New Batch Script <FileCode size={12} className="text-orange-500" />
              </button>
              <div className="h-[1px] bg-slate-100 my-1" />
              <button onClick={() => setIsSaveDialogOpen(true)} className="px-4 py-1.5 hover:bg-slate-100 text-left flex items-center justify-between">
                Save As... <Save size={12} />
              </button>
            </div>
          </div>
          <div className="group relative">
            <span className="hover:text-black cursor-pointer">Edit</span>
            <div className="absolute top-full left-0 hidden group-hover:flex flex-col bg-white border border-slate-200 shadow-lg rounded-md py-1 z-20 w-48">
              <button onClick={() => setIsFindOpen(true)} className="px-4 py-1.5 hover:bg-slate-100 text-left flex items-center justify-between">
                Find... <span className="text-[9px] opacity-50 font-bold">Ctrl+F</span>
              </button>
              <button onClick={() => setContent('')} className="px-4 py-1.5 hover:bg-slate-100 text-left">Clear All</button>
            </div>
          </div>
          <span className="hover:text-black cursor-pointer">View</span>
        </div>
        <div className="flex items-center gap-2">
          {saveStatus === 'saved' && <span className="text-emerald-500 flex items-center gap-1 font-bold animate-pulse"><Check size={12} /> Saved</span>}
          <span className="opacity-50 italic">{fileName}.{extension}</span>
        </div>
      </div>

      {/* Find Bar */}
      {isFindOpen && (
        <div className="absolute top-10 right-4 z-30 w-72 bg-white rounded-lg shadow-xl border border-slate-200 p-2 flex items-center gap-2 animate-start">
          <div className="flex-1 flex items-center gap-2 bg-slate-100 rounded px-2 py-1">
            <Search size={14} className="text-slate-400" />
            <input 
              type="text" 
              placeholder="Find text..." 
              autoFocus
              className="bg-transparent border-none outline-none text-xs w-full text-slate-800"
              value={findQuery}
              onChange={(e) => setFindQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') findInText(findQuery);
                if (e.key === 'Escape') setIsFindOpen(false);
              }}
            />
            {findQuery && (
              <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap">
                {matchCount} results
              </span>
            )}
          </div>
          <div className="flex items-center gap-0.5 border-l border-slate-200 pl-1">
            <button 
              onClick={() => findInText(findQuery, 'prev')}
              className="p-1 hover:bg-slate-100 rounded text-slate-600"
              title="Previous"
            >
              <ChevronUp size={16} />
            </button>
            <button 
              onClick={() => findInText(findQuery, 'next')}
              className="p-1 hover:bg-slate-100 rounded text-slate-600"
              title="Next"
            >
              <ChevronDown size={16} />
            </button>
            <button 
              onClick={() => setIsFindOpen(false)}
              className="p-1 hover:bg-slate-100 rounded text-slate-600 ml-1"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      <textarea 
        ref={textareaRef}
        className="flex-1 p-4 resize-none outline-none font-mono text-sm text-slate-900 bg-white select-text w-full h-full custom-scrollbar"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Start typing..."
        spellCheck={false}
        autoFocus
      />

      {/* Save Dialog Modal */}
      {isSaveDialogOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-[2px]">
          <div className="w-96 bg-white rounded-xl shadow-2xl border border-slate-200 p-6 animate-start">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-800">Save As</h2>
              <button onClick={() => setIsSaveDialogOpen(false)} className="p-1 hover:bg-slate-100 rounded-md transition-colors"><X size={18} /></button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">File Name</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="text" 
                    value={fileName} 
                    onChange={(e) => setFileName(e.target.value)}
                    className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="filename"
                  />
                  <select 
                    value={extension}
                    onChange={(e) => setExtension(e.target.value)}
                    className="border border-slate-200 rounded-lg px-2 py-2 text-sm bg-slate-50 outline-none"
                  >
                    <option value="txt">.txt</option>
                    <option value="bat">.bat</option>
                    <option value="md">.md</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Save Location</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Documents', 'Desktop', 'Downloads'] as const).map(folder => (
                    <button 
                      key={folder}
                      onClick={() => setSelectedFolder(folder)}
                      className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                        selectedFolder === folder ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-slate-50 border-transparent text-slate-500 hover:bg-slate-100'
                      }`}
                    >
                      <Folder size={20} />
                      <span className="text-[10px] font-bold">{folder}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex gap-2">
                <button 
                  onClick={handleSave}
                  className="flex-1 bg-blue-600 text-white font-bold py-2 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20"
                >
                  Save
                </button>
                <button 
                  onClick={() => setIsSaveDialogOpen(false)}
                  className="flex-1 bg-slate-100 text-slate-600 font-bold py-2 rounded-xl hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notepad;
