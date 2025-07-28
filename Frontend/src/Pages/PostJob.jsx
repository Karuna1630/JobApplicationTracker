import React, { useState } from "react";
import axiosInstance from "../Utils/axiosInstance";
import { getUserIdFromToken } from "../Utils/jwtUtils";

const PostJob = ({ onClose }) => {
  const [jobData, setJobData] = useState({
    title: "",
    description: "",
    requirements: "",
    location: "",
    jobTypeId: "",
    salaryRangeMin: "",
    salaryRangeMax: "",
    experienceLevel: "",
    applicationDeadline: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setJobData({ ...jobData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      const token = localStorage.getItem("token");
      const userId = getUserIdFromToken(token);

      if (!userId || userId === 0) {
        setErrorMsg("User ID missing or invalid. Please log in again.");
        return;
      }

      const payload = {
        jobId: 0,
        postedByUserId: userId,
        title: jobData.title,
        description: jobData.description,
        requirements: jobData.requirements,
        location: jobData.location,
        jobTypeId: parseInt(jobData.jobTypeId),
        salaryRangeMin: parseFloat(jobData.salaryRangeMin) || 0,
        salaryRangeMax: parseFloat(jobData.salaryRangeMax) || 0,
        experienceLevel: parseInt(jobData.experienceLevel) || 0,
        status: true,
        postedAt: new Date().toISOString(),
        applicationDeadline: new Date(jobData.applicationDeadline).toISOString(),
      };

      const response = await axiosInstance.post("/submitjobs", payload);

      if (response.data?.isSuccess) {
        alert("Job posted successfully!");
        onClose();
      } else {
        setErrorMsg(response.data?.message || "Failed to post job.");
      }
    } catch (error) {
      console.error("Job Post Error:", error.response?.data || error.message);
      setErrorMsg("Failed to post job. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-3xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-lg"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-6">Post a New Job</h2>

        {errorMsg && <div className="text-red-600 mb-3">{errorMsg}</div>}

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
              className="mt-1 w-full px-4 py-2 border rounded-lg"
            />
          </div>

          {/* Job Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700">Job Description</label>
            <textarea
              name="description"
              value={jobData.description}
              onChange={handleChange}
              required
              rows="3"
              className="mt-1 w-full px-4 py-2 border rounded-lg"
            ></textarea>
          </div>

          {/* Requirements */}
          <div>
            <label className="block text-sm font-semibold text-gray-700">Requirements</label>
            <textarea
              name="requirements"
              value={jobData.requirements}
              onChange={handleChange}
              rows="3"
              className="mt-1 w-full px-4 py-2 border rounded-lg"
            ></textarea>
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
              className="mt-1 w-full px-4 py-2 border rounded-lg"
            />
          </div>

          {/* Job Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700">Job Type</label>
            <select
              name="jobTypeId"
              value={jobData.jobTypeId}
              onChange={handleChange}
              required
              className="mt-1 w-full px-4 py-2 border rounded-lg"
            >
              <option value="">Select type</option>
              <option value="1">Full-Time</option>
              <option value="2">Part-Time</option>
              <option value="3">Internship</option>
              <option value="4">Remote</option>
            </select>
          </div>

          {/* Salary Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700">Min Salary</label>
              <input
                type="number"
                name="salaryRangeMin"
                value={jobData.salaryRangeMin}
                onChange={handleChange}
                className="mt-1 w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">Max Salary</label>
              <input
                type="number"
                name="salaryRangeMax"
                value={jobData.salaryRangeMax}
                onChange={handleChange}
                className="mt-1 w-full px-4 py-2 border rounded-lg"
              />
            </div>
          </div>

          {/* Experience Level */}
          <div>
            <label className="block text-sm font-semibold text-gray-700">Experience Level</label>
            <select
              name="experienceLevel"
              value={jobData.experienceLevel}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border rounded-lg"
            >
              <option value="">Select level</option>
              <option value="0">Entry</option>
              <option value="1">Mid</option>
              <option value="2">Senior</option>
            </select>
          </div>

          {/* Deadline */}
          <div>
            <label className="block text-sm font-semibold text-gray-700">Application Deadline</label>
            <input
              type="date"
              name="applicationDeadline"
              value={jobData.applicationDeadline}
              onChange={handleChange}
              required
              className="mt-1 w-full px-4 py-2 border rounded-lg"
            />
          </div>

          {/* Submit */}
          <div className="text-right">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-700 text-white px-6 py-2 rounded-md shadow-md hover:bg-blue-800 transition"
            >
              {isLoading ? "Posting..." : "Post Job"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostJob;
