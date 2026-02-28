import React from 'react';

const ProductItem = ({ name, price }) => (
  <div style={{ width: '100px' }}>
    <div style={{ width: '100px', height: '120px', backgroundColor: '#ddd', borderRadius: '8px' }}></div>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px', fontSize: '12px' }}>
      <span>{name}</span>
      <span style={{ fontWeight: 'bold' }}>{price}$</span>
    </div>
  </div>
);

export default ProductItem;