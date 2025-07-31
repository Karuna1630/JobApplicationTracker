import React, { useState } from "react";
import axiosInstance from "../Utils/axiosInstance";
import { getUserIdFromToken } from "../Utils/jwtUtils";
import { toast } from "react-toastify";

const EditProfile = ({ userData, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    firstName: userData?.firstName || "",
    lastName: userData?.lastName || "",
 
    phoneNumber: userData?.phone || "", 
    email: userData?.email || "",
    location: userData?.location || "",
    companyId: userData?.CompanyId,
    passwordHash:userData.PasswordHash,
     companyId:userData.companyId,
      userType:userData.UserType,
       createdAt: "",
        updatedAt:"",
  
    
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

 
const handleSubmit = async (e) => {
  e.preventDefault();

  const token = localStorage.getItem("token");
  const userId = Number(getUserIdFromToken(token));

  const payload = {
    usersDto: {
      userId,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      location: formData.location,
      education: formData.education || "",
      passwordHash: formData.passwordHash || "",
      companyId: formData.companyId ? Number(formData.companyId) : null,
      userType: Number(formData.userType) || 0,
      profileImage: formData.profileImage || "",
    }
  };

  console.log("Submitting payload:", payload);

  try {
    const response = await axiosInstance.post("/submituser", payload);

    if (response.data.isSuccess) {
      toast.success("Profile updated successfully");
      onSave(formData);
      onClose();
    } else {
      toast.error(response.data.message || "Update failed");
    }
  } catch (error) {
    if (error.response) {
      console.error("Error data:", error.response.data);
      if (error.response.data.errors) {
        Object.entries(error.response.data.errors).forEach(([field, messages]) => {
          console.error(`Field: ${field}, Errors: ${messages.join(", ")}`);
        });
      }
      toast.error(error.response.data.message || "Failed to update profile");
    } else {
      console.error("Error:", error.message);
      toast.error("Something went wrong while updating.");
    }
  }



};




  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white w-full max-w-2xl rounded-lg shadow-lg p-6 relative max-h-[95vh] overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-4">Edit Intro</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* First Name */}
          <div>
            <label className="block text-sm font-medium mb-1">
              First name <span className="text-red-500">*</span>
            </label>
            <input
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              placeholder="First name"
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Last name <span className="text-red-500">*</span>
            </label>
            <input
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              placeholder="example@email.com"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              placeholder="123-456-7890"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <input
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              placeholder="City, Country"
            />
          </div>

         
          {/* <div>
            <label className="block text-sm font-medium mb-1">
              Bio <span className="text-red-500">*</span>
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              required
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-md resize-none"
              placeholder="e.g., Frontend Developer | UI/UX Designer"
            />
          </div> */}

          {/* Education */}
          <div>
            <label className="block text-sm font-medium mb-1">Education</label>
            <input
              name="education"
              value={formData.education}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              placeholder="e.g., BSc Computing - XYZ College"
            />
          </div>

          {/* Buttons */}
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
            >
              Save
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

export default EditProfile;
