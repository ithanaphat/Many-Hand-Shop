import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import ProductCard from '../components/product/ProductCard';
import './Home.css'; // นำเข้าไฟล์ CSS

const categories = [
  { name: 'SPORT', icon: '⚽' },
  { name: 'FURNITURE', icon: '🛋️' },
  { name: 'FASHION', icon: '👗' },
  { name: 'BOOK', icon: '📖' },
  { name: 'ELECTRONICS', icon: '💻' },
  { name: 'ALL', icon: '📱' },
];

function Home({ isLoggedIn, onLogout }) {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]); // top items for the popular section
  const [loading, setLoading] = useState(true);

  const handleCatalogClick = (categoryName) => {
    const normalizedCategory = (categoryName || 'all').toLowerCase();
    navigate(`/products?category=${encodeURIComponent(normalizedCategory)}`);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      console.log('⏱️ fetching products from backend');
      try {
        const response = await fetch('http://localhost:9000/api/product');
        console.log('🗂️ response status', response.status);
        if (response.ok) {
          const data = await response.json();
          console.log('✅ got products', data.length, 'items');
          setProducts(data);
          // derive popular products from the full list. you can adjust criteria (rating, sold count, etc.)
          setPopularProducts(data.slice(0, 4));
        } else {
          console.warn('⚠️ backend returned non-OK status', response.status);
          // Fallback mock data
          const mock = [
            { _id: 1, name: "item name", price: "99", sellerName: "Name", sellerImage: "https://i.pravatar.cc/150?u=1" },
            { _id: 2, name: "item name", price: "99", sellerName: "Name", sellerImage: "https://i.pravatar.cc/150?u=2" },
            { _id: 3, name: "item name", price: "99", sellerName: "Name", sellerImage: "https://i.pravatar.cc/150?u=3" },
            { _id: 4, name: "item name", price: "99", sellerName: "Name", sellerImage: "https://i.pravatar.cc/150?u=4" },
          ];
          setProducts(mock);
          setPopularProducts(mock.slice(0, 4));
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setProducts([
          { _id: 1, name: "item name", price: "99", sellerName: "Name", sellerImage: "https://i.pravatar.cc/150?u=1" },
          { _id: 2, name: "item name", price: "99", sellerName: "Name", sellerImage: "https://i.pravatar.cc/150?u=2" },
          { _id: 3, name: "item name", price: "99", sellerName: "Name", sellerImage: "https://i.pravatar.cc/150?u=3" },
          { _id: 4, name: "item name", price: "99", sellerName: "Name", sellerImage: "https://i.pravatar.cc/150?u=4" },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="home-page">
      <Header 
        isLoggedIn={isLoggedIn} 
        onLogout={onLogout}
        onSignIn={() => navigate('/login')}
        onRegister={() => navigate('/register')}
      />
      
      {/* 1. Popular Section (พื้นหลังสีเขียว) */}
      <section className="popular-section">
        <div className="container">
          <div className="popular-badge">
            <span className="star-icon">✪</span> POPULAR
          </div>
          <div className="product-grid">
            {popularProducts.map((product) => (
              <ProductCard 
                key={`pop-${product._id}`}
                id={product._id}
                sellerId={product.seller?._id}
                sellerName={product.seller?.username || product.sellerName || 'Seller'}
                sellerImage={product.seller?.images?.[0] || product.sellerImage || 'https://i.pravatar.cc/150?u=default'}
                productImage={product.images?.[0]}
                itemName={product.name}
                itemPrice={product.price}
                stock={product.stock}
                sellerRating={product.seller?.rating || product.sellerRating || 0}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 2. Catalog และ Main Grid */}
      <main className="main-content container">
        
        {/* แถบหมวดหมู่ */}
        <div className="catalog-box">
          <h2 className="catalog-title">catalog</h2>
          <div className="catalog-items">
            {categories.map((cat) => (
              <div
                key={cat.name}
                className="catalog-item"
                onClick={() => handleCatalogClick(cat.name)}
              >
                <div className="catalog-icon">{cat.icon}</div>
                <div className="catalog-name">{cat.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* รายการสินค้าทั้งหมด */}
        <div className="product-grid main-grid">
          {loading ? (
            <p>Loading products...</p>
          ) : (
            products.map((product) => (
              <ProductCard 
                key={product._id}
                id={product._id}
                sellerId={product.seller?._id}
                sellerName={product.seller?.username || product.sellerName || 'Seller'}
                sellerImage={product.seller?.images?.[0] || product.sellerImage || 'https://i.pravatar.cc/150?u=default'}
                productImage={product.images?.[0]}
                itemName={product.name}
                itemPrice={product.price}
                stock={product.stock}
                sellerRating={product.seller?.rating || product.sellerRating || 0}
              />
            ))
          )}
        </div>

        {/* ปุ่ม Show More */}
        <div className="show-more-container">
          <button 
            className="show-more-btn"
            onClick={() => navigate('/products')}
          >
            SHOW MORE
          </button>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default Home;