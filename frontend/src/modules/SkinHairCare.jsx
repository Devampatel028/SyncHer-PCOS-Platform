import { useEffect, useState } from 'react';
import { apiCall } from '../services/api';

const SkinHairCare = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Skin Analysis states
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [uploadError, setUploadError] = useState(null);
  const [activeTab, setActiveTab] = useState('analysis'); // 'analysis' or 'history'
  
  // Camera states
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [stream, setStream] = useState(null);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      setIsCameraOpen(true);
      setPreviewUrl(null);
      setSelectedFile(null);
      setUploadError(null);
    } catch (err) {
      setUploadError("Could not access camera. Please check permissions.");
      console.error(err);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraOpen(false);
  };

  const capturePhoto = () => {
    const video = document.getElementById('camera-video');
    if (!video) return;
    
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], "capture.jpg", { type: "image/jpeg" });
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
        stopCamera();
      }
    }, 'image/jpeg');
  };

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await apiCall('/opencv/my-analyses', 'GET');
        setHistory(data);
        if (data.length > 0) setAnalysisResult(data[0]);
      } catch (err) {
        console.error('Failed to fetch history:', err);
      }
    };
    fetchHistory();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      stopCamera();
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setUploadError(null);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;
    setAnalyzing(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);

      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/opencv/analyze-skin', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Analysis failed');

      setAnalysisResult(data.analysis);
      setHistory(prev => [data.analysis, ...prev].slice(0, 10)); // Keep up to 10
      setPreviewUrl(null);
      setSelectedFile(null);
      setIsCameraOpen(false);
      // Stay on analysis tab to show current result
    } catch (err) {
      setUploadError(err.message);
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const data = await apiCall('/ai-report/latest', 'GET');
        setReport(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, []);

  if (loading) return (
    <div className="flex flex-col gap-6 animate-pulse p-4">
      <div className="h-24 bg-slate-200 rounded-2xl" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => <div key={i} className="h-32 bg-slate-200 rounded-2xl" />)}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => <div key={i} className="h-32 bg-slate-200 rounded-2xl" />)}
      </div>
    </div>
  );

  const skin = report?.skinCareModule || report?.skinHairPlan;

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      {/* Header */}
      <div className="flex items-center gap-5">
        <div className="w-14 h-14 bg-white border border-rose-100 rounded-2xl flex items-center justify-center text-2xl text-[#E88C9A] shadow-sm">✨</div>
        <div>
          <h1 className="text-3xl font-extrabold text-[#5C3A4D] tracking-tight">Dermatological Protocol</h1>
          <p className="text-sm text-[#4A4A4A] font-bold">AI-tailored PCOS beauty & wellness regimens</p>
        </div>
      </div>

      {/* AI Skin Analysis Section with Tabs */}
      <div className="bg-white rounded-[3xl] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-rose-50 p-8 overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 border-b border-rose-50 pb-6 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FFF8F6] border border-rose-100 rounded-xl flex items-center justify-center text-lg text-[#E88C9A]">🔍</div>
            <h3 className="text-xl font-extrabold text-[#5C3A4D] tracking-tight">AI Skin Analysis</h3>
          </div>
          
          {/* TAB OPTIONS */}
          <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-rose-100/50 self-start md:self-auto">
            <button 
              onClick={() => setActiveTab('analysis')}
              className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${activeTab === 'analysis' ? 'bg-white text-[#E88C9A] shadow-md shadow-rose-100' : 'text-[#5C3A4D]/50 hover:text-[#5C3A4D]'}`}
            >
              New Analysis
            </button>
            <button 
              onClick={() => { setActiveTab('history'); stopCamera(); }}
              className={`px-6 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${activeTab === 'history' ? 'bg-white text-[#E88C9A] shadow-md shadow-rose-100' : 'text-[#5C3A4D]/50 hover:text-[#5C3A4D]'}`}
            >
              Scan History
              {history.length > 0 && <span className="bg-[#E88C9A] text-white px-1.5 py-0.5 rounded-md text-[8px]">{history.length}</span>}
            </button>
          </div>
        </div>

        {activeTab === 'analysis' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-fade-in">
            {/* Left: Upload/Analyze/Camera */}
            <div className="space-y-6">
              <div className="relative group">
                {isCameraOpen ? (
                  <div className="relative rounded-3xl overflow-hidden aspect-square md:aspect-video bg-black border-2 border-rose-200 shadow-inner">
                    <video 
                      id="camera-video"
                      autoPlay 
                      playsInline 
                      ref={video => { if (video && stream) video.srcObject = stream; }}
                      className="w-full h-full object-cover scale-x-[-1]"
                    />
                    <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4">
                      <button 
                        onClick={capturePhoto}
                        className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-[#E88C9A] shadow-lg border-2 border-[#E88C9A] hover:scale-110 transition-transform text-2xl"
                        title="Capture Photo"
                      >
                        📸
                      </button>
                      <button 
                        onClick={stopCamera}
                        className="w-14 h-14 bg-rose-50 rounded-full flex items-center justify-center text-rose-600 shadow-lg border-2 border-rose-100 hover:scale-110 transition-transform text-xl"
                        title="Cancel"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ) : previewUrl ? (
                  <div className="relative rounded-3xl overflow-hidden aspect-square md:aspect-video bg-slate-100 border-2 border-dashed border-rose-200 shadow-inner">
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                    <button 
                      onClick={() => { setPreviewUrl(null); setSelectedFile(null); }}
                      className="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-rose-600 hover:bg-white transition-all shadow-lg text-lg"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label className="flex flex-col items-center justify-center aspect-square bg-[#FFF8F6] border-2 border-dashed border-rose-200 rounded-[2.5rem] cursor-pointer hover:bg-rose-50/50 transition-all group overflow-hidden">
                      <div className="text-center p-4">
                        <div className="w-14 h-14 bg-white border border-rose-100 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-3 shadow-sm group-hover:scale-110 transition-transform">�</div>
                        <p className="text-[#5C3A4D] font-black text-base mb-1">Upload Photo</p>
                        <p className="text-[#4A4A4A] text-[10px] font-medium italic">Select from gallery</p>
                      </div>
                      <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                    </label>

                    <button 
                      onClick={startCamera}
                      className="flex flex-col items-center justify-center aspect-square bg-white border-2 border-dashed border-rose-200 rounded-[2.5rem] cursor-pointer hover:bg-rose-50/50 transition-all group"
                    >
                      <div className="w-14 h-14 bg-rose-50 border border-rose-100 rounded-2xl flex items-center justify-center text-3xl mb-3 group-hover:scale-110 transition-transform">📸</div>
                      <p className="text-[#5C3A4D] font-black text-base mb-1">Live Capture</p>
                      <p className="text-[#4A4A4A] text-[10px] font-medium italic">Use site camera</p>
                    </button>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={handleAnalyze}
                  disabled={!selectedFile || analyzing}
                  className={`w-full py-4 rounded-2xl font-black text-white shadow-lg transition-all active:scale-95 flex items-center justify-center gap-3 ${
                    !selectedFile || analyzing ? 'bg-slate-300 cursor-not-allowed' : 'bg-[#E88C9A] hover:bg-[#D97A88] shadow-rose-200'
                  }`}
                >
                  {analyzing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Analyzing with CV...
                    </>
                  ) : (
                    <>✨ Start AI Scan</>
                  )}
                </button>
                {uploadError && <p className="text-rose-500 text-xs font-bold text-center">⚠️ {uploadError}</p>}
              </div>
            </div>

            {/* Right: Results Display */}
            <div className="space-y-8">
              {analysisResult ? (
                <div className="space-y-6 animate-fade-in">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#FFF8F6] p-5 rounded-3xl border border-rose-50">
                      <p className="text-[10px] font-black text-[#5C3A4D]/50 uppercase tracking-[0.2em] mb-2">Severity Level</p>
                      <p className={`text-2xl font-black ${
                        analysisResult.acneLevel === 'Low' ? 'text-emerald-600' :
                        analysisResult.acneLevel === 'Moderate' ? 'text-amber-600' :
                        'text-rose-600'
                      }`}>{analysisResult.acneLevel}</p>
                    </div>
                    <div className="bg-[#FFF8F6] p-5 rounded-3xl border border-rose-50">
                      <p className="text-[10px] font-black text-[#5C3A4D]/50 uppercase tracking-[0.2em] mb-2">Spots Detected</p>
                      <p className="text-2xl font-black text-[#5C3A4D]">{analysisResult.detectedSpots}</p>
                    </div>
                  </div>

                  <div className="bg-white border border-rose-100 rounded-[2.5rem] p-6 shadow-sm">
                    <h4 className="text-xs font-extrabold text-[#5C3A4D] uppercase tracking-widest mb-4 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[#E88C9A] rounded-full"></span>
                      Detected In Zones
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {analysisResult.affectedAreas?.map((area, idx) => (
                        <span key={idx} className="px-4 py-2 bg-rose-50 text-[#E88C9A] text-xs font-bold rounded-xl border border-rose-100 italic">
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>

                  {analysisResult.doctorNotes && (
                    <div className="bg-indigo-50/50 border border-indigo-100 rounded-[2.5rem] p-6 shadow-sm">
                      <h4 className="text-xs font-extrabold text-indigo-700 uppercase tracking-widest mb-2 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                        Doctor's Feedback
                      </h4>
                      <p className="text-sm text-indigo-900/80 font-medium leading-relaxed italic">"{analysisResult.doctorNotes}"</p>
                    </div>
                  )}

                  <div className="text-center pt-4 border-t border-rose-50">
                    <p className="text-[10px] text-[#4A4A4A]/40 font-bold uppercase tracking-widest">
                      Displaying scan from {new Date(analysisResult.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-slate-50/50 rounded-[2.5rem] border border-dashed border-slate-200 min-h-[300px]">
                  <div className="text-4xl mb-4 opacity-30 animate-bounce">📸</div>
                  <p className="text-[#5C3A4D] font-bold">Ready for Analysis</p>
                  <p className="text-[#4A4A4A] text-xs font-medium max-w-[15rem] mt-1 mx-auto">Upload or capture a photo to generate your personalized PCOS skin report.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* SCAN HISTORY TAB */
          <div className="animate-fade-in">
            {history.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {history.map((item, i) => (
                  <div 
                    key={i} 
                    onClick={() => { setAnalysisResult(item); setActiveTab('analysis'); }}
                    className="group bg-white rounded-[2rem] border border-rose-50 overflow-hidden hover:border-[#E88C9A] hover:shadow-xl hover:shadow-rose-100/50 transition-all cursor-pointer"
                  >
                    <div className="aspect-video bg-slate-100 relative overflow-hidden">
                      <img src={`http://localhost:5000${item.imageUrl}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Scan" />
                      <div className="absolute top-4 right-4">
                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-lg ${
                          item.acneLevel === 'Low' ? 'bg-emerald-500 text-white border-emerald-400' :
                          item.acneLevel === 'Moderate' ? 'bg-amber-500 text-white border-amber-400' :
                          'bg-rose-500 text-white border-rose-400'
                        }`}>
                          {item.acneLevel}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-xs font-black text-[#5C3A4D]">{new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                        <p className="text-xs font-bold text-[#E88C9A]">{item.detectedSpots} Spots</p>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {item.affectedAreas?.slice(0, 3).map((a, idx) => (
                          <span key={idx} className="text-[8px] bg-rose-50 text-[#E88C9A] px-2 py-1 rounded-md font-black uppercase tracking-tighter">{a}</span>
                        ))}
                        {(item.affectedAreas?.length || 0) > 3 && <span className="text-[8px] text-[#4A4A4A]/50 font-bold">+{item.affectedAreas.length - 3} more</span>}
                      </div>
                      {item.doctorNotes && (
                        <div className="mt-4 pt-3 border-t border-rose-50 flex items-center gap-2">
                          <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
                          <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-widest">Doctor reviewed</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-24 text-center bg-slate-50/30 rounded-[3rem] border-2 border-dashed border-rose-100/50">
                <div className="w-24 h-24 bg-white border border-rose-100 rounded-[2.5rem] flex items-center justify-center text-5xl mx-auto mb-8 shadow-sm opacity-40 grayscale">📜</div>
                <h4 className="text-xl font-black text-[#5C3A4D] mb-3">Your Gallery is Empty</h4>
                <p className="text-sm text-[#4A4A4A] font-medium max-w-xs mx-auto leading-relaxed">Completed analyses will be archived here for your longitudinal progress tracking.</p>
                <button 
                  onClick={() => setActiveTab('analysis')}
                  className="mt-8 px-8 py-3 bg-[#E88C9A] text-white text-xs font-black uppercase tracking-[0.2em] rounded-2xl shadow-lg shadow-rose-100 hover:scale-105 transition-transform"
                >
                  Start First Scan
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {!skin ? (
        <div className="flex flex-col items-center justify-center py-24 text-center bg-white border border-rose-50 rounded-[3xl] shadow-[0_8px_30px_rgb(0,0,0,0.04)] mt-8">
          <div className="w-20 h-20 bg-[#FFF8F6] border border-rose-100 rounded-2xl flex items-center justify-center text-4xl mb-6 text-[#E88C9A] shadow-sm">✨</div>
          <h3 className="text-xl font-bold text-[#5C3A4D] mb-2">Clinical Protocol Pending</h3>
          <p className="text-sm text-[#4A4A4A] font-medium max-w-sm">Complete your PCOS clinical assessment to generate personalized medical insights below.</p>
        </div>
      ) : (
        <div className="space-y-8 animate-fade-in">
          {/* Today's Focus */}
          <div className="bg-gradient-to-r from-[#E88C9A] to-[#D97A88] border border-rose-200 rounded-[3xl] p-8 text-white relative flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_8px_30px_rgb(232,140,154,0.3)]">
            <div className="relative z-10 flex-1">
              <p className="text-rose-50 text-xs font-bold uppercase tracking-widest mb-2">📌 Daily Regimen Focus</p>
              <p className="text-xl md:text-2xl font-black leading-tight drop-shadow-sm">{skin.todayFocus}</p>
            </div>
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-3xl border border-white/30 shadow-sm flex-shrink-0">
              💅
            </div>
          </div>

          {/* Skin Care Tips */}
          <div className="bg-white rounded-[3xl] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-rose-50 p-8">
            <div className="flex items-center gap-3 mb-6 border-b border-rose-50 pb-4">
              <div className="w-10 h-10 bg-[#FFF8F6] border border-rose-100 rounded-xl flex items-center justify-center text-lg text-[#E88C9A]">🌸</div>
              <h3 className="text-xl font-extrabold text-[#5C3A4D] tracking-tight">Epidermal Clarity Matrix</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {skin.skinTips?.map((tip, i) => (
                <div key={i} className="flex items-start gap-4 p-5 bg-[#FFF8F6] rounded-3xl border border-rose-50 hover:border-[#E88C9A]/30 transition-colors">
                  <span className="text-3xl bg-white border border-rose-100 p-3 rounded-2xl flex-shrink-0 shadow-sm">{tip.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center flex-wrap gap-2 mb-2 w-full">
                      <h4 className="font-black text-[#5C3A4D] truncate flex-1">{tip.title}</h4>
                      <span className={`px-3 py-1.5 rounded-lg text-[10px] uppercase font-bold tracking-widest bg-white text-[#E88C9A] border border-rose-100 shadow-sm`}>{tip.tag}</span>
                    </div>
                    <p className="text-sm text-[#4A4A4A] leading-relaxed font-bold">{tip.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hair Care Tips */}
          <div className="bg-white rounded-[3xl] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-rose-50 p-8">
            <div className="flex items-center gap-3 mb-6 border-b border-rose-50 pb-4">
              <div className="w-10 h-10 bg-[#FFF8F6] border border-rose-100 rounded-xl flex items-center justify-center text-lg text-[#E88C9A]">💇</div>
              <h3 className="text-xl font-extrabold text-[#5C3A4D] tracking-tight">Follicle Health Protocol</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {skin.hairTips?.map((tip, i) => (
                <div key={i} className="flex items-start gap-4 p-5 bg-[#FFF8F6] rounded-3xl border border-rose-50 hover:border-[#E88C9A]/30 transition-colors">
                  <span className="text-3xl bg-white border border-rose-100 p-3 rounded-2xl flex-shrink-0 shadow-sm">{tip.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center flex-wrap gap-2 mb-2 w-full">
                      <h4 className="font-black text-[#5C3A4D] truncate flex-1">{tip.title}</h4>
                      <span className={`px-3 py-1.5 rounded-lg text-[10px] uppercase font-bold tracking-widest bg-white text-[#E88C9A] border border-rose-100 shadow-sm`}>{tip.tag}</span>
                    </div>
                    <p className="text-sm text-[#4A4A4A] leading-relaxed font-bold">{tip.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Insight */}
          {skin.aiInsight && (
            <div className="bg-gradient-to-r from-[#C8B6E2]/20 to-[#E88C9A]/10 border border-rose-100 rounded-[3xl] p-8 text-[#5C3A4D] relative flex flex-col md:flex-row items-center gap-6 shadow-sm mt-6">
              <div className="w-16 h-16 bg-white border border-rose-100 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 shadow-sm">
                🤖
              </div>
              <div className="flex-1">
                <h3 className="text-xs font-bold text-[#E88C9A] uppercase tracking-widest mb-2">AI Clinical Insight</h3>
                <p className="text-lg font-bold text-[#5C3A4D] leading-relaxed italic drop-shadow-sm">"{skin.aiInsight}"</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SkinHairCare;
