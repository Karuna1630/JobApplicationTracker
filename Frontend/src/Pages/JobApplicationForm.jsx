import React, { useState, useEffect } from "react";
import { User, Mail, Phone, MapPin, GraduationCap, Briefcase, DollarSign, Calendar, Upload, Award } from "lucide-react";
import { IoClose } from "react-icons/io5";
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
  const [loadingSkills, setLoadingSkills] = useState(true);

  // Education-related state
  const [educationList, setEducationList] = useState([]);
  const [loadingEducation, setLoadingEducation] = useState(true);

  // Form data state
  const [formData, setFormData] = useState({
    experience: "",
    currentPosition: "",
    expectedSalary: "",
    startDate: "",
    coverLetter: ""
  });

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

  // Fetch user's skills (using the same endpoint as Skills component)
  const fetchUserSkills = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = getUserIdFromToken(token);

      if (!userId) {
        console.error('No user ID found');
        return;
      }

      // Use the same API endpoint as the Skills component
      const response = await axiosInstance.get(`/api/skills/getskillsbyuserid?userId=${userId}`);
      console.log('Raw skills response:', response.data); // Add this for debugging
      
      if (response.data && Array.isArray(response.data)) {
        // Map backend response to expected format (same as Skills component)
        const mappedSkills = response.data.map(skill => ({
          id: skill.skillId,
          skillName: skill.skill
        }));

        console.log('Mapped skills:', mappedSkills); // Add this for debugging
        setSelectedSkills(mappedSkills);
      }
    } catch (error) {
      console.error('Error fetching user skills:', error);
      console.error('Error response:', error.response?.data); // Add this for debugging
      // Don't show error toast for skills as user might not have any skills yet
      setSelectedSkills([]);
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

  // Skills functionality (simplified - display only)
  const removeSkill = (skillToRemove) => {
    if (!skillToRemove || !skillToRemove.id) {
      console.error('Invalid skill object to remove:', skillToRemove);
      return;
    }

    setSelectedSkills(prev => prev.filter(skill => skill.id !== skillToRemove.id));
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
          <div className="p-8">
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
              <div className="flex items-center mb-6">
                <div className="bg-purple-100 p-3 rounded-full mr-4">
                  <GraduationCap className="text-purple-600" size={24} />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Education</h2>
              </div>

              {/* Education List (Display Only) */}
              {educationList.length > 0 ? (
                <div className="space-y-4">
                  {educationList.map((education) => (
                    <div
                      key={education.id || education.educationId}
                      className="bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-100 rounded-xl p-6 hover:shadow-lg transition-all duration-200"
                    >
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
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border-2 border-dashed border-purple-200">
                  <GraduationCap className="mx-auto text-purple-300 mb-4" size={48} />
                  <p className="text-gray-600 mb-4">No education information found in your profile</p>
                  <p className="text-gray-500 text-sm">Please update your profile to add education details</p>
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
                    <option value="">Select your experience level</option>
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
              {selectedSkills.length > 0 ? (
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Your Skills from Profile
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
              ) : (
                <div className="text-center py-12 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border-2 border-dashed border-indigo-200">
                  <Award className="mx-auto text-indigo-300 mb-4" size={48} />
                  <p className="text-gray-600 mb-4">No skills found in your profile</p>
                  <p className="text-gray-500 text-sm">Please update your profile to add your skills</p>
                </div>
              )}
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
                type="button"
                onClick={handleSubmitApplication}
                className="px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Submit Application
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default JobApplicationForm;