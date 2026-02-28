import React from 'react';

function Footer() {
  return (
    <>
      <div className="footer-spacer" aria-hidden="true" />
      <footer className="app-footer">
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