
import React from 'react';
import { Check, Star } from 'lucide-react';

const Pricing: React.FC = () => {
    return (
        <div className="h-full overflow-y-auto bg-slate-50 p-8">
            <div className="max-w-4xl mx-auto text-center mb-10">
                <h2 className="text-3xl font-bold text-slate-800 mb-4">Invest in Your Future</h2>
                <p className="text-slate-500 text-lg">Choose the plan that fits your learning style. Switch anytime.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {/* Free Plan */}
                <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative">
                    <h3 className="text-xl font-bold text-slate-800 mb-2">Starter</h3>
                    <div className="text-4xl font-bold text-slate-900 mb-6">Free</div>
                    <p className="text-slate-500 mb-8 text-sm">Perfect for trying out the labs and basic coding.</p>
                    
                    <ul className="space-y-4 mb-8 text-left">
                        <li className="flex items-center gap-3 text-slate-700 text-sm">
                            <Check className="w-5 h-5 text-green-500" /> Access to Science 3D Lab
                        </li>
                        <li className="flex items-center gap-3 text-slate-700 text-sm">
                            <Check className="w-5 h-5 text-green-500" /> Basic Python Compiler
                        </li>
                        <li className="flex items-center gap-3 text-slate-700 text-sm">
                            <Check className="w-5 h-5 text-green-500" /> Community Forum Access
                        </li>
                    </ul>

                    <button className="w-full py-3 rounded-xl border-2 border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-colors">
                        Current Plan
                    </button>
                </div>

                {/* Pro Plan */}
                <div className="bg-slate-900 rounded-3xl p-8 shadow-xl relative overflow-hidden transform md:-translate-y-4">
                    <div className="absolute top-0 right-0 bg-gradient-to-l from-brand-500 to-transparent w-32 h-32 opacity-20 rounded-bl-full"></div>
                    <div className="absolute top-4 right-4 bg-brand-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                        <Star className="w-3 h-3 fill-current" /> Most Popular
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2">Pro Scholar</h3>
                    <div className="text-4xl font-bold text-white mb-6">$9.99<span className="text-base font-normal text-slate-400">/mo</span></div>
                    <p className="text-slate-400 mb-8 text-sm">Unlock the full power of AI and advanced robotics.</p>
                    
                    <ul className="space-y-4 mb-8 text-left">
                        <li className="flex items-center gap-3 text-white text-sm">
                            <div className="bg-brand-500/20 p-1 rounded-full"><Check className="w-3 h-3 text-brand-400" /></div>
                            All 3D Labs (Robotics, Science, Art)
                        </li>
                        <li className="flex items-center gap-3 text-white text-sm">
                            <div className="bg-brand-500/20 p-1 rounded-full"><Check className="w-3 h-3 text-brand-400" /></div>
                            Unlimited AI Tutor Access
                        </li>
                        <li className="flex items-center gap-3 text-white text-sm">
                            <div className="bg-brand-500/20 p-1 rounded-full"><Check className="w-3 h-3 text-brand-400" /></div>
                            Advanced Coding (C++, Java)
                        </li>
                        <li className="flex items-center gap-3 text-white text-sm">
                            <div className="bg-brand-500/20 p-1 rounded-full"><Check className="w-3 h-3 text-brand-400" /></div>
                            Certified Completion Badges
                        </li>
                    </ul>

                    <button className="w-full py-3 rounded-xl bg-brand-600 text-white font-bold hover:bg-brand-700 transition-colors shadow-lg shadow-brand-500/30">
                        Upgrade to Pro
                    </button>
                    <p className="text-center text-xs text-slate-500 mt-4">30-day money-back guarantee. Cancel anytime.</p>
                </div>
            </div>
        </div>
    );
};

export default Pricing;
