import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import './Profile.css';
import 'boxicons/css/boxicons.min.css';
import Header from '../components/layout/Header';
import InfoItem from '../components/shared/InfoItem';
import ProductItem from '../components/product/ProductItem';
 
function SellerProfile({ isLoggedIn, onLogout }) {
  const { sellerId } = useParams();
  const navigate = useNavigate();
  const maxRating = 5;
  const formatRatingDate = (value) => {
    if (!value) return '-';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '-';
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
 
  const [seller, setSeller] = useState(null);
  const [sellerProducts, setSellerProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [ratingDetails, setRatingDetails] = useState([]);
  const [isLoadingRatings, setIsLoadingRatings] = useState(false);
 
  const handleSignIn = () => {
    navigate('/login');
  };
 
  const handleRegister = () => {
    navigate('/register');
  };
 
  useEffect(() => {
    if (!sellerId) return;
 
    const loadSeller = async () => {
      try {
        const [userRes, productsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/user/${sellerId}`),
          fetch(`${API_BASE_URL}/api/product?seller=${sellerId}`),
        ]);
 
        if (userRes.ok) {
          const data = await userRes.json();
          setSeller({
            username: data.username || 'Seller',
            email: data.email || '',
            phone: data.phone || '',
            address: data.address || '',
            images: data.images || [],
            backgroundImage: data.backgroundImage || '',
            rating: data.rating || 0,
            ratingCount: data.ratingCount || 0,
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
        <Header isLoggedIn={isLoggedIn} onSignIn={handleSignIn} onRegister={handleRegister} onLogout={onLogout} />
        <p style={{ textAlign: 'center', marginTop: 120, color: '#999' }}>Loading seller profile...</p>
      </div>
    );
  }
 
  if (!seller) {
    return (
      <div className="profile-page">
        <Header isLoggedIn={isLoggedIn} onSignIn={handleSignIn} onRegister={handleRegister} onLogout={onLogout} />
        <p style={{ textAlign: 'center', marginTop: 120, color: '#999' }}>Seller not found.</p>
      </div>
    );
  }
 
  const ratingValue = Number(seller.rating || 0);
  const ratingDisplay = ratingValue > 0
    ? (Number.isInteger(ratingValue) ? String(ratingValue) : ratingValue.toFixed(1))
    : '0/0';
  const fullStars = Math.floor(ratingValue);
  const partialStar = ratingValue % 1;
  const avatarUrl = seller.images && seller.images[0]
    ? seller.images[0]
    : `https://i.pravatar.cc/150?u=${seller.username}`;

  const getStarStyle = (index) => {
    if (index < fullStars) {
      return { color: '#f5b301' };
    }

    if (index === fullStars && partialStar > 0) {
      return {
        background: `linear-gradient(to right, #f5b301 ${partialStar * 100}%, #c8cfc0 ${partialStar * 100}%)`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      };
    }

    return { color: '#c8cfc0' };
  };
 
  // Helper function to extract province from address string
  const getProvince = (addressStr) => {
    if (!addressStr) return '';
    const parts = addressStr.split(',').map(p => p.trim());
    // Format: "houseNumber, subDistrict, district, province, postalCode"
    // Province is at index 3
    return parts[3] || '';
  };
 
  const openRatingDetails = async () => {
    if (!sellerId) return;
 
    setIsRatingModalOpen(true);
    setIsLoadingRatings(true);
 
    try {
      const response = await fetch(`${API_BASE_URL}/api/order/seller/${sellerId}/ratings`);
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setRatingDetails([]);
        return;
      }
      setRatingDetails(Array.isArray(data.ratings) ? data.ratings : []);
    } catch (error) {
      setRatingDetails([]);
    } finally {
      setIsLoadingRatings(false);
    }
  };
 
  const closeRatingModal = () => {
    setIsRatingModalOpen(false);
  };
 
  return (
    <div className="profile-page">
      <Header isLoggedIn={isLoggedIn} onSignIn={handleSignIn} onRegister={handleRegister} onLogout={onLogout} />
 
      {/* Banner */}
      <div className="banner-container" style={{ backgroundImage: `url('${seller.backgroundImage || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
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
            <div className="pd-rating">
              <span
                className="pd-rating-badge"
                onClick={openRatingDetails}
                style={{ cursor: 'pointer' }}
                title="View rating details"
              >
                <span className="pd-rating-label">Rating</span>
                <span className="pd-rating-stars" aria-label={`Rating ${ratingValue || 0} out of ${maxRating}`}>
                  {Array.from({ length: maxRating }).map((_, index) => (
                    <span key={index} style={getStarStyle(index)}>★</span>
                  ))}
                </span>
                <span className="pd-rating-number">{ratingValue > 0 ? `${ratingDisplay}/${maxRating}` : ratingDisplay}</span>
              </span>
            </div>
          </div>
        </div>
 
        <div className="profile-sections">
          {/* Information */}
          <div className="info-section section-card">
            <h3 className="section-header">Information</h3>
            {seller.email && <InfoItem icon="📧" text={seller.email} />}
            {seller.phone && <InfoItem icon="📞" text={seller.phone} />}
            {seller.address && <InfoItem icon="📍" text={getProvince(seller.address)} />}
            {!seller.email && !seller.phone && !seller.address && (
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
 
      {isRatingModalOpen && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={closeRatingModal}
        >
          <div
            style={{ background: '#fff', borderRadius: '16px', padding: '28px 24px', minWidth: '320px', maxWidth: '480px', width: '90%', maxHeight: '80vh', overflowY: 'auto', boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>Seller Ratings</h3>
              <button onClick={closeRatingModal} style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: '#666', lineHeight: 1 }}>✕</button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', padding: '12px', background: '#f9f9f9', borderRadius: '10px' }}>
              <span style={{ fontSize: '32px', fontWeight: 700, color: '#f5b301' }}>{ratingValue > 0 ? ratingDisplay : '0'}</span>
              <div>
                <div style={{ display: 'flex', gap: '2px' }}>
                  {Array.from({ length: maxRating }).map((_, i) => (
                    <span key={i} style={{ fontSize: '18px', ...getStarStyle(i) }}>★</span>
                  ))}
                </div>
                <span style={{ fontSize: '13px', color: '#888' }}>{Number(seller.ratingCount || 0)} {Number(seller.ratingCount || 0) === 1 ? 'review' : 'reviews'}</span>
              </div>
            </div>
            {isLoadingRatings ? (
              <p style={{ textAlign: 'center', color: '#888', padding: '20px 0' }}>Loading...</p>
            ) : ratingDetails.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#888', padding: '20px 0' }}>No reviews yet</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {ratingDetails.map((entry) => (
                  <div key={entry.orderItemId || `${entry.orderId}-${entry.product?.name || 'product'}`} style={{ padding: '12px', border: '1px solid #eee', borderRadius: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                      <img
                        src={entry.reviewer?.images?.[0] || `https://i.pravatar.cc/40?u=${entry.reviewer?._id}`}
                        alt={entry.reviewer?.username || 'Anonymous'}
                        style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div>
                        <p style={{ margin: 0, fontWeight: 600, fontSize: '14px' }}>{entry.reviewer?.username || 'Anonymous'}</p>
                        <div style={{ display: 'flex', gap: '1px' }}>
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span key={i} style={{ fontSize: '14px', color: i < Number(entry.rating || 0) ? '#f5b301' : '#ddd' }}>★</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    {entry.product?.name && (
                      <p style={{ margin: 0, fontSize: '12px', color: '#888' }}>Product: {entry.product.name}</p>
                    )}
                    {entry.ratedAt && (
                      <p style={{ margin: 0, fontSize: '12px', color: '#aaa' }}>{formatRatingDate(entry.ratedAt)}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
 
export default SellerProfile;