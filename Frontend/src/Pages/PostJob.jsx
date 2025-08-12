import React, { useState, useRef } from "react";
import axiosInstance from "../Utils/axiosInstance";
import { getUserIdFromToken } from "../Utils/jwtUtils";
import { IoClose } from "react-icons/io5";

const PostJob = ({ onClose, onJobPosted, companyId }) => {
  // Debug log to check companyId
 console.log("companyId received:", companyId);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    skills: [],
    location: "",
    salaryRangeMin: "",
    salaryRangeMax: "",
    jobTypeId: "",
    experienceLevel: "",
    applicationDeadline: "",
  });

  const [skillInput, setSkillInput] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const skillInputRef = useRef(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, skillInput.trim()],
      });
      setSkillInput("");
    }
  };

  const removeSkill = (skill) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((s) => s !== skill),
    });
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSkill();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
        status: "A",
        views: 0,
      };

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-8 relative"
      >
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

        {/* Skills Input */}
        <div className="mb-4">
          <input
            type="text"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={handleSkillKeyDown}
            placeholder="Skills *"
            className="w-full border p-2 rounded mb-2"
            ref={skillInputRef}
          />

          <div className="flex flex-wrap gap-2">
            {formData.skills.map((skill, idx) => (
              <div
                key={idx}
                className="flex items-center gap-1 bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm"
              >
                <span>{skill}</span>
                <button type="button" onClick={() => removeSkill(skill)}>
                  <IoClose size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

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
