
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { VirtualFile } from '../types';

interface TerminalProps {
  userName: string;
  files: VirtualFile[];
  initialScript?: VirtualFile;
  onClose?: () => void;
}

const Terminal: React.FC<TerminalProps> = ({ userName, files, initialScript, onClose }) => {
  const [currentDirKey, setCurrentDirKey] = useState<'Documents' | 'Desktop' | 'Downloads'>(initialScript?.parentFolder || 'Documents');
  const currentDir = `C:\\Users\\${userName}\\${currentDirKey}`;
  const [history, setHistory] = useState<string[]>([
    'Windows Terminal [Version 10.0.22621.1]',
    '(c) Microsoft Corporation. All rights reserved.',
    ''
  ]);
  const [input, setInput] = useState('');
  const [terminalColor, setTerminalColor] = useState('#cccccc');
  const [isPaused, setIsPaused] = useState(false);
  const [pendingLines, setPendingLines] = useState<string[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const scriptExecutedRef = useRef(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  // Command processing logic (used by interactive input and script execution)
  const executeCommand = useCallback((fullCmd: string, isFromScript: boolean = false): { output: string[], halt: boolean } => {
    const trimmed = fullCmd.trim();
    if (!trimmed) return { output: [], halt: false };
    
    if (trimmed.startsWith('@echo off')) return { output: [], halt: false };
    
    const args = trimmed.split(' ');
    const baseCmd = args[0].toLowerCase();
    const remainingArgs = args.slice(1).join(' ');
    
    let output: string[] = [];
    let halt = false;

    // Check if user is trying to run a file in the current directory
    const matchingFile = files.find(f => f.parentFolder === currentDirKey && (f.name === baseCmd || `${f.name}.${f.extension}` === baseCmd));

    if (matchingFile) {
      if (matchingFile.type === 'batch') {
        // Nested batch execution is complex, just mention it for now or start it
        output = [`Starting nested batch execution for ${matchingFile.name}...`];
        // In a real terminal we'd queue these lines too, but for simplicity:
        const lines = matchingFile.content.split('\n');
        setPendingLines(prev => [...lines, ...prev]);
      } else {
        output = [`Contents of ${matchingFile.name}.${matchingFile.extension}:`, '--------------------', matchingFile.content];
      }
    } else {
      switch (baseCmd) {
        case 'pause':
          output = ['Press any key to continue . . . '];
          halt = true;
          break;
        case 'help':
          output = [
            'CD [dir]       Changes current directory (Documents, Desktop, Downloads).',
            'DIR            Lists files in current virtual directory.',
            'TYPE [file]    Displays file content.',
            'CLS            Clears the screen.',
            'SYSTEMINFO     Displays system information.',
            'VER            Displays Windows version.',
            'WHOAMI         Displays current user.',
            'PAUSE          Suspends processing of a batch file.'
          ];
          break;
        case 'cd':
          if (!remainingArgs) {
            output = [currentDir];
          } else {
            const lower = remainingArgs.toLowerCase();
            if (lower === 'desktop') setCurrentDirKey('Desktop');
            else if (lower === 'documents') setCurrentDirKey('Documents');
            else if (lower === 'downloads') setCurrentDirKey('Downloads');
            else output = ['The system cannot find the path specified.'];
          }
          break;
        case 'dir':
          const localFiles = files.filter(f => f.parentFolder === currentDirKey);
          output = [
            ` Directory of ${currentDir}`,
            '',
            ...localFiles.map(f => `05/23/2024  02:00 PM    ${f.type === 'batch' ? '<BAT>' : '     '}          ${f.name}.${f.extension}`),
            `               ${localFiles.length} File(s)            0 bytes`,
            '               0 Dir(s)  128,849,018,880 bytes free'
          ];
          break;
        case 'cls':
          setHistory([]);
          return { output: [], halt: false };
        case 'whoami':
          output = [`win-sim\\${userName.toLowerCase()}`];
          break;
        case 'ver':
          output = ['Microsoft Windows [Version 11.0.22621]'];
          break;
        case 'echo':
          output = [remainingArgs || ''];
          break;
        case 'systeminfo':
          output = ['Host Name: WIN-SIM-PRO', 'OS Name: Microsoft Windows 11 Pro', 'Registered Owner: ' + userName];
          break;
        default:
          output = [`'${baseCmd}' is not recognized as an internal or external command,`, 'operable program or batch file.'];
      }
    }

    return { output, halt };
  }, [files, currentDirKey, userName, currentDir]);

  // Main execution loop for pending script lines
  useEffect(() => {
    if (pendingLines.length > 0 && !isPaused) {
      const timer = setTimeout(() => {
        const line = pendingLines[0];
        const nextLines = pendingLines.slice(1);
        
        const { output, halt } = executeCommand(line, true);
        
        setHistory(prev => [...prev, `${currentDir}>${line}`, ...output]);
        setPendingLines(nextLines);
        
        if (halt) {
          setIsPaused(true);
        } else if (nextLines.length === 0 && initialScript) {
          // If the script finished and it was an auto-executed one, close window
          if (onClose) onClose();
        }
      }, 50); // Minimal delay for visual effect
      return () => clearTimeout(timer);
    }
  }, [pendingLines, isPaused, executeCommand, currentDir, initialScript, onClose]);

  // Handle automatic script execution on mount
  useEffect(() => {
    if (initialScript && !scriptExecutedRef.current) {
      scriptExecutedRef.current = true;
      setHistory(prev => [...prev, `Executing batch script: ${initialScript.name}.${initialScript.extension}`, '---']);
      setPendingLines(initialScript.content.split('\n'));
    }
  }, [initialScript]);

  // Handle "Press any key to continue"
  useEffect(() => {
    const handleAnyKey = () => {
      if (isPaused) {
        setIsPaused(false);
        setHistory(prev => [...prev, '']); // Add a newline after the pause
        if (pendingLines.length === 0 && initialScript && onClose) {
            onClose();
        }
      }
    };

    if (isPaused) {
      window.addEventListener('keydown', handleAnyKey);
      window.addEventListener('mousedown', handleAnyKey);
    }
    return () => {
      window.removeEventListener('keydown', handleAnyKey);
      window.removeEventListener('mousedown', handleAnyKey);
    };
  }, [isPaused, pendingLines, initialScript, onClose]);

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (isPaused) return;
    if (e.key === 'Enter') {
      const { output } = executeCommand(input);
      setHistory(prev => [...prev, `${currentDir}>${input}`, ...output, '']);
      setInput('');
    }
  };

  return (
    <div 
      className="flex flex-col h-full bg-[#0c0c0c] font-mono text-xs p-3 overflow-y-auto custom-scrollbar select-text"
      style={{ color: terminalColor }}
      onClick={() => document.getElementById('terminal-input')?.focus()}
    >
      <div className="flex-1 whitespace-pre-wrap">
        {history.map((line, i) => (
          <div key={i} className="min-h-[1.2rem]">{line}</div>
        ))}
      </div>
      
      {!isPaused && (
        <div className="flex items-center gap-1">
          <span className="shrink-0">{currentDir}&gt;</span>
          <input
            id="terminal-input"
            type="text"
            autoFocus
            className="flex-1 bg-transparent border-none outline-none font-mono p-0 m-0 focus:ring-0"
            style={{ color: terminalColor }}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleInputKeyDown}
          />
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
};

export default Terminal;
