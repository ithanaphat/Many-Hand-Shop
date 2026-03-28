import React from 'react';

const InfoItem = ({ icon, text }) => {
  // Handle multi-line addresses (when address contains commas, display nicely)
  const isAddress = icon === "📍" && text.includes(',');
  
  if (isAddress) {
    const parts = text.split(',').map(part => part.trim());
    return (
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '10px', color: '#666' }}>
        <span style={{ fontSize: '18px', paddingTop: '2px' }}>{icon}</span>
        <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
          {parts.map((part, index) => (
            <div key={index}>{part}</div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', color: '#666' }}>
      <span style={{ fontSize: '18px' }}>{icon}</span>
      <span style={{ fontSize: '14px' }}>{text}</span>
    </div>
  );
};

export default InfoItem;