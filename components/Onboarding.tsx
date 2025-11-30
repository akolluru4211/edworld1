
import React, { useState } from 'react';
import { Check, ArrowRight, Target, BookOpen, Briefcase, Calculator, Palette, Atom } from 'lucide-react';
import { Stream } from '../types';

interface Props {
    onComplete: (goals: string[], stream: Stream) => void;
}

const Onboarding: React.FC<Props> = ({ onComplete }) => {
    const [step, setStep] = useState(1);
    const [goals, setGoals] = useState<string[]>([]);
    const [selectedStream, setSelectedStream] = useState<Stream | null>(null);

    const toggleGoal = (goal: string) => {
        if (goals.includes(goal)) {
            setGoals(goals.filter(g => g !== goal));
        } else {
            setGoals([...goals, goal]);
        }
    };

    const handleNext = () => {
        if (step === 1 && selectedStream) setStep(2);
        else if (step === 2) onComplete(goals, selectedStream!);
    };

    const streams = [
        { id: 'Science', icon: Atom, desc: 'Physics, Chem, Bio, Engineering' },
        { id: 'Commerce', icon: Calculator, desc: 'Accounts, Economics, Business' },
        { id: 'Arts', icon: Palette, desc: 'History, Literature, Sociology' },
        { id: 'Vocational', icon: Briefcase, desc: 'Job Skills, IT, Marketing' },
    ];

    const getGoalsForStream = (stream: Stream) => {
        switch(stream) {
            case 'Science': return ['Ace JEE/NEET Exams', 'Master Python', 'Understand Quantum Physics'];
            case 'Commerce': return ['Learn Financial Accounting', 'Master Excel', 'Understand Microeconomics'];
            case 'Arts': return ['Improve Creative Writing', 'Study World History', 'Digital Art Mastery'];
            case 'Vocational': return ['Get IT Certification', 'Learn Digital Marketing', 'Resume Building'];
            default: return [];
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl animate-in fade-in zoom-in duration-300">
                <div className="mb-8 text-center">
                    <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-brand-50">
                        {step === 1 ? <Briefcase className="w-8 h-8 text-brand-600" /> : <Target className="w-8 h-8 text-brand-600" />}
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800">
                        {step === 1 ? "Choose Your Path" : "Set Your Goals"}
                    </h2>
                    <p className="text-slate-500 mt-2">
                        {step === 1 ? "We'll customize your labs and courses based on your stream." : "Select up to 3 key objectives."}
                    </p>
                </div>

                {step === 1 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                        {streams.map((s) => (
                            <button
                                key={s.id}
                                onClick={() => setSelectedStream(s.id as Stream)}
                                className={`p-4 rounded-xl border-2 text-left transition-all relative overflow-hidden group ${selectedStream === s.id ? 'border-brand-500 bg-brand-50' : 'border-slate-100 hover:border-brand-200 hover:bg-slate-50'}`}
                            >
                                <div className={`mb-2 w-10 h-10 rounded-full flex items-center justify-center ${selectedStream === s.id ? 'bg-brand-500 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-brand-100 group-hover:text-brand-600'}`}>
                                    <s.icon className="w-5 h-5" />
                                </div>
                                <h3 className={`font-bold ${selectedStream === s.id ? 'text-brand-900' : 'text-slate-700'}`}>{s.id}</h3>
                                <p className="text-xs text-slate-500 mt-1">{s.desc}</p>
                                {selectedStream === s.id && <div className="absolute top-2 right-2"><Check className="w-5 h-5 text-brand-500" /></div>}
                            </button>
                        ))}
                    </div>
                )}

                {step === 2 && selectedStream && (
                    <div className="space-y-3 mb-8">
                        {getGoalsForStream(selectedStream).map(opt => (
                            <button
                                key={opt}
                                onClick={() => toggleGoal(opt)}
                                className={`w-full p-4 rounded-xl border-2 text-left font-medium transition-all flex justify-between items-center ${goals.includes(opt) ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-slate-100 hover:border-slate-300 text-slate-600'}`}
                            >
                                {opt}
                                {goals.includes(opt) && <Check className="w-5 h-5 text-brand-600" />}
                            </button>
                        ))}
                    </div>
                )}

                <button 
                    onClick={handleNext}
                    disabled={(step === 1 && !selectedStream) || (step === 2 && goals.length === 0)}
                    className="w-full py-4 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-brand-500/30"
                >
                    {step === 1 ? 'Next Step' : 'Get Started'} <ArrowRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default Onboarding;
