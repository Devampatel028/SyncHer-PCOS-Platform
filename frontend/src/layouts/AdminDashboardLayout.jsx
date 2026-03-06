import { Outlet, useNavigate, NavLink } from 'react-router-dom';

const AdminDashboardLayout = ({ onLogout }) => {
    const navigate = useNavigate();

    const menuItems = [
        { path: '/admin/dashboard', icon: '🩺', label: 'Active Doctors', end: true },
        { path: '/admin/dashboard/users', icon: '👥', label: 'Active Users' },
        { path: '/admin/dashboard/insights', icon: '📊', label: 'Insights' },
    ];

    const handleLogout = () => {
        onLogout();
        navigate('/');
    };

    return (
        <div className="flex min-h-screen bg-[#F6FFF9]">
            {/* Sidebar */}
            <aside className="w-72 bg-white border-r border-emerald-50 h-screen sticky top-0 flex flex-col p-6 shadow-sm">
                <div className="flex items-center gap-3 px-2 mb-10">
                    <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white font-bold shadow-md">S</div>
                    <div>
                        <h2 className="text-xl font-black text-[#2D4536] tracking-tight">Admin Portal</h2>
                        <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest leading-none">Management</p>
                    </div>
                </div>

                <nav className="flex-1 space-y-2 overflow-y-auto">
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.end}
                            className={({ isActive }) => 
                                `flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 font-bold text-sm ${
                                    isActive 
                                    ? 'bg-emerald-50 text-emerald-700 shadow-sm border border-emerald-100' 
                                    : 'text-[#4A4A4A] hover:bg-emerald-50/50 hover:text-emerald-600'
                                }`
                            }
                        >
                            <span className="text-xl opacity-70">{item.icon}</span>
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="pt-6 border-t border-emerald-50">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-[#4A4A4A] hover:bg-rose-50 hover:text-rose-600 transition-all font-bold text-sm cursor-pointer"
                    >
                        <span className="text-xl opacity-70">🚪</span>
                        Logout
                    </button>
                    
                    <div className="mt-6 p-4 bg-emerald-50/50 rounded-[1.5rem] border border-emerald-50">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 rounded-full bg-emerald-200 border-2 border-white shadow-sm flex items-center justify-center text-xs">A</div>
                            <span className="text-xs font-black text-[#2D4536]">System Administrator</span>
                        </div>
                        <p className="text-[9px] font-bold text-[#6BA37D] uppercase tracking-wider">Access Level: Level 1</p>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminDashboardLayout;
