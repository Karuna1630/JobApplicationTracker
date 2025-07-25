import React, { useState, useRef, useEffect } from 'react';
import { 
  IoClose, 
  IoAdd, 
  IoBriefcase, 
  IoCalendar, 
  IoLocationOutline 
} from 'react-icons/io5';

const Experience = () => {
  const [experiences, setExperiences] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingExperience, setEditingExperience] = useState(null);
  const [skillInput, setSkillInput] = useState('');
  const [showSkillSuggestions, setShowSkillSuggestions] = useState(false);
  const skillInputRef = useRef(null);

  // Predefined skills for suggestions
  const predefinedSkills = [
    'Communication', 'Leadership', 'Project Management', 'JavaScript', 'React', 'Node.js',
    'Python', 'Data Analysis', 'Marketing', 'Sales', 'Customer Service', 'Team Management',
    'Strategic Planning', 'Problem Solving', 'Creative Writing', 'Social Media Marketing',
    'E-Commerce', 'Community Outreach', 'Public Speaking', 'Negotiation', 'Time Management',
    'Microsoft Office', 'Adobe Creative Suite', 'SQL', 'HTML/CSS', 'Agile Methodology',
    'Business Development', 'Content Creation', 'Digital Marketing', 'Financial Analysis',
    'Quality Assurance', 'UX/UI Design', 'Machine Learning', 'Cloud Computing', 'DevOps'
  ];

  const [formData, setFormData] = useState({
    jobTitle: '',
    organization: '',
    location: '',
    startMonth: '',
    startYear: '',
    endMonth: '',
    endYear: '',
    currentRole: false,
    description: '',
    skills: []
  });

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  const resetForm = () => {
    setFormData({
      jobTitle: '',
      organization: '',
      location: '',
      startMonth: '',
      startYear: '',
      endMonth: '',
      endYear: '',
      currentRole: false,
      description: '',
      skills: []
    });
    setSkillInput('');
    setEditingExperience(null);
  };

  const openModal = (experience = null) => {
    if (experience) {
      setFormData(experience);
      setEditingExperience(experience.id);
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
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const filterSkillSuggestions = () => {
    if (!skillInput.trim()) return [];
    
    const input = skillInput.toLowerCase();
    const existingSkills = formData.skills.map(skill => skill.toLowerCase());
    
    return predefinedSkills.filter(skill => 
      skill.toLowerCase().includes(input) && 
      !existingSkills.includes(skill.toLowerCase())
    ).slice(0, 8);
  };

  const handleSkillInputChange = (e) => {
    const value = e.target.value;
    setSkillInput(value);
    setShowSkillSuggestions(value.length > 0);
  };

  const addSkill = (skillName) => {
    if (skillName.trim() && !formData.skills.some(skill => 
      skill.toLowerCase() === skillName.toLowerCase()
    )) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skillName.trim()]
      }));
    }
    setSkillInput('');
    setShowSkillSuggestions(false);
    skillInputRef.current?.focus();
  };

  const removeSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleSkillKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (skillInput.trim()) {
        addSkill(skillInput);
      }
    }
  };

  const handleSubmit = () => {
    if (!formData.jobTitle.trim() || !formData.organization.trim()) {
      alert('Please fill in the required fields (Job Title and Organization)');
      return;
    }

    const experienceData = {
      ...formData,
      id: editingExperience || Date.now()
    };

    if (editingExperience) {
      setExperiences(prev => prev.map(exp => 
        exp.id === editingExperience ? experienceData : exp
      ));
    } else {
      setExperiences(prev => [...prev, experienceData]);
    }

    closeModal();
  };

  const deleteExperience = (id) => {
    setExperiences(prev => prev.filter(exp => exp.id !== id));
  };

  const formatDateRange = (experience) => {
    const startDate = `${experience.startMonth} ${experience.startYear}`;
    const endDate = experience.currentRole ? 'Present' : 
      `${experience.endMonth} ${experience.endYear}`;
    return `${startDate} - ${endDate}`;
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (skillInputRef.current && !skillInputRef.current.contains(event.target)) {
        setShowSkillSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div>
      {/* Experience Section Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-gray-600 text-sm">
            Showcase your accomplishments and get up to 2X as many profile views and connections
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-full hover:bg-blue-50 transition-colors font-medium"
        >
          <IoAdd size={20} />
          Add experience
        </button>
      </div>

      {/* Experience List */}
      <div className="space-y-4">
        {experiences.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <IoBriefcase size={48} className="mx-auto mb-4 text-gray-300" />
            <p className="text-lg mb-2">No experience added yet</p>
            <p>Add your work experience to showcase your professional journey</p>
          </div>
        ) : (
          experiences.map((experience) => (
            <div key={experience.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="text-xl font-semibold text-gray-900 mb-1">
                    {experience.jobTitle}
                  </h4>
                  <p className="text-lg text-gray-700 mb-2">{experience.organization}</p>
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
                    <p className="text-gray-700 mb-3">{experience.description}</p>
                  )}
                  {experience.skills.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-900 mb-2">Skills:</p>
                      <div className="flex flex-wrap gap-2">
                        {experience.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => openModal(experience)}
                    className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteExperience(experience.id)}
                    className="px-3 py-1 text-red-600 hover:bg-red-50 rounded transition-colors"
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
    <div className="bg-white rounded-lg w-full max-w-2xl overflow-visible relative">


            <div>
              <div className="flex justify-between items-center p-6 border-b">
                <h3 className="text-xl font-semibold">
                  {editingExperience ? 'Edit Experience' : 'Add Experience'}
                </h3>
                <button
                  type="button"
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <IoClose size={24} />
                </button>
              </div>

              <div className="p-6 space-y-4">
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
                  />
                  <label className="ml-2 text-sm text-gray-700">
                    I am currently working in this role
                  </label>
                </div>

                {/* Start Date */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Month
                    </label>
                    <select
                      name="startMonth"
                      value={formData.startMonth}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Month</option>
                      {months.map((month) => (
                        <option key={month} value={month}>{month}</option>
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Year</option>
                      {years.map((year) => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* End Date */}
                {!formData.currentRole && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        End Month
                      </label>
                      <select
                        name="endMonth"
                        value={formData.endMonth}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Month</option>
                        {months.map((month) => (
                          <option key={month} value={month}>{month}</option>
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Year</option>
                        {years.map((year) => (
                          <option key={year} value={year}>{year}</option>
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
                  />
                </div>

                {/* Skills Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Skills
                  </label>
                  <p className="text-sm text-gray-600 mb-3">
                    We recommend adding your top 5 used in this role. They'll also appear in your Skills section.
                  </p>
                  
                  {/* Skills Input */}
                  <div className="relative" ref={skillInputRef}>
                    <input
                      type="text"
                      value={skillInput}
                      onChange={handleSkillInputChange}
                      onKeyPress={handleSkillKeyPress}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Type to add skills..."
                    />
                    
                    {/* Skill Suggestions */}
                    {showSkillSuggestions && (
                     <div className="absolute z-[999] w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">

                        {filterSkillSuggestions().map((skill, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => addSkill(skill)}
                            className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                          >
                            {skill}
                          </button>
                        ))}
                        {skillInput.trim() && !predefinedSkills.some(skill => 
                          skill.toLowerCase() === skillInput.toLowerCase()
                        ) && (
                          <button
                            type="button"
                            onClick={() => addSkill(skillInput)}
                            className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none border-t border-gray-200"
                          >
                            <span className="text-blue-600">Add "{skillInput}"</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Selected Skills */}
                  {formData.skills.length > 0 && (
                    <div className="mt-3">
                      <div className="flex flex-wrap gap-2">
                        {formData.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                          >
                            {skill}
                            <button
                              type="button"
                              onClick={() => removeSkill(skill)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <IoClose size={16} />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 p-6 border-t">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {editingExperience ? 'Update' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Experience;