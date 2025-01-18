import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';


const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { addToCart, cart } = useCart();
  const [addedId, setAddedId] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Refresh user data to get latest verification status
      refreshUserData();
    }

    // Fetch featured products
    fetchFeaturedProducts();
  }, []);

  const refreshUserData = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/auth/profile`);
      const updatedUser = response.data.user;
      
      // Update localStorage with fresh user data
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      console.error('Error refreshing user data:', error);
      // If token is invalid, clear localStorage
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
      }
    }
  };

  const fetchFeaturedProducts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/product?limit=6`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <div className="home-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading amazing products...</p>
        </div>
      </div>
    );
  }

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

      {/* Featured Products */}
      <section className="featured-section">
        <div className="section-header">
          <h2>Featured Products</h2>
          <p>Handpicked digital products for you</p>
        </div>

        {products.length > 0 ? (
          <div className="product-grid">
            {products.map(product => (
              <div key={product._id} className="product-card">
                {product.imageUrl && (
                  <Link to={`/product/${product._id}`}>
                    <img src={product.imageUrl} alt={product.name} className="product-image" />
                  </Link>
                )}
                <div className="product-info">
                  <span className="product-category">{product.category}</span>
                  <Link to={`/product/${product._id}`} className="product-detail-link">
                    <h3>{product.name}</h3>
                  </Link>
                  <div>
                    <span className="product-price">
                      ${product.offer_price ? product.offer_price : product.price}
                    </span>
                    {product.offer_price && (
                      <>
                        <span className="product-original-price">${product.price}</span>
                        <span className="product-offer">On Offer!</span>
                      </>
                    )}
                  </div>
                  <Link to={`/checkout/${product._id}`} className="buy-now-btn">Buy Now</Link>
                  <button
                    className="add-to-cart-btn"
                    onClick={() => {
                      addToCart(product);
                      setAddedId(product._id);
                      setTimeout(() => setAddedId(null), 1200);
                    }}
                    disabled={addedId === product._id || cart.some(item => item._id === product._id)}
                  >
                    {addedId === product._id || cart.some(item => item._id === product._id) ? 'Added' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-products">
            <p>No products available at the moment.</p>
          </div>
        )}

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