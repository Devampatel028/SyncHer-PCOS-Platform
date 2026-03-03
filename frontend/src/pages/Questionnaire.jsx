import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiCall } from '../services/api';

const Questionnaire = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));

  const [formData, setFormData] = useState({
    age: '', weight: '', height: '',
    mainMeal: 'Lunch', familyHistory: [],
    mealsPerDay: '3', dietPattern: 'Mixed',
    smoking: 'No', diagnosed: 'Not diagnosed',
    cycleLength: '28–31', symptoms: []
  });

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await apiCall('/assessment/submit', 'POST', formData);
      if (data.report) navigate('/prediction');
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const inputClasses = "w-full p-3.5 rounded-xl border border-slate-200 bg-gray-800 text-white caret-white focus:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all";
  const selectClasses = "w-full p-3.5 rounded-xl border border-slate-200 bg-gray-800 text-white appearance-none focus:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all";
  const optionClasses = "text-black bg-white";

  return (
    <div className="questionnaire-page min-h-screen bg-gradient-to-b from-teal-50 to-white py-12 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-block bg-violet-100 text-violet-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
            📋 Health Assessment
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-2">Tell Us About You</h2>
          <p className="text-slate-500">Answer these questions for your personalized PCOS analysis</p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex justify-between text-xs text-slate-400 font-bold uppercase mb-2">
            <span>Step 1 of 1</span>
            <span>Health Profile</span>
          </div>
          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full w-full" />
          </div>
        </div>

        <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl border border-slate-100">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Metrics */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center text-lg">📊</div>
                <h3 className="text-lg font-bold text-slate-800">Basic Metrics</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-2">Age</label>
                  <input type="number" name="age" required onChange={handleChange} className={inputClasses} placeholder="e.g. 25" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-2">Weight (kg)</label>
                  <input type="number" name="weight" required onChange={handleChange} className={inputClasses} placeholder="e.g. 58" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-2">Height (cm)</label>
                  <input type="number" name="height" required onChange={handleChange} className={inputClasses} placeholder="e.g. 162" />
                </div>
              </div>
            </div>

            {/* Meal Preference */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-lg">🍽️</div>
                <h3 className="text-lg font-bold text-slate-800">Meal Preference</h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {['Breakfast', 'Lunch', 'Dinner', 'Lunch & Dinner', 'Snacks'].map(meal => (
                  <label key={meal} className={`px-5 py-2.5 rounded-xl border-2 cursor-pointer transition-all duration-200 text-sm font-medium ${
                    formData.mainMeal === meal
                      ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white border-teal-600 shadow-md'
                      : 'border-slate-200 text-slate-600 hover:border-teal-300 hover:bg-violet-50'
                  }`}>
                    <input type="radio" name="mainMeal" value={meal} className="hidden" onChange={handleChange} checked={formData.mainMeal === meal} />
                    {meal}
                  </label>
                ))}
              </div>
            </div>

            {/* Family History */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center text-lg">👨‍👩‍👧</div>
                <h3 className="text-lg font-bold text-slate-800">Family History</h3>
              </div>
              <div className="flex flex-wrap gap-4">
                {['PCOS', 'Diabetes', 'CVD', 'Gestational Diabetes'].map(item => (
                  <label key={item} className="flex items-center gap-2.5 cursor-pointer bg-slate-50 px-4 py-2.5 rounded-xl hover:bg-violet-50 transition-colors">
                    <input type="checkbox" name="familyHistory" value={item} onChange={handleChange} className="w-5 h-5 accent-teal-600 rounded" />
                    <span className="text-sm font-medium text-slate-700">{item}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Lifestyle */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center text-lg">🏃</div>
                <h3 className="text-lg font-bold text-slate-800">Lifestyle</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-2">Meals Per Day</label>
                  <select name="mealsPerDay" onChange={handleChange} className={selectClasses}>
                    {[1, 2, 3, 4].map(n => <option key={n} value={n} className={optionClasses}>{n}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-2">Smoking</label>
                  <select name="smoking" onChange={handleChange} className={selectClasses}>
                    <option value="No" className={optionClasses}>No</option>
                    <option value="Yes" className={optionClasses}>Yes</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-2">Diet Pattern</label>
                  <select name="dietPattern" onChange={handleChange} className={selectClasses}>
                    {['Vegetarian', 'Non-Vegetarian', 'Vegan', 'Mixed', 'Keto', 'Gluten-Free'].map(d => (
                      <option key={d} value={d} className={optionClasses}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-2">PCOS Diagnosis Status</label>
                  <select name="diagnosed" onChange={handleChange} className={selectClasses}>
                    {['Not diagnosed', 'I think I have symptoms', 'Diagnosed with PCOS', 'Previously diagnosed'].map(d => (
                      <option key={d} value={d} className={optionClasses}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Menstrual Cycle */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center text-lg">📅</div>
                <h3 className="text-lg font-bold text-slate-800">Menstrual Cycle</h3>
              </div>
              <label className="block text-sm font-semibold text-slate-600 mb-2">Cycle Length (last 6 months)</label>
              <select name="cycleLength" onChange={handleChange} className={selectClasses}>
                {['20–24', '24–28', '28–31', '31–35', '>35', 'Highly Irregular'].map(val => (
                  <option key={val} value={val} className={optionClasses}>{val}</option>
                ))}
              </select>
            </div>

            {/* Symptoms */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center text-lg">🩺</div>
                <h3 className="text-lg font-bold text-slate-800">PCOS Symptoms</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {['Irregular menstrual periods', 'Excess facial/body hair', 'Acne', 'Male-pattern baldness', 'None'].map(symptom => (
                  <label key={symptom} className="flex items-center gap-2.5 cursor-pointer bg-slate-50 px-4 py-3 rounded-xl hover:bg-violet-50 transition-colors">
                    <input type="checkbox" name="symptoms" value={symptom} onChange={handleChange} className="w-5 h-5 accent-teal-600 rounded" />
                    <span className="text-sm font-medium text-slate-700">{symptom}</span>
                  </label>
                ))}
              </div>
            </div>

            <button type="submit" disabled={loading}
              className={`w-full py-5 rounded-2xl text-white font-bold text-lg shadow-xl transition-all duration-300 ${
                loading
                  ? 'bg-teal-400'
                  : 'bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 hover:shadow-2xl active:scale-[0.98]'
              }`}>
              {loading ? 'Analyzing with AI...' : 'Submit Assessment →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Questionnaire;
