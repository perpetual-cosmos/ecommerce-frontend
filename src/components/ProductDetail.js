import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';


const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const { addToCart, cart } = useCart();
  const [added, setAdded] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    axios.get(`${API_BASE_URL}/api/product/${id}`)
      .then(res => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Product not found');
        setLoading(false);
      });
  }, [id]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/';
  };

 

  return (
    <>
      <Header user={user} handleLogout={handleLogout} />
      <div className="product-detail-container">
        <div className="product-detail-main">
          <div className="product-detail-image-section">
            <img src={product.imageUrl} alt={product.name} className="product-detail-image" />
          </div>
          <div className="product-detail-info-section">
            <span className="product-detail-category">{product.category}</span>
            <h1 className="product-detail-title">{product.name}</h1>
            <p className="product-detail-description">{product.description}</p>
            <div className="product-detail-pricing">
              {product.offer_price ? (
                <>
                  <span className="product-detail-offer-price">${product.offer_price}</span>
                  <span className="product-detail-original-price">${product.price}</span>
                  <span className="product-detail-offer-badge">On Offer!</span>
                </>
              ) : (
                <span className="product-detail-price">${product.price}</span>
              )}
            </div>
            <div className="product-detail-actions">
              <Link to={`/checkout/${product._id}`} className="product-detail-buy-btn">Buy Now</Link>
              <button
                className="product-detail-add-btn"
                onClick={() => {
                  addToCart(product);
                  setAdded(true);
                  setTimeout(() => setAdded(false), 1200);
                }}
                disabled={added || cart.some(item => item._id === product._id)}
              >
                {added || cart.some(item => item._id === product._id) ? 'Added' : 'Add to Cart'}
              </button>
            </div>
          </div>
        </div>
        <div className="product-detail-features-section">
          <h2>Product Features</h2>
          
        </div>
       
      </div>
     
    </>
  );
};

export default ProductDetail; 