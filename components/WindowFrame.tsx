
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
    ? { top: 0, left: 0, width: '100vw', height: 'calc(100vh - 48px)', zIndex: window.zIndex, borderRadius: 0 }
    : { top: window.y, left: window.x, width: window.width, height: window.height, zIndex: window.zIndex };

  return (
    <div 
      ref={frameRef}
      className={`absolute flex flex-col rounded-lg overflow-hidden shadow-2xl mica border animate-window ${isDarkMode ? 'border-gray-700' : 'border-gray-300'}`}
      style={style}
      onClick={() => onFocus(window.id)}
    >
      {/* Title Bar */}
      <div 
        className={`h-9 flex items-center justify-between px-2 cursor-default select-none ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-slate-800'}`}
        onMouseDown={handleMouseDown}
        onDoubleClick={() => onMaximize(window.id)}
      >
        <span className="text-xs font-medium ml-2">{window.title}</span>
        <div className="flex items-center h-full">
          <button onClick={() => onMinimize(window.id)} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"><Minus size={14} /></button>
          <button onClick={() => onMaximize(window.id)} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors">
             {window.isMaximized ? <Square size={12} /> : <Maximize2 size={12} />}
          </button>
          <button onClick={() => onClose(window.id)} className="p-2 hover:bg-red-500 hover:text-white rounded transition-colors"><X size={14} /></button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto relative bg-white">
        {children}
      </div>
    </div>
  );
};

export default WindowFrame;
