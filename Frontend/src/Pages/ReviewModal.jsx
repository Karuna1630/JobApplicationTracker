import React, { useState, useEffect } from "react";
import axiosInstance from "../Utils/axiosInstance";
import { toast } from "react-toastify";
import { FaTimes, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaGraduationCap, FaBriefcase, FaCogs, FaDollarSign, FaCalendarAlt, FaFileAlt, FaEye, FaCheck, FaTimesCircle } from "react-icons/fa";

const ReviewModal = ({ 
  isOpen, 
  onClose, 
  applicationId, 
  userId, 
  onStatusUpdate 
}) => {
  const [applicationData, setApplicationData] = useState(null);
  const [userProfile, setUserProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    linkedinProfile: "",
  });
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [educationList, setEducationList] = useState([]);
  const [experienceList, setExperienceList] = useState([]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingSkills, setLoadingSkills] = useState(true);
  const [loadingEducation, setLoadingEducation] = useState(true);
  const [loadingExperience, setLoadingExperience] = useState(true);
  const [error, setError] = useState("");

  // Fetch application details when modal opens
  useEffect(() => {
    if (isOpen && applicationId && userId) {
      fetchApplicationDetails();
      fetchUserProfile();
      fetchUserSkills();
      fetchEducation();
      fetchExperiences();
    }
  }, [isOpen, applicationId, userId]);

  const fetchApplicationDetails = async () => {
    try {
      setIsLoading(true);
      setError("");
      
      const applicationResponse = await axiosInstance.get(`/getjobapplicationsbyuserid?userId=${userId}`);
      
      let applicationFound = null;
      if (applicationResponse.data && applicationResponse.data.data) {
        const applications = Array.isArray(applicationResponse.data.data) ? 
          applicationResponse.data.data : [applicationResponse.data.data];
        applicationFound = applications.find(app => app.applicationId === applicationId) || applications[0];
      }
      
      if (applicationFound) {
        setApplicationData(applicationFound);
      } else {
        setError("Application not found");
      }
    } catch (error) {
      console.error("Error fetching application details:", error);
      setError("Failed to load application details");
      toast.error("Failed to load application details");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch user profile - Same logic as JobApplicationForm
  const fetchUserProfile = async () => {
    try {
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

  // Fetch user's skills - Same logic as JobApplicationForm
  const fetchUserSkills = async () => {
    try {
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

  // Fetch user's education - Same logic as JobApplicationForm
  const fetchEducation = async () => {
    try {
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

  // Fetch user's experiences - Same logic as JobApplicationForm
  const fetchExperiences = async () => {
    try {
      const response = await axiosInstance.get(`/api/Experience/user/${userId}`);
      console.log('Raw experience response:', response.data);
      
      if (response.data && Array.isArray(response.data)) {
        setExperienceList(response.data);
      }
    } catch (error) {
      console.error('Error fetching user experiences:', error);
      console.error('Error response:', error.response?.data);
      setExperienceList([]);
    } finally {
      setLoadingExperience(false);
    }
  };

  // Format date range for experience display - Same logic as JobApplicationForm
  const formatDateRange = (experience) => {
    const startText = `${experience.startMonth}/${experience.startYear}`;
    const endText = experience.isCurrentlyWorking ? "Present" : 
      `${experience.endMonth}/${experience.endYear}`;
    return `${startText} - ${endText}`;
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      await onStatusUpdate(applicationId, newStatus);
      onClose(); // Close modal after successful update
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not provided";
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "Not provided" : date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isDataLoading = loadingProfile || loadingSkills || loadingEducation || loadingExperience;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Application Review</h2>
            <p className="text-sm">Review candidate details and make a decision</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-blue-700 rounded p-1"
          >
            <FaTimes size={18} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-200px)] p-6">
          {isLoading || isDataLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="text-center">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading application details...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center py-20">
              <div className="text-center text-red-600">
                <FaTimesCircle size={40} className="mx-auto mb-4" />
                <p className="text-lg">{error}</p>
                <button
                  onClick={fetchApplicationDetails}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Retry
                </button>
              </div>
            </div>
          ) : applicationData ? (
            <div className="space-y-6">
              {/* Personal Information */}
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <FaUser className="text-blue-600 mr-3" size={24} />
                  <h2 className="text-xl font-bold text-gray-800">Personal Information</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                      {userProfile.firstName || "Not provided"}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                      {userProfile.lastName || "Not provided"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <FaEnvelope className="text-green-600 mr-3" size={24} />
                  <h2 className="text-xl font-bold text-gray-800">Contact Information</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                      {userProfile.email || "Not provided"}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                      {userProfile.phone || "Not provided"}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Location
                    </label>
                    <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                      {userProfile.location || "Not provided"}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      LinkedIn Profile
                    </label>
                    <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                      {userProfile.linkedinProfile ? (
                        <a href={userProfile.linkedinProfile} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          {userProfile.linkedinProfile}
                        </a>
                      ) : (
                        "Not provided"
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Education Section - Same as JobApplicationForm */}
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <FaGraduationCap className="text-purple-600 mr-3" size={24} />
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
                    <FaGraduationCap className="mx-auto text-purple-300 mb-2" size={32} />
                    <p className="text-gray-600 mb-1">No education information found in profile</p>
                    <p className="text-gray-500 text-sm">Candidate has not added education details</p>
                  </div>
                )}
              </div>

              {/* Professional Experience Section - Same as JobApplicationForm */}
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <FaBriefcase className="text-teal-600 mr-3" size={24} />
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
                    <FaBriefcase className="mx-auto text-teal-300 mb-2" size={32} />
                    <p className="text-gray-600 mb-1">No professional experience found in profile</p>
                    <p className="text-gray-500 text-sm">Candidate has not added work experience</p>
                  </div>
                )}
              </div>

              {/* Skills Section - Same as JobApplicationForm */}
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <FaCogs className="text-indigo-600 mr-3" size={24} />
                  <h2 className="text-xl font-bold text-gray-800">Skills</h2>
                </div>
                {selectedSkills.length > 0 ? (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2 p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                      {selectedSkills.map((skill) => {
                        if (!skill || !skill.id || !skill.skillName) {
                          return null;
                        }
                        return (
                          <div
                            key={`skill-${skill.id}`}
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
                    <FaCogs className="mx-auto text-indigo-300 mb-2" size={32} />
                    <p className="text-gray-600 mb-1">No skills found in profile</p>
                    <p className="text-gray-500 text-sm">Candidate has not added skills</p>
                  </div>
                )}
              </div>

              {/* Job Preferences */}
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <FaDollarSign className="text-orange-600 mr-3" size={24} />
                  <h2 className="text-xl font-bold text-gray-800">Job Preferences</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expected Salary
                    </label>
                    <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                      {applicationData.salaryExpectation || applicationData.expectedSalary ? 
                        `$${applicationData.salaryExpectation || applicationData.expectedSalary}` : 
                        "Not specified"
                      }
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Available Start Date
                    </label>
                    <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                      {formatDate(applicationData.availableStartDate)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Resume */}
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <FaFileAlt className="text-blue-600 mr-3" size={24} />
                  <h2 className="text-xl font-bold text-gray-800">Resume</h2>
                </div>
                {applicationData.resumeFile || applicationData.resumeUrl ? (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FaFileAlt className="text-blue-600 mr-3" size={24} />
                        <div>
                          <p className="font-medium text-gray-800">
                            {applicationData.resumeFileName || "Resume.pdf"}
                          </p>
                          <p className="text-sm text-gray-600">
                            {applicationData.resumeFileSize && 
                              `${(applicationData.resumeFileSize / (1024 * 1024)).toFixed(2)} MB`
                            }
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          if (applicationData.resumeUrl) {
                            window.open(applicationData.resumeUrl, '_blank');
                          } else if (applicationData.resumeFile) {
                            // Handle base64 resume file
                            const byteCharacters = atob(applicationData.resumeFile);
                            const byteNumbers = new Array(byteCharacters.length);
                            for (let i = 0; i < byteCharacters.length; i++) {
                              byteNumbers[i] = byteCharacters.charCodeAt(i);
                            }
                            const byteArray = new Uint8Array(byteNumbers);
                            const blob = new Blob([byteArray], { type: applicationData.resumeFileType || 'application/pdf' });
                            const url = URL.createObjectURL(blob);
                            window.open(url, '_blank');
                          }
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
                      >
                        <FaEye />
                        View
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                    <FaFileAlt className="mx-auto text-gray-300 mb-2" size={32} />
                    <p className="text-gray-600 mb-1">No resume uploaded</p>
                    <p className="text-gray-500 text-sm">Candidate has not provided a resume</p>
                  </div>
                )}
              </div>

              {/* Cover Letter */}
              {applicationData.coverLetter && (
                <div className="mb-8">
                  <div className="flex items-center mb-4">
                    <FaFileAlt className="text-green-600 mr-3" size={24} />
                    <h2 className="text-xl font-bold text-gray-800">Cover Letter</h2>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="whitespace-pre-wrap text-gray-800">
                      {applicationData.coverLetter}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-20">
              <FaUser size={40} className="mx-auto mb-4" />
              <p>No application data available</p>
            </div>
          )}
        </div>

        {/* Footer */}
        {!isLoading && !error && applicationData && !isDataLoading && (
          <div className="border-t p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Applied on {formatDate(applicationData.applicationDate)}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  onClick={() => handleStatusUpdate(4)}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center gap-2"
                >
                  <FaTimesCircle />
                  Reject
                </button>
                <button
                  onClick={() => handleStatusUpdate(2)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
                >
                  <FaEye />
                  Reviewed
                </button>
                <button
                  onClick={() => handleStatusUpdate(3)}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-2"
                >
                  <FaCheck />
                  Accept
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewModal;