import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header'; // ดึง Header มาใช้

function Home() {
  const navigate = useNavigate();
  
  return (
    <div className="App" style={{ backgroundColor: 'white', minHeight: '100vh' }}>
      <Header
        onSignIn={() => navigate('/login')}
        onRegister={() => navigate('/register')}
      />
      {/* ใส่เนื้อหาหน้า Home เพิ่มเติมตรงนี้ได้เลยครับ */}
    </div>
  );
}

export default Home;