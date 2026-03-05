import { useEffect, useState } from 'react';
import { apiCall } from '../services/api';

const ExercisePlan = () => {
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => <div key={i} className="h-32 bg-slate-200 rounded-2xl" />)}
      </div>
    </div>
  );

  const exercise = report?.exerciseModule || report?.exercisePlan;
  const weeklyPlan = exercise?.weeklySchedule;

  if (!exercise || !weeklyPlan) return (
    <div className="flex flex-col items-center justify-center py-24 text-center bg-white border border-rose-50 rounded-[3xl] shadow-[0_8px_30px_rgb(0,0,0,0.04)] mt-8">
      <div className="w-20 h-20 bg-[#FFF8F6] border border-rose-100 rounded-2xl flex items-center justify-center text-4xl mb-6 text-[#C8B6E2] shadow-sm">🧘</div>
      <h3 className="text-xl font-bold text-[#5C3A4D] mb-2">Diagnostic Data Required</h3>
      <p className="text-sm text-[#4A4A4A] font-medium max-w-sm">Complete your clinical assessment to generate personalized movement protocols.</p>
    </div>
  );

  // Map day abbreviation to today
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const todayAbbr = dayNames[new Date().getDay()];
  const todayPlan = weeklyPlan.find(d => d.day === todayAbbr) || weeklyPlan[0];

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      {/* Header */}
      <div className="flex items-center gap-5">
        <div className="w-14 h-14 bg-white border border-rose-50 rounded-2xl flex items-center justify-center text-2xl text-[#C8B6E2] shadow-sm">🧘</div>
        <div>
          <h1 className="text-3xl font-extrabold text-[#5C3A4D] tracking-tight">Mobility Protocol</h1>
          <p className="text-sm text-[#4A4A4A] font-bold">AI-customized routines mapped to your hormonal variant</p>
        </div>
      </div>

      {/* Today's Recommendation */}
      <div className="bg-gradient-to-r from-[#C8B6E2] to-[#B39CD0] border border-[#C8B6E2]/20 rounded-[3xl] p-8 text-white relative flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_8px_30px_rgb(200,182,226,0.2)]">
        <div className="relative z-10 flex-1">
          <p className="text-indigo-50 text-xs font-bold uppercase tracking-widest mb-2">📌 Today's Vector — {todayPlan.day}</p>
          <p className="text-2xl md:text-3xl font-black leading-tight mb-4 flex items-center gap-3 drop-shadow-sm">{todayPlan.icon} {todayPlan.focus} Day</p>
          <div className="flex flex-wrap gap-2">
            {todayPlan.exercises?.map((ex, i) => (
              <span key={i} className="bg-white/20 backdrop-blur-md border border-white/30 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wide text-white shadow-sm">{ex}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Weekly Plan */}
      <div className="bg-white rounded-[3xl] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-rose-50 p-8">
        <div className="flex items-center gap-3 mb-6 border-b border-rose-50 pb-4">
          <div className="w-10 h-10 bg-[#FFF8F6] border border-rose-100 rounded-xl flex items-center justify-center text-lg text-[#C8B6E2]">📅</div>
          <h3 className="text-xl font-extrabold text-[#5C3A4D] tracking-tight">Weekly Scheduling matrix</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {weeklyPlan.map(day => (
            <div key={day.day} className={`bg-[#FFF8F6] rounded-3xl border shadow-sm ${day.day === todayPlan.day ? 'border-[#C8B6E2]/50 bg-[#C8B6E2]/5' : 'border-rose-50'} p-6 flex flex-col`}>
              <div className="flex items-center justify-between mb-4 border-b border-rose-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 bg-white border border-rose-50 rounded-xl flex items-center justify-center text-lg shadow-sm ${day.day === todayPlan.day ? 'text-[#C8B6E2] border-[#C8B6E2]/30' : ''}`}>{day.icon}</div>
                  <div>
                    <p className="text-base font-black text-[#5C3A4D]">{day.day}</p>
                    <p className="text-xs font-bold text-[#4A4A4A] tracking-wide uppercase">{day.focus}</p>
                  </div>
                </div>
                {day.day === todayPlan.day && <span className="px-3 py-1.5 bg-[#C8B6E2] text-[#5C3A4D] text-[10px] uppercase tracking-widest font-black rounded-lg shadow-sm">Current</span>}
              </div>
              <ul className="space-y-2 flex-1">
                {day.exercises?.map((ex, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm font-bold text-[#4A4A4A] leading-snug">
                    <span className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${day.day === todayPlan.day ? 'bg-[#C8B6E2]' : 'bg-[#E88C9A]/50'}`} />
                    {ex}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* AI Insight */}
      {exercise.aiInsight && (
        <div className="bg-gradient-to-r from-[#C8B6E2]/20 to-[#E88C9A]/10 border border-rose-100 rounded-[3xl] p-8 text-[#5C3A4D] relative flex flex-col md:flex-row items-center gap-6 shadow-sm mt-6">
          <div className="w-16 h-16 bg-white border border-rose-100 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 shadow-sm">
            🤖
          </div>
          <div className="flex-1">
            <h3 className="text-xs font-bold text-[#E88C9A] uppercase tracking-widest mb-2">AI Clinical Insight</h3>
            <p className="text-lg font-bold text-[#5C3A4D] leading-relaxed italic drop-shadow-sm">"{exercise.aiInsight}"</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExercisePlan;
