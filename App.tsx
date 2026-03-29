
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Admin/Dashboard';
import Orders from './pages/Admin/Orders';
import Clients from './pages/Admin/Clients';
import Workers from './pages/Admin/Workers';
import PriceManagement from './pages/Admin/PriceManagement';
import Settings from './pages/Admin/Settings';
import ClientPortal from './pages/Client/Portal';
import AccountSecurity from './pages/AccountSecurity';
import Layout from './components/Layout';

const App: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('matbaaty_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData: any) => {
    setUser(userData);
    localStorage.setItem('matbaaty_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('matbaaty_user');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="relative mb-6">
             <img src="https://i.ibb.co/60Md0hTy/jg.png" className="w-32 animate-pulse" alt="Jaguar Graphic" />
             <div className="absolute -inset-4 bg-[#e2006a]/20 blur-3xl rounded-full -z-10 animate-pulse"></div>
          </div>
          <p className="text-white font-black tracking-[0.5em] uppercase text-xs animate-pulse">Jaguar Graphic Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!user ? <Login onLogin={handleLogin} /> : <Navigate to={user.role === 'ADMIN' ? '/admin' : user.role === 'WORKER' ? '/admin/orders' : '/client'} />} />
        
        {/* Shared Routes (Admin & Client only, Worker excluded from security) */}
        <Route 
          path="/account-security" 
          element={user && user.role !== 'WORKER' ? <Layout user={user} onLogout={handleLogout}><AccountSecurity user={user} /></Layout> : <Navigate to="/login" />} 
        />

        {/* Admin Routes */}
        <Route path="/admin" element={user?.role === 'ADMIN' ? <Layout user={user} onLogout={handleLogout}><Dashboard /></Layout> : <Navigate to="/login" />} />
        <Route path="/admin/orders" element={(user?.role === 'ADMIN' || user?.role === 'WORKER') ? <Layout user={user} onLogout={handleLogout}><Orders user={user} /></Layout> : <Navigate to="/login" />} />
        <Route path="/admin/clients" element={user?.role === 'ADMIN' ? <Layout user={user} onLogout={handleLogout}><Clients /></Layout> : <Navigate to="/login" />} />
        <Route path="/admin/workers" element={user?.role === 'ADMIN' ? <Layout user={user} onLogout={handleLogout}><Workers /></Layout> : <Navigate to="/login" />} />
        <Route path="/admin/prices" element={user?.role === 'ADMIN' ? <Layout user={user} onLogout={handleLogout}><PriceManagement /></Layout> : <Navigate to="/login" />} />
        <Route path="/admin/settings" element={user?.role === 'ADMIN' ? <Layout user={user} onLogout={handleLogout}><Settings /></Layout> : <Navigate to="/login" />} />

        {/* Client Routes */}
        <Route path="/client" element={user?.role === 'CLIENT' ? <Layout user={user} onLogout={handleLogout}><ClientPortal user={user} /></Layout> : <Navigate to="/login" />} />

        {/* Default redirect */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
