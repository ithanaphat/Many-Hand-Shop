import { useState } from "react";
import "./cart.css";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

const initialData = [
  { id: 1, name: "itemname", price: 99, quantity: 1, selected: true },
  { id: 2, name: "itemname", price: 99, quantity: 2, selected: true },
  { id: 3, name: "itemname", price: 99, quantity: 1, selected: false }
];

function Cart({ isLoggedIn, onLogout }) {
  const [items, setItems] = useState(initialData);

  const updateQuantity = (id, amount) => {
    setItems(
      items.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + amount) }
          : item
      )
    );
  };

  const toggleSelect = (id) => {
    setItems(
      items.map(item =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const toggleSelectAll = () => {
    const allSelected = items.every(item => item.selected);
    setItems(items.map(item => ({ ...item, selected: !allSelected })));
  };

  const total = items
    .filter(item => item.selected)
    .reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div>
      <Header isLoggedIn={true} onLogout={onLogout} />

      <div className="cart-container">

      <div className="cart-header">
        <span></span>
        <span></span>
        <span>Unit Price</span>
        <span>Quantity</span>
        <span>Total Price</span>
      </div>

      {items.map(item => (
        <div key={item.id} className="cart-row">

          <input
            type="checkbox"
            checked={item.selected}
            onChange={() => toggleSelect(item.id)}
          />

          <div className="cart-product">
            <div className="image-box"></div>
            <span className="item-name">{item.name}</span>
          </div>

          <span>{item.price}$</span>

          <div className="quantity-box">
            <button onClick={() => updateQuantity(item.id, -1)}>-</button>
            <span>{item.quantity}</span>
            <button onClick={() => updateQuantity(item.id, 1)}>+</button>
          </div>

          <span className="row-total">
            {item.price * item.quantity}$
          </span>

        </div>
      ))}

      <div className="cart-footer">
        <div className="select-all">
          <input
            type="checkbox"
            checked={items.every(item => item.selected)}
            onChange={toggleSelectAll}
          />
          <span>select all</span>
        </div>

        <div className="total-section">
          <span>Total : </span>
          <span className="total-price">{total}$</span>
          <button className="purchase-btn">PURCHASE</button>
        </div>
      </div>

      <Footer />
      </div>
    </div>
  );
}

export default Cart;