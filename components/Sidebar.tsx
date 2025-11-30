import React, { useState } from 'react';
import { View, User } from '../types';
import { 
  LayoutDashboard, 
  Bot, 
  FlaskConical, 
  Code2, 
  BrainCircuit, 
  UserCircle,
  LogOut,
  GraduationCap,
  BookOpen,
  Users,
  CreditCard,
  Baby,
  Presentation,
  Video,
  Briefcase,
  UserPlus,
  Globe
} from 'lucide-react';

interface SidebarProps {
  currentView: View;
  setView: (view: View) => void;
  onLogout: () => void;
  user: User | null;
  onRoleChange: (role: 'student' | 'parent' | 'teacher') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, onLogout, user, onRoleChange }) => {
  const [language, setLanguage] = useState('EN');

  const studentNav = [
    { view: View.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { view: View.LIVE_CLASS, label: 'EdWorld Live', icon: Video },
    { view: View.LEARNING_MODULE, label: 'Learning Modules', icon: BookOpen },
    { view: View.CAREER_CENTER, label: 'Career Center', icon: Briefcase },
    { view: View.MENTORSHIP, label: 'Mentorship', icon: UserPlus },
    { view: View.LAB_ROBOTICS, label: 'EdWorld Robotics', icon: Bot },
    { view: View.LAB_SCIENCE, label: 'EdWorld Science', icon: FlaskConical },
    { view: View.CODING_COMPILER, label: 'EdWorld Compiler', icon: Code2 },
    { view: View.AI_TUTOR, label: 'EdWorld AI Tutor', icon: BrainCircuit },
    { view: View.COMMUNITY, label: 'Community', icon: Users },
  ];

  const parentNav = [
    { view: View.PARENT_DASHBOARD, label: 'Parent Overview', icon: LayoutDashboard },
    { view: View.COMMUNITY, label: 'Parent Forum', icon: Users },
    { view: View.PRICING, label: 'Billing & Plans', icon: CreditCard },
  ];

  const teacherNav = [
    { view: View.TEACHER_DASHBOARD, label: 'Classroom', icon: Presentation },
    { view: View.LIVE_CLASS, label: 'Host EdWorld Live', icon: Video },
    { view: View.LAB_ROBOTICS, label: 'Assign Labs', icon: Bot },
    { view: View.COMMUNITY, label: 'Teacher Lounge', icon: Users },
  ];

  const getNavItems = () => {
    if (user?.role === 'parent') return parentNav;
    if (user?.role === 'teacher') return teacherNav;
    return studentNav;
  };

  const toggleLanguage = () => {
      const langs = ['EN', 'HI', 'ES'];
      const idx = langs.indexOf(language);
      setLanguage(langs[(idx + 1) % langs.length]);
  };

  return (
    <div className="w-64 h-screen bg-brand-800 border-r border-brand-700 flex flex-col justify-between shadow-sm z-20 overflow-y-auto custom-scrollbar">
      <div>
        <div className="h-20 flex items-center justify-start px-6 border-b border-brand-700 sticky top-0 bg-brand-800 z-10">
          <div className="flex items-center gap-3 group">
            <div className="relative">
                 <GraduationCap className="w-8 h-8 text-brand-200 group-hover:text-white transition-colors" />
            </div>
            <div className="flex flex-col">
                <h1 className="font-serif text-2xl font-bold text-white tracking-widest leading-none">EDWORLD</h1>
                <p className="text-[9px] text-brand-200 uppercase tracking-[0.2em] text-center font-bold mt-0.5">Academy</p>
            </div>
          </div>
        </div>

        <nav className="mt-6 px-3 space-y-1">
          {getNavItems().map((item) => (
            <button
              key={item.view}
              onClick={() => setView(item.view)}
              className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 group ${
                currentView === item.view
                  ? 'bg-brand-500 text-white font-bold shadow-md border border-brand-400'
                  : 'text-brand-200 hover:bg-brand-700 hover:text-white'
              }`}
            >
              <item.icon className={`w-5 h-5 ${currentView === item.view ? 'text-brand-100' : 'text-brand-400 group-hover:text-brand-200'}`} />
              <span className="ml-3 text-sm">{item.label}</span>
            </button>
          ))}

          {/* Upgrade Button for Students */}
          {user?.role === 'student' && (
             <button
               onClick={() => setView(View.PRICING)}
               className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 group mt-4 ${
                 currentView === View.PRICING
                   ? 'bg-orange-500 text-white font-bold'
                   : 'text-orange-400 hover:bg-orange-500/10 hover:text-orange-300'
               }`}
             >
               <CreditCard className={`w-5 h-5 ${currentView === View.PRICING ? 'text-white' : 'text-orange-400 group-hover:text-orange-300'}`} />
               <span className="ml-3 text-sm">Upgrade Plan</span>
             </button>
          )}
        </nav>
      </div>

      <div className="p-4 border-t border-brand-700 space-y-3 bg-brand-900/50">
        
        {/* Language Toggle */}
        <button 
            onClick={toggleLanguage}
            className="w-full flex items-center p-2 rounded-lg text-brand-400 hover:bg-brand-700 hover:text-white transition-colors border border-brand-700/50"
        >
            <Globe className="w-5 h-5 mx-0" />
            <div className="flex ml-3 items-center justify-between w-full">
                <span className="text-sm">Language</span>
                <span className="text-xs font-bold bg-brand-600 px-1.5 py-0.5 rounded text-white">{language}</span>
            </div>
        </button>

        {/* Role Switcher for Demo */}
        <div className="block">
            <p className="text-[10px] uppercase font-bold text-brand-400 mb-2">Demo: Switch Role</p>
            <div className="flex bg-brand-800 rounded-lg p-1 border border-brand-700">
                <button onClick={() => onRoleChange('student')} className={`flex-1 p-1 rounded text-xs ${user?.role === 'student' ? 'bg-brand-600 text-white shadow font-bold' : 'text-brand-400'}`} title="Student">
                    <UserCircle className="w-4 h-4 mx-auto"/>
                </button>
                <button onClick={() => onRoleChange('parent')} className={`flex-1 p-1 rounded text-xs ${user?.role === 'parent' ? 'bg-brand-600 text-white shadow font-bold' : 'text-brand-400'}`} title="Parent">
                    <Baby className="w-4 h-4 mx-auto"/>
                </button>
                <button onClick={() => onRoleChange('teacher')} className={`flex-1 p-1 rounded text-xs ${user?.role === 'teacher' ? 'bg-brand-600 text-white shadow font-bold' : 'text-brand-400'}`} title="Teacher">
                    <Presentation className="w-4 h-4 mx-auto"/>
                </button>
            </div>
        </div>

        <button 
           onClick={() => setView(View.PROFILE)}
           className={`w-full flex items-center p-2 rounded-lg transition-colors hover:bg-brand-700 group`}
        >
          <div className="w-8 h-8 rounded-full bg-brand-700 flex items-center justify-center text-brand-200 group-hover:bg-brand-600 group-hover:text-white transition-colors border border-brand-600">
             <UserCircle className="w-5 h-5" />
          </div>
          <div className="ml-3 text-left overflow-hidden">
            <p className="text-sm font-semibold text-brand-50 truncate">{user?.name}</p>
            <p className="text-xs text-brand-400 capitalize">{user?.role}</p>
          </div>
        </button>
        
        <button 
           onClick={onLogout}
           className="w-full flex items-center p-2 rounded-lg text-brand-400 hover:bg-red-900/20 hover:text-red-400 transition-colors"
        >
          <LogOut className="w-5 h-5 mx-0" />
          <span className="ml-3 text-sm font-medium">Log Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;