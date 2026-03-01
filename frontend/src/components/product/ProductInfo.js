import { useNavigate } from "react-router-dom";
import QuantitySelector from "./QuantitySelector";
import "./ProductDetail.css";

const ProductInfo = ({ product }) => {
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
  const sellerImage = displayProduct.sellerImage || "https://i.pravatar.cc/150?u=default";
  const rating = displayProduct.rating || 4.2;
  const maxRating = 5;
  const fullStars = Math.floor(rating);
  const partial = rating % 1;
  const reviews = displayProduct.reviews || 124;
  const description = displayProduct.description || "Authentic pre-loved item in excellent condition. Perfect for collectors and fashion enthusiasts.";

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

  const navigate = useNavigate();

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
          <span className="pd-rating-number">{rating}/{maxRating}</span>
        </span>
        <span className="pd-reviews">({reviews} reviews)</span>
      </div>
      <h3 className="price">${productPrice}</h3>

      <div className="product-description">
        <p>{description}</p>
      </div>

      <QuantitySelector />

      <div className="buttons">
        <button className="add" onClick={() => navigate('/cart')}>ADD TO CART</button>
        <button classity="buy">BUY NOW</button>
      </div>

      <div className="seller-info">
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