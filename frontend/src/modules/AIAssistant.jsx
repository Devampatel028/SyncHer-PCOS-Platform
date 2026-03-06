import { useState, useEffect, useRef } from 'react';
import { apiCall } from '../services/api';

const AIAssistant = () => {
  const [messages, setMessages] = useState([{ role: 'assistant', text: "Hello! I'm your Saheli AI Assistant. How can I assist with your clinical PCOS protocol today?" }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);
    try {
      const data = await apiCall('/chatbot', 'POST', { message: userMsg });
      setMessages(prev => [...prev, { role: 'assistant', text: data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', text: "System anomaly detected. Unable to reach AI server." }]);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    { label: 'Diet Protocols', q: 'What nutritional protocols are best for my PCOS?', icon: '🥗' },
    { label: 'Mobility', q: 'Recommend optimal mobility workouts.', icon: '🧘' },
    { label: 'Symptom Diagnostics', q: 'How to manage specific PCOS symptoms?', icon: '📋' },
    { label: 'Cortisol Optimization', q: 'How does stress affect my hormones?', icon: '🧠' },
  ];

  return (
    <div className="space-y-6 animate-fade-in font-sans h-[calc(100vh-140px)] flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-5 flex-shrink-0">
        <div className="w-14 h-14 bg-white border border-rose-50 rounded-2xl flex items-center justify-center text-2xl shadow-sm text-[#E88C9A]">🤖</div>
        <div>
          <h1 className="text-3xl font-extrabold text-[#5C3A4D] tracking-tight">Clinical Intelligence</h1>
          <p className="text-sm text-[#4A4A4A] font-medium">Real-time dynamic health protocol consultant</p>
        </div>
      </div>

      {/* Chat Interface Container */}
      <div className="bg-white rounded-[3xl] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-rose-50 overflow-hidden flex flex-col flex-1 relative">

        {/* Quick Actions (Pinned to top inside container for clean SaaS look) */}
        <div className="bg-[#FFF8F6] border-b border-rose-50 p-4 overflow-x-auto flex gap-3 flex-shrink-0 custom-scrollbar">
          {quickActions.map(qa => (
            <button key={qa.label} onClick={() => { setInput(qa.q); }}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-rose-100 rounded-xl text-xs font-bold text-[#4A4A4A] hover:bg-[#FFF8F6] hover:border-[#E88C9A]/40 hover:text-[#5C3A4D] transition-colors shadow-sm whitespace-nowrap">
              <span className="text-base">{qa.icon}</span>{qa.label}
            </button>
          ))}
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white custom-scrollbar">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-5 rounded-[2xl] text-sm md:text-base leading-relaxed font-bold shadow-sm ${msg.role === 'user'
                ? 'bg-gradient-to-r from-[#D97A88] to-[#E88C9A] text-white rounded-tr-none border border-rose-100'
                : 'bg-[#FFF8F6] border border-rose-50 text-[#4A4A4A] rounded-tl-none'
                }`}>
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-[#FFF8F6] border border-rose-50 px-5 py-4 rounded-2xl rounded-tl-none text-[#E88C9A] text-sm font-bold flex items-center gap-3 shadow-sm">
                <span className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 bg-[#E88C9A] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2.5 h-2.5 bg-[#E88C9A] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2.5 h-2.5 bg-[#E88C9A] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </span>
                Processing AI Matrix...
              </div>
            </div>
          )}
          <div ref={chatEndRef} className="h-4" />
        </div>

        {/* Input Field */}
        <div className="p-4 bg-white border-t border-rose-50 flex-shrink-0">
          <form onSubmit={handleSend} className="relative flex items-center w-full bg-[#FFF8F6] border border-rose-100 rounded-2xl shadow-sm focus-within:ring-2 focus-within:ring-[#E88C9A]/30 focus-within:border-[#E88C9A] transition-all">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Query clinical data or request protocol adjustments..."
              className="flex-1 px-6 py-5 bg-transparent focus:outline-none text-[#5C3A4D] placeholder-[#5C3A4D]/40 font-bold"
            />
            <div className="pr-3">
              <button type="submit" disabled={loading}
                className="bg-[#E88C9A] text-white p-3.5 rounded-xl font-bold hover:bg-[#D97A88] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-sm">
                <svg className="w-5 h-5 translate-x-[1px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </form>
          <div className="text-center mt-3">
            <span className="text-[10px] uppercase tracking-widest text-[#E88C9A] font-bold">Secure AI Connection Established</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
