import React from 'react';
import '../components/Profile.css'; // อย่าลืม import ไฟล์ CSS เข้ามา
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
        <div 
          className="avatar-overlay" 
          style={{ backgroundImage: `url('https://i.pravatar.cc/150?u=woody')` }}
        >
          <div className="camera-button">📷</div>
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
              <ProductItem name="item name" price="99" />
              <ProductItem name="item name" price="99" />
              <ProductItem name="item name" price="99" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;