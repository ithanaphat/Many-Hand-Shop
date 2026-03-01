import React from 'react';

function Footer({ showSpacer = true }) {
  const logoSrc = `${process.env.PUBLIC_URL || ''}/mhs.png`;

  return (
    <>
      {showSpacer && <div className="footer-spacer" aria-hidden="true" />}
      <footer className="app-footer">
        <div className="footer-brand">
          <img
            src={logoSrc}
            alt="Many Hand Shop logo"
            className="footer-logo"
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = '/mhs.png';
            }}
          />
          <span className="footer-brand-name">Many Hand Shop</span>
        </div>

        <h3 className="footer-title">About us</h3>
        <p className="footer-description">
          is a marketplace that connects buyers and sellers of quality second-hand products online.
        </p>

        <div className="footer-links">
          <a href="#">Shop</a>
          <a href="#">Contact</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms &amp; Conditions</a>
        </div>

        <p className="footer-copyright">© {new Date().getFullYear()} Many Hand Shop</p>
      </footer>
    </>
  );
}

export default Footer;