import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const API_URL = 'http://localhost:5000/api';

const DoctorLogin = ({ onLogin }) => {
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
      const res = await fetch(`${API_URL}/doctor/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data?.token) {
        onLogin(data);
        navigate('/doctor/dashboard');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans text-slate-900">
      {/* LEFT - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#FFF8F6] relative items-center justify-center p-12 overflow-hidden border-r border-rose-50">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-violet-50/50 to-transparent z-0"></div>
        <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-[#C8B6E2]/20 blur-[120px] z-0 pointer-events-none"></div>
        <div className="absolute bottom-[10%] right-[10%] w-[50%] h-[50%] rounded-full bg-[#E88C9A]/10 blur-[100px] z-0 pointer-events-none"></div>

        <div className="relative z-10 max-w-lg">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-[#C8B6E2] rounded-2xl flex items-center justify-center font-bold text-xl text-white shadow-md">S</div>
            <span className="text-2xl font-bold tracking-tight text-[#5C3A4D]">Saheli</span>
            <span className="text-sm font-bold text-[#C8B6E2] bg-violet-50 px-3 py-1 rounded-xl">Doctor Portal</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-[#5C3A4D]">
            Welcome to the Doctor Dashboard.
          </h1>
          <p className="text-lg text-[#4A4A4A]/80 mb-12 font-medium">
            Access your patients' health data, manage appointments, and provide personalized PCOS care.
          </p>

          <div className="space-y-4">
            {[
              { icon: '👥', title: 'Patient Management', desc: 'View and track your patients\' health data' },
              { icon: '📅', title: 'Appointment Calendar', desc: 'Schedule and manage appointments' },
              { icon: '💬', title: 'Patient Communication', desc: 'Stay connected with your patients' }
            ].map((f, idx) => (
              <div key={idx} className="flex gap-4 items-center bg-white/60 backdrop-blur-sm p-4 rounded-2xl border border-violet-50 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-violet-50 flex items-center justify-center text-2xl shrink-0">{f.icon}</div>
                <div>
                  <h3 className="font-bold text-[#5C3A4D]">{f.title}</h3>
                  <p className="text-[#4A4A4A] text-sm mt-0.5">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-white relative">
        <div className="w-full max-w-md animate-fade-in">
          <div className="lg:hidden flex items-center gap-2 mb-10">
            <div className="w-8 h-8 bg-[#C8B6E2] rounded-xl flex items-center justify-center font-bold text-white shadow-sm">S</div>
            <span className="text-xl font-bold tracking-tight text-[#5C3A4D]">Saheli</span>
            <span className="text-xs font-bold text-[#C8B6E2] bg-violet-50 px-2 py-1 rounded-lg">Doctor</span>
          </div>

          <div className="mb-10">
            <h2 className="text-3xl font-extrabold text-[#5C3A4D] tracking-tight mb-2">Doctor Sign In</h2>
            <p className="text-[#4A4A4A] font-medium">Enter your credentials to access the doctor portal.</p>
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
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                placeholder="doctor1@gmail.com"
                className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#C8B6E2] focus:border-[#C8B6E2] transition-all text-[#4A4A4A] placeholder:text-slate-400 shadow-sm" />
            </div>
            <div>
              <label className="block text-sm font-bold text-[#5C3A4D] mb-2">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                placeholder="••••••••"
                className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#C8B6E2] focus:border-[#C8B6E2] transition-all text-[#4A4A4A] placeholder:text-slate-400 shadow-sm" />
            </div>
            <div className="pt-2">
              <button type="submit" disabled={loading}
                className="w-full py-3.5 bg-[#C8B6E2] hover:bg-[#B5A1D4] text-white rounded-2xl font-bold shadow-sm transition-all disabled:opacity-70 flex justify-center items-center h-[52px]">
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
            Patient login?{' '}
            <Link to="/login" className="text-[#E88C9A] font-bold hover:text-[#D97A88] transition-colors">Go to patient portal</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default DoctorLogin;
