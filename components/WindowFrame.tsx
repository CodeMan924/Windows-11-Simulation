
import React, { useState, useRef, useEffect } from 'react';
import { X, Square, Minus, Maximize2 } from 'lucide-react';
import { WindowState } from '../types';

interface WindowFrameProps {
  window: WindowState;
  onClose: (id: string) => void;
  onMinimize: (id: string) => void;
  onMaximize: (id: string) => void;
  onFocus: (id: string) => void;
  onMove: (id: string, x: number, y: number) => void;
  children: React.ReactNode;
  isDarkMode?: boolean;
}

const WindowFrame: React.FC<WindowFrameProps> = ({ 
  window, 
  onClose, 
  onMinimize, 
  onMaximize, 
  onFocus, 
  onMove,
  children,
  isDarkMode
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const frameRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (window.isMaximized) return;
    onFocus(window.id);
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - window.x,
      y: e.clientY - window.y
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      onMove(window.id, e.clientX - dragOffset.x, e.clientY - dragOffset.y);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, onMove, window.id]);

  if (window.isMinimized) return null;

  const style: React.CSSProperties = window.isMaximized 
    ? { top: 0, left: 0, width: '100vw', height: 'calc(100vh - 48px)', zIndex: window.zIndex }
    : { top: window.y, left: window.x, width: window.width, height: window.height, zIndex: window.zIndex };

  return (
    <div 
      ref={frameRef}
      className={`absolute flex flex-col rounded-xl overflow-hidden transition-all duration-300 border shadow-2xl mica animate-window-open ${isDragging ? 'transition-none opacity-90 scale-[1.01]' : ''} ${window.isMaximized ? 'rounded-none' : ''} ${isDarkMode ? 'border-white/10' : 'border-white/20'}`}
      style={style}
      onClick={() => onFocus(window.id)}
    >
      {/* Title Bar */}
      <div 
        className={`h-10 flex items-center justify-between px-4 cursor-default select-none backdrop-blur-md ${isDarkMode ? 'bg-black/40 text-white' : 'bg-white/20 text-slate-800'}`}
        onMouseDown={handleMouseDown}
        onDoubleClick={() => onMaximize(window.id)}
      >
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold opacity-80">{window.title}</span>
        </div>
        <div className="flex items-center -mr-4">
          <button 
            onClick={(e) => { e.stopPropagation(); onMinimize(window.id); }}
            className={`w-12 h-10 flex items-center justify-center transition-colors ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-black/5'}`}
          >
            <Minus size={14} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onMaximize(window.id); }}
            className={`w-12 h-10 flex items-center justify-center transition-colors ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-black/5'}`}
          >
            {window.isMaximized ? <Square size={10} strokeWidth={2} /> : <Maximize2 size={12} />}
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onClose(window.id); }}
            className="w-12 h-10 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className={`flex-1 overflow-auto ${isDarkMode ? 'bg-[#1c1c1c]' : 'bg-white/90'}`}>
        {children}
      </div>
    </div>
  );
};

export default WindowFrame;
