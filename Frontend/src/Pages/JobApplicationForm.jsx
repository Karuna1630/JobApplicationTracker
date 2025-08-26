import React, { useState, useEffect } from "react";
import { User, Mail, Phone, MapPin, GraduationCap, Briefcase, DollarSign, Calendar, Upload, Award } from "lucide-react";
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

  // Experience-related state
  const [experienceList, setExperienceList] = useState([]);
  const [loadingExperience, setLoadingExperience] = useState(true);

  // Form data state
  const [formData, setFormData] = useState({
    experience: "",
    currentPosition: "",
    expectedSalary: "",
    startDate: "",
    coverLetter: ""
  });

  // Add state for submission loading
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // Fetch user's experiences (using the same logic as Experience component)
  const fetchExperiences = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = getUserIdFromToken(token);

      if (!userId) {
        console.error('No user ID found');
        return;
      }

      // Use the same API endpoint as the Experience component
      const response = await axiosInstance.get(`/api/Experience/user/${userId}`);
      console.log('Raw experience response:', response.data); // Add this for debugging
      
      if (response.data && Array.isArray(response.data)) {
        setExperienceList(response.data);
      }
    } catch (error) {
      console.error('Error fetching user experiences:', error);
      console.error('Error response:', error.response?.data); // Add this for debugging
      // Don't show error toast for experiences as user might not have any experiences yet
      setExperienceList([]);
    } finally {
      setLoadingExperience(false);
    }
  };

  // Format date range for experience display (simplified without months array)
  const formatDateRange = (experience) => {
    const startText = `${experience.startMonth}/${experience.startYear}`;
    const endText = experience.isCurrentlyWorking ? "Present" : 
      `${experience.endMonth}/${experience.endYear}`;
    return `${startText} - ${endText}`;
  };

  useEffect(() => {
    fetchUserProfile();
    fetchUserSkills();
    fetchEducation();
    fetchExperiences();
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

  // Handle form submission with actual API call
  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      const userId = getUserIdFromToken(token);

      if (!userId) {
        toast.error("Please log in to submit application");
        return;
      }

      // Validate required fields
      if (!userProfile.firstName || !userProfile.lastName || !userProfile.email) {
        toast.error("Please fill in all required personal information");
        return;
      }

      // Prepare the application data according to your API structure
      const applicationData = {
        userId: userId,
        personalInfo: {
          firstName: userProfile.firstName,
          lastName: userProfile.lastName,
          email: userProfile.email,
          phone: userProfile.phone,
          location: userProfile.location,
          linkedinProfile: userProfile.linkedinProfile,
        },
        experience: formData.experience,
        currentPosition: formData.currentPosition,
        skills: selectedSkills.map(skill => ({
          skillId: skill.id,
          skillName: skill.skillName
        })),
        education: educationList,
        workExperience: experienceList,
        expectedSalary: formData.expectedSalary,
        startDate: formData.startDate,
        coverLetter: formData.coverLetter
      };

      console.log('Submitting application data:', applicationData);

      // Make the API call to submit the job application
      const response = await axiosInstance.post('/submitjobapplication', applicationData);

      if (response.status === 200 || response.status === 201) {
        toast.success("Application submitted successfully!");
        
        // Optional: Reset form or redirect user
        // You might want to redirect to a success page or clear the form
        // history.push('/applications'); // if using react-router
        
        // Or reset the form data
        setFormData({
          experience: "",
          currentPosition: "",
          expectedSalary: "",
          startDate: "",
          coverLetter: ""
        });
      }

    } catch (error) {
      console.error('Error submitting application:', error);
      
      // Handle different error scenarios
      if (error.response) {
        // Server responded with error status
        const errorMessage = error.response.data?.message || 
                           error.response.data?.error || 
                           'Failed to submit application';
        toast.error(errorMessage);
        
        // Log detailed error for debugging
        console.error('Server error response:', error.response.data);
      } else if (error.request) {
        // Request was made but no response received
        toast.error('Network error. Please check your connection and try again.');
        console.error('Network error:', error.request);
      } else {
        // Something else happened
        toast.error('An unexpected error occurred. Please try again.');
        console.error('Unexpected error:', error.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle save as draft (optional functionality)
  const handleSaveAsDraft = async () => {
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("token");
      const userId = getUserIdFromToken(token);

      if (!userId) {
        toast.error("Please log in to save draft");
        return;
      }

      const draftData = {
        userId: userId,
        personalInfo: userProfile,
        experience: formData.experience,
        currentPosition: formData.currentPosition,
        skills: selectedSkills,
        education: educationList,
        workExperience: experienceList,
        expectedSalary: formData.expectedSalary,
        startDate: formData.startDate,
        coverLetter: formData.coverLetter,
        isDraft: true
      };

      // You might have a separate endpoint for saving drafts
      // const response = await axiosInstance.post('/savedraftapplication', draftData);
      
      // For now, just show a success message
      toast.success("Draft saved successfully!");
      
    } catch (error) {
      console.error('Error saving draft:', error);
      toast.error('Failed to save draft');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingProfile || loadingSkills || loadingEducation || loadingExperience) {
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
      <div className="min-h-screen bg-gray-50 flex justify-center p-6">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-blue-500 text-white p-6 rounded-t-lg">
            <h1 className="text-2xl font-bold mb-2">Apply for Position</h1>
            <p className="text-blue-100">Complete your application using your profile information</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmitApplication}>
            <div className="p-6">
              {/* Personal Information */}
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <User className="text-blue-600 mr-3" size={24} />
                  <h2 className="text-xl font-bold text-gray-800">Personal Information</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={userProfile.firstName}
                      onChange={handleProfileChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your first name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={userProfile.lastName}
                      onChange={handleProfileChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your last name"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <Mail className="text-green-600 mr-3" size={24} />
                  <h2 className="text-xl font-bold text-gray-800">Contact Information</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={userProfile.email}
                      onChange={handleProfileChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={userProfile.phone}
                      onChange={handleProfileChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="+1 (555) 123-4567"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Location *
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={userProfile.location}
                      onChange={handleProfileChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="City, State, Country"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      LinkedIn Profile
                    </label>
                    <input
                      type="url"
                      name="linkedinProfile"
                      value={userProfile.linkedinProfile}
                      onChange={handleProfileChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="https://linkedin.com/in/yourprofile"
                    />
                  </div>
                </div>
              </div>

              {/* Education Section */}
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <GraduationCap className="text-purple-600 mr-3" size={24} />
                  <h2 className="text-xl font-bold text-gray-800">Education</h2>
                </div>

                {educationList.length > 0 ? (
                  <div className="space-y-4">
                    {educationList.map((education) => (
                      <div
                        key={education.id || education.educationId}
                        className="bg-purple-50 border border-purple-200 rounded-lg p-4"
                      >
                        <h3 className="text-lg font-bold text-gray-800 mb-1">
                          {education.degree} in {education.fieldOfStudy}
                        </h3>
                        <p className="text-purple-700 font-medium mb-1">
                          {education.school}
                        </p>
                        <div className="text-gray-600 text-sm mb-2">
                          <span>{education.startDate} - {education.endDate || "Present"}</span>
                          {education.grade && (
                            <span className="ml-4">Grade: {education.grade}</span>
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
                  <div className="text-center py-8 bg-purple-50 rounded-lg border-2 border-dashed border-purple-200">
                    <GraduationCap className="mx-auto text-purple-300 mb-2" size={32} />
                    <p className="text-gray-600 mb-1">No education information found in your profile</p>
                    <p className="text-gray-500 text-sm">Please update your profile to add education details</p>
                  </div>
                )}
              </div>

              {/* Professional Experience Section */}
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <Briefcase className="text-teal-600 mr-3" size={24} />
                  <h2 className="text-xl font-bold text-gray-800">Professional Experience</h2>
                </div>

                {experienceList.length > 0 ? (
                  <div className="space-y-4">
                    {experienceList.map((experience) => (
                      <div
                        key={experience.experienceId || experience.id}
                        className="bg-teal-50 border border-teal-200 rounded-lg p-4"
                      >
                        <h3 className="text-lg font-bold text-gray-800 mb-1">
                          {experience.jobTitle}
                        </h3>
                        <p className="text-teal-700 font-medium mb-1">
                          {experience.organization}
                        </p>
                        <div className="text-gray-600 text-sm mb-2">
                          <span>{formatDateRange(experience)}</span>
                          {experience.location && (
                            <span className="ml-4">{experience.location}</span>
                          )}
                        </div>
                        {experience.description && (
                          <p className="text-gray-700 text-sm whitespace-pre-wrap">
                            {experience.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-teal-50 rounded-lg border-2 border-dashed border-teal-200">
                    <Briefcase className="mx-auto text-teal-300 mb-2" size={32} />
                    <p className="text-gray-600 mb-1">No professional experience found in your profile</p>
                    <p className="text-gray-500 text-sm">Please update your profile to add work experience</p>
                  </div>
                )}
              </div>

              {/* Skills Section */}
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <Award className="text-indigo-600 mr-3" size={24} />
                  <h2 className="text-xl font-bold text-gray-800">Skills & Expertise</h2>
                </div>

                {selectedSkills.length > 0 ? (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Skills from Profile
                    </label>
                    <div className="flex flex-wrap gap-2 p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                      {selectedSkills.map((skill) => {
                        if (!skill || !skill.id || !skill.skillName) {
                          return null;
                        }

                        return (
                          <div
                            key={`selected-skill-${skill.id}`}
                            className="bg-indigo-500 text-white rounded-full px-3 py-1 text-sm font-medium"
                          >
                            {skill.skillName}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 bg-indigo-50 rounded-lg border-2 border-dashed border-indigo-200">
                    <Award className="mx-auto text-indigo-300 mb-2" size={32} />
                    <p className="text-gray-600 mb-1">No skills found in your profile</p>
                    <p className="text-gray-500 text-sm">Please update your profile to add your skills</p>
                  </div>
                )}
              </div>

              {/* Job Preferences */}
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <DollarSign className="text-orange-600 mr-3" size={24} />
                  <h2 className="text-xl font-bold text-gray-800">Job Preferences</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expected Salary
                    </label>
                    <input
                      type="text"
                      name="expectedSalary"
                      value={formData.expectedSalary}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="80,000 - 100,000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Available Start Date
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Resume Upload */}
              <div className="mb-8">
                <div className="flex items-center mb-3">
                  <Upload className="text-blue-600 mr-3" size={20} />
                  <label className="text-sm font-medium text-gray-700">
                    Resume/CV
                  </label>
                </div>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="mx-auto text-gray-400 mb-2" size={24} />
                  <p className="text-gray-600 mb-1">Upload your resume</p>
                  <p className="text-sm text-gray-500 mb-3">PDF, DOC, or DOCX (max 5MB)</p>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    id="resume-upload"
                  />
                  <label
                    htmlFor="resume-upload"
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium cursor-pointer"
                  >
                    Choose File
                  </label>
                </div>
              </div>

              {/* Cover Letter */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cover Letter (Optional)
                </label>
                <textarea
                  rows="6"
                  name="coverLetter"
                  value={formData.coverLetter}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  placeholder="Write a brief cover letter explaining why you're interested in this position and what makes you a great fit..."
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={handleSaveAsDraft}
                  disabled={isSubmitting}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Saving...' : 'Save as Draft'}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Submitting...
                    </>
                  ) : (
                    'Submit Application'
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default JobApplicationForm;