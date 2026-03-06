import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:5000/api';

const DoctorPatientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('doctorToken');
        const res = await fetch(`${API_URL}/doctors/patient/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const result = await res.json();
        setData(result);
      } catch (err) {
        console.error('Failed to load patient data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-violet-200 border-t-[#C8B6E2] rounded-full animate-spin mx-auto"></div>
      </div>
    );
  }

  if (!data || !data.user) {
    return (
      <div className="bg-white p-12 rounded-3xl text-center border border-rose-50">
        <p className="text-[#4A4A4A] font-bold">Patient data not found.</p>
      </div>
    );
  }

  const { user, report, assessment } = data;
  const qa = assessment?.questionnaireAnswers;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Back Button */}
      <button onClick={() => navigate('/doctor/dashboard')}
        className="text-[#C8B6E2] text-sm font-bold hover:opacity-70 transition-opacity flex items-center gap-1">
        ← Back to Patients
      </button>

      {/* Patient Header */}
      <div className="relative overflow-hidden rounded-3xl p-8 bg-gradient-to-br from-[#E88C9A] to-[#D97A88] text-white border border-rose-100 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl font-black backdrop-blur-sm">
            {user.name?.charAt(0)?.toUpperCase() || 'P'}
          </div>
          <div>
            <h2 className="text-3xl font-black tracking-tight">{user.name || 'Patient'}</h2>
            <p className="text-rose-100 font-medium">{user.email}</p>
            {user.phone && <p className="text-rose-100 text-sm">📞 {user.phone}</p>}
          </div>
        </div>
      </div>

      {/* Basic Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Age', value: user.age || qa?.age || 'N/A', icon: '🎂' },
          { label: 'Height', value: (user.height || qa?.height) ? `${user.height || qa?.height} cm` : 'N/A', icon: '📏' },
          { label: 'Weight', value: (user.weight || qa?.weight) ? `${user.weight || qa?.weight} kg` : 'N/A', icon: '⚖️' },
          { label: 'Cycle Length', value: user.cycleLength || qa?.cycleLength || 'Unknown', icon: '📅' },
        ].map(stat => (
          <div key={stat.label} className="bg-white p-5 rounded-3xl border border-rose-50 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{stat.icon}</span>
              <p className="text-xs font-bold text-[#5C3A4D]/60 uppercase tracking-widest">{stat.label}</p>
            </div>
            <p className="text-2xl font-black text-[#5C3A4D]">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Questionnaire Data */}
      {qa && (
        <div className="space-y-6">
          <h3 className="text-xl font-extrabold text-[#5C3A4D]">Patient Intake Data</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { label: 'PCOS Diagnosis', value: qa.diagnosed || user.pcosStatus, icon: '🩺' },
              { label: 'Diet Pattern', value: qa.dietPattern, icon: '🥗' },
              { label: 'Main Meal', value: qa.mainMeal, icon: '🍽️' },
              { label: 'Meals/Day', value: qa.mealsPerDay, icon: '🔢' },
              { label: 'Smoking', value: qa.smoking, icon: '🚬' },
              { label: 'Family History', value: qa.familyHistory?.length > 0 ? qa.familyHistory.join(', ') : 'None', icon: '👨‍👩‍👧' },
            ].filter(item => item.value).map(item => (
              <div key={item.label} className="bg-white p-5 rounded-3xl border border-rose-50 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{item.icon}</span>
                  <p className="text-xs font-bold text-[#5C3A4D]/60 uppercase tracking-widest">{item.label}</p>
                </div>
                <p className="text-lg font-bold text-[#5C3A4D]">{item.value}</p>
              </div>
            ))}
          </div>

          {/* Symptoms */}
          {qa.symptoms?.length > 0 && (
            <div className="bg-white p-6 rounded-3xl border border-rose-50 shadow-sm">
              <p className="text-xs font-bold text-[#5C3A4D]/60 uppercase tracking-widest mb-3">Reported Symptoms</p>
              <div className="flex flex-wrap gap-2">
                {qa.symptoms.map((s, i) => (
                  <span key={i} className="px-3 py-1.5 bg-rose-50 text-rose-700 text-xs font-bold rounded-xl border border-rose-100">{s}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* AI Report */}
      {report ? (
        <div className="space-y-6">
          <h3 className="text-xl font-extrabold text-[#5C3A4D]">AI Health Report</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-rose-50 shadow-sm">
              <p className="text-xs font-bold text-[#5C3A4D]/60 uppercase tracking-widest mb-2">BMI</p>
              <p className="text-3xl font-black text-[#5C3A4D]">{report.BMI || 'N/A'}</p>
              {report.bmiCategory && <p className="text-xs text-[#E88C9A] font-bold mt-1">{report.bmiCategory}</p>}
            </div>
            <div className="bg-white p-5 rounded-3xl border border-rose-50 shadow-sm">
              <p className="text-xs font-bold text-[#5C3A4D]/60 uppercase tracking-widest mb-2">Risk Level</p>
              <p className="text-3xl font-black text-[#5C3A4D]">{report.riskLevel || 'N/A'}</p>
            </div>
            <div className="bg-white p-5 rounded-3xl border border-rose-50 shadow-sm">
              <p className="text-xs font-bold text-[#5C3A4D]/60 uppercase tracking-widest mb-2">Symptom Score</p>
              <p className="text-3xl font-black text-[#5C3A4D]">{report.symptomScore ? `${report.symptomScore}/10` : 'N/A'}</p>
            </div>
            <div className="bg-white p-5 rounded-3xl border border-rose-50 shadow-sm">
              <p className="text-xs font-bold text-[#5C3A4D]/60 uppercase tracking-widest mb-2">PCOS Prediction</p>
              <p className="text-xl font-black text-[#5C3A4D]">{report.pcosPrediction || 'N/A'}</p>
            </div>
          </div>

          {/* Advanced Scores */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-rose-50 shadow-sm">
              <p className="text-xs font-bold text-[#5C3A4D]/60 uppercase tracking-widest mb-2">Advanced Score</p>
              <p className="text-2xl font-black text-[#5C3A4D]">{report.advancedScore ?? 'N/A'}</p>
            </div>
            <div className="bg-white p-5 rounded-3xl border border-rose-50 shadow-sm">
              <p className="text-xs font-bold text-[#5C3A4D]/60 uppercase tracking-widest mb-2">Combined Risk</p>
              <p className="text-lg font-black text-[#5C3A4D]">{report.combinedRiskLevel || 'N/A'}</p>
            </div>
            <div className="bg-white p-5 rounded-3xl border border-rose-50 shadow-sm">
              <p className="text-xs font-bold text-[#5C3A4D]/60 uppercase tracking-widest mb-2">Intensity Score</p>
              <p className="text-2xl font-black text-[#5C3A4D]">{report.intensityScore ?? 'N/A'}</p>
            </div>
            <div className="bg-white p-5 rounded-3xl border border-rose-50 shadow-sm">
              <p className="text-xs font-bold text-[#5C3A4D]/60 uppercase tracking-widest mb-2">Severity</p>
              <p className="text-lg font-black text-[#5C3A4D]">{report.refinedSeverityLevel || 'N/A'}</p>
            </div>
          </div>

          {/* Menstrual Info */}
          <div className="bg-white p-6 rounded-3xl border border-rose-50 shadow-sm">
            <p className="text-xs font-bold text-[#5C3A4D]/60 uppercase tracking-widest mb-2">Menstrual Irregularity</p>
            <p className="text-lg font-bold text-[#5C3A4D]">{report.menstrualIrregularity || 'N/A'}</p>
          </div>

          {/* AI Insight */}
          {report.personalizedMessage && (
            <div className="bg-gradient-to-r from-[#C8B6E2]/20 to-[#E88C9A]/10 p-6 rounded-3xl border border-violet-100 shadow-sm">
              <p className="text-xs font-bold text-[#C8B6E2] uppercase tracking-widest mb-2">AI Clinical Insight</p>
              <p className="text-lg font-bold text-[#5C3A4D] italic">"{report.personalizedMessage}"</p>
            </div>
          )}

          {/* Hormone Tips */}
          {report.hormoneBalanceTips?.length > 0 && (
            <div className="bg-white p-6 rounded-3xl border border-rose-50 shadow-sm">
              <p className="text-xs font-bold text-[#5C3A4D]/60 uppercase tracking-widest mb-3">Hormone Balance Tips</p>
              <ul className="space-y-2">
                {report.hormoneBalanceTips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[#4A4A4A] font-medium">
                    <span className="text-[#8FBF9F] mt-0.5">•</span> {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white p-12 rounded-3xl text-center border border-rose-50 shadow-sm">
          <div className="w-16 h-16 bg-violet-50 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">📋</div>
          <h3 className="text-lg font-bold text-[#5C3A4D] mb-1">No AI Report Available</h3>
          <p className="text-sm text-[#4A4A4A] font-medium">This patient hasn't completed their health assessment yet.</p>
        </div>
      )}
    </div>
  );
};

export default DoctorPatientDetail;

