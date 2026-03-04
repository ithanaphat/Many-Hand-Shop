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

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editForm, setEditForm] = useState(profile);

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

  const openEdit = () => {
    setEditForm(profile);
    setIsEditOpen(true);
  };

  const closeEdit = () => {
    setIsEditOpen(false);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const saveEdit = async () => {
    const userId = localStorage.getItem('mhs_user_id');
    const payload = {
      username: editForm.username?.trim(),
      email: editForm.email?.trim(),
      phone: editForm.phone?.trim(),
      address: editForm.address?.trim(),
    };

    if (!payload.username || !payload.email) {
      alert('Username และ Email จำเป็นต้องกรอก');
      return;
    }

    setIsSaving(true);
    try {
      if (userId) {
        const response = await fetch(`/api/user/${userId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
          alert(data.message || 'Edit profile failed');
          return;
        }

        const updatedProfile = {
          username: data.username || payload.username,
          email: data.email || payload.email,
          phone: data.phone || payload.phone,
          address: data.address || payload.address,
          images: data.images || profile.images,
          rating: data.rating || profile.rating,
        };
        setProfile(updatedProfile);
        setEditForm(updatedProfile);
        localStorage.setItem('mhs_user_name', updatedProfile.username);
        localStorage.setItem('mhs_user_email', updatedProfile.email);
        localStorage.setItem('mhs_user_phone', updatedProfile.phone);
        localStorage.setItem('mhs_user_address', updatedProfile.address);
        closeEdit();
      }
    } catch (error) {
      alert('Cannot connect to server');
    } finally {
      setIsSaving(false);
    }
  };

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
          <button className="btn-edit" onClick={openEdit}>EDIT PROFILE</button>
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

      {/* ===== Edit Profile Modal ===== */}
      {isEditOpen && (
        <div className="profile-modal-backdrop" onClick={closeEdit}>
          <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
            <div className="profile-modal-header">
              <h3>Edit Profile</h3>
              <button className="profile-modal-close" onClick={closeEdit}>
                <i className='bx bx-x'></i>
              </button>
            </div>

            <div className="profile-modal-body">
              <div className="profile-form-row">
                <label>Username</label>
                <input
                  type="text"
                  name="username"
                  value={editForm.username}
                  onChange={handleEditChange}
                  className="profile-input"
                  placeholder="Username"
                />
              </div>

              <div className="profile-form-row">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={editForm.email}
                  onChange={handleEditChange}
                  className="profile-input"
                  placeholder="email@example.com"
                />
              </div>

              <div className="profile-form-row">
                <label>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={editForm.phone}
                  onChange={handleEditChange}
                  className="profile-input"
                  placeholder="0XX-XXXXXX"
                />
              </div>

              <div className="profile-form-row">
                <label>Address</label>
                <textarea
                  name="address"
                  value={editForm.address}
                  onChange={handleEditChange}
                  className="profile-input"
                  placeholder="Your address"
                  rows="3"
                />
              </div>
            </div>

            <div className="profile-modal-footer">
              <button className="profile-btn-cancel" onClick={closeEdit}>
                Cancel
              </button>
              <button className="profile-btn-save" onClick={saveEdit} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;