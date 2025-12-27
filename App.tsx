import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import ChatInterface from './components/ChatInterface';
import Dashboard from './components/Dashboard';

// Platform helper interface
declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
  interface Window {
    aistudio?: AIStudio;
  }
}

declare const process: {
  env: {
    API_KEY: string;
  };
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'chat' | 'dashboard'>('chat');
  const [hasKey, setHasKey] = useState<boolean>(false);
  const [checking, setChecking] = useState<boolean>(true);

  useEffect(() => {
    const checkKeyStatus = async () => {
      try {
        // Check both the process.env and the platform helper
        const envKey = typeof process !== 'undefined' ? process.env?.API_KEY : null;
        const platformHasKey = window.aistudio?.hasSelectedApiKey 
          ? await window.aistudio.hasSelectedApiKey() 
          : false;

        if ((envKey && envKey !== 'undefined' && envKey.length > 5) || platformHasKey) {
          setHasKey(true);
        }
      } catch (err) {
        console.warn("Key check error:", err);
      } finally {
        setChecking(false);
      }
    };

    checkKeyStatus();
    
    // Check again after a short delay to catch the injection
    const timer = setTimeout(checkKeyStatus, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleConnect = async () => {
    if (window.aistudio?.openSelectKey) {
      try {
        await window.aistudio.openSelectKey();
        // Assume success and proceed to the app
        setHasKey(true);
      } catch (e) {
        console.error("Selection failed:", e);
        setHasKey(true);
      }
    } else {
      setHasKey(true);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#13294B]">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-[#7BAFD4] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-[#7BAFD4] font-bold text-[10px] uppercase tracking-[0.3em] animate-pulse">Syncing Carolina Node...</p>
        </div>
      </div>
    );
  }

  if (!hasKey) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#13294B] p-6 text-center">
        <div className="max-w-md w-full bg-white rounded-3xl p-10 shadow-2xl animate-in zoom-in duration-500">
          <div className="w-20 h-20 bg-[#7BAFD4]/10 rounded-2xl flex items-center justify-center mx-auto mb-8">
            <svg className="w-10 h-10 text-[#7BAFD4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <h2 className="text-2xl font-header font-black text-[#13294B] uppercase tracking-tighter mb-4 italic">TarHeel AI Setup</h2>
          <p className="text-slate-500 mb-8 text-sm leading-relaxed">
            Connect your project to begin using the student advisor. You must select a project with an active billing account.
          </p>
          <button 
            onClick={handleConnect}
            className="w-full bg-[#7BAFD4] hover:bg-[#13294B] text-white font-bold py-4 rounded-2xl transition-all shadow-lg hover:shadow-[#7BAFD4]/30 transform active:scale-95 uppercase tracking-widest text-xs"
          >
            Select Google Cloud Project
          </button>
          <p className="mt-6 text-[10px] text-slate-400 font-bold uppercase tracking-widest italic">Go Heels! 🐏</p>
        </div>
      </div>
    );
  }

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-700">
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <h2 className="text-3xl font-header font-black text-[#13294B] uppercase tracking-tighter italic">
              {activeTab === 'chat' ? 'Student Advisor' : 'Insight Analytics'}
            </h2>
            <p className="text-gray-500 mt-2 font-medium max-w-xl">
              {activeTab === 'chat' 
                ? 'Instant help with courses, credits, and campus life at Chapel Hill.' 
                : 'Aggregated student needs and system performance data.'}
            </p>
          </div>
          <div className="flex items-center space-x-2 bg-green-50 px-3 py-1.5 rounded-full border border-green-100">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-black text-green-700 uppercase tracking-widest">Carolina Node Active</span>
          </div>
        </div>

        {activeTab === 'chat' ? <ChatInterface /> : <Dashboard />}
      </div>
    </Layout>
  );
};

export default App;