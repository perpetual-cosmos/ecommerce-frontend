import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Footer = () => (
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
);

export default Footer; 