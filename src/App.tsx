// src/App.tsx
import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { DataProvider } from "./contexts/DataContext";
import Layout from "./components/Layout";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProfileSetup from "./pages/ProfileSetup";
import Dashboard from "./pages/Dashboard";
import TaxCalculation from "./pages/TaxCalculation";
import LoanManagement from "./pages/LoanManagement";
import AssetManagement from "./pages/AssetManagement";
import CurrencyConverter from "./pages/CurrencyConverter";
import Insurance from "./pages/Insurance";
import AddTransaction from "./pages/AddTransaction";
import PrivateRoute from "./components/PrivateRoute";

const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetSuccess   = lazy(() => import("./pages/ResetSuccess"));

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          {/* Fallback prevents blank screen if a lazy page throws while loading */}
          <Suspense fallback={<div className="p-6 text-center">Loading…</div>}>
            <div className="min-h-screen bg-gray-50">
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
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
            </div>
          </Suspense>
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}
