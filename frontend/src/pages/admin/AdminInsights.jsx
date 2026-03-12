import { useState, useEffect } from 'react';
import axios from 'axios';

const AdminInsights = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const res = await axios.get('http://localhost:5000/api/admin/data/stats', {
                headers: { 'x-auth-token': token }
            });
            setStats(res.data);
        } catch (err) {
            console.error('Error fetching stats:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center h-[60vh]">
            <div className="w-16 h-16 border-4 border-[#E2E8F0] border-t-[#2D4536] rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="animate-fade-in space-y-12 pb-20">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-5xl font-black text-[#1A202C] tracking-tight mb-3">Platform Insights</h1>
                    <p className="text-[#718096] font-bold uppercase tracking-[0.3em] text-xs flex items-center gap-2">
                        <span className="w-8 h-[1px] bg-[#68D391]"></span>
                        Real-time Analytics & Growth Metrics
                    </p>
                </div>
                <div className="bg-white px-6 py-3 rounded-2xl border border-[#E2E8F0] shadow-sm flex items-center gap-4">
                    <span className="text-[10px] font-black text-[#A0AEC0] uppercase tracking-widest">Last Updated</span>
                    <span className="text-sm font-black text-[#2D4536]">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
            </header>

            {/* Quick Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                    { label: 'Registered Patients', val: stats.userCount, icon: '👥', color: 'from-[#68D391] to-[#48BB78]', bg: 'bg-emerald-50/50' },
                    { label: 'Medical Experts', val: stats.doctorCount, icon: '🩺', color: 'from-[#6366F1] to-[#4F46E5]', bg: 'bg-indigo-50/50' },
                    { label: 'AI Assessments', val: '2,942', icon: '🤖', color: 'from-[#F56565] to-[#E53E3E]', bg: 'bg-rose-50/50' },
                    { label: 'Satisfaction', val: '98%', icon: '⭐️', color: 'from-[#ECC94B] to-[#D69E2E]', bg: 'bg-amber-50/50' }
                ].map(card => (
                    <div key={card.label} className="bg-white p-8 rounded-[2.5rem] border border-[#E2E8F0] shadow-[0_10px_40px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.05)] transition-all duration-500 group relative overflow-hidden">
                        <div className={`absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 bg-gradient-to-br ${card.color} opacity-[0.03] rounded-full transition-transform duration-700 group-hover:scale-150`}></div>
                        <div className={`w-14 h-14 ${card.bg} rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-sm`}>
                            {card.icon}
                        </div>
                        <p className="text-[11px] font-black text-[#A0AEC0] uppercase tracking-[0.15em] mb-2">{card.label}</p>
                        <p className="text-4xl font-black text-[#1A202C] tracking-tighter">{card.val}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-5 gap-10">
                {/* Visual Chart 1: Monthly Trends */}
                <div className="xl:col-span-3 bg-white p-10 rounded-[3rem] border border-[#E2E8F0] shadow-sm relative group overflow-hidden">
                    <div className="flex justify-between items-start mb-12">
                        <div>
                            <h3 className="text-2xl font-black text-[#1A202C] tracking-tight">Growth Analytics</h3>
                            <p className="text-xs font-bold text-[#718096] uppercase tracking-widest mt-1">Monthly trend of platform utilization</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-[#2D4536]"></span>
                                <span className="text-[10px] font-black pointer-events-none text-[#718096] uppercase tracking-widest">Medical</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-[#E88C9A]"></span>
                                <span className="text-[10px] font-black pointer-events-none text-[#718096] uppercase tracking-widest">Digital</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex items-end h-80 gap-6 mt-4 relative">
                        {/* Grid Lines */}
                        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-[0.03]">
                            {[1, 2, 3, 4].map(i => <div key={i} className="w-full h-[1px] bg-black"></div>)}
                        </div>

                        {stats.trends.map((item, idx) => (
                            <div key={item.month} className="flex-1 flex flex-col justify-end gap-3 group/bar z-10 transition-transform hover:scale-[1.02]">
                                <div className="flex gap-2 h-full items-end pb-1">
                                    <div 
                                        style={{ height: `${(item.consultations / 300) * 100}%` }}
                                        className="w-full bg-[#2D4536] rounded-xl transition-all duration-1000 group-hover/bar:bg-[#1E2F24] shadow-lg shadow-emerald-900/10 min-h-[4px]"
                                    ></div>
                                    <div 
                                        style={{ height: `${(item.assessments / 800) * 100}%` }}
                                        className="w-full bg-[#E88C9A] rounded-xl transition-all duration-1000 group-hover/bar:bg-[#D97A88] shadow-lg shadow-rose-900/10 min-h-[4px]"
                                    ></div>
                                </div>
                                <span className="text-[11px] font-black text-[#A0AEC0] text-center uppercase tracking-widest">{item.month}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Visual Chart 2: PCOS Distribution */}
                <div className="xl:col-span-2 bg-white p-10 rounded-[3rem] border border-[#E2E8F0] shadow-sm flex flex-col">
                    <div className="mb-10">
                        <h3 className="text-2xl font-black text-[#1A202C] tracking-tight">Risk Distribution</h3>
                        <p className="text-xs font-bold text-[#718096] uppercase tracking-widest mt-1">Clinical case classification</p>
                    </div>

                    <div className="flex-1 flex flex-col justify-center items-center">
                        <div className="relative w-64 h-64 mb-10 flex items-center justify-center">
                            <div className="absolute inset-0 rounded-full border-[1.75rem] border-[#F7FAFC] shadow-inner"></div>
                            
                            {/* SVG Pie Chart overlay - Fixed scaling and alignment */}
                            <svg className="absolute inset-0 w-64 h-64 -rotate-90 drop-shadow-2xl">
                                <circle 
                                    cx="128" cy="128" r="112" 
                                    fill="none" stroke="#2D4536" strokeWidth="24" 
                                    strokeDasharray={`${(40/100)*703.7} 1000`} 
                                    className="transition-all duration-1000 stroke-linecap-round"
                                />
                                <circle 
                                    cx="128" cy="128" r="112" 
                                    fill="none" stroke="#E88C9A" strokeWidth="24" 
                                    strokeDasharray={`${(35/100)*703.7} 1000`} 
                                    strokeDashoffset={`-${(40/100)*703.7}`}
                                    className="transition-all duration-1000 opacity-[0.8]"
                                />
                                <circle 
                                    cx="128" cy="128" r="112" 
                                    fill="none" stroke="#8FBF9F" strokeWidth="24" 
                                    strokeDasharray={`${(25/100)*703.7} 1000`} 
                                    strokeDashoffset={`-${(75/100)*703.7}`}
                                    className="transition-all duration-1000 opacity-[0.5]"
                                />
                            </svg>

                            <div className="relative z-10 text-center">
                                <p className="text-5xl font-black text-[#1A202C] tracking-tighter">100%</p>
                                <p className="text-[10px] font-black text-[#A0AEC0] uppercase tracking-widest mt-1">Database Coverage</p>
                            </div>
                        </div>

                        <div className="w-full space-y-3 mt-auto">
                            {stats.pcosDistribution.map((item, idx) => (
                                <div key={item.name} className="flex items-center justify-between p-4 rounded-2xl bg-[#F7FAFC] border border-[#EDF2F7] hover:bg-white hover:shadow-md transition-all duration-300 group">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-3 h-3 rounded-full ${idx === 0 ? 'bg-[#2D4536]' : idx === 1 ? 'bg-[#E88C9A]' : 'bg-[#8FBF9F]'}`}></div>
                                        <span className="text-[11px] font-bold text-[#4A5568] uppercase tracking-wider group-hover:text-[#1A202C]">{item.name}</span>
                                    </div>
                                    <span className="text-sm font-black text-[#2D4536]">{item.value}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminInsights;
