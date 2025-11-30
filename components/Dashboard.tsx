
import React from 'react';
import { View, User } from '../types';
import { 
    Bot, FlaskConical, Code2, PlayCircle, Trophy, ArrowRight, Sparkles, 
    Flame, Target, Star, ChevronRight, Bookmark, Briefcase, BookOpen
} from 'lucide-react';

interface DashboardProps {
    setView: (v: View) => void;
    user: User | null;
}

const Dashboard: React.FC<DashboardProps> = ({ setView, user }) => {
    const firstName = user?.name ? user.name.split(' ')[0] : 'Student';
    const nextLevelXP = 2000;
    const progress = user ? (user.xp / nextLevelXP) * 100 : 0;
    const stream = user?.stream || 'Science'; // Default fallback

    const getRecommendation = () => {
        switch(stream) {
            case 'Commerce': 
                return { title: 'CA Foundation: Economics', sub: 'Competitive Prep', desc: 'Deep dive into microeconomics theories essential for CA entrance exams.' };
            case 'Arts':
                return { title: 'UPSC: Indian Polity', sub: 'Civil Services Prep', desc: 'Master the Constitution of India with interactive flashcards and quizzes.' };
            case 'Vocational':
                return { title: 'Python for Data Analysis', sub: 'Job Ready Skill', desc: 'Learn Pandas and NumPy libraries to analyze real-world datasets.' };
            default:
                return { title: "JEE Mains: Mechanics", sub: 'Competitive Prep', desc: 'Master rotational motion and forces with 3D simulations specifically designed for JEE.' };
        }
    };

    const rec = getRecommendation();

    return (
        <div className="h-full overflow-y-auto bg-slate-50">
            <div className="max-w-7xl mx-auto p-6 lg:p-8 space-y-8">
                
                {/* Gamification Header */}
                <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="relative">
                            <div className="w-14 h-14 rounded-full bg-brand-50 flex items-center justify-center text-brand-500 font-bold text-xl border-4 border-white shadow">
                                {user?.level}
                            </div>
                            <div className="absolute -bottom-1 -right-1 bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-white">
                                LVL
                            </div>
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <h2 className="font-bold text-brand-900">Welcome back, {firstName}!</h2>
                                <span className="text-xs bg-brand-100 text-brand-700 px-2 py-0.5 rounded-full font-bold uppercase">{stream}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                                <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-brand-500 rounded-full" style={{ width: `${progress}%` }}></div>
                                </div>
                                <span>{user?.xp} / {nextLevelXP} XP</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-4 w-full md:w-auto justify-around">
                         <div className="flex flex-col items-center">
                            <div className="flex items-center gap-1 text-orange-500 font-bold">
                                <Flame className="w-5 h-5 fill-current" /> {user?.streak}
                            </div>
                            <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Day Streak</span>
                         </div>
                         <div className="flex flex-col items-center">
                            <div className="flex items-center gap-1 text-yellow-500 font-bold">
                                <Star className="w-5 h-5 fill-current" /> {user?.coins}
                            </div>
                            <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">EduCoins</span>
                         </div>
                         <div className="flex flex-col items-center">
                            <div className="flex items-center gap-1 text-brand-500 font-bold">
                                <Trophy className="w-5 h-5" /> #12
                            </div>
                            <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Leaderboard</span>
                         </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                         {/* Next Up / Recommendations */}
                         <section>
                             <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-brand-500" /> Recommended for {stream}
                                </h3>
                             </div>
                             <div 
                                className="bg-gradient-to-r from-brand-500 to-brand-400 rounded-2xl p-6 text-white relative overflow-hidden shadow-lg group cursor-pointer transform transition-transform duration-300 hover:scale-[1.02]" 
                                onClick={() => setView(View.LEARNING_MODULE)}
                             >
                                 <div className="relative z-10">
                                     <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold mb-3 border border-white/20">{rec.sub}</span>
                                     <h4 className="text-2xl font-bold mb-2">{rec.title}</h4>
                                     <p className="text-brand-100 mb-6 max-w-lg">
                                         {rec.desc}
                                     </p>
                                     <button className="bg-orange-500 text-white px-5 py-2 rounded-xl font-bold text-sm shadow-xl flex items-center gap-2 group-hover:bg-orange-600 transition-colors border border-orange-400">
                                         Start Course <ArrowRight className="w-4 h-4" />
                                     </button>
                                 </div>
                                 <Bot className="absolute right-[-20px] bottom-[-20px] w-48 h-48 text-white/10 rotate-12" />
                             </div>
                         </section>

                        {/* Interactive Labs Grid */}
                        <section>
                            <h3 className="text-lg font-bold text-slate-800 mb-4">Quick Access</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {(stream === 'Science' || stream === 'Vocational') && (
                                    <LabCard 
                                        title="Robotics Lab" 
                                        desc="Assemble & Simulate" 
                                        icon={Bot} 
                                        theme="blue"
                                        progress={75}
                                        onClick={() => setView(View.LAB_ROBOTICS)} 
                                    />
                                )}
                                {(stream === 'Science' || stream === 'Arts') && (
                                    <LabCard 
                                        title="Science Lab" 
                                        desc="Physics & Chem Sims" 
                                        icon={FlaskConical} 
                                        theme="green"
                                        progress={40}
                                        onClick={() => setView(View.LAB_SCIENCE)} 
                                    />
                                )}
                                <LabCard 
                                    title="Coding Arena" 
                                    desc="Python, C++, JS" 
                                    icon={Code2} 
                                    theme="orange"
                                    progress={15}
                                    onClick={() => setView(View.CODING_COMPILER)} 
                                />
                                <LabCard 
                                    title="ATS Resume Builder" 
                                    desc="Get Job Ready" 
                                    icon={Briefcase} 
                                    theme="blue"
                                    progress={0}
                                    onClick={() => setView(View.CAREER_CENTER)} 
                                />
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Stats & Goals */}
                    <div className="space-y-6">
                        {/* Daily Goals */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                    <Target className="w-4 h-4 text-orange-500" /> Daily Goals
                                </h3>
                                <span className="text-xs text-slate-400">2/3 Completed</span>
                            </div>
                            <div className="space-y-3">
                                {['Complete 1 Python Challenge', 'Spend 15m in Physics Lab', 'Update ATS Resume'].map((goal, i) => (
                                    <label key={i} className="flex items-start gap-3 p-2 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer group">
                                        <input type="checkbox" defaultChecked={i < 2} className="mt-1 w-4 h-4 rounded text-brand-600 focus:ring-brand-500 border-slate-300" />
                                        <span className={`text-sm ${i < 2 ? 'text-slate-400 line-through' : 'text-slate-600 group-hover:text-slate-900'}`}>{goal}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Leaderboard Snippet */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                             <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <Trophy className="w-4 h-4 text-brand-500" /> Top Learners
                             </h3>
                             <div className="space-y-4">
                                 {[
                                     { name: 'David K.', pts: 2400, rank: 1 },
                                     { name: 'Anita R.', pts: 2350, rank: 2 },
                                     { name: 'You', pts: 2100, rank: 12 },
                                 ].map((s, i) => (
                                     <div key={i} className={`flex items-center justify-between ${s.name === 'You' ? 'bg-brand-50 -mx-2 px-2 py-1 rounded-lg border border-brand-100' : ''}`}>
                                         <div className="flex items-center gap-3">
                                             <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? 'bg-yellow-100 text-yellow-700' : i === 1 ? 'bg-slate-100 text-slate-700' : 'bg-slate-100 text-slate-500'}`}>
                                                 {s.rank}
                                             </div>
                                             <span className={`text-sm font-medium ${s.name === 'You' ? 'text-brand-900' : 'text-slate-700'}`}>{s.name}</span>
                                         </div>
                                         <span className="text-xs font-bold text-slate-500">{s.pts} XP</span>
                                     </div>
                                 ))}
                             </div>
                             <button className="w-full mt-4 text-xs font-bold text-brand-500 hover:text-brand-600 flex items-center justify-center gap-1">
                                 View Full Leaderboard <ChevronRight className="w-3 h-3" />
                             </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const LabCard = ({ title, desc, icon: Icon, theme, progress, onClick }: any) => {
    const colors: any = {
        blue: 'bg-brand-50 text-brand-600 border-brand-100',
        green: 'bg-brand-50 text-brand-600 border-brand-100', // Unified theme
        orange: 'bg-orange-50 text-orange-600 border-orange-100',
    };

    const barColors: any = {
        blue: 'bg-brand-500',
        green: 'bg-brand-400',
        orange: 'bg-orange-500',
    }

    return (
        <button 
            onClick={onClick}
            className={`flex flex-col p-5 rounded-2xl bg-white border border-slate-100 shadow-sm text-left transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group relative overflow-hidden`}
        >
            <div className="flex justify-between items-start w-full mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-300 ${colors[theme]}`}>
                    <Icon className="w-6 h-6" />
                </div>
                {progress > 0 && (
                     <div className="radial-progress text-xs font-bold text-slate-400">
                         {progress}%
                     </div>
                )}
            </div>
            <h3 className="text-lg font-bold text-brand-900 mb-1 group-hover:text-brand-600 transition-colors">{title}</h3>
            <p className="text-sm text-slate-500 mb-4">{desc}</p>
            
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-auto">
                <div className={`h-full rounded-full ${barColors[theme]}`} style={{ width: `${progress}%` }}></div>
            </div>
        </button>
    );
}

export default Dashboard;
