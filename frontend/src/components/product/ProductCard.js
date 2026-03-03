import React from "react";
import { useNavigate } from "react-router-dom";
import "./ProductCard.css";
import 'boxicons/css/boxicons.min.css';

function ProductCard(props) {
  const navigate = useNavigate();

  const handleClick = () => {
    const productData = {
      sellerImage: props.sellerImage,
      sellerName: props.sellerName,
      productImage: props.productImage,
      itemName: props.itemName,
      itemPrice: props.itemPrice,
      stock: props.stock,
      id: props.id,
      sellerRating: props.sellerRating || 0
    };
    navigate(`/product/${props.id}`, { state: { product: productData } });
  };

  // Dynamic font size based on price length
  const priceStr = Number(props.itemPrice).toLocaleString() + '$';
  const priceFontSize = priceStr.length > 12 ? '0.78rem' : priceStr.length > 9 ? '0.95rem' : '1.1rem';

  // Seller rating stars
  const rating = Number(props.sellerRating) || 0;
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.5;

  return (
    <div
      className="product-card"
      onClick={handleClick}
      style={{ cursor: "pointer" }}
    >
      <img src={props.sellerImage} alt="seller" className="profile-pic" />
      <span className="seller-name">{props.sellerName}</span>

      <div className="product-image-box">
        <img
          src={props.productImage}
          alt={props.itemName}
          className="product-image"
        />
      </div>

      <div className="product-details">
        <span className="item-name">{props.itemName}</span>
        <span className="item-price" style={{ fontSize: priceFontSize }}>{Number(props.itemPrice).toLocaleString()}$</span>
      </div>

      <div className="card-rating-row">
        {[1, 2, 3, 4, 5].map((star) => (
          <i
            key={star}
            className={
              star <= fullStars
                ? 'bx bxs-star'
                : star === fullStars + 1 && hasHalf
                ? 'bx bxs-star-half'
                : 'bx bx-star'
            }
          />
        ))}
        <span className="card-rating-value">{rating > 0 ? rating.toFixed(1) : 'No rating'}</span>
      </div>

      {props.stock !== undefined && props.stock !== null && (
        <div className="card-stock-row">
          {props.stock === 0 ? (
            <span className="card-stock out">Out of Stock</span>
          ) : props.stock <= 5 ? (
            <span className="card-stock low">Only {props.stock} left</span>
          ) : (
            <span className="card-stock in">In Stock</span>
          )}
        </div>
      )}
    </div>
  );
}

export default ProductCard;