import React, { useState, useRef, useEffect } from "react";
import { IoClose, IoAdd } from "react-icons/io5";
import { Award } from "react-feather";
import axiosInstance from "../Utils/axiosInstance";
import { getUserIdFromToken } from "../Utils/jwtUtils";
import { toast } from "react-toastify";

const Skills = () => {
  const [userSkills, setUserSkills] = useState([]); // Skills selected by user
  const [allSkills, setAllSkills] = useState([]); // All available skills from API
  const [showModal, setShowModal] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [showSkillSuggestions, setShowSkillSuggestions] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const skillInputRef = useRef(null);

  // Fetch all available skills from API
  const fetchAllSkills = async () => {
    try {
      const response = await axiosInstance.get(`/api/skills/getallskills`);
      if (response.data && Array.isArray(response.data)) {
        // Map backend response to expected format
        const mappedSkills = response.data.map(skill => ({
          id: skill.skillId,
          skillName: skill.skill
        }));
        setAllSkills(mappedSkills);
      }
    } catch (error) {
      console.error('Error fetching all skills:', error);
      toast.error('Failed to load available skills');
    }
  };

  // Fetch user's selected skills
  const fetchUserSkills = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = getUserIdFromToken(token);
      
      if (!userId) {
        console.error('No user ID found');
        return;
      }

      // Use the new API endpoint to get skills by userId
      const response = await axiosInstance.get(`/api/skills/getskillsbyuserid?userId=${userId}`);
      if (response.data && Array.isArray(response.data)) {
        // Map backend response to expected format
        const mappedSkills = response.data.map(skill => ({
          id: skill.skillId,
          skillName: skill.skill
        }));
        setUserSkills(mappedSkills);
      }
    } catch (error) {
      console.error('Error fetching user skills:', error);
      // Don't show error toast for user skills as user might not have any skills yet
      setUserSkills([]);
    }
  };

  // Initial data fetch
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchAllSkills(), fetchUserSkills()]);
      setLoading(false);
    };
    loadData();
  }, []);

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => (document.body.style.overflow = "auto");
  }, [showModal]);

  const openModal = () => {
    setShowModal(true);
    setShowSkillSuggestions(true);
    setSkillInput("");
  };

  const closeModal = () => {
    setShowModal(false);
    setSkillInput("");
    setShowSkillSuggestions(false);
  };

  const filterSkillSuggestions = () => {
    if (!Array.isArray(allSkills) || allSkills.length === 0) {
      return [];
    }

    if (!skillInput.trim()) return allSkills.slice(0, 10);

    const input = skillInput.toLowerCase();
    const userSkillIds = userSkills.map(skill => skill.id);

    return allSkills
      .filter(
        (skill) =>
          skill && 
          skill.skillName && 
          typeof skill.skillName === 'string' &&
          skill.skillName.toLowerCase().includes(input) &&
          !userSkillIds.includes(skill.id)
      )
      .slice(0, 8);
  };

  const handleSkillInputChange = (e) => {
    const value = e.target.value;
    setSkillInput(value);
    // Show suggestions when user starts typing
    if (value.trim()) {
      setShowSkillSuggestions(true);
    }
  };

  const addSkill = (skillToAdd) => {
    if (!skillToAdd || !skillToAdd.id || !skillToAdd.skillName) {
      console.error('Invalid skill object:', skillToAdd);
      return;
    }

    const isAlreadyAdded = userSkills.some(skill => skill.id === skillToAdd.id);
    
    if (!isAlreadyAdded) {
      setUserSkills(prev => [...prev, skillToAdd]);
    }
    
    setSkillInput("");
    setShowSkillSuggestions(true); // Keep suggestions open for more additions
    skillInputRef.current?.focus();
  };

  const removeSkill = (skillToRemove) => {
    if (!skillToRemove || !skillToRemove.id) {
      console.error('Invalid skill object to remove:', skillToRemove);
      return;
    }
    
    setUserSkills(prev => prev.filter(skill => skill.id !== skillToRemove.id));
    // Reset suggestions after removing a skill
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

  const handleSaveSkills = async () => {
    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const userId = getUserIdFromToken(token);
      
      if (!userId) {
        toast.error('User not authenticated');
        return;
      }

      // Create array of skill IDs [1,2,3] format
      const skillIds = userSkills
        .filter(skill => skill && skill.id)
        .map(skill => skill.id);
      
      // Convert skill IDs array to JSON string for backend storage as [1,2,3]
      const skillsJsonString = JSON.stringify(skillIds);
      
      // Use existing submituser endpoint to update skills
      const response = await axiosInstance.post(`/submituser`, {
        userId: userId,
        skills: skillsJsonString
      });

      if (response.data && response.data.isSuccess) {
        toast.success('Skills updated successfully!');
        closeModal();
        // Refresh user skills to get latest data from server
        await fetchUserSkills();
      } else {
        throw new Error(response.data?.message || 'Failed to update skills');
      }
    } catch (error) {
      console.error('Error saving skills:', error);
      toast.error('Failed to save skills. Please try again.');
    } finally {
      setSubmitting(false);
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

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-gray-500">Loading skills...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Skills Section Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-gray-600 text-lg">
            Add skills to showcase your expertise and attract relevant opportunities
          </p>
        </div>
        <button
          onClick={openModal}
          className="flex items-center gap-2 px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-full hover:bg-blue-50 transition-colors font-medium"
        >
          <IoAdd size={20} />
          Add skills
        </button>
      </div>

      {/* Skills Display */}
      <div>
        {userSkills.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Award size={48} className="mx-auto mb-4 text-gray-300" />
            <p className="text-lg mb-2">No skills added yet</p>
            <p>Add skills to showcase your expertise and competencies</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-3">
            {userSkills.map((skill) => {
              if (!skill || !skill.id || !skill.skillName) {
                console.warn('Invalid skill object:', skill);
                return null;
              }
              
              return (
                <div
                  key={`skill-${skill.id}`}
                  className="group flex items-center gap-2 bg-blue-100 text-blue-800 rounded-full px-4 py-2 text-sm font-medium border border-blue-200 hover:bg-blue-200 transition-colors"
                >
                  <span>{skill.skillName}</span>
                  <button
                    onClick={() => removeSkill(skill)}
                    className="text-blue-600 hover:text-blue-900 opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label={`Remove skill ${skill.skillName}`}
                  >
                    <IoClose size={16} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-semibold">Add Skills</h3>
              <button
                type="button"
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <IoClose size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 flex-grow overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add Skills
                </label>
                <p className="text-sm text-gray-600 mb-4">
                  Start typing to search for skills or select from suggestions below
                </p>

                {/* Display Selected Skills - Show above search input */}
                {userSkills.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">
                      Selected Skills ({userSkills.length})
                    </h4>
                    <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200 min-h-[50px]">
                      {userSkills.map((skill) => {
                        if (!skill || !skill.id || !skill.skillName) {
                          return null;
                        }
                        
                        return (
                          <div
                            key={`modal-skill-${skill.id}`}
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

                {/* Skill Input */}
                <div className="relative mb-6" ref={skillInputRef}>
                  <input
                    type="text"
                    value={skillInput}
                    onChange={handleSkillInputChange}
                    onFocus={handleInputFocus}
                    onKeyPress={handleSkillKeyPress}
                    placeholder="Type to search for skills..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                    autoFocus
                  />

                  {/* Skill Suggestions */}
                  {showSkillSuggestions && (
                    <div className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {filterSkillSuggestions().map((skill) => {
                        if (!skill || !skill.id || !skill.skillName) {
                          return null;
                        }
                        
                        return (
                          <button
                            key={`suggestion-${skill.id}`}
                            type="button"
                            onClick={() => addSkill(skill)}
                            className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                          >
                            {skill.skillName}
                          </button>
                        );
                      })}
                      
                      {filterSkillSuggestions().length === 0 && skillInput.trim() && (
                        <div className="px-4 py-3 text-gray-500 text-center">
                          No skills found matching "{skillInput}"
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-4 p-6 border-t bg-gray-50">
              <button
                onClick={closeModal}
                className="px-6 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSkills}
                disabled={submitting}
                className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Saving...' : 'Save Skills'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Skills;