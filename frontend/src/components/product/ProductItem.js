import React from 'react';
import './ProductCard.css';

const ProductItem = ({ name, price, productImage, sellerImage, sellerName, onClick }) => (
  <div
    className="product-card"
    style={{ width: '160px', margin: '8px 16px', cursor: onClick ? 'pointer' : 'default' }}
    onClick={onClick}
  >
    <div className="product-image-box" style={{ height: '160px' }}>
      <img
        src={productImage || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300'}
        alt={name}
        className="product-image"
      />
    </div>

    <div className="product-details">
      <span className="item-name" style={{ fontSize: '0.85rem' }}>{name}</span>
      <span className="item-price" style={{ fontSize: '0.95rem' }}>{price}$</span>
    </div>
  </div>
);

export default ProductItem;