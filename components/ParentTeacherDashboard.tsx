import React from 'react';
import { User } from '../types';
import { Clock, TrendingUp, AlertCircle, BookOpen, UserCheck, Calendar } from 'lucide-react';

interface Props {
    role: 'parent' | 'teacher';
}

const ParentTeacherDashboard: React.FC<Props> = ({ role }) => {
    return role === 'parent' ? <ParentView /> : <TeacherView />;
};

const ParentView = () => (
    <div className="p-8 h-full overflow-y-auto bg-slate-50">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-brand-600" /> Parent Dashboard
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
             <StatCard icon={Clock} label="Study Time (This Week)" value="12h 30m" color="blue" />
             <StatCard icon={TrendingUp} label="Average Score" value="88%" color="green" />
             <StatCard icon={AlertCircle} label="Pending Assignments" value="2" color="orange" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-4">Attendance & Activity</h3>
                <div className="h-48 flex items-end justify-between gap-2 px-2">
                    {[60, 80, 40, 90, 75, 20, 0].map((h, i) => (
                        <div key={i} className="w-full bg-brand-100 rounded-t-lg relative group">
                            <div className="absolute bottom-0 left-0 right-0 bg-brand-500 rounded-t-lg transition-all group-hover:bg-brand-600" style={{ height: `${h}%` }}></div>
                            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-slate-400">
                                {['M','T','W','T','F','S','S'][i]}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-4">Recent Alerts</h3>
                <div className="space-y-4">
                    <div className="p-4 bg-green-50 rounded-xl border border-green-100 flex gap-3">
                        <div className="w-2 h-2 mt-2 rounded-full bg-green-500"></div>
                        <div>
                            <p className="text-sm font-bold text-green-800">Physics Quiz Completed</p>
                            <p className="text-xs text-green-600">Alex scored 9/10 in Newtonian Physics.</p>
                        </div>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-xl border border-orange-100 flex gap-3">
                        <div className="w-2 h-2 mt-2 rounded-full bg-orange-500"></div>
                        <div>
                            <p className="text-sm font-bold text-orange-800">Missed Goal</p>
                            <p className="text-xs text-orange-600">Alex didn't complete yesterday's coding streak.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const TeacherView = () => (
    <div className="p-8 h-full overflow-y-auto bg-slate-50">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-brand-600" /> Teacher Dashboard
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
             <StatCard icon={UserCheck} label="Total Students" value="142" color="blue" />
             <StatCard icon={AlertCircle} label="Needs Attention" value="5" color="red" />
             <StatCard icon={Calendar} label="Upcoming Classes" value="4" color="orange" />
             <StatCard icon={TrendingUp} label="Class Avg" value="B+" color="green" />
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-bold text-slate-800">Class 10-A Performance</h3>
                <button className="text-sm text-brand-600 font-bold hover:underline">View Full Roster</button>
            </div>
            <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 font-medium">
                    <tr>
                        <th className="px-6 py-4">Student</th>
                        <th className="px-6 py-4">Attendance</th>
                        <th className="px-6 py-4">Lab Completion</th>
                        <th className="px-6 py-4">Avg Score</th>
                        <th className="px-6 py-4">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {[
                        { name: 'Alex Student', att: '98%', lab: '85%', score: '92%', status: 'Excellent' },
                        { name: 'Sarah Miller', att: '92%', lab: '70%', score: '88%', status: 'Good' },
                        { name: 'James Chen', att: '85%', lab: '40%', score: '76%', status: 'Average' },
                    ].map((s, i) => (
                        <tr key={i} className="hover:bg-slate-50">
                            <td className="px-6 py-4 font-bold text-slate-700">{s.name}</td>
                            <td className="px-6 py-4 text-slate-600">{s.att}</td>
                            <td className="px-6 py-4">
                                <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-brand-500" style={{ width: s.lab }}></div>
                                </div>
                            </td>
                            <td className="px-6 py-4 font-bold text-slate-700">{s.score}</td>
                            <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${s.status === 'Excellent' ? 'bg-green-100 text-green-700' : s.status === 'Good' ? 'bg-brand-100 text-brand-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                    {s.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

const StatCard = ({ icon: Icon, label, value, color }: any) => {
    const colors: any = {
        blue: 'text-brand-600 bg-brand-50',
        green: 'text-green-600 bg-green-50',
        orange: 'text-orange-600 bg-orange-50',
        red: 'text-red-600 bg-red-50',
        purple: 'text-brand-600 bg-brand-50', // Fallback mapped to brand
    };
    return (
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className={`p-3 rounded-xl ${colors[color]}`}>
                <Icon className="w-6 h-6" />
            </div>
            <div>
                <p className="text-2xl font-bold text-slate-800">{value}</p>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">{label}</p>
            </div>
        </div>
    );
};

export default ParentTeacherDashboard;