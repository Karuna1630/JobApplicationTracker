import React, { useState, useEffect } from "react";
import axiosInstance from "../Utils/axiosInstance";
import { FiEdit } from "react-icons/fi";
import BackgroundImage from "../assets/background.avif";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { getUserIdFromToken } from "../Utils/jwtUtils";

const UserProfile = () => {
  const [userInfo, setUserInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

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
    return (
      <div className="flex justify-center items-center min-h-screen text-lg">
        Loading profile...
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-600 text-lg">
        {errorMsg}
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white flex items-center justify-center p-6">
        <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg overflow-hidden relative">
          {/* Banner */}
          <div
            className="h-56 flex items-end justify-between px-6 py-4 relative bg-cover bg-center"
            style={{ backgroundImage: `url(${BackgroundImage})` }}
          >
            <div className="absolute inset-0 bg-black opacity-40"></div>
          </div>

          <div className="pt-28 px-8 pb-4 relative z-30">
            <h2 className="text-3xl font-semibold text-gray-800">
              {userInfo.firstName} {userInfo.lastName}
            </h2>
            <p className="text-base text-gray-600 mt-2">{userInfo.bio}</p>
          </div>

          <hr className="border-gray-600 w-11/12 mx-auto mb-6" />

          <div className="px-12 pb-12 space-y-8 relative z-30">
            <section>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Contact Information
              </h3>
              <ul className="flex flex-wrap gap-x-32 text-gray-600 text-lg">
                <li>
                  <strong>Email:</strong> <span>{userInfo.email}</span>
                </li>
                <li>
                  <strong>Phone:</strong> <span>{userInfo.phone}</span>
                </li>
                <li>
                  <strong>Location:</strong> <span>{userInfo.location}</span>
                </li>
              </ul>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default UserProfile;
