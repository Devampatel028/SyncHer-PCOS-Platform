import { useState, useEffect, useRef } from "react";
import { apiCall } from "../services/api";

const FloatingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hi! I'm Saheli AI 💙 How can I help with your PCOS care today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recognitionError, setRecognitionError] = useState(null);
  const chatEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
        // Automatically send after a short delay to allow user to see the text
        setTimeout(() => {
          handleSendVoice(transcript);
        }, 800);
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech Recognition Error:", event.error);
        setRecognitionError(event.error === 'not-allowed' ? "Microphone access denied." : "Speech recognition failed.");
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const startListening = () => {
    setRecognitionError(null);
    if (!recognitionRef.current) {
      setRecognitionError("Speech recognition not supported in this browser.");
      return;
    }
    try {
      recognitionRef.current.start();
      setIsListening(true);
    } catch (err) {
      console.error(err);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const handleSendVoice = async (text) => {
    if (!text.trim() || loading) return;
    performChat(text);
  };

  const speakMessage = (text) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Text-to-speech is not supported in this browser.");
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const performChat = async (userMessage) => {
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

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    performChat(input);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Window */}
      {isOpen && (
        <div className="glass-card w-80 h-[480px] rounded-3xl shadow-2xl flex flex-col mb-4 overflow-hidden animate-scale-in border border-white/60">
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
                <div className="flex flex-col gap-1 max-w-[85%]">
                  <div className={`p-3 rounded-2xl text-sm leading-relaxed shadow-sm relative group ${
                    msg.role === "user"
                      ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-br-md"
                      : "bg-white border border-slate-100 text-slate-700 rounded-bl-md shadow"
                  }`}>
                    {msg.text}
                    {msg.role === "assistant" && (
                      <button 
                        onClick={() => speakMessage(msg.text)}
                        className="absolute -right-8 top-1 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 bg-white rounded-lg border border-slate-100 text-teal-600 hover:scale-110 active:scale-95 shadow-sm"
                        title="Listen"
                      >
                        🔊
                      </button>
                    )}
                  </div>
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
            {isListening && (
              <div className="flex justify-start animate-fade-in">
                <div className="bg-teal-50 border border-teal-100 p-3 rounded-2xl text-teal-600 text-xs font-bold flex items-center gap-2 shadow-sm rounded-bl-md">
                  <span className="w-2 h-2 bg-teal-500 rounded-full animate-ping" />
                  Listening...
                </div>
              </div>
            )}
            {recognitionError && (
              <div className="p-2 text-[10px] text-rose-500 font-bold bg-rose-50 rounded-lg text-center mx-4">
                ⚠️ {recognitionError} <button onClick={startListening} className="underline ml-2">Retry</button>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 border-t border-slate-100 bg-white/90 backdrop-blur-sm">
            <form onSubmit={handleSend} className="flex gap-2">
              <button 
                type="button"
                onClick={isListening ? stopListening : startListening}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                  isListening 
                  ? 'bg-rose-100 text-rose-600 animate-pulse border border-rose-200' 
                  : 'bg-slate-50 text-slate-500 border border-slate-200 hover:bg-teal-50 hover:text-teal-600 hover:border-teal-200'
                }`}
                title={isListening ? "Stop Listening" : "Start Voice Command"}
              >
                {isListening ? '⏹' : '🎤'}
              </button>
              <input type="text" value={input} onChange={e => setInput(e.target.value)}
                placeholder={isListening ? "Listening..." : "Ask about PCOS care..."}
                disabled={loading}
                className="flex-1 p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm text-slate-800 transition-all disabled:opacity-60" />
              <button type="submit" disabled={loading || !input.trim()}
                className="bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white w-10 h-10 rounded-xl font-bold shadow-md hover:from-violet-700 hover:to-fuchsia-700 transition-all disabled:opacity-50 flex items-center justify-center active:scale-95">
                {loading ? '...' : '↑'}
              </button>
            </form>
          </div>
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