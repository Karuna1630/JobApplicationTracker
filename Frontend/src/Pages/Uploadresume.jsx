import React, { useState, useEffect } from "react";

const Uploadresume = ({ onSave, onClose }) => {
  const [resume, setResume] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    careerObjective: "",
    technicalSkills: "",
    softSkills: "",
    certifications: "",
    projects: "",
    education: "",
    reference: "",
  });

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-300"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-white rounded-xl shadow-xl overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
            Upload Resume & Personal Info
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Inputs */}
              {[
                { label: "Name", name: "name", type: "text" },
                { label: "Email", name: "email", type: "email" },
                { label: "Phone", name: "phone", type: "text" },
                { label: "Address", name: "address", type: "text" },
              ].map(({ label, name, type }) => (
                <div key={name}>
                  <label className="block text-sm font-medium text-gray-700">
                    {label}
                  </label>
                  <input
                    type={type}
                    name={name}
                    value={formData[name]}
                    onChange={handleInputChange}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
                  />
                </div>
              ))}
            </div>

            {/* Text Areas */}
            {[
              { label: "Career Objective", name: "careerObjective", rows: 3 },
              { label: "Technical Skills", name: "technicalSkills", rows: 2 },
              { label: "Soft Skills", name: "softSkills", rows: 2 },
              { label: "Certifications", name: "certifications", rows: 3 },
              { label: "Projects", name: "projects", rows: 3 },
              { label: "Education", name: "education", rows: 3 },
              { label: "Reference", name: "reference", rows: 2 },
            ].map(({ label, name, rows }) => (
              <div key={name}>
                <label className="block text-sm font-medium text-gray-700">
                  {label}
                </label>
                <textarea
                  name={name}
                  rows={rows}
                  value={formData[name]}
                  onChange={handleInputChange}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
                />
              </div>
            ))}

            {/* Resume File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Upload Resume (PDF, DOCX)
              </label>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="mt-1 w-full"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!resume}
                className="px-5 py-3 bg-blue-700 text-white rounded hover:bg-blue-800"
              >
                Save
              </button>
            </div>
          </form>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-5 text-gray-500 text-2xl hover:text-red-500"
          aria-label="Close"
        >
          
        </button>
      </div>
    </div>
  );
};

export default Uploadresume;
