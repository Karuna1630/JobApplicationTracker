import React from "react";
import { useNavigate } from "react-router-dom";
import { FiEdit, FiPhone } from "react-icons/fi";
import { FaBuilding } from "react-icons/fa";
import Logo from "../assets/logoc.png";
import BannerBg from "../assets/Banner.png";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import CompanyInsights from "./CompanyInsight"; 



const CompanyProfile = () => {
  const navigate = useNavigate();

  const postedJobs = [
    {
      id: 1,
      title: "Frontend Developer",
      location: "Kathmandu",
      postedOn: "July 2, 2025",
    },
    {
      id: 2,
      title: "Backend Developer",
      location: "Remote",
      postedOn: "June 28, 2025",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-100 via-white to-blue-300">
      <Navbar />

      <div className="flex-grow flex justify-center px-4 py-10">
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg overflow-hidden relative">

          {/* Banner */}
          <div
            className="h-48 bg-cover bg-center relative"
            style={{ backgroundImage: `url(${BannerBg})` }}
          >
            {/* Edit button */}
            <button
              onClick={() => navigate("/editCompanyProfile")}
              className="absolute top-4 right-4 bg-white border p-2 rounded-full shadow"
              title="Edit Profile"
            >
              <FiEdit className="text-gray-600" />
            </button>
          </div>

          {/* Logo */}
          <div className="absolute top-28 left-2/2 transform -translate-x-2/2">
            <img
              src={Logo}
              alt="Company Logo"
              className="w-28 h-28 rounded-full border-4 border-white bg-white shadow-md object-cover"
            />
          </div>

          {/* Profile Info */}
          <div className="mt-20 px-6 pb-10 text-wrap">
            <h1 className="text-2xl font-bold text-gray-800">Anshu Pvt. Ltd.</h1>
            <p className="text-sm text-gray-600 mt-1">
              Leading software company building web and mobile solutions.
            </p>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 text-left">
              {/* Contact Info */}
              <div className="bg-blue-50 p-4 rounded-lg shadow-sm">
                <h2 className="text-blue-700 font-semibold flex items-center gap-2 mb-2">
                  <FiPhone /> Contact Info
                </h2>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li><strong>Email:</strong> example@anshu.com</li>
                  <li><strong>Phone:</strong> +977-9812345678</li>
                  <li><strong>Website:</strong> www.anshu.com</li>
                  <li><strong>Address:</strong> Belbari, Nepal</li>
                </ul>
              </div>

              {/* Company Details */}
              <div className="bg-indigo-50 p-4 rounded-lg shadow-sm">
                <h2 className="text-indigo-700 font-semibold flex items-center gap-2 mb-2">
                  <FaBuilding /> Company Details
                </h2>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li><strong>Industry:</strong> Information Technology</li>
                  <li><strong>Founded:</strong> 2015</li>
                  <li><strong>About:</strong> We build scalable digital solutions.</li>
                </ul>
              </div>
            </div>

            {/* Dashboard Section */}
            <div className="mt-10 text-left">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Dashboard</h2>

              {/* Action Buttons */}
              <div className="mb-6">
                <button
                  onClick={() => navigate("/postJob")}
                  className="bg-green-400 hover:bg-green-500 text-white px-4 py-2 rounded-md text-sm w-full md:w-auto"
                >
                  + Post New Job
                </button>
              </div>

              {/* Posted Jobs Table */}
              <div className="bg-white border rounded-lg shadow-sm mb-10">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-100 text-gray-700">
                    <tr>
                      <th className="px-4 py-2">Title</th>
                      <th className="px-4 py-2">Location</th>
                      <th className="px-4 py-2">Posted On</th>
                      <th className="px-4 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {postedJobs.map((job) => (
                      <tr key={job.id} className="border-t hover:bg-gray-50">
                        <td className="px-4 py-2">{job.title}</td>
                        <td className="px-4 py-2">{job.location}</td>
                        <td className="px-4 py-2">{job.postedOn}</td>
                        <td className="px-4 py-2">
                          <button
                            onClick={() => navigate(`/viewApplications/${job.id}`)}
                            className="text-blue-600 hover:underline"
                          >
                            View Applications
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* 🔥 Company Insights Graph Section */}
              <div className="mt-10">
                <CompanyInsights />
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
