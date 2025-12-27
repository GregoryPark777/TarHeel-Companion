
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import ChatInterface from './components/ChatInterface';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'chat' | 'dashboard'>('chat');
  const [hasKey, setHasKey] = useState<boolean>(false);
  const [checking, setChecking] = useState<boolean>(true);

  useEffect(() => {
    const checkKey = async () => {
      try {
        if (window.aistudio?.hasSelectedApiKey) {
          const selected = await window.aistudio.hasSelectedApiKey();
          // If already selected, or if the process.env.API_KEY is already present
          setHasKey(selected || !!process.env.API_KEY);
        } else {
          setHasKey(!!process.env.API_KEY);
        }
      } catch (err) {
        setHasKey(!!process.env.API_KEY);
      } finally {
        setChecking(false);
      }
    };
    checkKey();
  }, []);

  const handleConnect = async () => {
    if (window.aistudio?.openSelectKey) {
      await window.aistudio.openSelectKey();
      // Per platform guidelines, assume success after triggering the dialog 
      // to mitigate potential race conditions.
      setHasKey(true);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#13294B]">
        <div className="w-12 h-12 border-4 border-[#7BAFD4] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!hasKey) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#13294B] p-6 text-center">
        <div className="max-w-md w-full bg-white rounded-3xl p-10 shadow-2xl">
          <div className="w-20 h-20 bg-carolina/10 rounded-2xl flex items-center justify-center mx-auto mb-8">
            <svg className="w-10 h-10 text-carolina" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-header font-black text-navy uppercase tracking-tighter mb-4">Final Step</h2>
          <p className="text-slate-500 mb-10 text-sm leading-relaxed">
            You have already created your key! Click the button below to open the selection window, ensure your key is selected, and click <strong>"Done"</strong>.
          </p>
          <button 
            onClick={handleConnect}
            className="w-full bg-[#7BAFD4] hover:bg-[#13294B] text-white font-bold py-4 rounded-2xl transition-all shadow-lg hover:shadow-carolina/30 transform active:scale-95 uppercase tracking-widest text-xs"
          >
            Open Selection Window
          </button>
          <div className="mt-8 pt-6 border-t border-slate-100">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-loose">
              Note: Do not manually edit the .env file. The key is managed automatically by Google AI Studio.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-700">
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-header font-black text-navy uppercase tracking-tighter italic">
              {activeTab === 'chat' ? 'Student Advisor' : 'Insight Analytics'}
            </h2>
            <p className="text-gray-500 mt-2 font-medium">
              {activeTab === 'chat' 
                ? 'Get instant answers for course planning, career moves, and life at Chapel Hill.' 
                : 'Monitoring application performance and surfacing student needs through data.'}
            </p>
          </div>
          <div className="flex items-center space-x-2 bg-green-50 px-3 py-1.5 rounded-full border border-green-100">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-black text-green-700 uppercase tracking-widest">Gemini 3 Pro Linked</span>
          </div>
        </div>

        {activeTab === 'chat' ? <ChatInterface /> : <Dashboard />}
      </div>
    </Layout>
  );
};

export default App;
