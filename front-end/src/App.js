import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar      from './components/Navbar';
import Login       from './pages/Login';
import Dashboard   from './pages/Dashboard';
import Vehicles    from './pages/Vehicles';
import Customers   from './pages/Customers';
import Promotions  from './pages/Promotions';
import PromoVehicles from './pages/PromoVehicles';
import Report      from './pages/Report';
import './App.css';

function PrivateRoutes() {
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-page-gradient">
      <div className="text-swift-800 text-sm font-medium animate-pulse-soft">Loading session...</div>
    </div>
  );

  if (!user) return <Login />;

  return (
    <div className="min-h-screen bg-page-gradient">
      <Navbar />
      <main>
        <Routes>
          <Route path="/"               element={<Dashboard />} />
          <Route path="/vehicles"       element={<Vehicles />} />
          <Route path="/customers"      element={<Customers />} />
          <Route path="/promotions"     element={<Promotions />} />
          <Route path="/promo-vehicles" element={<PromoVehicles />} />
          <Route path="/report"         element={<Report />} />
          <Route path="*"               element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <PrivateRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
