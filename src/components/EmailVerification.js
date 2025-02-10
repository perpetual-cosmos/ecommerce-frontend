import React, { useState, useEffect } from 'react';
import './EmailVerification.css';
import API_BASE_URL from '../services/api';

const EmailVerification = () => {
  



 
 

 
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