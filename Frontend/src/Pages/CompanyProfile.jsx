import React, { useState, useEffect } from "react";
import axiosInstance from "../Utils/axiosInstance";
import { getUserIdFromToken } from "../Utils/jwtUtils";
import SidebarMenu from "../Components/SidebarMenu";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import PostJob from "./PostJob";
import EditCompanyModal from "../Components/EditCompanyModal";
import AddStaffModal from "./AddStaffModal";
import { FaEdit, FaCamera, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import {
  FaSuitcase,
  FaUsers,
  FaUserCheck,
  FaUserClock,
  FaUserTie,
  FaGlobe,
  FaChartLine,
  FaUserPlus,
  FaEye,
} from "react-icons/fa";

const InfoCard = ({ icon, label, value, color = "gray", isLoading = false }) => (
  <div className="flex items-center bg-white shadow-md rounded-xl p-5 w-full sm:w-[260px] gap-4 border border-gray-100 hover:scale-[1.02] transition duration-300 ease-in-out">
    <div
      className={`text-3xl p-4 rounded-full bg-${color}-100 text-${color}-700 shadow-inner`}
    >
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-gray-700">
        {isLoading ? (
          <span className="inline-block w-6 h-6 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></span>
        ) : (
          value
        )}
      </p>
    </div>
  </div>
);

const CompanyProfile = () => {
  const [reloadJobs, setReloadJobs] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [companyId, setCompanyId] = useState(null);
  const [showPostJob, setShowPostJob] = useState(false);
  const [showAddStaff, setShowAddStaff] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [jobTypes, setJobTypes] = useState([]);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  
  // Add state for company users
  const [companyUsersCount, setCompanyUsersCount] = useState(0);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  
  const [companyInfo, setCompanyInfo] = useState({
    companyName: "",
    email: "",
    phone: "",
    location: "",
    description: "",
    firstName: "",
    lastName: "",
    companyLogo: "",
  });

  const [jobPosts, setJobPosts] = useState([]);
  const [totalJobsCount, setTotalJobsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // Function to fetch company users
  const fetchCompanyUsers = async (companyId) => {
    if (!companyId) return;
    
    setIsLoadingUsers(true);
    try {
      const response = await axiosInstance.get(`/getallusers?companyId=${companyId}`);
      
      if (response.data && Array.isArray(response.data)) {
        setCompanyUsersCount(response.data.length);
      } else if (response.data && typeof response.data === 'object') {
        // If the API returns an object with a users array or count property
        const count = response.data.users ? response.data.users.length : 
                     response.data.count || response.data.totalCount || 0;
        setCompanyUsersCount(count);
      } else {
        setCompanyUsersCount(0);
      }
    } catch (error) {
      console.error("Error fetching company users:", error);
      setCompanyUsersCount(0);
      // Optionally show a toast notification
      // toast.error("Failed to fetch company users count");
    } finally {
      setIsLoadingUsers(false);
    }
  };

  // Add the same function from Jobs component
  const getJobTypeName = (jobTypeId) => {
    const jobType = jobTypes.find(jt => jt.id === parseInt(jobTypeId));
    return jobType ? jobType.name : `Job Type ${jobTypeId}`;
  };

  // Add function to fetch job types
  const fetchJobTypes = async () => {
    try {
      const response = await axiosInstance.get('/getalljobtypes');
      if (response.data && Array.isArray(response.data)) {
        const mappedJobTypes = response.data.map(job => ({
          id: job.jobTypeId,
          name: job.name
        }));
        setJobTypes(mappedJobTypes);
      }
    } catch (error) {
      console.error("Error fetching job types:", error);
    }
  };

  // Logo upload function
  const handleLogoUpload = async (file) => {
    if (!companyId) {
      toast.error("Company ID not found");
      return;
    }

    setIsUploadingLogo(true);
    
    try {
      // Validate file
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Please select a valid image file (JPEG, PNG, GIF, or WebP)");
        return;
      }

      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        toast.error("File size must be less than 5MB");
        return;
      }

      const formData = new FormData();
      formData.append('logoFile', file);

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
        const newLogoUrl = response.data.data?.LogoUrl || response.data.data?.logoUrl;
        setCompanyInfo(prev => ({
          ...prev,
          companyLogo: newLogoUrl
        }));
        setLogoError(false);
        toast.success("Logo uploaded successfully!");
      } else {
        toast.error(response.data.message || "Logo upload failed");
      }
    } catch (error) {
      console.error("Error uploading logo:", error);
      if (error.response) {
        toast.error(error.response.data.message || "Failed to upload logo");
      } else {
        toast.error("Something went wrong while uploading logo");
      }
    } finally {
      setIsUploadingLogo(false);
    }
  };

  // Logo delete function
  const handleLogoDelete = async () => {
    if (!companyId) {
      toast.error("Company ID not found");
      return;
    }

    try {
      const response = await axiosInstance.delete(`/deletecompanylogo/${companyId}`);
      
      if (response.data.isSuccess) {
        setCompanyInfo(prev => ({
          ...prev,
          companyLogo: ""
        }));
        setLogoError(false);
        toast.success("Logo deleted successfully!");
      } else {
        toast.error(response.data.message || "Failed to delete logo");
      }
    } catch (error) {
      console.error("Error deleting logo:", error);
      if (error.response) {
        toast.error(error.response.data.message || "Failed to delete logo");
      } else {
        toast.error("Something went wrong while deleting logo");
      }
    }
  };

  // Handle file input change
  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleLogoUpload(file);
    }
    // Reset file input
    e.target.value = '';
  };

  useEffect(() => {
    const fetchProfileAndJobs = async () => {
      try {
        // Fetch job types first
        await fetchJobTypes();

        const token = localStorage.getItem("token");
        const userId = getUserIdFromToken(token);

        if (!userId || userId === 0) {
          setErrorMsg("User ID missing or invalid. Please log in again.");
          setIsLoading(false);
          return;
        }

        const profileResponse = await axiosInstance.get(`/profile/${userId}`);
        const profileData = profileResponse.data;

        if (profileData && profileData.companyProfile) {
          setCompanyInfo({
            companyName:
              profileData.companyProfile.companyName || "Unnamed Company",
            description:
              profileData.companyProfile.description ||
              "No description available",
            location: profileData.companyProfile.location || "No location",
            email: profileData.email || "No email provided",
            phone: profileData.phoneNumber || "No phone number",
            firstName: profileData.firstName || "No first name",
            lastName: profileData.lastName || "No last name",
            companyLogo: profileData.companyProfile.companyLogo || "",
          });

          const compId = profileData.companyProfile.companyId;
          setCompanyId(compId);
          localStorage.setItem("currentCompanyId", compId);

          // Fetch company users after we have the company ID
          await fetchCompanyUsers(compId);

          // Fetch all jobs for the company to get the total count and display data
          const jobsResponse = await axiosInstance.get(
            `/api/Jobs/getjobsbycompanyid?companyId=${compId}`
          );
          const jobsData = jobsResponse.data;

          if (Array.isArray(jobsData) && jobsData.length > 0) {
            setTotalJobsCount(jobsData.length);
            setJobPosts(jobsData);
          } else {
            setTotalJobsCount(0);
            setJobPosts([]);
          }
        } else {
          setErrorMsg("Company profile not found.");
        }
      } catch (error) {
        setErrorMsg("Failed to fetch company data.");
        console.error("Company Profile Fetch Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileAndJobs();
  }, [reloadJobs]);

  // Handle logo error with fallback prevention
  const handleLogoError = (e) => {
    if (logoError) {
      // Already tried fallback, hide image completely
      e.currentTarget.style.display = 'none';
      return;
    }
    
    // Mark as failed and set data URL fallback
    setLogoError(true);
    e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzlDQTNBRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkNvbXBhbnkgTG9nbzwvdGV4dD48L3N2Zz4=';
  };

  // Handle job posting success
  const handleJobPosted = (newJob) => {
    setJobPosts((prev) => [newJob, ...prev]);
    setTotalJobsCount((prev) => prev + 1);
    setReloadJobs((prev) => !prev);
  };

  // Handle staff addition success
  const handleStaffAdded = () => {
    toast.success("Staff member added successfully!");
    setShowAddStaff(false);
    // Refresh company users count after adding staff
    fetchCompanyUsers(companyId);
  };

  const handleUpdateSuccess = (updatedData) => {
    setCompanyInfo((prev) => ({
      ...prev,
      companyName: updatedData.companyName,
      description: updatedData.description,
      location: updatedData.location,
      email: updatedData.email,
      phone: updatedData.phone,
      firstName: updatedData.firstName,
      lastName: updatedData.lastName,
    }));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-lg text-gray-700">
        Loading company profile...
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

  const displayedJobs = jobPosts.slice(0, 2);

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-row bg-gradient-to-br from-blue-100 to-white py-10 ">
        <div className="p-6 w-fit">
          <SidebarMenu />
        </div>

        <div className="  m-2 ml-8 w-4/5 max-w-6xl mx-auto gap-4">
          <div className="bg-white shadow-xl rounded-2xl overflow-hidden mb-8">
            <div className="relative h-56 bg-gradient-to-r from-indigo-300 to-pink-200 flex items-center px-6 py-4">
              <div className="absolute -bottom-16 left-8 w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-100 group">
                {companyInfo.companyLogo && companyInfo.companyLogo.startsWith("http") && !logoError ? (
                  <img
                    src={companyInfo.companyLogo}
                    alt={companyInfo.companyName}
                    className="w-full h-full object-cover"
                    onError={handleLogoError}
                  />
                ) : (
                  // Show CSS-based placeholder instead of broken image
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-2xl font-bold">
                    {companyInfo.companyName?.charAt(0)?.toUpperCase() || 'C'}
                  </div>
                )}
                
                {/* Logo upload/edit overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="flex gap-2">
                    {/* Upload/Change Logo Button */}
                    <label className="cursor-pointer bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
                      <FaCamera />
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileInputChange}
                        disabled={isUploadingLogo}
                      />
                    </label>
                    
                    {/* Delete Logo Button - only show if logo exists */}
                    {companyInfo.companyLogo && (
                      <button
                        onClick={handleLogoDelete}
                        className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors"
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>
                </div>
                
                {/* Loading overlay */}
                {isUploadingLogo && (
                  <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
              
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  onClick={() => setShowEditModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                >
                  <FaEdit />
                  Edit Profile
                </button>
                
                {/* Add Staff Button */}
                <button
                  onClick={() => setShowAddStaff(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  <FaUserPlus />
                  Add Staff
                </button>
              </div>
            </div>

            <div className="pt-20 px-8 pb-8">
              <h2 className="text-3xl font-bold text-gray-800">
                {companyInfo.companyName}
              </h2>
              <p className="text-gray-600 mt-2">{companyInfo.description}</p>
            </div>
          </div>

          <div className="bg-white shadow-xl rounded-2xl p-8 mb-8">
            <h3 className="text-xl font-semibold text-gray-700 mb-3">
              Company Information
            </h3>
            <ul className="grid sm:grid-cols-2 gap-x-12 text-gray-600 text-lg">
              <li>
                <strong>Recruiter Name:</strong> {companyInfo.firstName}{" "}
                {companyInfo.lastName}
              </li>
              <li>
                <strong>Email:</strong> {companyInfo.email}
              </li>
              <li>
                <strong>Phone:</strong> {companyInfo.phone}
              </li>
              <li>
                <strong>Location:</strong> {companyInfo.location}
              </li>
            </ul>
          </div>

          <div className="bg-white shadow-xl rounded-2xl p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-700 mb-6">
              Company Dashboard
            </h2>
            <div className="flex flex-wrap justify-center gap-6">
              <InfoCard
                icon={<FaSuitcase />}
                label="Total Jobs Posted"
                value={totalJobsCount}
                color="blue"
              />
              <InfoCard
                icon={<FaUsers />}
                label="Total Applications"
                value="1,240"
                color="green"
              />
              <InfoCard
                icon={<FaUserCheck />}
                label="Hired Candidates"
                value="120"
                color="indigo"
              />
              <InfoCard
                icon={<FaUserClock />}
                label="Pending Interviews"
                value="45"
                color="yellow"
              />
            </div>
          </div>

          <div className="bg-white shadow-xl rounded-2xl p-8 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-700">
                Recent Job Posts
              </h2>
            </div>
            {displayedJobs.length > 0 ? (
              <div className="space-y-4">
                {displayedJobs.map((job) => {
                  const jobTypeName = getJobTypeName(job.jobType); 
                  
                  return (
                    <div
                      key={job.jobId || job.id}
                      className="p-4 border rounded-xl hover:bg-gray-50"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-lg font-bold text-gray-800">
                          {jobTypeName} {/* Display job type name instead */}
                        </h4>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            job.status === "A" ||
                            job.status === "active" ||
                            job.isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {job.status === "A" ||
                          job.status === "active" ||
                          job.isActive
                            ? "Active"
                            : "Inactive"}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-2">
                        {job.description ||
                          job.jobDescription ||
                          "No description available"}
                      </p>
                      <div className="flex gap-4 text-sm text-gray-500">
                        <span>
                          📍{" "}
                          {job.location ||
                            job.jobLocation ||
                            "Location not specified"}
                        </span>
                        {job.salaryRangeMin && job.salaryRangeMax && (
                          <span>
                            💰 ${job.salaryRangeMin.toLocaleString()} - $
                            {job.salaryRangeMax.toLocaleString()}
                          </span>
                        )}
                        {job.salary && (
                          <span>💰 ${job.salary.toLocaleString()}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <FaSuitcase className="text-4xl text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No job posts available.</p>
                <button
                  onClick={() => setShowPostJob(true)}
                  className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Post Your First Job
                </button>
              </div>
            )}
          </div>

          <div className="bg-white shadow-xl rounded-2xl p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-700 mb-6">
              User Insights
            </h2>
            <div className="flex flex-wrap justify-center gap-6">
              <InfoCard
                icon={<FaUserTie />}
                label="Users"
                value={companyUsersCount}
                color="purple"
                isLoading={isLoadingUsers}
              />
              <InfoCard
                icon={<FaGlobe />}
                label="Website Visitors"
                value="5,230"
                color="cyan"
              />
              <InfoCard
                icon={<FaChartLine />}
                label="HR Staff"
                value="6"
                color="pink"
              />
              <InfoCard
                icon={<FaUserPlus />}
                label="New Signups (30d)"
                value="14"
                color="orange"
              />
            </div>
          </div>

          {showEditModal && (
            <EditCompanyModal
              isOpen={showEditModal}
              onClose={() => setShowEditModal(false)}
              companyInfo={companyInfo}
              companyId={companyId}
              onUpdateSuccess={handleUpdateSuccess}
            />
          )}
          
          {showPostJob && (
            <PostJob
              onClose={() => setShowPostJob(false)}
              onJobPosted={(newJob) => {
                handleJobPosted(newJob);
                setShowPostJob(false);
              }}
              companyId={companyId}
            />
          )}
          
          {/* Add Staff Modal */}
          {showAddStaff && (
            <AddStaffModal
              isOpen={showAddStaff}
              onClose={() => setShowAddStaff(false)}
              companyId={companyId}
              onStaffAdded={handleStaffAdded}
            />
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CompanyProfile;