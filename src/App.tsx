import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import ProfileSetup from './pages/ProfileSetup';
import Dashboard from './pages/Dashboard';
import TaxCalculation from './pages/TaxCalculation';
import LoanManagement from './pages/LoanManagement';
import AssetManagement from './pages/AssetManagement';
import CurrencyConverter from './pages/CurrencyConverter';
import Insurance from './pages/Insurance';
import AddTransaction from './pages/AddTransaction';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
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
            </Routes>
          </div>
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;