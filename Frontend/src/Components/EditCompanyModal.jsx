import React, { useState, useEffect } from "react";
import axiosInstance from "../Utils/axiosInstance";
import { getUserIdFromToken } from "../Utils/jwtUtils";
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
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(companyInfo.companyLogo || "");
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Please select a valid image file (JPEG, PNG, GIF, or WebP)");
        return;
      }

      // Validate file size (e.g., max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        toast.error("File size must be less than 5MB");
        return;
      }

      setLogoFile(file);
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setLogoPreview(previewUrl);
    }
  };

  const uploadLogo = async () => {
    if (!logoFile || !companyId) {
      return null;
    }

    setIsUploadingLogo(true);
    
    try {
      const formData = new FormData();
      formData.append('logo', logoFile);

      const response = await axiosInstance.post(
        `/uploadcompanylogo/${companyId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.isSuccess) {
        toast.success("Logo uploaded successfully!");
        return response.data.logoUrl || response.data.data?.logoUrl;
      } else {
        toast.error(response.data.message || "Logo upload failed");
        return null;
      }
    } catch (error) {
      console.error("Error uploading logo:", error);
      
      if (error.response) {
        toast.error(error.response.data.message || "Failed to upload logo");
      } else {
        toast.error("Something went wrong while uploading logo");
      }
      return null;
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      const userId = Number(getUserIdFromToken(token));

      let logoUrl = formData.companyLogo;

      // Upload logo first if a new file is selected
      if (logoFile) {
        const uploadedLogoUrl = await uploadLogo();
        if (uploadedLogoUrl) {
          logoUrl = uploadedLogoUrl;
        } else {
          // If logo upload fails, don't proceed with form submission
          setIsLoading(false);
          return;
        }
      }

      const payload = {
        userId,
        companyId: companyId,
        companyName: formData.companyName || null,
        description: formData.description || null,
        location: formData.location || null,
        email: formData.email || null,
        phoneNumber: formData.phoneNumber || null,
        firstName: formData.firstName || null,
        lastName: formData.lastName || null,
        websiteUrl: formData.websiteUrl || null,
        companyLogo: logoUrl || null,
      };

      // Remove null/empty values to only update fields that have data
      Object.keys(payload).forEach(key => {
        if (payload[key] === null || payload[key] === "" || payload[key] === undefined) {
          delete payload[key];
        }
      });

      console.log("Submitting payload:", payload);

      const response = await axiosInstance.post("/submitcompany", payload);

      if (response.data.isSuccess) {
        toast.success("Company profile updated successfully!");
        onUpdateSuccess({ ...formData, companyLogo: logoUrl });
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

  const removeLogoPreview = () => {
    setLogoFile(null);
    setLogoPreview("");
    setFormData(prev => ({ ...prev, companyLogo: "" }));
    
    // Reset file input
    const fileInput = document.getElementById('logoFileInput');
    if (fileInput) {
      fileInput.value = '';
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

          {/* Company Logo Upload */}
          <div>
            <label className="block text-sm font-medium mb-1">Company Logo</label>
            
            {/* Current Logo Preview */}
            {logoPreview && (
              <div className="mb-3">
                <div className="relative inline-block">
                  <img
                    src={logoPreview}
                    alt="Company Logo Preview"
                    className="w-24 h-24 object-cover rounded-lg border border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={removeLogoPreview}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {logoFile ? 'New logo selected' : 'Current logo'}
                </p>
              </div>
            )}

            {/* File Input */}
            <input
              id="logoFileInput"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <p className="text-xs text-gray-500 mt-1">
              Supported formats: JPEG, PNG, GIF, WebP. Max size: 5MB
            </p>
          </div>



          {/* Buttons */}
          <div className="flex justify-end mt-6 gap-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading || isUploadingLogo}
              className="px-4 py-2 rounded-md border text-gray-700 hover:bg-gray-100 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || isUploadingLogo}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading || isUploadingLogo ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {isUploadingLogo ? "Uploading logo..." : "Saving..."}
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