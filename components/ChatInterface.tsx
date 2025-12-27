
import React, { useState, useRef, useEffect } from 'react';
import { Message, FileContext } from '../types';
import { gemini } from '../services/geminiService';

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello Tar Heel! I am your personal Insight AI. Whether you need advice on COMP classes, study spots at Davis Library, or finding your way to South Building, I am here to help. Have a syllabus or degree sheet? Upload it and I can help you parse the details!',
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
  }, [messages]);

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
      const stream = gemini.sendMessageStream(input, uploadedFile?.content);
      
      for await (const chunk of stream) {
        if (chunk === "ERROR_KEY_NOT_FOUND") {
          fullContent = "Error: Your API key was not found or is invalid. Please refresh the page and select a valid key from a paid GCP project.";
          // In a real app we might trigger window.location.reload() or set state
          break;
        }
        fullContent += chunk;
        setMessages(prev => prev.map(m => 
          m.id === assistantMsgId ? { ...m, content: fullContent } : m
        ));
      }
    } catch (err) {
      console.error(err);
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
          content: `I've successfully loaded "${file.name}". You can now ask me specific questions about its contents!`,
          timestamp: new Date()
        }]);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="flex flex-col h-[70vh] bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {uploadedFile && (
        <div className="bg-carolina/10 px-4 py-2 border-b border-carolina/20 flex justify-between items-center">
          <div className="flex items-center text-xs font-medium text-navy">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Using Context: {uploadedFile.name}
          </div>
          <button 
            onClick={() => setUploadedFile(null)}
            className="text-xs text-red-500 hover:text-red-700 font-bold"
          >
            Remove
          </button>
        </div>
      )}

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/30">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
              m.role === 'user' 
                ? 'bg-carolina text-white rounded-br-none' 
                : 'bg-white text-navy border border-gray-100 rounded-bl-none shadow-sm'
            }`}>
              <div className="text-sm whitespace-pre-wrap leading-relaxed">
                {m.content || (isTyping && m.role === 'assistant' ? '...' : '')}
              </div>
              <div className={`text-[10px] mt-1.5 opacity-50 ${m.role === 'user' ? 'text-right' : ''}`}>
                {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-gray-100 bg-white">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
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
            className="p-2 text-gray-400 hover:text-carolina transition-colors"
            title="Upload context document"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </button>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about classes, campus life, or your uploaded syllabus..."
            className="flex-1 bg-gray-50 border-none focus:ring-2 focus:ring-carolina rounded-lg px-4 py-2.5 text-sm outline-none transition-all"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="bg-carolina hover:bg-navy text-white p-2.5 rounded-lg transition-colors disabled:opacity-50"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
        <div className="mt-2 text-[10px] text-gray-400 text-center uppercase tracking-widest font-bold">
          Powered by Gemini 3 Pro
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
