import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiCall } from '../services/api';

// Helper: strip any non-numeric suffix like "%" or "/10" and return just the number
const parseScore = (val) => {
  if (!val) return 'N/A';
  const num = parseFloat(String(val).replace(/[^0-9.]/g, ''));
  return isNaN(num) ? val : num;
};

const Prediction = () => {
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const data = await apiCall("/assessment/latest");
        setReport(data);
      } catch (err) {
        console.error("REPORT FETCH ERROR:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, []);

  if (loading) return (
    <div className="min-h-screen aurora-bg flex items-center justify-center">
      <div className="text-center animate-scale-in">
        <div className="w-20 h-20 border-4 border-violet-200 border-t-teal-600 rounded-full animate-spin mx-auto mb-6 shadow-lg" />
        <p className="text-xl font-bold text-slate-700">Analyzing your health profile...</p>
        <p className="text-sm text-slate-400 mt-2">AI is processing your data</p>
      </div>
    </div>
  );

  if (!report) return (
    <div className="min-h-screen aurora-bg flex items-center justify-center">
      <div className="glass-card text-center p-14 rounded-3xl shadow-2xl animate-scale-in">
        <p className="text-6xl mb-4">📋</p>
        <p className="text-xl font-bold text-slate-700">No report found</p>
        <p className="text-slate-500 mt-2 mb-6">Complete your assessment first</p>
        <button onClick={() => navigate('/questionnaire')}
          className="bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white px-8 py-3 rounded-2xl font-bold hover:shadow-lg transition-all glow-btn">
          Take Assessment →
        </button>
      </div>
    </div>
  );

  const riskConfig = {
    'Low':    { grad: 'from-green-500 to-emerald-500', bg: 'bg-green-50', text: 'text-green-700', badge: 'bg-green-100 text-green-700', icon: '🟢', glow: 'shadow-green-200' },
    'Medium': { grad: 'from-amber-500 to-orange-500',  bg: 'bg-amber-50',  text: 'text-amber-700',  badge: 'bg-amber-100 text-amber-700',  icon: '🟡', glow: 'shadow-amber-200' },
    'High':   { grad: 'from-red-500 to-rose-500',       bg: 'bg-red-50',    text: 'text-red-700',    badge: 'bg-red-100 text-red-700',       icon: '🔴', glow: 'shadow-red-200' },
  };
  const risk = riskConfig[report.riskLevel] || riskConfig['Medium'];

  return (
    <div className="min-h-screen aurora-bg py-12 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-slide-up">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-5 py-2 rounded-full shadow-sm border border-violet-100 mb-5">
            <span className="w-2 h-2 bg-violet-500 rounded-full animate-pulse" />
            <span className="text-sm font-bold text-violet-700 uppercase tracking-wider">🤖 AI Analysis Complete</span>
          </div>
          <h1 className="text-5xl font-black text-slate-800">Your PCOS Report</h1>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
          {/* Risk Prediction Card */}
          <div className={`lg:col-span-3 glass-card p-8 rounded-3xl hover:shadow-2xl transition-all duration-300 ${risk.glow} shadow-xl animate-slide-up`}>
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">Prediction Result</h2>
            <div className={`${risk.bg} rounded-2xl p-8 text-center mb-6 border border-opacity-30`}>
              <span className="text-5xl mb-4 block">{risk.icon}</span>
              <span className={`px-5 py-2 rounded-full font-bold text-sm inline-block ${risk.badge} mb-4`}>
                {report.riskLevel} Risk
              </span>
              <p className={`text-3xl font-extrabold bg-gradient-to-r ${risk.grad} bg-clip-text text-transparent`}>
                {report.pcosPrediction}
              </p>
            </div>
            <p className="text-slate-400 italic text-center text-sm leading-relaxed">"{report.personalizedMessage}"</p>
          </div>

          {/* Metric Cards — BUG FIX: parse scores correctly */}
          <div className="lg:col-span-2 grid grid-cols-2 gap-4">
            {[
              { label: 'BMI Index', value: report.BMI, icon: '⚖️', grad: 'from-violet-500 to-fuchsia-500', unit: '' },
              { label: 'Symptom Score', value: parseScore(report.symptomScore), icon: '📋', grad: 'from-purple-500 to-indigo-500', unit: '/10' },
              { label: 'Lifestyle Score', value: parseScore(report.lifestyleScore), icon: '🏃', grad: 'from-amber-500 to-orange-500', unit: '/10' },
              { label: 'Cycle Status', value: report.menstrualIrregularity, icon: '📅', grad: 'from-pink-500 to-rose-500', unit: '' },
            ].map(stat => (
              <div key={stat.label}
                className="glass-card p-5 rounded-2xl flex flex-col items-center justify-center text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.grad} rounded-xl flex items-center justify-center text-xl shadow-md mb-3`}>
                  {stat.icon}
                </div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.label}</span>
                <span className="text-lg font-extrabold text-slate-800 mt-1">{stat.value}{stat.unit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Hormone Tips */}
        <div className="glass-card p-8 rounded-3xl mb-8 hover:shadow-xl transition-all duration-300 animate-slide-up">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center text-xl shadow-md">💡</div>
            <h2 className="text-xl font-bold text-slate-800">Hormone Balancing Tips</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {report.hormoneBalanceTips?.map((tip, idx) => (
              <div key={idx} className="flex items-start gap-3 bg-gradient-to-r from-teal-50 to-emerald-50 p-4 rounded-2xl border border-violet-100">
                <span className="w-6 h-6 bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 shadow-sm">{idx + 1}</span>
                <span className="text-slate-700 text-sm leading-relaxed">{tip}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-wrap justify-center gap-4">
          <button onClick={() => navigate('/dashboard')}
            className="bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white px-14 py-5 rounded-2xl text-xl font-bold shadow-xl hover:shadow-2xl hover:from-violet-700 hover:to-fuchsia-700 transition-all duration-300 active:scale-95 glow-btn">
            Go to Dashboard →
          </button>
          <button onClick={() => navigate('/questionnaire')}
            className="bg-white text-violet-700 border-2 border-violet-200 px-8 py-5 rounded-2xl text-base font-bold shadow hover:shadow-lg hover:border-violet-400 hover:bg-violet-50 transition-all duration-300 active:scale-95 flex items-center gap-2">
            🔄 Re-Take Assessment
          </button>
        </div>
      </div>
    </div>
  );
};

export default Prediction;
