import React, { useState, useEffect, useRef } from "react";
import { User, Mail, Phone, MapPin, GraduationCap, Briefcase, DollarSign, Calendar, Upload, X, Award } from "lucide-react";
import { IoClose, IoAdd } from "react-icons/io5";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import axiosInstance from "../Utils/axiosInstance";
import { getUserIdFromToken } from "../Utils/jwtUtils";
import { toast } from "react-toastify";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

const JobApplicationForm = () => {
  // Profile-related state
  const [userProfile, setUserProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    linkedinProfile: "",
  });
  const [loadingProfile, setLoadingProfile] = useState(true);

  // Skills-related state
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [allSkills, setAllSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [showSkillSuggestions, setShowSkillSuggestions] = useState(false);
  const [loadingSkills, setLoadingSkills] = useState(true);

  // Education-related state
  const [educationList, setEducationList] = useState([]);
  const [showAddEducationForm, setShowAddEducationForm] = useState(false);
  const [editingEducation, setEditingEducation] = useState(null);
  const [educationFormData, setEducationFormData] = useState({
    school: "",
    degree: "",
    fieldOfStudy: "",
    startDate: "",
    endDate: "",
    grade: "",
    description: ""
  });
  const [isSubmittingEducation, setIsSubmittingEducation] = useState(false);
  const [loadingEducation, setLoadingEducation] = useState(true);

  // Form data state
  const [formData, setFormData] = useState({
    experience: "",
    currentPosition: "",
    expectedSalary: "",
    startDate: "",
    coverLetter: ""
  });

  const skillInputRef = useRef(null);

  // Fetch user profile
  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = getUserIdFromToken(token);

      if (!userId || userId === 0) {
        toast.error("User ID missing or invalid. Please log in again.");
        return;
      }

      const response = await axiosInstance.get(`/profile/${userId}`);
      const profileData = response.data;

      if (profileData) {
        const profile = {
          firstName: profileData.firstName || "",
          lastName: profileData.lastName || "",
          email: profileData.email || "",
          phone: profileData.phoneNumber || "",
          location: profileData.location || "",
          linkedinProfile: profileData.linkedinProfile || "",
        };

        setUserProfile(profile);
      } else {
        toast.error("User profile not found.");
      }
    } catch (error) {
      console.error("Profile Fetch Error:", error);
      toast.error("Failed to fetch user profile.");
    } finally {
      setLoadingProfile(false);
    }
  };

  // Fetch user's skills
  const fetchUserSkills = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = getUserIdFromToken(token);

      if (!userId) return;

      const response = await axiosInstance.get(`/api/skills/user/${userId}`);
      if (response.data && Array.isArray(response.data)) {
        const mappedSkills = response.data.map(userSkill => ({
          id: userSkill.skill?.skillId || userSkill.skillId,
          skillName: userSkill.skill?.skill || userSkill.skillName
        })).filter(skill => skill.id && skill.skillName);

        setSelectedSkills(mappedSkills);
      }
    } catch (error) {
      console.error('Error fetching user skills:', error);
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

  // Fetch user's education
  const fetchEducation = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = getUserIdFromToken(token);

      if (!userId) {
        toast.error("Please log in to view education");
        return;
      }

      const response = await axiosInstance.get(`/api/education/user/${userId}`);
      if (response.data && Array.isArray(response.data)) {
        setEducationList(response.data);
      }
    } catch (error) {
      console.error('Error fetching education:', error);
      if (error.response?.status !== 404) {
        toast.error('Failed to load education data');
      }
    } finally {
      setLoadingEducation(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
    fetchAllSkills();
    fetchUserSkills();
    fetchEducation();
  }, []);

  // Handle form input changes
  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleProfileChange = (e) => {
    setUserProfile({
      ...userProfile,
      [e.target.name]: e.target.value
    });
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

  // Education management functions
  const handleAddEducation = () => {
    setEditingEducation(null);
    setEducationFormData({
      school: "",
      degree: "",
      fieldOfStudy: "",
      startDate: "",
      endDate: "",
      grade: "",
      description: ""
    });
    setShowAddEducationForm(true);
  };

  const handleEditEducation = (education) => {
    setEditingEducation(education);
    setEducationFormData({
      school: education.school || "",
      degree: education.degree || "",
      fieldOfStudy: education.fieldOfStudy || "",
      startDate: education.startDate || "",
      endDate: education.endDate || "",
      grade: education.grade || "",
      description: education.description || ""
    });
    setShowAddEducationForm(true);
  };

  const handleEducationFormChange = (e) => {
    setEducationFormData({
      ...educationFormData,
      [e.target.name]: e.target.value
    });
  };

  const handleSaveEducation = async () => {
    try {
      setIsSubmittingEducation(true);
      const token = localStorage.getItem("token");
      const userId = getUserIdFromToken(token);

      if (!userId) {
        toast.error("Please log in to save education");
        return;
      }

      const payload = {
        userId: userId,
        school: educationFormData.school,
        degree: educationFormData.degree,
        fieldOfStudy: educationFormData.fieldOfStudy,
        startDate: educationFormData.startDate,
        endDate: educationFormData.endDate || null,
        grade: educationFormData.grade || null,
        description: educationFormData.description || null
      };

      if (editingEducation) {
        // Update existing education
        await axiosInstance.put(`/api/education/${editingEducation.id || editingEducation.educationId}`, payload);
        toast.success("Education updated successfully!");
      } else {
        // Add new education
        await axiosInstance.post('/api/education/add', payload);
        toast.success("Education added successfully!");
      }

      // Refresh education list
      await fetchEducation();
      setShowAddEducationForm(false);
      setEditingEducation(null);
    } catch (error) {
      console.error('Error saving education:', error);
      toast.error('Failed to save education');
    } finally {
      setIsSubmittingEducation(false);
    }
  };

  const handleDeleteEducation = async (educationId) => {
    if (!window.confirm('Are you sure you want to delete this education?')) {
      return;
    }

    try {
      await axiosInstance.delete(`/api/education/${educationId}`);
      toast.success('Education deleted successfully!');
      await fetchEducation();
    } catch (error) {
      console.error('Error deleting education:', error);
      toast.error('Failed to delete education');
    }
  };

  // Handle form submission
  const handleSubmitApplication = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const userId = getUserIdFromToken(token);

    if (!userId) {
      toast.error("Please log in to submit application");
      return;
    }
    if (!userProfile.firstName || !userProfile.lastName || !userProfile.email) {
      toast.error("Please fill in all required personal information");
      return;
    }

    if (!formData.experience) {
      toast.error("Please select your experience level");
      return;
    }
    try {
      const applicationData = {
        userId: userId,
        personalInfo: userProfile,
        experience: formData.experience,
        currentPosition: formData.currentPosition,
        skills: selectedSkills,
        education: educationList,
        expectedSalary: formData.expectedSalary,
        startDate: formData.startDate,
        coverLetter: formData.coverLetter
      };

      console.log('Application Data:', applicationData);
      toast.success("Application submitted successfully!");

    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error('Failed to submit application');
    }
  };

  if (loadingProfile) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center min-h-screen text-lg">
          Loading application form...
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white flex justify-center p-6">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl mx-auto overflow-hidden">
          {/* Header */}
          <div className="bg-blue-500 text-white p-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold mb-2">Apply for Position</h1>
                <p className="text-blue-100">Complete your application using your profile information</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmitApplication} className="p-8">
            {/* Personal Information */}
            <div className="mb-10">
              <div className="flex items-center mb-6">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <User className="text-blue-600" size={24} />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Personal Information</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={userProfile.firstName}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                    placeholder="Enter your first name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={userProfile.lastName}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                    placeholder="Enter your last name"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="mb-10">
              <div className="flex items-center mb-6">
                <div className="bg-green-100 p-3 rounded-full mr-4">
                  <Mail className="text-green-600" size={24} />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Contact Information</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="email"
                      name="email"
                      value={userProfile.email}
                      onChange={handleProfileChange}
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="tel"
                      name="phone"
                      value={userProfile.phone}
                      onChange={handleProfileChange}
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                      placeholder="+1 (555) 123-4567"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Current Location *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      name="location"
                      value={userProfile.location}
                      onChange={handleProfileChange}
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                      placeholder="City, State, Country"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    LinkedIn Profile
                  </label>
                  <input
                    type="url"
                    name="linkedinProfile"
                    value={userProfile.linkedinProfile}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>
              </div>
            </div>

            {/* Education Section */}
            <div className="mb-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="bg-purple-100 p-3 rounded-full mr-4">
                    <GraduationCap className="text-purple-600" size={24} />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Education</h2>
                </div>
                <button
                  type="button"
                  onClick={handleAddEducation}
                  className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-2 rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <IoAdd size={20} />
                  Add Education
                </button>
              </div>

              {/* Education List */}
              {educationList.length > 0 ? (
                <div className="space-y-4">
                  {educationList.map((education) => (
                    <div
                      key={education.id || education.educationId}
                      className="bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-100 rounded-xl p-6 hover:shadow-lg transition-all duration-200"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full"></div>
                            <h3 className="text-xl font-bold text-gray-800">
                              {education.degree} in {education.fieldOfStudy}
                            </h3>
                          </div>
                          <p className="text-lg font-semibold text-purple-700 mb-1">
                            {education.school}
                          </p>
                          <div className="flex items-center gap-4 text-gray-600 mb-2">
                            <span className="flex items-center gap-1">
                              📅 {education.startDate} - {education.endDate || "Present"}
                            </span>
                            {education.grade && (
                              <span className="flex items-center gap-1">
                                🏆 Grade: {education.grade}
                              </span>
                            )}
                          </div>
                          {education.description && (
                            <p className="text-gray-700 text-sm leading-relaxed">
                              {education.description}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2 ml-4">
                          <button
                            type="button"
                            onClick={() => handleEditEducation(education)}
                            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                            title="Edit education"
                          >
                            <FiEdit size={18} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteEducation(education.id || education.educationId)}
                            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-lg transition-colors duration-200"
                            title="Delete education"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border-2 border-dashed border-purple-200">
                  <GraduationCap className="mx-auto text-purple-300 mb-4" size={48} />
                  <p className="text-gray-600 mb-4">No education added yet</p>
                  <button
                    type="button"
                    onClick={handleAddEducation}
                    className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-2 rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-200 font-medium"
                  >
                    Add Your First Education
                  </button>
                </div>
              )}
            </div>

            {/* Experience Section */}
            <div className="mb-10">
              <div className="flex items-center mb-6">
                <div className="bg-orange-100 p-3 rounded-full mr-4">
                  <Briefcase className="text-orange-600" size={24} />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Experience</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Total Experience *
                  </label>
                  <select
                    name="experience"
                    value={formData.experience}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 bg-white"
                    required
                  >
                    <option value="">Select experience level</option>
                    <option value="0-1">0-1 years</option>
                    <option value="1-3">1-3 years</option>
                    <option value="3-5">3-5 years</option>
                    <option value="5-10">5-10 years</option>
                    <option value="10+">10+ years</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Current Position
                  </label>
                  <input
                    type="text"
                    name="currentPosition"
                    value={formData.currentPosition}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                    placeholder="Software Developer"
                  />
                </div>
              </div>
            </div>

            {/* Skills Section */}
            <div className="mb-10">
              <div className="flex items-center mb-6">
                <div className="bg-indigo-100 p-3 rounded-full mr-4">
                  <Award className="text-indigo-600" size={24} />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Skills & Expertise</h2>
              </div>

              {/* Display Selected Skills */}
              {selectedSkills.length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Your Selected Skills
                  </label>
                  <div className="flex flex-wrap gap-3 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border-2 border-indigo-100 min-h-[60px]">
                    {selectedSkills.map((skill) => {
                      if (!skill || !skill.id || !skill.skillName) {
                        return null;
                      }

                      return (
                        <div
                          key={`selected-skill-${skill.id}`}
                          className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full px-4 py-2 text-sm font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                        >
                          <span>{skill.skillName}</span>
                          <button
                            type="button"
                            onClick={() => removeSkill(skill)}
                            className="text-white hover:text-red-200 hover:bg-white/20 rounded-full p-1 transition-colors duration-200"
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
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Add Your Skills
                </label>
                <div className="relative" ref={skillInputRef}>
                  <input
                    type="text"
                    value={skillInput}
                    onChange={handleSkillInputChange}
                    onFocus={handleInputFocus}
                    onKeyPress={handleSkillKeyPress}
                    placeholder="Type to search and add skills (e.g., JavaScript, React, Python)..."
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                    disabled={loadingSkills}
                  />

                  {/* Skill Suggestions Dropdown */}
                  {showSkillSuggestions && !loadingSkills && (
                    <div className="absolute z-10 w-full mt-1 bg-white border-2 border-gray-200 rounded-xl shadow-2xl max-h-64 overflow-y-auto">
                      {filterSkillSuggestions().map((skill) => {
                        if (!skill || !skill.id || !skill.skillName) {
                          return null;
                        }

                        return (
                          <button
                            key={`suggestion-${skill.id}`}
                            type="button"
                            onClick={() => addSkill(skill)}
                            className="w-full px-4 py-3 text-left hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 border-b border-gray-100 last:border-b-0 transition-all duration-200 text-sm font-medium text-gray-700 hover:text-blue-600"
                          >
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
                              {skill.skillName}
                            </div>
                          </button>
                        );
                      })}

                      {filterSkillSuggestions().length === 0 && skillInput.trim() && (
                        <div className="px-4 py-3 text-gray-500 text-center text-sm">
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
            </div>

            {/* Job Preferences */}
            <div className="mb-10">
              <div className="flex items-center mb-6">
                <div className="bg-orange-100 p-3 rounded-full mr-4">
                  <DollarSign className="text-orange-600" size={24} />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Job Preferences</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Expected Salary
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      name="expectedSalary"
                      value={formData.expectedSalary}
                      onChange={handleFormChange}
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                      placeholder="80,000 - 100,000"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Available Start Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleFormChange}
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Resume Upload */}
            <div className="mb-10">
              <div className="flex items-center mb-4">
                <Upload className="text-blue-600 mr-3" size={20} />
                <label className="text-sm font-semibold text-gray-700">
                  Resume/CV
                </label>
              </div>
              <div className="border-3 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 cursor-pointer group">
                <div className="space-y-3">
                  <div className="bg-blue-100 group-hover:bg-blue-200 transition-colors duration-300 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                    <Upload className="text-blue-600" size={28} />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-700">Upload your resume</p>
                    <p className="text-sm text-gray-500 mt-1">PDF, DOC, or DOCX (max 5MB)</p>
                  </div>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    id="resume-upload"
                  />
                  <label
                    htmlFor="resume-upload"
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 cursor-pointer"
                  >
                    Choose File
                  </label>
                </div>
              </div>
            </div>

            {/* Cover Letter */}
            <div className="mb-10">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Cover Letter (Optional)
              </label>
              <textarea
                rows="6"
                name="coverLetter"
                value={formData.coverLetter}
                onChange={handleFormChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 resize-none"
                placeholder="Write a brief cover letter explaining why you're interested in this position and what makes you a great fit..."
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end gap-4">
              <button
                type="button"
                className="px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-semibold text-lg"
              >
                Save as Draft
              </button>
              <button
                type="submit"
                className="px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Submit Application
              </button>
            </div>
          </form>
        </div>

        {/* Education Add/Edit Modal */}
        {showAddEducationForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-800">
                    {editingEducation ? 'Edit Education' : 'Add Education'}
                  </h3>
                  <button
                    type="button" 
                    onClick={() => setShowAddEducationForm(false)}
                    className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        School *
                      </label>
                      <input
                        type="text"
                        name="school"
                        value={educationFormData.school}
                        onChange={handleEducationFormChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all duration-200"
                        placeholder="University of Technology"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Degree *
                      </label>
                      <input
                        type="text"
                        name="degree"
                        value={educationFormData.degree}
                        onChange={handleEducationFormChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all duration-200"
                        placeholder="Bachelor's, Master's, PhD, etc."
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Field of Study *
                    </label>
                    <input
                      type="text"
                      name="fieldOfStudy"
                      value={educationFormData.fieldOfStudy}
                      onChange={handleEducationFormChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all duration-200"
                      placeholder="Computer Science"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Start Date *
                      </label>
                      <input
                        type="date"
                        name="startDate"
                        value={educationFormData.startDate}
                        onChange={handleEducationFormChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all duration-200"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        End Date
                      </label>
                      <input
                        type="date"
                        name="endDate"
                        value={educationFormData.endDate}
                        onChange={handleEducationFormChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Grade/GPA
                    </label>
                    <input
                      type="text"
                      name="grade"
                      value={educationFormData.grade}
                      onChange={handleEducationFormChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all duration-200"
                      placeholder="3.8/4.0 or First Class"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={educationFormData.description}
                      onChange={handleEducationFormChange}
                      rows="3"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all duration-200 resize-none"
                      placeholder="Additional details about your education..."
                    />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowAddEducationForm(false)}
                      className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveEducation}
                      disabled={isSubmittingEducation || !educationFormData.school || !educationFormData.degree || !educationFormData.fieldOfStudy || !educationFormData.startDate}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {isSubmittingEducation ? 'Saving...' : (editingEducation ? 'Update Education' : 'Add Education')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default JobApplicationForm;