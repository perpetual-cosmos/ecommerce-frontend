import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import Header from './Header';
import Footer from './Footer';
import { useCart } from './CartContext';
import './Checkout.css';
import API_BASE_URL from '../services/api';

const stripePromise = loadStripe('pk_test_51Nw...YOUR_PUBLIC_KEY...'); // TODO: Replace with your real Stripe public key

const CheckoutForm = ({ products, user, isCart, total }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [email, setEmail] = useState(user?.email || '');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const { clearCart } = useCart();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      let res;
      if (isCart) {
        res = await axios.post(`${API_BASE_URL}/api/payment/create-payment-intent`, {
          productIds: products.map(p => p._id)
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        res = await axios.post(`${API_BASE_URL}/api/payment/create-payment-intent`, {
          productId: products[0]._id
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      const clientSecret = res.data.clientSecret;
      const { paymentIntent, error: stripeError } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: { email }
        }
      });
      if (stripeError) {
        console.error(stripeError);
        setError('Payment failed. Please check your card details and try again.');
        setProcessing(false);
        return;
      }
      if (paymentIntent.status === 'succeeded') {
        setSuccess(true);
        if (isCart) clearCart();
      } else {
        setError('Payment failed.');
      }
    } catch (err) {
      console.error(err);
      setError('Payment failed. Please try again.');
    }
    setProcessing(false);
  };

  if (success) {
    return <div className="checkout-success">Payment successful! 🎉<br/>Check your email for download instructions.</div>;
  }

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