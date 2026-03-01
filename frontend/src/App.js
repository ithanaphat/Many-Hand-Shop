import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css'; // นำเข้า CSS ตัวเดิมของคุณ

// นำเข้าแต่ละหน้า (Pages) ที่เราแยกไฟล์ไว้
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductDetail from './pages/ProductDetail';
import Profile from './pages/Profile';
import SellerBoard from './pages/SellerBoard';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';


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
        <Route path="/" element={<Home isLoggedIn={isLoggedIn} onLogout={handleLogout} />} />
        <Route path="/home" element={<Home isLoggedIn={isLoggedIn} onLogout={handleLogout} />} />
        <Route
          path="/home-user"
          element={
            isLoggedIn ? <Home isLoggedIn={true} onLogout={handleLogout} /> : <Navigate to="/home" replace />
          }
        />
        <Route
          path="/login"
          element={
            isLoggedIn ? <Navigate to="/home-user" replace /> : <Login onLoginSuccess={handleLoginSuccess} />
          }
        />
        <Route
          path="/register"
          element={
            isLoggedIn ? <Navigate to="/home-user" replace /> : <Register />
          }
        />
        <Route path="/product/:productId" element={<ProductDetail isLoggedIn={isLoggedIn} onLogout={handleLogout} />} />
        <Route
          path="/profile"
          element={
            isLoggedIn ? <Profile isLoggedIn={true} onLogout={handleLogout} /> : <Navigate to="/home" replace />
          }
        />
        <Route
          path="/seller-board"
          element={
            isLoggedIn ? <SellerBoard isLoggedIn={true} onLogout={handleLogout} /> : <Navigate to="/home" replace />
          }
        />
        <Route
          path="/checkout"
          element={
            isLoggedIn ? <Checkout isLoggedIn={true} onLogout={handleLogout} /> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/cart"
          element={
            isLoggedIn ? <Cart isLoggedIn={true} onLogout={handleLogout} /> : <Navigate to="/login" replace />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;