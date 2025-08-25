import React, { useState, useEffect } from "react";
import {
  IoClose,
  IoAdd,
  IoBriefcase,
} from "react-icons/io5";
import { Calendar, MapPin } from "react-feather";
import axiosInstance from "../Utils/axiosInstance";
import { getUserIdFromToken } from '../Utils/jwtUtils';
import { toast } from "react-toastify";

const Experience = () => {
  const [experiences, setExperiences] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingExperience, setEditingExperience] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

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

  
  const fetchExperiences = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = getUserIdFromToken(token);
      const response = await axiosInstance.get(`api/Experience/user/${userId}`);
      setExperiences(response.data || []);
    } catch (error) {
      console.error('Failed to fetch experiences:', error);
      setExperiences([]);
    } finally {
      setIsLoading(false);
    }
  };

 
  const handleSubmit = async () => {
    if (!formData.jobTitle.trim() || !formData.organization.trim()) {
      toast.error("Please fill in the required fields (Job Title and Organization)");
      return;
    }

    if (!formData.startMonth || !formData.startYear) {
      toast.error("Please select start month and year");
      return;
    }

    if (!formData.currentRole && (!formData.endMonth || !formData.endYear)) {
      toast.error("Please select end month and year, or check 'currently working'");
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const userId = getUserIdFromToken(token);

 
      const experienceData = {
        userId,
        organization: formData.organization,
        jobTitle: formData.jobTitle,
        location: formData.location || null,
        startMonth: formData.startMonth ? months.indexOf(formData.startMonth) + 1 : 1,
        startYear: formData.startYear ? parseInt(formData.startYear) : new Date().getFullYear(),
        endMonth: formData.currentRole ? null : (formData.endMonth ? months.indexOf(formData.endMonth) + 1 : null),
        endYear: formData.currentRole ? null : (formData.endYear ? parseInt(formData.endYear) : null),
        isCurrentlyWorking: formData.currentRole,
        description: formData.description || null,
      };

      if (editingExperience) {
        // For editing, include the experience ID
        experienceData.experienceId = editingExperience.experienceId || editingExperience.id;
        
        console.log('Editing experience with data:', experienceData);
        
        await axiosInstance.post('/api/Experience', experienceData);
        
        toast.success('Experience updated successfully!');
        await fetchExperiences();
        closeModal();
        setEditingExperience(null);
      } else {
        // For adding new experience
        console.log('Adding new experience with data:', experienceData);
        
        const experienceResponse = await axiosInstance.post('/api/Experience', experienceData);
        const experienceId = experienceResponse.data.experienceId || experienceResponse.data.id;

        // Update user table with experience IDs 
        const existingExperienceIds = experiences.map(exp => exp.experienceId || exp.id);
        const updatedExperienceIds = [...existingExperienceIds, experienceId];
        const experienceJsonString = JSON.stringify(updatedExperienceIds);

        const response = await axiosInstance.post(`/submituser`, {
          userId,
          experiences: experienceJsonString,
        });

        if (response.data && response.data.isSuccess) {
          toast.success('Experience added successfully!');
          await fetchExperiences();
          closeModal();
          setEditingExperience(null);
        } else {
          throw new Error(response.data?.message || 'Failed to update user with experience');
        }
      }
    } catch (error) {
      console.error('Failed to save experience:', error);
      console.error('Error details:', error.response?.data);
      toast.error(`Failed to ${editingExperience ? 'update' : 'save'} experience. Please try again.`);
    } finally {
      setSubmitting(false);
    }
  };

  // Delete experience using axios
  const handleDelete = async (experienceId) => {
    if (window.confirm('Are you sure you want to delete this experience?')) {
      try {
        await axiosInstance.delete(`/api/Experience/${experienceId}`);
        await fetchExperiences();
        toast.success('Experience deleted successfully!');
      } catch (error) {
        console.error('Failed to delete experience:', error);
        toast.error('Failed to delete experience. Please try again.');
      }
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
      console.log('Editing experience:', experience);
      
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
      setEditingExperience(experience);
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

  const formatDateRange = (experience) => {
    const startMonth = experience.startMonth ? months[experience.startMonth - 1] : "";
    const startText = `${startMonth} ${experience.startYear}`;
    
    const endText = experience.isCurrentlyWorking ? "Present" : 
      (experience.endMonth ? `${months[experience.endMonth - 1]} ${experience.endYear}` : "");
    
    return `${startText} - ${endText}`;
  };

  if (isLoading) {
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
          disabled={submitting}
          className="flex items-center gap-2 px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-full hover:bg-blue-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <IoAdd size={20} />
          Add experience
        </button>
      </div>

      {/* Loading indicator for actions */}
      {submitting && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
            <span className="text-blue-800">Processing...</span>
          </div>
        </div>
      )}

      {/* Experience List */}
      <div className="space-y-4">
        {experiences.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <IoBriefcase size={48} className="mx-auto mb-4 text-gray-300" />
            <p className="text-lg mb-2">No experience added yet</p>
            <p>Add your work experience to showcase your professional journey</p>
          </div>
        ) : (
          experiences.map((experience, index) => (
            <div
              key={experience.experienceId || experience.id || index}
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
                    disabled={submitting}
                    className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(experience.experienceId || experience.id)}
                    disabled={submitting}
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
                disabled={submitting}
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
                  disabled={submitting}
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
                  disabled={submitting}
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
                  disabled={submitting}
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
                  disabled={submitting}
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
                    disabled={submitting}
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
                    disabled={submitting}
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
                      disabled={submitting}
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
                      disabled={submitting}
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
                  disabled={submitting}
                />
              </div>
            </div>

            {/* Modal footer */}
            <div className="flex justify-end gap-4 p-4 border-t bg-gray-50">
              <button
                onClick={closeModal}
                disabled={submitting}
                className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {submitting && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                )}
                {submitting ? 'Saving...' : (editingExperience ? "Update" : "Add")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Experience;