
import React, { useState, useEffect } from 'react';
import { User, Power, Wifi, Accessibility, ChevronRight, Plus, AlertTriangle, X } from 'lucide-react';

interface LoginScreenProps {
  wallpaper: string;
  onLogin: (user: string, password?: string) => void;
  isWelcomePhase: boolean;
  userName: string;
  users: string[]; // List of available users
  onAddUser?: () => void; // Optional callback to add new user
  onReset?: () => void; // Callback for factory reset
}

const LoginScreen: React.FC<LoginScreenProps> = ({ wallpaper, onLogin, isWelcomePhase, userName, users, onAddUser, onReset }) => {
  const [selectedUser, setSelectedUser] = useState<string | null>(users.length === 1 ? users[0] : null);
  const [password, setPassword] = useState('');
  const [time, setTime] = useState(new Date());
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const handleLoginClick = () => {
    if (selectedUser) {
      onLogin(selectedUser, password);
    }
  };

  const handleResetClick = () => {
    if (onReset) {
      onReset();
    }
    setShowResetConfirm(false);
  };

  if (isWelcomePhase) {
    return (
      <div 
        className="w-screen h-screen flex flex-col items-center justify-center bg-cover bg-center transition-all duration-1000"
        style={{ backgroundImage: `url(${wallpaper})` }}
      >
        <div className="absolute inset-0 bg-black/30 backdrop-blur-xl transition-all" />
        <div className="z-10 flex flex-col items-center animate-start">
          <div className="w-32 h-32 rounded-full bg-white/20 border border-white/30 flex items-center justify-center mb-6 shadow-2xl overflow-hidden">
            <img src={`https://picsum.photos/seed/${userName}/128/128`} alt={userName} className="w-full h-full object-cover" />
          </div>
          <h1 className="text-4xl font-light text-white mb-2 tracking-tight">Welcome</h1>
          <p className="text-xl text-white/80 font-medium">{userName}</p>
          <div className="mt-8">
            <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="w-screen h-screen relative bg-cover bg-center transition-all duration-700 overflow-hidden"
      style={{ backgroundImage: `url(${wallpaper})` }}
    >
      <div className="absolute inset-0 bg-black/20 backdrop-blur-md" />
      
      {/* Top Clock */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 flex flex-col items-center z-10 text-white">
        <h2 className="text-8xl font-bold tracking-tighter drop-shadow-2xl">
          {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
        </h2>
        <p className="text-xl font-medium mt-2 drop-shadow-md">
          {time.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Main Login Box */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pt-24">
        {!selectedUser ? (
          <div className="flex gap-8 animate-start flex-wrap justify-center max-w-4xl px-8">
            {users.map(u => (
              <button 
                key={u}
                onClick={() => setSelectedUser(u)}
                className="flex flex-col items-center gap-4 group hover:scale-105 transition-all p-8 rounded-3xl hover:bg-white/10"
              >
                <div className="w-32 h-32 rounded-full bg-white/20 border border-white/30 flex items-center justify-center shadow-2xl overflow-hidden">
                   <img src={`https://picsum.photos/seed/${u}/128/128`} alt={u} className="w-full h-full object-cover opacity-90 group-hover:opacity-100" />
                </div>
                <span className="text-xl font-semibold text-white drop-shadow-md">{u}</span>
              </button>
            ))}
            
            {onAddUser && (
               <button 
                onClick={onAddUser}
                className="flex flex-col items-center gap-4 group hover:scale-105 transition-all p-8 rounded-3xl hover:bg-white/10"
              >
                <div className="w-32 h-32 rounded-full bg-white/10 border border-dashed border-white/30 flex items-center justify-center shadow-xl group-hover:border-white/50">
                   <Plus size={48} className="text-white/50 group-hover:text-white" />
                </div>
                <span className="text-xl font-semibold text-white/70 drop-shadow-md group-hover:text-white">Add User</span>
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center animate-start w-full max-w-sm">
            <div className="w-32 h-32 rounded-full bg-white/20 border border-white/30 flex items-center justify-center mb-6 shadow-2xl overflow-hidden">
              <img src={`https://picsum.photos/seed/${selectedUser}/128/128`} alt={selectedUser} className="w-full h-full object-cover" />
            </div>
            <h3 className="text-3xl font-medium text-white mb-8 tracking-tight drop-shadow-md">{selectedUser}</h3>
            
            <div className="w-full flex flex-col gap-4">
               <div className="relative group">
                <input 
                  type="password" 
                  placeholder="Password" 
                  autoFocus
                  className="w-full bg-black/40 border-b-2 border-white/20 text-white px-4 py-2 text-sm focus:outline-none focus:border-blue-400 transition-colors backdrop-blur-lg rounded-t-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLoginClick()}
                />
                <button 
                  onClick={handleLoginClick}
                  className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-white/60 hover:text-white transition-colors"
                >
                  <ChevronRight size={20} className="rotate-0" />
                </button>
               </div>
               <div className="flex justify-center">
                 <button 
                   onClick={() => setShowResetConfirm(true)}
                   className="text-white/60 text-xs hover:text-white transition-colors font-medium"
                 >
                   I forgot my password
                 </button>
               </div>
            </div>

            {users.length > 1 && (
              <button 
                onClick={() => setSelectedUser(null)}
                className="mt-12 text-white/70 text-sm font-medium hover:text-white flex items-center gap-2 group"
              >
                <ChevronRight size={16} className="rotate-180 transition-transform group-hover:-translate-x-1" />
                Switch user
              </button>
            )}
          </div>
        )}
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-start">
          <div className="bg-[#2b2b2b] text-white rounded-lg shadow-2xl p-6 w-[400px] border border-white/10">
            <div className="flex items-start gap-4 mb-4">
               <div className="p-3 bg-red-500/20 rounded-full">
                 <AlertTriangle size={24} className="text-red-500" />
               </div>
               <div>
                 <h3 className="text-lg font-semibold mb-1">Reset this PC</h3>
                 <p className="text-sm text-white/70 leading-relaxed">
                   Resetting will remove all accounts, personal files, and settings from this device. 
                   <br/><br/>
                   You will need to set up the device again as if it were new.
                 </p>
               </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
               <button 
                 onClick={() => setShowResetConfirm(false)}
                 className="px-4 py-2 text-sm bg-white/10 hover:bg-white/20 rounded transition-colors"
               >
                 Cancel
               </button>
               <button 
                 onClick={handleResetClick}
                 className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded font-medium transition-colors shadow-lg"
               >
                 Reset Everything
               </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Tray */}
      <div className="absolute bottom-10 right-10 flex items-center gap-6 z-20 text-white/80">
        <Wifi size={24} className="cursor-pointer hover:text-white transition-colors" />
        <Accessibility size={24} className="cursor-pointer hover:text-white transition-colors" />
        <Power size={24} className="cursor-pointer hover:text-white transition-colors" />
      </div>
    </div>
  );
};

export default LoginScreen;
