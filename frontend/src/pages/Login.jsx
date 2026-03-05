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
    <div className="min-h-screen flex bg-white font-sans text-slate-900 selection:bg-rose-100 selection:text-rose-900">

      {/* LEFT PANEL - Branding (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#FFF8F6] relative items-center justify-center p-12 overflow-hidden border-r border-rose-50">
        {/* Subtle background element */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-rose-50/50 to-transparent z-0"></div>
        <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-[#E88C9A]/10 blur-[120px] z-0 pointer-events-none"></div>
        <div className="absolute bottom-[10%] right-[10%] w-[50%] h-[50%] rounded-full bg-[#C8B6E2]/20 blur-[100px] z-0 pointer-events-none"></div>

        <div className="relative z-10 max-w-lg text-[#4A4A4A]">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-[#E88C9A] rounded-2xl flex items-center justify-center font-bold text-xl text-white shadow-md">S</div>
            <span className="text-2xl font-bold tracking-tight text-[#5C3A4D]">Saheli</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-[#5C3A4D]">
            Welcome back to your personalized care journey.
          </h1>
          <p className="text-lg text-[#4A4A4A]/80 mb-12 font-medium">
            Log in to access your dashboard, continuous AI insights, and tailored health protocols.
          </p>

          <div className="space-y-6">
            {[
              { icon: '🌺', title: 'Data-Driven Insights', desc: 'Track your symptoms and see the big picture.' },
              { icon: '✨', title: '24/7 AI Guidance', desc: 'Instant clinical clarity on your PCOS questions.' },
              { icon: '🥗', title: 'Actionable Plans', desc: 'Diet and routines designed strictly for your profile.' }
            ].map((feature, idx) => (
              <div key={idx} className="flex gap-4 items-center bg-white/60 backdrop-blur-sm p-4 rounded-2xl border border-rose-50 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center text-2xl shrink-0">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-bold text-[#5C3A4D]">{feature.title}</h3>
                  <p className="text-[#4A4A4A] text-sm mt-0.5">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-white relative">
        <div className="w-full max-w-md animate-fade-in">

          {/* Mobile logo header (only shows on small screens) */}
          <div className="lg:hidden flex items-center gap-2 mb-10">
            <div className="w-8 h-8 bg-[#E88C9A] rounded-xl flex items-center justify-center font-bold text-white shadow-sm">S</div>
            <span className="text-xl font-bold tracking-tight text-[#5C3A4D]">Saheli</span>
          </div>

          <div className="mb-10">
            <h2 className="text-3xl font-extrabold text-[#5C3A4D] tracking-tight mb-2">Sign in</h2>
            <p className="text-[#4A4A4A] font-medium">Welcome back! Please enter your details.</p>
          </div>

          {error && (
            <div className="bg-rose-50 text-rose-600 p-4 rounded-xl mb-6 text-sm font-medium border border-rose-100 flex items-start gap-3">
              <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-[#5C3A4D] mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="Ex: jane@example.com"
                className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#E88C9A] focus:border-[#E88C9A] transition-all text-[#4A4A4A] placeholder:text-slate-400 shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-[#5C3A4D] mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#E88C9A] focus:border-[#E88C9A] transition-all text-[#4A4A4A] placeholder:text-slate-400 shadow-sm"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#E88C9A] hover:bg-[#D97A88] text-white rounded-2xl font-bold shadow-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center h-[52px]"
              >
                {loading ? (
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : 'Sign In'}
              </button>
            </div>
          </form>

          <p className="text-center mt-8 text-sm font-medium text-[#4A4A4A]">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#E88C9A] font-bold hover:text-[#D97A88] transition-colors">Sign up for free</Link>
          </p>
        </div>
      </div>

    </div>
  );
};

export default Login;