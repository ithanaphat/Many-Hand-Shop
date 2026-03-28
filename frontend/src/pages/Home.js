import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import ProductCard from '../components/product/ProductCard';
import './Home.css'; // นำเข้าไฟล์ CSS

const categoryIcons = {
  sport: '⚽',
  furniture: '🛋️',
  fashion: '👗',
  book: '📖',
  electronics: '💻',
  beauty: '💄',
  'baby & kids': '🍼',
  'pet supplies': '🐾',
  all: '🛍️',
};

function Home({ isLoggedIn, onLogout }) {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleCatalogClick = (categoryName) => {
    const normalizedCategory = (categoryName || 'all').toLowerCase();
    navigate(`/products?category=${encodeURIComponent(normalizedCategory)}`);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/product/categories');
        if (res.ok) {
          const data = await res.json();
          // append 'All' entry at the end
          setCategories([
            ...data,
            { name: 'all', displayName: 'All' },
          ]);
        }
      } catch (err) {
        // fallback: show nothing, user can still browse
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const [productsResponse, popularResponse] = await Promise.all([
          fetch('/api/product'),
          fetch('/api/product/popular?limit=4'),
        ]);

        if (productsResponse.ok) {
          const data = await productsResponse.json();
          setProducts(data);

          if (popularResponse.ok) {
            const popularData = await popularResponse.json();
            setPopularProducts(Array.isArray(popularData) ? popularData : data.slice(0, 4));
          } else {
            setPopularProducts(data.slice(0, 4));
          }
        } else {
          setProducts([]);
          setPopularProducts([]);
        }
      } catch (err) {
        setProducts([]);
        setPopularProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const sortedProducts = React.useMemo(() => {
    return [...products].sort((a, b) => {
      if ((a.stock ?? 0) === 0 && (b.stock ?? 0) > 0) return 1;
      if ((a.stock ?? 0) > 0 && (b.stock ?? 0) === 0) return -1;
      return 0; // 👈 ที่เหลือ "ไม่เรียง"
    });
  }, [products]);

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
                popularSoldCount={Number(product.totalSold || 0)}
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
                <div className="catalog-icon">{categoryIcons[cat.name.toLowerCase()] || '🏷️'}</div>
                <div className="catalog-name">{(cat.displayName || cat.name).toUpperCase()}</div>
              </div>
            ))}
          </div>
        </div>

        {/* รายการสินค้าทั้งหมด */}
        <div className="product-grid main-grid">
          {loading ? (
            <p>Loading products...</p>
          ) : (
            sortedProducts.map((product) => (
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