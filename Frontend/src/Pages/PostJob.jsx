import React, { useState } from "react";

const PostJob = ({ onClose }) => {
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
    onClose(); 
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-3xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-lg"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-6">Post a New Job</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700">Job Title</label>
            <input
              type="text"
              name="title"
              value={jobData.title}
              onChange={handleChange}
              required
              className="mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">Location</label>
            <input
              type="text"
              name="location"
              value={jobData.location}
              onChange={handleChange}
              required
              className="mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">Job Type</label>
            <select
              name="type"
              value={jobData.type}
              onChange={handleChange}
              required
              className="mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select type</option>
              <option value="Full-Time">Full-Time</option>
              <option value="Part-Time">Part-Time</option>
              <option value="Internship">Internship</option>
              <option value="Remote">Remote</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">Job Description</label>
            <textarea
              name="description"
              value={jobData.description}
              onChange={handleChange}
              required
              rows="4"
              className="mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">Application Deadline</label>
            <input
              type="date"
              name="deadline"
              value={jobData.deadline}
              onChange={handleChange}
              required
              className="mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
            />
          </div>

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
  );
};

export default PostJob;
