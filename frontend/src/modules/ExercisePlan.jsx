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
    <div className="flex flex-col gap-6 animate-pulse">
      <div className="h-32 bg-slate-100 rounded-2xl" />
      <div className="grid grid-cols-3 gap-4">
        {[...Array(7)].map((_, i) => <div key={i} className="h-36 bg-slate-100 rounded-2xl" />)}
      </div>
    </div>
  );

  const exercise = report?.exerciseModule || report?.exercisePlan;
  const weeklyPlan = exercise?.weeklySchedule;

  if (!exercise || !weeklyPlan) return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <p className="text-5xl mb-4">🧘</p>
      <h3 className="text-xl font-bold text-slate-700 mb-2">No Exercise Plan Yet</h3>
      <p className="text-sm text-slate-400">Complete health assessment to receive personalized recommendations.</p>
    </div>
  );

  // Map day abbreviation to today
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const todayAbbr = dayNames[new Date().getDay()];
  const todayPlan = weeklyPlan.find(d => d.day === todayAbbr) || weeklyPlan[0];

  return (
    <>
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center text-2xl shadow-md">🧘</div>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Exercise Plan</h1>
          <p className="text-sm text-slate-400">AI-customized routines for your PCOS profile</p>
        </div>
      </div>

      {/* Today's Recommendation */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 mb-8 text-white relative overflow-hidden shadow-lg">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10">
          <p className="text-blue-100 text-xs font-bold uppercase tracking-wider mb-2">📌 Today — {todayPlan.day}</p>
          <p className="text-lg font-bold">{todayPlan.icon} {todayPlan.focus} Day</p>
          <div className="flex flex-wrap gap-2 mt-3">
            {todayPlan.exercises?.map((ex, i) => (
              <span key={i} className="bg-white/20 px-3 py-1 rounded-full text-xs font-medium">{ex}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Weekly Plan */}
      <h3 className="text-lg font-bold text-slate-800 mb-4">Weekly Schedule</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {weeklyPlan.map(day => (
          <div key={day.day} className={`bg-white rounded-2xl shadow-lg border border-slate-100 p-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${day.day === todayPlan.day ? 'ring-2 ring-teal-400' : ''}`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className={`w-10 h-10 bg-gradient-to-br ${day.color} rounded-xl flex items-center justify-center text-lg shadow-sm`}>{day.icon}</div>
                <div>
                  <p className="text-sm font-bold text-slate-800">{day.day}</p>
                  <p className="text-xs text-slate-400">{day.focus}</p>
                </div>
              </div>
              {day.day === todayPlan.day && <span className="px-2 py-0.5 bg-violet-100 text-violet-700 text-xs font-bold rounded-full">Today</span>}
            </div>
            <div className="space-y-1.5">
              {day.exercises?.map((ex, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-slate-600">
                  <span className="w-1.5 h-1.5 bg-slate-300 rounded-full flex-shrink-0" />{ex}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* AI Insight */}
      {exercise.aiInsight && (
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center text-lg">🤖</div>
            <h3 className="text-lg font-bold text-slate-800">AI Health Insight</h3>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">{exercise.aiInsight}</p>
        </div>
      )}
    </>
  );
};

export default ExercisePlan;
