import React, { useState, useEffect } from "react";
import axiosInstance from "../Utils/axiosInstance";
import { toast } from "react-toastify";
import { FaTimes, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaGraduationCap, FaBriefcase, FaCogs, FaDollarSign, FaCalendarAlt, FaFileAlt, FaDownload, FaEye, FaCheck, FaTimesCircle } from "react-icons/fa";

const ReviewModal = ({ 
  isOpen, 
  onClose, 
  applicationId, 
  userId, 
  onStatusUpdate 
}) => {
  const [applicationData, setApplicationData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch application details when modal opens
  useEffect(() => {
    if (isOpen && userId) {
      fetchApplicationDetails();
    }
  }, [isOpen, userId]);

  const fetchApplicationDetails = async () => {
    try {
      setIsLoading(true);
      setError("");
      
      const response = await axiosInstance.get(`/getjobapplicationsbyuserid?userId=${userId}`);
      
      if (response.data && response.data.data) {
        // Find the specific application by applicationId
        const applications = Array.isArray(response.data.data) ? response.data.data : [response.data.data];
        const application = applications.find(app => app.applicationId === applicationId) || applications[0];
        
        if (application) {
          setApplicationData(application);
        } else {
          setError("Application not found");
        }
      } else {
        setError("No application data found");
      }
    } catch (error) {
      console.error("Error fetching application details:", error);
      setError("Failed to load application details");
      toast.error("Failed to load application details");
    } finally {
      setIsLoading(false);
    }
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
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleResumeDownload = (resumeUrl) => {
    if (resumeUrl) {
      window.open(resumeUrl, '_blank');
    } else {
      toast.error("Resume not available");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Application Review</h2>
            <p className="text-blue-100">Review candidate details and make a decision</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-blue-800 rounded-full p-2 transition-colors"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading application details...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center py-20">
              <div className="text-center text-red-600">
                <FaTimesCircle size={48} className="mx-auto mb-4" />
                <p className="text-lg">{error}</p>
              </div>
            </div>
          ) : applicationData ? (
            <div className="p-6 space-y-8">
              {/* Personal Information */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FaUser className="text-blue-600" />
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <p className="text-gray-900 bg-white p-3 rounded-lg border">{applicationData.firstName || "Not provided"}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <p className="text-gray-900 bg-white p-3 rounded-lg border">{applicationData.lastName || "Not provided"}</p>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FaEnvelope className="text-blue-600" />
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <p className="text-gray-900 bg-white p-3 rounded-lg border flex items-center gap-2">
                      <FaEnvelope className="text-gray-400 text-sm" />
                      {applicationData.email || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <p className="text-gray-900 bg-white p-3 rounded-lg border flex items-center gap-2">
                      <FaPhone className="text-gray-400 text-sm" />
                      {applicationData.phoneNumber || "Not provided"}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Location</label>
                    <p className="text-gray-900 bg-white p-3 rounded-lg border flex items-center gap-2">
                      <FaMapMarkerAlt className="text-gray-400 text-sm" />
                      {applicationData.currentLocation || "Not provided"}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn Profile</label>
                    <div className="text-gray-900 bg-white p-3 rounded-lg border">
                      {applicationData.linkedinProfile ? (
                        <a 
                          href={applicationData.linkedinProfile} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {applicationData.linkedinProfile}
                        </a>
                      ) : (
                        "Not provided"
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Education */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FaGraduationCap className="text-blue-600" />
                  Education
                </h3>
                {applicationData.education && applicationData.education.length > 0 ? (
                  <div className="space-y-4">
                    {applicationData.education.map((edu, index) => (
                      <div key={index} className="bg-white p-4 rounded-lg border">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Institution</label>
                            <p className="text-gray-900">{edu.institution || "Not provided"}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
                            <p className="text-gray-900">{edu.degree || "Not provided"}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Field of Study</label>
                            <p className="text-gray-900">{edu.fieldOfStudy || "Not provided"}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Graduation Year</label>
                            <p className="text-gray-900">{edu.graduationYear || "Not provided"}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white p-6 rounded-lg border text-center">
                    <FaGraduationCap className="text-4xl text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500">No education information provided</p>
                  </div>
                )}
              </div>

              {/* Professional Experience */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FaBriefcase className="text-blue-600" />
                  Professional Experience
                </h3>
                {applicationData.experience && applicationData.experience.length > 0 ? (
                  <div className="space-y-4">
                    {applicationData.experience.map((exp, index) => (
                      <div key={index} className="bg-white p-4 rounded-lg border">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                            <p className="text-gray-900">{exp.company || "Not provided"}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                            <p className="text-gray-900">{exp.position || "Not provided"}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                            <p className="text-gray-900">{formatDate(exp.startDate)}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                            <p className="text-gray-900">{exp.endDate ? formatDate(exp.endDate) : "Current"}</p>
                          </div>
                          {exp.description && (
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                              <p className="text-gray-900 whitespace-pre-wrap">{exp.description}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white p-6 rounded-lg border text-center">
                    <FaBriefcase className="text-4xl text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500">No professional experience provided</p>
                  </div>
                )}
              </div>

              {/* Skills */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FaCogs className="text-blue-600" />
                  Skills
                </h3>
                {applicationData.skills && applicationData.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {applicationData.skills.map((skill, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white p-6 rounded-lg border text-center">
                    <FaCogs className="text-4xl text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500">No skills information provided</p>
                  </div>
                )}
              </div>

              {/* Job Preferences */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FaDollarSign className="text-blue-600" />
                  Job Preferences
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expected Salary</label>
                    <p className="text-gray-900 bg-white p-3 rounded-lg border">
                      {applicationData.expectedSalary ? `$${applicationData.expectedSalary}` : "Not provided"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Available Start Date</label>
                    <p className="text-gray-900 bg-white p-3 rounded-lg border flex items-center gap-2">
                      <FaCalendarAlt className="text-gray-400 text-sm" />
                      {formatDate(applicationData.availableStartDate)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Resume/CV */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FaFileAlt className="text-blue-600" />
                  Resume/CV
                </h3>
                {applicationData.resumeUrl ? (
                  <div className="bg-white p-4 rounded-lg border">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FaFileAlt className="text-red-500 text-2xl" />
                        <div>
                          <p className="font-medium text-gray-900">Resume.pdf</p>
                          <p className="text-sm text-gray-500">Click to view or download</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => window.open(applicationData.resumeUrl, '_blank')}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                          <FaEye />
                          View
                        </button>

                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white p-6 rounded-lg border text-center">
                    <FaFileAlt className="text-4xl text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500">No resume uploaded</p>
                  </div>
                )}
              </div>

              {/* Cover Letter */}
              {applicationData.coverLetter && (
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <FaFileAlt className="text-blue-600" />
                    Cover Letter
                  </h3>
                  <div className="bg-white p-4 rounded-lg border">
                    <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">
                      {applicationData.coverLetter}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>

        {/* Modal Footer with Action Buttons */}
        {!isLoading && !error && applicationData && (
          <div className="border-t bg-gray-50 p-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Application submitted on {formatDate(applicationData.applicationDate)}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => handleStatusUpdate(4)}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                >
                  <FaTimesCircle />
                  Reject
                </button>
                <button
                  onClick={() => handleStatusUpdate(2)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <FaEye />
                  Mark as Reviewed
                </button>
                <button
                  onClick={() => handleStatusUpdate(3)}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
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