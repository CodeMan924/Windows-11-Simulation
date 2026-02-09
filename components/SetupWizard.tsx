
import React, { useState } from 'react';
import { ArrowRight, User, Monitor, Globe, Check, Lock, RefreshCw } from 'lucide-react';

interface SetupWizardProps {
  onComplete: (username: string, password?: string) => void;
}

const SetupWizard: React.FC<SetupWizardProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1); // 1: Welcome, 2: Downloading, 3: Create Account
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const startDownloadSimulation = () => {
    setStep(2);
    setDownloadProgress(0);
    setIsAnimating(false);

    let current = 0;

    const processTick = () => {
      const chance = Math.random();
      let increment = 0;
      let delay = 0;

      // Logic to mimic natural download speeds (stalls, bursts, steady)
      if (current > 92) {
        // The last few percent are always the slowest (processing/installing)
        // Simulates the "stuck at 99%" phenomenon or finalization
        if (Math.random() > 0.6) {
             increment = Math.random() * 1; 
             delay = Math.random() * 1000 + 500;
        } else {
             increment = 0;
             delay = Math.random() * 2000 + 500; 
        }
      } else if (chance < 0.15) {
        // Stall/Hang (15% chance) - Simulates network lag
        increment = 0;
        delay = Math.random() * 1500 + 500;
      } else if (chance < 0.3) {
        // Fast Burst (15% chance) - Simulates speed spike
        increment = Math.random() * 15 + 5;
        delay = 100;
      } else {
        // Steady Stream (70% chance) - Normal download
        increment = Math.random() * 2 + 0.2;
        delay = Math.random() * 200 + 30;
      }

      current += increment;

      if (current >= 100) {
        current = 100;
        setDownloadProgress(100);
        
        // Wait at 100% for a moment before transitioning
        setTimeout(() => {
            setIsAnimating(true);
            setTimeout(() => {
                setStep(3);
                setIsAnimating(false);
            }, 600);
        }, 1200);
      } else {
        setDownloadProgress(current);
        setTimeout(processTick, delay);
      }
    };

    // Initial delay before starting
    setTimeout(processTick, 800);
  };

  const handleNext = () => {
    if (step === 1) {
      setIsAnimating(true);
      setTimeout(() => {
        startDownloadSimulation();
      }, 500);
    } else if (step === 3) {
      if (username.trim()) {
        setIsAnimating(true);
        setTimeout(() => {
           onComplete(username, password);
        }, 800);
      }
    }
  };

  const getStatusText = () => {
    if (downloadProgress < 5) return "Checking for updates...";
    if (downloadProgress < 20) return "Connecting to servers...";
    if (downloadProgress < 60) return "Downloading system files...";
    if (downloadProgress < 85) return "Installing security intelligence...";
    return "Finishing up...";
  };

  return (
    <div className="w-screen h-screen bg-[#0078d4] flex items-center justify-center font-sans text-white overflow-hidden relative select-none">
      {/* Background Bloom Effect */}
      <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-[#4cc2ff] rounded-full blur-[120px] opacity-20 pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-[#004e8c] rounded-full blur-[120px] opacity-20 pointer-events-none" />

      <div className={`transition-all duration-700 flex flex-col items-center max-w-2xl w-full p-8 z-10 ${isAnimating ? 'opacity-0 translate-y-8 blur-sm' : 'opacity-100 translate-y-0 blur-0'}`}>
        
        {step === 1 && (
          <div className="flex flex-col items-center text-center">
            <div className="mb-12 animate-start">
               <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm shadow-xl">
                  <Monitor size={48} className="text-white" />
               </div>
            </div>
            <h1 className="text-4xl font-semibold mb-4 animate-item tracking-tight" style={{ animationDelay: '0.1s' }}>Welcome to Windows</h1>
            <p className="text-xl opacity-80 mb-12 max-w-md animate-item" style={{ animationDelay: '0.2s' }}>
              Let's get things set up for you. This won't take long.
            </p>
            <button 
              onClick={handleNext}
              className="bg-white text-[#0078d4] px-10 py-3 rounded-lg font-semibold hover:bg-white/90 transition-all shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 animate-item"
              style={{ animationDelay: '0.3s' }}
            >
              Get Started
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col items-center text-center max-w-md w-full animate-start">
            <div className="mb-8 relative">
                <div className="absolute inset-0 border-4 border-white/10 rounded-full"></div>
                <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
            </div>
            
            <h2 className="text-2xl font-light mb-2 tracking-wide">Getting things ready</h2>
            <p className="text-white/70 mb-8 text-sm min-h-[20px] transition-all duration-300">
               {getStatusText()}
            </p>
            
            <div className="w-full bg-black/20 h-1.5 rounded-full overflow-hidden mb-3 border border-white/5">
              <div 
                  className="h-full bg-white transition-all duration-500 ease-out shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                  style={{ width: `${downloadProgress}%` }}
              />
            </div>
            
            <div className="w-full flex justify-between text-xs font-mono opacity-60">
                <span>WIN-11-24H2-UPDATE</span>
                <span>{Math.round(downloadProgress)}%</span>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="w-full max-w-md bg-[#202020]/10 backdrop-blur-md p-8 rounded-2xl border border-white/10 shadow-2xl animate-start">
            <h1 className="text-2xl font-semibold mb-2">Create your account</h1>
            <p className="text-sm opacity-70 mb-8 animate-item" style={{ animationDelay: '0.1s' }}>Who's going to use this device?</p>
            
            <div className="space-y-4 animate-item" style={{ animationDelay: '0.2s' }}>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider opacity-60 mb-1.5 block">User Name</label>
                <div className="w-full bg-black/20 text-white rounded-lg flex items-center border border-white/10 focus-within:bg-black/40 focus-within:border-white/30 transition-all">
                  <div className="pl-3 text-white/50"><User size={18} /></div>
                  <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter a name"
                    className="w-full p-3 outline-none bg-transparent placeholder-white/30"
                    autoFocus
                    onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider opacity-60 mb-1.5 block">Password (Optional)</label>
                <div className="w-full bg-black/20 text-white rounded-lg flex items-center border border-white/10 focus-within:bg-black/40 focus-within:border-white/30 transition-all">
                  <div className="pl-3 text-white/50"><Lock size={18} /></div>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter a password"
                    className="w-full p-3 outline-none bg-transparent placeholder-white/30"
                    onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end animate-item" style={{ animationDelay: '0.3s' }}>
               <button 
                onClick={handleNext}
                disabled={!username.trim()}
                className="bg-[#0078d4] border border-white/20 text-white px-8 py-2 rounded-lg font-medium hover:bg-[#006cc0] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg flex items-center gap-2"
              >
                Next <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Footer / Branding */}
      <div className="absolute bottom-8 right-8 flex gap-6 z-10">
         <div className="flex items-center gap-2 opacity-60 hover:opacity-100 cursor-pointer transition-opacity">
            <Globe size={16} />
            <span className="text-xs font-medium">English (United States)</span>
         </div>
         <div className="flex items-center gap-2 opacity-60 hover:opacity-100 cursor-pointer transition-opacity">
            <div className="w-4 h-4 text-[10px] flex items-center justify-center border border-white rounded-full">?</div>
            <span className="text-xs font-medium">Accessibility</span>
         </div>
      </div>
    </div>
  );
};

export default SetupWizard;
