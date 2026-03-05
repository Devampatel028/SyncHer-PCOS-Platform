import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiCall } from '../services/api';

const Register = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) return setError('Passwords do not match');
    setLoading(true);
    setError('');
    try {
      const data = await apiCall('/auth/register', 'POST', { name, phone, email, password });
      if (data.token) {
        onLogin(data);
        navigate('/awareness');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans text-slate-900 selection:bg-rose-100 selection:text-rose-900">

      {/* LEFT PANEL - Branding (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#FFF8F6] relative items-center justify-center p-12 overflow-hidden border-r border-rose-50">
        {/* Subtle background element */}
        <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-tl from-rose-50/50 to-transparent z-0"></div>
        <div className="absolute top-[10%] right-[10%] w-[60%] h-[60%] rounded-full bg-[#8FBF9F]/10 blur-[100px] z-0 pointer-events-none"></div>
        <div className="absolute bottom-[20%] left-[10%] w-[40%] h-[40%] rounded-full bg-[#C8B6E2]/20 blur-[90px] z-0 pointer-events-none"></div>

        <div className="relative z-10 max-w-lg text-[#4A4A4A]">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-[#E88C9A] rounded-2xl flex items-center justify-center font-bold text-xl text-white shadow-md">S</div>
            <span className="text-2xl font-bold tracking-tight text-[#5C3A4D]">Saheli</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-[#5C3A4D]">
            Start your journey to better hormonal health.
          </h1>
          <p className="text-lg text-[#4A4A4A]/80 mb-12 font-medium">
            Join thousands of women taking control of their PCOS with clinical-grade AI insights.
          </p>

          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: '📝', label: 'In-Depth Analysis' },
              { icon: '🥗', label: 'Tailored Diet' },
              { icon: '🌺', label: 'Custom Protocol' },
              { icon: '🩺', label: 'Symptom Tracking' },
            ].map((f, idx) => (
              <div key={idx} className="flex items-center gap-3 bg-white/60 backdrop-blur-sm border border-rose-50 shadow-sm p-4 rounded-2xl">
                <span className="text-2xl">{f.icon}</span>
                <span className="text-sm font-bold text-[#5C3A4D]">{f.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-white relative">
        <div className="w-full max-w-md animate-fade-in">

          {/* Mobile logo header */}
          <div className="lg:hidden flex items-center gap-2 mb-10">
            <div className="w-8 h-8 bg-[#E88C9A] rounded-xl flex items-center justify-center font-bold text-white shadow-sm">S</div>
            <span className="text-xl font-bold tracking-tight text-[#5C3A4D]">Saheli</span>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-[#5C3A4D] tracking-tight mb-2">Create an account</h2>
            <p className="text-[#4A4A4A] font-medium">Free forever. No credit card required.</p>
          </div>

          {error && (
            <div className="bg-rose-50 text-rose-600 p-4 rounded-xl mb-6 text-sm font-medium border border-rose-100 flex items-start gap-3">
              <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { label: 'Full Name', value: name, set: setName, type: 'text', placeholder: 'Ex: Jane Doe' },
              { label: 'Phone Number', value: phone, set: setPhone, type: 'tel', placeholder: 'Ex: +1 234 567 8900' },
              { label: 'Email Address', value: email, set: setEmail, type: 'email', placeholder: 'Ex: jane@example.com' },
              { label: 'Password', value: password, set: setPassword, type: 'password', placeholder: 'Create a strong password' },
              { label: 'Confirm Password', value: confirmPassword, set: setConfirmPassword, type: 'password', placeholder: 'Repeat password' },
            ].map(field => (
              <div key={field.label}>
                <label className="block text-sm font-bold text-[#5C3A4D] mb-2">{field.label}</label>
                <input
                  type={field.type}
                  value={field.value}
                  onChange={e => field.set(e.target.value)}
                  required
                  placeholder={field.placeholder}
                  className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#E88C9A] focus:border-[#E88C9A] transition-all text-[#4A4A4A] placeholder:text-slate-400 shadow-sm"
                />
              </div>
            ))}

            <div className="pt-3">
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
                ) : 'Create Account'}
              </button>
            </div>
          </form>

          <p className="text-center mt-8 text-sm font-medium text-[#4A4A4A]">
            Already have an account?{' '}
            <Link to="/login" className="text-[#E88C9A] font-bold hover:text-[#D97A88] transition-colors">Log in here</Link>
          </p>
        </div>
      </div>

    </div>
  );
};

export default Register;
