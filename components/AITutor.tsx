import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { chatWithTutor } from '../services/geminiService';
import { Send, BrainCircuit, Sparkles, ChevronDown, BookOpen } from 'lucide-react';

const subjects = [
    { id: 'General', icon: '🎓' },
    { id: 'Mathematics', icon: '📐' },
    { id: 'Physics', icon: '⚛️' },
    { id: 'Chemistry', icon: '🧪' },
    { id: 'Computer Science', icon: '💻' },
    { id: 'History', icon: '📜' },
    { id: 'Literature', icon: '📚' },
];

const AITutor: React.FC = () => {
  const [subject, setSubject] = useState('General');
  const [messages, setMessages] = useState<ChatMessage[]>([
      { role: 'model', text: 'Hello! I am your personal AI Tutor. Select a subject above or ask me anything to get started!', timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showSubjectMenu, setShowSubjectMenu] = useState(false);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (text: string = input) => {
    if (!text.trim() || loading) return;
    
    const userMsg: ChatMessage = { role: 'user', text: text, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const { text: responseText, suggestions } = await chatWithTutor(text, subject);
    
    const aiMsg: ChatMessage = { 
        role: 'model', 
        text: responseText, 
        timestamp: Date.now(),
        suggestions: suggestions 
    };
    setMessages(prev => [...prev, aiMsg]);
    setLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
    }
  };

  const handleSubjectSelect = (subj: string) => {
      setSubject(subj);
      setShowSubjectMenu(false);
      setMessages(prev => [...prev, {
          role: 'model',
          text: `I've switched to **${subj}** mode. How can I help you with ${subj} today?`,
          timestamp: Date.now()
      }]);
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden relative">
        {/* Header */}
        <div className="p-4 bg-white border-b border-slate-200 flex flex-col md:flex-row items-center justify-between px-6 shadow-sm z-20">
            <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center shadow-lg shadow-brand-500/30">
                    <BrainCircuit className="text-white w-6 h-6" />
                </div>
                <div>
                    <h2 className="font-bold text-brand-900">EdWorld AI Tutor</h2>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        <div className="relative">
                            <button 
                                onClick={() => setShowSubjectMenu(!showSubjectMenu)}
                                className="flex items-center gap-1 text-xs font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full hover:bg-brand-100 transition-colors"
                            >
                                {subject} Teacher <ChevronDown className="w-3 h-3" />
                            </button>
                            {/* Subject Dropdown */}
                            {showSubjectMenu && (
                                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-2 animate-in fade-in zoom-in-95 z-50">
                                    {subjects.map(s => (
                                        <button
                                            key={s.id}
                                            onClick={() => handleSubjectSelect(s.id)}
                                            className={`w-full text-left px-4 py-2 text-sm hover:bg-brand-50 hover:text-brand-600 flex items-center gap-2 ${subject === s.id ? 'bg-brand-50 text-brand-600 font-bold' : 'text-slate-600'}`}
                                        >
                                            <span>{s.icon}</span> {s.id}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="hidden md:flex items-center gap-2 text-xs text-slate-400 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
                <Sparkles className="w-3 h-3 text-orange-400" /> Powered by Gemini 2.0 Flash
            </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6" ref={scrollRef}>
            {messages.map((msg, idx) => (
                <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} max-w-[90%] lg:max-w-[75%]`}>
                        <div className={`rounded-2xl p-5 shadow-sm relative ${
                            msg.role === 'user' 
                            ? 'bg-brand-500 text-white rounded-br-none' 
                            : 'bg-white text-slate-700 rounded-bl-none border border-slate-200'
                        }`}>
                            <p className="whitespace-pre-wrap leading-relaxed text-sm md:text-base">{msg.text}</p>
                            <span className={`text-[10px] block mt-2 opacity-70 ${msg.role === 'user' ? 'text-brand-100' : 'text-slate-400'}`}>
                                {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </span>
                        </div>
                    </div>

                    {/* Suggestions Chips */}
                    {msg.role === 'model' && msg.suggestions && msg.suggestions.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2 animate-in slide-in-from-left-2 fade-in ml-2 max-w-[90%] lg:max-w-[75%]">
                             {msg.suggestions.map((suggestion, i) => (
                                 <button
                                    key={i}
                                    onClick={() => handleSend(suggestion)}
                                    className="bg-orange-50 hover:bg-orange-100 text-orange-700 text-xs font-bold px-3 py-2 rounded-lg border border-orange-200 transition-all hover:scale-105 shadow-sm flex items-center gap-2 text-left"
                                 >
                                     <BookOpen className="w-3 h-3 shrink-0" /> {suggestion}
                                 </button>
                             ))}
                        </div>
                    )}
                </div>
            ))}
            {loading && (
                 <div className="flex justify-start">
                    <div className="bg-white border border-slate-200 rounded-2xl p-4 rounded-bl-none flex items-center gap-3 shadow-sm">
                        <div className="relative">
                            <div className="w-2 h-2 bg-brand-500 rounded-full animate-ping absolute top-0 right-0"></div>
                            <Sparkles className="w-5 h-5 text-orange-500 animate-spin-slow" />
                        </div>
                        <span className="text-xs font-bold text-slate-500">Thinking...</span>
                    </div>
                 </div>
            )}
        </div>

        {/* Input Area */}
        <div className="p-4 lg:p-6 bg-white border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <div className="relative flex items-center gap-2 max-w-4xl mx-auto">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder={`Ask your ${subject} teacher a question...`}
                    className="flex-1 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-5 py-4 pr-14 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white placeholder-slate-400 transition-all shadow-inner font-medium"
                />
                <button 
                    onClick={() => handleSend()}
                    disabled={!input.trim() || loading}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-brand-500 text-white rounded-lg hover:bg-brand-600 disabled:opacity-50 disabled:hover:bg-brand-500 transition-all shadow-md active:scale-95"
                >
                    <Send className="w-5 h-5" />
                </button>
            </div>
            <p className="text-center text-[10px] text-slate-400 mt-3">
                AI suggestions are generated by Gemini and may encourage deeper learning.
            </p>
        </div>
    </div>
  );
};

export default AITutor;