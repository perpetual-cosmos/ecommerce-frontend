import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';


const Login = () => {
 


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