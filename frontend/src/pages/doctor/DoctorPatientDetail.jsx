import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:5000/api';

const DoctorPatientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [skinReports, setSkinReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingReview, setSavingReview] = useState(null); // ID of report being reviewed

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('doctorToken');
        const [patientRes, skinRes] = await Promise.all([
          fetch(`${API_URL}/doctors/patient/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch(`${API_URL}/opencv/patient/${id}/analyses`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        const result = await patientRes.json();
        const skinData = await skinRes.json();

        setData(result);
        if (Array.isArray(skinData)) setSkinReports(skinData);
      } catch (err) {
        console.error('Failed to load data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleSaveReview = async (reportId, notes) => {
    setSavingReview(reportId);
    try {
      const token = localStorage.getItem('doctorToken');
      const res = await fetch(`${API_URL}/opencv/analysis/${reportId}/review`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ doctorNotes: notes })
      });

      if (res.ok) {
        const updatedReport = await res.json();
        setSkinReports(prev => prev.map(r => r._id === reportId ? updatedReport.analysis : r));
      }
    } catch (err) {
      console.error('Failed to save review:', err);
    } finally {
      setSavingReview(null);
    }
  };

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

      {/* Patient Skin Reports Section */}
      <div className="space-y-6 pt-8 border-t border-rose-50">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-extrabold text-[#5C3A4D]">Patient Skin Reports</h3>
          <span className="px-3 py-1 bg-rose-50 text-[#E88C9A] text-xs font-bold rounded-full border border-rose-100 uppercase tracking-widest">
            {skinReports.length} Analysis Found
          </span>
        </div>

        {skinReports.length === 0 ? (
          <div className="bg-white p-8 rounded-3xl border border-dashed border-rose-200 text-center">
            <p className="text-[#4A4A4A] font-medium text-sm italic">No skin scans uploaded by this patient yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {skinReports.map((report) => (
              <div key={report._id} className="bg-white rounded-[2.5rem] border border-rose-50 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-rose-50">
                  {/* Image Thumbnail */}
                  <div className="w-full md:w-64 aspect-square md:aspect-auto flex-shrink-0 bg-slate-50 relative group">
                    <img
                      src={`http://localhost:5000${report.imageUrl}`}
                      alt="Patient Skin"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-lg ${report.acneLevel === 'Low' ? 'bg-emerald-500 text-white border-emerald-400' :
                          report.acneLevel === 'Moderate' ? 'bg-amber-500 text-white border-amber-400' :
                            'bg-rose-500 text-white border-rose-400'
                        }`}>
                        {report.acneLevel}
                      </span>
                    </div>
                  </div>

                  {/* Analysis Data */}
                  <div className="flex-1 p-8 space-y-6">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <p className="text-[10px] font-black text-[#5C3A4D]/40 uppercase tracking-[0.2em] mb-1">Scan Date</p>
                        <p className="text-[#5C3A4D] font-bold">{new Date(report.createdAt).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black text-[#5C3A4D]/40 uppercase tracking-[0.2em] mb-1">Spots Count</p>
                        <p className="text-2xl font-black text-[#E88C9A]">{report.detectedSpots}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-[10px] font-black text-[#5C3A4D]/40 uppercase tracking-[0.2em] mb-3">Affected Regions</p>
                      <div className="flex flex-wrap gap-2">
                        {report.affectedAreas?.map((area, idx) => (
                          <span key={idx} className="px-3 py-1.5 bg-slate-50 text-[#5C3A4D] text-xs font-bold rounded-xl border border-rose-100">
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Review Section */}
                    <div className="pt-6 border-t border-rose-50">
                      {report.doctorViewed ? (
                        <div className="p-5 bg-emerald-50/50 border border-emerald-100 rounded-3xl">
                          <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest mb-2 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                            Review Complete
                          </p>
                          <p className="text-sm text-emerald-900/80 font-medium italic leading-relaxed">
                            "{report.doctorNotes || 'No notes provided'}"
                          </p>
                          <button
                            onClick={() => {
                              const newNotes = prompt('Edit review notes:', report.doctorNotes);
                              if (newNotes !== null) handleSaveReview(report._id, newNotes);
                            }}
                            className="text-[10px] font-black text-emerald-700 uppercase mt-4 hover:underline"
                          >
                            Edit Review
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></span>
                            Awaiting Review
                          </p>
                          <div className="flex flex-col gap-3">
                            <textarea
                              id={`notes-${report._id}`}
                              placeholder="Enter clinical notes for this patient..."
                              className="w-full h-24 p-4 rounded-2xl border border-rose-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#E88C9A] transition-all bg-[#FFF8F6] font-medium"
                            ></textarea>
                            <button
                              onClick={() => {
                                const notes = document.getElementById(`notes-${report._id}`).value;
                                handleSaveReview(report._id, notes);
                              }}
                              disabled={savingReview === report._id}
                              className="w-full md:w-auto self-end bg-[#E88C9A] hover:bg-[#D97A88] text-white px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-md active:scale-95 disabled:bg-slate-300"
                            >
                              {savingReview === report._id ? 'Saving...' : 'Save Review'}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorPatientDetail;

