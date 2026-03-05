import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Profile.css';
import 'boxicons/css/boxicons.min.css';
import Header from '../components/layout/Header';
import InfoItem from '../components/shared/InfoItem';
import ProductItem from '../components/product/ProductItem';

function SellerProfile({ isLoggedIn, onLogout }) {
  const { sellerId } = useParams();
  const navigate = useNavigate();
  const maxRating = 5;

  const [seller, setSeller] = useState(null);
  const [sellerProducts, setSellerProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sellerId) return;

    const loadSeller = async () => {
      try {
        const [userRes, productsRes] = await Promise.all([
          fetch(`/api/user/${sellerId}`),
          fetch(`/api/product?seller=${sellerId}`),
        ]);

        if (userRes.ok) {
          const data = await userRes.json();
          setSeller({
            username: data.username || 'Seller',
            email: data.email || '',
            phone: data.phone || '',
            address: data.address || '',
            images: data.images || [],
            rating: data.rating || 0,
          });
        }

        if (productsRes.ok) {
          const data = await productsRes.json();
          setSellerProducts(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error('Error loading seller profile:', err);
      } finally {
        setLoading(false);
      }
    };

    loadSeller();
  }, [sellerId]);

  if (loading) {
    return (
      <div className="profile-page">
        <Header isLoggedIn={isLoggedIn} onLogout={onLogout} />
        <p style={{ textAlign: 'center', marginTop: 120, color: '#999' }}>Loading seller profile...</p>
      </div>
    );
  }

  if (!seller) {
    return (
      <div className="profile-page">
        <Header isLoggedIn={isLoggedIn} onLogout={onLogout} />
        <p style={{ textAlign: 'center', marginTop: 120, color: '#999' }}>Seller not found.</p>
      </div>
    );
  }

  const ratingValue = Math.round(seller.rating);
  const avatarUrl = seller.images && seller.images[0]
    ? seller.images[0]
    : `https://i.pravatar.cc/150?u=${seller.username}`;

  return (
    <div className="profile-page">
      <Header isLoggedIn={isLoggedIn} onLogout={onLogout} />

      {/* Banner */}
      <div className="banner-container">
        <div className="avatar-wrapper">
          <div
            className="avatar-overlay"
            style={{ backgroundImage: `url('${avatarUrl}')` }}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="content-body">
        <div className="profile-header-row">
          <div>
            <h2 className="user-name">{seller.username}</h2>
            <p className="user-id">Seller</p>
          </div>
          <div className="profile-badges">
            <span className="profile-badge rating-badge">
              <span className="rating-label">Rating</span>
              <span className="rating-stars" aria-label={`Rating ${ratingValue} out of ${maxRating}`}>
                {Array.from({ length: maxRating }).map((_, index) => (
                  <span key={index} className={index < ratingValue ? 'star-filled' : 'star-empty'}>
                    ★
                  </span>
                ))}
              </span>
              <span className="rating-number">{ratingValue}/{maxRating}</span>
            </span>
          </div>
        </div>

        <div className="profile-sections">
          {/* Information */}
          <div className="info-section section-card">
            <h3 className="section-header">Information</h3>
            {seller.phone && <InfoItem icon="📞" text={seller.phone} />}
            {seller.address && <InfoItem icon="📍" text={seller.address} />}
            {!seller.phone && !seller.address && (
              <p style={{ color: '#bbb', fontSize: 14 }}>No contact info available</p>
            )}
          </div>

          {/* Products on Sell */}
          <div className="section-card">
            <div className="sell-header">
              <h3 style={{ margin: 0 }}>On Sell</h3>
              <button className="btn-total">TOTAL {sellerProducts.length}</button>
            </div>

            <div className="product-list-scroll">
              {sellerProducts.length > 0 ? (
                sellerProducts.map((product) => (
                  <ProductItem
                    key={product._id}
                    name={product.name}
                    price={product.price}
                    productImage={
                      Array.isArray(product.images) && product.images[0]
                        ? product.images[0]
                        : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300'
                    }
                    onClick={() => navigate(`/product/${product._id}`)}
                  />
                ))
              ) : (
                <p style={{ color: '#999', padding: '20px', textAlign: 'center', width: '100%' }}>
                  No products on sell yet
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SellerProfile;
