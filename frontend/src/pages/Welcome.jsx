import { useNavigate } from 'react-router-dom';

const Welcome = () => {
  const navigate = useNavigate();

  const symptoms = [
    { text: 'Irregular menstrual periods', icon: '📅' },
    { text: 'Excess facial and body hair', icon: '🪒' },
    { text: 'Severe cystic acne & hair loss', icon: '💆' },
    { text: 'Enlarged ovaries with follicles', icon: '🔬' },
    { text: 'Unexplained weight gain', icon: '⚖️' },
    { text: 'Darkening of skin patches', icon: '🩺' },
  ];

  const stats = [
    { value: '1 in 10', label: 'Women affected globally', color: 'from-indigo-600 to-violet-600' },
    { value: '70%', label: 'Cases remain undiagnosed', color: 'from-amber-500 to-orange-500' },
    { value: '50%', label: 'Develop Pre-Diabetes or Diabetes before 40', color: 'from-rose-500 to-pink-500' },
  ];

  return (
    <div className="min-h-screen bg-[#FFF8F6] text-[#4A4A4A] font-sans selection:bg-rose-100 selection:text-rose-900">

      {/* Navbar / Header (Simple) */}
      <header className="w-full bg-[#FFF8F6]/80 backdrop-blur-md border-b border-rose-50 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#E88C9A] rounded-xl flex items-center justify-center text-white font-bold shadow-sm text-lg">S</div>
            <span className="text-xl font-bold text-[#5C3A4D] tracking-tight">Saheli</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/login')} className="text-sm font-bold text-[#4A4A4A] hover:text-[#E88C9A] transition-colors">
              Log in
            </button>
            <button onClick={() => navigate('/register')} className="text-sm font-bold bg-[#E88C9A] text-white px-5 py-2.5 rounded-2xl hover:bg-[#D97A88] transition-all shadow-sm">
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-24 pb-32 overflow-hidden bg-[#FFF8F6]">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#E88C9A]/10 rounded-full blur-[100px] -z-10 pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6 text-center animate-slide-up">
          {/* Trust Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-rose-100 bg-white text-[#E88C9A] text-sm font-bold shadow-sm mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E88C9A]"></span>
            </span>
            Medically-based PCOS Intelligence
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-extrabold text-[#5C3A4D] tracking-tight mb-8 max-w-4xl mx-auto leading-[1.1]">
            Take control of your PCOS with <span className="text-[#E88C9A]">Smart Care.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-[#4A4A4A] mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
            Your intelligent companion for PCOS management. AI-powered risk predictions, personalized dietary plans, and 24/7 symptom tracking—all in one clinical-grade platform.
          </p>

          {/* CTAs Removed */}


          {/* Social Proof Removed - Moved to bottom */}

        </div>
      </section>

      {/* WHAT IS PCOS SECTION (Moved from Awareness) */}
      <section className="py-24 bg-white border-y border-rose-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-block bg-rose-50 border border-rose-100 text-[#E88C9A] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
              Clinical Context
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#5C3A4D] mb-6 tracking-tight">What is PCOS?</h2>
            <p className="text-lg text-[#4A4A4A] max-w-3xl mx-auto leading-relaxed font-medium">
              Polycystic Ovary Syndrome (PCOS) is a common hormonal disorder among women of reproductive age. It affects how a woman's ovaries work, often leading to irregular periods, high levels of masculine hormones (androgens), and small fluid collections (follicles) in the ovaries.
            </p>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
            {stats.map(stat => (
              <div key={stat.label} className="bg-white p-8 rounded-3xl border border-rose-50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-center hover:border-rose-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all">
                <p className={`text-5xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-3`}>{stat.value}</p>
                <p className="text-sm text-[#5C3A4D] font-bold uppercase tracking-wide">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Symptoms Grid */}
          <div className="bg-[#FFF8F6] rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-rose-100 text-[#4A4A4A]">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-12 lg:p-16 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-rose-100">
                <div className="w-12 h-12 bg-rose-100 text-[#E88C9A] rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-sm">⚠️</div>
                <h3 className="text-3xl font-extrabold mb-4 tracking-tight text-[#5C3A4D]">Recognize the Symptoms</h3>
                <p className="text-[#4A4A4A]/80 font-medium text-lg leading-relaxed mb-8">
                  PCOS manifests differently in everyone. While the exact cause is unknown, early diagnosis and targeted lifestyle adjustments can significantly reduce the risk of long-term complications.
                </p>
                <button type="button" onClick={(e) => { e.preventDefault(); navigate('/awareness'); }} className="self-start text-[#E88C9A] font-bold hover:text-[#D97A88] transition-colors flex items-center gap-2">
                  Learn about Prevention & Checkups <span aria-hidden="true">&rarr;</span>
                </button>
              </div>
              <div className="p-8 lg:p-16 bg-white">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {symptoms.map(s => (
                    <div key={s.text} className="flex items-start gap-4 p-4 rounded-2xl bg-[#FFF8F6] border border-rose-50 shadow-sm transition-all hover:shadow-md">
                      <span className="text-2xl flex-shrink-0 bg-white p-2 rounded-xl border border-rose-100 shadow-sm">{s.icon}</span>
                      <span className="text-[#5C3A4D] text-sm font-bold leading-snug pt-1">{s.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER CTA */}
      <section className="py-24 bg-[#FFF8F6] text-[#4A4A4A] border-t border-rose-50 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-8 tracking-tight text-[#5C3A4D]">Ready to sync with your health?</h2>
          <p className="text-lg text-[#4A4A4A]/80 font-medium mb-10 max-w-2xl mx-auto">Join half a million women who have already transformed their approach to PCOS management.</p>
          <button
            onClick={() => navigate('/register')}
            className="px-10 py-5 bg-[#E88C9A] hover:bg-[#D97A88] text-white rounded-2xl text-lg font-bold shadow-sm hover:shadow-md transition-all mb-16">
            Get Started for Free
          </button>

          {/* Social Proof - Moved here */}
          <div className="pt-16 border-t border-slate-200/60 max-w-3xl mx-auto">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-8">Trusted by 500k+ women globally</p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-40 grayscale transition-opacity hover:opacity-100 duration-500">
              <div className="text-xl font-bold font-serif italic text-slate-900">HealthTech</div>
              <div className="text-xl font-bold tracking-[0.3em] text-slate-900 border-x px-4 border-slate-200">CLINICAL</div>
              <div className="text-xl font-bold items-center flex gap-1 text-slate-900 underline underline-offset-4 decoration-rose-200">Pulse</div>
              <div className="text-xl font-bold font-mono text-slate-900">/WOMEN</div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Welcome;
