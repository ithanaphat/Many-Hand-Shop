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

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryFromQuery = (params.get('category') || 'all').toLowerCase();
    setSelectedCategory(categoryFromQuery);
    setDisplayCount(12);
  }, [location.search]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:9000/api/product/categories');
        if (response.ok) {
          const data = await response.json();
          console.log('✅ got categories', data.length);
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
      console.log('⏱️ fetching all products from backend');
      try {
        const response = await fetch('http://localhost:9000/api/product');
        console.log('🗂️ response status', response.status);
        if (response.ok) {
          const data = await response.json();
          console.log('✅ got products', data.length, 'items');
          setProducts(data);
        } else {
          console.warn('⚠️ backend returned non-OK status', response.status);
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

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter((product) => {
        const productCategory = typeof product.category === 'object'
          ? product.category?.name
          : product.category;
        return (productCategory || '').toLowerCase() === selectedCategory;
      });

  const visibleProducts = filteredProducts.slice(0, displayCount);
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
          <h1>ALL PRODUCTS</h1>
          <p className="product-count">
            {loading ? 'Loading...' : `Showing ${visibleProducts.length} of ${filteredProducts.length} products`}
          </p>
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
        ) : products.length === 0 ? (
          <div className="empty-state">
            <p>No products found</p>
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
