import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';


const Cart = () => {
 



  if (cart.length === 0) {
    return (
      <>
        <Header />
        <div className="cart-container empty">
          <h2>Your Cart is Empty</h2>
          <Link to="/products" className="cart-back-btn">Browse Products</Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="cart-container">
        <h2>Your Cart</h2>
        <div className="cart-list">
          {cart.map(item => (
            <div className="cart-item" key={item._id}>
              <img src={item.imageUrl} alt={item.name} className="cart-item-image" />
              <div className="cart-item-info">
                <h3>{item.name}</h3>
                <div className="cart-item-price">
                  {item.offer_price ? (
                    <>
                      <span className="cart-offer-price">${item.offer_price}</span>
                      <span className="cart-original-price">${item.price}</span>
                    </>
                  ) : (
                    <span className="cart-price">${item.price}</span>
                  )}
                </div>
                <div className="cart-item-qty">
                  <label>Qty:</label>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={e => {
                      setUpdating(item._id);
                      updateQuantity(item._id, Math.max(1, Number(e.target.value)));
                      setTimeout(() => setUpdating(null), 500);
                    }}
                  />
                </div>
                <button className="cart-remove-btn" onClick={() => removeFromCart(item._id)} disabled={updating === item._id}>Remove</button>
              </div>
            </div>
          ))}
        </div>
        <div className="cart-summary">
          <div className="cart-subtotal">Subtotal: <span>${subtotal.toFixed(2)}</span></div>
          <button className="cart-clear-btn" onClick={clearCart}>Clear Cart</button>
          <button className="cart-checkout-btn" onClick={() => navigate('/checkout/cart')}>Proceed to Checkout</button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Cart; 