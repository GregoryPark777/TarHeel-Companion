import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import ChatInterface from './components/ChatInterface';
import Dashboard from './components/Dashboard';

// Define the platform helper interface
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
        // 1. Check if the key is already present in the environment
        const envKey = typeof process !== 'undefined' ? process.env?.API_KEY : null;
        if (envKey && envKey !== 'undefined' && envKey.length > 5) {
          setHasKey(true);
          setChecking(false);
          return;
        }

        // 2. Check the platform helper
        if (window.aistudio?.hasSelectedApiKey) {
          const isSelected = await window.aistudio.hasSelectedApiKey();
          if (isSelected) {
            setHasKey(true);
          }
        }
      } catch (err) {
        console.warn("Key check encountered an error:", err);
      } finally {
        setChecking(false);
      }
    };

    checkKeyStatus();
  }, []);

  const handleConnect = async () => {
    if (window.aistudio?.openSelectKey) {
      try {
        // Open the platform project selection dialog
        await window.aistudio.openSelectKey();
        // MANDATORY: Assume success and proceed immediately to avoid race conditions 
        // with the key injection process.
        setHasKey(true);
      } catch (e) {
        console.error("Failed to open selection window:", e);
        // Fallback: Proceed anyway, the key might be available in the environment
        setHasKey(true);
      }
    } else {
      // If the helper isn't found, we proceed to let the app try using the env key
      setHasKey(true);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#13294B]">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-[#7BAFD4] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-[#7BAFD4] font-bold text-[10px] uppercase tracking-[0.3em] animate-pulse">Initializing TarHeel AI...</p>
        </div>
      </div>
    );
  }

  if (!hasKey) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#13294B] p-6 text-center">
        <div className="max-w-md w-full bg-white rounded-3xl p-10 shadow-2xl">
          <div className="w-20 h-20 bg-[#7BAFD4]/10 rounded-2xl flex items-center justify-center mx-auto mb-8">
            <svg className="w-10 h-10 text-[#7BAFD4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <h2 className="text-2xl font-header font-black text-[#13294B] uppercase tracking-tighter mb-4 italic">Project Selection</h2>
          <p className="text-slate-500 mb-6 text-sm leading-relaxed">
            To provide academic advice, you must link your <strong>TarHeel AI</strong> project. Click below and select your project from the list.
          </p>
          <div className="mb-10 text-[11px] text-slate-400 leading-relaxed px-4">
            Requirement: You must select an API key from a paid Google Cloud project. 
            <a 
              href="https://ai.google.dev/gemini-api/docs/billing" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#7BAFD4] hover:underline ml-1 font-bold"
            >
              Review Billing Documentation
            </a>
          </div>
          <button 
            onClick={handleConnect}
            className="w-full bg-[#7BAFD4] hover:bg-[#13294B] text-white font-bold py-4 rounded-2xl transition-all shadow-lg hover:shadow-[#7BAFD4]/30 transform active:scale-95 uppercase tracking-widest text-xs"
          >
            Open Project List
          </button>
          <div className="mt-8 pt-6 border-t border-slate-100">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">
              Go Heels! 🐏
            </p>
          </div>
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