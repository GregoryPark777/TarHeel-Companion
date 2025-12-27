
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: 'chat' | 'dashboard';
  setActiveTab: (tab: 'chat' | 'dashboard') => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  return (
    <div className="min-h-screen flex flex-col font-sans text-navy">
      {/* Header */}
      <header className="bg-carolina text-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-white p-1.5 rounded-full">
              <svg className="w-6 h-6 text-carolina" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z" />
                <path d="M7.667 10.845l-2.417-.936a1.001 1.001 0 01-.356-.257l-2.507-1.075A1 1 0 001 9.418v5a1 1 0 00.611.92l6.305 2.702a1 1 0 00.784 0l6.305-2.702a1 1 0 00.611-.92v-5a1 1 0 00-1.394-.933l-2.417.936v2.384a1 1 0 01-.611.92l-6.305 2.702a1 1 0 01-.784 0L1.611 15.02a1 1 0 01-.611-.92v-2.19l2.417.936a1 1 0 001.394-.933V10.845z" />
              </svg>
            </div>
            <h1 className="text-xl font-header font-bold tracking-tight">TarHeel Insight AI</h1>
          </div>
          <nav className="flex space-x-1">
            <button 
              onClick={() => setActiveTab('chat')}
              className={`px-4 py-2 rounded-md transition-colors text-sm font-medium ${activeTab === 'chat' ? 'bg-navy/20' : 'hover:bg-white/10'}`}
            >
              Advisory Chat
            </button>
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 rounded-md transition-colors text-sm font-medium ${activeTab === 'dashboard' ? 'bg-navy/20' : 'hover:bg-white/10'}`}
            >
              PM Analytics
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8 flex flex-col">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-4 text-center">
        <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold">
          Built for UNC Students • Go Heels! 🐏
        </p>
      </footer>
    </div>
  );
};

export default Layout;
