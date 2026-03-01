import React from "react";
import { useNavigate } from "react-router-dom";
import "./ProductCard.css";

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
      id: props.id
    };
    navigate(`/product/${props.id}`, { state: { product: productData } });
  };

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
        <span className="item-price">{props.itemPrice}$</span>
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