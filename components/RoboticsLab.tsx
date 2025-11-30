import React, { useState, useEffect } from 'react';
import { RobotConfig } from '../types';
import { generateRobotMission } from '../services/geminiService';
import { RefreshCw, Play, Cpu, CheckCircle } from 'lucide-react';

const RoboticsLab: React.FC = () => {
  const [config, setConfig] = useState<RobotConfig>({
    head: 'Sensor Array',
    body: 'Reinforced Titanium',
    legs: 'All-Terrain Tracks',
    color: 'bg-blue-500'
  });
  
  const [mission, setMission] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [rotation, setRotation] = useState(0);

  // Auto-rotate effect for the 3D preview
  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => (prev + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const handleSimulate = async () => {
    setLoading(true);
    const specString = `Head: ${config.head}, Body: ${config.body}, Legs: ${config.legs}, Color: ${config.color}`;
    const result = await generateRobotMission(specString);
    setMission(result);
    setLoading(false);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden bg-slate-50">
      <header className="mb-6 flex justify-between items-center px-6 pt-6">
        <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-1">EdWorld Robotics Lab</h2>
            <p className="text-slate-500 text-sm">Assemble, Configure, and Simulate Virtual Robots</p>
        </div>
        <div className="flex gap-2">
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold border border-green-200 flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div> Engine Active
            </span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0 px-6 pb-6">
        {/* Configuration Panel */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 overflow-y-auto shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
            <Cpu className="w-5 h-5 mr-2 text-brand-600" /> Assembly Station
          </h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Head Module</label>
              <div className="grid grid-cols-2 gap-2">
                {['Sensor Array', 'AI Core', 'Camera Unit', 'Defense Dome'].map(opt => (
                  <button
                    key={opt}
                    onClick={() => setConfig({...config, head: opt})}
                    className={`p-3 text-xs font-medium rounded-xl border transition-all ${config.head === opt ? 'bg-brand-50 border-brand-500 text-brand-700 shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Chassis Type</label>
              <select 
                value={config.body}
                onChange={(e) => setConfig({...config, body: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl p-3 focus:ring-2 focus:ring-brand-500 focus:outline-none focus:bg-white transition-colors"
              >
                <option>Reinforced Titanium</option>
                <option>Lightweight Carbon</option>
                <option>Heavy Armor Plating</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Locomotion</label>
              <div className="grid grid-cols-3 gap-2">
                {['Tracks', 'Bipedal', 'Hover'].map(opt => (
                  <button
                    key={opt}
                    onClick={() => setConfig({...config, legs: opt === 'Tracks' ? 'All-Terrain Tracks' : opt === 'Bipedal' ? 'Hydraulic Legs' : 'Hover Jets'})}
                    className={`p-2 text-xs font-medium rounded-xl border transition-all ${config.legs.includes(opt) ? 'bg-purple-50 border-purple-500 text-purple-700 shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
                 <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Core Color</label>
                 <div className="flex gap-3">
                     {['bg-blue-500', 'bg-red-500', 'bg-green-500', 'bg-yellow-500'].map(c => (
                         <button 
                            key={c}
                            onClick={() => setConfig({...config, color: c})}
                            className={`w-8 h-8 rounded-full ${c} ${config.color === c ? 'ring-2 ring-offset-2 ring-slate-400 scale-110' : 'opacity-70 hover:opacity-100'}`}
                         />
                     ))}
                 </div>
            </div>

            <button 
                onClick={handleSimulate}
                disabled={loading}
                className="w-full py-3 bg-brand-600 rounded-xl font-bold text-white shadow-lg shadow-brand-500/30 hover:bg-brand-700 transition-all flex items-center justify-center disabled:opacity-50"
            >
                {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <><Play className="w-5 h-5 mr-2" /> Run Simulation</>}
            </button>
          </div>
        </div>

        {/* 3D Visualization Area */}
        <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="flex-1 bg-slate-100 rounded-2xl border border-slate-200 relative overflow-hidden flex items-center justify-center perspective-1000 shadow-inner">
                 {/* Grid Floor */}
                 <div className="absolute inset-0 opacity-10" 
                      style={{
                          backgroundImage: 'linear-gradient(to right, #94a3b8 1px, transparent 1px), linear-gradient(to bottom, #94a3b8 1px, transparent 1px)',
                          backgroundSize: '40px 40px',
                          transform: 'rotateX(60deg) scale(2)',
                          top: '50%'
                      }}>
                 </div>
                 
                 {/* The Robot */}
                 <div className="relative transform-style-3d transition-transform duration-100" style={{ transform: `rotateY(${rotation}deg)` }}>
                     {/* Head */}
                     <div className={`absolute -top-16 left-1/2 -translate-x-1/2 w-16 h-12 bg-white rounded-lg shadow-xl border border-slate-300 flex items-center justify-center transform-style-3d translate-z-10`}>
                        <div className="w-10 h-2 bg-slate-800 rounded-full overflow-hidden relative">
                            <div className="absolute top-0 left-0 h-full w-4 bg-red-500 animate-ping"></div>
                        </div>
                     </div>

                     {/* Body */}
                     <div className={`w-32 h-40 ${config.color} rounded-xl shadow-2xl border-4 border-white flex items-center justify-center relative`}>
                         <div className="text-white/80 font-mono text-xs text-center p-2 font-bold">
                             MK-IV<br/>CORE
                         </div>
                         <div className="absolute -left-4 top-4 w-4 h-24 bg-slate-400 rounded-l-lg border-l border-slate-500"></div>
                         <div className="absolute -right-4 top-4 w-4 h-24 bg-slate-400 rounded-r-lg border-r border-slate-500"></div>
                     </div>

                     {/* Legs */}
                     <div className="absolute top-40 left-1/2 -translate-x-1/2 w-40 flex justify-between">
                         {config.legs.includes('Tracks') ? (
                             <div className="w-full h-12 bg-slate-700 rounded-full border-t-4 border-slate-500 mt-2 shadow-lg"></div>
                         ) : config.legs.includes('Hover') ? (
                             <div className="w-full h-8 bg-blue-400/50 blur-md rounded-full mt-4 animate-pulse"></div>
                         ) : (
                             <>
                                <div className="w-8 h-24 bg-slate-600 -skew-x-12 origin-top rounded-b-lg"></div>
                                <div className="w-8 h-24 bg-slate-600 skew-x-12 origin-top rounded-b-lg"></div>
                             </>
                         )}
                     </div>
                 </div>

                 <div className="absolute top-4 right-4 bg-white/80 backdrop-blur px-3 py-1 rounded-full border border-slate-200 text-xs font-bold text-slate-600 shadow-sm">
                     Live Render
                 </div>
            </div>

            {/* Simulation Console */}
            <div className="h-48 bg-slate-900 rounded-2xl border border-slate-800 p-5 font-mono text-sm overflow-y-auto shadow-lg text-slate-300">
                <div className="flex items-center gap-2 text-slate-500 border-b border-slate-800 pb-2 mb-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="ml-2">Simulation Output</span>
                </div>
                {loading ? (
                    <div className="space-y-1">
                        <p className="text-yellow-400">> Initializing physics engine...</p>
                        <p className="text-yellow-400">> Loading terrain data...</p>
                        <p className="text-yellow-400">> Checking sensor calibration...</p>
                    </div>
                ) : mission ? (
                     <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                         <p className="text-green-400 mb-2"> > SYSTEM READY.</p>
                         <p className="text-white typing-effect leading-relaxed">{mission}</p>
                     </div>
                ) : (
                    <p className="text-slate-500 italic">Configure robot and run simulation to view mission data.</p>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default RoboticsLab;