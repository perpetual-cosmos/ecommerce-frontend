import React, { useState, useEffect } from 'react';
import './EmailVerification.css';
import API_BASE_URL from '../services/api';

const EmailVerification = () => {
  
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