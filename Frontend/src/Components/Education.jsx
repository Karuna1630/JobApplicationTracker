import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import axiosInstance from '../Utils/axiosInstance';
import { getUserIdFromToken } from '../Utils/jwtUtils';
import { toast } from "react-toastify";

const Education = () => {
  const [educationList, setEducationList] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEducation, setEditingEducation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    school: '',
    degree: '',
    fieldOfStudy: '',
    startDate: '',         // ISO date string, e.g. '2023-08-13'
    endDate: '',           // ISO date string
    grade: '',
    isCurrentlyStudying: false,
    description: '',
  });

  const fetchEducation = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = getUserIdFromToken(token);
      const response = await axiosInstance.get(`api/Education/user/${userId}`);
      setEducationList(response.data || []);
    } catch (error) {
      console.error('Failed to fetch education:', error);
      setEducationList([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEducation();
  }, []);

  useEffect(() => {
    if (showAddForm) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showAddForm]);

  const resetForm = () => {
    setFormData({
      school: '',
      degree: '',
      fieldOfStudy: '',
      startDate: '',
      endDate: '',
      grade: '',
      isCurrentlyStudying: false,
      description: '',
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const userId = getUserIdFromToken(token);

      const educationData = {
        userId,
        school: formData.school,
        degree: formData.degree,
        fieldOfStudy: formData.fieldOfStudy,
        startDate: formData.startDate || null,
        endDate: formData.isCurrentlyStudying ? null : (formData.endDate || null),
        isCurrentlyStudying: formData.isCurrentlyStudying,
        description: formData.description || '',
        gpa: formData.grade || null,
      };

      if (editingEducation) {
        // For editing, include the education ID (backend expects EducationId)
        educationData.educationId = editingEducation.educationId || editingEducation.id;
        
        console.log('Editing education with data:', educationData); // Debug log
        
        const educationResponse = await axiosInstance.post('/api/Education', educationData);
        toast.success('Education updated successfully!');
        await fetchEducation();
        setShowAddForm(false);
        resetForm();
        setEditingEducation(null);
      } else {
        // For adding new education
        console.log('Adding new education with data:', educationData); // Debug log
        
        const educationResponse = await axiosInstance.post('/api/Education', educationData);
        const educationId = educationResponse.data.educationId || educationResponse.data.id;

        const existingEducationIds = educationList.map(edu => edu.educationId || edu.id);
        const updatedEducationIds = [...existingEducationIds, educationId];
        const educationJsonString = JSON.stringify(updatedEducationIds);

        const response = await axiosInstance.post(`/submituser`, {
          userId,
          education: educationJsonString,
        });

        if (response.data && response.data.isSuccess) {
          toast.success('Education added successfully!');
          await fetchEducation();
          setShowAddForm(false);
          resetForm();
          setEditingEducation(null);
        } else {
          throw new Error(response.data?.message || 'Failed to update user with education');
        }
      }
    } catch (error) {
      console.error('Failed to save education:', error);
      console.error('Error details:', error.response?.data); // More detailed error logging
      toast.error(`Failed to ${editingEducation ? 'update' : 'save'} education. Please try again.`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (education) => {
    console.log('Editing education:', education); // Debug log to see the structure
    
    setFormData({
      school: education.school || '',
      degree: education.degree || '',
      fieldOfStudy: education.fieldOfStudy || '',
      startDate: education.startDate ? education.startDate.split('T')[0] : '',
      endDate: education.endDate ? education.endDate.split('T')[0] : '',
      grade: education.gpa || '',
      isCurrentlyStudying: education.isCurrentlyStudying || false,
      description: education.description || '',
    });

    setEditingEducation(education);
    setShowAddForm(true);
  };

  const handleDelete = async (educationId) => {
    if (window.confirm('Are you sure you want to delete this education entry?')) {
      try {
        await axiosInstance.delete(`/api/Education/${educationId}`);
        await fetchEducation();
        toast.success('Education deleted successfully!');
      } catch (error) {
        console.error('Failed to delete education:', error);
        toast.error('Failed to delete education. Please try again.');
      }
    }
  };

  const formatDateRange = (startDateStr, endDateStr, isCurrentlyStudying) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const format = (dateStr) => {
      if (!dateStr) return '';
      const d = new Date(dateStr);
      if (isNaN(d)) return '';
      return `${months[d.getMonth()]} ${d.getFullYear()}`;
    };

    const start = format(startDateStr);
    const end = isCurrentlyStudying ? 'Present' : format(endDateStr);

    if (start && end) {
      return `${start} - ${end}`;
    } else if (start) {
      return start;
    } else if (end) {
      return end;
    }
    return '';
  };

  const getUniversityLogo = (schoolName) => {
    if (!schoolName) return null;
    const firstLetter = schoolName.charAt(0).toUpperCase();
    return (
      <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center text-white font-bold text-lg">
        {firstLetter}
      </div>
    );
  };

  if (isLoading) {
    return <div className="text-gray-600">Loading education...</div>;
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-800">Education</h3>
        <div className="flex gap-2">
          <button
            onClick={() => {
              resetForm();
              setEditingEducation(null);
              setShowAddForm(true);
            }}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            title="Add education"
          >
            <FiPlus className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Education List */}
      <div className="space-y-4">
        {educationList.length === 0 ? (
          <p className="text-gray-600">No education entries yet. Click the + button to add one.</p>
        ) : (
          educationList.map((education, index) => (
            <div key={education.educationId || education.id || index} className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              {getUniversityLogo(education.school)}

              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{education.school}</h4>
                <p className="text-gray-700">
                  {education.degree}
                  {education.fieldOfStudy && `, ${education.fieldOfStudy}`}
                </p>
                <p className="text-sm text-gray-600">
                  {formatDateRange(
                    education.startDate,
                    education.endDate,
                    education.isCurrentlyStudying
                  )}
                </p>
                {education.gpa && (
                  <p className="text-sm text-gray-600">Grade: {education.gpa}</p>
                )}
                {education.description && (
                  <p className="text-sm text-gray-600 mt-1">{education.description}</p>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(education)}
                  className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                  title="Edit education"
                >
                  <FiEdit2 className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  onClick={() => handleDelete(education.educationId || education.id)}
                  className="p-2 rounded-full hover:bg-red-100 transition-colors"
                  title="Delete education"
                >
                  <FiTrash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-auto flex flex-col" style={{ minHeight: 0 }}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">
                  {editingEducation ? 'Edit Education' : 'Add Education'}
                </h3>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingEducation(null);
                    resetForm();
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">School *</label>
                  <input
                    type="text"
                    name="school"
                    value={formData.school}
                    onChange={handleInputChange}
                    placeholder="Ex: Boston University"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
                  <input
                    type="text"
                    name="degree"
                    value={formData.degree}
                    onChange={handleInputChange}
                    placeholder="Ex: Bachelor's"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Field of Study</label>
                  <input
                    type="text"
                    name="fieldOfStudy"
                    value={formData.fieldOfStudy}
                    onChange={handleInputChange}
                    placeholder="Ex: Business"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    name="isCurrentlyStudying"
                    checked={formData.isCurrentlyStudying}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-700">
                    I am currently studying here
                  </label>
                </div>

                {!formData.isCurrentlyStudying && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date (or expected)</label>
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
                  <input
                    type="text"
                    name="grade"
                    value={formData.grade}
                    onChange={handleInputChange}
                    placeholder="Ex: 3.8/4.0"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Optional description"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingEducation(null);
                      resetForm();
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    disabled={submitting}
                  >
                    {submitting ? 'Saving...' : (editingEducation ? 'Update' : 'Save')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Education;