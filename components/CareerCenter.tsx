import React, { useState } from 'react';
import { Briefcase, FileText, Map, Sparkles, Search, MapPin, Building, ArrowRight, Upload, CheckCircle, Download, FileCheck, RefreshCw, AlertTriangle } from 'lucide-react';
import { User, Stream, Job } from '../types';
import { analyzeResumeForATS, enhanceResumeContent } from '../services/geminiService';

interface Props {
    user: User | null;
}

const CareerCenter: React.FC<Props> = ({ user }) => {
    const [activeTab, setActiveTab] = useState<'JOBS' | 'RESUME' | 'ROADMAP'>('ROADMAP');

    return (
        <div className="h-full flex flex-col bg-slate-50">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 px-6 py-4 shadow-sm sticky top-0 z-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Career Center</h2>
                        <p className="text-sm text-slate-500">
                            Pathways for <span className="font-bold text-brand-600">{user?.stream || 'General'}</span> Students
                        </p>
                    </div>
                    <div className="flex bg-slate-100 p-1 rounded-xl self-start md:self-auto">
                        <button 
                            onClick={() => setActiveTab('ROADMAP')}
                            className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${activeTab === 'ROADMAP' ? 'bg-white shadow text-brand-600' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            <Map className="w-4 h-4" /> Roadmap
                        </button>
                        <button 
                            onClick={() => setActiveTab('JOBS')}
                            className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${activeTab === 'JOBS' ? 'bg-white shadow text-brand-600' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            <Briefcase className="w-4 h-4" /> Job Portal
                        </button>
                        <button 
                            onClick={() => setActiveTab('RESUME')}
                            className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${activeTab === 'RESUME' ? 'bg-white shadow text-brand-600' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            <FileCheck className="w-4 h-4" /> ATS Resume
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
                <div className="max-w-7xl mx-auto">
                    {activeTab === 'ROADMAP' && <RoadmapView stream={user?.stream || 'Vocational'} />}
                    {activeTab === 'JOBS' && <JobPortalView />}
                    {activeTab === 'RESUME' && <ATSResumeBuilder user={user} />}
                </div>
            </div>
        </div>
    );
};

const RoadmapView = ({ stream }: { stream: Stream }) => {
    const steps = {
        'Science': ['Master Algebra & Calculus', 'Physics Lab Simulations', 'Intro to Python', 'JEE/NEET Prep Exams', 'Engineering/Med Application'],
        'Commerce': ['Fundamentals of Accounting', 'Economics Micro/Macro', 'Excel for Finance', 'Business Studies', 'CA/CFA Foundation'],
        'Arts': ['World History & Culture', 'Sociology Basics', 'Creative Writing Workshop', 'Digital Media Design', 'Portfolio Building'],
        'Vocational': ['Basic Computer Skills', 'Communication Soft Skills', 'Specialized Trade Cert', 'Internship', 'Job Placement']
    };

    return (
        <div className="space-y-8">
            <div className="bg-brand-600 rounded-2xl p-8 text-white relative overflow-hidden shadow-lg">
                <div className="relative z-10">
                    <h3 className="text-2xl font-bold mb-2">Your Career Roadmap: {stream}</h3>
                    <p className="text-brand-100 max-w-xl">
                        Follow this curated path to achieve mastery and employability in your chosen field.
                    </p>
                </div>
                <Map className="absolute right-0 bottom-0 w-64 h-64 text-brand-700/50 -rotate-12 translate-y-12 translate-x-12" />
            </div>

            <div className="relative">
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-slate-200"></div>
                <div className="space-y-8">
                    {steps[stream].map((step, idx) => (
                        <div key={idx} className="relative flex items-center gap-6 group">
                            <div className={`w-16 h-16 rounded-full border-4 flex items-center justify-center text-xl font-bold z-10 transition-all ${idx < 2 ? 'bg-green-100 border-green-500 text-green-600' : idx === 2 ? 'bg-brand-500 border-brand-200 text-white shadow-lg scale-110' : 'bg-white border-slate-200 text-slate-400'}`}>
                                {idx < 2 ? <CheckCircle className="w-8 h-8" /> : idx + 1}
                            </div>
                            <div className={`flex-1 p-6 rounded-2xl border transition-all ${idx === 2 ? 'bg-white border-brand-200 shadow-md' : 'bg-slate-50 border-slate-100 opacity-80'}`}>
                                <h4 className={`font-bold text-lg ${idx === 2 ? 'text-brand-900' : 'text-slate-700'}`}>{step}</h4>
                                <p className="text-sm text-slate-500">Module {idx + 1} • {idx < 2 ? 'Completed' : idx === 2 ? 'In Progress' : 'Locked'}</p>
                                {idx === 2 && (
                                    <button className="mt-4 px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-brand-700">
                                        Continue <ArrowRight className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const JobPortalView = () => {
    const jobs: Job[] = [
        { id: '1', title: 'Junior Python Developer', company: 'TechStart Inc.', location: 'Remote', type: 'Full-time', tags: ['Python', 'Django'], posted: '2d ago' },
        { id: '2', title: 'Digital Marketing Intern', company: 'GrowthLabs', location: 'Bangalore', type: 'Internship', tags: ['SEO', 'Content'], posted: '5h ago' },
        { id: '3', title: 'Data Entry Specialist', company: 'DataCorp', location: 'Mumbai', type: 'Freelance', tags: ['Excel', 'Typing'], posted: '1d ago' },
        { id: '4', title: 'NEET Physics Tutor', company: 'Eden Academy Live', location: 'Delhi', type: 'Full-time', tags: ['Physics', 'Teaching'], posted: '3d ago' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                    <input type="text" placeholder="Search for jobs, internships..." className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white shadow-sm" />
                </div>
                <button className="px-6 py-3 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 transition-colors">Search</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {jobs.map(job => (
                    <div key={job.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-bold text-lg text-slate-800">{job.title}</h3>
                                <div className="flex items-center gap-2 text-slate-500 text-sm mt-1">
                                    <Building className="w-3 h-3" /> {job.company}
                                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                    <MapPin className="w-3 h-3" /> {job.location}
                                </div>
                            </div>
                            <span className="px-3 py-1 bg-brand-50 text-brand-700 text-xs font-bold rounded-full">{job.type}</span>
                        </div>
                        <div className="flex gap-2 mb-6">
                            {job.tags.map(tag => (
                                <span key={tag} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md font-medium">{tag}</span>
                            ))}
                        </div>
                        <div className="flex justify-between items-center border-t border-slate-50 pt-4">
                            <span className="text-xs text-slate-400">Posted {job.posted}</span>
                            <button className="text-brand-600 font-bold text-sm hover:underline">Apply Now</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const ATSResumeBuilder = ({ user }: { user: User | null }) => {
    const [fullName, setFullName] = useState(user?.name || '');
    const [summary, setSummary] = useState('');
    const [jobDesc, setJobDesc] = useState('');
    const [atsAnalysis, setAtsAnalysis] = useState<{score: number; missingKeywords: string[]; feedback: string} | null>(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [enhancing, setEnhancing] = useState(false);

    const handleAnalyze = async () => {
        if (!jobDesc || !summary) return;
        setAnalyzing(true);
        // Combine inputs for simple demo analysis
        const resumeText = `Name: ${fullName}\nSummary: ${summary}`;
        const result = await analyzeResumeForATS(resumeText, jobDesc);
        setAtsAnalysis(result);
        setAnalyzing(false);
    };

    const handleEnhance = async () => {
        if (!summary) return;
        setEnhancing(true);
        const improved = await enhanceResumeContent(summary, 'summary');
        setSummary(improved);
        setEnhancing(false);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
            {/* Left: Builder Inputs */}
            <div className="lg:col-span-7 space-y-6">
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                    <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                        <Briefcase className="w-5 h-5 text-brand-600" /> Target Job
                    </h3>
                    <p className="text-xs text-slate-500 mb-2">Paste the job description here. Our AI will optimize keywords for ATS.</p>
                    <textarea 
                        className="w-full h-32 p-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all"
                        placeholder="Paste Job Description (JD) here..."
                        value={jobDesc}
                        onChange={(e) => setJobDesc(e.target.value)}
                    ></textarea>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-lg text-slate-800">Resume Content</h3>
                        <button 
                            onClick={handleEnhance}
                            disabled={enhancing || !summary}
                            className="text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-orange-100 disabled:opacity-50"
                        >
                            {enhancing ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />} 
                            AI Rewrite
                        </button>
                    </div>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Name</label>
                            <input 
                                type="text" 
                                value={fullName} 
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full p-3 rounded-lg border border-slate-200 bg-slate-50 font-medium" 
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Professional Summary</label>
                            <textarea 
                                rows={6} 
                                value={summary}
                                onChange={(e) => setSummary(e.target.value)}
                                className="w-full p-3 rounded-lg border border-slate-200 bg-slate-50 text-sm" 
                                placeholder="E.g. Motivated student with strong Python skills..." 
                            />
                        </div>
                    </div>
                </div>

                <button 
                    onClick={handleAnalyze}
                    disabled={analyzing || !jobDesc}
                    className="w-full py-4 bg-brand-600 text-white rounded-xl font-bold shadow-lg shadow-brand-500/30 hover:bg-brand-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    {analyzing ? <RefreshCw className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
                    Analyze ATS Compatibility
                </button>
            </div>

            {/* Right: Preview & Analysis */}
            <div className="lg:col-span-5 space-y-6">
                 {/* Analysis Card */}
                {atsAnalysis && (
                    <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xl animate-in slide-in-from-bottom-4">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold flex items-center gap-2">
                                <FileCheck className="w-5 h-5 text-green-400" /> ATS Score
                            </h3>
                            <div className="text-3xl font-bold text-brand-300">{atsAnalysis.score}/100</div>
                        </div>

                        <div className="w-full bg-slate-700 h-2 rounded-full mb-6 overflow-hidden">
                            <div className={`h-full rounded-full ${atsAnalysis.score > 80 ? 'bg-green-500' : atsAnalysis.score > 50 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${atsAnalysis.score}%` }}></div>
                        </div>

                        {atsAnalysis.missingKeywords.length > 0 && (
                             <div className="mb-6">
                                 <p className="text-xs font-bold text-slate-400 uppercase mb-2 flex items-center gap-1">
                                     <AlertTriangle className="w-3 h-3 text-yellow-500" /> Missing Keywords
                                 </p>
                                 <div className="flex flex-wrap gap-2">
                                     {atsAnalysis.missingKeywords.map(kw => (
                                         <span key={kw} className="px-2 py-1 bg-red-500/20 text-red-300 text-xs rounded border border-red-500/30">{kw}</span>
                                     ))}
                                 </div>
                             </div>
                        )}

                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase mb-2">AI Feedback</p>
                            <p className="text-sm text-slate-300 leading-relaxed bg-slate-800 p-3 rounded-lg border border-slate-700">
                                {atsAnalysis.feedback}
                            </p>
                        </div>
                    </div>
                )}

                {/* Resume Preview */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[500px]">
                    <div className="bg-slate-100 p-3 border-b border-slate-200 flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-500 uppercase">Live Preview</span>
                        <div className="flex gap-2">
                            <button className="text-xs font-bold text-slate-600 bg-white border border-slate-200 px-2 py-1 rounded hover:bg-slate-50">Standard</button>
                            <button className="text-xs font-bold text-brand-600 bg-white border border-brand-200 px-2 py-1 rounded shadow-sm">ATS-Clean</button>
                        </div>
                    </div>
                    <div className="flex-1 p-8 overflow-y-auto bg-white text-xs">
                        <div className="text-center border-b-2 border-slate-800 pb-4 mb-4">
                            <h1 className="text-xl font-bold uppercase tracking-wider">{fullName || 'YOUR NAME'}</h1>
                            <p className="text-slate-500 mt-1">Student  •  {user?.stream}</p>
                        </div>
                        
                        <div className="mb-4">
                            <h2 className="font-bold text-sm border-b border-slate-300 mb-2 uppercase">Professional Summary</h2>
                            <p className="text-slate-700 leading-relaxed">
                                {summary || 'Your summary will appear here. Use the builder on the left to edit.'}
                            </p>
                        </div>

                        <div className="mb-4">
                            <h2 className="font-bold text-sm border-b border-slate-300 mb-2 uppercase">Skills</h2>
                            <p className="text-slate-700">Python, Data Analysis, Communication, Project Management</p>
                        </div>
                    </div>
                    <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-center">
                        <button className="flex items-center gap-2 px-6 py-2 bg-slate-800 text-white rounded-lg font-bold text-sm hover:bg-slate-700 transition-colors shadow-lg">
                            <Download className="w-4 h-4" /> Export PDF
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CareerCenter;