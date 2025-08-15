import React, { useState, useEffect } from "react";
import { X, Plus, Briefcase, Calendar, MapPin } from "lucide-react";
import axiosInstance from "../Utils/axiosInstance";
import { getUserIdFromToken } from "../Utils/jwtUtils";
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
      const response = await axiosInstance.get(`getexperiencebyid?id=${userId}`);
      setExperiences(response.data || []);
    } catch (error) {
      console.error('Failed to fetch experiences:', error);
      setExperiences([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showModal]);

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
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
const handleSubmit = async () => {
  setSubmitting(true);
  try {
    const token = localStorage.getItem('token');
    const userId = getUserIdFromToken(token);

    // Convert month/year to a date string (YYYY-MM-01)
    const startDate = formData.startMonth && formData.startYear
      ? `${new Date(`${formData.startMonth} 1, ${formData.startYear}`).toISOString().split('T')[0]}`
      : null;

    const endDate = !formData.currentRole && formData.endMonth && formData.endYear
      ? `${new Date(`${formData.endMonth} 1, ${formData.endYear}`).toISOString().split('T')[0]}`
      : null;

    const experienceData = {
      userId,
      jobTitle: formData.jobTitle,
      organization: formData.organization,
      location: formData.location,
      startDate,
      endDate,
      isCurrentlyWorking: formData.currentRole, // match backend field
      description: formData.description || ''
    };

    // Step 1: Insert into Experience table
    const experienceResponse = await axiosInstance.post('submitexperience', experienceData);
    const experienceId = experienceResponse.data.experienceId || experienceResponse.data.id;

    // Step 2: Update user record with new experience IDs
    const existingExperienceIds = experiences.map(exp => exp.experienceId || exp.id);
    const updatedExperienceIds = [...existingExperienceIds, experienceId];
    const experienceJsonString = JSON.stringify(updatedExperienceIds);

    const response = await axiosInstance.post('submituser', {
      userId,
      experience: experienceJsonString,
    });

    if (response.data && response.data.isSuccess) {
      toast.success('Experience added successfully!');
      await fetchExperiences(); // refresh list
      setShowModal(false);
      resetForm();
      setEditingExperience(null);
    } else {
      throw new Error(response.data?.message || 'Failed to update user with experience');
    }

  } catch (error) {
    console.error('Failed to save experience:', error);
    toast.error('Failed to save experience. Please try again.');
  } finally {
    setSubmitting(false);
  }
};


  const handleEdit = (experience) => {
    console.log('Editing experience:', experience);
    
    setFormData({
      jobTitle: experience.jobTitle || '',
      organization: experience.organization || '',
      location: experience.location || '',
      startMonth: experience.startMonth || '',
      startYear: experience.startYear || '',
      endMonth: experience.endMonth || '',
      endYear: experience.endYear || '',
      currentRole: experience.currentRole || false,
      description: experience.description || '',
    });

    setEditingExperience(experience);
    setShowModal(true);
  };

  const handleDelete = async (experienceId) => {
    if (window.confirm('Are you sure you want to delete this experience?')) {
      try {
        await axiosInstance.delete(`deleteexperience?id=${experienceId}`);
        await fetchExperiences();
        toast.success('Experience deleted successfully!');
      } catch (error) {
        console.error('Failed to delete experience:', error);
        toast.error('Failed to delete experience. Please try again.');
      }
    }
  };

  const formatDateRange = (experience) => {
    if (!experience.startMonth || !experience.startYear) {
      return "Date not specified";
    }
    
    const startDate = `${experience.startMonth} ${experience.startYear}`;
    const endDate = experience.currentRole 
      ? "Present" 
      : (experience.endMonth && experience.endYear) 
        ? `${experience.endMonth} ${experience.endYear}`
        : "Present";
    
    return `${startDate} - ${endDate}`;
  };

  const getCompanyLogo = (organizationName) => {
    if (!organizationName) return null;
    const firstLetter = organizationName.charAt(0).toUpperCase();
    return (
      <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
        {firstLetter}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading experiences...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Experience</h2>
          <p className="text-gray-600 text-lg">
            Showcase your accomplishments and get up to 2X as many profile views and connections
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setEditingExperience(null);
            setShowModal(true);
          }}
          disabled={submitting}
          className="flex items-center gap-2 px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-full hover:bg-blue-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus size={20} /> Add experience
        </button>
      </div>

      {/* Experience List */}
      <div className="space-y-4">
        {experiences.length === 0 ? (
          <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg">
            <Briefcase size={48} className="mx-auto mb-4 text-gray-300" />
            <p className="text-lg mb-2 font-medium">No experience added yet</p>
            <p className="mb-4">Add your work experience to showcase your professional journey</p>
            <button
              onClick={() => {
                resetForm();
                setEditingExperience(null);
                setShowModal(true);
              }}
              disabled={submitting}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus size={16} /> Add your first experience
            </button>
          </div>
        ) : (
          experiences.map((experience, index) => (
            <div key={experience.experienceId || experience.id || index} className="flex items-start gap-4 p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors bg-white">
              {getCompanyLogo(experience.organization)}

              <div className="flex-1">
                <h4 className="text-xl font-semibold text-gray-900 mb-1">
                  {experience.jobTitle || "Job Title Not Specified"}
                </h4>
                <p className="text-lg text-gray-700 mb-2">
                  {experience.organization || "Organization Not Specified"}
                </p>
                <div className="flex items-center gap-4 text-gray-600 mb-3 flex-wrap">
                  <div className="flex items-center gap-1">
                    <Calendar size={16} />
                    <span className="text-sm">{formatDateRange(experience)}</span>
                  </div>
                  {experience.location && (
                    <div className="flex items-center gap-1">
                      <MapPin size={16} />
                      <span className="text-sm">{experience.location}</span>
                    </div>
                  )}
                </div>
                {experience.description && (
                  <p className="text-gray-700 leading-relaxed">
                    {experience.description}
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(experience)}
                  className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                  title="Edit experience"
                  disabled={submitting}
                >
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDelete(experience.experienceId || experience.id)}
                  className="p-2 rounded-full hover:bg-red-100 transition-colors"
                  title="Delete experience"
                  disabled={submitting}
                >
                  <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Form Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-semibold">
                {editingExperience ? "Edit Experience" : "Add Experience"}
              </h3>
              <button 
                onClick={() => {
                  setShowModal(false);
                  setEditingExperience(null);
                  resetForm();
                }}
                disabled={submitting}
                className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
              >
                <X size={24} />
              </button>
            </div>

            {/* Scrollable Content */}
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
                  placeholder="Ex: Software Engineer"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  placeholder="Ex: Microsoft"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  placeholder="Ex: New York, NY"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={submitting}
                />
              </div>

              {/* Current Role Checkbox */}
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  name="currentRole"
                  checked={formData.currentRole}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  disabled={submitting}
                />
                <label className="ml-2 block text-sm text-gray-700">
                  I am currently working in this role
                </label>
              </div>

              {/* Start Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Month
                  </label>
                  <select
                    name="startMonth"
                    value={formData.startMonth}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    Start Year
                  </label>
                  <select
                    name="startYear"
                    value={formData.startYear}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

              {/* End Date (only if not current role) */}
              {!formData.currentRole && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Month
                    </label>
                    <select
                      name="endMonth"
                      value={formData.endMonth}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      End Year
                    </label>
                    <select
                      name="endYear"
                      value={formData.endYear}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  placeholder="Describe your role and responsibilities..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                  disabled={submitting}
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 p-6 border-t bg-gray-50">
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingExperience(null);
                  resetForm();
                }}
                disabled={submitting}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting || !formData.jobTitle.trim() || !formData.organization.trim()}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Saving...' : (editingExperience ? 'Update' : 'Save')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Experience;