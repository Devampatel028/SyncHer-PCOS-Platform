import { useState, useEffect, useRef } from 'react';
import { apiCall } from '../services/api';

const AIAssistant = () => {
  const [messages, setMessages] = useState([{ role: 'assistant', text: "Hello! I'm your SyncHer AI Assistant 💙 How can I help with your PCOS care today?" }]);
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
      setMessages(prev => [...prev, { role: 'assistant', text: "Sorry, I encountered an error. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    { label: 'Diet Tips', q: 'What should I eat for PCOS?', icon: '🥗' },
    { label: 'Exercise', q: 'Best exercises for PCOS?', icon: '🧘' },
    { label: 'Symptoms', q: 'How to manage PCOS symptoms?', icon: '💊' },
    { label: 'Mental Health', q: 'How does stress affect PCOS?', icon: '🍃' },
  ];

  return (
    <>
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center text-2xl shadow-md">🤖</div>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">SyncHer AI Assistant</h1>
          <p className="text-sm text-slate-400">Your personal PCOS care companion</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2 mb-4">
        {quickActions.map(qa => (
          <button key={qa.label} onClick={() => { setInput(qa.q); }}
            className="flex items-center gap-1.5 px-4 py-2 bg-white rounded-full border border-slate-200 text-xs font-bold text-slate-600 hover:bg-violet-50 hover:border-violet-200 hover:text-violet-700 transition-all duration-200 shadow-sm">
            <span>{qa.icon}</span>{qa.label}
          </button>
        ))}
      </div>

      {/* Chat Container */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col h-[62vh] border border-slate-100">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-slate-50/50 to-white">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-4 rounded-2xl shadow-sm text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-br-md'
                  : 'bg-white border border-slate-100 text-slate-700 rounded-bl-md'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-100 p-4 rounded-2xl text-slate-400 text-sm flex items-center gap-2 shadow-sm">
                <span className="flex gap-1">
                  <span className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </span>
                Thinking...
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-100 flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything about PCOS care..."
            className="flex-1 p-4 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm text-slate-800 transition-all"
          />
          <button type="submit" disabled={loading}
            className="bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white px-6 py-4 rounded-xl font-bold shadow-md hover:from-violet-700 hover:to-fuchsia-700 transition-all duration-300 disabled:opacity-50 active:scale-95">
            Send
          </button>
        </form>
      </div>
    </>
  );
};

export default AIAssistant;
