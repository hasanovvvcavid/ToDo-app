import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import { GoogleOAuthProvider } from '@react-oauth/google';
import "./App.css";

import useAuthStore from "./store/useAuthStore";

import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import NewPassword from "./pages/NewPassword/NewPassword";
import NoPage from "./pages/NoPage/NoPage";
import Dashboard from "./pages/Dashboard/Dashboard";
import VerifyEmail from "./pages/VerifyEmail/VerifyEmail";

// Qorunan marşrut (yalnız giriş etmiş istifadəçilər üçün)
const ProtectedRoute = ({ children }) => {
  const { token } = useAuthStore();
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Açıq marşrut (giriş edənlərin daxil ola bilməyəcəyi səhifələr, məs: login/register)
const PublicRoute = ({ children }) => {
  const { token } = useAuthStore();
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.GOOGLE_CLIENT_ID}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } 
          />
          <Route 
            path="/register" 
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            } 
          />
          <Route path="/verify/:token" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/new-password" element={<NewPassword />} />
          <Route path="*" element={<NoPage />} />
        </Routes>
      </Router>
      <ToastContainer position="top-right" autoClose={3000} />
    </GoogleOAuthProvider>
  );
}

export default App;
