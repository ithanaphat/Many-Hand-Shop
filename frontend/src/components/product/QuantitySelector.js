import { useState } from "react";

const QuantitySelector = () => {
  const [count, setCount] = useState(1);

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