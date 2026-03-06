import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import Register from './pages/Register';
import RoleSelect from './pages/RoleSelect';
import Awareness from './pages/Awareness';
import Questionnaire from './pages/Questionnaire';
import Prediction from './pages/Prediction';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardHome from './pages/Dashboard';
import DietPlan from './modules/DietPlan';
import ExercisePlan from './modules/ExercisePlan';
import StressManagement from './modules/StressManagement';
import SkinHairCare from './modules/SkinHairCare';
import AIAssistant from './modules/AIAssistant';
import DoctorConsultancy from './modules/DoctorConsultancy';
import FloatingChatbot from './components/FloatingChatbot';
import DoctorLogin from './pages/DoctorLogin';
import DoctorDashboardLayout from './layouts/DoctorDashboardLayout';
import DoctorPatients from './pages/doctor/DoctorPatients';
import DoctorPatientDetail from './pages/doctor/DoctorPatientDetail';
import DoctorChat from './pages/doctor/DoctorChat';
import DoctorCalendar from './pages/doctor/DoctorCalendar';
import AdminLogin from './pages/AdminLogin';
import AdminDashboardLayout from './layouts/AdminDashboardLayout';
import AdminDoctors from './pages/admin/AdminDoctors';
import AdminUsers from './pages/admin/AdminUsers';
import AdminInsights from './pages/admin/AdminInsights';
import { useState } from 'react';

// ✅ Only show chatbot on authenticated user pages (not public, doctor, or admin pages)
function ChatbotWrapper() {
  const location = useLocation();
  const hiddenPrefixes = ['/login', '/register', '/doctor', '/admin', '/welcome'];
  
  // Hide on exact root (RoleSelect)
  if (location.pathname === '/') return null;
  
  // Hide on any hidden prefix (login, register, doctor, admin, welcome)
  if (hiddenPrefixes.some(p => location.pathname.startsWith(p))) return null;
  
  return <FloatingChatbot />;
}

function App() {

  // ✅ user auth depends only on token
  const [user, setUser] = useState(localStorage.getItem("token"));

  // ✅ doctor auth
  const [doctor, setDoctor] = useState(localStorage.getItem("doctorToken"));

  // ✅ admin auth
  const [admin, setAdmin] = useState(localStorage.getItem("adminToken"));

  const handleLogin = (userData) => {
    localStorage.setItem("token", userData.token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData.token);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const handleDoctorLogout = () => {
    localStorage.removeItem("doctorToken");
    localStorage.removeItem("doctor");
    setDoctor(null);
  };

  const handleDoctorLogin = (doctorData) => {
    localStorage.setItem("doctorToken", doctorData.token);
    localStorage.setItem("doctor", JSON.stringify(doctorData));
    setDoctor(doctorData.token);
  };

  const handleAdminLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");
    setAdmin(null);
  };

  const handleAdminLogin = (adminData) => {
    localStorage.setItem("adminToken", adminData.token);
    localStorage.setItem("admin", JSON.stringify(adminData));
    setAdmin(adminData.token);
  };

  return (
    <Router>
      <div className="min-h-screen bg-slate-50">
        <Routes>
          <Route path="/" element={<RoleSelect />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register onLogin={handleLogin} />} />

          {/* Protected Routes (pre-dashboard flow) */}
          <Route path="/awareness" element={user ? <Awareness /> : <Navigate to="/" />} />
          <Route path="/questionnaire" element={user ? <Questionnaire /> : <Navigate to="/" />} />
          <Route path="/prediction" element={user ? <Prediction /> : <Navigate to="/" />} />

          {/* Dashboard with persistent layout */}
          <Route
            path="/dashboard"
            element={user ? <DashboardLayout onLogout={handleLogout} /> : <Navigate to="/" />}
          >
            <Route index element={<DashboardHome />} />
            <Route path="diet" element={<DietPlan />} />
            <Route path="exercise" element={<ExercisePlan />} />
            <Route path="stress" element={<StressManagement />} />
            <Route path="skin-hair" element={<SkinHairCare />} />
            <Route path="assistant" element={<AIAssistant />} />
            <Route path="doctors" element={<DoctorConsultancy />} />
          </Route>

          {/* Doctor Portal */}
          <Route path="/doctor/login" element={<DoctorLogin onLogin={handleDoctorLogin} />} />
          <Route
            path="/doctor/dashboard"
            element={doctor ? <DoctorDashboardLayout onLogout={handleDoctorLogout} /> : <Navigate to="/doctor/login" />}
          >
            <Route index element={<DoctorPatients />} />
            <Route path="patient/:id" element={<DoctorPatientDetail />} />
            <Route path="chat" element={<DoctorChat />} />
            <Route path="calendar" element={<DoctorCalendar />} />
          </Route>

          {/* Admin Portal */}
          <Route path="/admin/login" element={<AdminLogin onLogin={handleAdminLogin} />} />
          <Route
            path="/admin/dashboard"
            element={admin ? <AdminDashboardLayout onLogout={handleAdminLogout} /> : <Navigate to="/admin/login" />}
          >
            <Route index element={<AdminDoctors />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="insights" element={<AdminInsights />} />
          </Route>
        </Routes>

        {/* FloatingChatbot — only on authenticated user pages */}
        {user && <ChatbotWrapper />}
      </div>
    </Router>
  );
}

export default App;

