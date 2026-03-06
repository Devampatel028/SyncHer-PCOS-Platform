import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5000/api';

const DoctorCalendar = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedApt, setSelectedApt] = useState(null);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem('doctorToken');
      const res = await fetch(`${API_URL}/doctors/appointments`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setAppointments(data);
    } catch (err) {
      console.error('Failed to load appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAppointments(); }, []);

  const handleSchedule = async () => {
    if (!scheduleDate || !scheduleTime) return;
    setSaving(true);
    setMessage('');
    try {
      const token = localStorage.getItem('doctorToken');
      const dateTime = new Date(`${scheduleDate}T${scheduleTime}`);
      const res = await fetch(`${API_URL}/doctors/appointment/${selectedApt._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ date: dateTime.toISOString(), status: 'confirmed', notes })
      });
      const data = await res.json();
      setMessage(data.message || 'Appointment scheduled!');
      setShowModal(false);
      setSelectedApt(null);
      setScheduleDate('');
      setScheduleTime('');
      setNotes('');
      fetchAppointments();
    } catch (err) {
      setMessage('Failed to schedule appointment');
    } finally {
      setSaving(false);
    }
  };

  const statusColors = {
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
    confirmed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    completed: 'bg-slate-50 text-slate-600 border-slate-200',
    cancelled: 'bg-rose-50 text-rose-600 border-rose-200'
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-violet-200 border-t-[#C8B6E2] rounded-full animate-spin mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl p-8 bg-gradient-to-br from-[#C8B6E2] to-[#9B8EC4] text-white border border-violet-100 shadow-lg">
        <div className="relative z-10">
          <p className="text-violet-100 text-sm font-bold mb-2 tracking-widest uppercase">Schedule</p>
          <h2 className="text-4xl font-black tracking-tight">Appointment Calendar</h2>
          <p className="text-violet-100 mt-2 font-medium">{appointments.length} appointment{appointments.length !== 1 ? 's' : ''} total</p>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className={`p-4 rounded-2xl text-sm font-bold border ${message.includes('Failed') ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
          {message}
        </div>
      )}

      {/* Appointments List */}
      {appointments.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl text-center border border-violet-50 shadow-sm">
          <div className="w-20 h-20 bg-violet-50 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-6">📅</div>
          <h3 className="text-xl font-bold text-[#5C3A4D] mb-2">No Appointments</h3>
          <p className="text-[#4A4A4A] text-sm font-medium">Appointments from patients will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map(apt => (
            <div key={apt._id} className="bg-white p-6 rounded-3xl border border-rose-50 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4 flex-1">
                <div className="w-12 h-12 bg-[#E88C9A] rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-sm">
                  {apt.userId?.name?.charAt(0)?.toUpperCase() || 'P'}
                </div>
                <div>
                  <p className="font-bold text-[#5C3A4D]">{apt.userId?.name || 'Patient'}</p>
                  <p className="text-xs text-[#4A4A4A] font-medium">{apt.userId?.email}</p>
                  {apt.date && (
                    <p className="text-xs text-[#C8B6E2] font-bold mt-1">
                      📅 {new Date(apt.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })} at {new Date(apt.date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize border ${statusColors[apt.status] || statusColors.pending}`}>
                  {apt.status}
                </span>
                {(apt.status === 'pending' || apt.status === 'confirmed') && (
                  <button onClick={() => { setSelectedApt(apt); setShowModal(true); setNotes(apt.notes || ''); }}
                    className="px-4 py-2 bg-[#C8B6E2] text-white rounded-xl text-sm font-bold hover:bg-[#B5A1D4] transition-all shadow-sm">
                    {apt.status === 'pending' ? 'Schedule' : 'Reschedule'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Schedule Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl border border-rose-50 animate-scale-in">
            <h3 className="text-xl font-extrabold text-[#5C3A4D] mb-1">Schedule Appointment</h3>
            <p className="text-sm text-[#4A4A4A] font-medium mb-6">
              Patient: <span className="font-bold text-[#5C3A4D]">{selectedApt?.userId?.name || 'Patient'}</span>
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-[#5C3A4D] mb-2">Date</label>
                <input type="date" value={scheduleDate} onChange={e => setScheduleDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#C8B6E2] text-[#4A4A4A] shadow-sm" />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#5C3A4D] mb-2">Time</label>
                <input type="time" value={scheduleTime} onChange={e => setScheduleTime(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#C8B6E2] text-[#4A4A4A] shadow-sm" />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#5C3A4D] mb-2">Notes (optional)</label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3}
                  placeholder="Add any notes for the patient..."
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#C8B6E2] text-[#4A4A4A] shadow-sm resize-none" />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => { setShowModal(false); setSelectedApt(null); }}
                className="flex-1 py-3 rounded-2xl border border-slate-200 text-[#4A4A4A] font-bold hover:bg-slate-50 transition-all">
                Cancel
              </button>
              <button onClick={handleSchedule} disabled={saving || !scheduleDate || !scheduleTime}
                className="flex-1 py-3 rounded-2xl bg-[#C8B6E2] text-white font-bold hover:bg-[#B5A1D4] transition-all disabled:opacity-50 shadow-sm">
                {saving ? 'Saving...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorCalendar;
