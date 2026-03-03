import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { apiCall } from '../services/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const data = await apiCall('/ai-report/latest', 'GET');
        setReport(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchReport();
  }, []);

  const modules = [
    { title: 'Diet Plan', icon: '🥗', route: '/dashboard/diet', desc: 'Personalized meal advice', color: 'from-green-500 to-emerald-500', bg: 'bg-green-50' },
    { title: 'Exercise Plan', icon: '🧘', route: '/dashboard/exercise', desc: 'Custom workout routines', color: 'from-blue-500 to-indigo-500', bg: 'bg-blue-50' },
    { title: 'Stress Management', icon: '🍃', route: '/dashboard/stress', desc: 'Mental wellness & calm', color: 'from-purple-500 to-violet-500', bg: 'bg-purple-50' },
    { title: 'Skin & Hair Care', icon: '✨', route: '/dashboard/skin-hair', desc: 'PCOS-specific routines', color: 'from-pink-500 to-rose-500', bg: 'bg-pink-50' },
    { title: 'AI Assistant', icon: '🤖', route: '/dashboard/assistant', desc: 'Instant AI chat support', color: 'from-amber-500 to-orange-500', bg: 'bg-amber-50' },
  ];


  return (
    <>
      {/* Welcome Banner — Aurora gradient */}
      <div className="relative overflow-hidden rounded-3xl p-8 mb-8 text-white shadow-2xl"
        style={{ background: 'linear-gradient(135deg, #5b21b6 0%, #7c3aed 50%, #db2777 100%)' }}>
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 0%, transparent 60%), radial-gradient(circle at 80% 20%, white 0%, transparent 50%)' }} />
        <div className="orb w-64 h-64 bg-white/10 -top-10 -right-10" style={{ animationDelay: '0s', filter: 'blur(40px)' }} />
        <div className="relative z-10">
          <p className="text-violet-100 text-sm font-semibold mb-1 tracking-wide uppercase">Welcome back</p>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
            {user?.name || user?.email?.split('@')[0] || 'User'} 👋
          </h2>
          <div className="flex flex-wrap items-center gap-3">
            {report && (
              <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-white/20 text-white backdrop-blur-sm border border-white/30">
                Risk: {report.riskLevel}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Health Metrics */}
      {report ? (
        <div className="mb-10">
          {/* Detect stale/empty report — show re-assess nudge */}
          {(!report.BMI || report.BMI === 0 || !report.riskLevel || report.riskLevel === 'Unknown') ? (
            <div className="glass-card p-6 rounded-2xl border border-amber-200 bg-amber-50 mb-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">⚠️</div>
                <div>
                  <p className="text-sm font-bold text-amber-800">Your health data needs a refresh</p>
                  <p className="text-xs text-amber-600">Your previous report is incomplete. Re-take the assessment to get full AI recommendations.</p>
                </div>
              </div>
              <button onClick={() => navigate('/questionnaire')}
                className="flex-shrink-0 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:from-amber-600 hover:to-orange-600 hover:shadow-lg transition-all active:scale-95">
                Re-Assess →
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-4">
              {/* BMI card — shows number + category label */}
              <div className="glass-card p-6 rounded-2xl border-l-4 border-violet-400 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-11 h-11 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-xl flex items-center justify-center text-lg shadow-md">⚖️</div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">BMI Index</p>
                </div>
                <h3 className="text-2xl font-extrabold text-slate-800">{report.BMI || 'N/A'}</h3>
                {report.bmiCategory && (
                  <p className="text-xs text-violet-600 font-semibold mt-1 leading-tight">{report.bmiCategory.split(' (')[0]}</p>
                )}
              </div>
              {/* Risk Level card */}
              <div className="glass-card p-6 rounded-2xl border-l-4 border-orange-400 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-11 h-11 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center text-lg shadow-md">🎯</div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Risk Level</p>
                </div>
                <h3 className="text-2xl font-extrabold text-slate-800">{report.riskLevel || 'N/A'}</h3>
              </div>
              {/* Cycle Status card */}
              <div className="glass-card p-6 rounded-2xl border-l-4 border-purple-400 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-11 h-11 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center text-lg shadow-md">📅</div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cycle Status</p>
                </div>
                <h3 className="text-2xl font-extrabold text-slate-800">{report.menstrualIrregularity || 'N/A'}</h3>
              </div>
            </div>
          )}
          {/* Re-Assessment CTA */}
          <div className="glass-card p-5 rounded-2xl flex items-center justify-between border border-violet-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center text-lg">🔄</div>
              <div>
                <p className="text-sm font-bold text-slate-700">Update your health profile</p>
                <p className="text-xs text-slate-400">Re-take the assessment to refresh your AI recommendations</p>
              </div>
            </div>
            <button onClick={() => navigate('/questionnaire')}
              className="flex-shrink-0 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:from-violet-700 hover:to-fuchsia-700 hover:shadow-lg transition-all active:scale-95">
              Re-Assess →
            </button>
          </div>
        </div>
      ) : (
        <div className="glass-card p-10 rounded-3xl text-center mb-10">
          <p className="text-5xl mb-4">📋</p>
          <p className="text-slate-600 font-semibold mb-1">No health report yet</p>
          <p className="text-slate-400 text-sm mb-5">Complete your assessment to see your personalized stats</p>
          <button onClick={() => navigate('/questionnaire')}
            className="bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white px-8 py-3 rounded-2xl font-bold hover:from-violet-700 hover:to-fuchsia-700 hover:shadow-lg transition-all glow-btn">
            Start Assessment →
          </button>
        </div>
      )}

      {/* Care Modules */}
      <h2 className="text-2xl font-extrabold text-slate-800 mb-6">Your Care Modules</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
        {modules.map((mod, i) => (
          <div key={mod.title} onClick={() => navigate(mod.route)}
            className="glass-card p-7 rounded-3xl hover:shadow-2xl transition-all duration-300 cursor-pointer group hover:-translate-y-2"
            style={{ animationDelay: `${i * 0.1}s` }}>
            <div className={`w-14 h-14 bg-gradient-to-br ${mod.color} rounded-2xl flex items-center justify-center text-2xl shadow-lg mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
              {mod.icon}
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">{mod.title}</h3>
            <p className="text-slate-400 text-sm">{mod.desc}</p>
            <div className="mt-4 flex items-center gap-1 text-xs font-bold text-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Open <span>→</span>
            </div>
          </div>
        ))}
      </div>

      {/* AI Insight Banner */}
      {report && (
        <div className="relative overflow-hidden rounded-3xl p-8 shadow-xl text-white"
          style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)' }}>
          <div className="orb w-48 h-48 bg-purple-400/20 bottom-0 right-0" style={{ filter: 'blur(40px)' }} />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-xl">💡</div>
              <h3 className="text-xl font-bold">Today's AI Insight</h3>
            </div>
            <p className="max-w-3xl italic opacity-90 leading-relaxed text-purple-100">"{report.personalizedMessage}"</p>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
