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
        <div className="flex items-center justify-center h-full">
            <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-500 rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="animate-fade-in">
            <header className="mb-10">
                <h1 className="text-4xl font-black text-[#2D4536] tracking-tight mb-2">Platform Insights</h1>
                <p className="text-[#6BA37D] font-bold uppercase tracking-widest text-xs">Community Support Trends • Medical Data Visualization</p>
            </header>

            {/* Quick Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {[
                    { label: 'Total Patients', val: stats.userCount, icon: '👥', color: 'bg-emerald-50 text-emerald-600' },
                    { label: 'Medical Experts', val: stats.doctorCount, icon: '🩺', color: 'bg-indigo-50 text-indigo-600' },
                    { label: 'AI Consultations', val: '2,482', icon: '🤖', color: 'bg-rose-50 text-rose-600' },
                    { label: 'Success Rate', val: '94%', icon: '🚀', color: 'bg-amber-50 text-amber-600' }
                ].map(card => (
                    <div key={card.label} className="bg-white p-6 rounded-[2rem] border border-emerald-50 shadow-sm hover:shadow-md transition-all">
                        <div className={`w-12 h-12 ${card.color} rounded-2xl flex items-center justify-center text-2xl mb-4 shadow-inner`}>
                            {card.icon}
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{card.label}</p>
                        <p className="text-3xl font-black text-[#2D4536]">{card.val}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Visual Chart 1: Consultation Trends */}
                <div className="bg-white p-8 rounded-[3rem] border border-emerald-50 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10 blur-xl scale-150 -z-10 bg-emerald-500 rounded-full w-40 h-40"></div>
                    <div className="mb-8">
                        <h3 className="text-xl font-black text-[#2D4536] uppercase">Monthly Engagement</h3>
                        <p className="text-xs font-bold text-[#6BA37D] uppercase tracking-widest italic">Growth in medical consultations vs AI assessments</p>
                    </div>
                    
                    <div className="flex items-end h-64 gap-4 mt-10">
                        {stats.trends.map((item, idx) => (
                            <div key={item.month} className="flex-1 flex flex-col justify-end gap-2 group p-2">
                                <div className="flex gap-1.5 h-full items-end">
                                    <div 
                                        style={{ height: `${(item.consultations / 300) * 100}%` }}
                                        className="w-full bg-[#6BA37D] rounded-t-lg transition-all duration-700 group-hover:bg-[#5a8c6a] shadow-lg shadow-emerald-200/50"
                                    ></div>
                                    <div 
                                        style={{ height: `${(item.assessments / 800) * 100}%` }}
                                        className="w-full bg-[#E88C9A] rounded-t-lg transition-all duration-700 group-hover:bg-[#d47685] shadow-lg shadow-rose-200/50 opacity-40 hover:opacity-100"
                                    ></div>
                                </div>
                                <span className="text-[10px] font-black text-slate-400 text-center uppercase tracking-widest pt-2">{item.month}</span>
                            </div>
                        ))}
                    </div>
                    
                    <div className="mt-8 flex gap-6">
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-[#6BA37D]"></span>
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Doctors</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-[#E88C9A] opacity-40"></span>
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">AI Tools</span>
                        </div>
                    </div>
                </div>

                {/* Visual Chart 2: PCOS Distribution */}
                <div className="bg-white p-8 rounded-[3rem] border border-emerald-50 shadow-sm relative">
                    <div className="mb-8">
                        <h3 className="text-xl font-black text-[#2D4536] uppercase">Risk Assessment Distribution</h3>
                        <p className="text-xs font-bold text-[#6BA37D] uppercase tracking-widest italic">Community-wide health analysis</p>
                    </div>

                    <div className="flex items-center justify-center h-64">
                        <div className="relative w-48 h-48 rounded-full border-[1.5rem] border-emerald-50 flex items-center justify-center">
                            <div className="text-center">
                                <p className="text-4xl font-black text-emerald-600">82%</p>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Report Rate</p>
                            </div>
                            
                            {/* SVG Pie Chart overlay */}
                            <svg className="absolute -inset-6 w-60 h-60 -rotate-90 pointer-events-none">
                                <circle cx="120" cy="120" r="105" fill="none" stroke="#6BA37D" strokeWidth="20" strokeDasharray="330 660"></circle>
                                <circle cx="120" cy="120" r="105" fill="none" stroke="#E88C9A" strokeWidth="20" strokeDasharray="180 660" strokeDashoffset="-330" opacity="0.6"></circle>
                                <circle cx="120" cy="120" r="105" fill="none" stroke="#8FBF9F" strokeWidth="20" strokeDasharray="150 660" strokeDashoffset="-510" opacity="0.4"></circle>
                            </svg>
                        </div>
                    </div>

                    <div className="mt-10 space-y-4">
                        {stats.pcosDistribution.map((item, idx) => (
                            <div key={item.name} className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50/20 border border-emerald-50/50">
                                <div className="flex items-center gap-3">
                                    <span className={`w-2 h-2 rounded-full ${idx === 0 ? 'bg-[#6BA37D]' : idx === 1 ? 'bg-[#E88C9A]' : 'bg-[#8FBF9F]'}`}></span>
                                    <span className="text-[10px] font-bold text-[#4A4A4A] uppercase tracking-widest">{item.name}</span>
                                </div>
                                <span className="text-xs font-black text-[#6BA37D]">{item.value}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminInsights;
