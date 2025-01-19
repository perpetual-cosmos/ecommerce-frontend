import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Home.css';
import { useCart } from './CartContext';

const CartIcon = () => {
  const { cart } = useCart();
  const navigate = useNavigate();
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);

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
     
         
      
  
    </header>
  );
};

export default Header; 