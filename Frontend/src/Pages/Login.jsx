import React from 'react';
import { FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-300">
        <div className="bg-white rounded-2xl shadow-xl flex flex-col md:flex-row w-full max-w-4xl h-[630px] overflow-hidden">

          {/* Left Side Image */}
          <div className="md:w-1/2 w-full h-full hidden md:block">
            <img
              src={loginimage}
              alt="Login Visual"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right Side Form */}
          <div className="md:w-1/2 w-full h-full px-8 py-10 flex flex-col gap-2 justify-start">
            <div className="mb-4">
              <h2 className="text-3xl font-bold text-center">Welcome Back</h2>
              <p className="text-center text-gray-600">Login to your account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* First Name */}
              <div className="flex items-center border border-gray-300 px-3 py-2 rounded-md">
                <FaUser className="text-gray-500 mr-3" />
                <input
                  type="text"
                  placeholder="First Name"
                  className="w-full bg-transparent outline-none text-base"
                  required
                />
              </div>

              {/* Last Name */}
              <div className="flex items-center border border-gray-300 px-3 py-2 rounded-md">
                <FaUser className="text-gray-500 mr-3" />
                <input
                  type="text"
                  placeholder="Last Name"
                  className="w-full bg-transparent outline-none text-base"
                  required
                />
              </div>

              {/* Email */}
              <div className="flex items-center border border-gray-300 px-3 py-2 rounded-md">
                <MdEmail className="text-gray-500 mr-3 text-lg" />
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full bg-transparent outline-none text-base"
                  required
                />
              </div>

              {/* Password */}
              <div className="flex items-center border border-gray-300 px-3 py-2 rounded-md">
                <RiLockPasswordFill className="text-gray-500 mr-3 text-lg" />
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full bg-transparent outline-none text-base"
                  required
                />
              </div>

              {/*Confirm Password*/}
              
              <div className="flex items-center border border-gray-300 px-3 py-2 rounded-md">
                <RiLockPasswordFill className="text-gray-500 mr-3 text-lg" />
                <input
                  type="confirm password"
                  placeholder="Confirm Password"
                  className="w-full bg-transparent outline-none text-base"
                  required
                />
              </div>

              {/* Remember Me + Forgot Password */}
              <div className="flex justify-between items-center text-sm text-gray-600">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="accent-purple-600" /> Remember me
                </label>
                <a href="#" className="text-blue-600 hover:underline">Forgot Password?</a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-blue-800 text-white py-2 rounded-md font-medium hover:bg-blue-600 transition duration-300"
              >
                Login
              </button>

              {/* Sign Up Link */}
              <p className="text-center text-sm mt-4">
                Don’t have an account?{' '}
                <a href="#" className="text-cyan-600 hover:underline">Sign up here</a>
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
