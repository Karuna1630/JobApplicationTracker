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
    if (
      !formData.title ||
      !formData.description ||
      !formData.jobTypeId ||
      !formData.experienceLevel
    ) {
      setErrorMsg("Please fill all required fields.");
      return;
    }

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("token");
      const companyId = getUserIdFromToken(token);

      const payload = {
        ...formData,
        companyId,
        postedByUserId: companyId,
        jobTypeId: parseInt(formData.jobTypeId),
        experienceLevel: parseInt(formData.experienceLevel),
        salaryRangeMin: parseFloat(formData.salaryRangeMin),
        salaryRangeMax: parseFloat(formData.salaryRangeMax),
        applicationDeadline: new Date(formData.applicationDeadline).toISOString(),
        postedAt: new Date().toISOString(),
        status: "A",
        views: 0,
      };

      const res = await axiosInstance.post("/api/Jobs/submitjobs", payload);

      if (res.status === 200 || res.status === 201) {
        const createdJob = res.data; // get created job from backend
        if (onJobPosted) onJobPosted(createdJob); // pass created job to parent
        onClose();
      } else {
        setErrorMsg("Failed to post job. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to post job. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-3xl relative">
        <button
          onClick={() => onClose()}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-lg"
        >
          ✕
        </button>
        <h2 className="text-xl font-bold mb-4">Post a New Job</h2>
        {errorMsg && <p className="text-red-500 mb-3">{errorMsg}</p>}

        <input name="title" placeholder="Job Title" onChange={handleChange} className="border p-2 w-full mb-3" />
        <textarea name="description" placeholder="Job Description" onChange={handleChange} className="border p-2 w-full mb-3" />
        <textarea name="requirements" placeholder="Requirements" onChange={handleChange} className="border p-2 w-full mb-3" />
        <input name="location" placeholder="Location" onChange={handleChange} className="border p-2 w-full mb-3" />
        <input name="salaryRangeMin" placeholder="Min Salary" type="number" onChange={handleChange} className="border p-2 w-full mb-3" />
        <input name="salaryRangeMax" placeholder="Max Salary" type="number" onChange={handleChange} className="border p-2 w-full mb-3" />
        <select name="jobTypeId" onChange={handleChange} className="border p-2 w-full mb-3">
          <option value="">Select Job Type</option>
          <option value="1">Full-Time</option>
          <option value="2">Part-Time</option>
          <option value="3">Contract</option>
        </select>
        <select name="experienceLevel" onChange={handleChange} className="border p-2 w-full mb-3">
          <option value="">Select Experience Level</option>
          <option value="1">Entry</option>
          <option value="2">Mid</option>
          <option value="3">Senior</option>
        </select>
        <input name="applicationDeadline" type="date" onChange={handleChange} className="border p-2 w-full mb-3" />
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-800 disabled:bg-gray-400"
        >
          {isSubmitting ? "Posting..." : "Post Job"}
        </button>
      </div>
    </div>
  );
};

export default PostJob;
