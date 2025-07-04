import React, { useState } from "react";

const Uploadresume = ({ onSave, onClose }) => {
  const [resume, setResume] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    careerObjective:"",
    technicalSkills: "",
    softSkills: "",
    certifications: "",
    projects: "",
    education:"",
    reference: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setResume(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (resume) {
      onSave({ resume, ...formData });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white w-full max-w-3xl rounded-lg shadow-lg p-6 relative max-h-[95vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>

          {/* Resume Summary Box */}
          <div className="bg-white border border-gray-200 rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Resume Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">

              {/* Name */}
              <div className="col-span-1">
                <label><strong>Name:</strong></label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-1 w-full p-2 border rounded"
                />
              </div>

              {/* Email */}
              <div className="col-span-1">
                <label><strong>Email:</strong></label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="mt-1 w-full p-2 border rounded"
                />
              </div>

              {/* Phone */}
              <div className="col-span-1">
                <label><strong>Phone:</strong></label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="mt-1 w-full p-2 border rounded"
                />
              </div>

              {/* Address */}
              <div className="col-span-1">
                <label><strong>Address:</strong></label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="mt-1 w-full p-2 border rounded"
                />
              </div>

              {/* Career Objective */}
              <div className="col-span-2">
                <label><strong>Career Objective:</strong></label>
                <textarea
                  name="careerObjective"
                  value={formData.careerObjective}
                  onChange={handleInputChange}
                  rows={3}
                  className="mt-1 w-full p-2 border rounded"
                />
              </div>

              {/* Technical Skills */}
              <div className="col-span-2">
                <label><strong>Technical Skills:</strong></label>
                <input
                  type="text"
                  name="technicalSkills"
                  value={formData.technicalSkills}
                  onChange={handleInputChange}
                  className="mt-1 w-full p-2 border rounded"
                />
              </div>

              {/* Soft Skills */}
              <div className="col-span-2">
                <label><strong>Soft Skills:</strong></label>
                <input
                  type="text"
                  name="softSkills"
                  value={formData.softSkills}
                  onChange={handleInputChange}
                  className="mt-1 w-full p-2 border rounded"
                />
              </div>

              {/* Certifications */}
              <div className="col-span-2">
                <label><strong>Certifications:</strong></label>
                <textarea
                  name="certifications"
                  value={formData.certifications}
                  onChange={handleInputChange}
                  rows={4}
                  className="mt-1 w-full p-2 border rounded"
                />
              </div>

              {/* Projects */}
              <div className="col-span-2">
                <label><strong>Projects:</strong></label>
                <textarea
                  name="projects"
                  value={formData.projects}
                  onChange={handleInputChange}
                  rows={4}
                  className="mt-1 w-full p-2 border rounded"
                />
              </div>

              {/* Education */}
              <div className="col-span-2">
                <label><strong>Education:</strong></label>
                <textarea
                  name="education"
                  value={formData.education}
                  onChange={handleInputChange}
                  rows={3}
                  className="mt-1 w-full p-2 border rounded"
                />
              </div>

              {/* Reference */}
              <div className="col-span-2">
                <label><strong>Reference:</strong></label>
                <textarea
                  name="reference"
                  value={formData.reference}
                  onChange={handleInputChange}
                  rows={2}
                  className="mt-1 w-full p-2 border rounded"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end mt-6 gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md border text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
              disabled={!resume}
            >
              Save
            </button>
          </div>
        </form>

        {/* Close icon */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-2xl text-gray-400 hover:text-gray-600"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default Uploadresume;
