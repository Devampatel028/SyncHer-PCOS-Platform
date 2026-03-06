import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminLogin = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await axios.post('http://localhost:5000/api/admin/login', { email, password });
            onLogin(res.data);
            navigate('/admin/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F6FFF9] flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
            {/* Background Blobs */}
            <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#8FBF9F]/10 blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#6BA37D]/10 blur-[120px] pointer-events-none"></div>

            <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-emerald-50 p-10 relative z-10 animate-fade-in">
                <div className="flex flex-col items-center mb-10">
                    <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center text-4xl mb-6 shadow-inner">🛡️</div>
                    <h1 className="text-3xl font-black text-[#2D4536] tracking-tight mb-2">Admin Portal</h1>
                    <p className="text-[#6BA37D] font-bold text-sm uppercase tracking-widest">Authorized Access Only</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-xs font-black text-[#2D4536] uppercase tracking-wider mb-2 ml-1">Admin Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-6 py-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:bg-white transition-all font-medium text-[#2D4536]"
                            placeholder="name@example.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-black text-[#2D4536] uppercase tracking-wider mb-2 ml-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-6 py-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:bg-white transition-all font-medium text-[#2D4536]"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    {error && (
                        <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600 text-sm font-bold animate-shake">
                            <span>⚠️</span> {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-gradient-to-r from-[#8FBF9F] to-[#6BA37D] text-white rounded-2xl text-lg font-black shadow-[0_10px_20px_rgba(107,163,125,0.2)] hover:shadow-[0_15px_30px_rgba(107,163,125,0.3)] hover:-translate-y-0.5 active:scale-[0.98] transition-all disabled:opacity-50"
                    >
                        {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
                    </button>
                </form>

                <p className="mt-8 text-center text-sm font-bold text-[#6BA37D] cursor-pointer hover:underline" onClick={() => navigate('/')}>
                    ← Back to Role Selection
                </p>
            </div>

            <p className="mt-10 text-xs font-black text-[#2D4536]/30 uppercase tracking-[0.3em]">Saheli • Admin Security System</p>
        </div>
    );
};

export default AdminLogin;
