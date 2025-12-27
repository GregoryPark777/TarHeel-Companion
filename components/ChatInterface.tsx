import React, { useState, useRef, useEffect } from 'react';
import { Message, FileContext } from '../types';
import { gemini } from '../services/geminiService';
import { analytics } from '../services/analyticsService';
import { BRANDING } from '../constants';

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Welcome to ${BRANDING.shortName}! I'm your dedicated advisor for all things UNC. 

Need help with COMP prerequisites? Looking for the best coffee on Franklin Street? Just ask! 

*Pro tip: Upload a syllabus or degree checklist using the paperclip icon for specialized advice.*`,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<FileContext | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isTyping]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    analytics.trackQuery(input); // REAL TRACKING
    setInput('');
    setIsTyping(true);

    const assistantMsgId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      timestamp: new Date()
    }]);

    try {
      let fullContent = '';
      const stream = gemini.sendMessageStream(userMsg.content, uploadedFile?.content);
      
      let chunkCount = 0;
      for await (const chunk of stream) {
        chunkCount++;
        fullContent += chunk;
        setMessages(prev => prev.map(m => 
          m.id === assistantMsgId ? { ...m, content: fullContent } : m
        ));
      }

      if (chunkCount > 0) {
        analytics.trackSuccess(true); // REAL SUCCESS TRACKING
      }
    } catch (err) {
      console.error("Chat Interaction Error:", err);
      analytics.trackSuccess(false); // REAL FAILURE TRACKING
      // Fixed: Removed forbidden instruction to check .env file and instead directed user to project selection
      setMessages(prev => prev.map(m => 
        m.id === assistantMsgId ? { ...m, content: "My apologies, I'm having trouble reaching the Carolina servers. Please verify your connection or click the key icon in the header to ensure your advisor project is correctly selected. Go Heels!" } : m
      ));
    } finally {
      setIsTyping(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setUploadedFile({
          name: file.name,
          content: text,
          type: file.type
        });
        
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: 'assistant',
          content: `Document received! I've indexed **${file.name}**. What would you like to know about it?`,
          timestamp: new Date()
        }]);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="flex flex-col h-[75vh] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
      {/* File context bar */}
      {uploadedFile && (
        <div className="bg-[#7BAFD4]/10 px-6 py-3 border-b border-[#7BAFD4]/20 flex justify-between items-center animate-in slide-in-from-top duration-300">
          <div className="flex items-center text-xs font-bold text-[#13294B] uppercase tracking-wider">
            <svg className="w-4 h-4 mr-2 text-[#7BAFD4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Active Context: {uploadedFile.name}
          </div>
          <button 
            onClick={() => setUploadedFile(null)}
            className="text-[10px] bg-white border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200 px-2 py-1 rounded transition-all font-bold uppercase"
          >
            Clear
          </button>
        </div>
      )}

      {/* Chat Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50 scroll-smooth">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-500`}>
            <div className={`max-w-[85%] md:max-w-[75%] rounded-2xl px-5 py-4 shadow-sm ${
              m.role === 'user' 
                ? 'bg-[#13294B] text-white rounded-tr-none' 
                : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
            }`}>
              <div className="text-[15px] whitespace-pre-wrap leading-relaxed prose prose-sm prose-slate">
                {m.content || (isTyping && m.role === 'assistant' ? (
                  <div className="flex space-x-1 py-1">
                    <div className="w-2 h-2 bg-[#7BAFD4] rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-[#7BAFD4] rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-[#7BAFD4] rounded-full animate-bounce delay-200"></div>
                  </div>
                ) : '')}
              </div>
              <div className={`text-[9px] mt-2 font-bold uppercase tracking-widest opacity-40 ${m.role === 'user' ? 'text-right' : ''}`}>
                {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-6 border-t border-slate-100 bg-white">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            className="hidden" 
            accept=".txt,.md,.json,.csv"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-3 text-slate-400 hover:text-[#7BAFD4] hover:bg-slate-50 rounded-xl transition-all"
            title="Upload context document"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </button>
          
          <div className="relative flex-1">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about classes, credits, or campus life..."
              className="w-full bg-slate-50 border-2 border-transparent focus:border-[#7BAFD4] focus:bg-white rounded-2xl px-5 py-3 text-sm outline-none transition-all shadow-inner"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-[#7BAFD4]"
              title="Voice Input (Coming Soon)"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </button>
          </div>

          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="bg-[#7BAFD4] hover:bg-[#13294B] text-white p-3.5 rounded-2xl transition-all shadow-lg hover:shadow-[#7BAFD4]/20 disabled:opacity-30 disabled:grayscale transform active:scale-95"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
        <div className="mt-3 text-[9px] text-slate-400 text-center uppercase tracking-[0.3em] font-black">
          Gemini 3 Pro Intelligence • Go Heels
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;