
import React, { useState } from 'react';
import { Mic, MicOff, Video, VideoOff, PhoneOff, MessageSquare, Users, Hand, Send, Smile, MoreVertical, ScreenShare, LayoutGrid } from 'lucide-react';

const LiveClass: React.FC = () => {
    const [micOn, setMicOn] = useState(false); // Default off to prevent feedback loop in user mind
    const [cameraOn, setCameraOn] = useState(true);
    const [handRaised, setHandRaised] = useState(false);
    const [showChat, setShowChat] = useState(true);
    const [chatInput, setChatInput] = useState('');
    const [messages, setMessages] = useState([
        { user: 'Prof. Sarah', text: 'Welcome everyone! Today we are discussing Quantum Mechanics.', time: '10:00 AM' },
        { user: 'David K.', text: 'Can you explain superposition again?', time: '10:05 AM' },
        { user: 'Anita R.', text: 'The Schrödinger cat thought experiment is fascinating!', time: '10:07 AM' },
    ]);

    const handleSendMessage = () => {
        if (!chatInput.trim()) return;
        setMessages([...messages, { user: 'You', text: chatInput, time: new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) }]);
        setChatInput('');
    };

    return (
        <div className="h-full flex flex-col bg-slate-900 text-white overflow-hidden">
            {/* Top Bar */}
            <div className="h-14 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-4 z-10 shadow-md">
                <div className="flex items-center gap-2">
                    <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded animate-pulse">LIVE</span>
                    <h2 className="font-bold text-sm md:text-base text-slate-200">Physics 101: Quantum Mechanics</h2>
                    <span className="bg-slate-700 text-slate-400 text-xs px-2 py-0.5 rounded ml-2">54:12</span>
                </div>
                <div className="flex items-center gap-3">
                    <button className="p-2 hover:bg-slate-700 rounded-lg text-slate-300 hidden md:block" title="Layout">
                        <LayoutGrid className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Main Area */}
            <div className="flex-1 flex overflow-hidden">
                {/* Video Stage */}
                <div className="flex-1 bg-black relative flex flex-col p-4 gap-4">
                    {/* Main Speaker */}
                    <div className="flex-1 bg-slate-800 rounded-xl overflow-hidden relative border border-slate-700 shadow-2xl">
                         <img src="https://images.unsplash.com/photo-1544717305-2782549b5136?ixlib=rb-1.2.1&auto=format&fit=crop&w=1567&q=80" alt="Teacher" className="w-full h-full object-cover opacity-90" />
                         <div className="absolute top-4 left-4 bg-black/50 backdrop-blur px-3 py-1 rounded text-sm font-bold flex items-center gap-2">
                            <Mic className="w-3 h-3 text-green-400" /> Prof. Sarah (Host)
                         </div>
                         {/* Screen Share Overlay Mockup */}
                         <div className="absolute bottom-4 right-4 w-48 h-32 bg-slate-900 rounded-lg border border-slate-600 overflow-hidden shadow-lg hidden md:block">
                             <div className="w-full h-full flex items-center justify-center bg-brand-900 text-brand-100 text-xs text-center p-2">
                                 Presentation: Slide 14<br/>Wave-Particle Duality
                             </div>
                         </div>
                    </div>

                    {/* Participant Strip */}
                    <div className="h-32 flex gap-4 overflow-x-auto pb-2">
                        {[1,2,3,4].map((i) => (
                             <div key={i} className="min-w-[160px] bg-slate-800 rounded-xl overflow-hidden relative border border-slate-700">
                                 <img src={`https://picsum.photos/seed/${i+50}/200/150`} alt="Student" className="w-full h-full object-cover opacity-80" />
                                 <div className="absolute bottom-2 left-2 text-xs font-bold bg-black/40 px-2 py-0.5 rounded">Student {i}</div>
                             </div>
                        ))}
                        {/* Self View */}
                        <div className="min-w-[160px] bg-slate-800 rounded-xl overflow-hidden relative border border-slate-700">
                             {cameraOn ? (
                                <img src="https://picsum.photos/seed/me/200/150" alt="Me" className="w-full h-full object-cover" />
                             ) : (
                                <div className="w-full h-full flex items-center justify-center bg-slate-900">
                                    <div className="w-12 h-12 rounded-full bg-brand-600 flex items-center justify-center text-xl font-bold">ME</div>
                                </div>
                             )}
                             <div className="absolute bottom-2 left-2 text-xs font-bold bg-black/40 px-2 py-0.5 rounded flex items-center gap-1">
                                You {micOn ? <Mic className="w-3 h-3 text-green-400" /> : <MicOff className="w-3 h-3 text-red-500" />}
                             </div>
                        </div>
                    </div>
                </div>

                {/* Side Panel (Chat) */}
                {showChat && (
                    <div className="w-80 bg-white border-l border-slate-200 flex flex-col text-slate-800 animate-in slide-in-from-right-10 duration-200 shadow-xl z-20">
                        <div className="h-12 border-b border-slate-100 flex items-center justify-center font-bold text-brand-900 bg-slate-50">
                            Class Chat
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex flex-col ${msg.user === 'You' ? 'items-end' : 'items-start'}`}>
                                    <div className="flex items-baseline gap-2 mb-1">
                                        <span className="font-bold text-xs text-slate-700">{msg.user}</span>
                                        <span className="text-[10px] text-slate-400">{msg.time}</span>
                                    </div>
                                    <div className={`px-3 py-2 rounded-lg text-sm max-w-[90%] ${msg.user === 'Prof. Sarah' ? 'bg-orange-100 text-orange-900 border border-orange-200' : msg.user === 'You' ? 'bg-brand-500 text-white' : 'bg-slate-100 text-slate-700'}`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-3 border-t border-slate-200 bg-slate-50">
                            <div className="relative">
                                <input 
                                    type="text" 
                                    value={chatInput}
                                    onChange={(e) => setChatInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                    placeholder="Type a message..."
                                    className="w-full bg-white border border-slate-300 rounded-full pl-4 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                                />
                                <button 
                                    onClick={handleSendMessage}
                                    className="absolute right-1 top-1 p-1.5 bg-brand-500 text-white rounded-full hover:bg-brand-600 transition-colors"
                                >
                                    <Send className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Controls */}
            <div className="h-20 bg-slate-800 border-t border-slate-700 flex items-center justify-between px-4 lg:px-8 shrink-0 z-20">
                <div className="flex gap-2">
                     <button 
                        onClick={() => setMicOn(!micOn)}
                        className={`flex flex-col items-center gap-1 p-2 rounded-lg w-16 transition-all ${micOn ? 'text-slate-300 hover:bg-slate-700' : 'text-red-500 hover:bg-slate-700/50'}`}
                     >
                        <div className={`p-2 rounded-full ${micOn ? 'bg-slate-700' : 'bg-red-500/20'}`}>
                             {micOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                        </div>
                        <span className="text-[10px] font-medium">{micOn ? 'Mute' : 'Unmute'}</span>
                     </button>

                     <button 
                        onClick={() => setCameraOn(!cameraOn)}
                        className={`flex flex-col items-center gap-1 p-2 rounded-lg w-16 transition-all ${cameraOn ? 'text-slate-300 hover:bg-slate-700' : 'text-red-500 hover:bg-slate-700/50'}`}
                     >
                        <div className={`p-2 rounded-full ${cameraOn ? 'bg-slate-700' : 'bg-red-500/20'}`}>
                             {cameraOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                        </div>
                        <span className="text-[10px] font-medium">{cameraOn ? 'Stop Video' : 'Start Video'}</span>
                     </button>
                </div>

                <div className="flex gap-4">
                    <button className="flex flex-col items-center gap-1 text-slate-400 hover:text-white transition-colors">
                        <div className="p-2 rounded-full hover:bg-slate-700">
                             <ScreenShare className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] hidden md:block">Share</span>
                    </button>
                    <button className="flex flex-col items-center gap-1 text-slate-400 hover:text-white transition-colors">
                        <div className="p-2 rounded-full hover:bg-slate-700 relative">
                             <Users className="w-5 h-5" />
                             <span className="absolute top-0 right-0 bg-slate-600 text-[9px] px-1 rounded-full text-white">24</span>
                        </div>
                        <span className="text-[10px] hidden md:block">Participants</span>
                    </button>
                    <button 
                        onClick={() => setShowChat(!showChat)}
                        className={`flex flex-col items-center gap-1 transition-colors ${showChat ? 'text-brand-400' : 'text-slate-400 hover:text-white'}`}
                    >
                        <div className={`p-2 rounded-full ${showChat ? 'bg-slate-700' : 'hover:bg-slate-700'}`}>
                             <MessageSquare className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] hidden md:block">Chat</span>
                    </button>
                    <button 
                        onClick={() => setHandRaised(!handRaised)}
                        className={`flex flex-col items-center gap-1 transition-colors ${handRaised ? 'text-yellow-400' : 'text-slate-400 hover:text-white'}`}
                    >
                        <div className={`p-2 rounded-full ${handRaised ? 'bg-yellow-500/20' : 'hover:bg-slate-700'}`}>
                             <Hand className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] hidden md:block">Raise Hand</span>
                    </button>
                </div>

                <div>
                    <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-bold text-sm shadow-lg shadow-red-600/30 transition-all flex items-center gap-2">
                        <PhoneOff className="w-4 h-4" /> <span className="hidden md:inline">Leave</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LiveClass;
