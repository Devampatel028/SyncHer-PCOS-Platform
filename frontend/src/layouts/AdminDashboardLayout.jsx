import { Outlet, useNavigate, NavLink } from 'react-router-dom';

const AdminDashboardLayout = ({ onLogout }) => {
    const navigate = useNavigate();

    const menuItems = [
        { path: '/admin/dashboard', icon: '🩺', label: 'Medical Network', end: true },
        { path: '/admin/dashboard/users', icon: '👥', label: 'Patient Registry' },
        { path: '/admin/dashboard/insights', icon: '📊', label: 'Health Insights' },
    ];

    const handleLogout = () => {
        onLogout();
        navigate('/');
    };

    return (
        <div className="flex min-h-screen bg-[#F8FAFB]">
            {/* Sidebar */}
            <aside className="w-80 bg-white border-r border-[#E2E8F0] h-screen sticky top-0 flex flex-col p-8 z-50">
                <div className="flex items-center gap-4 px-2 mb-12">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#2D4536] to-[#1E2F25] rounded-2xl flex items-center justify-center text-white text-xl font-black shadow-xl shadow-emerald-900/10">S</div>
                    <div>
                        <h2 className="text-2xl font-black text-[#1A202C] tracking-tight leading-7">Saheli</h2>
                        <p className="text-[11px] font-black text-[#68D391] uppercase tracking-[0.2em] leading-none">Admin Console</p>
                    </div>
                </div>

                <nav className="flex-1 space-y-3">
                    <p className="px-4 text-[10px] font-black text-[#A0AEC0] uppercase tracking-[0.25em] mb-4">Main Navigation</p>
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.end}
                            className={({ isActive }) => 
                                `flex items-center gap-4 px-5 py-4 rounded-[1.25rem] transition-all duration-400 group ${
                                    isActive 
                                    ? 'bg-[#2D4536] text-white shadow-xl shadow-emerald-900/10 scale-[1.02]' 
                                    : 'text-[#718096] hover:bg-[#F7FAFC] hover:text-[#2D4536]'
                                }`
                            }
                        >
                            <span className={`text-xl transition-transform duration-300 group-hover:scale-110`}>{item.icon}</span>
                            <span className="font-bold text-[15px] tracking-tight">{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="pt-8 border-t border-[#EDF2F7]">
                    <div className="mb-6 p-5 bg-[#F7FAFC] rounded-[2rem] border border-[#EDF2F7] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-5 bg-[#2D4536] rounded-full w-24 h-24 -mr-8 -mt-8 transition-transform duration-700 group-hover:scale-150"></div>
                        <div className="flex items-center gap-4 relative z-10">
                            <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-sm border border-[#E2E8F0] font-black text-[#2D4536]">A</div>
                            <div>
                                <span className="block text-xs font-black text-[#1A202C] uppercase tracking-tight">System Lead</span>
                                <p className="text-[10px] font-bold text-[#718096] uppercase tracking-widest">Lvl 1 - Superadmin</p>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-white border border-[#E2E8F0] text-[#E53E3E] hover:bg-[#FFF5F5] hover:border-[#FEB2B2] transition-all duration-300 font-black text-sm uppercase tracking-widest shadow-sm hover:shadow-md"
                    >
                        <span>Logout</span>
                        <span className="text-xl">🚪</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-12 overflow-y-auto">
                <div className="max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminDashboardLayout;
