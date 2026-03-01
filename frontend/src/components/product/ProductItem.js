import React from 'react';
import './ProductCard.css';

const ProductItem = ({ name, price, productImage, sellerImage, sellerName }) => (
  <div className="product-card" style={{ width: '160px', margin: '28px 16px 8px' }}>
    <img
      src={sellerImage || 'https://i.pravatar.cc/150?u=seller'}
      alt="seller"
      className="profile-pic"
    />
    <span className="seller-name" style={{ fontSize: '0.75rem' }}>{sellerName || 'You'}</span>

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