import React, { useState, useEffect } from "react";
import { User, Mail, Phone, MapPin, GraduationCap, DollarSign, Calendar, Upload, Award } from "lucide-react";
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

  // Fetch user's skills
  const fetchUserSkills = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = getUserIdFromToken(token);

      if (!userId) {
        console.error('No user ID found');
        return;
      }

      const response = await axiosInstance.get(`/api/skills/getskillsbyuserid?userId=${userId}`);
      console.log('Raw skills response:', response.data);
      
      if (response.data && Array.isArray(response.data)) {
        const mappedSkills = response.data.map(skill => ({
          id: skill.skillId,
          skillName: skill.skill
        }));

        console.log('Mapped skills:', mappedSkills);
        setSelectedSkills(mappedSkills);
      }
    } catch (error) {
      console.error('Error fetching user skills:', error);
      console.error('Error response:', error.response?.data);
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

  if (loadingProfile || loadingSkills || loadingEducation) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center min-h-screen">
          Loading application form...
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="bg-white rounded-lg shadow max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-blue-500 text-white p-6 rounded-t-lg">
            <h1 className="text-2xl font-bold">Apply for Position</h1>
            <p>Complete your application using your profile information</p>
          </div>

          {/* Form */}
          <div className="p-6">
            {/* Personal Information */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <User className="text-blue-600 mr-2" size={24} />
                <h2 className="text-xl font-bold">Personal Information</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={userProfile.firstName}
                    onChange={handleProfileChange}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your first name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={userProfile.lastName}
                    onChange={handleProfileChange}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your last name"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <Mail className="text-green-600 mr-2" size={24} />
                <h2 className="text-xl font-bold">Contact Information</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="email"
                      name="email"
                      value={userProfile.email}
                      onChange={handleProfileChange}
                      className="w-full pl-10 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="tel"
                      name="phone"
                      value={userProfile.phone}
                      onChange={handleProfileChange}
                      className="w-full pl-10 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                      placeholder="+1 (555) 123-4567"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Current Location *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      name="location"
                      value={userProfile.location}
                      onChange={handleProfileChange}
                      className="w-full pl-10 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                      placeholder="City, State, Country"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    LinkedIn Profile
                  </label>
                  <input
                    type="url"
                    name="linkedinProfile"
                    value={userProfile.linkedinProfile}
                    onChange={handleProfileChange}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>
              </div>
            </div>

            {/* Education Section */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <GraduationCap className="text-purple-600 mr-2" size={24} />
                <h2 className="text-xl font-bold">Education</h2>
              </div>

              {educationList.length > 0 ? (
                <div className="space-y-4">
                  {educationList.map((education) => (
                    <div
                      key={education.id || education.educationId}
                      className="bg-gray-50 border rounded-lg p-4"
                    >
                      <h3 className="text-lg font-bold mb-2">
                        {education.degree} in {education.fieldOfStudy}
                      </h3>
                      <p className="font-medium text-purple-700 mb-1">
                        {education.school}
                      </p>
                      <div className="text-gray-600 mb-2">
                        <span>📅 {education.startDate} - {education.endDate || "Present"}</span>
                        {education.grade && (
                          <span className="ml-4">🏆 Grade: {education.grade}</span>
                        )}
                      </div>
                      {education.description && (
                        <p className="text-gray-700 text-sm">
                          {education.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg border-dashed border-2">
                  <GraduationCap className="mx-auto text-gray-300 mb-4" size={48} />
                  <p className="text-gray-600 mb-2">No education information found in your profile</p>
                  <p className="text-gray-500 text-sm">Please update your profile to add education details</p>
                </div>
              )}
            </div>

            {/* Skills Section - Display Only */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <Award className="text-indigo-600 mr-2" size={24} />
                <h2 className="text-xl font-bold">Skills & Expertise</h2>
              </div>

              {selectedSkills.length > 0 ? (
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    Your Skills from Profile
                  </label>
                  <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-lg border">
                    {selectedSkills.map((skill) => {
                      if (!skill || !skill.id || !skill.skillName) {
                        return null;
                      }

                      return (
                        <div
                          key={`selected-skill-${skill.id}`}
                          className="bg-indigo-500 text-white rounded-full px-3 py-1 text-sm"
                        >
                          <span>{skill.skillName}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg border-dashed border-2">
                  <Award className="mx-auto text-gray-300 mb-4" size={48} />
                  <p className="text-gray-600 mb-2">No skills found in your profile</p>
                  <p className="text-gray-500 text-sm">Please update your profile to add your skills</p>
                </div>
              )}
            </div>

            {/* Job Preferences */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <DollarSign className="text-orange-600 mr-2" size={24} />
                <h2 className="text-xl font-bold">Job Preferences</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Expected Salary
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      name="expectedSalary"
                      value={formData.expectedSalary}
                      onChange={handleFormChange}
                      className="w-full pl-10 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                      placeholder="80,000 - 100,000"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Available Start Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleFormChange}
                      className="w-full pl-10 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Resume Upload */}
            <div className="mb-8">
              <div className="flex items-center mb-3">
                <Upload className="text-blue-600 mr-2" size={20} />
                <label className="text-sm font-medium">
                  Resume/CV
                </label>
              </div>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <div className="space-y-3">
                  <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto">
                    <Upload className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <p className="font-medium">Upload your resume</p>
                    <p className="text-sm text-gray-500">PDF, DOC, or DOCX (max 5MB)</p>
                  </div>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    id="resume-upload"
                  />
                  <label
                    htmlFor="resume-upload"
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium cursor-pointer"
                  >
                    Choose File
                  </label>
                </div>
              </div>
            </div>

            {/* Cover Letter */}
            <div className="mb-8">
              <label className="block text-sm font-medium mb-2">
                Cover Letter (Optional)
              </label>
              <textarea
                rows="6"
                name="coverLetter"
                value={formData.coverLetter}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Write a brief cover letter explaining why you're interested in this position and what makes you a great fit..."
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end gap-4">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 font-medium"
              >
                Save as Draft
              </button>
              <button
                type="button"
                onClick={handleSubmitApplication}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
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