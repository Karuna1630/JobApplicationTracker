import React from "react";
import { useNavigate } from "react-router-dom";
import { FiEdit, FiPhone } from "react-icons/fi";
import { FaBuilding } from "react-icons/fa";
import Logo from "../assets/logoc.png";
import BannerBg from "../assets/Banner.png";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

const CompanyProfile = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      {/* Main Container */}
      <div className="flex-grow flex justify-center px-4 py-10">
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden relative">

          {/* Banner Section */}
          <div
            className="h-56 bg-cover bg-center relative"
            style={{ backgroundImage: `url(${BannerBg})` }}
          >
            {/* Top-right buttons */}
            <div className="absolute top-64 right-4 flex gap-2 z-20">
              <button className="bg-blue-400 hover:bg-blue-500 text-white text-sm font-medium px-4 py-1.5 border border-blue-500 rounded-md shadow-sm">
                Add profile section
              </button>
              <button className="bg-white hover:bg-gray-100 text-sm font-medium px-3 py-1.5 border border-gray-300 rounded-md shadow-sm">
                More
              </button>
              <button
                onClick={() => navigate("/editCompanyProfile")}
                className="bg-white hover:bg-gray-100 text-gray-700 p-2 border border-gray-300 rounded-full shadow"
                title="Edit Profile"
              >
                <FiEdit className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Logo */}
          <div className="absolute top-36 left-2/2 transform -translate-x-2/2 z-30">
            <img
              src={Logo}
              alt="Company Logo"
              className="w-36 h-36 rounded-full border-4 border-white shadow-lg object-cover transition-transform duration-300 hover:scale-105 bg-white"
            />
          </div>

          {/* Information Section */}
          <div className="mt-20 px-10 pb-10">
            <h1 className="text-4xl font-bold text-gray-800 text-wrap">Anshu Pvt. Ltd.</h1>
            <p className="text-md text-gray-600 mt-2 text-center italic">
              Over 2 years of experience building modern, scalable, and user-centric web applications using
              React, TypeScript, and other cutting-edge technologies.
            </p>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
              {/* Contact Info */}
              <div className="bg-blue-50 p-5 rounded-xl shadow">
                <h2 className="text-lg font-semibold text-blue-800 mb-2 flex items-center gap-2">
                  <FiPhone className="text-blue-600" /> Contact Info
                </h2>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>
                    <strong>Email:</strong>{" "}
                    <a href="mailto:example@anshu.com" className="text-blue-600 hover:underline">
                      example@anshu.com
                    </a>
                  </li>
                  <li>
                    <strong>Phone:</strong> +977-9812345678
                  </li>
                  <li>
                    <strong>Website:</strong>{" "}
                    <a
                      href="https://www.anshu.com"
                      className="text-blue-600 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      www.anshu.com
                    </a>
                  </li>
                  <li>
                    <strong>Address:</strong> Belbari, Nepal
                  </li>
                </ul>
              </div>

              {/* Company Details */}
              <div className="bg-indigo-50 p-5 rounded-xl shadow">
                <h2 className="text-lg font-semibold text-indigo-800 mb-2 flex items-center gap-2">
                  <FaBuilding className="text-indigo-700" /> Company Details
                </h2>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>
                    <strong>Industry:</strong> Information Technology
                  </li>
                  <li>
                    <strong>Founded:</strong> 2015
                  </li>
                  <li>
                    <strong>About:</strong> Anshu Pvt. Ltd is a leading software development company
                    specializing in scalable web and mobile solutions.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CompanyProfile;
