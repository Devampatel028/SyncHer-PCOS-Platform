import { useEffect, useState } from 'react';
import { apiCall } from '../services/api';

const SkinHairCare = () => {
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => <div key={i} className="h-32 bg-slate-200 rounded-2xl" />)}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => <div key={i} className="h-32 bg-slate-200 rounded-2xl" />)}
      </div>
    </div>
  );

  const skin = report?.skinCareModule || report?.skinHairPlan;

  if (!skin) return (
    <div className="flex flex-col items-center justify-center py-24 text-center bg-white border border-rose-50 rounded-[3xl] shadow-[0_8px_30px_rgb(0,0,0,0.04)] mt-8">
      <div className="w-20 h-20 bg-[#FFF8F6] border border-rose-100 rounded-2xl flex items-center justify-center text-4xl mb-6 text-[#E88C9A] shadow-sm">✨</div>
      <h3 className="text-xl font-bold text-[#5C3A4D] mb-2">Diagnostic Data Required</h3>
      <p className="text-sm text-[#4A4A4A] font-medium max-w-sm">Complete your clinical assessment to generate personalized dermatological protocols.</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      {/* Header */}
      <div className="flex items-center gap-5">
        <div className="w-14 h-14 bg-white border border-rose-50 rounded-2xl flex items-center justify-center text-2xl text-[#E88C9A] shadow-sm">✨</div>
        <div>
          <h1 className="text-3xl font-extrabold text-[#5C3A4D] tracking-tight">Dermatological Protocol</h1>
          <p className="text-sm text-[#4A4A4A] font-bold">AI-tailored PCOS beauty & wellness regimens</p>
        </div>
      </div>

      {/* Today's Focus */}
      <div className="bg-gradient-to-r from-[#E88C9A] to-[#D97A88] border border-rose-200 rounded-[3xl] p-8 text-white relative flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_8px_30px_rgb(232,140,154,0.3)]">
        <div className="relative z-10 flex-1">
          <p className="text-rose-50 text-xs font-bold uppercase tracking-widest mb-2">📌 Daily Regimen Focus</p>
          <p className="text-xl md:text-2xl font-black leading-tight drop-shadow-sm">{skin.todayFocus}</p>
        </div>
        <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-3xl border border-white/30 shadow-sm flex-shrink-0">
          💅
        </div>
      </div>

      {/* Skin Care Tips */}
      <div className="bg-white rounded-[3xl] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-rose-50 p-8">
        <div className="flex items-center gap-3 mb-6 border-b border-rose-50 pb-4">
          <div className="w-10 h-10 bg-[#FFF8F6] border border-rose-100 rounded-xl flex items-center justify-center text-lg text-[#E88C9A]">🌸</div>
          <h3 className="text-xl font-extrabold text-[#5C3A4D] tracking-tight">Epidermal Clarity Matrix</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {skin.skinTips?.map((tip, i) => (
            <div key={i} className="flex items-start gap-4 p-5 bg-[#FFF8F6] rounded-3xl border border-rose-50 hover:border-[#E88C9A]/30 transition-colors">
              <span className="text-3xl bg-white border border-rose-100 p-3 rounded-2xl flex-shrink-0 shadow-sm">{tip.icon}</span>
              <div className="flex-1">
                <div className="flex items-center flex-wrap gap-2 mb-2 w-full">
                  <h4 className="font-black text-[#5C3A4D] truncate flex-1">{tip.title}</h4>
                  <span className={`px-3 py-1.5 rounded-lg text-[10px] uppercase font-bold tracking-widest bg-white text-[#E88C9A] border border-rose-100 shadow-sm`}>{tip.tag}</span>
                </div>
                <p className="text-sm text-[#4A4A4A] leading-relaxed font-bold">{tip.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hair Care Tips */}
      <div className="bg-white rounded-[3xl] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-rose-50 p-8">
        <div className="flex items-center gap-3 mb-6 border-b border-rose-50 pb-4">
          <div className="w-10 h-10 bg-[#FFF8F6] border border-rose-100 rounded-xl flex items-center justify-center text-lg text-[#E88C9A]">💇</div>
          <h3 className="text-xl font-extrabold text-[#5C3A4D] tracking-tight">Follicle Health Protocol</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {skin.hairTips?.map((tip, i) => (
            <div key={i} className="flex items-start gap-4 p-5 bg-[#FFF8F6] rounded-3xl border border-rose-50 hover:border-[#E88C9A]/30 transition-colors">
              <span className="text-3xl bg-white border border-rose-100 p-3 rounded-2xl flex-shrink-0 shadow-sm">{tip.icon}</span>
              <div className="flex-1">
                <div className="flex items-center flex-wrap gap-2 mb-2 w-full">
                  <h4 className="font-black text-[#5C3A4D] truncate flex-1">{tip.title}</h4>
                  <span className={`px-3 py-1.5 rounded-lg text-[10px] uppercase font-bold tracking-widest bg-white text-[#E88C9A] border border-rose-100 shadow-sm`}>{tip.tag}</span>
                </div>
                <p className="text-sm text-[#4A4A4A] leading-relaxed font-bold">{tip.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Insight */}
      {skin.aiInsight && (
        <div className="bg-gradient-to-r from-[#C8B6E2]/20 to-[#E88C9A]/10 border border-rose-100 rounded-[3xl] p-8 text-[#5C3A4D] relative flex flex-col md:flex-row items-center gap-6 shadow-sm mt-6">
          <div className="w-16 h-16 bg-white border border-rose-100 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 shadow-sm">
            🤖
          </div>
          <div className="flex-1">
            <h3 className="text-xs font-bold text-[#E88C9A] uppercase tracking-widest mb-2">AI Clinical Insight</h3>
            <p className="text-lg font-bold text-[#5C3A4D] leading-relaxed italic drop-shadow-sm">"{skin.aiInsight}"</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkinHairCare;
