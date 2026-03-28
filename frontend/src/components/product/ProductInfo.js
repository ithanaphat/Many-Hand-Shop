import React from 'react';
import { useNavigate } from 'react-router-dom';
import QuantitySelector from "./QuantitySelector";
import "./ProductDetail.css";
import { API_BASE_URL } from '../../config';
 
const ProductInfo = ({ product }) => {
  const navigate = useNavigate();
  const [qty, setQty] = React.useState(1);
  const getCartStorageKey = (userId) => `mhs_cart_${userId}`;
  const displayProduct = product || {
    name: "Product Name",
    sellerName: "Unknown Seller",
    price: "0",
    sellerImage: "https://i.pravatar.cc/150?u=default"
  };
 
  // Map database fields to component display
  const productName = displayProduct.name || displayProduct.itemName;
  const productPrice = displayProduct.price || displayProduct.itemPrice;
  const sellerName = displayProduct.sellerName || displayProduct.seller?.username || "Unknown";
  const sellerImage = displayProduct.seller?.images?.[0] || displayProduct.sellerImage || `https://i.pravatar.cc/150?u=${sellerName}`;
  const sellerId = displayProduct.seller?._id || displayProduct.seller || null;
  const rating = Number(displayProduct.sellerRating ?? displayProduct.seller?.rating ?? 0);
  const maxRating = 5;
  const fullStars = Math.floor(rating);
  const partial = rating % 1;
  const reviews = displayProduct.seller?.ratingCount || displayProduct.ratingCount || 0;
  const formattedRating = rating > 0
    ? (Number.isInteger(rating) ? String(rating) : rating.toFixed(1))
    : '0/0';
  const description = displayProduct.description || "Authentic pre-loved item in excellent condition. Perfect for collectors and fashion enthusiasts.";
  const stock = displayProduct.stock ?? null;
 
  const getStarStyle = (index) => {
    if (index < fullStars) return { color: '#f5b301' };
    if (index === fullStars && partial > 0) {
      return {
        background: `linear-gradient(to right, #f5b301 ${partial * 100}%, #c8cfc0 ${partial * 100}%)`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      };
    }
    return { color: '#c8cfc0' };
  };
 
  const [cartMsg, setCartMsg] = React.useState('');
  const [ratingModal, setRatingModal] = React.useState(false);
  const [ratingDetails, setRatingDetails] = React.useState([]);
  const [ratingLoading, setRatingLoading] = React.useState(false);

  const openRatingModal = async () => {
    if (!sellerId) return;
    setRatingModal(true);
    setRatingLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/order/seller/${sellerId}/ratings`);
      const data = await res.json().catch(() => ({}));
      setRatingDetails(Array.isArray(data.ratings) ? data.ratings : []);
    } catch {
      setRatingDetails([]);
    } finally {
      setRatingLoading(false);
    }
  };
  
  // Check if current user is the seller
  const currentUserId = localStorage.getItem('mhs_user_id');
  const isOwnProduct = currentUserId && sellerId && currentUserId === sellerId;
 
  const handleAddToCart = () => {
    // ตรวจสอบว่าเป็นคนขายสินค้าของตัวเองหรือไม่
    if (isOwnProduct) {
      alert('You cannot buy your own product');
      return;
    }

    // ตรวจสอบว่า login แล้วหรือยัง
    const userId = localStorage.getItem('mhs_user_id');
    if (!userId) {
      alert('Please sign in to add items to cart');
      navigate('/login');
      return;
    }

    const cartStorageKey = getCartStorageKey(userId);

    const maxStock = stock ?? Infinity;
    let cart = JSON.parse(localStorage.getItem(cartStorageKey) || '[]');
    if (cart.length === 0) {
      const legacyCart = JSON.parse(localStorage.getItem('mhs_cart') || '[]');
      if (legacyCart.length > 0) {
        cart = legacyCart;
        localStorage.setItem(cartStorageKey, JSON.stringify(legacyCart));
        localStorage.removeItem('mhs_cart');
      }
    }
    const existing = cart.find(i => i.id === (displayProduct._id || displayProduct.id));
    if (existing) {
      const newQty = existing.quantity + qty;
      if (newQty > maxStock) {
        setCartMsg(`Already in cart: ${existing.quantity} item(s) (max ${maxStock})`);
        setTimeout(() => setCartMsg(''), 2500);
        return;
      }
      existing.quantity = newQty;
    } else {
      const addQty = Math.min(qty, maxStock);
      cart.push({
        id: displayProduct._id || displayProduct.id || Date.now(),
        name: productName,
        price: productPrice,
        image: displayProduct.images?.[0] || displayProduct.productImage || '',
        sellerId,
        sellerName,
        quantity: addQty,
        stock: maxStock === Infinity ? null : maxStock,
      });
    }
    localStorage.setItem(cartStorageKey, JSON.stringify(cart));
    setCartMsg('Added to cart ✓');
    setTimeout(() => setCartMsg(''), 2000);
  };
 
  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
  };
 
  return (
    <div className="info">
      <h2>{productName}</h2>
      <p className="seller">Seller: {sellerName}</p>
      <div className="pd-rating">
        <span
          className="pd-rating-badge"
          onClick={openRatingModal}
          style={{ cursor: sellerId ? 'pointer' : 'default' }}
          title={sellerId ? 'View rating details' : ''}
        >
          <span className="pd-rating-label">Rating</span>
          <span className="pd-rating-stars" aria-label={`Rating ${rating} out of ${maxRating}`}>
            {Array.from({ length: maxRating }).map((_, index) => (
              <span key={index} style={getStarStyle(index)}>★</span>
            ))}
          </span>
          <span className="pd-rating-number">{rating > 0 ? `${formattedRating}/${maxRating}` : formattedRating}</span>
        </span>
        <span className="pd-reviews">({reviews} {reviews === 1 ? 'review' : 'reviews'})</span>
      </div>
      <h3 className="price">฿{Number(productPrice).toLocaleString()}</h3>
 
      {stock !== null && (
        <div className="stock-badge-row">
          {stock === 0 ? (
            <span className="stock-badge out">Out of Stock</span>
          ) : stock <= 5 ? (
            <span className="stock-badge low">Only {stock} left!</span>
          ) : (
            <span className="stock-badge in">In Stock ({stock} available)</span>
          )}
        </div>
      )}
 
      <div className="product-description">
        <p>{description}</p>
      </div>
 
<QuantitySelector quantity={qty} onQuantityChange={setQty} max={stock ?? undefined} />
 
      <div className="buttons">
        <button
          className="add"
          onClick={handleAddToCart}
          disabled={stock === 0 || isOwnProduct}
          style={{ cursor: (stock === 0 || isOwnProduct) ? 'not-allowed' : 'pointer', opacity: (stock === 0 || isOwnProduct) ? 0.6 : 1 }}
        >
          {isOwnProduct ? 'CANNOT BUY OWN PRODUCT' : (stock === 0 ? 'OUT OF STOCK' : (cartMsg || 'ADD TO CART'))}
        </button>
        <button className="buy" onClick={handleBuyNow} disabled={stock === 0 || isOwnProduct} style={{ cursor: (stock === 0 || isOwnProduct) ? 'not-allowed' : 'pointer', opacity: (stock === 0 || isOwnProduct) ? 0.6 : 1 }}>
          {isOwnProduct ? 'CANNOT BUY OWN PRODUCT' : 'BUY NOW'}
        </button>
      </div>
 
      <div
        className="seller-info"
        onClick={() => sellerId && navigate(`/seller/${sellerId}`)}
        style={{ cursor: sellerId ? 'pointer' : 'default' }}
        title={sellerId ? `View ${sellerName}'s profile` : ''}
      >
        <img src={sellerImage} alt="Seller" className="seller-avatar" />
        <div>
          <p className="seller-name">{sellerName}</p>
          <p className="seller-status">{sellerName}</p>
        </div>
      </div>

      {/* Rating Modal */}
      {ratingModal && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={() => setRatingModal(false)}
        >
          <div
            style={{ background: '#fff', borderRadius: '16px', padding: '28px 24px', minWidth: '320px', maxWidth: '480px', width: '90%', maxHeight: '80vh', overflowY: 'auto', boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>Seller Ratings</h3>
              <button onClick={() => setRatingModal(false)} style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: '#666', lineHeight: 1 }}>✕</button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', padding: '12px', background: '#f9f9f9', borderRadius: '10px' }}>
              <span style={{ fontSize: '32px', fontWeight: 700, color: '#f5b301' }}>{rating > 0 ? formattedRating : '0'}</span>
              <div>
                <div style={{ display: 'flex', gap: '2px' }}>
                  {Array.from({ length: maxRating }).map((_, i) => (
                    <span key={i} style={{ fontSize: '18px', ...getStarStyle(i) }}>★</span>
                  ))}
                </div>
                <span style={{ fontSize: '13px', color: '#888' }}>{reviews} {reviews === 1 ? 'review' : 'reviews'}</span>
              </div>
            </div>
            {ratingLoading ? (
              <p style={{ textAlign: 'center', color: '#888', padding: '20px 0' }}>Loading...</p>
            ) : ratingDetails.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#888', padding: '20px 0' }}>No reviews yet</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {ratingDetails.map((r) => (
                  <div key={r.orderItemId} style={{ padding: '12px', border: '1px solid #eee', borderRadius: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                      <img
                        src={r.reviewer?.images?.[0] || `https://i.pravatar.cc/40?u=${r.reviewer?._id}`}
                        alt={r.reviewer?.username}
                        style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div>
                        <p style={{ margin: 0, fontWeight: 600, fontSize: '14px' }}>{r.reviewer?.username || 'Anonymous'}</p>
                        <div style={{ display: 'flex', gap: '1px' }}>
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span key={i} style={{ fontSize: '14px', color: i < r.rating ? '#f5b301' : '#ddd' }}>★</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    {r.product?.name && (
                      <p style={{ margin: 0, fontSize: '12px', color: '#888' }}>Product: {r.product.name}</p>
                    )}
                    {r.ratedAt && (
                      <p style={{ margin: 0, fontSize: '12px', color: '#aaa' }}>
                        {new Date(r.ratedAt).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </p>
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
};

export default ProductInfo;