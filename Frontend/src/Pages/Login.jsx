import React, { useState } from 'react';
import user_icon from "../assets/user.png";
import email_icon from "../assets/email.png";
import password_icon from "../assets/password.png";
import loginimage from "../assets/loginimage.png";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert('Sign in successful!');
    }, 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-300">
      <div className="bg-white rounded-2xl shadow-xl flex flex-col md:flex-row w-full max-w-4xl h-[500px] overflow-hidden">

        {/* Left Side Image */}
        <div className="md:w-1/2 w-full h-full hidden md:block">
          <img
            src={loginimage}
            alt="Login Visual"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Side Form */}
        <div className="md:w-1/2 w-full h-full p-8 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-center mb-2">Welcome Back</h2>
          <p className="text-center text-gray-600 mb-6">Sign in to your account</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center border border-gray-300 px-3 py-2 rounded-md">
              <img src={user_icon} alt="user icon" className="w-5 mr-3" />
              <input
                type="text"
                placeholder="Username"
                className="w-full bg-transparent outline-none text-base"
                required
              />
            </div>

            <div className="flex items-center border border-gray-300 px-3 py-2 rounded-md">
              <img src={email_icon} alt="email icon" className="w-5 mr-3" />
              <input
                type="email"
                placeholder="Email"
                className="w-full bg-transparent outline-none text-base"
                required
              />
            </div>

            <div className="flex items-center border border-gray-300 px-3 py-2 rounded-md">
              <img src={password_icon} alt="password icon" className="w-5 mr-3" />
              <input
                type="password"
                placeholder="Password"
                className="w-full bg-transparent outline-none text-base"
                required
              />
            </div>

            <div className="flex justify-between items-center text-sm text-gray-600">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="accent-purple-600" /> Remember me
              </label>
              <a href="#" className="text-blue-600 hover:underline">Forgot Password?</a>
            </div>

            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-2 rounded-md font-medium hover:bg-purple-700 transition duration-300"
            >
              {isLoading ? 'Loging In...' : 'Log In'}
            </button>

            <p className="text-center text-sm mt-4">
              Don’t have an account?{' '}
              <a href="#" className="text-cyan-600 hover:underline">Login here</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
