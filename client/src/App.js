import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthContext, AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Department from "./pages/Department";
import Programme from "./pages/Programme";
import Block from "./pages/Block";
import Room from "./pages/Room";
import Role from "./pages/Role";
import User from "./pages/User";
import ComplaintForm from "./pages/ComplaintForm";
import ComplaintsDashboard from "./pages/ComplaintsDashboard";
import UserComplaintDashboard from "./pages/UserComplaintDashboard";
import Reports from "./pages/Reports";
import "./App.css";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return isAuthenticated ? (
    <>
      <Navbar />
      {children}
    </>
  ) : (
    <Navigate to="/login" />
  );
};

const SuperAdminRoute = ({ children }) => {
  const { user, loading, isAuthenticated } = useContext(AuthContext);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return isAuthenticated && user?.role === "SuperAdmin" ? (
    <>
      <Navbar />
      {children}
    </>
  ) : (
    <Navigate to="/dashboard" />
  );
};

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <Toaster position="top-right" reverseOrder={false} />
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          {/* SuperAdmin Only Routes */}
          <Route
            path="/departments"
            element={
              <SuperAdminRoute>
                <Department />
              </SuperAdminRoute>
            }
          />
          <Route
            path="/programmes"
            element={
              <SuperAdminRoute>
                <Programme />
              </SuperAdminRoute>
            }
          />
          <Route
            path="/blocks"
            element={
              <SuperAdminRoute>
                <Block />
              </SuperAdminRoute>
            }
          />
          <Route
            path="/rooms"
            element={
              <SuperAdminRoute>
                <Room />
              </SuperAdminRoute>
            }
          />
          <Route
            path="/roles"
            element={
              <SuperAdminRoute>
                <Role />
              </SuperAdminRoute>
            }
          />
          <Route
            path="/users"
            element={
              <SuperAdminRoute>
                <User />
              </SuperAdminRoute>
            }
          />
          <Route
            path="/complaints/new"
            element={
              <ProtectedRoute>
                <ComplaintForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-complaints"
            element={
              <ProtectedRoute>
                <UserComplaintDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/complaints"
            element={
              <ProtectedRoute>
                <ComplaintsDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <SuperAdminRoute>
                <Reports />
              </SuperAdminRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
