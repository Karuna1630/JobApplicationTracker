import React, { useState, useEffect } from "react";
import axiosInstance from "../Utils/axiosInstance";
import { FiEdit, FiCamera } from "react-icons/fi";
import BackgroundImage from "../assets/background.avif";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { getUserIdFromToken } from "../Utils/jwtUtils";
import EditProfile from "../Pages/EditProfile";
import Education from "../Components/Education";
import Experience from "../Components/Experience";

const UserProfile = () => {
  const [userInfo, setUserInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
    profileImageUrl: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [showEdit, setShowEdit] = useState(false);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = getUserIdFromToken(token);
      if (!userId || userId === 0) {
        setErrorMsg("User ID missing or invalid. Please log in again.");
        return;
      }

      const response = await axiosInstance.get(`/profile/${userId}`);
      const profileData = response.data;

      if (profileData) {
  setUserInfo({
    firstName: profileData.firstName || "",
    lastName: profileData.lastName || "",
    email: profileData.email || "",
    phone: profileData.phoneNumber || "Not Provided",
    location: profileData.location || "Not Specified",
    bio: profileData.bio || "No bio available",
    profileImageUrl: profileData.profilePicture || "",
  });


      } else {
        setErrorMsg("User profile not found.");
      }
    } catch (error) {
      setErrorMsg("Failed to fetch user profile.");
      console.error("Profile Fetch Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleProfileImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const token = localStorage.getItem("token");
    const userId = getUserIdFromToken(token);

    const formData = new FormData();
    formData.append("ProfileImage", file);
    formData.append("Bio", userInfo.bio || "");

    try {
      const response = await axiosInstance.post(
        `/uploadProfilePicture/${userId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

    if (response.data.isSuccess) {
  // Refresh profile data
  await fetchProfile();
  alert("Profile picture uploaded successfully!");
} else {
  alert("Failed to upload image.");


      }
    } catch (error) {
      console.error("Upload failed:", error.response?.data || error.message);
      alert("Image upload failed.");
    }
  };

  const handleSaveProfile = async (updatedData) => {
    try {
      const token = localStorage.getItem("token");
      const userId = getUserIdFromToken(token);

      const payload = {
        firstName: updatedData.firstName,
        lastName: updatedData.lastName,
        email: updatedData.email,
        phoneNumber: updatedData.phone,
        location: updatedData.location,
        education: updatedData.education,
      };

      await axiosInstance.put(`/profile/${userId}`, payload);

      setUserInfo((prev) => ({
        ...prev,
        ...updatedData,
      }));

      setShowEdit(false);
    } catch (error) {
      console.error("Profile update error:", error.response?.data || error.message);
      alert("Failed to update profile");
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen text-lg">Loading profile...</div>;
  }

  if (errorMsg) {
    return <div className="flex justify-center items-center min-h-screen text-red-600 text-lg">{errorMsg}</div>;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white flex justify-center p-6">
        <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg overflow-hidden relative">
          {/* Header */}
          <div className="h-56 bg-cover bg-center relative" style={{ backgroundImage: `url(${BackgroundImage})` }}>
            <div className="absolute top-4 right-4">
              <button onClick={() => setShowEdit(true)} className="bg-white p-2 rounded-full shadow">
                <FiEdit className="text-gray-700" />
              </button>
            </div>
          </div>
{/* Profile Section: Left-aligned image, name, and bio below */}
<div className="px-8 pt-6 pb-4">
  <div className="flex flex-col items-start gap-4">
    {/* Profile Image */}
    <div className="relative">
      <img
        src={userInfo.profileImageUrl || "https://via.placeholder.com/150"}
        alt="Profile"
        className="w-36 h-36 rounded-full border-4 border-white shadow-md object-cover"
      />
      <label className="absolute bottom-0 right-0 bg-blue-500 p-1 rounded-full cursor-pointer">
        <FiCamera className="text-white" />
        <input type="file" accept="image/*" onChange={handleProfileImageChange} className="hidden" />
      </label>
    </div>

    {/* Name */}
    <h2 className="text-2xl font-semibold text-gray-800">
      {userInfo.firstName} {userInfo.lastName}
    </h2>

    {/* Bio */}
    <p className="text-base text-gray-600 max-w-3xl">{userInfo.bio}</p>
  </div>
</div>



          {/* Contact Info */}
          <div className="border-t border-gray-300 px-8 py-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Contact Information</h3>
            <ul className="grid grid-cols-3 gap-4 text-gray-600 text-lg">
              <li><strong>Email:</strong> {userInfo.email}</li>
              <li><strong>Phone:</strong> {userInfo.phone}</li>
              <li><strong>Location:</strong> {userInfo.location}</li>
            </ul>
          </div>

          {/* Experience */}
          <div className="border-t border-gray-300 px-8 py-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Experience</h3>
            <Experience />
          </div>

          {/* Education */}
          <div className="border-t border-gray-300 px-8 py-6">
            <Education />
          </div>
        </div>
      </div>

      <Footer />

      {showEdit && (
        <EditProfile
          userData={userInfo}
          onSave={handleSaveProfile}
          onClose={() => setShowEdit(false)}
        />
      )}
    </>
  );
};

export default UserProfile;
