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
        <div className="flex items-center justify-center h-[60vh]">
            <div className="w-16 h-16 border-4 border-[#E2E8F0] border-t-[#2D4536] rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="animate-fade-in space-y-8 pb-20">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-5xl font-black text-[#1A202C] tracking-tight mb-3">Medical Network</h1>
                    <p className="text-[#718096] font-bold uppercase tracking-[0.3em] text-xs flex items-center gap-2">
                        <span className="w-8 h-[1px] bg-[#68D391]"></span>
                        {doctors.length} Verified Health Professionals
                    </p>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {doctors.map((doctor) => (
                    <div 
                        key={doctor._id}
                        onClick={() => setSelectedDoctor(doctor)}
                        className="group bg-white rounded-[3rem] border border-[#E2E8F0] p-8 shadow-[0_10px_40px_rgba(0,0,0,0.02)] hover:shadow-[0_30px_70px_rgba(0,0,0,0.06)] hover:border-[#68D391] transition-all duration-500 cursor-pointer relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 bg-emerald-50 opacity-40 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                        
                        <div className="flex items-start gap-5 mb-8 relative z-10">
                            <div className="w-16 h-16 rounded-2xl bg-[#F7FAFC] flex items-center justify-center text-3xl shadow-inner group-hover:bg-[#2D4536] group-hover:text-white transition-all duration-500">🩺</div>
                            <div>
                                <h3 className="text-xl font-black text-[#1A202C] leading-none mb-2 uppercase tracking-tight">{doctor.name}</h3>
                                <p className="text-xs font-black text-[#68D391] uppercase tracking-widest">{doctor.specialty || 'General Practitioner'}</p>
                                <p className="text-[10px] text-[#A0AEC0] font-bold mt-2 uppercase tracking-tighter italic">License: SYNC-{doctor._id.slice(-6).toUpperCase()}</p>
                            </div>
                        </div>

                        <div className="space-y-4 pt-6 border-t border-[#EDF2F7] relative z-10">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black text-[#A0AEC0] uppercase tracking-widest">Digital ID</span>
                                <span className="text-xs font-bold text-[#4A5568]">{doctor.email}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black text-[#A0AEC0] uppercase tracking-widest">Network Status</span>
                                <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[9px] font-black uppercase tracking-widest">Active</span>
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end pt-4 relative z-10">
                            <div className="w-10 h-10 rounded-full bg-[#F7FAFC] flex items-center justify-center text-[#A0AEC0] group-hover:bg-[#2D4536] group-hover:text-white transition-all duration-300">
                                →
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Doctor Info Modal */}
            {selectedDoctor && (
                <div className="fixed inset-0 bg-[#1A202C]/60 backdrop-blur-md z-[100] flex items-center justify-center p-6" onClick={() => setSelectedDoctor(null)}>
                    <div 
                        className="bg-white rounded-[4rem] w-full max-w-2xl overflow-hidden shadow-[0_50px_150px_rgba(0,0,0,0.25)] border border-[#E2E8F0] animate-scale-up"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="bg-gradient-to-br from-[#2D4536] to-[#1E2F24] p-12 text-white relative">
                            <button 
                                onClick={() => setSelectedDoctor(null)}
                                className="absolute top-8 right-8 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-2xl transition-all border border-white/20"
                            >✕</button>
                            <div className="flex items-center gap-8">
                                <div className="w-28 h-28 bg-white/10 rounded-[2.5rem] flex items-center justify-center text-6xl shadow-2xl border border-white/30 backdrop-blur-sm">🩺</div>
                                <div>
                                    <h2 className="text-4xl font-black tracking-tight mb-2 uppercase leading-none">{selectedDoctor.name}</h2>
                                    <p className="text-[#68D391] font-black uppercase tracking-[0.4em] text-xs underline underline-offset-8 decoration-white/20">{selectedDoctor.specialty || 'Medical Consultant'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-12 space-y-8">
                            <div className="grid grid-cols-2 gap-8">
                                <div className="p-8 bg-[#F7FAFC] rounded-[2.5rem] border border-[#EDF2F7]">
                                    <p className="text-[10px] font-black text-[#A0AEC0] uppercase tracking-widest mb-3">Official Email</p>
                                    <p className="text-base font-black text-[#1A202C]">{selectedDoctor.email}</p>
                                </div>
                                <div className="p-8 bg-[#F7FAFC] rounded-[2.5rem] border border-[#EDF2F7]">
                                    <p className="text-[10px] font-black text-[#A0AEC0] uppercase tracking-widest mb-3">Network Access</p>
                                    <p className="text-base font-black text-[#2D4536] tracking-[0.5em] lowercase">••••••••</p>
                                </div>
                                <div className="p-8 bg-[#F7FAFC] rounded-[2.5rem] border border-[#EDF2F7]">
                                    <p className="text-[10px] font-black text-[#A0AEC0] uppercase tracking-widest mb-3">Verification</p>
                                    <span className="inline-flex items-center gap-3 px-4 py-1.5 bg-emerald-100 text-emerald-800 rounded-xl text-[10px] font-black uppercase tracking-widest">
                                        <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span> Certified
                                    </span>
                                </div>
                                <div className="p-8 bg-[#F7FAFC] rounded-[2.5rem] border border-[#EDF2F7]">
                                    <p className="text-[10px] font-black text-[#A0AEC0] uppercase tracking-widest mb-3">Regulatory ID</p>
                                    <code className="text-[10px] font-black text-[#718096] bg-white px-2 py-1 rounded-md border border-[#E2E8F0]">{selectedDoctor._id}</code>
                                </div>
                            </div>

                            <div className="pt-10 border-t border-[#EDF2F7] flex justify-between items-center">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-[#A0AEC0] uppercase tracking-widest">Member Registry Date</span>
                                    <span className="text-sm font-black text-[#1A202C]">{new Date(selectedDoctor.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                </div>
                                <button className="px-10 py-4 bg-[#E53E3E]/5 text-[#E53E3E] rounded-2xl text-[10px] font-black uppercase tracking-widest border border-[#FEB2B2] hover:bg-[#E53E3E] hover:text-white transition-all duration-300 shadow-sm">Revoke Credentials</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDoctors;
