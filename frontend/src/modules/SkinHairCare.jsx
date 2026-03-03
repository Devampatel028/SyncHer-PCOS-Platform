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
    <div className="flex flex-col gap-6 animate-pulse">
      <div className="h-32 bg-slate-100 rounded-2xl" />
      <div className="grid grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => <div key={i} className="h-32 bg-slate-100 rounded-2xl" />)}
      </div>
      <div className="grid grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => <div key={i} className="h-32 bg-slate-100 rounded-2xl" />)}
      </div>
    </div>
  );

  const skin = report?.skinCareModule || report?.skinHairPlan;

  if (!skin) return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <p className="text-5xl mb-4">✨</p>
      <h3 className="text-xl font-bold text-slate-700 mb-2">No Skin & Hair Plan Yet</h3>
      <p className="text-sm text-slate-400">Complete health assessment to receive personalized recommendations.</p>
    </div>
  );

  return (
    <>
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center text-2xl shadow-md">✨</div>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Skin & Hair Care</h1>
          <p className="text-sm text-slate-400">AI-tailored PCOS beauty & wellness routines</p>
        </div>
      </div>

      {/* Today's Focus */}
      <div className="bg-gradient-to-r from-pink-600 to-rose-600 rounded-2xl p-6 mb-8 text-white relative overflow-hidden shadow-lg">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10">
          <p className="text-pink-100 text-xs font-bold uppercase tracking-wider mb-2">📌 Today's Focus</p>
          <p className="text-lg font-bold">{skin.todayFocus}</p>
        </div>
      </div>

      {/* Skin Care Tips */}
      <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <span className="text-xl">🌸</span> Skin Clarity
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
        {skin.skinTips?.map((tip, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-start gap-4">
              <span className="text-3xl flex-shrink-0">{tip.icon}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-bold text-slate-800">{tip.title}</h4>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${tip.tagColor}`}>{tip.tag}</span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">{tip.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Hair Care Tips */}
      <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <span className="text-xl">💇</span> Hair Health
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        {skin.hairTips?.map((tip, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-start gap-4">
              <span className="text-3xl flex-shrink-0">{tip.icon}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-bold text-slate-800">{tip.title}</h4>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${tip.tagColor}`}>{tip.tag}</span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">{tip.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* AI Insight */}
      {skin.aiInsight && (
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center text-lg">🤖</div>
            <h3 className="text-lg font-bold text-slate-800">AI Health Insight</h3>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">{skin.aiInsight}</p>
        </div>
      )}
    </>
  );
};

export default SkinHairCare;
