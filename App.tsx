
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import ChatInterface from './components/ChatInterface';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'chat' | 'dashboard'>('chat');
  const [hasKey, setHasKey] = useState<boolean | null>(null);

  useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio) {
        const selected = await window.aistudio.hasSelectedApiKey();
        setHasKey(selected);
      } else {
        // If not in an environment with the selector, assume key is provided via env
        setHasKey(!!process.env.API_KEY);
      }
    };
    checkKey();
  }, []);

  const handleOpenKeySelector = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      // Assume success as per race condition mitigation guidelines
      setHasKey(true);
    }
  };

  if (hasKey === false) {
    return (
      <div className="min-h-screen bg-carolina flex items-center justify-center p-4 font-sans">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center animate-in fade-in zoom-in duration-500">
          <div className="bg-carolina/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-carolina" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="text-2xl font-header font-black text-navy uppercase mb-2">Connect to Gemini</h1>
          <p className="text-gray-600 mb-8 leading-relaxed">
            To power TarHeel Insight AI, you need to connect a valid Google Gemini API key. 
            <br/>
            <span className="text-xs font-semibold text-carolina mt-2 block italic">
              Note: This requires a paid project from a supported region.
            </span>
          </p>
          <button 
            onClick={handleOpenKeySelector}
            className="w-full bg-carolina hover:bg-navy text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
          >
            Select API Key
          </button>
          <div className="mt-6 space-y-2">
            <a 
              href="https://ai.google.dev/gemini-api/docs/billing" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-gray-400 hover:text-carolina underline block transition-colors"
            >
              Learn about Gemini Billing & Regions
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (hasKey === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-carolina rounded-full mb-4"></div>
          <div className="text-navy font-bold">Verifying Credentials...</div>
        </div>
      </div>
    );
  }

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-700">
        <div className="mb-8">
          <h2 className="text-3xl font-header font-black text-navy uppercase tracking-tighter italic">
            {activeTab === 'chat' ? 'Student Advisor' : 'Insight Analytics'}
          </h2>
          <p className="text-gray-500 mt-2 font-medium">
            {activeTab === 'chat' 
              ? 'Get instant answers for course planning, career moves, and life at Chapel Hill.' 
              : 'Monitoring application performance and surfacing student needs through data.'}
          </p>
        </div>

        {activeTab === 'chat' ? <ChatInterface /> : <Dashboard />}
      </div>
    </Layout>
  );
};

export default App;
