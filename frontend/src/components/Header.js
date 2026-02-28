import React from 'react';
import { useNavigate } from 'react-router-dom';

function Header({ isLoggedIn = false, onSignIn, onRegister }) {
  const navigate = useNavigate();
  const logoSrc = `${process.env.PUBLIC_URL || ''}/mhs.png`;

  return (
    <header className="App-header">
      <div className="left">
        <button
          className="brand-button"
          aria-label="Home"
          onClick={() => navigate(isLoggedIn ? '/home-user' : '/')}
        >
          <img
            src={logoSrc}
            alt="logo"
            className="logo"
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = '/mhs.png';
            }}
          />
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

      {isLoggedIn ? (
        <div className="right auth-buttons user-actions">
          <button className="icon-circle-btn" aria-label="Profile" title="Profile">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="nav-icon-svg">
              <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="2" />
              <path d="M5 19C5 15.7 8.1 13 12 13C15.9 13 19 15.7 19 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          <button className="icon-circle-btn" aria-label="Cart" title="Cart">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="nav-icon-svg">
              <path d="M3 5H5L7 15H17L19 7H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="9" cy="19" r="1.5" fill="currentColor" />
              <circle cx="16" cy="19" r="1.5" fill="currentColor" />
            </svg>
          </button>
        </div>
      ) : (
        <div className="right auth-buttons">
          <button className="btn signin" onClick={onSignIn}>Sign In</button>
          <button className="btn register" onClick={onRegister}>Register</button>
        </div>
      )}
    </header>
  );
}

export default Header;