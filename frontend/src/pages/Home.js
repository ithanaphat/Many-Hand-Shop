import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="App" style={{ backgroundColor: 'white', minHeight: '100vh' }}>
      <Header
        onSignIn={() => navigate('/login')}
        onRegister={() => navigate('/register')}
      />
      
      <div style={{ padding: '100px 20px', display: 'flex', flexWrap: 'wrap', gap: '30px', justifyContent: 'center' }}>
        
        {/* การ์ดใบที่ 1: Mock Data เป็นเสื้อยืด */}
        <ProductCard 
          sellerName="Alice"
          sellerImage="https://i.pravatar.cc/150?u=a042581f4e29026024d"
          productImage="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500"
          itemName="Vintage T-Shirt is very nice shirt my mom gave me when i as child"
          itemPrice="1545448"
        />

        {/* การ์ดใบที่ 2: Mock Data เป็นกล้องฟิล์ม */}
        <ProductCard 
          sellerName="Bob"
          sellerImage="https://i.pravatar.cc/150?u=a042581f4e29026704d"
          productImage="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500"
          itemName="Film Camera"
          itemPrice="85"
        />

        {/* การ์ดใบที่ 3: Mock Data เป็นกางเกงยีนส์ */}
        <ProductCard 
          sellerName="Charlie"
          sellerImage="https://i.pravatar.cc/150?u=a04258a2462d826712d"
          productImage="https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500"
          itemName="Jeans"
          itemPrice="30"
        />

      </div>
    </div>
  );
}

export default Home;