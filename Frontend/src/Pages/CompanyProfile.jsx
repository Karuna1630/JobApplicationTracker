import React from 'react';
import { useNavigate } from "react-router-dom";
import Logo from "../assets/logof.png";
import Footer from "../Components/Footer";
import Navbar from "../Components/Navbar";

const CompanyProfile = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-300">
      <Navbar />

      <main className="flex-grow flex items-center justify-center p-8">
        <div className="w-full max-w-2xl bg-white border-2 border-black shadow-xl rounded-xl p-4">
          <div className="flex flex-col items-center">
            
            {/* Company Logo */}
            <img
              src={Logo} 
              className="w-54 h-32 rounded-full border-black shadow-xl"
            />

            {/* Company Name */}
            <h2 className="mt-3 text-2xl font-semibold">Anshu Pvt. Ltd.</h2>

            {/* Company Info */}
            <div className="mt-6 w-full text-sm text-gray-700 px-3">
              <h3 className="font-semibold text-black">CONTACT INFORMATION</h3>
              <p>
                <span className="font-medium">Email:</span>{' '}
                <a href="example@Anshu.com" className="text-blue-600">
                  example@Anshu.com
                </a>
              </p>
              <p><span className="font-medium">Phone:</span> +977-9812345678</p>
              <p><span className="font-medium">Website:</span>{' '}
                <a href="https://www.Anshu.com" target="_blank" rel="noopener noreferrer" className="text-blue-600">
                  www.Anshu.com
                </a>
              </p>
              <p><span className="font-medium">Address:</span> Belbari, Nepal</p>

              <h3 className="mt-4 font-semibold text-black">COMPANY DETAILS</h3>
              <p><span className="font-medium">Industry:</span> Information Technology</p>
              <p><span className="font-medium">Founded:</span> 2015</p>
              <p className="mt-2">
                <span className="font-medium">About:</span> Anshu pvt. Ltd is a leading software development company specializing in scalable web and mobile solutions.
              </p>
            </div>

            {/* Edit Profile Button */}
            <button
              onClick={() => navigate("/editCompanyProfile")}
              className="mt-6 px-6 bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-800 transition"
            >
              Edit Company Profile
            </button>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CompanyProfile;
