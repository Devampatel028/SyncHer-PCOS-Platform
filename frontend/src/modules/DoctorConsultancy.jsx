import { useState, useEffect } from 'react';
import { apiCall } from '../services/api';

const DoctorConsultancy = () => {
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingId, setBookingId] = useState(null);
  const [message, setMessage] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [docData, aptData] = await Promise.all([
          apiCall('/doctors/list', 'GET'),
          apiCall('/doctors/my-appointments', 'GET').catch(() => [])
        ]);
        setDoctors(docData);
        if (Array.isArray(aptData)) setAppointments(aptData);
      } catch (err) {
        console.error('Failed to load data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAppoint = async (doctorId) => {
    setBookingId(doctorId);
    setMessage('');
    try {
      const res = await apiCall('/doctors/appoint', 'POST', { doctorId });
      setMessage(res.message || 'Appointment booked!');
      // Refresh appointments
      const aptData = await apiCall('/doctors/my-appointments', 'GET').catch(() => []);
      if (Array.isArray(aptData)) setAppointments(aptData);
    } catch (err) {
      setMessage(err.message || 'Failed to book appointment');
    } finally {
      setTimeout(() => setBookingId(null), 1500);
    }
  };

  // Get the active appointment for a doctor
  const getAppointment = (doctorId) => {
    return appointments.find(a => 
      (a.doctorId?._id === doctorId || a.doctorId === doctorId) && 
      ['pending', 'confirmed'].includes(a.status)
    );
  };

  const specialtyColors = {
    Dermatologist: { bg: 'bg-pink-50', border: 'border-pink-200', text: 'text-pink-700', icon: '✨' },
    Nutritionist: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', icon: '🥗' },
    Physiotherapist: { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-700', icon: '🧘' },
    Gynecologist: { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700', icon: '🩺' },
    Endocrinologist: { bg: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-700', icon: '💊' },
  };

  const statusStyles = {
    pending: { label: 'Pending', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-400' },
    confirmed: { label: 'Confirmed', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-400' },
    completed: { label: 'Completed', bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-200', dot: 'bg-slate-400' },
    cancelled: { label: 'Cancelled', bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-200', dot: 'bg-rose-400' },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-rose-200 border-t-[#E88C9A] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#4A4A4A] font-medium">Loading doctors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl p-8 md:p-10 bg-gradient-to-br from-[#C8B6E2] to-[#9B8EC4] border border-violet-100 shadow-[0_8px_30px_rgb(200,182,226,0.3)] text-white">
        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
          <svg className="w-64 h-64 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2c-4.97 0-9 4.03-9 9v7c0 1.1.9 2 2 2h4v-8H5v-1c0-3.87 3.13-7 7-7s7 3.13 7 7v1h-4v8h4c1.1 0 2-.9 2-2v-7c0-4.97-4.03-9-9-9z"/></svg>
        </div>
        <div className="relative z-10">
          <p className="text-violet-100 text-sm font-bold mb-2 tracking-widest uppercase">Consultancy</p>
          <h2 className="text-4xl md:text-5xl font-black mb-3 tracking-tight drop-shadow-sm">Doctor Consultancy</h2>
          <p className="text-violet-100 font-medium text-lg">Connect with our expert PCOS care specialists</p>
        </div>
      </div>

      {/* Success/Error Message */}
      {message && (
        <div className={`p-4 rounded-2xl text-sm font-bold border ${message.includes('already') || message.includes('Failed') ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
          {message}
        </div>
      )}

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map((doc) => {
          const colors = specialtyColors[doc.specialty] || { bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-700', icon: '👨‍⚕️' };
          const apt = getAppointment(doc._id);
          const status = apt ? statusStyles[apt.status] : null;
          const isExpanded = expandedId === doc._id;

          return (
            <div key={doc._id} className="bg-white p-6 rounded-3xl border border-rose-50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-md transition-all duration-300 flex flex-col">
              {/* Doctor Avatar */}
              <div className="flex items-start gap-4 mb-5">
                <div className={`w-14 h-14 ${colors.bg} border ${colors.border} rounded-2xl flex items-center justify-center text-2xl shadow-sm flex-shrink-0`}>
                  {colors.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-black text-[#5C3A4D] truncate">{doc.name}</h3>
                  <p className={`text-sm font-bold ${colors.text}`}>{doc.specialty}</p>
                </div>
              </div>

              {/* Sub-specialty */}
              <p className="text-[#4A4A4A] text-sm font-medium leading-relaxed mb-4 flex-grow">{doc.subSpecialty}</p>

              {/* Appointment Status Badge */}
              {apt && status && (
                <div className="mb-4 space-y-3">
                  {/* Status Badge */}
                  <div className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl ${status.bg} border ${status.border}`}>
                    <span className={`w-2 h-2 rounded-full ${status.dot} ${apt.status === 'pending' ? 'animate-pulse' : ''}`}></span>
                    <span className={`text-xs font-bold ${status.text} uppercase tracking-wider`}>{status.label}</span>
                  </div>

                  {/* Appointment Details Button (only for confirmed) */}
                  {apt.status === 'confirmed' && apt.date && (
                    <>
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : doc._id)}
                        className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-emerald-50 border border-emerald-100 hover:bg-emerald-100 transition-all cursor-pointer group"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg">📅</span>
                          <span className="text-sm font-bold text-emerald-700">
                            {new Date(apt.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            {' • '}
                            {new Date(apt.date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <svg className={`w-4 h-4 text-emerald-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {/* Expanded Details */}
                      {isExpanded && (
                        <div className="bg-gradient-to-r from-emerald-50 to-violet-50 p-5 rounded-2xl border border-emerald-100 space-y-3 animate-fade-in">
                          <div>
                            <p className="text-xs font-bold text-[#5C3A4D]/60 uppercase tracking-widest mb-1">Scheduled Date & Time</p>
                            <p className="text-base font-bold text-[#5C3A4D]">
                              {new Date(apt.date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                              {' at '}
                              {new Date(apt.date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                          {apt.notes && (
                            <div>
                              <p className="text-xs font-bold text-[#5C3A4D]/60 uppercase tracking-widest mb-1">Doctor's Note</p>
                              <div className="bg-white p-4 rounded-xl border border-emerald-100">
                                <p className="text-sm font-medium text-[#4A4A4A] leading-relaxed italic">"{apt.notes}"</p>
                              </div>
                            </div>
                          )}
                          <div className="flex items-center gap-2 pt-1">
                            <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                            <p className="text-xs font-bold text-emerald-600">Appointment Confirmed by {doc.name}</p>
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {/* Pending info */}
                  {apt.status === 'pending' && (
                    <p className="text-xs font-medium text-amber-600 px-4">⏳ Waiting for doctor to confirm and schedule your appointment.</p>
                  )}
                </div>
              )}

              {/* Appoint Button */}
              {!apt ? (
                <button
                  onClick={() => handleAppoint(doc._id)}
                  disabled={bookingId === doc._id}
                  className="w-full py-3.5 bg-[#E88C9A] hover:bg-[#D97A88] text-white rounded-2xl font-bold shadow-sm transition-all disabled:opacity-60 active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  {bookingId === doc._id ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                      </svg>
                      Booking...
                    </>
                  ) : (
                    <>📅 Book Appointment</>
                  )}
                </button>
              ) : (
                <button disabled className="w-full py-3.5 bg-slate-100 text-slate-400 rounded-2xl font-bold cursor-not-allowed text-sm">
                  ✓ Appointment Active
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DoctorConsultancy;
