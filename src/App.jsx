import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth, AuthProvider } from "./context/AuthContext";

// Pages
import Login from "./pages/Login";
import TenantForm from "./pages/TenantForm";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import TenantPortal from "./pages/TenantPortal";
import ContractView from "./pages/ContractView";
import "./App.css";

function AppRoutes() {
  const { user, loading } = useAuth(); // Access global auth state

  if (loading) return <div className="loading-screen">Initializing SafeStay...</div>;

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register-tenant" element={<TenantForm />} />
        <Route path="/portal" element={<TenantPortal />} />
        <Route path="/signup" element={<Login />} />

        {/* Protected Routes */}
        <Route 
          path="/dashboard" 
          element={user ? <Dashboard /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/contract" 
          element={user ? <ContractView /> : <Navigate to="/login" />} 
        />
      </Routes>
    </Router>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}