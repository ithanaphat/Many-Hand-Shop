import { useState } from "react";

const QuantitySelector = ({ quantity, onQuantityChange }) => {
  const [internalCount, setInternalCount] = useState(1);

  // Use controlled or uncontrolled mode
  const count = quantity !== undefined ? quantity : internalCount;
  const setCount = (val) => {
    if (onQuantityChange) onQuantityChange(val);
    else setInternalCount(val);
  };

  return (
    <div className="quantity">
      <label>Quantity:</label>
      <button 
        className="qty-btn minus"
        onClick={() => setCount(count > 1 ? count - 1 : 1)}
      >
        −
      </button>
      <span className="qty-value">{count}</span>
      <button 
        className="qty-btn plus"
        onClick={() => setCount(count + 1)}
      >
        +
      </button>
    </div>
  );
};

export default QuantitySelector;