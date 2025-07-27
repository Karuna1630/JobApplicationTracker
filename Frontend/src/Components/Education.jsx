import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import axiosInstance from '../Utils/axiosInstance';
import { getUserIdFromToken } from '../Utils/jwtUtils';

const Education = () => {
  const [educationList, setEducationList] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEducation, setEditingEducation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Form state
  const [formData, setFormData] = useState({
    school: '',
    degree: '',
    fieldOfStudy: '',
    startMonth: '',
    startYear: '',
    endMonth: '',
    endYear: '',
    grade: '',
    isCurrentlyStudying: false
  });

  // Months array for dropdowns
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Generate years (current year + 10 to current year - 50)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 61 }, (_, i) => currentYear + 10 - i);

  useEffect(() => {
    fetchEducation();
  }, []);

  const fetchEducation = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = getUserIdFromToken(token);
      const response = await axiosInstance.get(`/education/${userId}`);
      setEducationList(response.data || []);
    } catch (error) {
      console.error('Failed to fetch education:', error);
      setEducationList([]);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      school: '',
      degree: '',
      fieldOfStudy: '',
      startMonth: '',
      startYear: '',
      endMonth: '',
      endYear: '',
      grade: '',
      isCurrentlyStudying: false
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = getUserIdFromToken(token);

      const educationData = {
        ...formData,
        userId
      };

      if (editingEducation) {
        await axiosInstance.put(`/education/${editingEducation.id}`, educationData);
      } else {
        await axiosInstance.post('/education', educationData);
      }

      await fetchEducation();
      setShowAddForm(false);
      setEditingEducation(null);
      resetForm();
    } catch (error) {
      console.error('Failed to save education:', error);
      alert('Failed to save education. Please try again.');
    }
  };

  const handleEdit = (education) => {
    setFormData({
      school: education.school || '',
      degree: education.degree || '',
      fieldOfStudy: education.fieldOfStudy || '',
      startMonth: education.startMonth || '',
      startYear: education.startYear || '',
      endMonth: education.endMonth || '',
      endYear: education.endYear || '',
      grade: education.grade || '',
      isCurrentlyStudying: education.isCurrentlyStudying || false
    });
    setEditingEducation(education);
    setShowAddForm(true);
  };

  const handleDelete = async (educationId) => {
    if (window.confirm('Are you sure you want to delete this education entry?')) {
      try {
        await axiosInstance.delete(`/education/${educationId}`);
        await fetchEducation();
      } catch (error) {
        console.error('Failed to delete education:', error);
        alert('Failed to delete education. Please try again.');
      }
    }
  };

  const formatDateRange = (startMonth, startYear, endMonth, endYear, isCurrentlyStudying) => {
    const start = startMonth && startYear ? `${startMonth} ${startYear}` : '';
    const end = isCurrentlyStudying ? 'Present' : 
                (endMonth && endYear ? `${endMonth} ${endYear}` : '');
    
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
    // Simple logo generator based on school name
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
          educationList.map((education) => (
            <div key={education.id} className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              {getUniversityLogo(education.school)}
              
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{education.school}</h4>
                <p className="text-gray-700">
                  {education.degree}
                  {education.fieldOfStudy && `, ${education.fieldOfStudy}`}
                </p>
                <p className="text-sm text-gray-600">
                  {formatDateRange(
                    education.startMonth,
                    education.startYear,
                    education.endMonth,
                    education.endYear,
                    education.isCurrentlyStudying
                  )}
                </p>
                {education.grade && (
                  <p className="text-sm text-gray-600">Grade: {education.grade}</p>
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
                  onClick={() => handleDelete(education.id)}
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
        <div
    
            className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
            style={{ minHeight: 0 }}
          >
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    School *
                  </label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Degree
                  </label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Field of Study
                  </label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <select
                      name="startMonth"
                      value={formData.startMonth}
                      onChange={handleInputChange}
                      className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Month</option>
                      {months.map(month => (
                        <option key={month} value={month}>{month}</option>
                      ))}
                    </select>
                    <select
                      name="startYear"
                      value={formData.startYear}
                      onChange={handleInputChange}
                      className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Year</option>
                      {years.map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
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
                </div>

                {!formData.isCurrentlyStudying && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date (or expected)
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <select
                        name="endMonth"
                        value={formData.endMonth}
                        onChange={handleInputChange}
                        className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Month</option>
                        {months.map(month => (
                          <option key={month} value={month}>{month}</option>
                        ))}
                      </select>
                      <select
                        name="endYear"
                        value={formData.endYear}
                        onChange={handleInputChange}
                        className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Year</option>
                        {years.map(year => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Grade
                  </label>
                  <input
                    type="text"
                    name="grade"
                    value={formData.grade}
                    onChange={handleInputChange}
                    placeholder="Ex: 3.8/4.0"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  >
                    {editingEducation ? 'Update' : 'Save'}
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