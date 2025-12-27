
import React from 'react';
import { BRANDING } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: 'chat' | 'dashboard';
  setActiveTab: (tab: 'chat' | 'dashboard') => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const handleOpenKeyDialog = async () => {
    if (window.aistudio?.openSelectKey) {
      await window.aistudio.openSelectKey();
      // Proceeding assuming selection was successful per requirements
    } else {
      alert("API Key selection is only available in the Google AI Studio environment.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-900 bg-slate-50">
      {/* Header */}
      <header className="bg-[#13294B] text-white shadow-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3 md:space-x-4">
            <div className="bg-[#7BAFD4] p-1.5 md:p-2 rounded-xl rotate-3 hover:rotate-0 transition-transform shadow-lg hidden sm:block">
              <svg className="w-6 h-6 md:w-8 md:h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z" />
                <path d="M7.667 10.845l-2.417-.936a1.001 1.001 0 01-.356-.257l-2.507-1.075A1 1 0 001 9.418v5a1 1 0 00.611.92l6.305 2.702a1 1 0 00.784 0l6.305-2.702a1 1 0 00.611-.92v-5a1 1 0 00-1.394-.933l-2.417.936v2.384a1 1 0 01-.611.92l-6.305 2.702a1 1 0 01-.784 0L1.611 15.02a1 1 0 01-.611-.92v-2.19l2.417.936a1 1 0 001.394-.933V10.845z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-header font-black tracking-tight leading-tight">{BRANDING.name}</h1>
              <p className="text-[8px] md:text-[10px] text-[#7BAFD4] uppercase tracking-[0.2em] font-bold">{BRANDING.slogan}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <nav className="flex space-x-1 bg-white/5 p-1 rounded-xl backdrop-blur-md">
              <button 
                onClick={() => setActiveTab('chat')}
                className={`px-3 md:px-5 py-2 rounded-lg transition-all text-xs md:text-sm font-semibold ${activeTab === 'chat' ? 'bg-[#7BAFD4] text-white shadow-md' : 'hover:bg-white/10 text-slate-300'}`}
              >
                Chat
              </button>
              <button 
                onClick={() => setActiveTab('dashboard')}
                className={`px-3 md:px-5 py-2 rounded-lg transition-all text-xs md:text-sm font-semibold ${activeTab === 'dashboard' ? 'bg-[#7BAFD4] text-white shadow-md' : 'hover:bg-white/10 text-slate-300'}`}
              >
                PM
              </button>
            </nav>
            <button 
              onClick={handleOpenKeyDialog}
              className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl transition-all group"
              title="Setup API Key"
            >
              <svg className="w-5 h-5 text-[#7BAFD4] group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 flex flex-col gap-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center">
        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
          {BRANDING.footer}
        </p>
      </footer>
    </div>
  );
};

export default Layout;
