import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';


const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);


  

  

  

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    navigate('/');
  };

  // Responsive hero background image
  const heroBg = window.innerWidth <= 700
    ? process.env.PUBLIC_URL + '/header-mobile.webp'
    : process.env.PUBLIC_URL + '/header-desktop.webp';

  

  return (
    <div className="home-container">
      <Header user={user} handleLogout={handleLogout} />

      {/* Hero Section */}
      <section
        className="hero-bg-cover"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="hero-content">
          <h1 className="hero-title">
            Discover Amazing Digital Products
          </h1>
          <p className="hero-subtitle">
            From ebooks to software, templates to courses - find everything you need to grow and succeed
          </p>
          <div className="hero-buttons">
            <Link to="/products" className="hero-btn primary">Explore Products</Link>
            {!user && (
              <Link to="/register" className="hero-btn secondary">Get Started</Link>
            )}
          </div>
        </div>
      </section>

     

        <div className="view-all-section">
          <Link to="/products" className="view-all-btn">
            View All Products
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <h2>Why Choose DigitalDreamland?</h2>
        </div>
        
        <div className="features-grid">
          <div className="feature-card">
            <img src="/icons/secure-download.png" alt="Secure Downloads" className="feature-icon-img" />
            <h3>Secure Downloads</h3>
            <p>One-time download links ensure your digital products are secure and protected.</p>
          </div>
          
          <div className="feature-card">
            <img src="/icons/instant-access.png" alt="Instant Access" className="feature-icon-img" />
            <h3>Instant Access</h3>
            <p>Get immediate access to your purchases with instant download links.</p>
          </div>
          
          <div className="feature-card">
            <img src="/icons/secure-payment.png" alt="Secure Payments" className="feature-icon-img" />
            <h3>Secure Payments</h3>
            <p>Stripe-powered payments ensure your transactions are safe and secure.</p>
          </div>
          
          <div className="feature-card">
            <img src="/icons/mobile-friendly.png" alt="Mobile Friendly" className="feature-icon-img" />
            <h3>Mobile Friendly</h3>
            <p>Access your digital products anywhere, anytime with our mobile-optimized platform.</p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQ />
      {/* Footer */}
      <footer className="home-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>DigitalDreamland</h3>
            <p>Your trusted source for digital products</p>
          </div>
          
          <div className="footer-section">
            <h4>Quick Links</h4>
            <Link to="/products">Products</Link>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </div>
          
          <div className="footer-section">
            <h4>Support</h4>
            <p>Contact us for any questions</p>
            <p>Email: support@digitaldreamland.com</p>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2024 DigitalDreamland. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;