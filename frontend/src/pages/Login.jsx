import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiCall } from '../services/api';

const Login = ({ onLogin }) => {
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
      const data = await apiCall('/auth/login', 'POST', { email, password });
      if (data?.token) {
        localStorage.setItem("token", data.token);
        onLogin(data);

        // Check if user already has an AI report — if yes, skip to dashboard
        try {
          await apiCall('/assessment/latest', 'GET');
          navigate('/dashboard'); // Returning user — go straight to dashboard
        } catch {
          navigate('/awareness'); // First time — go through the onboarding flow
        }
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen aurora-bg relative overflow-hidden flex">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center p-16">
        <div className="orb w-80 h-80 bg-teal-400/30 top-0 left-0" style={{ animationDelay: '0s' }} />
        <div className="orb w-60 h-60 bg-purple-400/20 bottom-0 right-0" style={{ animationDelay: '4s' }} />
        <div className="relative z-10 text-center">
          <div className="text-8xl mb-6">💙</div>
          <h2 className="text-4xl font-black text-slate-800 mb-4">
            Welcome back to <br />
            <span className="shimmer-text">SyncHer</span>
          </h2>
          <p className="text-slate-500 text-lg leading-relaxed max-w-sm mx-auto">
            Your AI-powered PCOS care companion is ready to support you today.
          </p>
          <div className="mt-10 flex flex-col gap-3 text-left max-w-sm mx-auto">
            {['AI Risk Assessment', 'Personalized Diet Plans', 'Hormone Balance Tips', '24/7 Chat Support'].map(f => (
              <div key={f} className="flex items-center gap-3 glass-card px-4 py-3 rounded-xl">
                <span className="text-violet-500 font-bold">✓</span>
                <span className="text-slate-700 text-sm font-medium">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="animate-scale-in glass-card w-full max-w-md p-10 rounded-3xl shadow-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white px-5 py-2 rounded-full text-sm font-bold tracking-wider uppercase mb-5">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse" /> SyncHer
            </div>
            <h2 className="text-3xl font-extrabold text-slate-800 mb-2">Sign In</h2>
            <p className="text-slate-500">Continue your care journey</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-2xl mb-6 text-sm text-center font-medium border border-red-100 animate-fade-in">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-2">Email Address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                placeholder="name@example.com"
                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all text-slate-800 placeholder:text-slate-400" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-2">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                placeholder="••••••••"
                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all text-slate-800" />
            </div>
            <button type="submit" disabled={loading}
              className={`w-full py-4 rounded-2xl text-white font-bold text-lg shadow-lg transition-all duration-300 ${
                loading ? 'bg-teal-400 cursor-not-allowed' : 'bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.98] glow-btn'
              }`}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : 'Sign In →'}
            </button>
          </form>

          <p className="text-center mt-8 text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-violet-600 font-bold hover:underline">Register free</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;