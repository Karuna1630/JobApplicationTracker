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
import { toast } from "react-toastify";

const UserProfile = () => {
  const [userInfo, setUserInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
    profileImageUrl: "",
    headline: "",
    linkedinProfile: "",
    portfolioUrl: "",
    resumeUrl: "",
    dateOfBirth: "",
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
          headline: profileData.headline || "",
          linkedinProfile: profileData.linkedinProfile || "",
          portfolioUrl: profileData.portfolioUrl || "",
          resumeUrl: profileData.resumeUrl || "",
          dateOfBirth: profileData.dateOfBirth || "",
        });
        localStorage.setItem("profileImageUrl", profileData.profilePicture || "");
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
        toast.success("Profile picture uploaded successfully!");
      } else {
        toast.error("Failed to upload image.");
      }
    } catch (error) {
      console.error("Upload failed:", error.response?.data || error.message);
      toast.error("Image upload failed.");
    }
  };

  // Updated handleSaveProfile to refresh data from server after successful update
  const handleSaveProfile = async (updatedData) => {
    try {
      // Since EditProfile component already handles the API call and shows success message,
      // we just need to refresh the profile data from the server
      await fetchProfile();
      
      // Close the edit modal
      setShowEdit(false);
      
      // The EditProfile component already shows the success toast
    } catch (error) {
      console.error("Profile refresh error:", error);
      toast.error("Profile updated but failed to refresh display. Please reload the page.");
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
              <button 
                onClick={() => setShowEdit(true)} 
                className="bg-white p-2 rounded-full shadow hover:bg-gray-50 transition-colors"
                title="Edit Profile"
              >
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
                <label className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full cursor-pointer hover:bg-blue-600 transition-colors">
                  <FiCamera className="text-white w-4 h-4" />
                  <input type="file" accept="image/*" onChange={handleProfileImageChange} className="hidden" />
                </label>
              </div>

              {/* Name and Headline */}
              <div>
                <h2 className="text-2xl font-semibold text-gray-800">
                  {userInfo.firstName} {userInfo.lastName}
                </h2>
                {userInfo.headline && (
                  <p className="text-lg text-blue-600 font-medium mt-1">{userInfo.headline}</p>
                )}
              </div>

              {/* Bio */}
              <p className="text-base text-gray-600 max-w-3xl leading-relaxed">{userInfo.bio}</p>

              {/* Social Links */}
              {(userInfo.linkedinProfile || userInfo.portfolioUrl || userInfo.resumeUrl) && (
                <div className="flex gap-4 mt-2">
                  {userInfo.linkedinProfile && (
                    <a 
                      href={userInfo.linkedinProfile} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      LinkedIn
                    </a>
                  )}
                  {userInfo.portfolioUrl && (
                    <a 
                      href={userInfo.portfolioUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      Portfolio
                    </a>
                  )}
                  {userInfo.resumeUrl && (
                    <a 
                      href={userInfo.resumeUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      Resume
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Contact Info */}
          <div className="border-t border-gray-300 px-8 py-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 text-gray-600">
              <div className="flex flex-col">
                <span className="font-medium text-gray-800">Email</span>
                <span>{userInfo.email}</span>
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-gray-800">Phone</span>
                <span>{userInfo.phone}</span>
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-gray-800">Location</span>
                <span>{userInfo.location}</span>
              </div>
              {userInfo.dateOfBirth && (
                <div className="flex flex-col">
                  <span className="font-medium text-gray-800">Date of Birth</span>
                  <span>{new Date(userInfo.dateOfBirth).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>

          {/* Experience */}
          <div className="border-t border-gray-300 px-8 py-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Experience</h3>
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
          userData={{
            firstName: userInfo.firstName,
            lastName: userInfo.lastName,
            email: userInfo.email,
            phoneNumber: userInfo.phone,
            location: userInfo.location,
            bio: userInfo.bio,
            headline: userInfo.headline,
            linkedinProfile: userInfo.linkedinProfile,
            portfolioUrl: userInfo.portfolioUrl,
            resumeUrl: userInfo.resumeUrl,
            dateOfBirth: userInfo.dateOfBirth,
            profilePicture: userInfo.profileImageUrl,
          }}
          onSave={handleSaveProfile}
          onClose={() => setShowEdit(false)}
        />
      )}
    </>
  );
};

export default UserProfile;