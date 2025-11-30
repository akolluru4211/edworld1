import React, { useState, useEffect, useRef } from 'react';
import { FlaskConical, Atom, RefreshCw, Beaker } from 'lucide-react';

type ExperimentType = 'PHYSICS' | 'CHEMISTRY';

const ScienceLab: React.FC = () => {
    const [activeTab, setActiveTab] = useState<ExperimentType>('PHYSICS');
    
    return (
        <div className="h-full flex flex-col overflow-hidden bg-slate-50">
            <header className="mb-6 flex justify-between items-center px-6 pt-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-1">EdWorld Science Lab</h2>
                    <p className="text-slate-500 text-sm">Interactive Physics & Chemistry Simulations</p>
                </div>
                <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
                    <button 
                        onClick={() => setActiveTab('PHYSICS')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'PHYSICS' ? 'bg-brand-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
                    >
                        <Atom className="w-4 h-4" /> Physics
                    </button>
                    <button 
                         onClick={() => setActiveTab('CHEMISTRY')}
                         className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'CHEMISTRY' ? 'bg-green-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
                    >
                        <FlaskConical className="w-4 h-4" /> Chemistry
                    </button>
                </div>
            </header>

            <div className="flex-1 mx-6 mb-6 bg-white rounded-2xl border border-slate-200 relative overflow-hidden flex flex-col lg:flex-row shadow-sm">
                 {activeTab === 'PHYSICS' ? <PhysicsSim /> : <ChemistrySim />}
            </div>
        </div>
    );
};

const PhysicsSim = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [gravity, setGravity] = useState(9.8);
    const [bounciness, setBounciness] = useState(0.7);
    const [isRunning, setIsRunning] = useState(true);

    // Physics Loop
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let ballY = 50;
        let ballVel = 0;
        let animationId: number;
        
        const loop = () => {
            if (!isRunning) return;

            // Clear
            ctx.fillStyle = '#f8fafc'; // slate-50
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Grid
            ctx.strokeStyle = '#e2e8f0'; // slate-200
            ctx.lineWidth = 1;
            for (let i = 0; i < canvas.width; i += 40) {
                ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
            }
            for (let i = 0; i < canvas.height; i += 40) {
                ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke();
            }

            // Update Physics
            ballVel += gravity * 0.1;
            ballY += ballVel;

            // Floor Collision
            if (ballY + 20 > canvas.height - 20) {
                ballY = canvas.height - 20 - 20;
                ballVel *= -bounciness;
            }

            // Draw Ball
            ctx.beginPath();
            ctx.arc(canvas.width / 2, ballY, 20, 0, Math.PI * 2);
            ctx.fillStyle = '#3b82f6'; // brand-500
            ctx.fill();
            ctx.strokeStyle = '#2563eb';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // Highlight
            ctx.beginPath();
            ctx.arc(canvas.width / 2 - 6, ballY - 6, 6, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255,255,255,0.4)';
            ctx.fill();

            animationId = requestAnimationFrame(loop);
        };

        loop();

        return () => cancelAnimationFrame(animationId);
    }, [gravity, bounciness, isRunning]);

    return (
        <>
            <div className="flex-1 relative">
                <canvas 
                    ref={canvasRef} 
                    width={800} 
                    height={600} 
                    className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-white/80 backdrop-blur px-3 py-1 rounded-full border border-slate-200 text-xs font-bold text-slate-600 shadow-sm">
                    Gravity Lab: Free Fall
                </div>
            </div>
            <div className="w-full lg:w-80 bg-white p-6 border-l border-slate-200 flex flex-col gap-6 overflow-y-auto">
                <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">Parameters</h3>
                    <p className="text-xs text-slate-500 mb-4">Adjust environmental constants to observe effects.</p>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="flex justify-between text-sm font-semibold text-slate-600 mb-1">
                                <span>Gravity (m/s²)</span>
                                <span className="text-brand-600">{gravity}</span>
                            </label>
                            <input 
                                type="range" min="1" max="20" step="0.1"
                                value={gravity}
                                onChange={(e) => setGravity(parseFloat(e.target.value))}
                                className="w-full accent-brand-600"
                            />
                        </div>
                        <div>
                            <label className="flex justify-between text-sm font-semibold text-slate-600 mb-1">
                                <span>Restitution (Bounce)</span>
                                <span className="text-brand-600">{bounciness}</span>
                            </label>
                            <input 
                                type="range" min="0.1" max="1.2" step="0.1"
                                value={bounciness}
                                onChange={(e) => setBounciness(parseFloat(e.target.value))}
                                className="w-full accent-brand-600"
                            />
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <h4 className="text-sm font-bold text-slate-800 mb-2">Lesson Concept</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                        Notice how increasing gravity accelerates the ball faster downwards. A restitution coefficient greater than 1 would violate the law of conservation of energy (creating a perpetual motion machine).
                    </p>
                </div>

                <button 
                    onClick={() => { setIsRunning(false); setTimeout(() => setIsRunning(true), 10); }}
                    className="mt-auto w-full py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-500/20"
                >
                    <RefreshCw className="w-4 h-4" /> Reset Simulation
                </button>
            </div>
        </>
    );
};

const ChemistrySim = () => {
    const [ph, setPh] = useState(7);
    const [drops, setDrops] = useState(0);
    const [liquidColor, setLiquidColor] = useState('#22c55e'); // Neutral Green

    const addAcid = () => {
        const newPh = Math.max(0, ph - 0.5);
        updateState(newPh);
    };

    const addBase = () => {
        const newPh = Math.min(14, ph + 0.5);
        updateState(newPh);
    };

    const updateState = (newPh: number) => {
        setPh(newPh);
        setDrops(prev => prev + 1);
        
        // Color mapping for Universal Indicator
        if (newPh < 3) setLiquidColor('#ef4444'); // Red (Acid)
        else if (newPh < 6) setLiquidColor('#eab308'); // Yellow
        else if (newPh === 7) setLiquidColor('#22c55e'); // Green (Neutral)
        else if (newPh < 11) setLiquidColor('#3b82f6'); // Blue
        else setLiquidColor('#a855f7'); // Purple (Base)
    };

    return (
        <>
            <div className="flex-1 relative flex items-center justify-center bg-slate-100">
                {/* Background Lab Bench */}
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-white border-t border-slate-200" />
                
                {/* Beaker */}
                <div className="relative z-10 w-48 h-64 border-4 border-slate-300 border-t-0 rounded-b-3xl bg-white/30 backdrop-blur-sm overflow-hidden flex items-end justify-center shadow-xl">
                    {/* Liquid */}
                    <div 
                        className="w-full transition-all duration-500 ease-in-out"
                        style={{ height: `${40 + (drops * 2)}%`, backgroundColor: liquidColor, opacity: 0.8 }}
                    >
                        <div className="w-full h-full animate-pulse opacity-20 bg-white"></div>
                    </div>
                    {/* Graduations */}
                    <div className="absolute inset-0 pointer-events-none">
                        {[1,2,3,4].map(i => (
                            <div key={i} className="absolute left-0 w-6 h-0.5 bg-slate-400/50" style={{ bottom: `${i * 20}%` }} />
                        ))}
                    </div>
                    {/* Highlights */}
                    <div className="absolute top-0 right-4 w-2 h-full bg-white/20 rounded-full blur-sm"></div>
                </div>

                <div className="absolute top-10 text-center">
                    <span className="text-6xl font-bold text-slate-300 select-none">pH {ph.toFixed(1)}</span>
                </div>
            </div>

            <div className="w-full lg:w-80 bg-white p-6 border-l border-slate-200 flex flex-col gap-6">
                 <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">Titration Lab</h3>
                    <p className="text-xs text-slate-500 mb-4">Mix solutions to observe pH changes and neutralization.</p>

                    <div className="grid grid-cols-2 gap-4">
                        <button 
                            onClick={addAcid}
                            className="p-4 bg-red-50 border border-red-200 rounded-xl hover:bg-red-100 transition-all group shadow-sm"
                        >
                            <div className="flex flex-col items-center gap-2">
                                <Beaker className="w-8 h-8 text-red-500 group-hover:rotate-12 transition-transform" />
                                <span className="text-red-600 font-bold text-sm">+ Acid (H+)</span>
                            </div>
                        </button>
                        <button 
                             onClick={addBase}
                             className="p-4 bg-purple-50 border border-purple-200 rounded-xl hover:bg-purple-100 transition-all group shadow-sm"
                        >
                            <div className="flex flex-col items-center gap-2">
                                <Beaker className="w-8 h-8 text-purple-500 group-hover:-rotate-12 transition-transform" />
                                <span className="text-purple-600 font-bold text-sm">+ Base (OH-)</span>
                            </div>
                        </button>
                    </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex-1">
                    <h4 className="text-sm font-bold text-slate-800 mb-2">Indicator Guide</h4>
                    <div className="space-y-2 text-xs text-slate-600">
                        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500"></div> Acidic (pH 0-3)</div>
                        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-yellow-500"></div> Weak Acid (pH 4-6)</div>
                        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-500"></div> Neutral (pH 7)</div>
                        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500"></div> Weak Base (pH 8-10)</div>
                        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-purple-500"></div> Basic (pH 11-14)</div>
                    </div>
                </div>

                <button 
                    onClick={() => { setPh(7); setDrops(0); setLiquidColor('#22c55e'); }}
                    className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                >
                    <RefreshCw className="w-4 h-4" /> Clean Beaker
                </button>
            </div>
        </>
    );
}

export default ScienceLab;