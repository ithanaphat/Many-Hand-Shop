import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
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
import Search from './pages/Search';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);

  return null;
}


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
    localStorage.removeItem('mhs_user_id');
    localStorage.removeItem('mhs_user_name');
    localStorage.removeItem('mhs_user_images');
    localStorage.removeItem('mhs_user_rating');
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <ScrollToTop />
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
        <Route
          path="/search"
          element={<Search isLoggedIn={isLoggedIn} onLogout={handleLogout} />}
        />
      </Routes>
    </Router>
  );
}

export default App;