import React from 'react';
import { FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { FaPhone } from "react-icons/fa";
import registerimage from "../assets/registerimage.png";
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';

const Register = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-300">
        <div className="bg-white rounded-2xl shadow-xl flex flex-col md:flex-row w-full max-w-5xl overflow-hidden">

          {/* Left Side Image */}
          <div className="md:w-1/2 hidden md:block">
            <img
              src={registerimage}
              alt="Visual"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right Side Form */}
          <div className="md:w-1/2 w-full p-8 flex flex-col justify-center">
            <h2 className="text-2xl font-bold text-center mb-1">Create Account</h2>
            <p className="text-center text-gray-600 mb-6">Get started with your job journey</p>

            <form className="space-y-4">
              {/* First Name */}
              <div className="flex items-center border border-gray-300 px-3 py-2 rounded-md">
                <FaUser className="text-gray-500 mr-3" />
                <input type="text" placeholder="First Name" className="w-full outline-none bg-transparent text-base" required />
              </div>

              {/* Last Name */}
              <div className="flex items-center border border-gray-300 px-3 py-2 rounded-md">
                <FaUser className="text-gray-500 mr-3" />
                <input type="text" placeholder="Last Name" className="w-full outline-none bg-transparent text-base" required />
              </div>

              {/* Email */}
              <div className="flex items-center border border-gray-300 px-3 py-2 rounded-md">
                <MdEmail className="text-gray-500 mr-3 text-lg" />
                <input type="email" placeholder="Email Address" className="w-full outline-none bg-transparent text-base" required />
              </div>

              {/* Password */}
              <div className="flex items-center border border-gray-300 px-3 py-2 rounded-md">
                <RiLockPasswordFill className="text-gray-500 mr-3 text-lg" />
                <input type="password" placeholder="Password" className="w-full outline-none bg-transparent text-base" required />
              </div>

              {/* Confirm Password */}
              <div className="flex items-center border border-gray-300 px-3 py-2 rounded-md">
                <RiLockPasswordFill className="text-gray-500 mr-3 text-lg" />
                <input type="password" placeholder="Confirm Password" className="w-full outline-none bg-transparent text-base" required />
              </div>

              {/* Phone Number */}
              <div className="flex items-center border border-gray-300 px-3 py-2 rounded-md">
                <FaPhone className="text-gray-500 mr-3" />
                <input type="tel" placeholder="Phone Number" className="w-full outline-none bg-transparent text-base" required />
              </div>

              {/* Experience Level Dropdown */}
              <div className="border border-gray-300 px-3 py-2 rounded-md">
                <select className="w-full outline-none bg-transparent text-base text-gray-700" required>
                  <option value="">Select Experience Level</option>
                  <option>Entry</option>
                  <option>Mid</option>
                  <option>Senior</option>
                  <option>Executive</option>
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-purple-600 text-white py-2 rounded-md text-lg font-medium hover:bg-purple-700 transition"
              >
                Create Account
              </button>

              {/* Sign In Link */}
              <p className="text-center text-sm mt-4">
                Already have an account?{" "}
                <a href="#" className="text-cyan-600 hover:underline">Sign in here</a>
              </p>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Register;
