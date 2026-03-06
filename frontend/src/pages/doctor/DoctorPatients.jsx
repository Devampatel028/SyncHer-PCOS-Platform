import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:5000/api';

const DoctorPatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const token = localStorage.getItem('doctorToken');
        const res = await fetch(`${API_URL}/doctors/patients`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setPatients(data);
      } catch (err) {
        console.error('Failed to load patients:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-violet-200 border-t-[#C8B6E2] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#4A4A4A] font-medium">Loading patients...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl p-8 md:p-10 bg-gradient-to-br from-[#C8B6E2] to-[#9B8EC4] text-white border border-violet-100 shadow-lg">
        <div className="relative z-10">
          <p className="text-violet-100 text-sm font-bold mb-2 tracking-widest uppercase">Overview</p>
          <h2 className="text-4xl font-black tracking-tight">My Patients</h2>
          <p className="text-violet-100 mt-2 font-medium">{patients.length} patient{patients.length !== 1 ? 's' : ''} appointed</p>
        </div>
      </div>

      {/* Patient List */}
      {patients.length === 0 ? (
        <div className="bg-white border border-violet-50 p-12 rounded-3xl text-center shadow-sm">
          <div className="w-20 h-20 bg-violet-50 border border-violet-100 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-6">👥</div>
          <h3 className="text-xl font-bold text-[#5C3A4D] mb-2">No Patients Yet</h3>
          <p className="text-[#4A4A4A] text-sm font-medium">Patients who book appointments with you will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {patients.map(({ patient, latestAppointment }) => (
            <div key={patient._id}
              onClick={() => navigate(`/doctor/dashboard/patient/${patient._id}`)}
              className="bg-white p-6 rounded-3xl border border-rose-50 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-[#E88C9A] rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-sm">
                  {patient.name?.charAt(0)?.toUpperCase() || 'P'}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-black text-[#5C3A4D] truncate">{patient.name || 'Patient'}</h3>
                  <p className="text-xs text-[#4A4A4A] font-medium truncate">{patient.email}</p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-[#4A4A4A] font-medium">PCOS Status</span>
                  <span className="font-bold text-[#5C3A4D]">{patient.pcosStatus || 'N/A'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#4A4A4A] font-medium">Status</span>
                  <span className={`font-bold capitalize px-2 py-0.5 rounded-lg text-xs ${
                    latestAppointment.status === 'confirmed' ? 'bg-emerald-50 text-emerald-700' :
                    latestAppointment.status === 'pending' ? 'bg-amber-50 text-amber-700' :
                    'bg-slate-50 text-slate-600'
                  }`}>{latestAppointment.status}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm font-bold text-[#C8B6E2] opacity-0 group-hover:opacity-100 transition-opacity">
                View Health Data
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorPatients;
