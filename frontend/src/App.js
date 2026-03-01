import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css'; // นำเข้า CSS ตัวเดิมของคุณ

// นำเข้าแต่ละหน้า (Pages) ที่เราแยกไฟล์ไว้
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductDetail from './pages/ProductDetail';
import Profile from './pages/Profile';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => localStorage.getItem('mhs_logged_in') === 'true'
  );

  const handleLoginSuccess = () => {
    localStorage.setItem('mhs_logged_in', 'true');
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('mhs_logged_in');
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home isLoggedIn={false} onLogout={handleLogout} />} />
        <Route path="/home" element={<Home isLoggedIn={false} onLogout={handleLogout} />} />
        <Route
          path="/home-user"
          element={
            isLoggedIn ? <Home isLoggedIn={true} onLogout={handleLogout} /> : <Navigate to="/home" replace />
          }
        />
        <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/product/:productId" element={<ProductDetail />} />
          <Route
          path="/profile"
          element={
            isLoggedIn ? <Profile isLoggedIn={true} onLogout={handleLogout} /> : <Navigate to="/home" replace />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;