import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import ProfileDropdown from '../components/ProfileDropdown';

const DashboardLayout = ({ onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user'));

  const modules = [
    { title: 'Overview', icon: '📊', route: '/dashboard' },
    { title: 'Diet Plan', icon: '🥗', route: '/dashboard/diet' },
    { title: 'Exercise Plan', icon: '🧘', route: '/dashboard/exercise' },
    { title: 'Stress Management', icon: '🍃', route: '/dashboard/stress' },
    { title: 'Skin & Hair Care', icon: '✨', route: '/dashboard/skin-hair' },
    { title: 'AI Assistant', icon: '🤖', route: '/dashboard/assistant' },
  ];

  const isActive = (route) => {
    if (route === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname.startsWith(route);
  };

  return (
    <div className="min-h-screen bg-[#FFF8F6] flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 hidden md:flex flex-col fixed min-h-screen bg-[#FFF8F6] border-r border-rose-100 z-40">
        {/* Logo */}
        <div className="p-6 border-b border-rose-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#E88C9A] rounded-2xl flex items-center justify-center shadow-sm">
              <span className="text-white font-black text-lg">S</span>
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-[#5C3A4D] tracking-tight">Saheli</h2>
              <p className="text-xs text-[#8FBF9F] font-bold uppercase tracking-wider">PCOS Care</p>
            </div>
          </div>
        </div>

        {/* User pill */}
        <div className="px-5 py-4 mx-4 mt-6 rounded-2xl bg-white border border-rose-50 shadow-sm">
          <p className="text-xs text-[#E88C9A] font-bold uppercase tracking-wider mb-1">Authenticated</p>
          <p className="text-sm text-[#5C3A4D] font-bold truncate">{user?.email || 'User'}</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 mt-2 space-y-2 overflow-y-auto custom-scrollbar">
          <p className="text-xs font-bold text-[#8FBF9F] uppercase tracking-widest px-3 mb-4 mt-4">Modules</p>
          {modules.map(mod => (
            <button
              key={mod.title}
              onClick={() => navigate(mod.route)}
              className={`w-full text-left px-4 py-3.5 rounded-2xl transition-all duration-300 flex items-center gap-3 text-sm font-semibold select-none ${isActive(mod.route)
                ? 'bg-[#C8B6E2] text-[#5C3A4D] shadow-sm'
                : 'text-[#4A4A4A] hover:bg-white hover:text-[#5C3A4D] hover:shadow-sm border border-transparent hover:border-rose-50'
                }`}>
              <span className={`text-xl ${isActive(mod.route) ? 'opacity-100 scale-110 transition-transform' : 'opacity-70'}`}>{mod.icon}</span>
              {mod.title}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-rose-100">
          <button onClick={onLogout}
            className="w-full px-4 py-3 text-rose-500 font-semibold bg-white border border-rose-100 hover:bg-rose-50 hover:text-rose-600 rounded-2xl transition-all text-sm flex items-center gap-2 select-none shadow-sm pb-3">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out Securely
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 min-h-screen flex flex-col relative w-full overflow-x-hidden">
        {/* Top Header */}
        <header className="sticky top-0 z-30 flex justify-between items-center px-6 py-4 md:px-10 md:py-6 bg-[#FFF8F6]/80 backdrop-blur-md border-b border-rose-100">
          <div>
            <h1 className="text-2xl font-extrabold text-[#5C3A4D] tracking-tight">My Path</h1>
            <p className="text-sm text-[#4A4A4A] mt-1 font-medium">Your personalized clinical protocol</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-rose-50 shadow-sm">
              <span className="w-2.5 h-2.5 bg-[#8FBF9F] rounded-full animate-pulse" />
              <span className="text-sm text-[#8FBF9F] font-bold select-none uppercase tracking-wider">Care Active</span>
            </div>
            <ProfileDropdown onLogout={onLogout} />
          </div>
        </header>

        <div className="p-6 md:p-10 flex-1 w-full max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
