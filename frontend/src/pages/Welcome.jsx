import { useNavigate } from 'react-router-dom';

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen aurora-bg relative overflow-hidden flex flex-col items-center justify-center p-6">
      {/* Floating orbs */}
      <div className="orb w-96 h-96 bg-teal-300/30 top-[-100px] left-[-100px]" style={{ animationDelay: '0s' }} />
      <div className="orb w-72 h-72 bg-purple-300/20 bottom-[-80px] right-[-80px]" style={{ animationDelay: '3s' }} />
      <div className="orb w-48 h-48 bg-emerald-300/25 top-1/2 right-1/4" style={{ animationDelay: '5s' }} />

      <div className="relative z-10 max-w-5xl w-full text-center">
        {/* Top badge */}
        <div className="animate-slide-up inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-5 py-2 rounded-full shadow-sm border border-violet-100 mb-8">
          <span className="w-2 h-2 bg-violet-500 rounded-full animate-pulse" />
          <span className="text-sm font-bold text-violet-700 tracking-wider uppercase">AI-Powered Women's Health</span>
        </div>

        {/* Hero headline */}
        <h1 className="animate-slide-up text-6xl md:text-8xl font-black mb-6 leading-none tracking-tight" style={{ animationDelay: '0.1s' }}>
          <span className="shimmer-text">SyncHer</span>
          <br />
          <span className="text-3xl md:text-5xl text-slate-700 font-semibold">Smart PCOS Care</span>
        </h1>

        <p className="animate-slide-up text-lg md:text-xl text-slate-500 mb-14 leading-relaxed max-w-2xl mx-auto" style={{ animationDelay: '0.2s' }}>
          Your intelligent companion for PCOS management. AI-powered predictions,
          personalized health guidance, and continuous support — all in one platform.
        </p>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-14">
          {[
            { icon: '🔬', title: 'AI Diagnosis', desc: 'Instant risk assessment from your health profile', color: 'from-violet-500 to-fuchsia-500', delay: '0.3s' },
            { icon: '❤️', title: 'Personalized Care', desc: 'Diet, exercise & wellness plans tailored for you', color: 'from-purple-500 to-violet-500', delay: '0.4s' },
            { icon: '🤖', title: '24/7 AI Support', desc: 'Always-on chatbot for your PCOS questions', color: 'from-amber-500 to-orange-500', delay: '0.5s' },
          ].map(card => (
            <div key={card.title}
              className="animate-slide-up glass-card p-8 rounded-3xl hover:shadow-2xl hover:-translate-y-3 transition-all duration-300 cursor-default group"
              style={{ animationDelay: card.delay }}>
              <div className={`w-16 h-16 bg-gradient-to-br ${card.color} rounded-2xl flex items-center justify-center text-3xl mb-5 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                {card.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">{card.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="animate-slide-up flex flex-col sm:flex-row items-center justify-center gap-4" style={{ animationDelay: '0.6s' }}>
          <button
            onClick={() => navigate('/login')}
            className="glow-btn bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white px-12 py-5 rounded-2xl text-xl font-bold shadow-xl hover:shadow-2xl hover:from-violet-700 hover:to-fuchsia-700 transition-all duration-300 active:scale-95">
            Start Your Journey →
          </button>
          <button
            onClick={() => navigate('/register')}
            className="glass-card px-12 py-5 rounded-2xl text-xl font-bold text-violet-700 hover:shadow-xl transition-all duration-300 active:scale-95">
            Create Account
          </button>
        </div>

        <p className="animate-fade-in mt-8 text-sm text-slate-400" style={{ animationDelay: '0.8s' }}>
          🔒 Private & secure · Trusted by thousands of women worldwide
        </p>
      </div>
    </div>
  );
};

export default Welcome;
