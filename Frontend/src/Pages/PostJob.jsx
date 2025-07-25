import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

const PostJob = () => {
  const navigate = useNavigate();

  const [jobData, setJobData] = useState({
    title: "",
    location: "",
    type: "",
    description: "",
    deadline: "",
  });

  const handleChange = (e) => {
    setJobData({ ...jobData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Job Posted:", jobData);
    navigate("/companyProfile");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100">

      <div className="flex-grow flex justify-center items-center px-4 py-10">
        <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-2">

          {/* Left Panel - Info */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-10 hidden md:flex flex-col justify-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Hire?</h2>
            <p className="text-lg leading-relaxed">
              Post your open position and attract top talent to join your team. Fill out the details and hit the button!
            </p>
            <div className="mt-8">
              
             
            </div>
          </div>

          {/* Right Panel - Form */}
          <div className="p-8 sm:p-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Post a New Job</h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Job Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700">Job Title</label>
                <input
                  type="text"
                  name="title"
                  value={jobData.title}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Frontend Developer"
                  className="mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-semibold text-gray-700">Location</label>
                <input
                  type="text"
                  name="location"
                  value={jobData.location}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Kathmandu / Remote"
                  className="mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              {/* Job Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700">Job Type</label>
                <select
                  name="type"
                  value={jobData.type}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">Select type</option>
                  <option value="Full-Time">Full-Time</option>
                  <option value="Part-Time">Part-Time</option>
                  <option value="Internship">Internship</option>
                  <option value="Remote">Remote</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700">Job Description</label>
                <textarea
                  name="description"
                  value={jobData.description}
                  onChange={handleChange}
                  required
                  rows="4"
                  placeholder="Describe the job responsibilities, skills, etc."
                  className="mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                ></textarea>
              </div>

              {/* Deadline */}
              <div>
                <label className="block text-sm font-semibold text-gray-700">Application Deadline</label>
                <input
                  type="date"
                  name="deadline"
                  value={jobData.deadline}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              {/* Submit */}
              <div className="text-right">
                <button
                  type="submit"
                  className="bg-blue-700 text-white px-6 py-2 rounded-md shadow-md hover:bg-blue-800 transition"
                >
                  Post Job
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

    </div>
  );
};

export default PostJob;
