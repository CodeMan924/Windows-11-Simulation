
import React, { useState, useRef, useEffect } from 'react';
import { 
  Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, 
  List, Undo, Redo, Image, Save, Search, Share2,
  MoreHorizontal, FileText, X, Check, Printer, Type,
  ListOrdered, Minus, Plus, ChevronDown, FolderOpen, SpellCheck,
  BookPlus, EyeOff, Ban
} from 'lucide-react';
import { VirtualFile } from '../types';

interface WordProps {
  initialFile?: VirtualFile;
  files: VirtualFile[];
  saveFile: (file: VirtualFile) => void;
  onClose: () => void;
}

// ----------------------------------------------------------------------
// SPELL CHECK LOGIC
// ----------------------------------------------------------------------

// A small subset of common words for simulation purposes.
// In a real app, this would be a large library or an API.
const INITIAL_COMMON_WORDS = new Set([
  'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i',
  'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
  'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she',
  'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what',
  'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me',
  'windows', 'microsoft', 'computer', 'software', 'system', 'file', 'document',
  'edit', 'view', 'insert', 'format', 'tools', 'table', 'window', 'help',
  'hello', 'world', 'welcome', 'text', 'editor', 'typing', 'spelling', 'check',
  'quick', 'brown', 'fox', 'jumps', 'over', 'lazy', 'dog', 'lorem', 'ipsum',
  'good', 'bad', 'great', 'awesome', 'simulate', 'web', 'react', 'code'
]);

// Levenshtein distance to find closest words
const getLevenshteinDistance = (a: string, b: string): number => {
  const matrix = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[b.length][a.length];
};

const Word: React.FC<WordProps> = ({ initialFile, files, saveFile, onClose }) => {
  // Editor State
  const editorRef = useRef<HTMLDivElement>(null);
  const [fileName, setFileName] = useState(initialFile?.name || 'Document1');
  const [zoom, setZoom] = useState(100);
  const [wordCount, setWordCount] = useState(0);
  const [isSaved, setIsSaved] = useState(!!initialFile);
  
  // UI State
  const [activeTab, setActiveTab] = useState('Home');
  const [showFileMenu, setShowFileMenu] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showOpenDialog, setShowOpenDialog] = useState(false);
  
  // Spell Check State
  const [customDictionary, setCustomDictionary] = useState<Set<string>>(new Set());
  const [ignoredWords, setIgnoredWords] = useState<Set<string>>(new Set()); // For "Ignore All"
  const [ignoredInstances, setIgnoredInstances] = useState<Set<string>>(new Set()); // For "Ignore Once" - simplistic implementation using word+index approximation
  
  const [spellMenu, setSpellMenu] = useState<{
    isOpen: boolean;
    x: number;
    y: number;
    originalWord: string;
    cleanWord: string;
    suggestions: string[];
  }>({ isOpen: false, x: 0, y: 0, originalWord: '', cleanWord: '', suggestions: [] });
  
  // Save Dialog State
  const [saveName, setSaveName] = useState(fileName);
  const [saveLocation, setSaveLocation] = useState<string>('Documents');

  // Initialize content once on mount to prevent cursor jumping
  useEffect(() => {
    if (editorRef.current) {
      if (initialFile) {
        editorRef.current.innerHTML = initialFile.content;
      } else {
        editorRef.current.innerHTML = `<h1 style="text-align: center;">Welcome to Word</h1><p>Type "helo" or "worl" and double-click the text to test the spell checker.</p>`;
      }
      updateStats();
    }
  }, [initialFile]);

  // Click outside to close menus
  useEffect(() => {
    const handleClickOutside = () => {
      if (spellMenu.isOpen) {
        setSpellMenu(prev => ({ ...prev, isOpen: false }));
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [spellMenu.isOpen]);

  const updateStats = () => {
    if (editorRef.current) {
      const text = editorRef.current.innerText || '';
      const words = text.trim().split(/\s+/).filter(w => w.length > 0).length;
      setWordCount(words);
      setIsSaved(false);
    }
  };

  const execCmd = (command: string, value: string = '') => {
    document.execCommand(command, false, value);
    updateStats();
  };

  const handleSave = () => {
    if (!editorRef.current) return;
    
    const newFile: VirtualFile = {
      id: initialFile?.id || Math.random().toString(36).substr(2, 9),
      name: saveName,
      content: editorRef.current.innerHTML,
      parentFolder: saveLocation,
      extension: 'docx', 
      type: 'file'
    };
    
    saveFile(newFile);
    setFileName(saveName);
    setIsSaved(true);
    setShowSaveDialog(false);
    setShowFileMenu(false);
  };

  const handleNew = () => {
    if (editorRef.current) {
      editorRef.current.innerHTML = '';
      setFileName('Document1');
      setIsSaved(false);
      updateStats();
    }
    setShowFileMenu(false);
  };

  const handleOpen = (file: VirtualFile) => {
    if (editorRef.current) {
      editorRef.current.innerHTML = file.content;
      setFileName(file.name);
      setIsSaved(true);
      updateStats();
      setShowOpenDialog(false);
      setShowFileMenu(false);
    }
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    const selection = window.getSelection();
    if (!selection || selection.toString().trim().length === 0) return;

    const originalWord = selection.toString().trim();
    // Remove punctuation for checking
    const cleanWord = originalWord.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "").toLowerCase();

    // Check if ignored or in dictionaries
    if (ignoredWords.has(cleanWord) || customDictionary.has(cleanWord) || ignoredInstances.has(originalWord)) {
      return;
    }

    // If word is NOT in common words, suggest corrections
    if (!INITIAL_COMMON_WORDS.has(cleanWord) && cleanWord.length > 2) {
      const suggestions = Array.from([...INITIAL_COMMON_WORDS, ...customDictionary])
        .map(w => ({ word: w, dist: getLevenshteinDistance(cleanWord, w) }))
        // Filter: Distance must be small (relative to length) to be a "correction"
        .filter(item => item.dist > 0 && item.dist <= 2)
        .sort((a, b) => a.dist - b.dist)
        .slice(0, 3)
        .map(i => i.word);

      // Even if no suggestions, show the menu options
      // Calculate position relative to the editor window
      setSpellMenu({
        isOpen: true,
        x: e.clientX,
        y: e.clientY,
        originalWord,
        cleanWord,
        suggestions
      });
    }
  };

  const applyCorrection = (e: React.MouseEvent, newWord: string) => {
    e.preventDefault(); // Stop focus stealing
    e.stopPropagation();

    if (editorRef.current) {
      editorRef.current.focus();
      
      // Match capitalization of original word if possible
      let replacement = newWord;
      const original = spellMenu.originalWord;
      if (original.charAt(0) === original.charAt(0).toUpperCase()) {
         replacement = newWord.charAt(0).toUpperCase() + newWord.slice(1);
      }

      document.execCommand('insertText', false, replacement);
      setSpellMenu(prev => ({ ...prev, isOpen: false }));
      updateStats();
    }
  };

  const handleIgnoreOnce = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Simple way to ignore specific instance string
    setIgnoredInstances(prev => new Set(prev).add(spellMenu.originalWord));
    setSpellMenu(prev => ({ ...prev, isOpen: false }));
  };

  const handleIgnoreAll = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIgnoredWords(prev => new Set(prev).add(spellMenu.cleanWord));
    setSpellMenu(prev => ({ ...prev, isOpen: false }));
  };

  const handleAddToDictionary = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCustomDictionary(prev => new Set(prev).add(spellMenu.cleanWord));
    setSpellMenu(prev => ({ ...prev, isOpen: false }));
  };

  const onBtnMouseDown = (e: React.MouseEvent, command: string, value?: string) => {
    e.preventDefault(); 
    execCmd(command, value);
  };

  return (
    <div className="flex flex-col h-full bg-[#f3f2f1] text-slate-900 select-none font-sans relative">
      {/* Title Bar */}
      <div className="flex items-center justify-between px-4 py-1.5 bg-[#2b579a] text-white">
        <div className="flex items-center gap-4">
           <div className="flex flex-col leading-none">
              <div className="flex items-center gap-2">
                 <span className="text-xs font-semibold">{fileName}</span>
                 <span className="text-[10px] opacity-80">{isSaved ? ' - Saved' : ' - Unsaved'}</span>
              </div>
           </div>
        </div>
        <div className="flex-1 max-w-lg mx-4">
           <div className="bg-[#466fae] rounded flex items-center px-2 py-1 gap-2">
              <Search size={14} className="text-white/70" />
              <input type="text" placeholder="Search" className="bg-transparent border-none outline-none text-xs text-white placeholder-white/60 w-full" />
           </div>
        </div>
        <div className="flex items-center gap-3">
           <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold">JD</div>
        </div>
      </div>

      {/* Ribbon Tabs */}
      <div className="flex items-center gap-1 px-2 pt-1 bg-white border-b border-slate-200 text-[13px]">
         <button 
            onClick={() => setShowFileMenu(!showFileMenu)}
            className={`px-4 py-1.5 rounded-t text-white bg-[#2b579a] hover:bg-[#1e3e6f] font-medium transition-colors`}
         >
           File
         </button>
         {['Home', 'Insert', 'Layout', 'References', 'Review', 'View'].map((tab) => (
           <button 
             key={tab} 
             onClick={() => setActiveTab(tab)}
             className={`px-3 py-1.5 border-b-2 transition-colors ${activeTab === tab ? 'border-[#2b579a] text-[#2b579a] font-semibold' : 'border-transparent text-slate-600 hover:bg-slate-100'}`}
           >
             {tab}
           </button>
         ))}
      </div>

      {/* File Menu Overlay */}
      {showFileMenu && (
        <div className="absolute top-[85px] left-0 bottom-0 w-64 bg-[#2b579a] text-white z-50 shadow-2xl flex flex-col py-6 animate-panel-up">
           <div className="px-6 mb-6">
              <h2 className="text-xl font-bold">Home</h2>
           </div>
           <nav className="flex flex-col gap-1">
              <button onClick={handleNew} className="px-6 py-3 text-left hover:bg-white/10 flex items-center gap-3"><FileText size={18}/> New</button>
              <button onClick={() => setShowOpenDialog(true)} className="px-6 py-3 text-left hover:bg-white/10 flex items-center gap-3"><FolderOpen size={18}/> Open</button>
              <div className="h-[1px] bg-white/10 my-2 mx-6"></div>
              <button onClick={() => setShowSaveDialog(true)} className="px-6 py-3 text-left hover:bg-white/10 flex items-center gap-3"><Save size={18}/> Save As</button>
              <button onClick={() => window.print()} className="px-6 py-3 text-left hover:bg-white/10 flex items-center gap-3"><Printer size={18}/> Print</button>
              <div className="h-[1px] bg-white/10 my-2 mx-6"></div>
              <button onClick={onClose} className="px-6 py-3 text-left hover:bg-white/10 flex items-center gap-3"><X size={18}/> Close</button>
           </nav>
        </div>
      )}

      {/* Toolbar (Home Tab) */}
      {activeTab === 'Home' && (
        <div className="flex items-center gap-1 px-2 py-2 bg-[#f3f2f1] border-b border-slate-300 h-28 overflow-x-auto whitespace-nowrap">
          
          {/* Clipboard */}
          <div className="flex flex-col px-2 border-r border-slate-300 h-full justify-between pb-1">
             <div className="flex gap-1">
                <button onMouseDown={(e) => onBtnMouseDown(e, 'undo')} className="p-1.5 hover:bg-slate-300 rounded" title="Undo"><Undo size={16}/></button>
                <button onMouseDown={(e) => onBtnMouseDown(e, 'redo')} className="p-1.5 hover:bg-slate-300 rounded" title="Redo"><Redo size={16}/></button>
             </div>
             <span className="text-[11px] text-slate-500 text-center">Undo</span>
          </div>

          {/* Font */}
          <div className="flex flex-col px-3 border-r border-slate-300 h-full gap-1 pb-1">
             <div className="flex gap-1">
                <select onChange={(e) => execCmd('fontName', e.target.value)} className="w-32 h-6 text-xs border border-slate-300 rounded px-1 outline-none">
                   <option value="Calibri">Calibri</option>
                   <option value="Arial">Arial</option>
                   <option value="Times New Roman">Times New Roman</option>
                   <option value="Courier New">Courier New</option>
                </select>
                <select onChange={(e) => execCmd('fontSize', e.target.value)} className="w-12 h-6 text-xs border border-slate-300 rounded px-1 outline-none">
                   <option value="3">11</option>
                   <option value="1">8</option>
                   <option value="2">10</option>
                   <option value="4">14</option>
                   <option value="5">18</option>
                   <option value="6">24</option>
                   <option value="7">36</option>
                </select>
             </div>
             <div className="flex gap-1 mt-1">
                <button onMouseDown={(e) => onBtnMouseDown(e, 'bold')} className="p-1 hover:bg-slate-300 rounded font-bold">B</button>
                <button onMouseDown={(e) => onBtnMouseDown(e, 'italic')} className="p-1 hover:bg-slate-300 rounded italic font-serif">I</button>
                <button onMouseDown={(e) => onBtnMouseDown(e, 'underline')} className="p-1 hover:bg-slate-300 rounded underline">U</button>
                <button onMouseDown={(e) => onBtnMouseDown(e, 'strikeThrough')} className="p-1 hover:bg-slate-300 rounded line-through">ab</button>
                <div className="w-[1px] h-6 bg-slate-300 mx-1"></div>
                <button onMouseDown={(e) => onBtnMouseDown(e, 'foreColor', 'red')} className="p-1 hover:bg-slate-300 rounded text-red-600 font-bold">A</button>
                <button onMouseDown={(e) => onBtnMouseDown(e, 'hiliteColor', 'yellow')} className="p-1 hover:bg-slate-300 rounded bg-yellow-200 border border-slate-300"><Type size={14}/></button>
             </div>
             <span className="text-[11px] text-slate-500 text-center mt-auto">Font</span>
          </div>

          {/* Paragraph */}
          <div className="flex flex-col px-3 border-r border-slate-300 h-full gap-1 pb-1">
             <div className="flex gap-1">
                <button onMouseDown={(e) => onBtnMouseDown(e, 'insertUnorderedList')} className="p-1 hover:bg-slate-300 rounded"><List size={16}/></button>
                <button onMouseDown={(e) => onBtnMouseDown(e, 'insertOrderedList')} className="p-1 hover:bg-slate-300 rounded"><ListOrdered size={16}/></button>
             </div>
             <div className="flex gap-1 mt-1">
                <button onMouseDown={(e) => onBtnMouseDown(e, 'justifyLeft')} className="p-1 hover:bg-slate-300 rounded"><AlignLeft size={16}/></button>
                <button onMouseDown={(e) => onBtnMouseDown(e, 'justifyCenter')} className="p-1 hover:bg-slate-300 rounded"><AlignCenter size={16}/></button>
                <button onMouseDown={(e) => onBtnMouseDown(e, 'justifyRight')} className="p-1 hover:bg-slate-300 rounded"><AlignRight size={16}/></button>
             </div>
             <span className="text-[11px] text-slate-500 text-center mt-auto">Paragraph</span>
          </div>
        </div>
      )}

      {/* Workspace */}
      <div className="flex-1 bg-[#cfcfcf] overflow-y-auto p-8 relative cursor-default" onClick={() => editorRef.current?.focus()}>
         <div className="flex justify-center min-h-full">
            <div 
               ref={editorRef}
               className="bg-white shadow-2xl w-[816px] min-h-[1056px] p-[96px] outline-none text-slate-900 cursor-text select-text print:w-full print:h-auto print:shadow-none print:p-0"
               contentEditable={true}
               suppressContentEditableWarning={true}
               onInput={updateStats}
               onDoubleClick={handleDoubleClick}
               style={{ 
                  transform: `scale(${zoom / 100})`, 
                  transformOrigin: 'top center',
                  fontFamily: 'Calibri, sans-serif'
               }}
            />
         </div>
      </div>

      {/* Spell Check Context Menu */}
      {spellMenu.isOpen && (
        <div 
          className="fixed bg-white border border-slate-300 shadow-xl rounded-md z-[60] py-1 w-56 animate-panel-up"
          style={{ top: spellMenu.y + 10, left: spellMenu.x }}
          onMouseDown={(e) => e.stopPropagation()} 
        >
          <div className="px-3 py-1.5 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
            <SpellCheck size={14} className="text-red-500" />
            <span className="text-xs font-bold text-slate-500">Spelling</span>
          </div>
          
          {spellMenu.suggestions.length > 0 ? (
            spellMenu.suggestions.map((suggestion, idx) => (
              <button
                key={idx}
                onMouseDown={(e) => applyCorrection(e, suggestion)}
                className="w-full text-left px-4 py-2 hover:bg-blue-50 hover:text-blue-700 text-sm font-bold transition-colors"
              >
                {suggestion}
              </button>
            ))
          ) : (
            <div className="px-4 py-2 text-sm text-slate-400 italic">No suggestions</div>
          )}

          <div className="h-[1px] bg-slate-100 my-1"></div>
          
          <button 
             onMouseDown={handleIgnoreOnce}
             className="w-full text-left px-4 py-1.5 text-xs text-slate-600 hover:bg-slate-100 flex items-center gap-2"
          >
            <EyeOff size={12} /> Ignore Once
          </button>
          
          <button 
             onMouseDown={handleIgnoreAll}
             className="w-full text-left px-4 py-1.5 text-xs text-slate-600 hover:bg-slate-100 flex items-center gap-2"
          >
            <Ban size={12} /> Ignore All
          </button>
          
          <button 
             onMouseDown={handleAddToDictionary}
             className="w-full text-left px-4 py-1.5 text-xs text-slate-600 hover:bg-slate-100 flex items-center gap-2"
          >
            <BookPlus size={12} /> Add to Dictionary
          </button>
        </div>
      )}

      {/* Status Bar */}
      <div className="h-6 bg-[#2b579a] text-white flex items-center justify-between px-2 text-[11px] select-none z-10 shrink-0 print:hidden">
         <div className="flex items-center gap-4">
            <span className="hover:bg-white/10 px-1 rounded cursor-pointer">Page 1 of 1</span>
            <span className="hover:bg-white/10 px-1 rounded cursor-pointer">{wordCount} words</span>
            <span className="hover:bg-white/10 px-1 rounded cursor-pointer flex items-center gap-1"><Check size={10}/> English (US)</span>
         </div>
         <div className="flex items-center gap-3">
             <div className="flex items-center gap-2">
                <span className="uppercase">Focus</span>
             </div>
             <div className="w-[1px] h-3 bg-white/30"></div>
             <div className="flex items-center gap-2">
                <Minus size={12} className="cursor-pointer hover:text-white/80" onClick={() => setZoom(Math.max(50, zoom - 10))} />
                <div className="w-24 h-1 bg-white/30 rounded-full relative">
                   <div className="absolute top-0 left-0 h-full bg-white rounded-full" style={{ width: `${Math.min(100, (zoom / 200) * 100)}%` }}></div>
                </div>
                <Plus size={12} className="cursor-pointer hover:text-white/80" onClick={() => setZoom(Math.min(200, zoom + 10))} />
                <span className="w-8 text-right">{zoom}%</span>
             </div>
         </div>
      </div>

      {/* Save Modal */}
      {showSaveDialog && (
        <div className="absolute inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center">
           <div className="bg-white rounded-lg shadow-2xl w-[400px] overflow-hidden animate-window">
              <div className="flex items-center justify-between px-4 py-3 border-b">
                 <h3 className="font-semibold text-sm">Save As</h3>
                 <button onClick={() => setShowSaveDialog(false)} className="hover:bg-red-500 hover:text-white p-1 rounded transition-colors"><X size={16}/></button>
              </div>
              <div className="p-6 space-y-4">
                 <div>
                    <label className="text-xs font-semibold text-slate-500 mb-1 block">File Name</label>
                    <input 
                       type="text" 
                       value={saveName} 
                       onChange={(e) => setSaveName(e.target.value)}
                       className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:border-blue-500 outline-none"
                       autoFocus
                    />
                 </div>
                 <div>
                    <label className="text-xs font-semibold text-slate-500 mb-1 block">Location</label>
                    <div className="grid grid-cols-3 gap-2">
                       {['Documents', 'Desktop', 'Downloads'].map((loc) => (
                          <button 
                             key={loc}
                             onClick={() => setSaveLocation(loc as any)}
                             className={`text-xs py-2 border rounded ${saveLocation === loc ? 'bg-blue-50 border-blue-500 text-blue-700' : 'hover:bg-slate-50 border-slate-200'}`}
                          >
                             {loc}
                          </button>
                       ))}
                    </div>
                 </div>
              </div>
              <div className="px-4 py-3 bg-slate-50 border-t flex justify-end gap-2">
                 <button onClick={() => setShowSaveDialog(false)} className="px-4 py-1.5 text-sm border border-slate-300 rounded hover:bg-white bg-white">Cancel</button>
                 <button onClick={handleSave} className="px-4 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">Save</button>
              </div>
           </div>
        </div>
      )}

      {/* Open Modal */}
      {showOpenDialog && (
        <div className="absolute inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center">
           <div className="bg-white rounded-lg shadow-2xl w-[500px] h-[400px] flex flex-col overflow-hidden animate-window">
              <div className="flex items-center justify-between px-4 py-3 border-b bg-slate-50">
                 <h3 className="font-semibold text-sm">Open File</h3>
                 <button onClick={() => setShowOpenDialog(false)} className="hover:bg-red-500 hover:text-white p-1 rounded transition-colors"><X size={16}/></button>
              </div>
              <div className="flex-1 overflow-y-auto p-2">
                 <div className="grid grid-cols-1 gap-1">
                    {files.filter(f => f.type === 'file').map(file => (
                       <button 
                          key={file.id} 
                          onClick={() => handleOpen(file)}
                          className="flex items-center gap-3 p-3 hover:bg-blue-50 border border-transparent hover:border-blue-100 rounded text-left group"
                       >
                          <div className="bg-blue-100 p-2 rounded text-blue-600">
                             <FileText size={20} />
                          </div>
                          <div className="flex-1">
                             <div className="text-sm font-medium text-slate-700">{file.name}</div>
                             <div className="text-xs text-slate-400">{file.parentFolder} • {file.extension.toUpperCase()}</div>
                          </div>
                       </button>
                    ))}
                    {files.filter(f => f.type === 'file').length === 0 && (
                       <div className="text-center py-10 text-slate-400 text-sm">No files found</div>
                    )}
                 </div>
              </div>
              <div className="px-4 py-3 bg-slate-50 border-t flex justify-end">
                 <button onClick={() => setShowOpenDialog(false)} className="px-4 py-1.5 text-sm border border-slate-300 rounded hover:bg-white bg-white">Cancel</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Word;
