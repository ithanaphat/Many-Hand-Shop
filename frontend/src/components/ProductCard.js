import React from 'react';
import './ProductCard.css';

// ใส่คำว่า props ไว้ในวงเล็บ เพื่อรอรับข้อมูล
function ProductCard(props) {
  return (
    <div className="product-card">
      {/* ดึงข้อมูลจาก props มาแสดง */}
      <img src={props.sellerImage} alt="seller" className="profile-pic" />
      <span className="seller-name">{props.sellerName}</span>

      <div className="product-image-box">
        {/* ดึงรูปสินค้าจาก props */}
        <img src={props.productImage} alt={props.itemName} className="product-image" />
      </div>

      <div className="product-details">
        {/* ดึงชื่อและราคาจาก props */}
        <span className="item-name">{props.itemName}</span>
        <span className="item-price">{props.itemPrice}$</span>
      </div>
    </div>
  );
}

export default ProductCard;