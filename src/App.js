import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './components/CartContext';
// Lazy load all main pages
const Home = lazy(() => import('./components/Home'));
const Login = lazy(() => import('./components/Login'));
const Register = lazy(() => import('./components/Register'));
const EmailVerification = lazy(() => import('./components/EmailVerification'));
const ProductList = lazy(() => import('./components/ProductList'));
const ProductDetail = lazy(() => import('./components/ProductDetail'));
const Checkout = lazy(() => import('./components/Checkout'));
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));
const Cart = lazy(() => import('./components/Cart'));

function App() {
  return (
    <CartProvider>
      <Router>
        <Suspense fallback={<div style={{textAlign: 'center', marginTop: 60}}>Loading...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-email" element={<EmailVerification />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/checkout/:productId" element={<Checkout />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/cart" element={<Cart />} />
          </Routes>
        </Suspense>
      </Router>
    </CartProvider>
  );
}
export default App;