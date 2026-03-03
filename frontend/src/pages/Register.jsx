import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiCall } from '../services/api';

const Register = ({ onLogin }) => {
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
      const data = await apiCall('/auth/register', 'POST', { email, password });
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
    <div className="min-h-screen aurora-bg relative overflow-hidden flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center p-16">
        <div className="orb w-80 h-80 bg-purple-400/25 top-0 right-0" style={{ animationDelay: '0s' }} />
        <div className="orb w-64 h-64 bg-teal-400/25 bottom-0 left-0" style={{ animationDelay: '4s' }} />
        <div className="relative z-10 text-center">
          <div className="text-8xl mb-6">🌸</div>
          <h2 className="text-4xl font-black text-slate-800 mb-4">
            Join <span className="shimmer-text">SyncHer</span> today
          </h2>
          <p className="text-slate-500 text-lg leading-relaxed max-w-sm mx-auto">
            Start your personalized PCOS care journey with AI-powered health insights.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-3 max-w-sm mx-auto">
            {[
              { icon: '🔬', label: 'AI Assessment' },
              { icon: '🥗', label: 'Diet Plans' },
              { icon: '🧘', label: 'Exercise' },
              { icon: '💬', label: 'AI Chatbot' },
            ].map(f => (
              <div key={f.label} className="glass-card px-4 py-3 rounded-xl text-center">
                <div className="text-2xl mb-1">{f.icon}</div>
                <span className="text-slate-700 text-xs font-bold">{f.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="animate-scale-in glass-card w-full max-w-md p-10 rounded-3xl shadow-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white px-5 py-2 rounded-full text-sm font-bold tracking-wider uppercase mb-5">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse" /> SyncHer
            </div>
            <h2 className="text-3xl font-extrabold text-slate-800 mb-2">Create Account</h2>
            <p className="text-slate-500">Free forever. No credit card needed.</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-2xl mb-6 text-sm text-center font-medium border border-red-100 animate-fade-in">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { label: 'Email Address', value: email, set: setEmail, type: 'email', placeholder: 'name@example.com' },
              { label: 'Password', value: password, set: setPassword, type: 'password', placeholder: '••••••••' },
              { label: 'Confirm Password', value: confirmPassword, set: setConfirmPassword, type: 'password', placeholder: '••••••••' },
            ].map(field => (
              <div key={field.label}>
                <label className="block text-sm font-semibold text-slate-600 mb-2">{field.label}</label>
                <input type={field.type} value={field.value} onChange={e => field.set(e.target.value)} required
                  placeholder={field.placeholder}
                  className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all text-slate-800 placeholder:text-slate-400" />
              </div>
            ))}
            <button type="submit" disabled={loading}
              className={`w-full py-4 rounded-2xl text-white font-bold text-lg shadow-lg transition-all duration-300 ${
                loading ? 'bg-teal-400 cursor-not-allowed' : 'bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.98] glow-btn'
              }`}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Creating Account...
                </span>
              ) : 'Create Account →'}
            </button>
          </form>

          <p className="text-center mt-8 text-slate-500">
            Already have an account? <Link to="/login" className="text-violet-600 font-bold hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
