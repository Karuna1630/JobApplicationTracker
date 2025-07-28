import React, { useState, useEffect } from "react";
import axiosInstance from "../Utils/axiosInstance";
import { FiEdit, FiCamera } from "react-icons/fi";
import BackgroundImage from "../assets/background.avif";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { getUserIdFromToken } from "../Utils/jwtUtils";
import EditProfile from "../Pages/EditProfile";
import Uploadresume from "../Pages/Uploadresume";
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
  const [selectedImage, setSelectedImage] = useState(null);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = getUserIdFromToken(token);
      if (!userId || userId === 0) {
        setErrorMsg("User ID missing or invalid. Please log in again.");
        return;
      }
      const response = await axiosInstance.get(`/Profile/${userId}`);
      const profileData = response.data;

      if (profileData && profileData.jobSeekerProfile) {
        const jobSeeker = profileData.jobSeekerProfile;
        setUserInfo({
          firstName: jobSeeker.firstName || "",
          lastName: jobSeeker.lastName || "",
          email: profileData.email || "",
          phone: jobSeeker.phoneNumber || "Not Provided",
          location: jobSeeker.location || "Not Specified",
          bio: jobSeeker.bio || "No bio available",
          profileImageUrl: jobSeeker.profileImageUrl || "",
        });
      } else {
        setErrorMsg("Job Seeker profile not found.");
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

    const formData = new FormData();
    formData.append("ProfileImage", file);

    const token = localStorage.getItem("token");
    const userId = getUserIdFromToken(token);

    try {
      // Fixed URL structure: userId as route parameter, Bio as query parameter
      const response = await axiosInstance.post(
        `/uploadProfilePicture/${userId}?Bio=${encodeURIComponent(userInfo.bio || "")}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.isSuccess) {
        fetchProfile(); // Refresh profile to get updated image
        alert("Profile picture updated successfully!");
      }
    } catch (error) {
      console.error("Profile image upload failed:", error);
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
        bio: updatedData.bio,
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
          {/* Header Background */}
          <div className="h-56 bg-cover bg-center relative" style={{ backgroundImage: `url(${BackgroundImage})` }}>
            <div className="absolute top-4 right-4">
              <button onClick={() => setShowEdit(true)} className="bg-white p-2 rounded-full shadow">
                <FiEdit className="text-gray-700" />
              </button>
            </div>
          </div>

          {/* Profile Image */}
          <div className="flex justify-center -mt-20">
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
          </div>

          {/* Bio and Info */}
          <div className="pt-6 px-8 pb-4 text-center">
            <h2 className="text-3xl font-semibold text-gray-800">
              {userInfo.firstName} {userInfo.lastName}
            </h2>
            <p className="text-base text-gray-600 mt-2 max-w-3xl mx-auto">{userInfo.bio}</p>
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