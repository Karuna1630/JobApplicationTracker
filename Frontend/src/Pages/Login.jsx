import React from 'react';
import { FaUser } from 'react-icons/fa';
import email_icon from "../assets/email.png";
import password_icon from "../assets/password.png";
import loginimage from "../assets/loginimage.png";
import Footer from '../Components/Footer';
import Navbar from '../Components/Navbar';

const Login = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Sign in successful!');
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-300 px-4">
        <div className="bg-white rounded-2xl shadow-xl flex flex-col md:flex-row w-full max-w-4xl overflow-hidden">
          
          {/* Left Image */}
          <div className="md:w-1/2 hidden md:block">
            <img
              src={loginimage}
              alt="Login Visual"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right Form */}
          <div className="md:w-1/2 w-full px-8 py-10 flex flex-col justify-center">
            <div className="mb-6 text-center">
              <h2 className="text-3xl font-bold text-blue-800">Welcome Back</h2>
              <p className="text-gray-600">Login to your account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Username
              <div className="flex items-center border border-gray-300 px-3 py-2 rounded-md">
                <FaUser className="text-gray-500 mr-3" />
                <input
                  type="text"
                  placeholder="Username"
                  className="w-full bg-transparent outline-none text-base"
                  required
                />
              </div> */}

              {/* Email */}
              <div className="flex items-center border border-gray-300 px-3 py-2 rounded-md">
                <img src={email_icon} alt="email icon" className="w-5 mr-3" />
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full bg-transparent outline-none text-base"
                  required
                />
              </div>

              {/* Password */}
              <div className="flex items-center border border-gray-300 px-3 py-2 rounded-md">
                <img src={password_icon} alt="password icon" className="w-5 mr-3" />
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full bg-transparent outline-none text-base"
                  required
                />
              </div>

              {/* Options */}
              <div className="flex justify-between items-center text-sm text-gray-600">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="accent-blue-600" /> Remember me
                </label>
                <a href="#" className="text-blue-600 hover:underline">Forgot Password?</a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-blue-800 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition duration-300"
              >
                Login
              </button>

              {/* Register Link */}
              <p className="text-center text-sm">
                Don’t have an account?{' '}
                <a href="#" className="text-cyan-600 hover:underline">Register here</a>
              </p>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Login;
