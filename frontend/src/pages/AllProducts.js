import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import ProductCard from '../components/product/ProductCard';
import './AllProducts.css';

function AllProducts({ isLoggedIn, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [displayCount, setDisplayCount] = useState(12);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // read both ?category= and ?q= from URL
  const params = new URLSearchParams(location.search);
  const searchQuery = (params.get('q') || '').toLowerCase().trim();
  const isSearchMode = searchQuery.length > 0;

  useEffect(() => {
    const p = new URLSearchParams(location.search);
    const categoryFromQuery = (p.get('category') || 'all').toLowerCase();
    setSelectedCategory(categoryFromQuery);
    setDisplayCount(12);
  }, [location.search]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/product/categories');
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/product');
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleShowMore = () => {
    setDisplayCount((prev) => prev + 12);
  };

  const filteredProducts = products
    .filter((product) => {
      // category filter
      if (selectedCategory === 'all') return true;
      const productCategory = typeof product.category === 'object'
        ? product.category?.name
        : product.category;
      return (productCategory || '').toLowerCase() === selectedCategory;
    })
    .filter((product) => {
      // text search filter
      if (!isSearchMode) return true;
      return (product.name || '').toLowerCase().includes(searchQuery);
    });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if ((a.stock ?? 0) === 0 && (b.stock ?? 0) > 0) return 1;
    if ((a.stock ?? 0) > 0 && (b.stock ?? 0) === 0) return -1;
    return 0;
  });

  const visibleProducts = sortedProducts.slice(0, displayCount);
  const activeCategoryLabel = selectedCategory === 'all'
    ? 'ALL CATALOG'
    : selectedCategory.toUpperCase();

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    setDisplayCount(12);
  };

  return (
    <div className="all-products-page">
      <Header 
        isLoggedIn={isLoggedIn} 
        onLogout={onLogout}
        onSignIn={() => navigate('/login')}
        onRegister={() => navigate('/register')}
      />
      
      <div className="all-products-container">
        <div className="products-header">
          {isSearchMode ? (
            <>
              <h1>Search Results</h1>
              <p className="product-count">
                {loading ? 'Searching...' : `${filteredProducts.length} item${filteredProducts.length !== 1 ? 's' : ''} found for "${params.get('q')}"`}
              </p>
            </>
          ) : (
            <>
              <h1>ALL PRODUCTS</h1>
              <p className="product-count">
                {loading ? 'Loading...' : `Showing ${visibleProducts.length} of ${filteredProducts.length} products`}
              </p>
            </>
          )}
          <div className="products-toolbar">
            <div className="products-stats">
              <div className="products-stat-pill">
                <span className="stat-label">Active</span>
                <span className="stat-value">{activeCategoryLabel}</span>
              </div>
            </div>
            <div className="category-filter-wrap">
              <label htmlFor="category-filter" className="category-filter-label">Catalog</label>
              <select
                id="category-filter"
                className="category-filter-select"
                value={selectedCategory}
                onChange={handleCategoryChange}
              >
                <option value="all">ALL</option>
                {categories.map((category) => (
                  <option
                    key={category._id || category.name}
                    value={(category.name || '').toLowerCase()}
                  >
                    {(category.name || '').toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="loading-state">
            <p>Loading products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="empty-state" style={{ textAlign: 'center', marginTop: '80px' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🔍</div>
            <h3 style={{ color: '#555', marginBottom: '8px' }}>
              {isSearchMode ? 'No results found' : 'No products found'}
            </h3>
            <p style={{ color: '#aaa', fontSize: '14px' }}>
              {isSearchMode ? 'Try different keywords or browse all products' : 'Check back later'}
            </p>
            {isSearchMode && (
              <button
                onClick={() => navigate('/products')}
                style={{
                  marginTop: '24px', padding: '10px 24px',
                  backgroundColor: '#666C49', color: 'white',
                  border: 'none', borderRadius: '8px',
                  cursor: 'pointer', fontSize: '14px',
                }}
              >
                Browse All Products
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="product-grid all-grid">
              {visibleProducts.map((product) => (
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
              ))}
            </div>

            {visibleProducts.length < filteredProducts.length && (
              <div className="show-more-container">
                <button className="show-more-btn" onClick={handleShowMore}>
                  LOAD MORE
                </button>
              </div>
            )}
          </>
        )}
      </div>
      
      <Footer />
    </div>
  );
}

export default AllProducts;
