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
    <div className="flex flex-col gap-6 animate-pulse">
      <div className="h-32 bg-slate-100 rounded-2xl" />
      <div className="h-48 bg-slate-100 rounded-2xl" />
      <div className="grid grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => <div key={i} className="h-36 bg-slate-100 rounded-2xl" />)}
      </div>
    </div>
  );

  // Handle both new and old keys for backward compatibility
  const diet = report?.dietModule || report?.dietPlan;

  if (!diet) return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <p className="text-5xl mb-4">🥗</p>
      <h3 className="text-xl font-bold text-slate-700 mb-2">No Diet Plan Yet</h3>
      <p className="text-sm text-slate-400">Complete health assessment to receive personalized recommendations.</p>
    </div>
  );

  return (
    <>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-2xl shadow-md">🥗</div>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Personalized Diet Plan</h1>
          <p className="text-sm text-slate-400">AI-curated nutrition for your PCOS profile</p>
        </div>
      </div>

      {/* Today's Focus */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 mb-8 text-white relative overflow-hidden shadow-lg">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10">
          <p className="text-green-100 text-xs font-bold uppercase tracking-wider mb-2">📌 Today's Focus</p>
          <p className="text-lg font-bold">{diet.todayFocus}</p>
        </div>
      </div>

      {/* Nutrition Principles */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 mb-8 hover:shadow-xl transition-all duration-300">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center text-lg">📋</div>
          <h3 className="text-lg font-bold text-slate-800">Core Nutrition Principles</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {diet.nutritionTips?.map((item, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
              <span className="w-6 h-6 bg-violet-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">{i + 1}</span>
              <span className="text-sm text-slate-700 flex-1">{item.text}</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${item.tagColor}`}>{item.tag}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Meal Plan Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        {diet.mealPlan?.map(meal => (
          <div key={meal.time} className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">{meal.icon}</span>
              <h4 className="text-lg font-bold text-slate-800">{meal.time}</h4>
            </div>
            <div className="space-y-2">
              {meal.items?.map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-slate-600">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* AI Insight */}
      {diet.aiInsight && (
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center text-lg">🤖</div>
            <h3 className="text-lg font-bold text-slate-800">AI Health Insight</h3>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">{diet.aiInsight}</p>
        </div>
      )}
    </>
  );
};

export default DietPlan;
