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
        <div className="search-wrap">
          <span className="search-icon" aria-hidden="true">
            <svg
              className="search-icon-svg"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
              <path d="M20 20L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
          <input
            className="search"
            type="search"
            placeholder="Search..."
            aria-label="Search"
          />
        </div>
      </div>

      <div className="right auth-buttons">
        <button className="btn signin" onClick={onSignIn}>Sign In</button>
        <button className="btn register" onClick={onRegister}>Register</button>
      </div>
    </header>
  );
}

export default Header;