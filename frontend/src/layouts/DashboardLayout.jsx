import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import ProfileDropdown from '../components/ProfileDropdown';

// ✅ BUG FIX: Removed duplicate <FloatingChatbot /> from here.
// FloatingChatbot is already rendered in App.jsx for all logged-in users.

const DashboardLayout = ({ onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user'));

  const modules = [
    { title: 'Dashboard', icon: '📊', route: '/dashboard' },
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
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 hidden md:flex flex-col fixed min-h-screen shadow-xl border-r border-white/10"
        style={{ background: 'linear-gradient(180deg, #5b21b6 0%, #7c3aed 45%, #db2777 100%)' }}>
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center shadow-lg backdrop-blur-sm">
              <span className="text-white font-black text-lg">S</span>
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white">SyncHer</h2>
              <p className="text-xs text-violet-300 font-medium">Smart PCOS Care</p>
            </div>
          </div>
        </div>

        {/* User pill */}
        <div className="px-4 py-3 mx-3 mt-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
          <p className="text-xs text-violet-300 font-semibold">Logged in as</p>
          <p className="text-sm text-white font-bold truncate">{user?.email || 'User'}</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 mt-4 space-y-1 overflow-y-auto">
          <p className="text-xs font-bold text-violet-400 uppercase tracking-wider px-4 mb-3">Navigation</p>
          {modules.map(mod => (
            <button
              key={mod.title}
              onClick={() => navigate(mod.route)}
              className={`w-full text-left px-4 py-3 rounded-2xl transition-all duration-200 flex items-center gap-3 text-sm font-semibold ${
                isActive(mod.route)
                  ? 'bg-white text-violet-700 shadow-lg shadow-black/10'
                  : 'text-violet-100 hover:bg-white/10 hover:text-white'
              }`}>
              <span className="text-base">{mod.icon}</span>
              {mod.title}
              {isActive(mod.route) && <span className="ml-auto w-2 h-2 bg-violet-500 rounded-full" />}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-white/10">
          <button onClick={onLogout}
            className="w-full p-3 text-red-300 font-semibold hover:bg-red-500/20 rounded-2xl transition-all text-sm flex items-center gap-2 hover:text-red-200">
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 min-h-screen">
        {/* Top Header */}
        <header className="sticky top-0 z-30 flex justify-between items-center p-4 md:p-5 bg-white/80 backdrop-blur-xl border-b border-slate-100 shadow-sm">
          <div>
            <h1 className="text-lg font-extrabold text-slate-800">SyncHer Dashboard</h1>
            <p className="text-xs text-slate-400 font-medium">Your personal PCOS care center</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm text-slate-500 font-medium">{user?.email}</span>
            </div>
            <ProfileDropdown onLogout={onLogout} />
          </div>
        </header>

        <div className="p-5 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
