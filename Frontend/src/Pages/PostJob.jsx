import React, { useState } from "react";
import axiosInstance from "../Utils/axiosInstance";
import { getUserIdFromToken } from "../Utils/jwtUtils";

const PostJob = ({ onClose, onJobPosted, companyId }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: "",
    location: "",
    salaryRangeMin: "",
    salaryRangeMax: "",
    jobTypeId: "",
    experienceLevel: "",
    applicationDeadline: "",
  });

  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (
      !formData.title ||
      !formData.description ||
      !formData.jobTypeId ||
      !formData.experienceLevel ||
      !formData.applicationDeadline
    ) {
      setErrorMsg("Please fill all required fields, including application deadline.");
      return;
    }

    if (!companyId) {
      setErrorMsg("Company ID is missing.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMsg("");

      const token = localStorage.getItem("token");
      if (!token) {
        setErrorMsg("You must be logged in to post a job.");
        setIsSubmitting(false);
        return;
      }

      const userId = getUserIdFromToken(token);
      if (!userId) {
        setErrorMsg("Invalid user token.");
        setIsSubmitting(false);
        return;
      }

      // Prepare the payload for API
      const payload = {
        ...formData,
        companyId, // use the prop directly
        postedByUserId: userId,
        jobTypeId: parseInt(formData.jobTypeId, 10),
        experienceLevel: parseInt(formData.experienceLevel, 10),
        salaryRangeMin: formData.salaryRangeMin ? parseFloat(formData.salaryRangeMin) : null,
        salaryRangeMax: formData.salaryRangeMax ? parseFloat(formData.salaryRangeMax) : null,
        applicationDeadline: new Date(formData.applicationDeadline).toISOString(),
        postedAt: new Date().toISOString(),
        status: "A",
        views: 0,
      };

      // Make the POST request
      const res = await axiosInstance.post("/api/Jobs/submitjobs", payload);

      if (res.status === 200 || res.status === 201) {
        const createdJob = res.data;
        if (onJobPosted) onJobPosted(createdJob);
        if (onClose) onClose();
      } else {
        setErrorMsg("Failed to post job. Please try again.");
      }
    } catch (err) {
      console.error("Post job error:", err.response || err.message || err);
      setErrorMsg("Failed to post job. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    // Backdrop
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      {/* Modal Box */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-8 relative"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          ✖
        </button>

        <h2 className="text-2xl font-bold mb-6">Post a New Job</h2>

        {errorMsg && <p className="text-red-500 mb-4">{errorMsg}</p>}

        <input
          name="title"
          placeholder="Job Title *"
          value={formData.title}
          onChange={handleChange}
          className="border p-2 w-full mb-4 rounded"
          required
        />

        <textarea
          name="description"
          placeholder="Job Description *"
          value={formData.description}
          onChange={handleChange}
          className="border p-2 w-full mb-4 rounded"
          rows={4}
          required
        />

        <textarea
          name="requirements"
          placeholder="Requirements *"
          value={formData.requirements}
          onChange={handleChange}
          className="border p-2 w-full mb-4 rounded"
          rows={3}
        />

        <input
          name="location"
          placeholder="Location *"
          value={formData.location}
          onChange={handleChange}
          className="border p-2 w-full mb-4 rounded"
        />

        <div className="flex gap-4 mb-4">
          <input
            name="salaryRangeMin"
            placeholder="Min Salary"
            type="number"
            value={formData.salaryRangeMin}
            onChange={handleChange}
            className="border p-2 flex-1 rounded"
          />
          <input
            name="salaryRangeMax"
            placeholder="Max Salary"
            type="number"
            value={formData.salaryRangeMax}
            onChange={handleChange}
            className="border p-2 flex-1 rounded"
          />
        </div>

        <select
          name="jobTypeId"
          value={formData.jobTypeId}
          onChange={handleChange}
          className="border p-2 w-full mb-4 rounded"
          required
        >
          <option value="">Select Job Type *</option>
          <option value="1">Full-Time</option>
          <option value="2">Part-Time</option>
          <option value="3">Contract</option>
        </select>

        <select
          name="experienceLevel"
          value={formData.experienceLevel}
          onChange={handleChange}
          className="border p-2 w-full mb-4 rounded"
          required
        >
          <option value="">Select Experience Level *</option>
          <option value="1">Entry</option>
          <option value="2">Mid</option>
          <option value="3">Senior</option>
        </select>

        <input
          name="applicationDeadline"
          type="date"
          value={formData.applicationDeadline}
          onChange={handleChange}
          className="border p-2 w-full mb-6 rounded"
          min={new Date().toISOString().split("T")[0]}
          required
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-800 disabled:bg-gray-400 w-full"
        >
          {isSubmitting ? "Posting..." : "Post Job"}
        </button>
      </form>
    </div>
  );
};

export default PostJob;
