import React from 'react';
import { useNavigate } from 'react-router-dom';
import QuantitySelector from "./QuantitySelector";
import "./ProductDetail.css";
 
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
        <span className="pd-rating-badge">
          <span className="pd-rating-label">Rating</span>
          <span className="pd-rating-stars" aria-label={`Rating ${rating} out of ${maxRating}`}>
            {Array.from({ length: maxRating }).map((_, index) => (
              <span key={index} style={getStarStyle(index)}>★</span>
            ))}
          </span>
          <span className="pd-rating-number">{rating > 0 ? `${rating}/${maxRating}` : 'No rating'}</span>
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
          <p className="seller-status">Verified Seller</p>
        </div>
      </div>
    </div>
  );
};
 
export default ProductInfo;