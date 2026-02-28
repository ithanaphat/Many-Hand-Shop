import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Header({ isLoggedIn = false, onSignIn, onRegister, onLogout }) {
  const navigate = useNavigate();
  const logoSrc = `${process.env.PUBLIC_URL || ''}/mhs.png`;
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

  useEffect(() => {
    if (!isProfileMenuOpen) {
      return undefined;
    }

    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileMenuOpen]);

  const handleProfileClick = () => {
    setIsProfileMenuOpen(false);
    navigate('/profile');
  };

  const handleLogoutClick = () => {
    setIsProfileMenuOpen(false);
    navigate('/home', { replace: true });
    if (onLogout) {
      onLogout();
    }
  };

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
          <div className="profile-menu" ref={profileMenuRef}>
            <button
              className="icon-circle-btn"
              aria-label="Profile"
              title="Profile"
              onClick={() => setIsProfileMenuOpen((prev) => !prev)}
            >
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="nav-icon-svg">
                <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="2" />
                <path d="M5 19C5 15.7 8.1 13 12 13C15.9 13 19 15.7 19 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>

            {isProfileMenuOpen && (
              <div className="profile-dropdown" role="menu" aria-label="Profile menu">
                <button type="button" className="dropdown-item" onClick={handleProfileClick}>Profile</button>
                <button type="button" className="dropdown-item danger" onClick={handleLogoutClick}>Log out</button>
              </div>
            )}
          </div>
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