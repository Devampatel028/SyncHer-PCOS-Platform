import { useNavigate } from 'react-router-dom';

const RoleSelect = () => {
  const navigate = useNavigate();

  const roles = [
    {
      title: 'Patient',
      desc: 'Access your health dashboard, AI assessments, and personalized PCOS care plans.',
      icon: '👤',
      color: 'from-[#E88C9A] to-[#D97A88]',
      border: 'border-rose-100',
      hoverBorder: 'hover:border-rose-200',
      bg: 'bg-rose-50',
      route: '/welcome'
    },
    {
      title: 'Doctor',
      desc: 'View your patients\' health data, manage appointments, and provide clinical guidance.',
      icon: '🩺',
      color: 'from-[#C8B6E2] to-[#9B8EC4]',
      border: 'border-violet-100',
      hoverBorder: 'hover:border-violet-200',
      bg: 'bg-violet-50',
      route: '/doctor/login'
    },
    {
      title: 'Admin',
      desc: 'Platform administration, user management, and system monitoring dashboard.',
      icon: '🛡️',
      color: 'from-[#8FBF9F] to-[#6BA37D]',
      border: 'border-emerald-100',
      hoverBorder: 'hover:border-emerald-200',
      bg: 'bg-emerald-50',
      route: '/admin/login'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FFF8F6] flex flex-col items-center justify-center p-6 font-sans relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#E88C9A]/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#C8B6E2]/15 blur-[120px] pointer-events-none"></div>

      {/* Logo */}
      <div className="flex items-center gap-3 mb-12 animate-fade-in">
        <div className="w-12 h-12 bg-[#E88C9A] rounded-2xl flex items-center justify-center font-black text-2xl text-white shadow-md">S</div>
        <span className="text-3xl font-extrabold text-[#5C3A4D] tracking-tight">Saheli</span>
      </div>

      {/* Heading */}
      <div className="text-center mb-10 animate-fade-in max-w-2xl px-4">
        <h1 className="text-4xl md:text-5xl font-black text-[#5C3A4D] tracking-tight mb-2 uppercase">
          SAHELI SMART CARE FOR PCOS
        </h1>
        <p className="text-xl text-[#E88C9A] font-bold italic mb-6">
          From Symptoms To Solution, Saheli Is With You
        </p>
        <div className="relative">
          <p className="text-base md:text-lg text-[#4A4A4A] font-medium leading-relaxed italic">
            "Saheli – Care for PCOS is a role-based healthcare platform that empowers women to detect and manage PCOS early. By combining AI insights, personalized wellness recommendations, and doctor consultations, Saheli helps women take control of their hormonal health."
          </p>
        </div>
        <div className="mt-8 border-t border-rose-100 pt-8">
          <p className="text-lg text-[#4A4A4A] font-bold tracking-wide uppercase opacity-70">Select your role to continue</p>
        </div>
      </div>

      {/* Role Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full animate-fade-in">
        {roles.map((role) => (
          <button
            key={role.title}
            onClick={() => navigate(role.route)}
            className={`group bg-white p-8 rounded-3xl border ${role.border} ${role.hoverBorder} shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-lg transition-all duration-300 text-left flex flex-col items-center text-center cursor-pointer active:scale-[0.98]`}
          >
            {/* Icon */}
            <div className={`w-20 h-20 ${role.bg} rounded-3xl flex items-center justify-center text-4xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
              {role.icon}
            </div>

            {/* Title */}
            <h3 className="text-xl font-extrabold text-[#5C3A4D] mb-2">{role.title}</h3>

            {/* Description */}
            <p className="text-sm text-[#4A4A4A] font-medium leading-relaxed mb-6">{role.desc}</p>

            {/* CTA */}
            <div className={`w-full py-3 rounded-2xl bg-gradient-to-r ${role.color} text-white font-bold text-sm shadow-sm group-hover:shadow-md transition-all text-center`}>
              Login as {role.title}
            </div>
          </button>
        ))}
      </div>

      {/* New user link */}
      <p className="text-center mt-10 text-sm font-medium text-[#4A4A4A] animate-fade-in">
        New patient?{' '}
        <button onClick={() => navigate('/register')} className="text-[#E88C9A] font-bold hover:text-[#D97A88] transition-colors">
          Create an account
        </button>
      </p>
    </div>
  );
};

export default RoleSelect;
