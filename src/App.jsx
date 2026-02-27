import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import RegisterPage from './pages/RegisterPage'
import SignInPage from './pages/SignInPage'
import HomeSignedInPage from './pages/HomeSignedInPage'
import CartPage from './pages/CartPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/home" element={<HomeSignedInPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
