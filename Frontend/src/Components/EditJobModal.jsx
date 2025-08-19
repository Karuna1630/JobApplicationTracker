import React, { useState, useEffect, useRef } from "react";
import { IoClose } from "react-icons/io5";
import axiosInstance from "../Utils/axiosInstance";
import { getUserIdFromToken } from "../Utils/jwtUtils";
import { toast } from "react-toastify";

const EditJobModal = ({ isOpen, onClose, jobInfo, jobId, onUpdateSuccess }) => {
  const [formData, setFormData] = useState({
    jobTypeId: jobInfo.jobType || "",
    description: jobInfo.description || jobInfo.jobDescription || "",
    requirements: jobInfo.requirements || jobInfo.qualifications || "",
    location: jobInfo.location || jobInfo.jobLocation || "",
    salaryRangeMin: jobInfo.salaryRangeMin || "",
    salaryRangeMax: jobInfo.salaryRangeMax || "",
    empolymentType: jobInfo.empolymentType || jobInfo.employType || "",
    experienceLevel: jobInfo.experienceLevel || jobInfo.experience || "",
    applicationDeadline: jobInfo.applicationDeadline ? 
      new Date(jobInfo.applicationDeadline).toISOString().split('T')[0] : "",
  });

  const [jobTypes, setJobTypes] = useState([]);
  const [loadingJobTypes, setLoadingJobTypes] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Skills-related state
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [allSkills, setAllSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [showSkillSuggestions, setShowSkillSuggestions] = useState(false);
  const [loadingSkills, setLoadingSkills] = useState(true);

  const skillInputRef = useRef(null);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Parse existing skills when component mounts or jobInfo changes
  useEffect(() => {
    if (jobInfo.skills && allSkills.length > 0) {
      try {
        const skillIds = JSON.parse(jobInfo.skills);
        if (Array.isArray(skillIds)) {
          const existingSkills = skillIds
            .map(skillId => {
              const skill = allSkills.find(s => s.id === skillId);
              return skill ? { id: skill.id, skillName: skill.skillName } : null;
            })
            .filter(Boolean);
          setSelectedSkills(existingSkills);
        }
      } catch (error) {
        console.error('Error parsing existing skills:', error);
      }
    }
  }, [jobInfo.skills, allSkills]);

  // Fetch Job Types
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
    if (isOpen) {
      fetchJobTypes();
      fetchAllSkills();
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      const userId = Number(getUserIdFromToken(token));

      // Prepare skills data - convert selected skills to JSON string format [1,2,3]
      const skillIds = selectedSkills
        .filter(skill => skill && skill.id)
        .map(skill => skill.id);
      const skillsJsonString = skillIds.length > 0 ? JSON.stringify(skillIds) : null;

      const payload = {
        JobId: jobId,
        PostedByUserId: userId,
        CompanyId: jobInfo.companyId || parseInt(localStorage.getItem('currentCompanyId')),
        JobType: formData.jobTypeId || jobInfo.jobType,
        Description: formData.description || jobInfo.description,
        Requirements: formData.requirements || jobInfo.requirements,
        Location: formData.location || jobInfo.location,
        EmpolymentType: formData.empolymentType || jobInfo.empolymentType,
        SalaryRangeMin: formData.salaryRangeMin ? parseFloat(formData.salaryRangeMin) : (jobInfo.salaryRangeMin || null),
        SalaryRangeMax: formData.salaryRangeMax ? parseFloat(formData.salaryRangeMax) : (jobInfo.salaryRangeMax || null),
        ExperienceLevel: formData.experienceLevel || jobInfo.experienceLevel,
        ApplicationDeadline: formData.applicationDeadline ? 
          new Date(formData.applicationDeadline).toISOString() : (jobInfo.applicationDeadline || null),
        Skills: skillsJsonString || jobInfo.skills,
        // Keep existing values that shouldn't be changed
        PostedAt: jobInfo.postedAt || jobInfo.createdAt || new Date().toISOString(),
        Status: jobInfo.status || 'A',
        Views: jobInfo.views || 0,
        Responsibilities: jobInfo.responsibilities || null,
        Benefits: jobInfo.benefits || null
      };

      console.log("Submitting job update payload:", payload);

      // Use the existing submitjobs endpoint for updates
      const response = await axiosInstance.post("/api/Jobs/submitjobs", payload);

      if (response.data.isSuccess || response.status === 200) {
        toast.success("Job updated successfully!");
        onUpdateSuccess({ ...formData, skills: skillsJsonString });
        onClose();
      } else {
        toast.error(response.data.message || "Update failed");
      }
    } catch (error) {
      console.error("Error updating job:", error);
      
      if (error.response) {
        console.error("Error data:", error.response.data);
        
        if (error.response.data.errors) {
          Object.entries(error.response.data.errors).forEach(([field, messages]) => {
            console.error(`Field: ${field}, Errors: ${messages.join(", ")}`);
          });
        }
        
        toast.error(error.response.data.message || "Failed to update job");
      } else {
        console.error("Error:", error.message);
        toast.error("Something went wrong while updating.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white w-full max-w-2xl rounded-lg shadow-lg p-6 relative max-h-[95vh] overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-4">Edit Job</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Job Type */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Job Type *
            </label>
            {loadingJobTypes ? (
              <p className="text-gray-500">Loading job types...</p>
            ) : (
              <select
                name="jobTypeId"
                value={formData.jobTypeId}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select Job Type</option>
                {jobTypes.map((jobType) => (
                  <option key={jobType.id} value={jobType.id}>
                    {jobType.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Job Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Describe the job role and responsibilities..."
              required
            />
          </div>

          {/* Requirements */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Requirements
            </label>
            <textarea
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="List job requirements and qualifications..."
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Location *
            </label>
            <input
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="City, State, Country"
              required
            />
          </div>

          {/* Salary Range */}
          <div>
            <label className="block text-sm font-medium mb-1">Salary Range</label>
            <div className="flex gap-4">
              <input
                name="salaryRangeMin"
                type="number"
                placeholder="Min Salary"
                value={formData.salaryRangeMin}
                onChange={handleChange}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                name="salaryRangeMax"
                type="number"
                placeholder="Max Salary"
                value={formData.salaryRangeMax}
                onChange={handleChange}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Employment Type */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Employment Type *
            </label>
            <select
              name="empolymentType"
              value={formData.empolymentType}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select Employment Type</option>
              <option value="Full-Time">Full-Time</option>
              <option value="Part-Time">Part-Time</option>
              <option value="Remote">Remote</option>
            </select>
          </div>

          {/* Experience Level */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Experience Level *
            </label>
            <select
              name="experienceLevel"
              value={formData.experienceLevel}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select Experience Level</option>
              <option value="Entry">Entry</option>
              <option value="Mid">Mid</option>
              <option value="Senior">Senior</option>
            </select>
          </div>

          {/* Skills Section */}
          <div>
            <label className="block text-sm font-medium mb-1">
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
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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

          {/* Application Deadline */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Application Deadline *
            </label>
            <input
              name="applicationDeadline"
              type="date"
              value={formData.applicationDeadline}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              min={new Date().toISOString().split("T")[0]}
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end mt-6 gap-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 rounded-md border text-gray-700 hover:bg-gray-100 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Updating...
                </>
              ) : (
                "Update Job"
              )}
            </button>
          </div>
        </form>

        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-2xl text-gray-400 hover:text-gray-600"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default EditJobModal;