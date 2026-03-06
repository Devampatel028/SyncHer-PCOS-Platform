import { useState } from 'react';

const DoctorChat = () => {
  const [selectedPatient] = useState('Patient');
  const messages = [
    { role: 'patient', text: 'Hello Doctor, I had a query about my diet plan.', time: '10:30 AM' },
    { role: 'doctor', text: 'Hello! Sure, I\'d be happy to help. What would you like to know?', time: '10:32 AM' },
    { role: 'patient', text: 'Are there any foods I should avoid for PCOS management?', time: '10:35 AM' },
    { role: 'doctor', text: 'Yes, try to minimize refined carbs, sugary drinks, and processed foods. Focus on whole grains, lean proteins, and plenty of vegetables.', time: '10:38 AM' },
    { role: 'patient', text: 'Thank you! That\'s very helpful. I\'ll try to follow this.', time: '10:40 AM' },
    { role: 'doctor', text: 'You\'re welcome! Feel free to reach out if you have more questions. Stay healthy! 💚', time: '10:42 AM' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl p-8 bg-gradient-to-br from-[#C8B6E2] to-[#9B8EC4] text-white border border-violet-100 shadow-lg">
        <div className="relative z-10">
          <p className="text-violet-100 text-sm font-bold mb-2 tracking-widest uppercase">Communication</p>
          <h2 className="text-4xl font-black tracking-tight">Patient Chat</h2>
          <p className="text-violet-100 mt-2 font-medium">Static preview — messaging coming soon</p>
        </div>
      </div>

      {/* Chat Window */}
      <div className="bg-white rounded-3xl border border-rose-50 shadow-sm overflow-hidden">
        {/* Chat Header */}
        <div className="px-6 py-4 border-b border-rose-50 flex items-center gap-3 bg-[#FFF8F6]">
          <div className="w-10 h-10 bg-[#E88C9A] rounded-2xl flex items-center justify-center text-white font-bold shadow-sm">P</div>
          <div>
            <p className="font-bold text-[#5C3A4D]">{selectedPatient}</p>
            <p className="text-xs text-[#8FBF9F] font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-[#8FBF9F] rounded-full"></span> Online
            </p>
          </div>
        </div>

        {/* Messages */}
        <div className="p-6 space-y-4 min-h-[400px] max-h-[500px] overflow-y-auto bg-gradient-to-b from-slate-50/50 to-white">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'doctor' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                msg.role === 'doctor'
                  ? 'bg-gradient-to-r from-[#C8B6E2] to-[#B5A1D4] text-white rounded-br-md'
                  : 'bg-white border border-slate-100 text-[#4A4A4A] rounded-bl-md'
              }`}>
                <p>{msg.text}</p>
                <p className={`text-xs mt-2 ${msg.role === 'doctor' ? 'text-violet-200' : 'text-slate-400'}`}>{msg.time}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Input (disabled/static) */}
        <div className="p-4 border-t border-rose-50 flex gap-3 bg-white/90">
          <input type="text" placeholder="Type a message..." disabled
            className="flex-1 p-3 rounded-2xl border border-slate-200 bg-slate-50 text-sm text-slate-400 cursor-not-allowed" />
          <button disabled className="bg-[#C8B6E2] text-white px-6 rounded-2xl font-bold shadow-sm opacity-50 cursor-not-allowed text-sm">
            Send
          </button>
        </div>
      </div>

      {/* Coming Soon Notice */}
      <div className="bg-violet-50 border border-violet-100 p-4 rounded-2xl text-center">
        <p className="text-sm font-bold text-[#5C3A4D]">💬 Real-time messaging will be available in a future update</p>
      </div>
    </div>
  );
};

export default DoctorChat;
