import { useState } from "react";

const QuantitySelector = ({ quantity, onQuantityChange, max }) => {
  const [internalCount, setInternalCount] = useState(1);

  // Use controlled or uncontrolled mode
  const count = quantity !== undefined ? quantity : internalCount;
  const setCount = (val) => {
    if (onQuantityChange) onQuantityChange(val);
    else setInternalCount(val);
  };

  const atMax = max != null && count >= max;

  return (
    <div className="quantity">
      <label>Quantity:</label>
      <button 
        className="qty-btn minus"
        onClick={() => setCount(count > 1 ? count - 1 : 1)}
      >
        −
      </button>
      <input
        className="qty-value"
        type="number"
        min="1"
        max={max != null ? max : undefined}
        value={count}
        onChange={(e) => {
          const val = parseInt(e.target.value, 10);
          if (isNaN(val) || val < 1) return setCount(1);
          if (max != null && val > max) return setCount(max);
          setCount(val);
        }}
        style={{ width: '48px',height: '40px', textAlign: 'center', border: '1px solid #ddd', borderRadius: '6px', padding: '4px 0', fontSize: '1rem', MozAppearance: 'textfield' }}
      />
      <button 
        className="qty-btn plus"
        onClick={() => !atMax && setCount(count + 1)}
        disabled={atMax}
        style={atMax ? { opacity: 0.4, cursor: 'not-allowed' } : {}}
      >
        +
      </button>
    </div>
  );
};

export default QuantitySelector;