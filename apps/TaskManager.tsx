
import React, { useState, useEffect } from 'react';
import { Activity, XOctagon, Server, Cpu, HardDrive } from 'lucide-react';
import { WindowState } from '../types';

interface TaskManagerProps {
  windows: WindowState[];
  closeWindow: (id: string) => void;
}

const TaskManager: React.FC<TaskManagerProps> = ({ windows, closeWindow }) => {
  // Mock statistics for visual flair
  const [stats, setStats] = useState({ cpu: 12, memory: 45, disk: 2 });

  useEffect(() => {
    const interval = setInterval(() => {
      setStats({
        cpu: Math.floor(Math.random() * 20) + 5,
        memory: Math.floor(Math.random() * 10) + 40,
        disk: Math.floor(Math.random() * 5)
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-full bg-white text-slate-800 select-none">
      {/* Header Stats */}
      <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-200">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <Cpu size={20} />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">CPU</p>
              <p className="text-xl font-bold text-slate-800">{stats.cpu}%</p>
            </div>
          </div>
          <div className="w-[1px] h-8 bg-slate-200" />
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
              <Server size={20} />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Memory</p>
              <p className="text-xl font-bold text-slate-800">{stats.memory}%</p>
            </div>
          </div>
          <div className="w-[1px] h-8 bg-slate-200" />
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
              <HardDrive size={20} />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Disk</p>
              <p className="text-xl font-bold text-slate-800">{stats.disk}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Process List Header */}
      <div className="grid grid-cols-12 gap-2 px-4 py-2 bg-slate-100 border-b border-slate-200 text-xs font-bold text-slate-500">
        <div className="col-span-5 pl-2">Name</div>
        <div className="col-span-2 text-right">PID</div>
        <div className="col-span-2 text-right">Status</div>
        <div className="col-span-2 text-right">Memory</div>
        <div className="col-span-1"></div>
      </div>

      {/* Process List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {windows.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400">
            <Activity size={48} className="mb-2 opacity-20" />
            <p className="text-sm">No user apps running</p>
          </div>
        ) : (
          windows.map((win) => (
            <div 
              key={win.id}
              className="grid grid-cols-12 gap-2 px-4 py-3 border-b border-slate-50 hover:bg-blue-50 items-center group transition-colors"
            >
              <div className="col-span-5 flex items-center gap-3 pl-2">
                <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-slate-500">
                  <Activity size={16} />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-800">{win.title}</div>
                  <div className="text-[10px] text-slate-400 uppercase">{win.appId}.exe</div>
                </div>
              </div>
              <div className="col-span-2 text-right text-xs font-mono text-slate-500">
                {win.id.substring(0, 4).toUpperCase()}
              </div>
              <div className="col-span-2 text-right">
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">
                  Running
                </span>
              </div>
              <div className="col-span-2 text-right text-xs text-slate-600">
                 {Math.floor(Math.random() * 150 + 50)} MB
              </div>
              <div className="col-span-1 flex justify-end">
                <button 
                  onClick={() => closeWindow(win.id)}
                  className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors opacity-0 group-hover:opacity-100"
                  title="End Task"
                >
                  <XOctagon size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Footer */}
      <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 text-[10px] text-slate-500 flex justify-between">
         <span>Processes: {windows.length}</span>
         <span>Up time: 0:42:15:08</span>
      </div>
    </div>
  );
};

export default TaskManager;
