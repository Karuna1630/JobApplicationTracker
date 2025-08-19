import React, { useState, useEffect, useRef } from "react";
import { IoClose, IoAdd } from "react-icons/io5";
import axiosInstance from "../Utils/axiosInstance";
import { getUserIdFromToken } from "../Utils/jwtUtils";
import { toast } from "react-toastify";

const PostJob = ({ onClose, onJobPosted, companyId }) => {
  const [formData, setFormData] = useState({
    jobTypeId: "",
    description: "",
    requirements: "",
    location: "",
    salaryRangeMin: "",
    salaryRangeMax: "",
    empolymentType: "",     
    experienceLevel: "",
    applicationDeadline: "",
  });

  const [jobTypes, setJobTypes] = useState([]);
  const [loadingJobTypes, setLoadingJobTypes] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Skills-related state
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [allSkills, setAllSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [showSkillSuggestions, setShowSkillSuggestions] = useState(false);
  const [loadingSkills, setLoadingSkills] = useState(true);
  const skillInputRef = useRef(null);

  const fetchJobTypes = async () => {
    try {
      const response = await axiosInstance.get('/getalljobtypes');
      if (response.data && Array.isArray(response.data)) {
        const mappedJobTypes = response.data.map(job => ({
          id: job.jobTypeId,
          name: job.name
        }));
        setJobTypes(mappedJobTypes);
      } else {
        toast.error("Failed to load job types");
      }
    } catch (error) {
      console.error("Error fetching job types:", error);
      toast.error("Failed to load job types");
    } finally {
      setLoadingJobTypes(false);
    }
  };

  // Fetch all available skills
  const fetchAllSkills = async () => {
    try {
      const response = await axiosInstance.get(`/api/skills/getallskills`);
      if (response.data && Array.isArray(response.data)) {
        const mappedSkills = response.data.map(skill => ({
          id: skill.skillId,
          skillName: skill.skill
        }));
        setAllSkills(mappedSkills);
      }
    } catch (error) {
      console.error('Error fetching all skills:', error);
      toast.error('Failed to load available skills');
    } finally {
      setLoadingSkills(false);
    }
  };

  useEffect(() => {
    fetchJobTypes();
    fetchAllSkills();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Skills functionality
  const filterSkillSuggestions = () => {
    if (!Array.isArray(allSkills) || allSkills.length === 0) {
      return [];
    }

    if (!skillInput.trim()) return allSkills.slice(0, 10);

    const input = skillInput.toLowerCase();
    const selectedSkillIds = selectedSkills.map(skill => skill.id);

    return allSkills
      .filter(
        (skill) =>
          skill && 
          skill.skillName && 
          typeof skill.skillName === 'string' &&
          skill.skillName.toLowerCase().includes(input) &&
          !selectedSkillIds.includes(skill.id)
      )
      .slice(0, 8);
  };

  const handleSkillInputChange = (e) => {
    const value = e.target.value;
    setSkillInput(value);
    if (value.trim()) {
      setShowSkillSuggestions(true);
    }
  };

  const addSkill = (skillToAdd) => {
    if (!skillToAdd || !skillToAdd.id || !skillToAdd.skillName) {
      console.error('Invalid skill object:', skillToAdd);
      return;
    }

    const isAlreadyAdded = selectedSkills.some(skill => skill.id === skillToAdd.id);
    
    if (!isAlreadyAdded) {
      setSelectedSkills(prev => [...prev, skillToAdd]);
    }
    
    setSkillInput("");
    setShowSkillSuggestions(true);
    skillInputRef.current?.focus();
  };

  const removeSkill = (skillToRemove) => {
    if (!skillToRemove || !skillToRemove.id) {
      console.error('Invalid skill object to remove:', skillToRemove);
      return;
    }
    
    setSelectedSkills(prev => prev.filter(skill => skill.id !== skillToRemove.id));
    setShowSkillSuggestions(true);
  };

  const handleSkillKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const suggestions = filterSkillSuggestions();
      if (suggestions.length > 0) {
        addSkill(suggestions[0]);
      }
    }
  };

  const handleInputFocus = () => {
    setShowSkillSuggestions(true);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        skillInputRef.current &&
        !skillInputRef.current.contains(event.target)
      ) {
        setShowSkillSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.jobTypeId ||
      !formData.description ||
      !formData.location ||
      !formData.empolymentType ||
      !formData.experienceLevel ||
      !formData.applicationDeadline
    ) {
      setErrorMsg("Please fill all required fields.");
      return;
    }

    const effectiveCompanyId = companyId || localStorage.getItem("currentCompanyId");
    if (!effectiveCompanyId) {
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

      // Prepare skills data - convert selected skills to JSON string format int
      const skillIds = selectedSkills
        .filter(skill => skill && skill.id)
        .map(skill => skill.id);
      const skillsJsonString = skillIds.length > 0 ? JSON.stringify(skillIds) : null;

      const payload = {
        JobId: 0,
        PostedByUserId: userId,
        CompanyId: parseInt(effectiveCompanyId),
        JobType: formData.jobTypeId,
        Description: formData.description,
        Requirements: formData.requirements || "",
        Location: formData.location,
        EmpolymentType: formData.empolymentType,
        SalaryRangeMin: formData.salaryRangeMin ? parseFloat(formData.salaryRangeMin) : 0,
        SalaryRangeMax: formData.salaryRangeMax ? parseFloat(formData.salaryRangeMax) : 0,
        ExperienceLevel: formData.experienceLevel,
        Status: "A",
        PostedAt: new Date().toISOString(),
        ApplicationDeadline: new Date(formData.applicationDeadline).toISOString(),

        Skills: skillsJsonString // ✅ Added Skills to payload

        Skills: skillsJsonString 

      };

      console.log("Sending payload:", payload);

      const response = await axiosInstance.post("/api/Jobs/submitjobs", payload);

      if (response.status === 200 || response.status === 201) {
        toast.success("Job posted successfully!");
        
        if (onJobPosted && typeof onJobPosted === 'function') {
          onJobPosted(response.data);
        }
        
        onClose();
      } else {
        setErrorMsg("Failed to post job. Please try again.");
      }

    } catch (err) {
      console.error("Post job error:", err);
      const errorMessage = err.response?.data?.message || "Failed to post job. Please try again.";
      setErrorMsg(errorMessage);
      toast.error(errorMessage);
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

        {/* Job Type Dropdown */}
        {loadingJobTypes ? (
          <p className="text-gray-500 mb-4">Loading job types...</p>
        ) : (
          <select
            name="jobTypeId"
            value={formData.jobTypeId}
            onChange={handleChange}
            className="border p-2 w-full mb-4 rounded"
            required
          >
            <option value="">Select Job Type *</option>
            {jobTypes.map((jobType) => (
              <option key={jobType.id} value={jobType.id}>
                {jobType.name}
              </option>
            ))}
          </select>
        )}

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
          placeholder="Requirements"
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
          required
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
          name="empolymentType"  
          value={formData.empolymentType} 
          onChange={handleChange}
          className="border p-2 w-full mb-4 rounded"
          required
        >
          <option value="">Select Employment Type *</option>
          <option value="Full-Time">Full-Time</option>
          <option value="Part-Time">Part-Time</option>
          <option value="Remote">Remote</option>
        </select>

        <select
          name="experienceLevel"
          value={formData.experienceLevel}
          onChange={handleChange}
          className="border p-2 w-full mb-4 rounded"
          required
        >
          <option value="">Select Experience Level *</option>
          <option value="Entry">Entry</option>
          <option value="Mid">Mid</option>
          <option value="Senior">Senior</option>
        </select>

        {/* ✅ NEW: Skills Section */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Required Skills
          </label>
          
          {/* Display Selected Skills */}
          {selectedSkills.length > 0 && (
            <div className="mb-3">
              <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200 min-h-[50px]">
                {selectedSkills.map((skill) => {
                  if (!skill || !skill.id || !skill.skillName) {
                    return null;
                  }
                  
                  return (
                    <div
                      key={`selected-skill-${skill.id}`}
                      className="flex items-center gap-2 bg-blue-100 text-blue-800 rounded-full px-3 py-2 text-sm font-medium border border-blue-200 hover:bg-blue-200 transition-colors"
                    >
                      <span>{skill.skillName}</span>
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="text-blue-600 hover:text-blue-900 hover:bg-blue-300 rounded-full p-1 transition-colors"
                        aria-label={`Remove skill ${skill.skillName}`}
                      >
                        <IoClose size={14} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Skill Input with Suggestions */}
          <div className="relative" ref={skillInputRef}>
            <input
              type="text"
              value={skillInput}
              onChange={handleSkillInputChange}
              onFocus={handleInputFocus}
              onKeyPress={handleSkillKeyPress}
              placeholder="Type to search and add skills..."
              className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loadingSkills}
            />

            {/* Skill Suggestions Dropdown */}
            {showSkillSuggestions && !loadingSkills && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                {filterSkillSuggestions().map((skill) => {
                  if (!skill || !skill.id || !skill.skillName) {
                    return null;
                  }
                  
                  return (
                    <button
                      key={`suggestion-${skill.id}`}
                      type="button"
                      onClick={() => addSkill(skill)}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors text-sm"
                    >
                      {skill.skillName}
                    </button>
                  );
                })}
                
                {filterSkillSuggestions().length === 0 && skillInput.trim() && (
                  <div className="px-4 py-2 text-gray-500 text-center text-sm">
                    No skills found matching "{skillInput}"
                  </div>
                )}
              </div>
            )}
          </div>
          
          {loadingSkills && (
            <p className="text-gray-500 text-sm mt-1">Loading skills...</p>
          )}
        </div>

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