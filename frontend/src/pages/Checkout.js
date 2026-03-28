import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import './Checkout.css';
import 'boxicons/css/boxicons.min.css';
import Header from '../components/layout/Header';
 
function Checkout({ isLoggedIn, onLogout }) {
  const location = useLocation();
  const navigate = useNavigate();
 
  // รองรับทั้ง BUY NOW (product+quantity) และ Cart (cartItems)
  const { product, quantity: initQty = 1, cartItems } = location.state || {};
  const isCartMode = Array.isArray(cartItems) && cartItems.length > 0;
 
  // normalize เป็น array เดียวกัน
  const orderItems = useMemo(() => (
    isCartMode
      ? cartItems.map((item) => ({
          id: item.id || item._id,
          name: item.name || item.itemName || 'Product',
          price: Number(item.price || item.itemPrice || 0),
          image: item.image || item.productImage || item.images?.[0] || '',
          quantity: Number(item.quantity || 1),
          sellerId: item.sellerId || item.seller?._id || item.seller || null,
          sellerName: item.sellerName || item.seller?.username || 'Seller',
        }))
      : product
        ? [{
            id: product._id || product.id,
            name: product.name || product.itemName || 'Product',
            price: Number(product.price || product.itemPrice || 0),
            image: product.productImage || product.images?.[0] || '',
            quantity: initQty,
            sellerId: product.seller?._id || product.seller || null,
            sellerName: product.sellerName || product.seller?.username || 'Seller',
          }]
        : []
  ), [cartItems, initQty, isCartMode, product]);
 
  /* ── Address form ── */
  const [address, setAddress] = useState({
    fullName: '',
    phone: '',
    houseNumber: '',
    subDistrict: '',
    district: '',
    province: '',
    postalCode: '',
  });
 
  /* ── Card form ── */
  const [card, setCard] = useState({
    holderName: '',
    number: '',
    expiry: '',
    cvv: '',
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [isProfileAddressApplied, setIsProfileAddressApplied] = useState(false);
  const [previousAddress, setPreviousAddress] = useState(null);

  const discount = 0; // Promo code feature disabled
 
  /* ── helpers ── */
  const handleAddress = (e) => {
    const { name, value } = e.target;
 
    // Validation by field
    if (name === 'phone') {
      // Phone: digits only, max 10
      setAddress((p) => ({ ...p, [name]: value.replace(/\D/g, '').slice(0, 10) }));
    } else if (name === 'postalCode') {
      // Postal Code: digits only, max 5
      setAddress((p) => ({ ...p, [name]: value.replace(/\D/g, '').slice(0, 5) }));
    } else if (['fullName', 'subDistrict', 'district', 'province'].includes(name)) {
      // Letters + Thai chars + spaces only (remove numbers and special characters)
      const filtered = value.replace(/[^a-zA-Z\u0E00-\u0E7F\s]/g, '');
      setAddress((p) => ({ ...p, [name]: filtered }));
    } else {
      // houseNumber: allow all characters
      setAddress((p) => ({ ...p, [name]: value }));
    }
  };
 
  const formatCardNumber = (val) => {
    const digits = val.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(.{4})/g, '$1 ').trim();
  };
 
  const formatExpiry = (val) => {
    const digits = val.replace(/\D/g, '').slice(0, 4);
    if (digits.length > 2) return digits.slice(0, 2) + '/' + digits.slice(2);
    return digits;
  };
 
  const handleCard = (e) => {
    let { name, value } = e.target;
    if (name === 'holderName') value = value.replace(/[^a-zA-Z\u0E00-\u0E7F\s]/g, '');
    if (name === 'number') value = formatCardNumber(value);
    if (name === 'expiry') value = formatExpiry(value);
    if (name === 'cvv') value = value.replace(/\D/g, '').slice(0, 4);
    setCard((p) => ({ ...p, [name]: value }));
  };
 
  const loadAddressFromProfile = () => {
    if (isProfileAddressApplied && previousAddress) {
      setAddress(previousAddress);
      setPreviousAddress(null);
      setIsProfileAddressApplied(false);
      return;
    }

    const fullName = localStorage.getItem('mhs_user_name') || '';
    const phone = localStorage.getItem('mhs_user_phone') || '';
    const savedAddress = localStorage.getItem('mhs_user_address') || '';

    // Parse address format: "houseNumber, subDistrict, district, province, postalCode"
    const parts = savedAddress.split(',').map(p => p.trim());

    setPreviousAddress({ ...address });

    setAddress({
      fullName,
      phone,
      houseNumber: parts[0] || '',
      subDistrict: parts[1] || '',
      district: parts[2] || '',
      province: parts[3] || '',
      postalCode: parts[4] || '',
    });
    setIsProfileAddressApplied(true);
  };

  const syncCheckoutAddressToProfileIfMissing = async (userId) => {
    const checkoutAddress = [
      address.houseNumber,
      address.subDistrict,
      address.district,
      address.province,
      address.postalCode,
    ]
      .map((part) => String(part || '').trim())
      .filter(Boolean)
      .join(', ');

    const currentProfilePhone = (localStorage.getItem('mhs_user_phone') || '').trim();
    const currentProfileAddress = (localStorage.getItem('mhs_user_address') || '').trim();

    const patchPayload = {
      ...(currentProfilePhone ? {} : { phone: String(address.phone || '').trim() }),
      ...(currentProfileAddress ? {} : { address: checkoutAddress }),
    };

    if (
      (!patchPayload.phone || !patchPayload.phone.length) &&
      (!patchPayload.address || !patchPayload.address.length)
    ) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/user/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patchPayload),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) return;

      if (typeof data.phone === 'string' && data.phone.trim()) {
        localStorage.setItem('mhs_user_phone', data.phone);
      }
      if (typeof data.address === 'string' && data.address.trim()) {
        localStorage.setItem('mhs_user_address', data.address);
      }
    } catch (error) {
      // Do not block checkout if profile sync fails.
      console.error('Profile sync failed:', error);
    }
  };
 
  const subtotalBase = orderItems.reduce((sum, i) => sum + Number(i.price) * i.quantity, 0);
  const subtotal  = subtotalBase;
  const shipping  = subtotal > 0 ? 40 : 0;
  const total     = Math.max(0, subtotal + shipping - discount);
 
 
  /* ── submit ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
 
    if (orderItems.length === 0) {
      setSubmitError('No items selected for checkout.');
      return;
    }
 
    const userId = localStorage.getItem('mhs_user_id');
    if (!userId) {
      navigate('/login');
      return;
    }

    const cartStorageKey = `mhs_cart_${userId}`;
 
    setIsSubmitting(true);
    setSubmitError('');
 
    try {
      await syncCheckoutAddressToProfileIfMissing(userId);

      const response = await fetch(`${API_BASE_URL}/api/order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buyer: userId,
          items: orderItems.map((item) => ({
            product: item.id,
            seller: item.sellerId,
            quantity: item.quantity,
            price: item.price,
          })),
          shippingInfo: {
            name: address.fullName,
            phone: address.phone,
            address: [address.houseNumber, address.subDistrict, address.district, address.province, address.postalCode]
              .filter(Boolean)
              .join(', '),
          },
          shippingFee: shipping,
          totalPrice: total,
          paymentMethod: 'Credit Card',
        }),
      });
 
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setSubmitError(data.message || 'Checkout failed.');
        return;
      }
 
      if (isCartMode) {
        const purchasedIds = new Set(orderItems.map((item) => String(item.id)));
        const savedCart = JSON.parse(localStorage.getItem(cartStorageKey) || '[]');
        const nextCart = savedCart.filter((item) => !purchasedIds.has(String(item.id || item._id)));
        localStorage.setItem(cartStorageKey, JSON.stringify(nextCart));
      }
 
      setShowSuccess(true);
    } catch (error) {
      setSubmitError('Cannot connect to server.');
    } finally {
      setIsSubmitting(false);
    }
  };
 
  return (
    <div className="checkout-page">
      <Header isLoggedIn={isLoggedIn} onLogout={onLogout} />
 
      <div className="checkout-container">
        {orderItems.length === 0 ? (
          <div className="ck-card" style={{ width: '100%', textAlign: 'center' }}>
            <h3 className="ck-card-title">
              <i className="bx bx-cart"></i> No items to checkout
            </h3>
            <p>Please return to your cart or a product page and select something first.</p>
            <button type="button" className="ck-pay-btn" onClick={() => navigate('/cart')}>
              Go to Cart
            </button>
          </div>
        ) : (
          <>
        {/* ── LEFT ── */}
        <div className="checkout-left">
 
          {/* Shipping Address */}
          <div className="ck-card">
            <h3 className="ck-card-title">
              <i className="bx bx-map-pin"></i> Shipping Address
            </h3>

            <button
              type="button"
              className="ck-load-profile-chip"
              onClick={loadAddressFromProfile}
              aria-pressed={isProfileAddressApplied}
            >
              <span className={`ck-load-profile-circle ${isProfileAddressApplied ? 'active' : ''}`}>
                <i className="bx bx-check"></i>
              </span>
              <span>{isProfileAddressApplied ? 'Restore Previous Address' : 'Use Profile Address'}</span>
            </button>
 
            <div className="ck-form-row-group">
              <div className="ck-form-row">
                <label className="ck-label">Full Name</label>
                <input className="ck-input" name="fullName" value={address.fullName}
                  onChange={handleAddress} placeholder="John Doe" required />
              </div>
              <div className="ck-form-row">
                <label className="ck-label">Phone</label>
                <input className="ck-input" name="phone" value={address.phone}
                  onChange={handleAddress} placeholder="08X-XXX-XXXX" inputMode="numeric" maxLength={10} required />
              </div>
            </div>
 
            <div className="ck-form-row">
              <label className="ck-label">Address</label>
              <input className="ck-input" name="houseNumber" value={address.houseNumber}
                onChange={handleAddress} placeholder="e.g., 45/6 Building Name" required />
            </div>
 
            <div className="ck-form-row-group">
              <div className="ck-form-row">
                <label className="ck-label">Sub-District</label>
                <input className="ck-input" name="subDistrict" value={address.subDistrict}
                  onChange={handleAddress} placeholder="Sub-District" required />
              </div>
              <div className="ck-form-row">
                <label className="ck-label">District</label>
                <input className="ck-input" name="district" value={address.district}
                  onChange={handleAddress} placeholder="District" required />
              </div>
            </div>
 
            <div className="ck-form-row-group">
              <div className="ck-form-row">
                <label className="ck-label">Province</label>
                <input className="ck-input" name="province" value={address.province}
                  onChange={handleAddress} placeholder="Province" required />
              </div>
              <div className="ck-form-row">
                <label className="ck-label">Postal Code</label>
                <input className="ck-input" name="postalCode" value={address.postalCode}
                  onChange={handleAddress} placeholder="10400" maxLength={5} inputMode="numeric" required />
              </div>
            </div>
          </div>
 
          {/* Payment */}
          <form id="checkout-form" onSubmit={handleSubmit}>
            <div className="ck-card">
              <h3 className="ck-card-title">
                <i className="bx bx-credit-card"></i> Payment — Credit Card
              </h3>
 
              {/* Card Fields */}
              <div className="ck-form-row">
                <label className="ck-label">Cardholder Name</label>
                <input className="ck-input" name="holderName" value={card.holderName}
                  onChange={handleCard} placeholder="Name on card" required />
              </div>
 
              <div className="ck-form-row">
                <label className="ck-label">Card Number</label>
                <input className="ck-input" name="number" value={card.number}
                  onChange={handleCard} placeholder="0000 0000 0000 0000"
                  inputMode="numeric" required />
              </div>
 
              <div className="ck-form-row-group">
                <div className="ck-form-row">
                  <label className="ck-label">Expiry Date</label>
                  <input className="ck-input" name="expiry" value={card.expiry}
                    onChange={handleCard} placeholder="MM/YY" required />
                </div>
                <div className="ck-form-row">
                  <label className="ck-label">CVV</label>
                  <input className="ck-input" name="cvv" value={card.cvv}
                    onChange={handleCard} placeholder="•••" type="password"
                    inputMode="numeric"
                    maxLength={3} required />
                </div>
              </div>
            </div>
          </form>
        </div>
 
        {/* ── RIGHT — Order Summary ── */}
        <div className="checkout-right">
          <div className="ck-card">
            <h3 className="ck-card-title">
              <i className="bx bx-receipt"></i> Order Summary
            </h3>
 
            {/* Product items */}
            <div className="ck-order-items-list">
              {orderItems.map((item, idx) => (
                <div key={item.id || idx} className="ck-order-item">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="ck-order-img"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                  ) : (
                    <div className="ck-order-img ck-order-img-placeholder" />
                  )}
                  <div className="ck-order-info">
                    <p className="ck-order-name">{item.name}</p>
                    {item.sellerName && <p className="ck-order-seller">Sold by {item.sellerName}</p>}
                    <p className="ck-order-qty">Qty: {item.quantity}</p>
                  </div>
                  <span className="ck-order-price">฿{(Number(item.price) * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="ck-summary-rows">
              <div className="ck-summary-row">
                <span>Subtotal</span>
                <span>฿{subtotal.toLocaleString()}</span>
              </div>
              <div className="ck-summary-row">
                <span>Shipping</span>
                <span>฿{shipping.toLocaleString()}</span>
              </div>
              {discount > 0 && (
                <div className="ck-summary-row discount">
                  <span>Discount (MHS10)</span>
                  <span>−฿{discount.toLocaleString()}</span>
                </div>
              )}
              <div className="ck-summary-row total">
                <span>Total</span>
                <span>฿{total.toLocaleString()}</span>
              </div>
            </div>
 
            {/* Pay button */}
            <button type="submit" form="checkout-form" className="ck-pay-btn">
              <i className="bx bx-lock-alt"></i>
              {isSubmitting ? 'Processing...' : `Pay ฿${total.toLocaleString()}`}
            </button>
            {submitError && (
              <p style={{ fontSize: 13, color: '#c0392b', marginTop: 12 }}>{submitError}</p>
            )}
            <p className="ck-secure-note">
              <i className="bx bx-shield-quarter"></i>
              Secured with SSL encryption
            </p>
          </div>
        </div>
          </>
        )}
      </div>
 
      {/* ── Success Modal ── */}
      {showSuccess && (
        <div className="ck-success-backdrop">
          <div className="ck-success-modal">
            <div className="ck-success-icon">
              <i className="bx bx-check"></i>
            </div>
            <h3>Payment Successful!</h3>
            <p>
              Your order has been placed.<br />
              We'll notify you when it's on the way.
            </p>
            <button className="ck-success-btn" onClick={() => navigate('/orders')}>
              View Order History
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
 
export default Checkout;


