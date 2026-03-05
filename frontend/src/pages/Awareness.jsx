import { useNavigate } from 'react-router-dom';

const Awareness = () => {
  const navigate = useNavigate();

  const preventionSteps = [
    { title: 'Routine Medical Checkups', desc: 'Annual gynecological visits, pelvic ultrasounds, and complete hormonal blood panels.', icon: '🩺', color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { title: 'Targeted Nutrition', desc: 'Focusing on low-glycemic foods, prioritizing protein, and managing insulin spikes.', icon: '🥗', color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { title: 'Cortisol Management', desc: 'Incorporating daily stress-reduction protocols like breathwork and structured sleep hygiene.', icon: '🧘', color: 'text-violet-600', bg: 'bg-violet-50' },
    { title: 'Consistent Mobility', desc: 'Combining resistance training with low-intensity steady state (LISS) cardio.', icon: '🏃‍♀️', color: 'text-rose-600', bg: 'bg-rose-50' },
  ];

  return (
    <div className="min-h-screen bg-[#FFF8F6] text-[#4A4A4A] font-sans">
      {/* Header */}
      <header className="w-full bg-[#FFF8F6]/80 backdrop-blur-md border-b border-rose-50 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-8 h-8 bg-[#E88C9A] rounded-xl flex items-center justify-center text-white font-bold shadow-sm text-lg">S</div>
            <span className="text-xl font-bold text-[#5C3A4D] tracking-tight">Saheli</span>
          </div>
          <button onClick={() => navigate('/login')} className="text-sm font-bold text-[#4A4A4A] hover:text-[#E88C9A] transition-colors">
            Log in
          </button>
        </div>
      </header>

      {/* Hero Content for Awareness */}
      <section className="pt-20 pb-24 text-center px-6 bg-[#FFF8F6]">
        <div className="inline-block bg-[#8FBF9F]/10 border border-[#8FBF9F]/20 text-[#8FBF9F] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
          Checkups & Prevention
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold text-[#5C3A4D] mb-6 tracking-tight max-w-4xl mx-auto leading-tight">
          Proactive management changes everything.
        </h1>
        <p className="text-lg md:text-xl text-[#4A4A4A] max-w-2xl mx-auto leading-relaxed font-medium">
          While PCOS has no strict "cure", its symptoms can be highly managed or even reversed through rigorous tracking, clinical checkups, and smart lifestyle adjustments.
        </p>
      </section>

      {/* Checkup & Prevention Focus */}
      <section className="py-20 bg-white border-y border-rose-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-extrabold text-[#5C3A4D] mb-6 tracking-tight">The Diagnostic & Preventative Clinical Pipeline</h2>
              <p className="text-[#4A4A4A] text-lg leading-relaxed mb-10 font-medium">
                A definitive clinical checkup involves evaluating your androgen levels, assessing ovarian physiology via ultrasound, and mapping out a foundational preventative routine to avoid long-term risks like diabetes and cardiovascular stress.
              </p>
              <div className="space-y-6">
                {preventionSteps.map(step => (
                  <div key={step.title} className="flex gap-5 items-start p-5 rounded-3xl border border-rose-50 hover:border-rose-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-sm transition-all bg-[#FFF8F6]">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 bg-white border border-rose-50 shadow-sm`}>
                      {step.icon}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-[#5C3A4D] mb-1">{step.title}</h4>
                      <p className="text-[#4A4A4A] text-sm leading-relaxed font-medium">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-rose-100 to-[#E88C9A]/20 rounded-[3rem] transform rotate-3 scale-105 z-0"></div>
              <div className="relative z-10 bg-white border border-rose-100 rounded-[3rem] p-10 shadow-xl overflow-hidden">
                <div className="bg-[#FFF8F6] border border-rose-50 rounded-2xl p-6 mb-6">
                  <p className="text-xs uppercase tracking-widest font-bold text-[#E88C9A] mb-2">Clinical Note</p>
                  <p className="text-lg font-bold text-[#5C3A4D] leading-relaxed italic">"Early intervention and systematic data tracking are the most critical factors in mitigating PCOS symptom progression over a decade."</p>
                </div>
                <ul className="space-y-4">
                  <li className="flex items-center gap-3 text-sm font-bold text-[#4A4A4A]">
                    <span className="w-6 h-6 rounded-full bg-[#8FBF9F]/20 text-[#8FBF9F] flex items-center justify-center text-xs">✓</span> Fasting Glucose & Insulin Tests
                  </li>
                  <li className="flex items-center gap-3 text-sm font-bold text-[#4A4A4A]">
                    <span className="w-6 h-6 rounded-full bg-[#8FBF9F]/20 text-[#8FBF9F] flex items-center justify-center text-xs">✓</span> Thyroid Function (TSH)
                  </li>
                  <li className="flex items-center gap-3 text-sm font-bold text-[#4A4A4A]">
                    <span className="w-6 h-6 rounded-full bg-[#8FBF9F]/20 text-[#8FBF9F] flex items-center justify-center text-xs">✓</span> Lipid Profile Checks
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PLATFORM FEATURES (Moved from Welcome) */}
      <section className="py-24 bg-[#FFF8F6] border-b border-rose-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#5C3A4D] mb-6 tracking-tight">How Saheli facilitates prevention.</h2>
            <p className="text-lg text-[#4A4A4A] font-medium max-w-2xl mx-auto">Stop guessing. Get data-driven insights and actionable plans tailored to your exact hormonal profile using our clinical-grade SaaS platform.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {/* Feature 1 */}
            <div className="p-10 rounded-3xl bg-white border border-rose-50 hover:border-rose-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-md transition-all group">
              <div className="w-14 h-14 bg-rose-50 border border-rose-100 text-[#E88C9A] rounded-2xl flex items-center justify-center text-2xl mb-8 group-hover:bg-[#E88C9A] group-hover:text-white transition-colors shadow-sm">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-[#5C3A4D] mb-4 tracking-tight">AI Risk Detection</h3>
              <p className="text-[#4A4A4A] leading-relaxed font-medium">Advanced machine learning analyzes your symptoms to detect PCOS severity and risk factors with clinical precision.</p>
            </div>

            {/* Feature 2 */}
            <div className="p-10 rounded-3xl bg-white border border-rose-50 hover:border-rose-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-md transition-all group">
              <div className="w-14 h-14 bg-rose-50 border border-rose-100 text-[#8FBF9F] rounded-2xl flex items-center justify-center text-2xl mb-8 group-hover:bg-[#8FBF9F] group-hover:text-white transition-colors shadow-sm">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-[#5C3A4D] mb-4 tracking-tight">Personalized Protocols</h3>
              <p className="text-[#4A4A4A] leading-relaxed font-medium">Receive strictly tailored dietary recommendations, exercise routines, and stress management techniques matching your body.</p>
            </div>

            {/* Feature 3 */}
            <div className="p-10 rounded-3xl bg-white border border-rose-50 hover:border-rose-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-md transition-all group">
              <div className="w-14 h-14 bg-rose-50 border border-rose-100 text-[#C8B6E2] rounded-2xl flex items-center justify-center text-2xl mb-8 group-hover:bg-[#C8B6E2] group-hover:text-white transition-colors shadow-sm">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-[#5C3A4D] mb-4 tracking-tight">24/7 AI Assistant</h3>
              <p className="text-[#4A4A4A] leading-relaxed font-medium">Got a question at 2 AM? Your dedicated clinical chatbot is trained on extensive medical literature to help you instantly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-24 bg-white border-t border-rose-50 text-center px-6">
        <h2 className="text-3xl md:text-5xl font-extrabold mb-8 tracking-tight max-w-3xl mx-auto leading-tight text-[#5C3A4D]">Implement your prevention strategy today.</h2>
        <button
          onClick={() => navigate('/questionnaire')}
          className="bg-[#E88C9A] hover:bg-[#D97A88] text-white px-10 py-5 rounded-2xl text-lg font-bold shadow-sm transition-all active:scale-95"
        >
          Take the Free Assessment
        </button>
      </section>
    </div>
  );
};

export default Awareness;
