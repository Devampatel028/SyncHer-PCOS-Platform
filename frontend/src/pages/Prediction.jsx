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
    <div className="min-h-screen bg-[#FFF8F6] flex items-center justify-center font-sans">
      <div className="text-center animate-pulse-soft">
        <div className="w-24 h-24 border-4 border-rose-50 border-t-[#E88C9A] rounded-full animate-spin mx-auto mb-8 shadow-sm" />
        <p className="text-2xl font-black text-[#5C3A4D] tracking-tight">Compiling Medical Data...</p>
        <p className="text-[#4A4A4A] mt-3 font-medium">Synthesizing clinical insights for your dashboard</p>
      </div>
    </div>
  );

  if (!report) return (
    <div className="min-h-screen bg-[#FFF8F6] flex items-center justify-center font-sans">
      <div className="bg-white border border-rose-50 text-center p-14 rounded-[3xl] shadow-[0_8px_30px_rgb(0,0,0,0.04)] w-full max-w-lg mx-6 animate-scale-in">
        <div className="w-20 h-20 bg-[#FFF8F6] rounded-2xl flex items-center justify-center text-4xl mx-auto mb-6 border border-rose-100 text-[#E88C9A] shadow-sm">📋</div>
        <h2 className="text-2xl font-black text-[#5C3A4D] mb-2">No Report Found</h2>
        <p className="text-[#4A4A4A] mb-8 font-medium">Please complete your health assessment to generate an AI evaluation.</p>
        <button onClick={() => navigate('/questionnaire')}
          className="w-full bg-[#E88C9A] text-white px-8 py-4 rounded-2xl font-bold hover:bg-[#D97A88] transition-colors shadow-sm">
          Take Assessment
        </button>
      </div>
    </div>
  );

  const riskConfig = {
    'Low': { bg: 'bg-[#8FBF9F]/10 border-[#8FBF9F]/20', text: 'text-[#8FBF9F]', badgeInfo: 'bg-[#8FBF9F]/20 text-[#2C4C3B]', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
    'Medium': { bg: 'bg-amber-50 border-amber-100', text: 'text-amber-700', badgeInfo: 'bg-amber-100 text-amber-800', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
    'High': { bg: 'bg-[#E88C9A]/10 border-[#E88C9A]/20', text: 'text-[#E88C9A]', badgeInfo: 'bg-[#E88C9A]/20 text-[#5C3A4D]', icon: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  };
  const risk = riskConfig[report.riskLevel] || riskConfig['Medium'];

  return (
    <div className="min-h-screen bg-[#FFF8F6] py-16 px-6 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Header */}
        <div className="text-center mb-16 animate-slide-up">
          <div className="inline-flex items-center gap-2 bg-white text-[#E88C9A] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6 border border-rose-100 shadow-sm">
            <span className="w-2 h-2 bg-[#E88C9A] rounded-full animate-pulse" /> Final Assessment Validated
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#5C3A4D] tracking-tight">Clinical Report Formulated</h1>
        </div>

        {/* Prediction Main Card */}
        <div className={`w-full bg-white border border-rose-50 p-8 md:p-12 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] animate-slide-up relative overflow-hidden`}>
          {/* subtle accent block */}
          <div className={`absolute top-0 left-0 w-full h-2 ${risk.bg.replace('bg-', 'bg-').split(' ')[0]}`}></div>

          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-sm font-bold text-[#E88C9A] uppercase tracking-widest mb-8">PCOS Risk Diagnostic</h2>

            <div className={`inline-flex items-center justify-center p-6 rounded-[2xl] ${risk.bg} border mb-6 shadow-sm`}>
              <svg className={`w-12 h-12 ${risk.text}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={risk.icon} />
              </svg>
            </div>

            <div className="mb-4">
              <span className={`px-4 py-1.5 rounded-lg font-bold text-sm tracking-wide ${risk.badgeInfo}`}>
                {report.riskLevel} RISK CLASSIFICATION
              </span>
            </div>

            <p className="text-3xl md:text-4xl font-black text-[#5C3A4D] mb-6 tracking-tight">
              {report.pcosPrediction}
            </p>

            <p className="text-[#4A4A4A] text-lg font-medium leading-relaxed bg-[#FFF8F6] p-6 rounded-3xl border border-rose-50 shadow-inner">
              "{report.personalizedMessage}"
            </p>
          </div>
        </div>

        {/* Key Metrics Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          {[
            { label: 'BMI Index', value: report.BMI, unit: '' },
            { label: 'Symptom Score', value: parseScore(report.symptomScore), unit: '/10' },
            { label: 'Lifestyle Score', value: parseScore(report.lifestyleScore), unit: '/10' },
            { label: 'Irregularity', value: report.menstrualIrregularity, unit: '' },
          ].map(stat => (
            <div key={stat.label} className="bg-white border border-rose-50 p-6 rounded-3xl flex flex-col items-center text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <span className="text-xs font-bold text-[#5C3A4D]/60 uppercase tracking-wider mb-2">{stat.label}</span>
              <span className="text-2xl font-black text-[#5C3A4D]">{stat.value}{stat.unit}</span>
            </div>
          ))}
        </div>

        {/* Action Bottom */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-12 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <button onClick={() => navigate('/dashboard')}
            className="px-10 py-4 bg-[#E88C9A] hover:bg-[#D97A88] text-white rounded-2xl font-bold shadow-sm transition-all text-lg">
            Initialize Dashboard Portal
          </button>
        </div>
      </div>
    </div>
  );
};

export default Prediction;
