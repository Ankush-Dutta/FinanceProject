// src/App.tsx
import React, { Suspense, lazy, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { DataProvider } from "./contexts/DataContext";
import Layout from "./components/Layout";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProfileSetup from "./pages/ProfileSetup";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import TaxCalculation from "./pages/TaxCalculation";
import LoanManagement from "./pages/LoanManagement";
import AssetManagement from "./pages/AssetManagement";
import CurrencyConverter from "./pages/CurrencyConverter";
import Insurance from "./pages/Insurance";
import AddTransaction from "./pages/AddTransaction";
import PrivateRoute from "./components/PrivateRoute";
import OTPVerification from "./pages/OTPVerification";
import { profileApi } from "./utils/api";

const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetSuccess   = lazy(() => import("./pages/ResetSuccess"));

const AppRouter: React.FC = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleAutoRedirect = async () => {
      if (isLoading || !user) return;

      // User is authenticated, check profile status
      try {
        await profileApi.getProfile(user.id);
        // Profile exists, redirect to dashboard
        if (window.location.pathname === '/' || window.location.pathname === '/login') {
          navigate('/app/dashboard');
        }
      } catch (error) {
        // Profile doesn't exist, redirect to profile setup
        console.log("No existing profile found, redirecting to profile setup", error);
        if (window.location.pathname === '/' || window.location.pathname === '/login') {
          navigate('/app/profile-setup');
        }
      }
    };

    handleAutoRedirect();
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/otp" element={<OTPVerification />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-success" element={<ResetSuccess />} />

      {/* Protected routes */}
      <Route
        path="/app"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="profile-setup" element={<ProfileSetup />} />
        <Route path="profile" element={<Profile />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="tax" element={<TaxCalculation />} />
        <Route path="loans" element={<LoanManagement />} />
        <Route path="assets" element={<AssetManagement />} />
        <Route path="currency" element={<CurrencyConverter />} />
        <Route path="insurance" element={<Insurance />} />
        <Route path="add-transaction" element={<AddTransaction />} />
      </Route>
      <Route path="/ping" element={<div className="p-6">pong</div>} />
    </Routes>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          {/* Fallback prevents blank screen if a lazy page throws while loading */}
          <Suspense fallback={<div className="p-6 text-center">Loading…</div>}>
            <div className="min-h-screen bg-gray-50">
              <AppRouter />
            </div>
          </Suspense>
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}
