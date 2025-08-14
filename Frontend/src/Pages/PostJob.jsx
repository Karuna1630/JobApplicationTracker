import React, { useState, useEffect, useRef } from "react";
import { IoClose } from "react-icons/io5";
import axiosInstance from "../Utils/axiosInstance";
import { getUserIdFromToken } from "../Utils/jwtUtils";

const PostJob = ({ onClose, onJobPosted, companyId: propCompanyId }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: "",
    skills: [],
    location: "",
    salaryRangeMin: "",
    salaryRangeMax: "",
    jobTypeId: "",
    experienceLevel: "",
    applicationDeadline: "",
  });

  const [skillInput, setSkillInput] = useState("");
  const [allSkills, setAllSkills] = useState([]);
  const [showSkillSuggestions, setShowSkillSuggestions] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [companyId, setCompanyId] = useState(null);
  const [skillsLoading, setSkillsLoading] = useState(false);

  const skillInputRef = useRef(null);

  // Fetch skills list once
  const fetchAllSkills = async () => {
    try {
      setSkillsLoading(true);
      const response = await axiosInstance.get(`/api/skills/getallskills`);
      if (response.data && Array.isArray(response.data)) {
        const mappedSkills = response.data.map((skill) => ({
          id: skill.skillId,
          skillName: skill.skill,
        }));
        setAllSkills(mappedSkills);
      }
    } catch (error) {
      console.error("Error fetching skills:", error);
    } finally {
      setSkillsLoading(false);
    }
  };

  // Get company ID and skills on mount
  useEffect(() => {
    const getCompanyId = () => {
      if (propCompanyId) {
        setCompanyId(parseInt(propCompanyId, 10));
        return;
      }
      const possibleKeys = ["companyId", "currentCompanyId", "selectedCompanyId"];
      for (const key of possibleKeys) {
        const storedId = localStorage.getItem(key);
        if (storedId) {
          setCompanyId(parseInt(storedId, 10));
          return;
        }
      }
      const token = localStorage.getItem("token");
      if (token) {
        const userId = getUserIdFromToken(token);
        if (userId) setCompanyId(1);
      }
    };
    getCompanyId();
    fetchAllSkills();
  }, [propCompanyId]);

  // Close suggestions if click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (skillInputRef.current && !skillInputRef.current.contains(event.target)) {
        setShowSkillSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filterSkillSuggestions = () => {
    if (!Array.isArray(allSkills) || allSkills.length === 0) return [];
    if (!skillInput.trim()) return allSkills.slice(0, 10);

    const input = skillInput.toLowerCase();
    const selectedSkillNames = formData.skills.map((skill) => skill.toLowerCase());

    return allSkills
      .filter(
        (skill) =>
          skill.skillName?.toLowerCase().includes(input) &&
          !selectedSkillNames.includes(skill.skillName.toLowerCase())
      )
      .slice(0, 8);
  };

  const handleSkillInputChange = (e) => {
    const value = e.target.value;
    setSkillInput(value);
    setShowSkillSuggestions(true); // Always show on typing
  };

  const handleSkillInputFocus = () => {
    setShowSkillSuggestions(true);
  };

  const addSkillFromSuggestion = (skill) => {
    if (!skill?.skillName) return;
    const skillName = skill.skillName;
    if (!formData.skills.some((s) => s.toLowerCase() === skillName.toLowerCase())) {
      setFormData((prev) => ({ ...prev, skills: [...prev.skills, skillName] }));
    }
    setSkillInput("");
    setShowSkillSuggestions(true);
    skillInputRef.current?.focus();
  };

  const addSkillManually = () => {
    const val = skillInput.trim();
    if (val && !formData.skills.some((s) => s.toLowerCase() === val.toLowerCase())) {
      setFormData((prev) => ({ ...prev, skills: [...prev.skills, val] }));
      setSkillInput("");
    }
  };

  const removeSkill = (skill) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const suggestions = filterSkillSuggestions();
      if (suggestions.length > 0) {
        addSkillFromSuggestion(suggestions[0]);
      } else {
        addSkillManually();
      }
    } else if (e.key === ",") {
      e.preventDefault();
      addSkillManually();
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!companyId) {
      setErrorMsg("Unable to determine company. Please try again.");
      return;
    }

    if (!formData.title || !formData.description || !formData.jobTypeId || !formData.experienceLevel || !formData.applicationDeadline) {
      setErrorMsg("Please fill all required fields.");
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
        salaryRangeMin: formData.salaryRangeMin ? parseFloat(formData.salaryRangeMin) : null,
        salaryRangeMax: formData.salaryRangeMax ? parseFloat(formData.salaryRangeMax) : null,
        jobTypeId: parseInt(formData.jobTypeId, 10),
        experienceLevel: parseInt(formData.experienceLevel, 10),
        applicationDeadline: new Date(formData.applicationDeadline).toISOString(),
        companyId: parseInt(companyId, 10),
        postedByUserId: userId,
        postedAt: new Date().toISOString(),
        status: "A",
        views: 0,
      };

      const res = await axiosInstance.post("/api/Jobs/submitjobs", payload);
      if (res.status === 200 || res.status === 201) {
        onJobPosted?.(res.data);
        onClose?.();
      } else {
        setErrorMsg("Failed to post job. Please try again.");
      }
    } catch (err) {
      console.error("Post job error:", err);
      setErrorMsg(err.response?.data?.message || "Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-8 relative max-h-[90vh] overflow-y-auto"
      >
        <button type="button" onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">✖</button>
        <h2 className="text-2xl font-bold mb-6">Post a New Job</h2>
        {errorMsg && <p className="text-red-500 mb-4">{errorMsg}</p>}

        {/* Title */}
        <input name="title" placeholder="Job Title *" value={formData.title} onChange={handleChange} className="border p-3 w-full mb-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" required />

        {/* Description */}
        <textarea name="description" placeholder="Job Description *" value={formData.description} onChange={handleChange} className="border p-3 w-full mb-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" rows={4} required />

        {/* Requirements */}
        <textarea name="requirements" placeholder="Job Requirements *" value={formData.requirements} onChange={handleChange} className="border p-3 w-full mb-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" rows={3} required />

        {/* Skills */}
        <div className="mb-4">
          <div className="relative" ref={skillInputRef}>
            <input
              type="text"
              value={skillInput}
              onChange={handleSkillInputChange}
              onFocus={handleSkillInputFocus}
              onKeyDown={handleSkillKeyDown}
              placeholder="Skill"
              className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
              disabled={skillsLoading}
            />

            {showSkillSuggestions && !skillsLoading && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                {filterSkillSuggestions().map((skill) => (
                  <button
                    key={`skill-suggestion-${skill.id}`}
                    type="button"
                    onClick={() => addSkillFromSuggestion(skill)}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                  >
                    {skill.skillName}
                  </button>
                ))}
                {filterSkillSuggestions().length === 0 && skillInput.trim() && (
                  <div className="px-4 py-2 text-gray-500 text-center">
                    No skills found. Press Enter to add "{skillInput}".
                  </div>
                )}
              </div>
            )}

            {skillsLoading && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                <div className="px-4 py-2 text-gray-500 text-center">Loading skills...</div>
              </div>
            )}
          </div>

          {formData.skills.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.skills.map((skill, idx) => (
                <div key={`selected-skill-${idx}`} className="flex items-center gap-1 bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm">
                  <span>{skill}</span>
                  <button type="button" onClick={() => removeSkill(skill)} className="text-blue-600 hover:text-blue-900">
                    <IoClose size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Location */}
        <input name="location" placeholder="Location*" value={formData.location} onChange={handleChange} className="border p-3 w-full mb-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />

        {/* Salary */}
        <div className="flex gap-4 mb-4">
          <input name="salaryRangeMin" placeholder="Min Salary" type="number" value={formData.salaryRangeMin} onChange={handleChange} className="border p-3 flex-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <input name="salaryRangeMax" placeholder="Max Salary" type="number" value={formData.salaryRangeMax} onChange={handleChange} className="border p-3 flex-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        {/* Job Type */}
        <select name="jobTypeId" value={formData.jobTypeId} onChange={handleChange} className="border p-3 w-full mb-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" required>
          <option value="">Select Job Type *</option>
          <option value="1">Full-Time</option>
          <option value="2">Part-Time</option>
          <option value="3">Contract</option>
        </select>

        {/* Experience */}
        <select name="experienceLevel" value={formData.experienceLevel} onChange={handleChange} className="border p-3 w-full mb-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" required>
          <option value="">Select Experience Level *</option>
          <option value="1">Entry</option>
          <option value="2">Mid</option>
          <option value="3">Senior</option>
        </select>

        {/* Deadline */}
        <input name="applicationDeadline" type="date" value={formData.applicationDeadline} onChange={handleChange} className="border p-3 w-full mb-6 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" min={new Date().toISOString().split("T")[0]} required />

        <button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 w-full font-medium">
          {isSubmitting ? "Posting..." : "Post Job"}
        </button>
      </form>
    </div>
  );
};

export default PostJob;
