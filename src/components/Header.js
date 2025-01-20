import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Home.css';
import { useCart } from './CartContext';

const CartIcon = () => {
  const { cart } = useCart();
  const navigate = useNavigate();
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  return (
    <div className="cart-icon-wrapper" onClick={() => navigate('/cart')} title="View Cart" aria-label="Cart">
      {/* Modern shopping cart SVG icon */}
      <svg className="cart-icon-svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#256d46" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h7.72a2 2 0 0 0 2-1.61l1.6-8.39H6" />
      </svg>
      {totalCount > 0 && <span className="cart-badge">{totalCount}</span>}
    </div>
  );
};

const Header = ({ user, handleLogout }) => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const navigate = useNavigate();

  const closeMobileNav = () => setMobileNavOpen(false);

  const NavLinks = (
    <>
      <Link to="/" className="nav-link active" onClick={closeMobileNav}>Home</Link>
      <Link to="/products" className="nav-link" onClick={closeMobileNav}>Products</Link>
      {user && (
        <>
          <Link to="/my-orders" className="nav-link" onClick={closeMobileNav}>My Orders</Link>
          {user.role === 'admin' && (
            <Link to="/admin" className="nav-link" onClick={closeMobileNav}>Admin</Link>
          )}
        </>
      )}
    </>
  );

  return (
    <header className="home-header">
      <div className="header-content">
        <button className="hamburger" aria-label="Open navigation menu" onClick={() => setMobileNavOpen(v => !v)}>
          <span></span>
          <span></span>
          <span></span>
        </button>
        <div className="logo" onClick={() => { navigate('/'); closeMobileNav(); }} style={{ cursor: 'pointer' }}>
          <h1>DigitalDreamland</h1>
        </div>
        <nav className="nav-menu">
          {NavLinks}
        </nav>
        <div className="auth-section">
          {user ? (
            <div className="user-menu">
              <span className="user-name">Welcome, {user.name}</span>
              {user.isEmailVerified && (
                <span className="verification-badge verified">✓ Verified</span>
              )}
              <button onClick={() => { handleLogout(); closeMobileNav(); }} className="logout-btn">Logout</button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="auth-btn login-btn" onClick={closeMobileNav}>Login</Link>
              <Link to="/register" className="auth-btn register-btn" onClick={closeMobileNav}>Register</Link>
            </div>
          )}
          <CartIcon />
        </div>
      </div>
      {/* Mobile Nav Overlay */}
      <div className={`mobile-nav${mobileNavOpen ? ' open' : ''}`} onClick={closeMobileNav}>
        <nav onClick={e => e.stopPropagation()}>{NavLinks}</nav>
        <div className="auth-section" style={{ flexDirection: 'column', gap: 16 }}>
          {user ? (
            <div className="user-menu" style={{ flexDirection: 'column', gap: 8 }}>
              <span className="user-name">Welcome, {user.name}</span>
              {user.isEmailVerified && (
                <span className="verification-badge verified">✓ Verified</span>
              )}
              <button onClick={() => { handleLogout(); closeMobileNav(); }} className="logout-btn">Logout</button>
            </div>
          ) : (
            <div className="auth-buttons" style={{ flexDirection: 'column', gap: 8 }}>
              <Link to="/login" className="auth-btn login-btn" onClick={closeMobileNav}>Login</Link>
              <Link to="/register" className="auth-btn register-btn" onClick={closeMobileNav}>Register</Link>
            </div>
          )}
          <CartIcon />
        </div>
      </div>
    </header>
  );
};

export default Header; 