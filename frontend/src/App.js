import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import LodgeComplaint from "./pages/LodgeComplaint";
import MyComplaints from "./pages/MyComplaints";
import AdminDashboard from "./pages/AdminDashboard";
import DepartmentDashboard from "./pages/DepartmentDashboard";
import AdminComplaints from "./pages/AdminComplaints";
import AdminAnnouncements from "./pages/AdminAnnouncements";
import AdminUsers from "./pages/AdminUsers";
import { useAuth } from "./context/AuthContext";
import { dashboardPathForRole, normalizeRole } from "./utils/helpers";

function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();
  const resolvedRole = normalizeRole(user?.role);

  if (loading) {
    return <div className="loading-center"><div className="spinner" /></div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(resolvedRole)) {
    return <Navigate to={dashboardPathForRole(resolvedRole)} replace />;
  }

  return children;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  const resolvedRole = normalizeRole(user?.role);

  if (loading) {
    return <div className="loading-center"><div className="spinner" /></div>;
  }

  if (user) {
    return <Navigate to={dashboardPathForRole(resolvedRole)} replace />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute roles={["student"]}><Dashboard /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/lodge-complaint" element={<ProtectedRoute roles={["student"]}><LodgeComplaint /></ProtectedRoute>} />
        <Route path="/my-complaints" element={<ProtectedRoute roles={["student"]}><MyComplaints /></ProtectedRoute>} />
        <Route path="/admin/dashboard" element={<ProtectedRoute roles={["main_admin"]}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/department/dashboard" element={<ProtectedRoute roles={["department_admin", "college_admin", "university_admin"]}><DepartmentDashboard /></ProtectedRoute>} />
        <Route path="/admin/complaints" element={<ProtectedRoute roles={["main_admin", "department_admin", "college_admin", "university_admin"]}><AdminComplaints /></ProtectedRoute>} />
        <Route path="/admin/announcements" element={<ProtectedRoute roles={["main_admin", "department_admin", "college_admin", "university_admin"]}><AdminAnnouncements /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute roles={["main_admin"]}><AdminUsers /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
