import React from 'react';
import user_icon from "../assets/user.png";
import email_icon from "../assets/email.png";
import password_icon from "../assets/password.png";
import phone_icon from "../assets/phone.png";
import registerimage from "../assets/registerimage.png";

const Register = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-300">
      <div className="bg-white rounded-2xl shadow-xl flex flex-col md:flex-row w-full max-w-5xl overflow-hidden">
        
        {/* RegisterImage for Left Side  */}
        <div className="md:w-1/2 hidden md:block">
          <img
            src={registerimage}
            alt="Visual"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Side (Form) */}
        <div className="md:w-1/2 w-full p-8 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-center mb-1">Create Account</h2>
          <p className="text-center text-gray-600 mb-6">Get started with your job journey</p>

          <form className="space-y-4">
            <div className="flex items-center border border-gray-300 px-3 py-2 rounded-md">
              <img src={user_icon} className="w-5 mr-3" alt="User" />
              <input type="text" placeholder="Full Name" className="w-full outline-none bg-transparent text-base" />
            </div>

            <div className="flex items-center border border-gray-300 px-3 py-2 rounded-md">
              <img src={email_icon} className="w-5 mr-3" alt="Email" />
              <input type="email" placeholder="Email Address" className="w-full outline-none bg-transparent text-base" />
            </div>

            <div className="flex items-center border border-gray-300 px-3 py-2 rounded-md">
              <img src={password_icon} className="w-5 mr-3" alt="Password" />
              <input type="password" placeholder="Password" className="w-full outline-none bg-transparent text-base" />
            </div>

            <div className="flex items-center border border-gray-300 px-3 py-2 rounded-md">
              <img src={password_icon} className="w-5 mr-3" alt="Confirm Password" />
              <input type="password" placeholder="Confirm Password" className="w-full outline-none bg-transparent text-base" />
            </div>

            <div className="flex items-center border border-gray-300 px-3 py-2 rounded-md">
              <img src={phone_icon} className="w-5 mr-3" alt="Phone" />
              <input type="tel" placeholder="Phone Number" className="w-full outline-none bg-transparent text-base" />
            </div>

            <div className="border border-gray-300 px-3 py-2 rounded-md">
              <select className="w-full outline-none bg-transparent text-base">
                <option>Select Experience Level</option>
                <option>Entry</option>
                <option>Mid</option>
                <option>Senior</option>
                <option>Executive</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-2 rounded-md text-lg font-medium hover:bg-purple-700 transition"
            >
              Create Account
            </button>

            <p className="text-center text-sm mt-4">
              Already have an account?{" "}
              <a href="#" className="text-cyan-600 hover:underline">Sign in here</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;