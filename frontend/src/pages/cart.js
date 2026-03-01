import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Cart.css";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

function Cart({ isLoggedIn, onLogout }) {
  const navigate = useNavigate();
  // โหลดจาก localStorage ตั้งแต่ต้น ไม่ต้องรอ useEffect
  const [items, setItems] = useState(() => {
    const saved = JSON.parse(localStorage.getItem('mhs_cart') || '[]');
    return saved.map(item => ({ ...item, selected: true }));
  });

  // บันทึกลง localStorage ทุกครั้งที่ items เปลี่ยน
  useEffect(() => {
    const toSave = items.map(({ selected, ...rest }) => rest);
    localStorage.setItem('mhs_cart', JSON.stringify(toSave));
  }, [items]);

  const updateQuantity = (id, amount) => {
    setItems(prev =>
      prev.map(item => {
        if (item.id !== id) return item;
        const maxQty = item.stock ?? Infinity;
        const newQty = Math.min(Math.max(1, item.quantity + amount), maxQty);
        return { ...item, quantity: newQty };
      })
    );
  };

  const removeItem = (id) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const toggleSelect = (id) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const toggleSelectAll = () => {
    const allSelected = items.every(item => item.selected);
    setItems(prev => prev.map(item => ({ ...item, selected: !allSelected })));
  };

  const selectedItems = items.filter(item => item.selected);
  const total = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      alert('Please select at least 1 item.');
      return;
    }
    navigate('/checkout', { state: { cartItems: selectedItems, total } });
  };

  return (
    <div className="cart-page">
      <Header isLoggedIn={isLoggedIn} onLogout={onLogout} />

      <div className="cart-wrapper">
        <h1 className="cart-title">🛒 Shopping Cart</h1>

        {items.length === 0 ? (
          <div className="cart-empty">
            <p>Your cart is empty.</p>
            <button className="cart-shop-btn" onClick={() => navigate('/')}>
              Browse Products
            </button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="cart-header">
              <input
                type="checkbox"
                checked={items.every(i => i.selected)}
                onChange={toggleSelectAll}
              />
              <span>Product</span>
              <span className="col-center">Price / Item</span>
              <span className="col-center">Quantity</span>
              <span className="col-center">Total</span>
              <span></span>
            </div>

            {/* Items */}
            <div className="cart-items">
              {items.map(item => (
                <div key={item.id} className="cart-row">
                  <input
                    type="checkbox"
                    checked={item.selected}
                    onChange={() => toggleSelect(item.id)}
                  />

                  <div className="cart-product">
                    <div className="cart-img-box">
                      {item.image ? (
                        <img src={item.image} alt={item.name} />
                      ) : (
                        <div className="cart-img-placeholder" />
                      )}
                    </div>
                    <span className="cart-item-name">{item.name}</span>
                  </div>

                  <span className="col-center cart-price">฿{Number(item.price).toLocaleString()}</span>

                  <div className="cart-qty col-center">
                    <button onClick={() => updateQuantity(item.id, -1)}>−</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                  </div>

                  <span className="col-center cart-row-total">
                    ฿{(item.price * item.quantity).toLocaleString()}
                  </span>

                  <button className="cart-delete" onClick={() => removeItem(item.id)}>
                    <i className='bx bx-trash'></i>
                  </button>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="cart-footer">
              <div className="cart-select-all">
                <input
                  type="checkbox"
                  checked={items.every(i => i.selected)}
                  onChange={toggleSelectAll}
                />
                <span>Select All ({items.length})</span>
                <button className="cart-delete-selected" onClick={() => setItems(prev => prev.filter(i => !i.selected))}>
                  Remove Selected
                </button>
              </div>

              <div className="cart-total-section">
                <span className="cart-total-label">
                  Total ({selectedItems.length} items):
                </span>
                <span className="cart-total-price">฿{total.toLocaleString()}</span>
                <button className="cart-checkout-btn" onClick={handleCheckout}>
                  Checkout ({selectedItems.length})
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default Cart;
