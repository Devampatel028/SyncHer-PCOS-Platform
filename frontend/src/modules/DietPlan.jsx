import { useEffect, useState } from 'react';
import { apiCall } from '../services/api';

const DietPlan = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const data = await apiCall('/ai-report/latest', 'GET');
        setReport(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, []);

  if (loading) return (
    <div className="flex flex-col gap-6 animate-pulse p-4">
      <div className="h-24 bg-slate-200 rounded-2xl" />
      <div className="h-32 bg-slate-200 rounded-2xl" />
      <div className="grid grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => <div key={i} className="h-32 bg-slate-200 rounded-2xl" />)}
      </div>
    </div>
  );

  // Handle both new and old keys for backward compatibility
  const diet = report?.dietModule || report?.dietPlan;

  if (!diet) return (
    <div className="flex flex-col items-center justify-center py-24 text-center bg-white border border-rose-50 rounded-[3xl] shadow-[0_8px_30px_rgb(0,0,0,0.04)] mt-8">
      <div className="w-20 h-20 bg-[#FFF8F6] border border-rose-100 rounded-2xl flex items-center justify-center text-4xl mb-6 text-[#8FBF9F] shadow-sm">🥗</div>
      <h3 className="text-xl font-bold text-[#5C3A4D] mb-2">Diagnostic Data Required</h3>
      <p className="text-sm text-[#4A4A4A] font-medium max-w-sm">Complete your clinical assessment to generate personalized nutrition protocols.</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      {/* Header */}
      <div className="flex items-center gap-5">
        <div className="w-14 h-14 bg-white border border-rose-50 rounded-2xl flex items-center justify-center text-2xl text-[#8FBF9F] shadow-sm">🥗</div>
        <div>
          <h1 className="text-3xl font-extrabold text-[#5C3A4D] tracking-tight">Clinical Diet Protocol</h1>
          <p className="text-sm text-[#4A4A4A] font-bold">AI-curated nutrition vectors for your PCOS variant</p>
        </div>
      </div>

      {/* Today's Focus */}
      <div className="bg-gradient-to-r from-[#8FBF9F] to-[#7AA88B] border border-[#8FBF9F]/20 rounded-[3xl] p-8 text-white relative flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_8px_30px_rgb(143,191,159,0.2)]">
        <div className="relative z-10 flex-1">
          <p className="text-emerald-50 text-xs font-bold uppercase tracking-widest mb-2">Protocol Objective</p>
          <p className="text-xl md:text-2xl font-black leading-tight drop-shadow-sm">{diet.todayFocus}</p>
        </div>
        <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-3xl border border-white/30 shadow-sm flex-shrink-0">
          🎯
        </div>
      </div>

      {/* Core Principles */}
      <div className="bg-white rounded-[3xl] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-rose-50 p-8">
        <div className="flex items-center gap-3 mb-6 border-b border-rose-50 pb-4">
          <div className="w-10 h-10 bg-[#FFF8F6] border border-rose-100 rounded-xl flex items-center justify-center text-lg text-[#8FBF9F]">📋</div>
          <h3 className="text-xl font-extrabold text-[#5C3A4D] tracking-tight">Core Nutrition Vectors</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {diet.nutritionTips?.map((item, i) => (
            <div key={i} className="flex items-start gap-4 p-4 bg-[#FFF8F6] rounded-2xl border border-rose-50 hover:border-[#8FBF9F]/40 transition-colors group">
              <span className="w-8 h-8 bg-white border border-rose-100 text-[#E88C9A] rounded-xl flex items-center justify-center text-xs font-black flex-shrink-0 shadow-sm group-hover:bg-[#8FBF9F] group-hover:text-white group-hover:border-[#8FBF9F]/50 transition-colors">{i + 1}</span>
              <div className="flex-1">
                <p className="text-sm font-bold text-[#4A4A4A] mb-2 leading-snug">{item.text}</p>
                <span className="px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-white text-[#8FBF9F] border border-[#8FBF9F]/20 inline-block shadow-sm">{item.tag}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Meal Plan Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {diet.mealPlan?.map(meal => (
          <div key={meal.time} className="bg-white rounded-[3xl] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-rose-50 p-8 flex flex-col hover:border-[#8FBF9F]/30 transition-colors">
            <div className="flex items-center gap-4 mb-6 pb-4 border-b border-rose-50">
              <span className="text-3xl bg-[#FFF8F6] border border-rose-100 p-3 rounded-2xl shadow-sm">{meal.icon}</span>
              <h4 className="text-xl font-black text-[#5C3A4D] tracking-tight">{meal.time}</h4>
            </div>
            <ul className="space-y-3 flex-1">
              {meal.items?.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm font-bold text-[#4A4A4A] leading-relaxed">
                  <span className="mt-1.5 w-2 h-2 bg-[#E88C9A] rounded-full flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* AI Insight */}
      {diet.aiInsight && (
        <div className="bg-gradient-to-r from-[#C8B6E2]/20 to-[#E88C9A]/10 border border-rose-100 rounded-[3xl] p-8 text-[#5C3A4D] relative flex flex-col md:flex-row items-center gap-6 shadow-sm mt-6">
          <div className="w-16 h-16 bg-white border border-rose-100 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 shadow-sm">
            🤖
          </div>
          <div className="flex-1">
            <h3 className="text-xs font-bold text-[#E88C9A] uppercase tracking-widest mb-2">AI Clinical Insight</h3>
            <p className="text-lg font-bold text-[#5C3A4D] leading-relaxed italic drop-shadow-sm">"{diet.aiInsight}"</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DietPlan;
