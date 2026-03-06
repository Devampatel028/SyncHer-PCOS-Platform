import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const DoctorDashboardLayout = ({ onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const doctor = JSON.parse(localStorage.getItem('doctor'));

  const modules = [
    { title: 'Patients', icon: '👥', route: '/doctor/dashboard' },
    { title: 'Calendar', icon: '📅', route: '/doctor/dashboard/calendar' },
    { title: 'Chat', icon: '💬', route: '/doctor/dashboard/chat' },
  ];

  const isActive = (route) => {
    if (route === '/doctor/dashboard') return location.pathname === '/doctor/dashboard';
    return location.pathname.startsWith(route);
  };

  return (
    <div className="min-h-screen bg-[#FFF8F6] flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 hidden md:flex flex-col fixed h-screen bg-[#FFF8F6] border-r border-violet-100 z-40 overflow-visible">
        {/* Logo */}
        <div className="p-6 border-b border-violet-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#C8B6E2] rounded-2xl flex items-center justify-center shadow-sm">
              <span className="text-white font-black text-lg">S</span>
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-[#5C3A4D] tracking-tight">Saheli</h2>
              <p className="text-xs text-[#C8B6E2] font-bold uppercase tracking-wider">Doctor Portal</p>
            </div>
          </div>
        </div>

        {/* Doctor pill */}
        <div className="px-5 py-4 mx-4 mt-6 rounded-2xl bg-white border border-violet-50 shadow-sm">
          <p className="text-xs text-[#C8B6E2] font-bold uppercase tracking-wider mb-1">Doctor</p>
          <p className="text-sm text-[#5C3A4D] font-bold truncate">{doctor?.name || 'Doctor'}</p>
          <p className="text-xs text-[#4A4A4A] truncate">{doctor?.specialty}</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 mt-2 space-y-2 overflow-y-auto custom-scrollbar">
          <p className="text-xs font-bold text-[#C8B6E2] uppercase tracking-widest px-3 mb-4 mt-4">Dashboard</p>
          {modules.map(mod => (
            <button key={mod.title} onClick={() => navigate(mod.route)}
              className={`w-full text-left px-4 py-3.5 rounded-2xl transition-all duration-300 flex items-center gap-3 text-sm font-semibold select-none ${isActive(mod.route)
                ? 'bg-[#C8B6E2] text-white shadow-sm'
                : 'text-[#4A4A4A] hover:bg-white hover:text-[#5C3A4D] hover:shadow-sm border border-transparent hover:border-violet-50'
              }`}>
              <span className={`text-xl ${isActive(mod.route) ? 'opacity-100 scale-110 transition-transform' : 'opacity-70'}`}>{mod.icon}</span>
              {mod.title}
            </button>
          ))}

          <div className="border-t border-violet-100 my-3"></div>

          <button onClick={onLogout}
            className="w-full text-left px-4 py-3.5 rounded-2xl transition-all duration-300 flex items-center gap-3 text-sm font-semibold text-rose-500 hover:bg-rose-50 hover:text-rose-600 hover:shadow-sm border border-transparent hover:border-rose-100 select-none">
            <span className="text-xl opacity-70">🚪</span>
            Sign Out
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 h-screen flex flex-col relative w-full overflow-x-hidden overflow-y-auto">
        <header className="sticky top-0 z-30 flex justify-between items-center px-6 py-4 md:px-10 md:py-6 bg-[#FFF8F6]/80 backdrop-blur-md border-b border-violet-100">
          <div>
            <h1 className="text-2xl font-extrabold text-[#5C3A4D] tracking-tight">Doctor Dashboard</h1>
            <p className="text-sm text-[#4A4A4A] mt-1 font-medium">Manage your patients and appointments</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-violet-50 shadow-sm">
              <span className="w-2.5 h-2.5 bg-[#8FBF9F] rounded-full animate-pulse" />
              <span className="text-sm text-[#8FBF9F] font-bold select-none uppercase tracking-wider">Online</span>
            </div>
          </div>
        </header>

        <div className="p-6 md:p-10 flex-1 w-full max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DoctorDashboardLayout;
