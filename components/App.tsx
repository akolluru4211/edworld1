
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import RoboticsLab from './components/RoboticsLab';
import ScienceLab from './components/ScienceLab';
import Compiler from './components/Compiler';
import AITutor from './components/AITutor';
import LearningModule from './components/LearningModule';
import Community from './components/Community';
import ParentTeacherDashboard from './components/ParentTeacherDashboard';
import Pricing from './components/Pricing';
import LiveClass from './components/LiveClass';
import CareerCenter from './components/CareerCenter';
import Mentorship from './components/Mentorship';
import Auth from './components/Auth';
import Onboarding from './components/Onboarding';
import { View, User, Stream } from './types';
import { Menu, X, Mail, Award, GraduationCap, Trash2 } from 'lucide-react';
import { supabase } from './services/supabaseClient';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  // Check active session and fetch profile
  useEffect(() => {
    const checkSession = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session && session.user) {
            await fetchUserProfile(session.user.id, session.user.email!);
        } else {
            setAuthLoading(false);
        }
    };

    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event: string, session: any) => {
        if (event === 'SIGNED_IN' && session?.user) {
             await fetchUserProfile(session.user.id, session.user.email!);
        } else if (event === 'SIGNED_OUT') {
            setUser(null);
            setCurrentView(View.DASHBOARD);
            setAuthLoading(false);
        }
    });

    return () => {
        authListener.subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string, email: string) => {
      try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

          if (error) {
              // PGRST116: JSON object requested, multiple (or no) rows returned.
              // This is expected for new users who haven't created a profile entry yet.
              if (error.code !== 'PGRST116') {
                console.error('Error fetching profile:', JSON.stringify(error));
              }
              
              // Fallback for new users if trigger failed or manual insert needed
              const newUser: User = {
                id: userId,
                name: 'Student',
                email: email,
                role: 'student',
                level: 1,
                xp: 0,
                streak: 0,
                coins: 0,
                goals: [],
                stream: 'Science'
              };
              setUser(newUser);
              setShowOnboarding(true);
          } else {
              // Fetch Certificates
              const { data: certs } = await supabase
                .from('certificates')
                .select('*')
                .eq('user_id', userId);

              const loadedUser: User = {
                  id: userId,
                  name: data.name,
                  email: email,
                  role: data.role || 'student',
                  level: data.level || 1,
                  xp: data.xp || 0,
                  streak: data.streak || 0,
                  coins: data.coins || 0,
                  goals: data.goals || [],
                  stream: data.stream || 'Science',
                  certificates: certs || []
              };
              setUser(loadedUser);
              
              if (!data.stream) {
                  setShowOnboarding(true);
              }
          }
      } catch (e) {
          console.error(e);
      } finally {
          setAuthLoading(false);
      }
  };

  const handleOnboardingComplete = async (goals: string[], stream: Stream) => {
      if (user) {
          // Update local state
          setUser({ ...user, goals, stream });
          setShowOnboarding(false);
          
          // Update DB
          await supabase.from('profiles').upsert({ id: user.id, goals, stream, name: user.name });
      }
  };

  const handleRoleChange = (role: 'student' | 'parent' | 'teacher') => {
      if (!user) return;
      const newUser = { ...user, role };
      setUser(newUser);
      
      if (role === 'student') setCurrentView(View.DASHBOARD);
      else if (role === 'parent') setCurrentView(View.PARENT_DASHBOARD);
      else if (role === 'teacher') setCurrentView(View.TEACHER_DASHBOARD);
  };

  const handleLogout = async () => {
      await supabase.auth.signOut();
  };
  
  // Mock generation for demo
  const generateMockCertificate = async () => {
      if (!user) return;
      const newCert = {
          user_id: user.id,
          title: `Certified ${user.stream} Scholar`,
          issue_date: new Date().toISOString(),
          badge_icon: 'award'
      };
      
      const { data, error } = await supabase.from('certificates').insert([newCert]).select();
      
      if (data && user) {
          // Ensure data[0] is valid before adding to state
          const newCertificate = data[0];
          if (newCertificate) {
              setUser({
                  ...user,
                  certificates: [...(user.certificates || []), newCertificate]
              });
              alert('Certificate Issued! Check your profile.');
          }
      }
  };

  const handleResetData = () => {
      if (window.confirm("Are you sure? This will delete all demo profiles, certificates, and coding progress saved on this device.")) {
          localStorage.clear();
          window.location.reload();
      }
  };

  // Auth Flow
  if (authLoading) {
      return (
          <div className="flex items-center justify-center h-screen bg-slate-50">
              <div className="animate-pulse flex flex-col items-center">
                  <div className="w-16 h-16 bg-brand-200 rounded-full mb-4"></div>
                  <div className="h-4 w-32 bg-slate-200 rounded"></div>
              </div>
          </div>
      );
  }

  if (!user) {
    return <Auth />;
  }

  const renderContent = () => {
    switch (currentView) {
      case View.LAB_ROBOTICS:
        return <RoboticsLab />;
      case View.LAB_SCIENCE:
        return <ScienceLab />;
      case View.CODING_COMPILER:
        return <Compiler />;
      case View.AI_TUTOR:
        return <AITutor />;
      case View.LEARNING_MODULE:
        return <LearningModule />;
      case View.COMMUNITY:
        return <Community />;
      case View.PRICING:
        return <Pricing />;
      case View.LIVE_CLASS:
        return <LiveClass />;
      case View.CAREER_CENTER:
        return <CareerCenter user={user} />;
      case View.MENTORSHIP:
        return <Mentorship />;
      case View.PARENT_DASHBOARD:
        return <ParentTeacherDashboard role="parent" />;
      case View.TEACHER_DASHBOARD:
        return <ParentTeacherDashboard role="teacher" />;
      case View.PROFILE:
        return (
            <div className="flex flex-col h-full bg-slate-50 overflow-y-auto">
                <div className="bg-brand-900 text-white p-12 text-center relative overflow-hidden">
                    <div className="relative z-10 max-w-2xl mx-auto">
                        <div className="w-28 h-28 bg-white p-1 rounded-full mx-auto mb-4 shadow-xl">
                            <div className="w-full h-full bg-brand-100 rounded-full flex items-center justify-center text-4xl font-bold text-brand-700">
                                {user.name.charAt(0)}
                            </div>
                        </div>
                        <h2 className="text-3xl font-bold mb-1">{user.name}</h2>
                        <p className="text-brand-200 flex items-center justify-center gap-2">
                             <Mail className="w-4 h-4"/> {user.email}
                        </p>
                        
                        <div className="flex justify-center gap-6 mt-8">
                            <div className="bg-white/10 p-4 rounded-xl text-center min-w-[100px]">
                                <p className="text-2xl font-bold">{user.level}</p>
                                <p className="text-xs uppercase tracking-wider text-brand-300">Level</p>
                            </div>
                            <div className="bg-white/10 p-4 rounded-xl text-center min-w-[100px]">
                                <p className="text-2xl font-bold">{user.xp}</p>
                                <p className="text-xs uppercase tracking-wider text-brand-300">XP</p>
                            </div>
                            <div className="bg-white/10 p-4 rounded-xl text-center min-w-[100px]">
                                <p className="text-2xl font-bold">{user.stream}</p>
                                <p className="text-xs uppercase tracking-wider text-brand-300">Stream</p>
                            </div>
                        </div>
                    </div>
                    {/* Decorative */}
                    <GraduationCap className="absolute top-10 right-10 w-48 h-48 text-white/5 rotate-12" />
                </div>

                <div className="max-w-4xl mx-auto w-full p-8 space-y-8 pb-16">
                    {/* Certificates Section */}
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                <Award className="w-6 h-6 text-orange-500" /> Certifications
                            </h3>
                            <button 
                                onClick={generateMockCertificate} 
                                className="text-xs font-bold text-brand-600 border border-brand-200 px-3 py-1 rounded hover:bg-brand-50"
                            >
                                + Demo: Issue Cert
                            </button>
                        </div>
                        
                        {(!user.certificates || user.certificates.length === 0) ? (
                            <div className="bg-white p-8 rounded-2xl border border-dashed border-slate-300 text-center text-slate-500">
                                <Award className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                                <p>No certifications earned yet.</p>
                                <p className="text-sm">Complete courses in Learning Modules to earn badges.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {user.certificates.filter(Boolean).map((cert, idx) => (
                                    <div key={idx} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 relative overflow-hidden group">
                                        <div className="absolute right-0 top-0 w-24 h-24 bg-yellow-400/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-yellow-400/20 transition-colors"></div>
                                        <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center border-2 border-yellow-100">
                                            <Award className="w-8 h-8 text-yellow-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-800">{cert.title}</h4>
                                            <p className="text-xs text-slate-500">Issued: {new Date(cert.issue_date).toLocaleDateString()}</p>
                                            <div className="flex gap-2 mt-2">
                                                <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">Verified ID: {cert.id?.slice(0,8) || '####'}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    
                    {/* Reset Data Control for Prototype */}
                    <div className="border-t border-slate-200 pt-8 text-center">
                        <button 
                            onClick={handleResetData}
                            className="text-xs font-bold text-red-500 hover:text-red-700 flex items-center justify-center gap-2 mx-auto px-4 py-2 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            <Trash2 className="w-4 h-4" /> Reset Demo Data & Logout
                        </button>
                        <p className="text-[10px] text-slate-400 mt-2">Use this to clear local storage and restart the onboarding flow.</p>
                    </div>
                </div>
            </div>
        );
      default:
        return <Dashboard setView={setCurrentView} user={user} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 overflow-hidden font-sans">
      {showOnboarding && <Onboarding onComplete={handleOnboardingComplete} />}
      
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
            className="fixed inset-0 bg-brand-900/50 backdrop-blur-sm z-40 lg:hidden" 
            onClick={() => setMobileMenuOpen(false)} 
            aria-hidden="true"
        />
      )}
      
      {/* Sidebar (Responsive) */}
      <div 
        id="mobile-sidebar"
        className={`fixed inset-y-0 left-0 z-50 transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:inset-auto transition-transform duration-300 ease-in-out shadow-2xl lg:shadow-none`}
      >
        <Sidebar 
          currentView={currentView} 
          setView={(v) => { setCurrentView(v); setMobileMenuOpen(false); }} 
          onLogout={handleLogout}
          user={user}
          onRoleChange={handleRoleChange}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="lg:hidden h-16 border-b border-brand-100 flex items-center justify-between px-4 bg-white z-30 flex-shrink-0">
             <div className="flex items-center gap-2">
                 <GraduationCap className="w-6 h-6 text-brand-600" />
                 <div className="flex flex-col">
                     <span className="font-serif font-bold text-lg text-brand-900 leading-none tracking-wider">EDWORLD</span>
                 </div>
            </div>
            <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
                className="p-2 text-brand-700 hover:bg-brand-50 rounded-lg"
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-sidebar"
            >
                {mobileMenuOpen ? <X /> : <Menu />}
            </button>
        </header>

        <main className="flex-1 overflow-hidden relative">
            {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;
