import React, { useState, useRef, useEffect } from 'react';
import { Message, FileContext } from '../types';
import { gemini } from '../services/geminiService';

const ThinkingWave: React.FC = () => {
  const text = "thinking...";
  return (
    <div className="flex space-x-0.5 py-1">
      {text.split('').map((char, i) => (
        <span 
          key={i} 
          className="animate-wave text-carolina font-bold italic"
          style={{ animationDelay: `${i * 0.1}s` }}
        >
          {char}
        </span>
      ))}
    </div>
  );
};

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello Tar Heel! 🐏 I am your personal Insight AI. Whether you need advice on COMP classes, study spots at Davis Library, or finding your way to South Building, I am here to help. Have a syllabus? Upload it and I can help you parse it!',
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
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmedInput = input.trim();
    if (!trimmedInput || isTyping) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: trimmedInput,
      timestamp: new Date()
    };

    const assistantMsgId = `a-${Date.now()}`;
    const initialAssistantMsg: Message = {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg, initialAssistantMsg]);
    setInput('');
    setIsTyping(true);

    try {
      let accumulatedText = '';
      const stream = gemini.sendMessageStream(trimmedInput, uploadedFile?.content);
      
      for await (const chunk of stream) {
        if (chunk === "ERROR_KEY_INVALID") {
          accumulatedText = "🚨 **API Key Error**: The selected key is invalid or was not found. Please select a valid API key from a paid GCP project.";
          if (window.aistudio) {
            await window.aistudio.openSelectKey();
          }
          break;
        } else if (chunk === "ERROR_QUOTA_EXCEEDED") {
          accumulatedText = "⏳ **Rate Limit**: I'm handling many requests! Please wait a minute and try again.";
          break;
        } else if (chunk.startsWith("ERROR_GENERAL:")) {
          accumulatedText = `⚠️ **System Error**: ${chunk.replace("ERROR_GENERAL:", "")}`;
          break;
        }
        
        accumulatedText += chunk;
        setMessages(prev => prev.map(m => 
          m.id === assistantMsgId ? { ...m, content: accumulatedText } : m
        ));
      }

      if (!accumulatedText) {
        setMessages(prev => prev.map(m => 
          m.id === assistantMsgId ? { ...m, content: "The connection was lost. Please check your API key and internet." } : m
        ));
      }
    } catch (err) {
      console.error("ChatInterface UI Error:", err);
      setMessages(prev => prev.map(m => 
        m.id === assistantMsgId ? { ...m, content: "Snagged on a technical issue. Try again in a second!" } : m
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
          id: `sys-${Date.now()}`,
          role: 'assistant',
          content: `📂 **Context Loaded**: "${file.name}" is now ready for questions!`,
          timestamp: new Date()
        }]);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="flex flex-col h-[75vh] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
      {uploadedFile && (
        <div className="bg-carolina/10 px-4 py-2 border-b border-carolina/20 flex justify-between items-center">
          <div className="flex items-center text-[10px] font-black text-navy uppercase tracking-widest">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            ACTIVE CONTEXT: {uploadedFile.name}
          </div>
          <button 
            onClick={() => setUploadedFile(null)}
            className="text-[10px] text-red-600 font-black hover:bg-red-50 px-2 py-1 rounded transition-colors"
          >
            DISCARD
          </button>
        </div>
      )}

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-slate-50/20">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-1`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm ${
              m.role === 'user' 
                ? 'bg-carolina text-white rounded-tr-none border-b-2 border-r-2 border-navy/10 font-medium' 
                : 'bg-white text-navy border border-slate-100 rounded-tl-none'
            }`}>
              <div className="text-[13px] md:text-sm whitespace-pre-wrap leading-relaxed font-medium">
                {m.content || (isTyping && m.role === 'assistant' ? (
                  <ThinkingWave />
                ) : null)}
              </div>
              <div className={`text-[9px] mt-2 font-black opacity-30 uppercase tracking-widest ${m.role === 'user' ? 'text-right' : ''}`}>
                {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-slate-100 bg-white">
        <form onSubmit={handleSendMessage} className="relative">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            className="hidden" 
            accept=".txt,.md,.json,.csv"
          />
          <div className="flex items-center space-x-2 bg-slate-50 p-1.5 rounded-2xl border-2 border-transparent focus-within:border-carolina/30 focus-within:bg-white transition-all">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2.5 text-slate-400 hover:text-carolina hover:bg-carolina/5 rounded-xl transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
            </button>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything about UNC..."
              className="flex-1 bg-transparent border-none focus:ring-0 px-1 py-2 text-sm outline-none font-semibold placeholder:text-slate-400"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="bg-carolina hover:bg-navy text-white p-3 rounded-xl transition-all disabled:opacity-20 shadow-lg active:scale-95"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </form>
        <div className="mt-3 flex justify-center items-center space-x-3 opacity-40">
           <span className="text-[8px] text-navy font-black uppercase tracking-[0.4em]">Heel-Verified Advisor</span>
           <span className="w-1 h-1 bg-carolina rounded-full"></span>
           <span className="text-[8px] text-navy font-black uppercase tracking-[0.4em]">Gemini AI</span>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;