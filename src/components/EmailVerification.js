import React, { useState, useEffect } from 'react';
import './EmailVerification.css';
import API_BASE_URL from '../services/api';

const EmailVerification = () => {
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (!token) {
      setStatus('error');
      setError('No verification token found in the URL.');
      return;
    }

    verifyEmail(token);
  }, []);

  useEffect(() => {
    if (status === 'success' && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (status === 'success' && countdown === 0) {
      window.location.href = '/login';
    }
  }, [status, countdown]);

  const verifyEmail = async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/verify-email/${token}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage(data.message);
        
        // Update localStorage if user data exists
        const existingUser = localStorage.getItem('user');
        if (existingUser) {
          const userData = JSON.parse(existingUser);
          userData.isEmailVerified = true;
          localStorage.setItem('user', JSON.stringify(userData));
        }
        
        // Clear pending verification email
        localStorage.removeItem('pendingVerificationEmail');
      } else {
        setStatus('error');
        console.error(data);
        setError('Verification failed. Please try again.');
      }
    } catch (error) {
      setStatus('error');
      console.error(error);
      setError('Network error. Please try again.');
    }
  };

  const handleResendVerification = async () => {
    setStatus('verifying');
    setError('');
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/resend-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: localStorage.getItem('pendingVerificationEmail') || ''
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage('Verification email sent successfully! Please check your inbox.');
      } else {
        setStatus('error');
        console.error(data);
        setError('Failed to resend verification email. Please try again.');
      }
    } catch (error) {
      setStatus('error');
      console.error(error);
      setError('Network error. Please try again.');
    }
  };

  const renderContent = () => {
    switch (status) {
      case 'verifying':
        return (
          <div className="verification-content">
            <div className="verification-spinner">
              <div className="spinner"></div>
            </div>
            <h2>Verifying Your Email</h2>
            <p>Please wait while we verify your email address...</p>
          </div>
        );

      case 'success':
        return (
          <div className="verification-content">
            <div className="verification-icon success">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22,4 12,14.01 9,11.01"></polyline>
              </svg>
            </div>
            <h2>Email Verified Successfully!</h2>
            <p>{message}</p>
            <p className="redirect-message">
              Redirecting to login page in {countdown} seconds...
            </p>
            <button 
              className="btn-primary"
              onClick={() => window.location.href = '/login'}
            >
              Go to Login Now
            </button>
          </div>
        );

      case 'error':
        return (
          <div className="verification-content">
            <div className="verification-icon error">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
            </div>
            <h2>Verification Failed</h2>
            <p className="error-message">{error}</p>
            <div className="verification-actions">
              <button 
                className="btn-secondary"
                onClick={handleResendVerification}
              >
                Resend Verification Email
              </button>
              <button 
                className="btn-primary"
                onClick={() => window.location.href = '/login'}
              >
                Go to Login
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="email-verification-container">
      <div className="verification-card">
        <div className="verification-header">
          <h1>DigitalDreamland</h1>
          <p>Email Verification</p>
        </div>
        {renderContent()}
      </div>
    </div>
  );
};

export default EmailVerification; 