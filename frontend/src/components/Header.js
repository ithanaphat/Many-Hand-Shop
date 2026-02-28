import React from 'react';
import { useNavigate } from 'react-router-dom';

function Header({ onSignIn, onRegister }) {
  const navigate = useNavigate();

  return (
    <header className="App-header">
      <div className="left">
        <button
          className="brand-button"
          aria-label="Home"
          onClick={() => navigate('/')}
        >
          <img src="/mhs.png" alt="logo" className="logo" />
          <span className="brand">Many Hand Shop</span>
        </button>
      </div>

      <div className="center">
        <input
          className="search"
          type="search"
          placeholder="Search..."
          aria-label="Search"
        />
      </div>

      <div className="right auth-buttons">
        <button className="btn signin" onClick={onSignIn}>sign in</button>
        <button className="btn register" onClick={onRegister}>register</button>
      </div>
    </header>
  );
}

export default Header;