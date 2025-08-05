import React, { useState } from "react";
import axiosInstance from "../Utils/axiosInstance";
import { getUserIdFromToken } from "../Utils/jwtUtils";

const PostJob = ({ onClose, onJobPosted }) => {
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

  const handleSubmit = async () => {
    // Basic validation for required fields
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

      // Fetch company profile to get companyId
      const profileRes = await axiosInstance.get(`/profile/${userId}`);
      const companyId = profileRes.data.companyProfile?.companyId;
      if (!companyId) {
        setErrorMsg("Company profile not found.");
        setIsSubmitting(false);
        return;
      }

      // Prepare payload with proper types and ISO date
      const payload = {
        ...formData,
        companyId,
        postedByUserId: userId,
        jobTypeId: parseInt(formData.jobTypeId, 10),
        experienceLevel: parseInt(formData.experienceLevel, 10),
        salaryRangeMin: formData.salaryRangeMin ? parseFloat(formData.salaryRangeMin) : null,
        salaryRangeMax: formData.salaryRangeMax ? parseFloat(formData.salaryRangeMax) : null,
        applicationDeadline: new Date(formData.applicationDeadline).toISOString(),
        postedAt: new Date().toISOString(),
        status: "A", // default active status
        views: 0,
      };

      const res = await axiosInstance.post("/api/Jobs/submitjobs", payload);


      if (res.status === 200 || res.status === 201) {
        const createdJob = res.data;
        if (onJobPosted) onJobPosted(createdJob);


      if (res.status === 200 || res.status === 201) {

      if (res.status === 200 || ressubmitjobs.status === 201) {

        const createdJob = res.data; // get created job from backend
        if (onJobPosted) onJobPosted(createdJob); // pass created job to parent

        onClose();
      } else {
        setErrorMsg("Failed to post job. Please try again.");
      }
    } catch (err) {
      console.error("Post job error:", err);
      setErrorMsg("Failed to post job. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-3xl relative max-h-[90vh] overflow-auto">
        <button
          onClick={() => onClose()}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-lg"
          aria-label="Close"
        >
          ✕
        </button>
        <h2 className="text-xl font-bold mb-4">Post a New Job</h2>

        {errorMsg && <p className="text-red-500 mb-3">{errorMsg}</p>}

        <input
          name="title"
          placeholder="Job Title *"
          value={formData.title}
          onChange={handleChange}
          className="border p-2 w-full mb-3"
        />

        <textarea
          name="description"
          placeholder="Job Description *"
          value={formData.description}
          onChange={handleChange}
          className="border p-2 w-full mb-3"
          rows={4}
        />

        <textarea
          name="requirements"
          placeholder="Requirements *"
          value={formData.requirements}
          onChange={handleChange}
          className="border p-2 w-full mb-3"
          rows={3}
        />

        <input
          name="location"
          placeholder="Location *"
          value={formData.location}
          onChange={handleChange}
          className="border p-2 w-full mb-3"
        />

        <div className="flex gap-4 mb-3">
          <input
            name="salaryRangeMin"
            placeholder="Min Salary *"
            type="number"
            value={formData.salaryRangeMin}
            onChange={handleChange}
            className="border p-2 flex-1"
          />
          <input
            name="salaryRangeMax"
            placeholder="Max Salary *"
            type="number"
            value={formData.salaryRangeMax}
            onChange={handleChange}
            className="border p-2 flex-1"
          />
        </div>

        <select
          name="jobTypeId"
          value={formData.jobTypeId}
          onChange={handleChange}
          className="border p-2 w-full mb-3"
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
          className="border p-2 w-full mb-3"
        >
          <option value="">Select Experience Level *</option>
          <option value="1">Entry</option>
          <option value="2">Mid</option>
          <option value="3">Senior</option>
        </select>

        <label className="block mb-1 font-semibold text-gray-700">
        </label>
        <input
          name="applicationDeadline"
          type="date"
          value={formData.applicationDeadline}
          onChange={handleChange}
          className="border p-2 w-full mb-4"
          min={new Date().toISOString().split("T")[0]} // prevent past dates
        />

        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-800 disabled:bg-gray-400 w-full"
        >
          {isSubmitting ? "Posting..." : "Post Job"}
        </button>
      </div>
    </div>
  );
};

export default PostJob;
