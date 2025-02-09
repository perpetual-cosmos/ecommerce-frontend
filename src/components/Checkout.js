import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const stripePromise = loadStripe('pk_test_51Nw...YOUR_PUBLIC_KEY...'); 

const CheckoutForm = ({ products, user, isCart, total }) => {
  


 

  return (
    <form className="checkout-form" onSubmit={handleSubmit}>
      <h2>Checkout</h2>
      <div className="checkout-product-summary-list">
        {products.map(product => (
          <div className="checkout-product-summary" key={product._id}>
            <img src={product.imageUrl} alt={product.name} className="checkout-product-image" />
            <div>
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <div className="checkout-product-price">
                {product.offer_price ? (
                  <>
                    <span className="checkout-offer-price">${product.offer_price}</span>
                    <span className="checkout-original-price">${product.price}</span>
                  </>
                ) : (
                  <span className="checkout-price">${product.price}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="checkout-total">Total: <span>${total.toFixed(2)}</span></div>
      {!user && (
        <div className="checkout-field">
          <label>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
      )}
      <div className="checkout-field">
        <label>Card Details</label>
        <div className="checkout-card-element">
          <CardElement options={{ style: { base: { fontSize: '18px' } } }} />
        </div>
      </div>
      {error && <div className="checkout-error">{error}</div>}
      <button className="checkout-pay-btn" type="submit" disabled={!stripe || processing}>
        {processing ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
};

const Checkout = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const { cart } = useCart();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    if (productId === 'cart') {
      setLoading(false);
    } else {
      axios.get(`${API_BASE_URL}/api/product/${productId}`)
        .then(res => {
          setProduct(res.data);
          setLoading(false);
        });
    }
  }, [productId]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/';
  };

  if (loading || (productId === 'cart' && cart.length === 0)) return <div className="checkout-loading">Loading...</div>;

  let products = [];
  let total = 0;
  let isCart = false;
  if (productId === 'cart') {
    products = cart;
    total = cart.reduce((sum, item) => sum + (item.offer_price ? item.offer_price : item.price) * item.quantity, 0);
    isCart = true;
  } else if (product) {
    products = [product];
    total = product.offer_price ? product.offer_price : product.price;
  }

  return (
    <>
      <Header user={user} handleLogout={handleLogout} />
      <div className="checkout-container">
        <Elements stripe={stripePromise}>
          <CheckoutForm products={products} user={user} isCart={isCart} total={total} />
        </Elements>
      </div>
      <Footer />
    </>
  );
};

export default Checkout;