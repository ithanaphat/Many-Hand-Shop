import React from 'react';
import '../components/Profile.css';
import 'boxicons/css/boxicons.min.css'; // อย่าลืม import ไฟล์ CSS เข้ามา
import Header from '../components/Header';
import InfoItem from '../components/InfoItem';
import ProductItem from '../components/ProductItem';

function Profile({ isLoggedIn, onLogout }) {
  const ratingValue = 4;
  const maxRating = 5;

  return (
    <div className="profile-page">
      <Header isLoggedIn={isLoggedIn} onLogout={onLogout} />

      {/* 1. Purple Banner Area */}
      <div className="banner-container">
        <div className="avatar-wrapper">
          <div 
            className="avatar-overlay" 
            style={{ backgroundImage: `url('https://i.pravatar.cc/150?u=woody')` }}
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
            <h2 className="user-name">Name</h2>
            <p className="user-id">USERNAME_q3s56a9s3</p>
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
          <button className="btn-add">ADD PRODUCT</button>
          <button className="btn-edit">EDIT PROFILE</button>
        </div>

        <div className="profile-sections">
          {/* Information Section */}
          <div className="info-section section-card">
            <h3 className="section-header">Information</h3>
            <InfoItem icon="✉️" text="myemail@gmail.com" />
            <InfoItem icon="📞" text="012-3456789" />
            <InfoItem icon="📍" text="Kasetsart University, Sri racha, Chonburi 20230" />
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