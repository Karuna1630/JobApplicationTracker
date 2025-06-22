import React, { useState } from 'react';
import "./Signin.css";
import user_icon from "../assets/user.png";
import email_icon from "../assets/email.png";
import password_icon from "../assets/password.png";

const Signin = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert('Sign in successful!');
    }, 2000);
  };

  return (
    <div className="signin-wrapper">
      <div className="signin-box">
        <h2 className="signin-title">Welcome Back</h2>
        <p className="signin-subtitle">Sign in to your account</p>

        <form className="signin-form">
          {/* Username Field */}
          <div className="input-box">
            <img src={user_icon} alt="user icon" className="input-icon" />
            <input type="text" placeholder="Username" />
          </div>

          {/* Email Field */}
          <div className="input-box">
            <img src={email_icon} alt="email icon" className="input-icon" />
            <input type="email" placeholder="Email" />
          </div>

          {/* Password Field */}
          <div className="input-box">
            <img src={password_icon} alt="password icon" className="input-icon" />
            <input type="password" placeholder="Password" />
          </div>

          {/* Options */}
          <div className="signin-options">
            <label>
              <input type="checkbox" /> Remember me
            </label>
            <a href="#">Forgot Password?</a>
          </div>

          {/* Submit Button */}
          <button type="button" onClick={handleSubmit} className="signin-button">
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>

          {/* Sign up Link */}
          <p className="signup-link">
            Don’t have an account? <a href="#">Sign up here</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signin;