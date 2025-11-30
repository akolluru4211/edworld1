
import React, { useState } from 'react';
import { Play, CheckCircle, RotateCcw, ChevronLeft, ChevronRight, BrainCircuit, BookOpen, Layers, ArrowRight, GraduationCap, Briefcase, Award, Search } from 'lucide-react';

type Mode = 'CATALOG' | 'LESSON';
type Category = 'ACADEMIC' | 'COMPETITIVE' | 'SKILLS';

const LearningModule: React.FC = () => {
    const [mode, setMode] = useState<Mode>('CATALOG');
    const [selectedCategory, setSelectedCategory] = useState<Category>('ACADEMIC');
    
    return (
        <div className="h-full flex flex-col bg-slate-50">
            {mode === 'CATALOG' ? (
                <CourseCatalog 
                    category={selectedCategory} 
                    setCategory={setSelectedCategory} 
                    onSelectCourse={() => setMode('LESSON')} 
                />
            ) : (
                <LessonPlayer onBack={() => setMode('CATALOG')} />
            )}
        </div>
    );
};

const CourseCatalog = ({ category, setCategory, onSelectCourse }: any) => {
    const courses = {
        'ACADEMIC': [
            { title: "Class 12 Physics: Electrostatics", sub: "Science Stream", color: "blue" },
            { title: "Macroeconomics 101", sub: "Commerce Stream", color: "green" },
            { title: "Modern World History", sub: "Arts Stream", color: "orange" },
            { title: "Organic Chemistry", sub: "Science Stream", color: "blue" }
        ],
        'COMPETITIVE': [
            { title: "JEE Mains: Mechanics Crash Course", sub: "Engineering Prep", color: "red" },
            { title: "NEET Biology: Human Physiology", sub: "Medical Prep", color: "green" },
            { title: "UPSC: Indian Polity", sub: "Civil Services", color: "orange" },
            { title: "Banking: Quantitative Aptitude", sub: "SSC/Bank PO", color: "blue" }
        ],
        'SKILLS': [
            { title: "Python for Data Science", sub: "Programming", color: "purple" },
            { title: "Digital Marketing Masterclass", sub: "Vocational", color: "pink" },
            { title: "Soft Skills: Ace the Interview", sub: "Job Readiness", color: "yellow" },
            { title: "Graphic Design Basics", sub: "Creative", color: "orange" }
        ]
    };

    return (
        <div className="flex-1 overflow-y-auto">
            {/* Catalog Header */}
            <div className="bg-brand-900 text-white p-8 pb-16 relative overflow-hidden">
                <div className="relative z-10 max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold mb-4">Explore Courses</h1>
                    <p className="text-brand-200 mb-8 max-w-xl">
                        From school academics to competitive exams and job-ready skills. Start learning today.
                    </p>
                    <div className="flex bg-white/10 backdrop-blur-md p-1 rounded-xl max-w-md">
                        <button 
                            onClick={() => setCategory('ACADEMIC')}
                            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${category === 'ACADEMIC' ? 'bg-white text-brand-900 shadow' : 'text-brand-100 hover:bg-white/5'}`}
                        >
                            Academics
                        </button>
                        <button 
                            onClick={() => setCategory('COMPETITIVE')}
                            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${category === 'COMPETITIVE' ? 'bg-white text-brand-900 shadow' : 'text-brand-100 hover:bg-white/5'}`}
                        >
                            Exams (JEE/NEET)
                        </button>
                        <button 
                            onClick={() => setCategory('SKILLS')}
                            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${category === 'SKILLS' ? 'bg-white text-brand-900 shadow' : 'text-brand-100 hover:bg-white/5'}`}
                        >
                            Skills
                        </button>
                    </div>
                </div>
                {/* Decoration */}
                <div className="absolute right-0 top-0 opacity-10">
                    <GraduationCap className="w-64 h-64 -translate-y-12 translate-x-12" />
                </div>
            </div>

            {/* Course Grid */}
            <div className="max-w-6xl mx-auto p-6 -mt-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses[category as Category].map((course: any, idx: number) => (
                         <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02] group cursor-pointer" onClick={onSelectCourse}>
                             <div className={`w-12 h-12 rounded-xl bg-${course.color}-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                 <BookOpen className={`w-6 h-6 text-${course.color}-600`} />
                             </div>
                             <h3 className="font-bold text-lg text-slate-800 mb-1">{course.title}</h3>
                             <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-4">{course.sub}</p>
                             
                             <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-4">
                                 <div className="h-full bg-slate-300 w-0 group-hover:w-full transition-all duration-700 ease-out"></div>
                             </div>

                             <button className="text-brand-600 text-sm font-bold flex items-center gap-2 group-hover:gap-3 transition-all">
                                 Start Learning <ArrowRight className="w-4 h-4" />
                             </button>
                         </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// ... (Existing Video Player Logic Wrapped in LessonPlayer)
const LessonPlayer = ({ onBack }: { onBack: () => void }) => {
    const [subMode, setSubMode] = useState<'VIDEO' | 'FLASHCARDS' | 'QUIZ'>('VIDEO');

    return (
        <div className="flex flex-col h-full">
            <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Newtonian Physics</h2>
                        <p className="text-sm text-slate-500">Science Stream • Grade 10</p>
                    </div>
                </div>
                <div className="flex bg-slate-100 p-1 rounded-xl">
                    <button onClick={() => setSubMode('VIDEO')} className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${subMode === 'VIDEO' ? 'bg-white shadow text-brand-600' : 'text-slate-500 hover:text-slate-700'}`}>
                        <Play className="w-4 h-4" /> Lesson
                    </button>
                    <button onClick={() => setSubMode('FLASHCARDS')} className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${subMode === 'FLASHCARDS' ? 'bg-white shadow text-brand-600' : 'text-slate-500 hover:text-slate-700'}`}>
                        <Layers className="w-4 h-4" /> Flashcards
                    </button>
                    <button onClick={() => setSubMode('QUIZ')} className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${subMode === 'QUIZ' ? 'bg-white shadow text-brand-600' : 'text-slate-500 hover:text-slate-700'}`}>
                        <BrainCircuit className="w-4 h-4" /> Quiz
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
                <div className="max-w-5xl mx-auto">
                    {subMode === 'VIDEO' && <VideoSection />}
                    {subMode === 'FLASHCARDS' && <FlashcardsSection />}
                    {subMode === 'QUIZ' && <QuizSection />}
                </div>
            </div>
        </div>
    );
}

const VideoSection = () => {
    return (
        <div className="space-y-6">
            <div className="aspect-video bg-slate-900 rounded-2xl overflow-hidden relative shadow-xl group">
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center cursor-pointer group-hover:scale-110 transition-transform">
                        <Play className="w-8 h-8 text-white ml-1" />
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white">
                    <h3 className="font-bold text-lg">Understanding Forces & Motion</h3>
                    <div className="w-full bg-white/20 h-1 mt-2 rounded-full overflow-hidden">
                        <div className="w-1/3 h-full bg-brand-500"></div>
                    </div>
                    <div className="flex justify-between text-xs mt-1 text-slate-300">
                        <span>04:12</span>
                        <span>12:30</span>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><BookOpen className="w-5 h-5 text-brand-600" /> Lesson Transcript & Notes</h3>
                <p className="text-slate-600 leading-relaxed mb-4">
                    In this lesson, we explore Newton's First Law of Motion. Often called the "Law of Inertia", it states that an object at rest stays at rest, and an object in motion stays in motion...
                </p>
                <div className="bg-orange-50 border-l-4 border-orange-400 p-4 rounded-r-lg">
                    <p className="text-sm text-orange-800 font-medium">
                        <strong>Key Concept:</strong> Inertia is the resistance of any physical object to any change in its velocity.
                    </p>
                </div>
            </div>
        </div>
    );
};

const FlashcardsSection = () => {
    const cards = [
        { q: "What is Newton's First Law?", a: "An object stays at rest or in motion unless acted on by a force." },
        { q: "What is the formula for Force?", a: "F = ma (Force = Mass × Acceleration)" },
        { q: "What is the unit of Force?", a: "The Newton (N)" },
    ];
    const [current, setCurrent] = useState(0);
    const [flipped, setFlipped] = useState(false);

    const handleNext = () => {
        setFlipped(false);
        setTimeout(() => setCurrent((prev) => (prev + 1) % cards.length), 200);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <div 
                onClick={() => setFlipped(!flipped)}
                className="w-full max-w-lg aspect-[3/2] perspective-1000 cursor-pointer group"
            >
                <div className={`relative w-full h-full duration-500 transform-style-3d transition-transform ${flipped ? 'rotate-y-180' : ''}`}>
                    <div className="absolute inset-0 bg-white rounded-3xl border-2 border-slate-200 shadow-xl flex items-center justify-center p-8 backface-hidden group-hover:border-brand-300 transition-colors">
                        <div className="text-center">
                            <span className="text-xs font-bold text-brand-600 uppercase tracking-widest mb-4 block">Question</span>
                            <h3 className="text-2xl font-bold text-slate-800">{cards[current].q}</h3>
                            <p className="absolute bottom-6 text-slate-400 text-sm">Click to flip</p>
                        </div>
                    </div>
                    <div className="absolute inset-0 bg-brand-600 rounded-3xl shadow-xl flex items-center justify-center p-8 backface-hidden rotate-y-180 text-white">
                         <div className="text-center">
                            <span className="text-xs font-bold text-brand-200 uppercase tracking-widest mb-4 block">Answer</span>
                            <h3 className="text-2xl font-bold">{cards[current].a}</h3>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-6 mt-8">
                <button onClick={() => { setFlipped(false); setTimeout(() => setCurrent((prev) => (prev - 1 + cards.length) % cards.length), 200); }} className="p-3 bg-white rounded-full border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm">
                    <ChevronLeft className="w-6 h-6 text-slate-600" />
                </button>
                <span className="font-bold text-slate-500">{current + 1} / {cards.length}</span>
                <button onClick={handleNext} className="p-3 bg-white rounded-full border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm">
                    <ChevronRight className="w-6 h-6 text-slate-600" />
                </button>
            </div>
        </div>
    );
};

const QuizSection = () => {
    const [selected, setSelected] = useState<number | null>(null);
    const [submitted, setSubmitted] = useState(false);
    
    const question = {
        text: "If a 10kg object accelerates at 2m/s², what is the net force acting on it?",
        options: ["5 N", "12 N", "20 N", "8 N"],
        correct: 2 // Index of 20 N
    };

    return (
        <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <span className="text-xs font-bold bg-brand-100 text-brand-700 px-3 py-1 rounded-full">Question 1 of 5</span>
                <span className="text-xs font-bold text-slate-400">Physics • Forces</span>
            </div>
            
            <h3 className="text-xl font-bold text-slate-800 mb-8 leading-relaxed">
                {question.text}
            </h3>

            <div className="space-y-3">
                {question.options.map((opt, idx) => (
                    <button
                        key={idx}
                        onClick={() => !submitted && setSelected(idx)}
                        className={`w-full p-4 rounded-xl border-2 text-left font-medium transition-all flex justify-between items-center
                            ${submitted && idx === question.correct ? 'bg-green-50 border-green-500 text-green-700' : ''}
                            ${submitted && selected === idx && idx !== question.correct ? 'bg-red-50 border-red-500 text-red-700' : ''}
                            ${!submitted && selected === idx ? 'bg-brand-50 border-brand-500 text-brand-700' : 'bg-white border-slate-100 text-slate-600 hover:bg-slate-50'}
                        `}
                    >
                        {opt}
                        {submitted && idx === question.correct && <CheckCircle className="w-5 h-5 text-green-600" />}
                    </button>
                ))}
            </div>

            <div className="mt-8 flex justify-end">
                {!submitted ? (
                    <button 
                        onClick={() => setSubmitted(true)}
                        disabled={selected === null}
                        className="bg-brand-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-brand-500/30 hover:bg-brand-700 transition-all disabled:opacity-50"
                    >
                        Submit Answer
                    </button>
                ) : (
                    <button 
                        onClick={() => { setSubmitted(false); setSelected(null); }}
                        className="bg-slate-800 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-slate-700 transition-all flex items-center gap-2"
                    >
                        Next Question <ArrowRight className="w-4 h-4" />
                    </button>
                )}
            </div>
        </div>
    );
};

export default LearningModule;
