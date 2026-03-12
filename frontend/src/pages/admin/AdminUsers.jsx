import { useState, useEffect } from 'react';
import axios from 'axios';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const res = await axios.get('http://localhost:5000/api/admin/data/users', {
                headers: { 'x-auth-token': token }
            });
            setUsers(res.data);
        } catch (err) {
            console.error('Error fetching users:', err);
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
                    <h1 className="text-5xl font-black text-[#1A202C] tracking-tight mb-3">Patient Registry</h1>
                    <p className="text-[#718096] font-bold uppercase tracking-[0.3em] text-xs flex items-center gap-2">
                        <span className="w-8 h-[1px] bg-[#68D391]"></span>
                        {users.length} Active Platform Members
                    </p>
                </div>
            </header>

            <div className="bg-white rounded-[2.5rem] border border-[#E2E8F0] shadow-[0_10px_40px_rgba(0,0,0,0.02)] overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-[#F7FAFC] border-b border-[#EDF2F7]">
                            <th className="px-10 py-6 text-[11px] font-black text-[#A0AEC0] uppercase tracking-[0.2em]">Patient Profile</th>
                            <th className="px-10 py-6 text-[11px] font-black text-[#A0AEC0] uppercase tracking-[0.2em]">Physical Metrics</th>
                            <th className="px-10 py-6 text-[11px] font-black text-[#A0AEC0] uppercase tracking-[0.2em]">Clinical Status</th>
                            <th className="px-10 py-6 text-[11px] font-black text-[#A0AEC0] uppercase tracking-[0.2em] text-right">Access</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EDF2F7]">
                        {users.map((user) => (
                            <tr key={user._id} className="group hover:bg-[#F7FAFC] transition-all duration-300">
                                <td className="px-10 py-8">
                                    <div className="flex items-center gap-5">
                                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition-transform duration-500">
                                            {user.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-base font-black text-[#1A202C] leading-none mb-1.5">{user.name}</p>
                                            <p className="text-xs text-[#718096] font-bold">{user.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-10 py-8">
                                    <div className="flex gap-8">
                                        <div>
                                            <p className="text-[10px] font-black text-[#A0AEC0] uppercase tracking-tighter mb-1">Age</p>
                                            <p className="text-sm font-black text-[#2D4536]">{user.age || '--'}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-[#A0AEC0] uppercase tracking-tighter mb-1">BMI</p>
                                            <p className="text-sm font-black text-[#2D4536]">
                                                {user.weight && user.height 
                                                    ? (user.weight / ((user.height/100)*(user.height/100))).toFixed(1) 
                                                    : '--'
                                                }
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-10 py-8">
                                    <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                        user.pcosStatus === 'positive' 
                                        ? 'bg-rose-50 text-rose-600 border border-rose-100' 
                                        : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                    }`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${user.pcosStatus === 'positive' ? 'bg-rose-500' : 'bg-emerald-500 animate-pulse'}`}></span>
                                        {user.pcosStatus || 'Pending'}
                                    </span>
                                </td>
                                <td className="px-10 py-8 text-right">
                                    <button 
                                        onClick={() => setSelectedUser(user)}
                                        className="px-6 py-2.5 bg-white border border-[#E2E8F0] rounded-xl text-[10px] font-black text-[#2D4536] uppercase tracking-widest hover:bg-[#2D4536] hover:text-white hover:border-[#2D4536] transition-all duration-300 shadow-sm"
                                    >
                                        View Clinical File
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* User Detail Modal - Modern Slide-over feel */}
            {selectedUser && (
                <div className="fixed inset-0 bg-[#1A202C]/60 backdrop-blur-md z-[100] flex items-center justify-center p-6" onClick={() => setSelectedUser(null)}>
                    <div 
                        className="bg-white rounded-[3.5rem] w-full max-w-2xl overflow-hidden shadow-[0_40px_120px_rgba(0,0,0,0.2)] border border-[#E2E8F0] animate-scale-up"
                        onClick={e => e.stopPropagation()}
                    >
                        <header className="p-12 border-b border-[#EDF2F7] flex items-center justify-between relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 -mr-32 -mt-32 bg-emerald-50 opacity-40 rounded-full blur-3xl"></div>
                            <div className="flex items-center gap-8 relative z-10">
                                <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-[#2D4536] to-[#1E2F24] flex items-center justify-center text-4xl text-white shadow-2xl">
                                    {selectedUser.name.charAt(0)}
                                </div>
                                <div>
                                    <h2 className="text-4xl font-black text-[#1A202C] tracking-tight uppercase leading-none mb-2">{selectedUser.name}</h2>
                                    <p className="text-sm font-bold text-[#68D391] tracking-[0.2em] uppercase italic">{selectedUser.email}</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setSelectedUser(null)} 
                                className="w-12 h-12 bg-[#F7FAFC] hover:bg-[#EDF2F7] rounded-full flex items-center justify-center transition-all text-xl text-[#718096] relative z-10"
                            >✕</button>
                        </header>

                        <div className="p-12">
                            <h3 className="text-[11px] font-black text-[#A0AEC0] uppercase tracking-[0.4em] mb-8">Clinical Health Record</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                                {[
                                    { label: 'Baseline Age', val: `${selectedUser.age || 'N/A'} Yrs` },
                                    { label: 'Current Weight', val: `${selectedUser.weight || 'N/A'} kg` },
                                    { label: 'Measured Height', val: `${selectedUser.height || 'N/A'} cm` },
                                    { label: 'Avg Cycle Length', val: `${selectedUser.cycleLength || 'N/A'} Days` },
                                    { label: 'Medical Status', val: selectedUser.pcosStatus, highlight: true },
                                    { label: 'System Access', val: new Date(selectedUser.createdAt).toLocaleDateString() }
                                ].map(item => (
                                    <div key={item.label} className="p-6 bg-[#F7FAFC] rounded-3xl border border-[#EDF2F7] transition-all hover:border-[#CBD5E0]">
                                        <p className="text-[10px] font-black text-[#A0AEC0] uppercase tracking-widest mb-2">{item.label}</p>
                                        <p className={`text-lg font-black ${item.highlight ? 'text-[#2D4536]' : 'text-[#1A202C]'} uppercase tracking-tight`}>{item.val || 'NULL'}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <footer className="px-12 py-10 bg-[#F7FAFC] flex justify-between items-center border-t border-[#EDF2F7]">
                            <div className="flex items-center gap-3">
                                <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse"></span>
                                <span className="text-[10px] font-black text-[#A0AEC0] uppercase tracking-widest italic">Protected Data • Level 1 Clearance</span>
                            </div>
                            <div className="flex gap-4">
                                <button className="px-8 py-3.5 bg-white border border-[#E2E8F0] text-[#2D4536] rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-[#2D4536] transition-all shadow-sm">Export PDF</button>
                                <button className="px-8 py-3.5 bg-[#2D4536] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#1E2F24] transition-all shadow-xl shadow-emerald-900/10">Modify Access</button>
                            </div>
                        </footer>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUsers;
