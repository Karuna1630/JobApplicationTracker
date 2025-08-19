import React, { useState, useEffect } from "react";
import {
  IoClose,
  IoAdd,
  IoBriefcase,
} from "react-icons/io5";
import { Calendar, MapPin } from "react-feather";

const Experience = () => {
  const [experiences, setExperiences] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingExperience, setEditingExperience] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    jobTitle: "",
    organization: "",
    location: "",
    startMonth: "",
    startYear: "",
    endMonth: "",
    endYear: "",
    currentRole: false,
    description: "",
  });

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  // Updated API Base URL to match your backend
  const API_BASE_URL = 'https://localhost:7047';

  // Fetch all experiences
  const fetchExperiences = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/getallexperiences`);
      if (response.ok) {
        const data = await response.json();
        setExperiences(data);
      } else {
        console.error('Failed to fetch experiences');
        alert('Failed to load experiences');
      }
    } catch (error) {
      console.error('Error fetching experiences:', error);
      alert('Error loading experiences');
    } finally {
      setLoading(false);
    }
  };

  // Save or update experience - Updated to match your API structure
  const saveExperience = async (experienceData) => {
    try {
      setLoading(true);
      
      // Prepare data for API - Updated to match your API structure exactly
      const apiData = {
        experienceId: editingExperience || 0, // Use 0 for new experiences
        jobTitle: experienceData.jobTitle,
        organization: experienceData.organization,
        location: experienceData.location || "",
        startMonth: experienceData.startMonth ? months.indexOf(experienceData.startMonth) + 1 : 0,
        startYear: experienceData.startYear ? parseInt(experienceData.startYear) : 0,
        endMonth: experienceData.currentRole ? 0 : (experienceData.endMonth ? months.indexOf(experienceData.endMonth) + 1 : 0),
        endYear: experienceData.currentRole ? 0 : (experienceData.endYear ? parseInt(experienceData.endYear) : 0),
        isCurrentlyWorking: experienceData.currentRole, // Boolean as expected by API
        description: experienceData.description || "",
      };

      console.log('Sending data to API:', apiData); // Debug log

      const response = await fetch(`${API_BASE_URL}/submitexperience`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': '*/*'
        },
        body: JSON.stringify(apiData),
      });

      console.log('Response status:', response.status); // Debug log

      if (response.ok) {
        const result = await response.json();
        console.log('API response:', result); // Debug log
        
        // Check if the response indicates success
        if (result.isSuccess) {
          // Refresh the experiences list
          await fetchExperiences();
          closeModal();
          alert(result.message || (editingExperience ? 'Experience updated successfully!' : 'Experience added successfully!'));
        } else {
          alert(`Failed to save experience: ${result.message}`);
        }
      } else {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        alert(`Failed to save experience: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('Network/Fetch Error:', error);
      alert(`Network error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Delete experience
  const deleteExperienceFromDB = async (experienceId) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/deleteexperience`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ experienceId }),
      });

      if (response.ok) {
        setExperiences(prev => prev.filter(exp => exp.experienceId !== experienceId));
        alert('Experience deleted successfully!');
      } else {
        const error = await response.text();
        console.error('Failed to delete experience:', error);
        alert('Failed to delete experience');
      }
    } catch (error) {
      console.error('Error deleting experience:', error);
      alert('Error deleting experience');
    } finally {
      setLoading(false);
    }
  };

  // Load experiences on component mount
  useEffect(() => {
    fetchExperiences();
  }, []);

  const resetForm = () => {
    setFormData({
      jobTitle: "",
      organization: "",
      location: "",
      startMonth: "",
      startYear: "",
      endMonth: "",
      endYear: "",
      currentRole: false,
      description: "",
    });
    setEditingExperience(null);
  };

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => (document.body.style.overflow = "auto");
  }, [showModal]);

  const openModal = (experience = null) => {
    if (experience) {
      // Convert database data back to form format
      setFormData({
        jobTitle: experience.jobTitle || "",
        organization: experience.organization || "",
        location: experience.location || "",
        startMonth: experience.startMonth ? months[experience.startMonth - 1] : "",
        startYear: experience.startYear ? experience.startYear.toString() : "",
        endMonth: experience.endMonth ? months[experience.endMonth - 1] : "",
        endYear: experience.endYear ? experience.endYear.toString() : "",
        currentRole: experience.isCurrentlyWorking === true,
        description: experience.description || "",
      });
      setEditingExperience(experience.experienceId);
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = () => {
    if (!formData.jobTitle.trim() || !formData.organization.trim()) {
      alert("Please fill in the required fields (Job Title and Organization)");
      return;
    }

    if (!formData.startMonth || !formData.startYear) {
      alert("Please select start month and year");
      return;
    }

    if (!formData.currentRole && (!formData.endMonth || !formData.endYear)) {
      alert("Please select end month and year, or check 'currently working'");
      return;
    }

    saveExperience(formData);
  };

  const deleteExperience = (experienceId) => {
    if (window.confirm('Are you sure you want to delete this experience?')) {
      deleteExperienceFromDB(experienceId);
    }
  };

  const formatDateRange = (experience) => {
    const startMonth = experience.startMonth ? months[experience.startMonth - 1] : "";
    const startDate = `${startMonth} ${experience.startYear}`;
    
    const endDate = experience.isCurrentlyWorking === true ? "Present" : 
      experience.endMonth ? `${months[experience.endMonth - 1]} ${experience.endYear}` : "";
    
    return `${startDate} - ${endDate}`;
  };

  if (loading && experiences.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p>Loading experiences...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Experience Section Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Experience</h2>
          <p className="text-gray-600 text-lg">
            Showcase your accomplishments and get up to 2X as many profile views
            and connections
          </p>
        </div>
        <button
          onClick={() => openModal()}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-full hover:bg-blue-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <IoAdd size={20} />
          Add experience
        </button>
      </div>

      {/* Loading indicator for actions */}
      {loading && experiences.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
            <span className="text-blue-800">Processing...</span>
          </div>
        </div>
      )}

      {/* Experience List */}
      <div className="space-y-4">
        {experiences.length === 0 && !loading ? (
          <div className="text-center py-8 text-gray-500">
            <IoBriefcase size={48} className="mx-auto mb-4 text-gray-300" />
            <p className="text-lg mb-2">No experience added yet</p>
            <p>Add your work experience to showcase your professional journey</p>
          </div>
        ) : (
          experiences.map((experience) => (
            <div
              key={experience.experienceId}
              className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow bg-white"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="text-xl font-semibold text-gray-900 mb-1">
                    {experience.jobTitle}
                  </h4>
                  <p className="text-lg text-gray-700 mb-2">
                    {experience.organization}
                  </p>
                  <div className="flex items-center gap-4 text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar size={16} />
                      <span>{formatDateRange(experience)}</span>
                    </div>
                    {experience.location && (
                      <div className="flex items-center gap-1">
                        <MapPin size={16} />
                        <span>{experience.location}</span>
                      </div>
                    )}
                  </div>
                  {experience.description && (
                    <p className="text-gray-700 mb-3 whitespace-pre-wrap">
                      {experience.description}
                    </p>
                  )}
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => openModal(experience)}
                    disabled={loading}
                    className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteExperience(experience.experienceId)}
                    disabled={loading}
                    className="px-3 py-1 text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-xl font-semibold">
                {editingExperience ? "Edit Experience" : "Add Experience"}
              </h3>
              <button
                type="button"
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 p-1"
                disabled={loading}
              >
                <IoClose size={24} />
              </button>
            </div>

            {/* Form content */}
            <div className="p-6 space-y-4 overflow-y-auto flex-grow">
              {/* Job Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Title *
                </label>
                <input
                  type="text"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Software Engineer"
                  required
                  disabled={loading}
                />
              </div>

              {/* Organization */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Organization *
                </label>
                <input
                  type="text"
                  name="organization"
                  value={formData.organization}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Microsoft"
                  required
                  disabled={loading}
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: New York, NY"
                  disabled={loading}
                />
              </div>

              {/* Current Role Checkbox */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="currentRole"
                  checked={formData.currentRole}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  disabled={loading}
                />
                <label className="ml-2 text-sm text-gray-700">
                  I am currently working in this role
                </label>
              </div>

              {/* Start Date */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Month *
                  </label>
                  <select
                    name="startMonth"
                    value={formData.startMonth}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    disabled={loading}
                  >
                    <option value="">Select Month</option>
                    {months.map((month) => (
                      <option key={month} value={month}>
                        {month}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Year *
                  </label>
                  <select
                    name="startYear"
                    value={formData.startYear}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    disabled={loading}
                  >
                    <option value="">Select Year</option>
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* End Date */}
              {!formData.currentRole && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Month *
                    </label>
                    <select
                      name="endMonth"
                      value={formData.endMonth}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required={!formData.currentRole}
                      disabled={loading}
                    >
                      <option value="">Select Month</option>
                      {months.map((month) => (
                        <option key={month} value={month}>
                          {month}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Year *
                    </label>
                    <select
                      name="endYear"
                      value={formData.endYear}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required={!formData.currentRole}
                      disabled={loading}
                    >
                      <option value="">Select Year</option>
                      {years.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe your role and responsibilities..."
                  disabled={loading}
                />
              </div>
            </div>

            {/* Modal footer */}
            <div className="flex justify-end gap-4 p-4 border-t bg-gray-50">
              <button
                onClick={closeModal}
                disabled={loading}
                className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                )}
                {loading ? 'Saving...' : (editingExperience ? "Update" : "Add")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Experience;