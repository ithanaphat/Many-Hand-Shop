import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './App.css'; // นำเข้า CSS ตัวเดิมของคุณ

// นำเข้าแต่ละหน้า (Pages) ที่เราแยกไฟล์ไว้
import Home from './pages/Home';
import AllProducts from './pages/AllProducts';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductDetail from './pages/ProductDetail';
import Profile from './pages/Profile';
import SellerProfile from './pages/SellerProfile';
import SellerBoard from './pages/SellerBoard';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Search from './pages/Search';
import OrderHistory from './pages/OrderHistory';

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
    localStorage.removeItem('mhs_user_email');
    localStorage.removeItem('mhs_user_phone');
    localStorage.removeItem('mhs_user_address');
    localStorage.removeItem('mhs_user_images');
    localStorage.removeItem('mhs_user_rating');
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home isLoggedIn={isLoggedIn} onLogout={handleLogout} />} />
        <Route path="/products" element={<AllProducts isLoggedIn={isLoggedIn} onLogout={handleLogout} />} />
        <Route path="/product/:productId" element={<ProductDetail isLoggedIn={isLoggedIn} onLogout={handleLogout} />} />
        <Route path="/seller/:sellerId" element={<SellerProfile isLoggedIn={isLoggedIn} onLogout={handleLogout} />} />
        <Route path="/search" element={<Search isLoggedIn={isLoggedIn} onLogout={handleLogout} />} />

        {/* Auth routes — redirect to / if already logged in */}
        <Route
          path="/login"
          element={isLoggedIn ? <Navigate to="/" replace /> : <Login onLoginSuccess={handleLoginSuccess} />}
        />
        <Route
          path="/register"
          element={isLoggedIn ? <Navigate to="/" replace /> : <Register />}
        />

        {/* Protected routes — redirect to /login if not logged in */}
        <Route
          path="/profile"
          element={isLoggedIn ? <Profile isLoggedIn={true} onLogout={handleLogout} /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/seller-board"
          element={isLoggedIn ? <SellerBoard isLoggedIn={true} onLogout={handleLogout} /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/cart"
          element={isLoggedIn ? <Cart isLoggedIn={true} onLogout={handleLogout} /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/checkout"
          element={isLoggedIn ? <Checkout isLoggedIn={true} onLogout={handleLogout} /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/orders"
          element={isLoggedIn ? <OrderHistory isLoggedIn={true} onLogout={handleLogout} /> : <Navigate to="/login" replace />}
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;