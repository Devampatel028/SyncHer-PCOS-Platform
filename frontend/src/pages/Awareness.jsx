import { useNavigate } from 'react-router-dom';

const Awareness = () => {
  const navigate = useNavigate();

  const symptoms = [
    { text: 'Irregular menstrual periods', icon: '📅' },
    { text: 'Excess facial and body hair (hirsutism)', icon: '🪒' },
    { text: 'Severe acne and male-pattern baldness', icon: '💆' },
    { text: 'Ovaries might be enlarged with follicles', icon: '🔬' },
    { text: 'Weight gain or difficulty losing weight', icon: '⚖️' },
    { text: 'Darkening of skin (acanthosis nigricans)', icon: '🩺' },
  ];

  const stats = [
    { value: '1 in 10', label: 'Women affected globally', color: 'from-violet-500 to-fuchsia-500' },
    { value: '70%', label: 'Cases go undiagnosed', color: 'from-orange-500 to-amber-500' },
    { value: '50%', label: 'Risk of Type 2 Diabetes', color: 'from-red-500 to-pink-500' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white py-16 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <header className="text-center mb-16">
          <div className="inline-block bg-violet-100 text-violet-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
            📚 Education & Awareness
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 mb-4 leading-tight">
            Understanding <span className="bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">PCOS</span>
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto">Empowering you with knowledge for a healthier tomorrow.</p>
        </header>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {stats.map(stat => (
            <div key={stat.label} className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <p className={`text-4xl font-extrabold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}>{stat.value}</p>
              <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center text-xl">🧬</div>
              <h2 className="text-2xl font-bold text-slate-800">What is PCOS?</h2>
            </div>
            <p className="text-slate-600 leading-relaxed mb-4">
              PCOS is a common hormonal disorder among women of reproductive age. It affects how a woman's ovaries work, often leading to irregular periods,
              high levels of masculine hormones (androgens), and small collections of fluid (follicles) in the ovaries.
            </p>
            <p className="text-slate-600 leading-relaxed">
              While the exact cause is unknown, early diagnosis and treatment along with weight loss may reduce the risk of long-term complications
              such as type 2 diabetes and heart disease.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-xl">⚠️</div>
              <h2 className="text-2xl font-bold text-slate-800">Common Symptoms</h2>
            </div>
            <div className="space-y-3">
              {symptoms.map(s => (
                <div key={s.text} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-violet-50 transition-colors">
                  <span className="text-lg flex-shrink-0">{s.icon}</span>
                  <span className="text-slate-700 text-sm font-medium">{s.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-violet-700 to-fuchsia-700 p-12 rounded-3xl shadow-2xl text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10">
            <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-4">Why Early Prediction Matters</h3>
            <p className="text-violet-100 mb-10 max-w-2xl mx-auto text-lg leading-relaxed">
              Early awareness allows for lifestyle modifications that can reverse many symptoms and prevent future health issues.
              Understanding your body is the first step toward healing.
            </p>
            <button
              onClick={() => navigate('/questionnaire')}
              className="bg-white text-violet-700 px-10 py-4 rounded-2xl text-lg font-bold shadow-xl hover:shadow-2xl hover:bg-violet-50 transition-all duration-300 active:scale-95"
            >
              Take the Assessment →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Awareness;
