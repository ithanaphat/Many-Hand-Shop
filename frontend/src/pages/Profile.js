import React from 'react';
import '../components/Profile.css'; // อย่าลืม import ไฟล์ CSS เข้ามา
import Header from '../components/Header';
import InfoItem from '../components/InfoItem';
import ProductItem from '../components/ProductItem';

function Profile({ isLoggedIn }) {
  return (
    <div className="profile-page">
      <Header isLoggedIn={isLoggedIn} />

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
        <h2 className="user-name">Name</h2>
        <p className="user-id">USERNAME_q3s56a9s3</p>

        {/* Action Buttons */}
        <div className="action-group">
          <button className="btn-add">ADD PRODUCT</button>
          <button className="btn-edit">EDIT PROFILE</button>
        </div>

        {/* Information Section */}
        <div className="info-section">
          <h3 className="section-header">information</h3>
          <InfoItem icon="✉️" text="myemail@gmail.com" />
          <InfoItem icon="📞" text="012-3456789" />
          <InfoItem icon="📍" text="Kasetsart University, Sri racha, Chonburi 20230" />
        </div>

        {/* On Sell Section */}
        <div>
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
  );
}

export default Profile;