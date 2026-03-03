import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import Register from './pages/Register';
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
import FloatingChatbot from './components/FloatingChatbot';
import { useState } from 'react';

function App() {

  // ✅ auth depends only on token
  const [user, setUser] = useState(
    localStorage.getItem("token")
  );

  const handleLogin = (userData) => {

    localStorage.setItem("token", userData.token);
    localStorage.setItem("user", JSON.stringify(userData));

    // ✅ store token in state
    setUser(userData.token);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };
  return (
    <Router>
      <div className="min-h-screen bg-slate-50">
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register onLogin={handleLogin} />} />

          {/* Protected Routes (pre-dashboard flow) */}
          <Route path="/awareness" element={user ? <Awareness /> : <Navigate to="/login" />} />
          <Route path="/questionnaire" element={user ? <Questionnaire /> : <Navigate to="/login" />} />
          <Route path="/prediction" element={user ? <Prediction /> : <Navigate to="/login" />} />

          {/* Dashboard with persistent layout */}
          <Route
            path="/dashboard"
            element={user ? <DashboardLayout onLogout={handleLogout} /> : <Navigate to="/login" />}
          >
            <Route index element={<DashboardHome />} />
            <Route path="diet" element={<DietPlan />} />
            <Route path="exercise" element={<ExercisePlan />} />
            <Route path="stress" element={<StressManagement />} />
            <Route path="skin-hair" element={<SkinHairCare />} />
            <Route path="assistant" element={<AIAssistant />} />
          </Route>
        </Routes>

        {/* FloatingChatbot on pre-dashboard pages */}
        {user && <FloatingChatbot />}
      </div>
    </Router>
  );
}

export default App;
