import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';
import 'boxicons/css/boxicons.min.css';
import Header from '../components/layout/Header';
import InfoItem from '../components/shared/InfoItem';
import ProductItem from '../components/product/ProductItem';

function Profile({ isLoggedIn, onLogout }) {
  const navigate = useNavigate();
  const maxRating = 5;
  const [profile, setProfile] = useState({
    username: localStorage.getItem('mhs_user_name') || 'Name',
    email: localStorage.getItem('mhs_user_email') || 'email@example.com',
    phone: localStorage.getItem('mhs_user_phone') || '',
    address: localStorage.getItem('mhs_user_address') || '',
    images: JSON.parse(localStorage.getItem('mhs_user_images') || '[]'),
    rating: parseFloat(localStorage.getItem('mhs_user_rating')) || 0
  });

  useEffect(() => {
    const userId = localStorage.getItem('mhs_user_id');
    if (!userId) return;

    const loadProfile = async () => {
      try {
        const response = await fetch(`/api/user/${userId}`);
        if (!response.ok) {
          console.error('Failed to load profile:', response.status);
          return;
        }
        const data = await response.json();
        setProfile({
          username: data.username || 'Name',
          email: data.email || 'email@example.com',
          phone: data.phone || '',
          address: data.address || '',
          images: data.images || [],
          rating: data.rating || 0
        });
      } catch (error) {
        console.error('Profile fetch error:', error);
      }
    };

    loadProfile();
  }, []);

  const ratingValue = Math.round(profile.rating);

  return (
    <div className="profile-page">
      <Header isLoggedIn={isLoggedIn} onLogout={onLogout} />

      {/* 1. Purple Banner Area */}
      <div className="banner-container">
        <div className="avatar-wrapper">
          <div 
            className="avatar-overlay" 
            style={{ backgroundImage: `url('${profile.images && profile.images[0] ? profile.images[0] : 'https://i.pravatar.cc/150?u=' + profile.username}')` }}
          >
            <div className="camera-button">
              <i className='bx bxs-camera' style={{ fontSize: '16px', color: '#555', lineHeight: 1 }}></i>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Content */}
      <div className="content-body">
        <div className="profile-header-row">
          <div>
            <h2 className="user-name">{profile.username}</h2>
            <p className="user-id">{profile.email}</p>
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

        {/* Action Buttons */}
        <div className="action-group">
          <button className="btn-add" onClick={() => navigate('/seller-board')}>ADD PRODUCT</button>
          <button className="btn-edit">EDIT PROFILE</button>
        </div>

        <div className="profile-sections">
          {/* Information Section */}
          <div className="info-section section-card">
            <h3 className="section-header">Information</h3>
            <InfoItem icon="✉️" text={profile.email || 'No email'} />
            <InfoItem icon="📞" text={profile.phone || 'No phone'} />
            <InfoItem icon="📍" text={profile.address || 'No address'} />
          </div>

          {/* On Sell Section */}
          <div className="section-card">
            <div className="sell-header">
              <h3 style={{ margin: 0 }}>On Sell</h3>
              <button className="btn-total">TOTAL SELL</button>
            </div>

            <div className="product-list-scroll">
              <ProductItem name="Vintage T-Shirt" price="299" productImage="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300" />
              <ProductItem name="Film Camera" price="850" productImage="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=300" />
              <ProductItem name="Denim Jacket" price="590" productImage="https://images.unsplash.com/photo-1542272604-787c62d465d1?w=300" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;