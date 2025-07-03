import React, { useState } from "react";
import { FaLinkedin, FaGithub, FaTwitter, FaGlobe } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";

export default function EditProfile() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    jobTitle: "",
    department: "",
    location: "",
    bio: "",
    linkedin: "",
    twitter: "",
    github: "",
    website: "",
    username: "",
    name: "",
    photo: "",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "photo" && files.length) {
      setFormData({ ...formData, photo: URL.createObjectURL(files[0]) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-300 via-purple-100 to-pink-200 p-10">
      <div className="max-w-7xl mx-auto backdrop-blur-lg bg-white/60 rounded-3xl shadow-2xl p-8 flex flex-col lg:flex-row gap-8">
        
        {/* Left Side - Profile Preview */}
        <div className="w-full lg:w-1/3 bg-white bg-opacity-70 backdrop-blur-md rounded-2xl p-6 text-center shadow-lg flex flex-col items-center">
          <div className="relative w-32 h-32 group">
            <img
              src={formData.photo || "https://ui-avatars.com/api/?name=A+K&background=8b5cf6&color=fff&rounded=true"}
              alt="Profile"
              className="w-full h-full object-cover rounded-full border-4 border-indigo-300 shadow-lg transition-all group-hover:scale-105"
            />
            <FiEdit className="absolute bottom-0 right-0 text-indigo-600 bg-white rounded-full p-1 text-xl border shadow-sm" />
          </div>

          {/* Upload & Remove Buttons Under Image */}
          <div className="mt-4">
            <input type="file" name="photo" onChange={handleChange} className="hidden" id="photoUpload" />
            <label htmlFor="photoUpload" className="cursor-pointer bg-indigo-200 text-indigo-900 font-medium py-1.5 px-4 rounded-xl hover:bg-indigo-300 shadow transition block">
              Upload New Photo
            </label>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, photo: "" })}
              className="mt-2 text-red-600 underline hover:text-red-800 text-sm"
            >
              Remove Photo
            </button>
          </div>

          {/* Profile Info */}
          <div className="text-lg text-gray-600 mt-4">@{formData.username || "username"}</div>
          <div className="text-2xl font-bold text-gray-900">{formData.name || "Your Name"}</div>
          <div className="text-sm text-gray-700 mt-2 px-4 italic">{formData.bio || "This is your bio preview."}</div>

          {/* Social Icons */}
          <div className="flex justify-center gap-4 mt-5 text-indigo-600 text-xl">
            {formData.linkedin && <FaLinkedin />}
            {formData.twitter && <FaTwitter />}
            {formData.github && <FaGithub />}
            {formData.website && <FaGlobe />}
          </div>
        </div>

        {/* Right Side - Edit Form */}
        <div className="w-full lg:w-2/3">
          <h2 className="text-3xl font-bold text-indigo-800 mb-6">Edit Profile</h2>

          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              className="col-span-2 form-input text-lg font-medium"
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              className="form-input"
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className="form-input"
            />
            <input
              type="text"
              name="jobTitle"
              placeholder="Job Title"
              value={formData.jobTitle}
              onChange={handleChange}
              className="form-input"
            />
            <input
              type="text"
              name="department"
              placeholder="Department"
              value={formData.department}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            className="form-input w-full mt-4"
          />
          <textarea
            name="bio"
            placeholder="Bio"
            value={formData.bio}
            onChange={handleChange}
            className="form-input w-full mt-4 h-24 resize-none"
          />

          {/* Social Links */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            <input
              type="text"
              name="linkedin"
              placeholder="LinkedIn"
              value={formData.linkedin}
              onChange={handleChange}
              className="form-input"
            />
            <input
              type="text"
              name="twitter"
              placeholder="Twitter"
              value={formData.twitter}
              onChange={handleChange}
              className="form-input"
            />
            <input
              type="text"
              name="github"
              placeholder="GitHub"
              value={formData.github}
              onChange={handleChange}
              className="form-input"
            />
            <input
              type="text"
              name="website"
              placeholder="Website"
              value={formData.website}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button className="bg-gray-200 text-gray-700 px-5 py-2 rounded-xl hover:bg-gray-300 shadow-md">Cancel</button>
            <button className="bg-indigo-700 text-white px-6 py-2 rounded-xl hover:bg-indigo-800 shadow-md transition">Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  );
}
