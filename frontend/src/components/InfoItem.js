import React from 'react';

const InfoItem = ({ icon, text }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', color: '#666' }}>
    <span style={{ fontSize: '18px' }}>{icon}</span>
    <span style={{ fontSize: '14px' }}>{text}</span>
  </div>
);

export default InfoItem;