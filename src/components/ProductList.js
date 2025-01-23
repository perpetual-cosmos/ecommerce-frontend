import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const { addToCart, cart } = useCart();
  const [addedId, setAddedId] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    axios.get(`${API_BASE_URL}/api/product`)
      .then(res => {
        console.log('Fetched products:', res.data); // Debug log
        setProducts(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch products');
        setLoading(false);
        console.error(err);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/';
  };

  if (loading) return <div>Loading products...</div>;
  if (error) return <div style={{color: 'red'}}>{error}</div>;

  return (
    <>
      <Header user={user} handleLogout={handleLogout} />
      <div className="product-list-container">
        <h2>Products</h2>
        {products.length === 0 ? (
          <div>No products found.</div>
        ) : (
          <div className="product-grid">
            {products.map(product => (
              <div className="product-card" key={product._id}>
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
        )}
        <FAQ />
      </div>
      <Footer />
    </>
  );
};
export default ProductList;