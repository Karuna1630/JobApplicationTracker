 import React, { useState, useEffect } from "react";
import axiosInstance from "../Utils/axiosInstance";
import { getUserIdFromToken} from "../Utils/jwtUtils";
import { toast } from "react-toastify";

const EditCompanyModal = ({ isOpen, onClose, companyInfo, companyId, onUpdateSuccess }) => {
  const [formData, setFormData] = useState({
    companyName: companyInfo.companyName || "",
    description: companyInfo.description || "",
    location: companyInfo.location || "",
    email: companyInfo.email || "",
    phoneNumber: companyInfo.phone || "",
    firstName: companyInfo.firstName || "",
    lastName: companyInfo.lastName || "",
    websiteUrl: companyInfo.websiteUrl || "",
    companyLogo: companyInfo.companyLogo || "",
  });

  const [isLoading, setIsLoading] = useState(false);


  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted"); // Debug log
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        setIsLoading(false);
        return;
      }

      const userId = getUserIdFromToken(token);
      
      if (!userId) {
        toast.error("Invalid token. Please login again.");
        setIsLoading(false);
        return;
      }

      console.log("User ID from token:", userId); // Debug log

      const payload = {
        userId: userId, // Include userId from JWT
        companyId: companyId, // Make sure companyId is included for updates
        companyName: formData.companyName || null,
        description: formData.description || null,
        location: formData.location || null,
        contactEmail: formData.email || null, // Changed from 'email' to 'contactEmail' to match your API
        phoneNumber: formData.phoneNumber || null,
        firstName: formData.firstName || null,
        lastName: formData.lastName || null,
        websiteUrl: formData.websiteUrl || null,
      };

      // Remove null/empty values to only update fields that have data
      Object.keys(payload).forEach(key => {
        if (payload[key] === null || payload[key] === "" || payload[key] === undefined) {
          delete payload[key];
        }
      });

      // Always keep companyId and userId for updates
      if (companyId) {
        payload.companyId = companyId;
      }
      if (userId) {
        payload.userId = userId;
      }

      console.log("Submitting payload:", payload); // Debug log

      const response = await axiosInstance.post("/submitcompany", payload);
      console.log("Submit response:", response.data); // Debug log

      if (response.data.isSuccess) {
        toast.success("Company profile updated successfully!");
        onUpdateSuccess(formData);
        onClose();
      } else {
        toast.error(response.data.message || "Update failed");
      }
    } catch (error) {
      console.error("Error updating company profile:", error);
      
      if (error.response) {
        console.error("Error data:", error.response.data);
        
        if (error.response.data.errors) {
          Object.entries(error.response.data.errors).forEach(([field, messages]) => {
            console.error(`Field: ${field}, Errors: ${messages.join(", ")}`);
          });
        }
        
        toast.error(error.response.data.message || "Failed to update company profile");
      } else {
        console.error("Error:", error.message);
        toast.error("Something went wrong while updating.");
      }
    } finally {
      setIsLoading(false);
    }
  };



  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white w-full max-w-2xl rounded-lg shadow-lg p-6 relative max-h-[95vh] overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-4">Edit Company Profile</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Company Name */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Company Name
            </label>
            <input
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Company Name"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Company Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Describe your company..."
            />
          </div>

          {/* First Name */}
          <div>
            <label className="block text-sm font-medium mb-1">
              First Name
            </label>
            <input
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="First name"
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Last Name
            </label>
            <input
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Last name"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="company@example.com"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium mb-1">Phone Number</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="+1 (555) 123-4567"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <input
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="City, State, Country"
            />
          </div>

          {/* Website URL */}
          <div>
            <label className="block text-sm font-medium mb-1">Website URL</label>
            <input
              type="url"
              name="websiteUrl"
              value={formData.websiteUrl}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://yourcompany.com"
            />
          </div>



          {/* Buttons */}
          <div className="flex justify-end mt-6 gap-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 rounded-md border text-gray-700 hover:bg-gray-100 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </button>
          </div>
        </form>

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

export default EditCompanyModal;