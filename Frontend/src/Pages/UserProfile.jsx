import React, { useState, useEffect } from "react";
import axiosInstance from "../Utils/axiosInstance";
import { FiEdit } from "react-icons/fi";
import BackgroundImage from "../assets/background.avif";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { getUserIdFromToken } from "../Utils/jwtUtils";
import EditProfile from "../Pages/EditProfile";
import Uploadresume from "../Pages/Uploadresume";

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

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = getUserIdFromToken(token);
        if (!userId || userId === 0) {
          setErrorMsg("User ID missing or invalid. Please log in again.");
          return;
        }
        const response = await axiosInstance.get(`profile/${userId}`);
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

    fetchProfile();
  }, []);

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
          <div className="h-56 bg-cover bg-center relative" style={{ backgroundImage: `url(${BackgroundImage})` }}>
            {/* {/* <div className="absolute inset-0 bg-black opacity-40"></div> */}
            {/*<div className="absolute left-8 -bottom-16 z-40">
              <img
                src={userInfo.profileImageUrl || "https://via.placeholder.com/150"}
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-white object-cover"
              />
            </div> */}
            <div className="absolute top-4 right-4">
              <button onClick={() => setShowEdit(true)} className="bg-white p-2 rounded-full shadow">
                <FiEdit className="text-gray-700" />
              </button>
            </div>
          </div>

          <div className="pt-28 px-8 pb-4">
            <h2 className="text-3xl font-semibold text-gray-800">
              {userInfo.firstName} {userInfo.lastName}
            </h2>
            <p className="text-sm text-gray-500"></p>
            <p className="text-base text-gray-600 mt-2 max-w-3xl">{userInfo.bio}</p>
          </div>

          <div className="border-t border-gray-300 px-8 py-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Contact Information</h3>
            <ul className="grid grid-cols-3 gap-4 text-gray-600 text-lg">
              <li><strong>Email:</strong> {userInfo.email}</li>
              <li><strong>Phone:</strong> {userInfo.phone}</li>
              <li><strong>Location:</strong> {userInfo.location}</li>
            </ul>
          </div>

          <div className="border-t border-gray-300 px-8 py-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Experience Summary</h3>
            <p className="text-gray-600">
              Over 2 years of experience building modern, scalable, and user-centric web applications using React,
              TypeScript, and other cutting-edge technologies...
            </p>
          </div>

          <div className="border-t border-gray-300 px-8 py-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Education</h3>
            <p className="text-gray-600">Add your education history here...</p>
          </div>

          <div className="border-t border-gray-300 px-8 py-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Skills</h3>
            <p className="text-sm text-gray-500 mb-1">Soft Skills</p>
            <p className="text-gray-600">No skills added yet.</p>
            <p className="text-sm text-gray-500 mt-4 mb-1">Technical Skills</p>
            <p className="text-gray-600">No skills added yet.</p>
            <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">Add Skills</button>
          </div>

          {/* <div className="border-t border-gray-300 px-8 py-6">
            <Uploadresume/>
          </div> */}
        </div>
      </div>
      <Footer />
      {showEdit && <EditProfile userData={userInfo} onClose={() => setShowEdit(false)} />}
    </>
  );
};

export default UserProfile;
