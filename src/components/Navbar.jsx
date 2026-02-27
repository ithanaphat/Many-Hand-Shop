import { Link } from 'react-router-dom'

export default function Navbar({ signedIn = false }) {
  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to={signedIn ? '/home' : '/'} aria-label="Go to home page">
          <img src="/images/logo-mhs.png" alt="Many Hand Shop Logo" className="mhs-logo-image" />
        </Link>
        <h1 className="logo">Many Hand Shop</h1>
      </div>

      <div className="nav-middle">
        <div className="search-container">
          <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="6"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input type="text" placeholder="Search for products..." />
        </div>
      </div>

      <div className="nav-right">
        {signedIn ? (
          <>
            <Link className="icon-link" to="/home" title="Profile">
              <img src="/images/Ellipse 3.png" alt="Profile" width="40" height="40" />
            </Link>
            <Link className="icon-link" to="/cart" title="Cart">
              <img src="/images/Vector.png" alt="Cart" width="40" height="40" />
            </Link>
          </>
        ) : (
          <>
            <Link className="nav-link" to="/signin">Sign In</Link>
            <Link className="nav-link" to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  )
}
