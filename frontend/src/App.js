import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css'; // นำเข้า CSS ตัวเดิมของคุณ

// นำเข้าแต่ละหน้า (Pages) ที่เราแยกไฟล์ไว้
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => localStorage.getItem('mhs_logged_in') === 'true'
  );
  const [currentUser, setCurrentUser] = useState(() => {
    const raw = localStorage.getItem('mhs_user');
    if (!raw) {
      return null;
    }
    try {
      return JSON.parse(raw);
    } catch (error) {
      return null;
    }
  });

  const handleLoginSuccess = (user) => {
    localStorage.setItem('mhs_logged_in', 'true');
    if (user) {
      localStorage.setItem('mhs_user', JSON.stringify(user));
      setCurrentUser(user);
    }
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('mhs_logged_in');
    localStorage.removeItem('mhs_user');
    setCurrentUser(null);
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
        <Route
          path="/profile"
          element={
            isLoggedIn ? <Profile isLoggedIn={true} onLogout={handleLogout} user={currentUser} /> : <Navigate to="/home" replace />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;