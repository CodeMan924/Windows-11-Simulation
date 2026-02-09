
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { VirtualFile, AppID } from '../types';

interface TerminalProps {
  userName: string;
  files: VirtualFile[];
  initialScript?: VirtualFile;
  onClose?: () => void;
  onLogOff: () => void;
  openApp: (appId: AppID, payload?: any) => void;
  addFolder: (name: string, parentId: string) => void;
}

const Terminal: React.FC<TerminalProps> = ({ userName, files, initialScript, onClose, onLogOff, openApp, addFolder }) => {
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
        // Nested batch execution
        output = [`Starting nested batch execution for ${matchingFile.name}...`];
        const lines = matchingFile.content.split('\n');
        setPendingLines(prev => [...lines, ...prev]);
      } else {
        output = [`Contents of ${matchingFile.name}.${matchingFile.extension}:`, '--------------------', matchingFile.content];
      }
    } else {
      switch (baseCmd) {
        case 'start':
          if (!remainingArgs) {
             openApp('terminal');
          } else {
             const target = remainingArgs.toLowerCase();
             if (target.startsWith('http')) {
               openApp('browser', { url: remainingArgs });
             } else {
               const map: Record<string, AppID> = {
                 'calc': 'calculator',
                 'notepad': 'notepad',
                 'word': 'word',
                 'winword': 'word',
                 'edge': 'browser',
                 'chrome': 'browser',
                 'browser': 'browser',
                 'explorer': 'explorer',
                 'cmd': 'terminal',
                 'taskmgr': 'taskmanager'
               };
               const appId = map[target] || target as AppID;
               // Attempt to open app, ignore if invalid (App will handle error implicitly or show "not found" if we had a way to check)
               openApp(appId);
             }
          }
          break;
        case 'pause':
          output = ['Press any key to continue . . . '];
          halt = true;
          break;
        case 'help':
          output = [
            'For more information on a specific command, type HELP command-name',
            'CD             Changes the current directory.',
            'CLS            Clears the screen.',
            'COLOR          Sets the default console foreground and background colors.',
            'DATE           Displays or sets the date.',
            'DIR            Displays a list of files and subdirectories in a directory.',
            'ECHO           Displays messages, or turns command echoing on or off.',
            'EXIT           Quits the CMD.EXE program (closes this window).',
            'HOSTNAME       Displays the host name of the full computer name.',
            'IPCONFIG       Displays all current TCP/IP network configuration values.',
            'LOGOFF         Logs off the current user.',
            'MD             Creates a directory.',
            'MKDIR          Creates a directory.',
            'PAUSE          Suspends processing of a batch file and displays a message.',
            'PING           Verifies IP-level connectivity to another TCP/IP computer.',
            'START          Starts a separate window to run a specified program or command.',
            'SYSTEMINFO     Displays machine specific properties and configuration.',
            'TIME           Displays or sets the system time.',
            'TYPE           Displays the contents of a text file.',
            'VER            Displays the Windows version.',
            'WHOAMI         Displays user name.',
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
            ...localFiles.map(f => `05/23/2024  02:00 PM    ${f.type === 'batch' ? '<BAT>' : '     '}          ${f.name}${f.extension ? '.'+f.extension : ''}`),
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
        case 'hostname':
           output = ['WIN-SIM-PRO'];
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
        case 'logoff':
          output = ['Logging off...'];
          setTimeout(onLogOff, 800);
          break;
        case 'date':
          output = [`The current date is: ${new Date().toLocaleDateString()}`];
          break;
        case 'time':
          output = [`The current time is: ${new Date().toLocaleTimeString()}`];
          break;
        case 'exit':
          if (onClose) onClose();
          break;
        case 'mkdir':
        case 'md':
           if (remainingArgs) {
             addFolder(remainingArgs, currentDirKey);
             output = [];
           } else {
             output = ['The syntax of the command is incorrect.'];
           }
           break;
        case 'ipconfig':
           output = [
             '',
             'Windows IP Configuration',
             '',
             'Ethernet adapter Ethernet:',
             '',
             '   Connection-specific DNS Suffix  . : localdomain',
             '   IPv6 Address. . . . . . . . . . . : fe80::1c4b:9b3a:22d1:8821%12',
             '   IPv4 Address. . . . . . . . . . . : 192.168.1.105',
             '   Subnet Mask . . . . . . . . . . . : 255.255.255.0',
             '   Default Gateway . . . . . . . . . : 192.168.1.1'
           ];
           break;
        case 'color':
           const colorMap: Record<string, string> = {
             '0': '#000000', '1': '#000080', '2': '#008000', '3': '#008080',
             '4': '#800000', '5': '#800080', '6': '#808000', '7': '#c0c0c0',
             '8': '#808080', '9': '#0000ff', 'a': '#00ff00', 'b': '#00ffff',
             'c': '#ff0000', 'd': '#ff00ff', 'e': '#ffff00', 'f': '#ffffff'
           };
           // Simple parser: takes last hex digit as foreground
           if (remainingArgs.length > 0) {
             const fg = remainingArgs[remainingArgs.length - 1].toLowerCase();
             if (colorMap[fg]) setTerminalColor(colorMap[fg]);
           }
           break;
        case 'ping':
           const targetHost = remainingArgs || '127.0.0.1';
           output = [`Pinging ${targetHost} with 32 bytes of data:`];
           const replies = [
             `echo Reply from ${targetHost}: bytes=32 time<1ms TTL=128`,
             `echo Reply from ${targetHost}: bytes=32 time<1ms TTL=128`,
             `echo Reply from ${targetHost}: bytes=32 time<1ms TTL=128`,
             `echo Reply from ${targetHost}: bytes=32 time<1ms TTL=128`,
             `echo Ping statistics for ${targetHost}:`,
             `echo     Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),`
           ];
           // Delay execution to simulate ping
           // We cheat by injecting 'echo' commands into the pendingLines queue which has a built-in delay
           setPendingLines(prev => [...replies, ...prev]);
           break;
        case 'type':
           if (remainingArgs) {
              const f = files.find(file => file.parentFolder === currentDirKey && (file.name === remainingArgs || `${file.name}.${file.extension}` === remainingArgs));
              if (f) {
                output = f.content.split('\n');
              } else {
                output = ['The system cannot find the file specified.'];
              }
           } else {
              output = ['The syntax of the command is incorrect.'];
           }
           break;
        default:
          output = [`'${baseCmd}' is not recognized as an internal or external command,`, 'operable program or batch file.'];
      }
    }

    return { output, halt };
  }, [files, currentDirKey, userName, currentDir, onLogOff, openApp, addFolder, onClose]);

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
      }, 500); // Increased delay for ping effect visibility
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
