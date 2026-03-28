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
  const formatRatingDate = (value) => {
    if (!value) return '-';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '-';
    return date.toLocaleDateString('en-GB', {
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
 
  const ratingValue = Math.round(seller.rating);
  const avatarUrl = seller.images && seller.images[0]
    ? seller.images[0]
    : `https://i.pravatar.cc/150?u=${seller.username}`;
 
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
      const response = await fetch(`/api/order/seller/${sellerId}/ratings`);
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        alert(data.message || 'Failed to load rating details');
        setRatingDetails([]);
        return;
      }
      setRatingDetails(Array.isArray(data.ratings) ? data.ratings : []);
    } catch (error) {
      alert('Cannot connect to server');
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
            <button
              type="button"
              className="profile-badge rating-badge rating-badge-button"
              onClick={openRatingDetails}
            >
              <span className="rating-label">Rating</span>
              <span className="rating-stars" aria-label={`Rating ${ratingValue} out of ${maxRating}`}>
                {Array.from({ length: maxRating }).map((_, index) => (
                  <span key={index} className={index < ratingValue ? 'star-filled' : 'star-empty'}>
                    ★
                  </span>
                ))}
              </span>
              <span className="rating-number">{ratingValue}/{maxRating}</span>
            </button>
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
        <div className="profile-modal-backdrop" onClick={closeRatingModal}>
          <div className="profile-modal rating-modal" onClick={(e) => e.stopPropagation()}>
            <div className="profile-modal-header">
              <h3>Rating Details ({ratingDetails.length})</h3>
              <button className="profile-modal-close" onClick={closeRatingModal}>
                <i className='bx bx-x'></i>
              </button>
            </div>
 
            <div className="profile-modal-body rating-modal-body">
              {isLoadingRatings ? (
                <p className="rating-empty">Loading ratings...</p>
              ) : ratingDetails.length === 0 ? (
                <p className="rating-empty">No ratings yet</p>
              ) : (
                <div className="rating-list">
                  {ratingDetails.map((entry) => {
                    const reviewerName = entry.reviewer?.username || 'Unknown user';
                    const productName = entry.product?.name || 'Unknown product';
                    const productImage = Array.isArray(entry.product?.images) && entry.product.images[0]
                      ? entry.product.images[0]
                      : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200';
 
                    return (
                      <div className="rating-card" key={entry.orderItemId || `${entry.orderId}-${productName}`}>
                        <img className="rating-card-image" src={productImage} alt={productName} />
                        <div className="rating-card-content">
                          <p className="rating-card-line"><strong>Reviewer:</strong> {reviewerName}</p>
                          <p className="rating-card-line"><strong>Product:</strong> {productName}</p>
                          <p className="rating-card-line rating-stars-line" aria-label={`Rating ${entry.rating} out of ${maxRating}`}>
                            {Array.from({ length: maxRating }).map((_, index) => (
                              <span key={`${entry.orderItemId || entry.orderId}-${index}`} className={index < Number(entry.rating || 0) ? 'star-filled' : 'star-empty'}>
                                ★
                              </span>
                            ))}
                            <span className="rating-number-inline">{Number(entry.rating || 0)}/{maxRating}</span>
                          </p>
                          <p className="rating-card-line"><strong>Date:</strong> {formatRatingDate(entry.ratedAt)}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
 
export default SellerProfile;