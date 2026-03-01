import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
  const orderItems = isCartMode
    ? cartItems
    : product
      ? [{
          id: product._id || product.id,
          name: product.name || product.itemName || 'Product',
          price: Number(product.price || product.itemPrice || 0),
          image: product.productImage || product.images?.[0] || '',
          quantity: initQty,
          sellerName: product.sellerName || product.seller?.username || 'Seller',
        }]
      : [];

  const [quantity] = useState(initQty);

  /* ── Address form ── */
  const [address, setAddress] = useState({
    fullName: '',
    phone: '',
    addressLine: '',
    city: '',
    province: '',
    zip: '',
  });

  /* ── Card form ── */
  const [card, setCard] = useState({
    holderName: '',
    number: '',
    expiry: '',
    cvv: '',
  });

  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoMsg, setPromoMsg] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  /* ── helpers ── */
  const handleAddress = (e) => setAddress((p) => ({ ...p, [e.target.name]: e.target.value }));

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
    if (name === 'number') value = formatCardNumber(value);
    if (name === 'expiry') value = formatExpiry(value);
    if (name === 'cvv') value = value.replace(/\D/g, '').slice(0, 4);
    setCard((p) => ({ ...p, [name]: value }));
  };

  const applyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'MHS10') {
      setDiscount(Math.floor(subtotalBase * 0.1));
      setPromoMsg('✓ Promo applied: 10% off');
    } else {
      setDiscount(0);
      setPromoMsg('✗ Invalid promo code');
    }
  };

  const subtotalBase = orderItems.reduce((sum, i) => sum + Number(i.price) * i.quantity, 0);
  const subtotal  = subtotalBase;
  const shipping  = subtotal > 0 ? 40 : 0;
  const total     = Math.max(0, subtotal + shipping - discount);


  /* ── submit ── */
  const handleSubmit = (e) => {
    e.preventDefault();
    setShowSuccess(true);
  };

  return (
    <div className="checkout-page">
      <Header isLoggedIn={isLoggedIn} onLogout={onLogout} />

      <div className="checkout-container">
        {/* ── LEFT ── */}
        <div className="checkout-left">

          {/* Shipping Address */}
          <div className="ck-card">
            <h3 className="ck-card-title">
              <i className="bx bx-map-pin"></i> Shipping Address
            </h3>

            <div className="ck-form-row-group">
              <div className="ck-form-row">
                <label className="ck-label">Full Name</label>
                <input className="ck-input" name="fullName" value={address.fullName}
                  onChange={handleAddress} placeholder="John Doe" required />
              </div>
              <div className="ck-form-row">
                <label className="ck-label">Phone</label>
                <input className="ck-input" name="phone" value={address.phone}
                  onChange={handleAddress} placeholder="08X-XXX-XXXX" required />
              </div>
            </div>

            <div className="ck-form-row">
              <label className="ck-label">Address</label>
              <input className="ck-input" name="addressLine" value={address.addressLine}
                onChange={handleAddress} placeholder="House no., Street, Sub-district" required />
            </div>

            <div className="ck-form-row-group">
              <div className="ck-form-row">
                <label className="ck-label">City / District</label>
                <input className="ck-input" name="city" value={address.city}
                  onChange={handleAddress} placeholder="Bangkok" required />
              </div>
              <div className="ck-form-row">
                <label className="ck-label">Province</label>
                <input className="ck-input" name="province" value={address.province}
                  onChange={handleAddress} placeholder="Bangkok" required />
              </div>
              <div className="ck-form-row">
                <label className="ck-label">Zip Code</label>
                <input className="ck-input" name="zip" value={address.zip}
                  onChange={handleAddress} placeholder="10400" maxLength={5} required />
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
                    inputMode="numeric" required />
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

            {/* Promo */}
            <div className="ck-promo-row">
              <input className="ck-promo-input" placeholder="Promo code (MHS10)"
                value={promoCode} onChange={(e) => setPromoCode(e.target.value)} />
              <button type="button" className="ck-promo-btn" onClick={applyPromo}>Apply</button>
            </div>
            {promoMsg && (
              <p style={{ fontSize: 12, color: discount > 0 ? '#2e7d32' : '#c0392b', margin: '-8px 0 12px' }}>
                {promoMsg}
              </p>
            )}

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
              Pay ฿{total.toLocaleString()}
            </button>
            <p className="ck-secure-note">
              <i className="bx bx-shield-quarter"></i>
              Secured with SSL encryption
            </p>
          </div>
        </div>
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
            <button className="ck-success-btn" onClick={() => navigate('/home-user')}>
              Back to Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Checkout;
