import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import './Profile.css';
import 'boxicons/css/boxicons.min.css';
import Header from '../components/layout/Header';
import InfoItem from '../components/shared/InfoItem';
import ProductItem from '../components/product/ProductItem';
 
function Profile({ isLoggedIn, onLogout }) {
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
 
  const [profile, setProfile] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    username: '',
    email: '',
    phone: '',
    address: '',
    houseNumber: '',
    subDistrict: '',
    district: '',
    province: '',
    postalCode: '',
  });
  const [sellerProducts, setSellerProducts] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [previewCover, setPreviewCover] = useState(null);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [ratingDetails, setRatingDetails] = useState([]);
  const [isLoadingRatings, setIsLoadingRatings] = useState(false);
 
  useEffect(() => {
    const userId = localStorage.getItem('mhs_user_id');
    if (!userId) {
      if (typeof onLogout === 'function') {
        onLogout();
      }
      navigate('/login');
    }
  }, [navigate, onLogout]);
 
  useEffect(() => {
    if (!profile) return;
    const addressParts = parseAddress(profile.address);
    setEditForm({
      ...profile,
      ...addressParts,
    });
  }, [profile]);
 
 
  // Helper function to split address string into components
  const parseAddress = (addressStr) => {
    if (!addressStr) return { houseNumber: '', subDistrict: '', district: '', province: '', postalCode: '' };
   
    // Try to parse address in format: "houseNumber, subDistrict, district, province, postalCode"
    const parts = addressStr.split(',').map(p => p.trim());
    return {
      houseNumber: parts[0] || '',
      subDistrict: parts[1] || '',
      district: parts[2] || '',
      province: parts[3] || '',
      postalCode: parts[4] || ''
    };
  };
 
  // Helper function to combine address components
  const combineAddress = (houseNumber, subDistrict, district, province, postalCode) => {
    return [houseNumber, subDistrict, district, province, postalCode].filter(Boolean).join(', ');
  };
 
  useEffect(() => {
    const userId = localStorage.getItem('mhs_user_id');
    if (!userId) return;
 
    if (!userId) {
      navigate('/login');
      return;
    }
 
    const loadProfile = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/user/${userId}`);
        if (!response.ok) {
          localStorage.clear();  
          navigate('/login');      
          return;
        }
        const data = await response.json();
        setProfile({
          username: data.username || 'Name',
          email: data.email || 'email@example.com',
          phone: data.phone || '',
          address: data.address || '',
          images: data.images || [],
          backgroundImage: data.backgroundImage || '',
          rating: data.rating || 0,
          ratingCount: data.ratingCount || 0
        });
        localStorage.setItem('mhs_user_rating_count', String(data.ratingCount || 0));
      } catch (error) {
        console.error('Profile fetch error:', error);
      }
    };
 
    loadProfile();
  }, [navigate]);
 
  useEffect(() => {
    const userId = localStorage.getItem('mhs_user_id');
    if (!userId) return;
 
    const loadSellerProducts = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/product?seller=${userId}`);
        if (!response.ok) return;
        const data = await response.json();
        setSellerProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to load seller products:', error);
      }
    };
 
    loadSellerProducts();
  }, []);
 
  if (!profile) return <div>Loading...</div>;
 
  const ratingValue = Number(profile.rating || 0);
  const ratingDisplay = ratingValue > 0
    ? (Number.isInteger(ratingValue) ? String(ratingValue) : ratingValue.toFixed(1))
    : '0/0';
  const fullStars = Math.floor(ratingValue);
  const partialStar = ratingValue % 1;
  const reviewCount = Number(profile.ratingCount || 0);

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
 
  const openRatingDetails = async () => {
    const userId = localStorage.getItem('mhs_user_id');
    if (!userId) return;
 
    setIsRatingModalOpen(true);
    setIsLoadingRatings(true);
 
    try {
      const response = await fetch(`${API_BASE_URL}/api/order/seller/${userId}/ratings`);
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
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
 
 
  const openEdit = () => {
    const addressParts = parseAddress(profile.address);
    setEditForm({
      ...profile,
      ...addressParts
    });
    setIsEditOpen(true);
  };
 
  const closeEdit = () => {
    setIsEditOpen(false);
  };
 
  const handleEditChange = (e) => {
    const { name, value } = e.target;
 
    // Validation by field
    if (name === 'phone') {
      // Phone: digits only, max 10
      const numericValue = value.replace(/\D/g, '').slice(0, 10);
      setEditForm((prev) => ({ ...prev, [name]: numericValue }));
    } else if (name === 'postalCode') {
      // Postal Code: digits only, max 5
      const numericValue = value.replace(/\D/g, '').slice(0, 5);
      setEditForm((prev) => ({ ...prev, [name]: numericValue }));
    } else if (['subDistrict', 'district', 'province'].includes(name)) {
      // Letters + Thai chars + spaces only (remove numbers and special characters)
      const filtered = value.replace(/[^a-zA-Z\u0E00-\u0E7F\s]/g, '');
      setEditForm((prev) => ({ ...prev, [name]: filtered }));
    } else {
      // houseNumber, username, email: allow all characters
      setEditForm((prev) => ({ ...prev, [name]: value }));
    }
  };
 
  const handleImageChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
 
  const handleCoverImageChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setCoverFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewCover(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
 
  const uploadCoverImage = async () => {
    if (!coverFile) {
      alert('Please select an image');
      return;
    }
 
    const userId = localStorage.getItem('mhs_user_id');
    const formData = new FormData();
    formData.append('image', coverFile);

    try {
      const uploadResponse = await fetch(`${API_BASE_URL}/api/product/upload-image`, {
        method: 'POST',
        body: formData,
      });

      const uploadData = await uploadResponse.json().catch(() => ({}));
      if (!uploadResponse.ok || !uploadData.url) {
        alert(uploadData.message || 'Upload image failed');
        return;
      }

      const patchResponse = await fetch(`${API_BASE_URL}/api/user/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          backgroundImage: uploadData.url
        }),
      });
 
      const patchData = await patchResponse.json().catch(() => ({}));
      if (!patchResponse.ok) {
        alert(patchData.message || 'Update cover failed');
        return;
      }
 
      const updatedProfile = {
        ...profile,
        backgroundImage: uploadData.url
      };
      setProfile(updatedProfile);
      setCoverFile(null);
      setPreviewCover(null);
      alert('Cover image updated successfully!');
    } catch (error) {
      alert('Cannot connect to server');
      console.error(error);
    }
  };
 
  const uploadImage = async () => {
    if (!imageFile) {
      alert('Please select an image');
      return;
    }
 
    const userId = localStorage.getItem('mhs_user_id');
    const formData = new FormData();
    formData.append('image', imageFile);

    try {
      const uploadResponse = await fetch(`${API_BASE_URL}/api/product/upload-image`, {
        method: 'POST',
        body: formData,
      });

      const uploadData = await uploadResponse.json().catch(() => ({}));
      if (!uploadResponse.ok || !uploadData.url) {
        alert(uploadData.message || 'Upload image failed');
        return;
      }

      const patchResponse = await fetch(`${API_BASE_URL}/api/user/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          images: [uploadData.url]
        }),
      });
 
      const patchData = await patchResponse.json().catch(() => ({}));
      if (!patchResponse.ok) {
        alert(patchData.message || 'Update profile failed');
        return;
      }
 
      const updatedProfile = {
        ...profile,
        images: [uploadData.url]
      };
      setProfile(updatedProfile);
      localStorage.setItem('mhs_user_images', JSON.stringify([uploadData.url]));
      setImageFile(null);
      setPreviewImage(null);
      alert('Profile image updated successfully!');
    } catch (error) {
      alert('Cannot connect to server');
      console.error(error);
    }
  };
 
  const saveEdit = async () => {
    const userId = localStorage.getItem('mhs_user_id');
    const combinedAddress = combineAddress(
      editForm.houseNumber,
      editForm.subDistrict,
      editForm.district,
      editForm.province,
      editForm.postalCode
    );
 
    const payload = {
      username: editForm.username?.trim(),
      email: editForm.email?.trim(),
      phone: editForm.phone?.trim(),
      address: combinedAddress,
    };
 
    if (!payload.username || !payload.email) {
      alert('Username and Email are required');
      return;
    }
 
    setIsSaving(true);
    try {
      if (userId) {
        const response = await fetch(`${API_BASE_URL}/api/user/${userId}`, {
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
          backgroundImage: data.backgroundImage || profile.backgroundImage,
          rating: data.rating || profile.rating,
          ratingCount: data.ratingCount || profile.ratingCount,
        };
        setProfile(updatedProfile);
        setEditForm({
          ...updatedProfile,
          ...parseAddress(updatedProfile.address)
        });
        localStorage.setItem('mhs_user_name', updatedProfile.username);
        localStorage.setItem('mhs_user_email', updatedProfile.email);
        localStorage.setItem('mhs_user_phone', updatedProfile.phone);
        localStorage.setItem('mhs_user_address', updatedProfile.address);
        localStorage.setItem('mhs_user_rating_count', String(updatedProfile.ratingCount || 0));
        closeEdit();
      }
    } catch (error) {
      alert('Cannot connect to server');
    } finally {
      setIsSaving(false);
    }
  };
 
  const handleDeleteAccount = async () => {
    // 1. เด้งหน้าต่างถามเพื่อยืนยันการลบ
    const isConfirmed = window.confirm('Are you sure you want to delete this account?\nAll data will be permanently removed and cannot be restored.');
   
    // 2. ถ้าผู้ใช้กด 'Cancel' (ยกเลิก) ให้หยุดการทำงานทันที
    if (!isConfirmed) {
      return;
    }
 
    // 3. ถ้าผู้ใช้กด 'OK' ให้ดำเนินการเรียก API เพื่อลบข้อมูล
    const userId = localStorage.getItem('mhs_user_id');
    try {
      const response = await fetch(`${API_BASE_URL}/api/user/${userId}`, {
        method: 'DELETE',
      });
 
      if (response.ok) {
        alert('Account deleted successfully');
        onLogout(); // ทำการล็อกเอาท์
        navigate('/'); // เด้งกลับไปหน้าแรก
      } else {
        const data = await response.json().catch(() => ({}));
        alert(data.message || 'Unable to delete account');
      }
    } catch (error) {
      alert('Cannot connect to server');
      console.error(error);
    }
  };
 
  return (
    <div className="profile-page">
      <Header isLoggedIn={isLoggedIn} onLogout={onLogout} />
 
      {/* 1. Purple Banner Area */}
      <div className="banner-container" style={{ backgroundImage: `url('${previewCover || profile.backgroundImage || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}')`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
        <button
          type="button"
          onClick={() => document.getElementById('cover-input').click()}
          style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(255,255,255,0.9)', border: 'none', width: '48px', height: '48px', borderRadius: '50%', cursor: 'pointer', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
        >
          <i className='bx bxs-camera' style={{ fontSize: '24px', color: '#333' }}></i>
        </button>
        <input
          id="cover-input"
          type="file"
          accept="image/*"
          onChange={handleCoverImageChange}
          style={{ display: 'none' }}
        />
        <div className="avatar-wrapper">
          <div
            className="avatar-overlay"
            style={{ backgroundImage: `url('${profile.images && profile.images[0] ? profile.images[0] : 'https://i.pravatar.cc/150?u=' + profile.username}')` }}
          >
            <label className="camera-button" htmlFor="avatar-input" style={{ cursor: 'pointer' }}>
              <i className='bx bxs-camera' style={{ fontSize: '16px', color: '#555', lineHeight: 1 }}></i>
            </label>
            <input
              id="avatar-input"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />
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
 
        {/* Action Buttons */}
        <div className="action-group">
          <button className="btn-add" onClick={() => navigate('/seller-board')}>ADD PRODUCT</button>
          <button className="btn-edit" onClick={() => navigate('/orders')}>ORDER HISTORY</button>
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
              <button className="btn-total">TOTAL {sellerProducts.length}</button>
            </div>
 
            <div className="product-list-scroll">
              {sellerProducts.length > 0 ? (
                sellerProducts.map((product) => (
                  <ProductItem
                    key={product._id || product.id}
                    name={product.name}
                    price={product.price}
                    productImage={
                      Array.isArray(product.images) && product.images[0]
                        ? product.images[0]
                        : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300'
                    }
                    onClick={() => navigate(`/product/${product._id || product.id}`)}
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
 
      {/* Cover Preview Modal */}
      {previewCover && (
        <div className="image-preview-backdrop" onClick={() => {
          setCoverFile(null);
          setPreviewCover(null);
        }}>
          <div className="image-preview-modal" onClick={(e) => e.stopPropagation()}>
            <div className="image-preview-content">
              <img src={previewCover} alt="cover-preview" className="image-preview-large" />
            </div>
           
            <div className="image-preview-actions">
              <button
                className="image-btn-upload"
                onClick={uploadCoverImage}
              >
                <i className='bx bx-check' style={{ marginRight: '6px' }}></i>
                Confirm
              </button>
              <button
                className="image-btn-change"
                onClick={() => {
                  document.getElementById('cover-input').click();
                }}
              >
                <i className='bx bx-edit' style={{ marginRight: '6px' }}></i>
                Change Photo
              </button>
              <button
                className="image-btn-cancel"
                onClick={() => {
                  setCoverFile(null);
                  setPreviewCover(null);
                }}
              >
                <i className='bx bx-x' style={{ marginRight: '6px' }}></i>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
 
      {/* Image Preview Modal */}
      {previewImage && (
        <div className="image-preview-backdrop" onClick={() => {
          setImageFile(null);
          setPreviewImage(null);
        }}>
          <div className="image-preview-modal" onClick={(e) => e.stopPropagation()}>
            <div className="image-preview-content">
              <img src={previewImage} alt="preview" className="image-preview-large" />
            </div>
           
            <div className="image-preview-actions">
              <button
                className="image-btn-upload"
                onClick={uploadImage}
              >
                <i className='bx bx-check' style={{ marginRight: '6px' }}></i>
                Confirm
              </button>
              <button
                className="image-btn-change"
                onClick={() => {
                  document.getElementById('avatar-input').click();
                }}
              >
                <i className='bx bx-edit' style={{ marginRight: '6px' }}></i>
                Change Photo
              </button>
              <button
                className="image-btn-cancel"
                onClick={() => {
                  setImageFile(null);
                  setPreviewImage(null);
                }}
              >
                <i className='bx bx-x' style={{ marginRight: '6px' }}></i>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
 
      {/* ===== Edit Profile Modal ===== */}
      {isEditOpen && (
        <div className="profile-modal-backdrop">
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
                  placeholder="08X-XXX-XXXX"
                  maxLength={10}
                  inputMode="numeric"
                />
              </div>
 
              {/* Address */}
              <div className="profile-form-row">
                <label>Address</label>
                <input
                  type="text"
                  name="houseNumber"
                  value={editForm.houseNumber}
                  onChange={handleEditChange}
                  className="profile-input"
                  placeholder="e.g., 45/6 Building Name"
                />
              </div>
 
              {/* Address Fields - Row 1 */}
              <div className="profile-form-group-2col">
                <div className="profile-form-row">
                  <label>Sub-District</label>
                  <input
                    type="text"
                    name="subDistrict"
                    value={editForm.subDistrict}
                    onChange={handleEditChange}
                    className="profile-input"
                    placeholder="Sub-District"
                  />
                </div>
 
                <div className="profile-form-row">
                  <label>District</label>
                  <input
                    type="text"
                    name="district"
                    value={editForm.district}
                    onChange={handleEditChange}
                    className="profile-input"
                    placeholder="District"
                  />
                </div>
              </div>
 
              {/* Address Fields - Row 2 */}
              <div className="profile-form-group-2col">
                <div className="profile-form-row">
                  <label>Province</label>
                  <input
                    type="text"
                    name="province"
                    value={editForm.province}
                    onChange={handleEditChange}
                    className="profile-input"
                    placeholder="Province"
                  />
                </div>
 
                <div className="profile-form-row">
                  <label>Postal Code</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={editForm.postalCode}
                    onChange={handleEditChange}
                    className="profile-input"
                    placeholder="10400"
                    maxLength={5}
                    inputMode="numeric"
                  />
                </div>
              </div>
            </div>
 
            <div className="profile-modal-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '16px 20px' }}>
             
              {/* ปุ่ม Delete Account ฝั่งซ้าย */}
              <button
                type="button"
                onClick={handleDeleteAccount}
                style={{
                  backgroundColor: '#a91e2c',
                  color: 'white',
                  border: 'none',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '12px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  whiteSpace: 'nowrap'
                }}
              >
                Delete Account
              </button>
 
              {/* กลุ่มปุ่ม Cancel และ Save ฝั่งขวา */}
              <div style={{ display: 'flex', gap: '10px', flex: 1, marginLeft: '10px' }}>
                <button className="profile-btn-cancel" onClick={closeEdit} style={{ flex: 1 }}>
                  Cancel
                </button>
                <button className="profile-btn-save" onClick={saveEdit} disabled={isSaving} style={{ flex: 1 }}>
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
              </div>
             
            </div>
          </div>
        </div>
      )}
 
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
                <span style={{ fontSize: '13px', color: '#888' }}>{reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}</span>
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
 
export default Profile;