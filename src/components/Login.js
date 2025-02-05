import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';


const Login = () => {
 
 

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error when user starts typing
    setEmailNotVerified(false); // Clear email verification error
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setEmailNotVerified(false);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, formData);
      
      // Store token and user data
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Set axios default header for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      
      // Clear any pending verification email
      localStorage.removeItem('pendingVerificationEmail');
      
      // Redirect based on user role
      if (response.data.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      if (err.response?.data?.emailNotVerified) {
        setEmailNotVerified(true);
        setError('Your email is not verified. Please check your inbox.');
        localStorage.setItem('pendingVerificationEmail', formData.email);
      } else {
        console.error(err);
        setError('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const resendVerification = async () => {
    setResending(true);
    try {
      await axios.post(`${API_BASE_URL}/api/auth/resend-verification`, { 
        email: formData.email 
      });
      setError('Verification email sent successfully! Please check your inbox.');
      setEmailNotVerified(false);
    } catch (err) {
      console.error(err);
      setError('Failed to send verification email. Please try again.');
    } finally {
      setResending(false);
    }
  };

  const checkVerificationStatus = async () => {
    setLoading(true);
    try {
      // Try to login again to check if email is now verified
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, formData);
      
      // If successful, update localStorage and redirect
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      localStorage.removeItem('pendingVerificationEmail');
      
      if (response.data.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      if (err.response?.data?.emailNotVerified) {
        setError('Email is still not verified. Please check your inbox and click the verification link.');
      } else {
        console.error(err);
        setError('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Welcome Back</h2>
          <p>Sign in to your account to continue</p>
        </div>

        {error && (
          <div className={`error-message ${emailNotVerified ? 'email-not-verified' : ''}`}>
            {error}
            {emailNotVerified && (
              <div className="verification-options">
                <p>Need to verify your email?</p>
                <div className="verification-buttons">
                  <button 
                    onClick={resendVerification} 
                    disabled={resending}
                    className="resend-verification-btn"
                  >
                    {resending ? 'Sending...' : 'Resend Verification Email'}
                  </button>
                  <button 
                    onClick={checkVerificationStatus} 
                    disabled={loading}
                    className="check-verification-btn"
                  >
                    {loading ? 'Checking...' : 'I\'ve Verified My Email'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <button 
            type="submit" 
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account? <Link to="/register" className="auth-link">Register here</Link>
          </p>
          {emailNotVerified && (
            <p className="verification-note">
              <small>
                Having trouble? Check your spam folder or{' '}
                <button 
                  onClick={resendVerification} 
                  disabled={resending}
                  className="inline-link"
                >
                  request a new verification email
                </button>
              </small>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;