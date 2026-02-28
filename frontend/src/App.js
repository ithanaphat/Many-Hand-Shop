import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css'; // นำเข้า CSS ตัวเดิมของคุณ

// นำเข้าแต่ละหน้า (Pages) ที่เราแยกไฟล์ไว้
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => localStorage.getItem('mhs_logged_in') === 'true'
  );

  const handleLoginSuccess = () => {
    localStorage.setItem('mhs_logged_in', 'true');
    setIsLoggedIn(true);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home isLoggedIn={false} />} />
        <Route path="/home" element={<Home isLoggedIn={false} />} />
        <Route
          path="/home-user"
          element={
            isLoggedIn ? <Home isLoggedIn={true} /> : <Navigate to="/login" replace />
          }
        />
        <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;