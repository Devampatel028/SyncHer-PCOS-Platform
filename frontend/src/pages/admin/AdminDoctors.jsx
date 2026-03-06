import { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDoctors = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDoctor, setSelectedDoctor] = useState(null);

    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const res = await axios.get('http://localhost:5000/api/admin/data/doctors', {
                headers: { 'x-auth-token': token }
            });
            setDoctors(res.data);
        } catch (err) {
            console.error('Error fetching doctors:', err);
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
            <header className="mb-10 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black text-[#2D4536] tracking-tight mb-2">Active Doctors</h1>
                    <p className="text-[#6BA37D] font-bold uppercase tracking-widest text-xs">Medical Network Overview • {doctors.length} Registered Professionals</p>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {doctors.map((doctor) => (
                    <div 
                        key={doctor._id}
                        onClick={() => setSelectedDoctor(doctor)}
                        className="group bg-white rounded-[2.5rem] border border-emerald-50 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] hover:border-emerald-200 transition-all duration-300 cursor-pointer"
                    >
                        <div className="flex items-start gap-4 mb-6">
                            <div className="w-16 h-16 rounded-[1.25rem] bg-emerald-50 flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform duration-300">🩺</div>
                            <div>
                                <h3 className="text-xl font-black text-[#2D4536] group-hover:text-emerald-600 transition-colors uppercase">{doctor.name}</h3>
                                <p className="text-xs font-bold text-emerald-500 uppercase tracking-widest">{doctor.specialty || 'General Practitioner'}</p>
                                <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-tighter">ID: {doctor._id.slice(-8)}</p>
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-emerald-50">
                            <div className="flex items-center gap-3">
                                <span className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-xs opacity-70">📧</span>
                                <span className="text-sm font-bold text-[#4A4A4A] truncate">{doctor.email}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-xs opacity-70">🔐</span>
                                <span className="text-xs font-black text-[#6BA37D] tracking-widest uppercase">••••••••</span>
                            </div>
                        </div>

                        <div className="mt-8 flex justify-center">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#6BA37D] group-hover:translate-x-1 transition-transform">Click for full clinical profile →</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Doctor Info Modal */}
            {selectedDoctor && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[100] flex items-center justify-center p-6" onClick={() => setSelectedDoctor(null)}>
                    <div 
                        className="bg-white rounded-[3rem] w-full max-w-2xl overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.1)] border border-emerald-50 animate-scale-up"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="bg-gradient-to-br from-[#8FBF9F] to-[#6BA37D] p-10 text-white relative">
                            <button 
                                onClick={() => setSelectedDoctor(null)}
                                className="absolute top-6 right-6 w-10 h-10 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-2xl transition-all"
                            >✕</button>
                            <div className="flex items-center gap-6">
                                <div className="w-24 h-24 bg-white/20 rounded-[2rem] flex items-center justify-center text-5xl shadow-lg border border-white/30 backdrop-blur-sm">🩺</div>
                                <div>
                                    <h2 className="text-4xl font-black tracking-tight mb-2 uppercase">{selectedDoctor.name}</h2>
                                    <p className="text-emerald-100 font-bold uppercase tracking-[0.3em] text-sm">{selectedDoctor.specialty || 'Consultant'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-10 space-y-8">
                            <div className="grid grid-cols-2 gap-8">
                                <div className="p-6 bg-emerald-50/50 rounded-3xl border border-emerald-50">
                                    <p className="text-[10px] font-black text-[#6BA37D] uppercase tracking-widest mb-2">Email Address</p>
                                    <p className="text-base font-bold text-[#2D4536]">{selectedDoctor.email}</p>
                                </div>
                                <div className="p-6 bg-emerald-50/50 rounded-3xl border border-emerald-50">
                                    <p className="text-[10px] font-black text-[#6BA37D] uppercase tracking-widest mb-2">Access Credentials</p>
                                    <p className="text-base font-bold text-[#2D4536] tracking-widest lowercase">••••••••</p>
                                </div>
                                <div className="p-6 bg-emerald-50/50 rounded-3xl border border-emerald-50">
                                    <p className="text-[10px] font-black text-[#6BA37D] uppercase tracking-widest mb-2">Registration Status</p>
                                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-200 text-emerald-800 rounded-lg text-xs font-black uppercase tracking-wider">
                                        <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span> Verified
                                    </span>
                                </div>
                                <div className="p-6 bg-emerald-50/50 rounded-3xl border border-emerald-50">
                                    <p className="text-[10px] font-black text-[#6BA37D] uppercase tracking-widest mb-2">System Database ID</p>
                                    <code className="text-xs font-bold text-slate-400">{selectedDoctor._id}</code>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-emerald-50 flex justify-between items-center text-xs font-black uppercase tracking-widest text-[#6BA37D]">
                                <span>Doctor since: {new Date(selectedDoctor.createdAt).toLocaleDateString()}</span>
                                <button className="px-6 py-3 bg-[#E88C9A]/10 text-[#E88C9A] rounded-xl hover:bg-[#E88C9A] hover:text-white transition-all">Revoke Access</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDoctors;
