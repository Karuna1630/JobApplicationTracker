import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from '../Utils/axiosInstance';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import email_icon from "../assets/email.png";
import password_icon from "../assets/password.png";
import loginimage from "../assets/loginimage.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post("login", {
        email,
        password,
      });
      console.log("User Logged In:", response.data);
      toast.success("User login successful!");
      navigate("/");
    } catch (error) {
      console.error("Login Error:", error);
      toast.error("Failed to login user.");
    }
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
              {/* Email */}
              <div className="flex items-center border border-gray-300 px-3 py-2 rounded-md">
                <img src={email_icon} alt="email icon" className="w-5 mr-3" />
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full bg-transparent outline-none text-base"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="flex justify-between items-center text-sm text-gray-600">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="accent-blue-600" /> Remember me
                </label>
                <a href="#" className="text-blue-600 hover:underline">Forgot Password?</a>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-800 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition duration-300"
              >
                Login
              </button>

              <p className="text-center text-sm">
                Don’t have an account?{' '}
                <a href="/register" className="text-cyan-600 hover:underline">Register here</a>
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
