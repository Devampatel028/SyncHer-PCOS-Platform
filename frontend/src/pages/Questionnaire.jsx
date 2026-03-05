import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiCall } from '../services/api';

const Questionnaire = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    age: '', weight: '', height: '',
    mainMeal: 'Lunch', familyHistory: [],
    mealsPerDay: '3', dietPattern: 'Mixed',
    smoking: 'No', diagnosed: 'Not diagnosed',
    cycleLength: '28–31', symptoms: [],
    advancedAnswers: ['A. Never', 'A. No', 'A. No', 'A. Normal', 'A. Minimal'],
    intensityAnswers: [0, 0, 0, 0, 0]
  });

  const [hormonalData, setHormonalData] = useState({
    q1: '0', q2: '0', q3: '0', q4: '0', q5: '0',
    q6: '0', q7: '0', q8: '0', q9: '0', q10: '0'
  });

  useEffect(() => {
    const loadPreviousData = async () => {
      try {
        const data = await apiCall('/assessment/latest-form', 'GET');
        if (data?.formData) {
          // Exclude _id, __v, userId from being spread into state if present
          const { _id, userId, createdAt, __v, ...cleanFormData } = data.formData;
          setFormData(prev => ({ ...prev, ...cleanFormData }));
        }
        if (data?.hormonalData?.length > 0) {
          const loadedHormonal = {};
          data.hormonalData.forEach(ans => {
            loadedHormonal[`q${ans.questionId}`] = String(ans.numericScore);
          });
          setHormonalData(prev => ({ ...prev, ...loadedHormonal }));
        }
      } catch (err) {
        console.log("Welcome back! Ready for a new assessment.");
      }
    };
    loadPreviousData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      const field = name === 'familyHistory' ? 'familyHistory' : 'symptoms';
      const updated = checked ? [...formData[field], value] : formData[field].filter(item => item !== value);
      setFormData({ ...formData, [field]: updated });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleArrayChange = (e, arrayName, index) => {
    const newArray = [...formData[arrayName]];
    newArray[index] = e.target.value;
    setFormData({ ...formData, [arrayName]: newArray });
  };

  const handleHormonalChange = (e) => {
    setHormonalData({ ...hormonalData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const hormonalAnswers = Object.keys(hormonalData).map((key, index) => ({
        questionId: index + 1,
        selectedOption: `Score: ${hormonalData[key]}`,
        numericScore: Number(hormonalData[key])
      }));

      const pcosPromise = apiCall('/assessment/submit', 'POST', formData);
      const hormonalPromise = apiCall('/user/hormonal-assessment', 'POST', { answers: hormonalAnswers });

      const [pcosData] = await Promise.all([
        pcosPromise,
        hormonalPromise.catch(err => console.error('Hormonal Assessment Error:', err))
      ]);

      if (pcosData?.report) navigate('/prediction');
    } catch (err) { console.error('Assessment Error:', err); }
    finally { setLoading(false); }
  };

  const inputClasses = "w-full p-4 rounded-2xl border border-rose-50 bg-[#FFF8F6] text-[#4A4A4A] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E88C9A] focus:border-[#E88C9A] transition-all shadow-sm";
  const selectClasses = "w-full p-4 rounded-2xl border border-rose-50 bg-[#FFF8F6] text-[#4A4A4A] focus:outline-none focus:ring-2 focus:ring-[#E88C9A] focus:border-[#E88C9A] transition-all shadow-sm appearance-none cursor-pointer";
  const cardClasses = "bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-rose-50 p-6 md:p-8 mb-6";
  const labelClasses = "block text-sm font-bold text-[#5C3A4D] mb-2";

  return (
    <div className="min-h-screen bg-[#FFF8F6] py-12 px-6 font-sans">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-white text-[#E88C9A] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-rose-100 shadow-sm">
            <span className="w-2 h-2 bg-[#E88C9A] rounded-full animate-pulse"></span> Medical Intake
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-[#5C3A4D] mb-4 tracking-tight">Clinical Assessment</h2>
          <p className="text-lg text-[#4A4A4A] max-w-xl mx-auto font-medium">
            Please provide accurate details so our AI can generate the most effective personalized protocol for your body.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Basic Metrics */}
          <div className={`${cardClasses} animate-slide-up`} style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#FFF8F6] rounded-xl flex items-center justify-center text-[#E88C9A] border border-rose-100 shadow-sm">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-[#5C3A4D]">Basic Metrics</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className={labelClasses}>Age</label>
                <input type="number" name="age" required onChange={handleChange} value={formData.age || ''} className={inputClasses} placeholder="e.g. 25" />
              </div>
              <div>
                <label className={labelClasses}>Weight (kg)</label>
                <input type="number" name="weight" required onChange={handleChange} value={formData.weight || ''} className={inputClasses} placeholder="e.g. 58" />
              </div>
              <div>
                <label className={labelClasses}>Height (cm)</label>
                <input type="number" name="height" required onChange={handleChange} value={formData.height || ''} className={inputClasses} placeholder="e.g. 162" />
              </div>
            </div>
          </div>

          {/* Lifestyle & Meal Preferences */}
          <div className={`${cardClasses} animate-slide-up`} style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#FFF8F6] rounded-xl flex items-center justify-center text-[#8FBF9F] border border-rose-100 shadow-sm">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-[#5C3A4D]">Lifestyle & Habits</h3>
            </div>

            <div className="mb-8">
              <label className={labelClasses}>Primary Meal of the Day</label>
              <div className="flex flex-wrap gap-3 mt-3">
                {['Breakfast', 'Lunch', 'Dinner', 'Lunch & Dinner', 'Snacks'].map(meal => (
                  <label key={meal} className={`px-5 py-3 rounded-2xl border-2 cursor-pointer transition-all duration-200 text-sm font-bold select-none ${formData.mainMeal === meal
                    ? 'border-[#E88C9A] bg-[#FFF8F6] text-[#E88C9A]'
                    : 'border-rose-50 text-[#4A4A4A] hover:border-[#E88C9A]/40 hover:bg-[#FFF8F6]'
                    }`}>
                    <input type="radio" name="mainMeal" value={meal} className="hidden" onChange={handleChange} checked={formData.mainMeal === meal} />
                    {meal}
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClasses}>Meals Per Day</label>
                <select name="mealsPerDay" onChange={handleChange} value={formData.mealsPerDay || '3'} className={selectClasses}>
                  {[1, 2, 3, 4].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClasses}>Smoking Status</label>
                <select name="smoking" onChange={handleChange} value={formData.smoking || 'No'} className={selectClasses}>
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>
              <div>
                <label className={labelClasses}>Dietary Pattern</label>
                <select name="dietPattern" onChange={handleChange} value={formData.dietPattern || 'Mixed'} className={selectClasses}>
                  {['Vegetarian', 'Non-Vegetarian', 'Vegan', 'Mixed', 'Keto', 'Gluten-Free'].map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClasses}>Current PCOS Diagnosis</label>
                <select name="diagnosed" onChange={handleChange} value={formData.diagnosed || 'Not diagnosed'} className={selectClasses}>
                  {['Not diagnosed', 'I think I have symptoms', 'Diagnosed with PCOS', 'Previously diagnosed'].map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Medical History & Symptoms */}
          <div className={`${cardClasses} animate-slide-up`} style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#FFF8F6] rounded-xl flex items-center justify-center text-[#C8B6E2] border border-rose-100 shadow-sm">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-[#5C3A4D]">Medical Details</h3>
            </div>

            <div className="mb-8">
              <label className={labelClasses}>Cycle Length (last 6 months)</label>
              <select name="cycleLength" onChange={handleChange} value={formData.cycleLength || '28–31'} className={selectClasses}>
                {['20–24', '24–28', '28–31', '31–35', '>35', 'Highly Irregular'].map(val => (
                  <option key={val} value={val}>{val} Days</option>
                ))}
              </select>
            </div>

            <div className="mb-8">
              <label className={labelClasses}>Relevant Family History</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                {['PCOS', 'Diabetes', 'CVD', 'Gestational Diabetes'].map(item => (
                  <label key={item} className="flex items-center gap-3 cursor-pointer bg-[#FFF8F6] border border-rose-50 px-4 py-3.5 rounded-2xl hover:bg-white transition-colors select-none">
                    <input type="checkbox" name="familyHistory" value={item} onChange={handleChange} checked={formData.familyHistory ? formData.familyHistory.includes(item) : false} className="w-5 h-5 text-[#E88C9A] border-rose-100 rounded focus:ring-[#E88C9A]" />
                    <span className="text-sm font-bold text-[#4A4A4A]">{item}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className={labelClasses}>Current Symptoms</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                {['Irregular menstrual periods', 'Excess facial/body hair', 'Acne', 'Male-pattern baldness', 'None'].map(symptom => (
                  <label key={symptom} className="flex items-center gap-3 cursor-pointer bg-[#FFF8F6] border border-rose-50 px-4 py-3.5 rounded-2xl hover:bg-white transition-colors select-none">
                    <input type="checkbox" name="symptoms" value={symptom} onChange={handleChange} checked={formData.symptoms ? formData.symptoms.includes(symptom) : false} className="w-5 h-5 text-[#E88C9A] border-rose-100 rounded focus:ring-[#E88C9A]" />
                    <span className="text-sm font-bold text-[#4A4A4A]">{symptom}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Advanced Risk & Severity */}
          <div className={`${cardClasses} animate-slide-up`} style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#FFF8F6] rounded-xl flex items-center justify-center text-orange-400 border border-rose-100 shadow-sm">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-[#5C3A4D]">Advanced Severity Metrics</h3>
            </div>

            <div className="space-y-6 mb-10 pb-8 border-b border-rose-100">
              <p className="text-sm font-bold text-[#E88C9A] uppercase tracking-wider mb-2">Part 1: Clinical Indicators</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { q: 'Frequent pelvic pain?', opts: ['A. Never', 'B. Occasionally', 'C. Often', 'D. Severe & frequent'] },
                  { q: 'Fertility struggles?', opts: ['A. No', 'B. Trying <6 months', 'C. Trying >1 year', 'D. Diagnosed fertility issue'] },
                  { q: 'Family history depth?', opts: ['A. No', 'B. Extended family', 'C. Mother or sister', 'D. Multiple close relatives'] },
                  { q: 'Heavy menstrual bleeding?', opts: ['A. Normal', 'B. Slightly heavy', 'C. Heavy', 'D. Very heavy/clotting'] },
                  { q: 'Severe PMS symptoms?', opts: ['A. Minimal', 'B. Mild', 'C. Moderate', 'D. Severe mood/physical symptoms'] },
                ].map((item, index) => (
                  <div key={index}>
                    <label className={labelClasses}>{item.q}</label>
                    <select value={formData.advancedAnswers[index]} onChange={(e) => handleArrayChange(e, 'advancedAnswers', index)} className={selectClasses}>
                      {item.opts.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <p className="text-sm font-bold text-[#E88C9A] uppercase tracking-wider mb-2">Part 2: Intensity Scoring</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { q: 'Period pain severity (0-10)', opts: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => ({ label: String(n), val: Math.ceil(n / 2) })) },
                  { q: 'Hair growth progression', opts: [{ label: 'Slow', val: 0 }, { label: 'Moderate', val: 2 }, { label: 'Fast', val: 4 }, { label: 'Very Fast', val: 5 }] },
                  { q: 'Acne scarring level', opts: [{ label: 'None', val: 0 }, { label: 'Mild', val: 2 }, { label: 'Moderate', val: 4 }, { label: 'Severe', val: 5 }] },
                  { q: 'Weight gain speed', opts: [{ label: 'Stable', val: 0 }, { label: 'Gradual', val: 2 }, { label: 'Fast', val: 4 }, { label: 'Rapid', val: 5 }] },
                  { q: 'Emotional impact', opts: [{ label: 'Minimal', val: 0 }, { label: 'Mild', val: 2 }, { label: 'Significant', val: 4 }, { label: 'Severe', val: 5 }] }
                ].map((item, index) => (
                  <div key={index}>
                    <label className={labelClasses}>{item.q}</label>
                    <select value={formData.intensityAnswers[index]} onChange={(e) => handleArrayChange(e, 'intensityAnswers', index)} className={selectClasses}>
                      {item.opts.map(opt => <option key={opt.label} value={opt.val}>{opt.label}</option>)}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Hormonal Health Index */}
          <div className={`${cardClasses} animate-slide-up`} style={{ animationDelay: '0.5s' }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#FFF8F6] rounded-xl flex items-center justify-center text-[#8FBF9F] border border-rose-100 shadow-sm">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-[#5C3A4D]">Hormonal Health Index</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { id: 'q1', label: 'Sugar cravings impact?', options: [0, 3, 7, 10] },
                { id: 'q2', label: 'Sleepy after meals?', options: [0, 3, 7, 10] },
                { id: 'q3', label: 'Difficulty losing weight?', options: [0, 3, 7, 10] },
                { id: 'q4', label: 'Dark skin patches present?', options: [0, 5, 10] },
                { id: 'q5', label: 'Bloating & inflammation?', options: [0, 3, 7, 10] },
                { id: 'q6', label: 'Overall daily stress level?', options: [0, 3, 7, 10] },
                { id: 'q7', label: 'Average sleep duration?', options: [0, 3, 7, 10] },
                { id: 'q8', label: 'Wake up feeling refreshed?', options: [0, 3, 7, 10] },
                { id: 'q9', label: 'Frequency of mood swings?', options: [0, 3, 7, 10] },
                { id: 'q10', label: 'Energy stability throughout day?', options: [0, 3, 7, 10] }
              ].map(q => (
                <div key={q.id}>
                  <label className={labelClasses}>{q.label}</label>
                  <select name={q.id} value={hormonalData[q.id]} onChange={handleHormonalChange} className={selectClasses}>
                    {q.options.map(opt => (
                      <option key={opt} value={opt}>Score: {opt}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <button type="submit" disabled={loading}
              className={`w-full py-5 rounded-2xl text-white font-bold text-lg shadow-sm transition-all flex justify-center items-center h-[68px] ${loading
                ? 'bg-slate-400 cursor-not-allowed'
                : 'bg-[#E88C9A] hover:bg-[#D97A88] hover:shadow-md active:scale-[0.98]'
                }`}>
              {loading ? (
                <span className="flex items-center gap-3">
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing Health Data...
                </span>
              ) : 'Submit Clinical Assessment'}
            </button>
            <p className="text-center mt-4 text-xs text-slate-400">
              Your health data is encrypted and securely processed.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Questionnaire;
