import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import ProductCard from '../components/product/ProductCard';

function Search({ isLoggedIn, onLogout }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ดึงสินค้าทั้งหมดจาก API ครั้งเดียว
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch('http://localhost:9000/api/product');
        if (res.ok) {
          const data = await res.json();
          setAllProducts(data);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // กรองสินค้าที่ชื่อตรงกับคำค้นหา (case-insensitive)
  const results = allProducts.filter((p) =>
    p.name?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="App" style={{ backgroundColor: 'white', minHeight: '100vh' }}>
      <Header
        isLoggedIn={isLoggedIn}
        onSignIn={() => navigate('/login')}
        onRegister={() => navigate('/register')}
        onLogout={onLogout}
      />

      <div style={{ padding: '100px 60px 40px 60px' }}>
        {/* หัวข้อแสดงผลการค้นหา */}
        <h2 style={{ marginBottom: '8px', fontSize: '22px', color: '#333' }}>
          Search results for: <span style={{ color: '#666C49' }}>"{query}"</span>
        </h2>
        <p style={{ color: '#888', marginBottom: '40px', fontSize: '14px' }}>
          {loading ? 'Searching...' : `${results.length} item${results.length !== 1 ? 's' : ''} found`}
        </p>

        {loading ? (
          <p style={{ color: '#aaa' }}>Loading...</p>
        ) : results.length === 0 ? (
          // ไม่พบสินค้า
          <div style={{ textAlign: 'center', marginTop: '80px' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🔍</div>
            <h3 style={{ color: '#555', marginBottom: '8px' }}>No results found</h3>
            <p style={{ color: '#aaa', fontSize: '14px' }}>
              Try different keywords or browse all products
            </p>
            <button
              onClick={() => navigate(isLoggedIn ? '/home-user' : '/home')}
              style={{
                marginTop: '24px',
                padding: '10px 24px',
                backgroundColor: '#666C49',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              Browse All Products
            </button>
          </div>
        ) : (
          // แสดงสินค้าที่ค้นพบ
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '60px 20px',
            }}
          >
            {results.map((product) => (
              <ProductCard
                key={product._id}
                id={product._id}
                sellerName={product.seller?.username || 'Seller'}
                sellerImage={
                  product.seller?.images?.[0] ||
                  'https://i.pravatar.cc/150?u=default'
                }
                productImage={product.images?.[0]}
                itemName={product.name}
                itemPrice={product.price}
                stock={product.stock}
                sellerRating={product.seller?.rating || 0}
              />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default Search;
