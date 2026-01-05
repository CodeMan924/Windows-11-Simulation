
import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, RotateCw, Home, Lock, Search, MoreHorizontal } from 'lucide-react';

const Browser: React.FC = () => {
  const [urlInput, setUrlInput] = useState('https://www.bing.com');
  const [iframeUrl, setIframeUrl] = useState('https://www.bing.com');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const navigate = (e?: React.FormEvent) => {
    e?.preventDefault();
    let targetUrl = urlInput.trim();
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      targetUrl = 'https://' + targetUrl;
    }
    setIframeUrl(targetUrl);
    setUrlInput(targetUrl);
  };

  const handleRefresh = () => {
    if (iframeRef.current) {
      iframeRef.current.src = iframeUrl;
    }
  };

  const goHome = () => {
    const home = 'https://www.bing.com';
    setUrlInput(home);
    setIframeUrl(home);
  };

  return (
    <div className="flex flex-col h-full bg-white select-text">
      {/* Browser Toolbar */}
      <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border-b border-slate-200">
        <div className="flex items-center gap-1">
          <button className="p-1.5 hover:bg-slate-200 rounded-md text-slate-600 transition-colors disabled:opacity-30">
            <ChevronLeft size={18} />
          </button>
          <button className="p-1.5 hover:bg-slate-200 rounded-md text-slate-600 transition-colors disabled:opacity-30">
            <ChevronRight size={18} />
          </button>
          <button 
            onClick={handleRefresh}
            className="p-1.5 hover:bg-slate-200 rounded-md text-slate-600 transition-colors"
          >
            <RotateCw size={16} />
          </button>
          <button 
            onClick={goHome}
            className="p-1.5 hover:bg-slate-200 rounded-md text-slate-600 transition-colors"
          >
            <Home size={16} />
          </button>
        </div>

        {/* Address Bar */}
        <form onSubmit={navigate} className="flex-1 flex items-center gap-2 bg-white border border-slate-300 rounded-full px-4 py-1 focus-within:ring-2 focus-within:ring-blue-500/30 transition-shadow">
          <Lock size={12} className="text-emerald-600" />
          <input 
            type="text" 
            className="flex-1 bg-transparent border-none outline-none text-xs text-slate-700 h-5"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
          />
          <Search size={14} className="text-slate-400" />
        </form>

        <div className="flex items-center gap-1">
          <button className="p-1.5 hover:bg-slate-200 rounded-md text-slate-600 transition-colors">
            <MoreHorizontal size={18} />
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 bg-white relative">
        {/* Warning for X-Frame-Options */}
        <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-8 text-center opacity-0 hover:opacity-100 transition-opacity bg-white/80 z-10">
          <p className="text-xs text-slate-500 max-w-xs">
            Note: Some websites may block embedding due to security policies (X-Frame-Options). If a page fails to load, try another URL.
          </p>
        </div>
        <iframe 
          ref={iframeRef}
          src={iframeUrl}
          className="w-full h-full border-none"
          title="Browser Content"
          sandbox="allow-forms allow-scripts allow-same-origin allow-popups"
        />
      </div>
    </div>
  );
};

export default Browser;
