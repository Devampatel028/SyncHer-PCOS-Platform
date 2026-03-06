import { useState, useEffect, useRef } from "react";
import { apiCall } from "../services/api";

const FloatingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hi! I'm Saheli AI 💙 How can I help with your PCOS care today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    const userMessage = input;
    setMessages(prev => [...prev, { role: "user", text: userMessage }]);
    setInput("");
    setLoading(true);
    try {
      const res = await apiCall("/chatbot", "POST", { message: userMessage });
      setMessages(prev => [...prev, {
        role: "assistant",
        text: res.reply || "I couldn't respond right now. Please try again."
      }]);
    } catch (err) {
      console.error("CHATBOT ERROR:", err);
      setMessages(prev => [...prev, {
        role: "assistant",
        text: err.message?.includes('429')
          ? "⏳ I'm a bit busy right now. Please wait a moment and try again."
          : "⚠️ I'm temporarily offline. Please try again in a moment."
      }]);
    }
    setLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Window */}
      {isOpen && (
        <div className="glass-card w-80 h-[440px] rounded-3xl shadow-2xl flex flex-col mb-4 overflow-hidden animate-scale-in border border-white/60">
          {/* Header */}
          <div className="p-4 text-white flex justify-between items-center"
            style={{ background: 'linear-gradient(135deg, #0f766e, #14b8a6)' }}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center text-lg backdrop-blur-sm">🤖</div>
              <div>
                <span className="font-bold text-sm block">Saheli AI</span>
                <span className="text-xs text-violet-100 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" /> Always here to help
                </span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)}
              className="hover:rotate-90 transition-transform duration-300 w-8 h-8 flex items-center justify-center rounded-xl hover:bg-white/20 text-white font-bold">✕</button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-slate-50/80 to-white">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  msg.role === "user"
                    ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-br-md"
                    : "bg-white border border-slate-100 text-slate-700 rounded-bl-md shadow"
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start animate-fade-in">
                <div className="bg-white border border-slate-100 p-3 rounded-2xl text-slate-400 text-sm flex items-center gap-2 shadow-sm rounded-bl-md">
                  <span className="flex gap-1">
                    {[0, 150, 300].map(d => (
                      <span key={d} className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />
                    ))}
                  </span>
                  Thinking...
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-3 border-t border-slate-100 flex gap-2 bg-white/90 backdrop-blur-sm">
            <input type="text" value={input} onChange={e => setInput(e.target.value)}
              placeholder="Ask about PCOS care..."
              disabled={loading}
              className="flex-1 p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm text-slate-800 transition-all disabled:opacity-60" />
            <button type="submit" disabled={loading}
              className="bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white px-4 rounded-xl font-bold shadow-md hover:from-violet-700 hover:to-fuchsia-700 transition-all disabled:opacity-50 text-sm active:scale-95">
              {loading ? '...' : '↑'}
            </button>
          </form>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white w-14 h-14 rounded-2xl shadow-2xl flex items-center justify-center text-2xl active:scale-90 transition-all duration-300 hover:scale-110 glow-btn">
        {isOpen ? '✕' : '🤖'}
      </button>
    </div>
  );
};

export default FloatingChatbot;