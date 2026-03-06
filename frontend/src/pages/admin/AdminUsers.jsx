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
        <div className="flex items-center justify-center h-full">
            <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-500 rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="animate-fade-in">
            <header className="mb-10 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black text-[#2D4536] tracking-tight mb-2">Active Users</h1>
                    <p className="text-[#6BA37D] font-bold uppercase tracking-widest text-xs">Patient Management • {users.length} Registered Individuals</p>
                </div>
            </header>

            <div className="bg-white rounded-[2.5rem] border border-emerald-50 shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-emerald-50/50 border-b border-emerald-50">
                        <tr>
                            <th className="px-8 py-5 text-[10px] font-black text-[#6BA37D] uppercase tracking-widest">User Profile</th>
                            <th className="px-8 py-5 text-[10px] font-black text-[#6BA37D] uppercase tracking-widest">Health Metrics</th>
                            <th className="px-8 py-5 text-[10px] font-black text-[#6BA37D] uppercase tracking-widest">PCOS Status</th>
                            <th className="px-8 py-5 text-[10px] font-black text-[#6BA37D] uppercase tracking-widest">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-emerald-50/50">
                        {users.map((user) => (
                            <tr key={user._id} className="hover:bg-emerald-50/20 transition-colors">
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-lg shadow-inner">👤</div>
                                        <div>
                                            <p className="text-sm font-black text-[#2D4536]">{user.name}</p>
                                            <p className="text-xs text-slate-400 font-bold">{user.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex gap-4">
                                        <div className="text-center">
                                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-tighter">Age</p>
                                            <p className="text-sm font-black text-[#6BA37D]">{user.age || '--'}</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-tighter">BMI</p>
                                            <p className="text-sm font-black text-[#6BA37D]">
                                                {user.weight && user.height 
                                                    ? (user.weight / ((user.height/100)*(user.height/100))).toFixed(1) 
                                                    : '--'
                                                }
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                                        user.pcosStatus === 'positive' 
                                        ? 'bg-rose-50 text-rose-600 border border-rose-100' 
                                        : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                    }`}>
                                        {user.pcosStatus || 'Unknown'}
                                    </span>
                                </td>
                                <td className="px-8 py-6">
                                    <button 
                                        onClick={() => setSelectedUser(user)}
                                        className="text-xs font-black text-emerald-600 hover:text-emerald-800 transition-colors uppercase tracking-widest underline underline-offset-4"
                                    >
                                        View Full Profile
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* User Detail Modal */}
            {selectedUser && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[100] flex items-center justify-center p-6" onClick={() => setSelectedUser(null)}>
                    <div 
                        className="bg-white rounded-[3rem] w-full max-w-2xl overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.1)] border border-emerald-50 animate-scale-up"
                        onClick={e => e.stopPropagation()}
                    >
                        <header className="p-10 border-b border-emerald-50 flex items-center justify-between">
                            <div className="flex items-center gap-6">
                                <div className="w-20 h-20 rounded-[1.5rem] bg-emerald-50 flex items-center justify-center text-4xl shadow-inner">👤</div>
                                <div>
                                    <h2 className="text-3xl font-black text-[#2D4536] tracking-tight uppercase">{selectedUser.name}</h2>
                                    <p className="text-sm font-bold text-[#6BA37D] tracking-widest uppercase italic">{selectedUser.email}</p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedUser(null)} className="w-10 h-10 bg-slate-50 hover:bg-slate-100 rounded-full flex items-center justify-center transition-all text-xl">✕</button>
                        </header>

                        <div className="p-10">
                            <h3 className="text-xs font-black text-[#6BA37D] uppercase tracking-[0.3em] mb-6">Patient Health Record</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                {[
                                    { label: 'Age', val: selectedUser.age },
                                    { label: 'Weight (kg)', val: selectedUser.weight },
                                    { label: 'Height (cm)', val: selectedUser.height },
                                    { label: 'Cycle Length', val: selectedUser.cycleLength },
                                    { label: 'PCOS Detected', val: selectedUser.pcosStatus, highlight: true },
                                    { label: 'Member Since', val: new Date(selectedUser.createdAt).toLocaleDateString() }
                                ].map(item => (
                                    <div key={item.label} className="p-5 bg-emerald-50/20 rounded-2xl border border-emerald-50/50">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
                                        <p className={`text-base font-black ${item.highlight ? 'text-emerald-700' : 'text-[#2D4536]'} uppercase`}>{item.val || 'N/A'}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <footer className="p-8 bg-emerald-50/30 flex justify-between items-center">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Confidential Medical Data • Admin Access</span>
                            <div className="flex gap-4">
                                <button className="px-6 py-2.5 bg-white border border-emerald-100 text-[#6BA37D] rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-emerald-300 transition-all shadow-sm">Export Report</button>
                                <button className="px-6 py-2.5 bg-[#E88C9A] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#D97A88] transition-all shadow-md">Flag Account</button>
                            </div>
                        </footer>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUsers;
