
import React from 'react';
import { Mentor } from '../types';
import { Star, Calendar, MessageSquare, Briefcase } from 'lucide-react';

const Mentorship: React.FC = () => {
    const mentors: Mentor[] = [
        { id: '1', name: 'Dr. Emily Chen', role: 'Physics Professor', company: 'MIT', image: 'https://picsum.photos/id/40/100/100', expertise: ['Physics', 'Research'], rating: 4.9, available: true },
        { id: '2', name: 'Mark Zuckerberg', role: 'Software Engineer', company: 'Tech Giant', image: 'https://picsum.photos/id/50/100/100', expertise: ['Coding', 'Career'], rating: 5.0, available: false },
        { id: '3', name: 'Sarah Miller', role: 'Marketing Lead', company: 'Creative Agency', image: 'https://picsum.photos/id/60/100/100', expertise: ['Digital Marketing', 'Soft Skills'], rating: 4.8, available: true },
        { id: '4', name: 'Rahul Gupta', role: 'Career Counselor', company: 'Eden Academy', image: 'https://picsum.photos/id/70/100/100', expertise: ['Resume Review', 'Guidance'], rating: 4.7, available: true },
    ];

    return (
        <div className="h-full flex flex-col bg-slate-50">
            <div className="px-8 py-6 border-b border-slate-200 bg-white">
                <h2 className="text-2xl font-bold text-slate-800">Find a Mentor</h2>
                <p className="text-sm text-slate-500">Book 1-on-1 sessions with industry experts to accelerate your career.</p>
            </div>

            <div className="p-8 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {mentors.map(mentor => (
                        <div key={mentor.id} className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow">
                            <div className="relative mb-4">
                                <img src={mentor.image} alt={mentor.name} className="w-24 h-24 rounded-full object-cover border-4 border-slate-50" />
                                {mentor.available && (
                                    <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full" title="Available Now"></div>
                                )}
                            </div>
                            
                            <h3 className="font-bold text-lg text-slate-800">{mentor.name}</h3>
                            <p className="text-sm text-slate-500 mb-1">{mentor.role}</p>
                            <p className="text-xs font-bold text-brand-600 flex items-center gap-1 mb-4">
                                <Briefcase className="w-3 h-3" /> {mentor.company}
                            </p>

                            <div className="flex flex-wrap gap-2 justify-center mb-6">
                                {mentor.expertise.map(exp => (
                                    <span key={exp} className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase rounded-md">{exp}</span>
                                ))}
                            </div>

                            <div className="mt-auto w-full space-y-2">
                                <button className="w-full py-2 bg-brand-600 text-white rounded-lg text-sm font-bold hover:bg-brand-700 transition-colors flex items-center justify-center gap-2">
                                    <Calendar className="w-4 h-4" /> Book Session
                                </button>
                                <button className="w-full py-2 bg-slate-50 text-slate-600 rounded-lg text-sm font-bold hover:bg-slate-100 transition-colors flex items-center justify-center gap-2">
                                    <MessageSquare className="w-4 h-4" /> Chat
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Mentorship;
