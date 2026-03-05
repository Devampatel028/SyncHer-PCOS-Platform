import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { apiCall } from '../services/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [profile, setProfile] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reportData, profileData] = await Promise.all([
          apiCall('/ai-report/latest', 'GET').catch(() => null),
          apiCall('/user/profile', 'GET').catch(() => null)
        ]);
        if (reportData) setReport(reportData);
        if (profileData) setProfile(profileData);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const modules = [
    { title: 'Diet Plan', icon: '🥗', route: '/dashboard/diet', desc: 'Personalized meal & nutrition advice', color: 'emerald', border: 'border-emerald-200', text: 'text-emerald-700', bg: 'bg-emerald-50' },
    { title: 'Exercise Plan', icon: '🧘', route: '/dashboard/exercise', desc: 'Custom workout routines & mobility', color: 'indigo', border: 'border-indigo-200', text: 'text-indigo-700', bg: 'bg-indigo-50' },
    { title: 'Stress Management', icon: '🍃', route: '/dashboard/stress', desc: 'Mental wellness & calm routines', color: 'violet', border: 'border-violet-200', text: 'text-violet-700', bg: 'bg-violet-50' },
    { title: 'Skin & Hair Care', icon: '✨', route: '/dashboard/skin-hair', desc: 'PCOS-specific dermatological routines', color: 'pink', border: 'border-pink-200', text: 'text-pink-700', bg: 'bg-pink-50' },
    { title: 'AI Assistant', icon: '🤖', route: '/dashboard/assistant', desc: 'Instant 24/7 AI chat support', color: 'amber', border: 'border-amber-200', text: 'text-amber-700', bg: 'bg-amber-50' },
  ];


  return (
    <div className="space-y-8 animate-fade-in font-sans">

      {/* Welcome Banner — Solid Premium SaaS aesthetic */}
      <div className="relative overflow-hidden rounded-3xl p-8 md:p-10 bg-gradient-to-br from-[#E88C9A] to-[#D97A88] border border-rose-100 shadow-[0_8px_30px_rgb(232,140,154,0.2)] text-white">
        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
          <svg className="w-64 h-64 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 22h20L12 2zm0 4.5l6.5 13.5h-13L12 6.5z" /></svg>
        </div>
        <div className="relative z-10">
          <p className="text-rose-100 text-sm font-bold mb-2 tracking-widest uppercase">Overview</p>
          <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight drop-shadow-sm">
            Hi, {user?.name || user?.email?.split('@')[0] || 'User'}
          </h2>
          <div className="flex flex-wrap items-center gap-3">
            {report && (
              <span className="px-4 py-2 rounded-xl text-xs font-bold bg-white/20 backdrop-blur-md text-white border border-rose-100/50 tracking-wide uppercase shadow-sm">
                Overall Risk Class: {report.riskLevel}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Health Metrics */}
      {report ? (
        <div className="space-y-6">
          {/* Detect stale/empty report — show re-assess nudge */}
          {(!report.BMI || report.BMI === 0 || !report.riskLevel || report.riskLevel === 'Unknown') ? (
            <div className="bg-amber-50 rounded-3xl border border-amber-200 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 border border-amber-100 text-amber-600 shadow-sm">⚠️</div>
                <div>
                  <h3 className="text-lg font-bold text-amber-900 mb-1">Clinical Profile Incomplete</h3>
                  <p className="text-sm font-medium text-amber-700">Your previous report lacks critical data points. Please re-take the assessment for an accurate protocol.</p>
                </div>
              </div>
              <button onClick={() => navigate('/questionnaire')}
                className="flex-shrink-0 bg-amber-500 text-white px-6 py-3 rounded-2xl text-sm font-bold hover:bg-amber-600 transition-colors shadow-sm w-full md:w-auto text-center">
                Initialize Assessment
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {/* BMI card */}
              <div className="bg-white p-6 rounded-3xl border border-rose-50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-[#FFF8F6] rounded-xl flex items-center justify-center text-lg border border-rose-100/50 shadow-sm text-slate-600">⚖️</div>
                  <p className="text-xs font-bold text-[#5C3A4D]/60 uppercase tracking-widest">BMI Metric</p>
                </div>
                <div className="mt-auto">
                  <h3 className="text-3xl font-black text-[#5C3A4D] mb-1">{report.BMI || 'N/A'}</h3>
                  {report.bmiCategory && (
                    <p className="text-xs text-[#E88C9A] font-bold uppercase tracking-wide">{report.bmiCategory.split(' (')[0]}</p>
                  )}
                </div>
              </div>

              {/* Risk Level card */}
              <div className="bg-white p-6 rounded-3xl border border-rose-50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-[#FFF8F6] rounded-xl flex items-center justify-center text-lg border border-rose-100/50 shadow-sm text-slate-600">🎯</div>
                  <p className="text-xs font-bold text-[#5C3A4D]/60 uppercase tracking-widest">Base Risk</p>
                </div>
                <div className="mt-auto">
                  <h3 className="text-3xl font-black text-[#5C3A4D] mb-1">{report.riskLevel || 'N/A'}</h3>
                  <p className="text-xs text-[#4A4A4A] font-bold">{report.combinedRiskLevel !== 'Not evaluated yet' ? `Refined: ${report.combinedRiskLevel}` : 'Standard diagnostic'}</p>
                </div>
              </div>

              {/* Severity card */}
              <div className="bg-white p-6 rounded-3xl border border-rose-50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-[#FFF8F6] rounded-xl flex items-center justify-center text-lg border border-rose-100/50 shadow-sm text-slate-600">⚡</div>
                  <p className="text-xs font-bold text-[#5C3A4D]/60 uppercase tracking-widest">Severity</p>
                </div>
                <div className="mt-auto">
                  <h3 className="text-3xl font-black text-[#5C3A4D] mb-1">{report.symptomScore ? `${report.symptomScore}/10` : 'N/A'}</h3>
                  <p className="text-xs text-[#4A4A4A] font-bold">{report.refinedSeverityLevel !== 'Not evaluated yet' ? `Level: ${report.refinedSeverityLevel}` : 'Standard diagnostic'}</p>
                </div>
              </div>

              {/* Cycle card */}
              <div className="bg-white p-6 rounded-3xl border border-rose-50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-[#FFF8F6] rounded-xl flex items-center justify-center text-lg border border-rose-100/50 shadow-sm text-slate-600">📅</div>
                  <p className="text-xs font-bold text-[#5C3A4D]/60 uppercase tracking-widest">Cycle State</p>
                </div>
                <div className="mt-auto">
                  <h3 className="text-xl font-black text-[#5C3A4D] leading-tight block">{report.menstrualIrregularity || 'N/A'}</h3>
                </div>
              </div>
            </div>
          )}

          {/* Re-Assessment CTA (Smaller Footer Line) */}
          <div className="flex items-center justify-between mt-4">
            <p className="text-xs text-[#4A4A4A] font-bold">To maintain accurate AI predictions, we recommend updating your clinical profile regularly.</p>
            <button onClick={() => navigate('/questionnaire')} className="text-sm font-bold text-[#E88C9A] hover:text-[#D97A88] transition-colors bg-[#FFF8F6] px-4 py-2 rounded-xl border border-rose-100 shadow-sm">
              Launch Diagnostic
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-rose-50 p-12 rounded-[3xl] text-center mb-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="w-20 h-20 bg-[#FFF8F6] border border-rose-100 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-6 text-rose-300 shadow-sm">📋</div>
          <h3 className="text-xl font-bold text-[#5C3A4D] mb-2">Diagnostic Data Required</h3>
          <p className="text-[#4A4A4A] text-sm mb-8 font-medium max-w-sm mx-auto">Initialize your medical profile to generate personalized insights.</p>
          <button onClick={() => navigate('/questionnaire')}
            className="bg-[#E88C9A] text-white px-8 py-4 rounded-2xl font-bold hover:bg-[#D97A88] transition-colors shadow-sm">
            Start Clinical Assessment
          </button>
        </div>
      )}

      {/* Hormonal Health */}
      <div className="pt-6">
        <h2 className="text-xl font-extrabold text-[#5C3A4D] mb-6 tracking-tight">Hormonal Index</h2>
        {
          !profile?.hormonalIndex || profile.hormonalIndex.totalScore === null ? (
            <div className="bg-[#FFF8F6] p-6 rounded-3xl border border-dashed border-rose-200">
              <p className="text-[#4A4A4A] font-bold text-sm text-center">Data point unavailable. Complete assessment.</p>
            </div>
          ) : (
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-rose-50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] max-w-2xl">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <h3 className="text-xs font-bold text-[#5C3A4D]/60 uppercase tracking-widest mb-1">Index Score</h3>
                  <p className={`text-xs font-bold px-3 py-1.5 rounded-xl inline-block uppercase tracking-wide border shadow-sm ${profile.hormonalIndex.totalScore <= 25 ? 'bg-[#8FBF9F]/10 text-[#8FBF9F] border-[#8FBF9F]/30' :
                    profile.hormonalIndex.totalScore <= 50 ? 'bg-[#C8B6E2]/10 text-[#5C3A4D] border-[#C8B6E2]/30' :
                      profile.hormonalIndex.totalScore <= 75 ? 'bg-orange-50 text-orange-700 border-orange-200' :
                        'bg-[#E88C9A]/10 text-[#E88C9A] border-[#E88C9A]/30'
                    }`}>{profile.hormonalIndex.category}</p>
                </div>
                <div className="text-right">
                  <span className="text-5xl font-black text-[#5C3A4D] tracking-tighter">{profile.hormonalIndex.totalScore}</span>
                  <span className="text-xl font-bold text-[#E88C9A]/60">/100</span>
                </div>
              </div>
              <div className="w-full h-3 bg-rose-50 rounded-full overflow-hidden shadow-inner">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${profile.hormonalIndex.totalScore <= 25 ? 'bg-[#8FBF9F]' :
                    profile.hormonalIndex.totalScore <= 50 ? 'bg-[#C8B6E2]' :
                      profile.hormonalIndex.totalScore <= 75 ? 'bg-orange-400' : 'bg-[#E88C9A]'
                    }`}
                  style={{ width: `${profile.hormonalIndex.totalScore}%` }}
                />
              </div>
            </div>
          )
        }
      </div>

      {/* Modules Grid */}
      <div className="pt-6">
        <h2 className="text-xl font-extrabold text-[#5C3A4D] mb-6 tracking-tight">Prescribed Protocol</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((mod, i) => (
            <div key={mod.title} onClick={() => navigate(mod.route)}
              className="bg-white p-6 rounded-3xl border border-rose-50 hover:border-rose-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-md transition-all duration-300 cursor-pointer group flex flex-col"
            >
              <div className={`w-12 h-12 bg-white shadow-sm border ${mod.border} rounded-2xl flex items-center justify-center text-xl mb-5 group-hover:scale-105 transition-transform`}>
                <span className={mod.text}>{mod.icon}</span>
              </div>
              <h3 className="text-lg font-black text-[#5C3A4D] mb-2">{mod.title}</h3>
              <p className="text-[#4A4A4A] text-sm leading-relaxed font-medium flex-grow">{mod.desc}</p>
              <div className="mt-6 flex items-center gap-2 text-sm font-bold text-[#E88C9A] opacity-0 group-hover:opacity-100 transition-opacity">
                Access Module
                <svg className="w-4 h-4 translate-y-[1px]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Insight */}
      {report && (
        <div className="pt-6 pb-12">
          <div className="bg-gradient-to-r from-[#C8B6E2]/20 to-[#E88C9A]/10 p-8 rounded-3xl border border-rose-100 text-[#5C3A4D] relative overflow-hidden flex flex-col md:flex-row items-center gap-8 shadow-sm">
            <div className="absolute -right-6 -bottom-6 opacity-10 pointer-events-none text-[#C8B6E2]">
              <svg className="w-48 h-48" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" /></svg>
            </div>

            <div className="w-16 h-16 rounded-2xl bg-white border border-rose-100 shadow-sm flex items-center justify-center text-2xl flex-shrink-0 z-10">
              💡
            </div>
            <div className="z-10 flex-1">
              <h3 className="text-xs font-bold text-[#E88C9A] uppercase tracking-widest mb-2">AI Clinical Insight</h3>
              <p className="text-lg md:text-xl font-bold text-[#5C3A4D] leading-relaxed italic drop-shadow-sm">
                "{report.personalizedMessage}"
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
