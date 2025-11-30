import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { UserCircle, Lock, Mail, ArrowRight, GraduationCap, Loader2, Shield, Globe, Play, CheckCircle, AlertCircle } from 'lucide-react';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loadingStatus, setLoadingStatus] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingStatus('Connecting to EdWorld...');
    setErrorMsg('');

    try {
        if (isLogin) {
            // LOGIN FLOW
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;
            // The App.tsx onAuthStateChange listener will handle the state update
            setLoadingStatus('Authenticating...');
        } else {
            // SIGN UP FLOW
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
            });

            if (error) throw error;

            if (data.user) {
                setLoadingStatus('Creating Student Profile...');
                // Create Profile
                const { error: profileError } = await supabase
                    .from('profiles')
                    .insert([
                        { 
                            id: data.user.id, 
                            name: name || 'Student',
                            role: 'student',
                            stream: 'Science', // Default, changed in onboarding
                            level: 1,
                            xp: 0
                        }
                    ]);

                if (profileError) {
                    console.error("Profile creation error:", profileError);
                    // Continue anyway, App.tsx handles missing profiles
                }
                
                setLoadingStatus('Account Created! Logging in...');
            }
        }
    } catch (error: any) {
        console.error("Auth error", error);
        setErrorMsg(error.message || 'Authentication failed');
        setLoadingStatus('');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden">
      
      {/* Left Side: Benefit-Driven Landing Content */}
      <div className="lg:w-1/2 bg-brand-500 text-white p-8 lg:p-12 flex flex-col justify-between relative overflow-hidden">
        {/* Background Patterns */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-brand-200 rounded-full blur-3xl"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10">
            <div className="flex items-center gap-3 mb-12">
                <div className="relative">
                     <GraduationCap className="w-10 h-10 text-white" />
                </div>
                <div className="flex flex-col">
                    <h1 className="font-serif text-3xl font-bold text-white tracking-widest leading-none">EDWORLD</h1>
                    <p className="text-[10px] text-brand-200 uppercase tracking-[0.2em] font-bold mt-0.5">Academy</p>
                </div>
            </div>

            <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight mb-6 font-serif">
                Master Science & Coding in <span className="text-orange-500">3D</span>
            </h1>
            <p className="text-brand-100 text-lg mb-8 leading-relaxed max-w-md">
                Stop just reading. Start doing. Assemble robots, mix chemicals safely, and code real apps in our immersive virtual labs.
            </p>

            <div className="space-y-4 mb-12">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-orange-500">
                        <Play className="w-6 h-6 fill-current" />
                    </div>
                    <div>
                        <p className="font-bold">Interactive 3D Simulations</p>
                        <p className="text-sm text-brand-200">Learn Physics & Chemistry by experimenting.</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-brand-200">
                        <CheckCircle className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="font-bold">AI-Powered Coding Tutor</p>
                        <p className="text-sm text-brand-200">Instant feedback on Python, C++, and JS.</p>
                    </div>
                </div>
            </div>
        </div>

        <div className="relative z-10 flex items-center gap-4 pt-8 border-t border-white/10">
            <div className="flex -space-x-3">
                <img src="https://picsum.photos/id/10/50/50" className="w-10 h-10 rounded-full border-2 border-brand-500" alt="User" />
                <img src="https://picsum.photos/id/20/50/50" className="w-10 h-10 rounded-full border-2 border-brand-500" alt="User" />
                <img src="https://picsum.photos/id/30/50/50" className="w-10 h-10 rounded-full border-2 border-brand-500" alt="User" />
            </div>
            <div>
                <p className="font-bold text-sm">Trusted by 10,000+ Students</p>
                <div className="flex text-orange-500 text-xs">★★★★★</div>
            </div>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="lg:w-1/2 flex items-center justify-center p-6 lg:p-12 bg-slate-50 relative">
        <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl border border-slate-100 relative overflow-hidden">
            {loadingStatus && (
                <div className="absolute inset-0 bg-white/95 backdrop-blur-md z-20 flex flex-col items-center justify-center text-center p-6 animate-in fade-in">
                    <div className="w-16 h-16 bg-brand-50 rounded-full flex items-center justify-center mb-4">
                        <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">Accessing EdWorld</h3>
                    <p className="text-brand-500 text-sm font-medium animate-pulse">{loadingStatus}</p>
                </div>
            )}

            <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-2 font-serif">
                {isLogin ? 'Student Portal Login' : 'Start Your Free Trial'}
            </h2>
            <p className="text-slate-500 text-sm">
                {isLogin ? 'Welcome back! Your labs are ready.' : 'Join today and get full access to all 3D labs.'}
            </p>
            </div>

            {errorMsg && (
                <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" /> {errorMsg}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
                <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 ml-1">FULL NAME</label>
                <div className="relative">
                    <UserCircle className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                    <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all placeholder:text-slate-400 font-medium"
                    />
                </div>
                </div>
            )}

            <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 ml-1">EMAIL ADDRESS</label>
                <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@school.com"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all placeholder:text-slate-400 font-medium"
                />
                </div>
            </div>

            <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 ml-1">PASSWORD</label>
                <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all placeholder:text-slate-400 font-medium"
                />
                </div>
            </div>

            <button
                type="submit"
                disabled={!!loadingStatus}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-orange-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {isLogin ? 'Enter Classroom' : 'Create Free Account'} <ArrowRight className="w-5 h-5" />
            </button>
            </form>

            <div className="mt-8 text-center pt-6 border-t border-slate-100">
            <p className="text-slate-500 text-sm">
                {isLogin ? "New here? " : "Already a member? "}
                <button
                onClick={() => { setIsLogin(!isLogin); setErrorMsg(''); }}
                className="text-brand-500 hover:text-brand-600 font-bold hover:underline transition-all"
                >
                {isLogin ? 'Sign up for free' : 'Log in'}
                </button>
            </p>
            </div>
            
            <div className="mt-6 flex justify-center gap-6 text-slate-300">
                 <div title="Secure Login">
                    <Shield className="w-5 h-5" />
                 </div>
                 <div title="Global Access">
                    <Globe className="w-5 h-5" />
                 </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;