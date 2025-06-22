import React from 'react';
import './Register.css';
import user_icon from './Assets/user.png';
import email_icon from './Assets/email.png';
import password_icon from './Assets/password.png';
import phone_icon from './Assets/phone.png';
import leftimage from "./assets/leftimage.png";

const Register = () => {
  return (
    <div className="register-wrapper">
      {/* Left Side (Make it larger to fit images) */}
      <div className="left-panel">
        <img src={leftimage} alt="Visual 1" className="left-image" />
        <img src={leftimage} alt="Visual 2" className="left-image" />
      </div>

      {/* Right Side (Form) */}
      <div className="right-panel">
        <h2>Create Account</h2>
        <p>Get started with your job journey</p>

        <form className="register-form">
          <div className="input-box">
            <img src={user_icon} className="input-icon" alt="" />
            <input type="text" placeholder="Full Name" />
          </div>
          <div className="input-box">
            <img src={email_icon} className="input-icon" alt="" />
            <input type="email" placeholder="Email Address" />
          </div>
          <div className="input-box">
            <img src={password_icon} className="input-icon" alt="" />
            <input type="password" placeholder="Password" />
          </div>
          <div className="input-box">
            <img src={password_icon} className="input-icon" alt="" />
            <input type="password" placeholder="Confirm Password" />
          </div>
          <div className="input-box">
            <img src={phone_icon} className="input-icon" alt="" />
            <input type="tel" placeholder="Phone Number" />
          </div>
          <div className="input-box">
            <select className="select-input">
              <option>Select Experience Level</option>
              <option>Entry</option>
              <option>Mid</option>
              <option>Senior</option>
              <option>Executive</option>
            </select>
          </div>
          <button className="register-button">Create Account</button>
          <p className="signin-link">
            Already have an account? <a href="#">Sign in here</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
