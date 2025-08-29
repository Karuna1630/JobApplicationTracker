import React, { useState, useEffect } from "react";
import axiosInstance from "../Utils/axiosInstance";
import { getUserIdFromToken } from "../Utils/jwtUtils";
import SidebarMenu from "../Components/SidebarMenu";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import ReviewModal from "./ReviewModal";
import { toast } from "react-toastify";
import {FaCalendarAlt,FaEye,FaCheck,FaTimes,FaClock,FaSearch,FaFilter,FaSortAmountDown,FaSortAmountUp,FaFileAlt,FaUsers,
} from "react-icons/fa";

const StatusBadge = ({ status, applicationStatuses }) => {
  const getStatusInfo = (status) => {
    // Find the status in the API response
    const statusObj = applicationStatuses.find(s => s.applicationStatusId === status);
    
    if (statusObj) {
      // Map API statuses to colors
      switch (statusObj.statusName.toLowerCase()) {
        case 'applied':
          return { 
            text: statusObj.statusName, 
            color: "yellow", 
            bgColor: "bg-yellow-100", 
            textColor: "text-yellow-800" 
          };
        case 'approve':
          return { 
            text: statusObj.statusName, 
            color: "green", 
            bgColor: "bg-green-100", 
            textColor: "text-green-800" 
          };
        case 'rejected':
          return { 
            text: statusObj.statusName, 
            color: "red", 
            bgColor: "bg-red-100", 
            textColor: "text-red-800" 
          };
        default:
          return { 
            text: statusObj.statusName, 
            color: "gray", 
            bgColor: "bg-gray-100", 
            textColor: "text-gray-800" 
          };
      }
    }
    
    // Fallback to hardcoded values
    switch (status) {
      case 1:
        return { text: "Applied", color: "yellow", bgColor: "bg-yellow-100", textColor: "text-yellow-800" };
      case 2:
        return { text: "Approve", color: "green", bgColor: "bg-green-100", textColor: "text-green-800" };
      case 3:
        return { text: "Rejected", color: "red", bgColor: "bg-red-100", textColor: "text-red-800" };
      default:
        return { text: "Unknown", color: "gray", bgColor: "bg-gray-100", textColor: "text-gray-800" };
    }
  };

  const statusInfo = getStatusInfo(status);
  
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusInfo.bgColor} ${statusInfo.textColor}`}>
      {statusInfo.text}
    </span>
  );
};

const StatsCard = ({ icon, label, value, color = "blue", isLoading = false }) => (
  <div className="bg-white shadow-md rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{label}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">
          {isLoading ? (
            <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
          ) : (
            value
          )}
        </p>
      </div>
      <div className={`text-2xl p-3 rounded-lg bg-${color}-100 text-${color}-600`}>
        {icon}
      </div>
    </div>
  </div>
);

// User Avatar Component
const UserAvatar = ({ profileImageUrl, firstName, lastName, size = "md" }) => {
  const [imageError, setImageError] = useState(false);
  
  const sizeClasses = {
    sm: "w-8 h-8 text-sm",
    md: "w-12 h-12 text-lg",
    lg: "w-16 h-16 text-xl"
  };

  const getInitials = () => {
    const first = firstName ? firstName.charAt(0).toUpperCase() : '';
    const last = lastName ? lastName.charAt(0).toUpperCase() : '';
    return first + last;
  };

  if (profileImageUrl && !imageError) {
    return (
      <img
        src={profileImageUrl}
        alt={`${firstName} ${lastName}`}
        className={`${sizeClasses[size]} rounded-full object-cover border-2 border-gray-200`}
        onError={() => setImageError(true)}
      />
    );
  }

  return (
    <div className={`${sizeClasses[size]} bg-blue-100 rounded-full flex items-center justify-center border-2 border-gray-200`}>
      <span className="text-blue-600 font-semibold">{getInitials()}</span>
    </div>
  );
};

const ApplicationReceived = () => {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [companyId, setCompanyId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [jobTypes, setJobTypes] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applicationStatuses, setApplicationStatuses] = useState([]);
  const [userDetails, setUserDetails] = useState({}); // Store user profile data
  const [userProfiles, setUserProfiles] = useState({}); // Store user profile images and bio

  // Review Modal State
  const [reviewModal, setReviewModal] = useState({
    isOpen: false,
    applicationId: null,
    userId: null
  });

  const [stats, setStats] = useState({
    total: 0,
    applied: 0,
    approved: 0,
    rejected: 0
  });

  // Fetch user profile details
  const fetchUserProfile = async (userId) => {
    try {
      if (userDetails[userId]) {
        return userDetails[userId]; // Return cached data
      }

      const response = await axiosInstance.get(`/profile/${userId}`);
      const userData = response.data;
      
      // Cache the user data
      setUserDetails(prev => ({
        ...prev,
        [userId]: userData
      }));

      return userData;
    } catch (error) {
      console.error(`Error fetching user profile for userId ${userId}:`, error);
      return null;
    }
  };

  // Fetch user uploaded profile (profile image and bio)
  const fetchUserUploadedProfile = async (userId) => {
    try {
      if (userProfiles[userId]) {
        return userProfiles[userId]; // Return cached data
      }

      const response = await axiosInstance.get(`/getuserUploadedprofileByid/${userId}`);
      const profileData = response.data;
      
      // Cache the profile data
      setUserProfiles(prev => ({
        ...prev,
        [userId]: profileData
      }));

      return profileData;
    } catch (error) {
      console.error(`Error fetching user uploaded profile for userId ${userId}:`, error);
      return null;
    }
  };

  // Fetch all user details for applications
  const fetchAllUserDetails = async (applications) => {
    const userIds = [...new Set(applications.map(app => app.userId))];
    
    // Fetch user profiles and uploaded profiles in parallel
    const promises = userIds.map(async (userId) => {
      const [profile, uploadedProfile] = await Promise.all([
        fetchUserProfile(userId),
        fetchUserUploadedProfile(userId)
      ]);
      
      return {
        userId,
        profile,
        uploadedProfile
      };
    });

    try {
      await Promise.all(promises);
      console.log("All user details loaded successfully");
    } catch (error) {
      console.error("Error loading user details:", error);
    }
  };

  // Get user display name
  const getUserDisplayName = (userId) => {
    const user = userDetails[userId];
    if (user) {
      return `${user.firstName || ''} ${user.lastName || ''}`;
    }
    return 'Loading...';
  };

  // Get user profile image
  const getUserProfileImage = (userId) => {
    const profile = userProfiles[userId];
    if (profile && profile.isSuccess && profile.profileImageUrl) {
      return profile.profileImageUrl;
    }
    return null;
  };

  // FIXED: Better error handling for fetching application statuses
  const fetchApplicationStatuses = async () => {
    try {
      const response = await axiosInstance.get('/api/ApplicationStatus');
      
      // More robust response handling
      let statusData = [];
      if (response.data) {
        if (Array.isArray(response.data)) {
          statusData = response.data;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          statusData = response.data.data;
        } else if (response.data.applicationStatuses && Array.isArray(response.data.applicationStatuses)) {
          statusData = response.data.applicationStatuses;
        }
      }

      if (statusData.length > 0) {
        setApplicationStatuses(statusData);
        console.log("Application statuses loaded:", statusData);
      } else {
        console.log("No status data found in response, using defaults");
        setDefaultApplicationStatuses();
      }
    } catch (error) {
      console.error("Error fetching application statuses:", error);
      setDefaultApplicationStatuses();
    }
  };

  // Set default application statuses (fallback)
  const setDefaultApplicationStatuses = () => {
    const defaultStatuses = [
      { applicationStatusId: 1, statusName: "Applied", description: "Application submitted" },
      { applicationStatusId: 2, statusName: "Approve", description: "Application was approved" },
      { applicationStatusId: 3, statusName: "Rejected", description: "Application was not successful" }
    ];
    setApplicationStatuses(defaultStatuses);
    console.log("Using default application statuses:", defaultStatuses);
  };

  const fetchJobTypes = async () => {
    try {
      const response = await axiosInstance.get('/getalljobtypes');
      
      if (response.data && Array.isArray(response.data)) {
        const mappedJobTypes = response.data.map(job => ({
          id: job.jobTypeId,
          name: job.name
        }));
        setJobTypes(mappedJobTypes);
        console.log("Job types loaded:", mappedJobTypes);
      } else {
        console.log("No job types found in response");
      }
    } catch (error) {
      console.error("Error fetching job types:", error);
    }
  };

  const fetchCompanyJobs = async (companyId) => {
    try {
      const response = await axiosInstance.get(`/api/Jobs/getjobsbycompanyid?companyId=${companyId}`);
      
      if (response.data && Array.isArray(response.data)) {
        setJobs(response.data);
        console.log("Company jobs loaded:", response.data.length);
      } else {
        console.log("No jobs found for company");
      }
    } catch (error) {
      console.error("Error fetching company jobs:", error);
    }
  };

  // Get job type name by ID
  const getJobTypeName = (jobTypeId) => {
    if (!jobTypeId) return "Unknown Job Type";
    const jobType = jobTypes.find(jt => jt.id === parseInt(jobTypeId));
    return jobType ? jobType.name : `Job Type ${jobTypeId}`;
  };

  // Get job details by job ID
  const getJobDetails = (jobId) => {
    if (!jobId) return {};
    const job = jobs.find(j => j.jobId === jobId || j.id === jobId);
    return job || {};
  };

  // FIXED: More robust application fetching with better error handling
  const fetchApplications = async (companyId) => {
    try {
      setIsLoading(true);
      setErrorMsg("");
      
      console.log("Fetching applications for company:", companyId);
      const response = await axiosInstance.get(`/getapplicationsbycompanyid?companyId=${companyId}`);
      
      console.log("Raw API response:", response.data);
      
      // FIXED: More comprehensive response structure handling
      let applicationsData = [];
      
      if (response.data) {
        // Handle different possible response structures
        if (Array.isArray(response.data)) {
          applicationsData = response.data;
        } else if (response.data.data) {
          if (Array.isArray(response.data.data)) {
            applicationsData = response.data.data;
          } else {
            console.log("response.data.data exists but is not an array:", typeof response.data.data);
          }
        } else if (response.data.applications) {
          if (Array.isArray(response.data.applications)) {
            applicationsData = response.data.applications;
          } else {
            console.log("response.data.applications exists but is not an array:", typeof response.data.applications);
          }
        } else if (response.data.result) {
          if (Array.isArray(response.data.result)) {
            applicationsData = response.data.result;
          } else {
            console.log("response.data.result exists but is not an array:", typeof response.data.result);
          }
        }
      }

      console.log("Processed applications data:", applicationsData);

      if (Array.isArray(applicationsData) && applicationsData.length > 0) {
        setApplications(applicationsData);
        setFilteredApplications(applicationsData);
        
        // Fetch user details for all applications
        await fetchAllUserDetails(applicationsData);
        
        // Calculate statistics
        const newStats = {
          total: applicationsData.length,
          applied: applicationsData.filter(app => (app.applicationStatus === 1 || app.status === 1)).length,
          approved: applicationsData.filter(app => (app.applicationStatus === 2 || app.status === 2)).length,
          rejected: applicationsData.filter(app => (app.applicationStatus === 3 || app.status === 3)).length,
        };
        setStats(newStats);
        
        toast.success(`Found ${applicationsData.length} applications`);
      } else {
        console.log("No applications found or invalid data structure");
        setApplications([]);
        setFilteredApplications([]);
        setStats({ total: 0, applied: 0, approved: 0, rejected: 0 });
        toast.info("No applications found for this company");
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
      console.error("Error response:", error.response?.data);
      
      setErrorMsg(`Failed to fetch applications: ${error.message}`);
      toast.error(`Failed to fetch applications: ${error.message}`);
      setApplications([]);
      setFilteredApplications([]);
      setStats({ total: 0, applied: 0, approved: 0, rejected: 0 });
    } finally {
      setIsLoading(false);
    }
  };

  // Approve Application using correct API endpoint
  const approveApplication = async (applicationId) => {
    try {
      console.log("Attempting to approve application:", applicationId);
      
      const response = await axiosInstance.post(`/acceptjobapplication?id=${applicationId}`);
      
      if (response.status === 200 || response.status === 201) {
        if (response.data && response.data.isSuccess !== false) {
          updateApplicationInState(applicationId, 2);
          toast.success("Application approved successfully!");
        } else {
          toast.error(response.data?.message || "Failed to approve application - API returned error");
        }
      } else {
        toast.error("Failed to approve application - Unexpected response");
      }
    } catch (error) {
      console.error("Error approving application:", error);
      
      if (error.response?.status === 400) {
        toast.error("Bad request - Please check if the application ID is valid");
      } else if (error.response?.status === 404) {
        toast.error("Application not found or endpoint not available");
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to approve application");
      }
    }
  };

  // Reject Application using correct API endpoint
  const rejectApplication = async (applicationId) => {
    try {
      console.log("Attempting to reject application:", applicationId);
      
      const response = await axiosInstance.post(`/rejectjobapplication?id=${applicationId}`);
      
      if (response.status === 200 || response.status === 201) {
        if (response.data && response.data.isSuccess !== false) {
          updateApplicationInState(applicationId, 3);
          toast.success("Application rejected successfully!");
        } else {
          toast.error(response.data?.message || "Failed to reject application - API returned error");
        }
      } else {
        toast.error("Failed to reject application - Unexpected response");
      }
    } catch (error) {
      console.error("Error rejecting application:", error);
      
      if (error.response?.status === 400) {
        toast.error("Bad request - Please check if the application ID is valid");
      } else if (error.response?.status === 404) {
        toast.error("Application not found or endpoint not available");
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to reject application");
      }
    }
  };

  // Helper function to update application state
  const updateApplicationInState = (applicationId, newStatus) => {
    // Update the applications array
    setApplications(prev => 
      prev.map(app => {
        const currentId = app.applicationId || app.id;
        return currentId === applicationId 
          ? { ...app, applicationStatus: newStatus, status: newStatus }
          : app;
      })
    );
    
    // Update filtered applications as well
    setFilteredApplications(prev => 
      prev.map(app => {
        const currentId = app.applicationId || app.id;
        return currentId === applicationId 
          ? { ...app, applicationStatus: newStatus, status: newStatus }
          : app;
      })
    );
    
    // Recalculate stats
    const updatedApps = applications.map(app => {
      const currentId = app.applicationId || app.id;
      return currentId === applicationId 
        ? { ...app, applicationStatus: newStatus, status: newStatus }
        : app;
    });
    
    const newStats = {
      total: updatedApps.length,
      applied: updatedApps.filter(app => (app.applicationStatus || app.status) === 1).length,
      approved: updatedApps.filter(app => (app.applicationStatus || app.status) === 2).length,
      rejected: updatedApps.filter(app => (app.applicationStatus || app.status) === 3).length,
    };
    setStats(newStats);
  };

  // Update application status (fallback method)
  const updateApplicationStatus = async (applicationId, newStatus) => {
    try {
      const requestPayloads = [
        { applicationId: applicationId, status: newStatus },
        { ApplicationId: applicationId, Status: newStatus },
        { id: applicationId, status: newStatus },
        { Id: applicationId, Status: newStatus }
      ];

      const endpoints = [
        '/updateapplicationstatus',
        '/api/Application/updatestatus',
        '/api/applications/updatestatus',
        '/Application/updatestatus',
        '/applications/updatestatus'
      ];

      let response = null;
      let lastError = null;

      for (const endpoint of endpoints) {
        for (const payload of requestPayloads) {
          try {
            console.log(`Trying endpoint: ${endpoint} with payload:, payload`);
            response = await axiosInstance.put(endpoint, payload);
            
            if (response.status === 200 || response.status === 201) {
              break;
            }
          } catch (error) {
            lastError = error;
            continue;
          }
        }
        if (response && (response.status === 200 || response.status === 201)) {
          break;
        }
      }

      // Handle response
      if (response && (response.status === 200 || response.status === 201)) {
        if (response.data && (response.data.isSuccess !== false)) {
          updateApplicationInState(applicationId, newStatus);
          
          const statusObj = applicationStatuses.find(s => s.applicationStatusId === newStatus);
          const statusName = statusObj ? statusObj.statusName : 'Status';
          toast.success(`Application moved to ${statusName}`);
        } else {
          toast.error(response.data?.message || "Failed to update application status");
        }
      } else {
        console.error("All update attempts failed. Last error:", lastError);
        toast.error(lastError?.response?.data?.message || "Failed to update application status");
      }
    } catch (error) {
      console.error("Error updating application status:", error);
      toast.error("Failed to update application status");
    }
  };

  // Open review modal
  const openReviewModal = (applicationId, userId) => {
    setReviewModal({
      isOpen: true,
      applicationId: applicationId,
      userId: userId
    });
  };

  // Close review modal
  const closeReviewModal = () => {
    setReviewModal({
      isOpen: false,
      applicationId: null,
      userId: null
    });
  };

  // Filter and search applications
  useEffect(() => {
    let filtered = [...applications];
    
    // Apply search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(app => {
        const jobDetails = getJobDetails(app.jobId);
        const jobTypeName = getJobTypeName(jobDetails.jobType || jobDetails.jobTypeId);
        const userName = getUserDisplayName(app.userId).toLowerCase();
        
        return (
          userName.includes(searchTerm.toLowerCase()) ||
          app.applicationId?.toString().includes(searchTerm.toLowerCase()) ||
          jobTypeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          jobDetails.location?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }
    
    // Apply status filter
    if (statusFilter !== "all") {
      const statusMap = {
        "applied": 1,
        "approved": 2,
        "rejected": 3
      };
      filtered = filtered.filter(app => (app.applicationStatus || app.status) === statusMap[statusFilter]);
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case "date":
          aValue = new Date(a.applicationDate || a.createdDate || 0);
          bValue = new Date(b.applicationDate || b.createdDate || 0);
          break;
        case "status":
          aValue = a.applicationStatus || a.status || 0;
          bValue = b.applicationStatus || b.status || 0;
          break;
        case "jobId":
          aValue = a.jobId || 0;
          bValue = b.jobId || 0;
          break;
        case "name":
          aValue = getUserDisplayName(a.userId);
          bValue = getUserDisplayName(b.userId);
          break;
        default:
          aValue = a.applicationId || a.id || 0;
          bValue = b.applicationId || b.id || 0;
      }
      
      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    setFilteredApplications(filtered);
  }, [applications, searchTerm, statusFilter, sortBy, sortOrder, jobTypes, jobs, userDetails]);

  // Initialize component
  useEffect(() => {
    const initializeComponent = async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = getUserIdFromToken(token);
        
        if (!userId || userId === 0) {
          setErrorMsg("User ID missing or invalid. Please log in again.");
          setIsLoading(false);
          return;
        }

        // Get company ID
        let compId = localStorage.getItem("currentCompanyId");
        
        if (!compId) {
          const profileResponse = await axiosInstance.get(`/profile/${userId}`);
          const profileData = profileResponse.data;
          
          if (profileData && profileData.companyProfile) {
            compId = profileData.companyProfile.companyId;
            localStorage.setItem("currentCompanyId", compId);
          } else {
            setErrorMsg("Company profile not found.");
            setIsLoading(false);
            return;
          }
        }

        setCompanyId(compId);

        // Fetch required data
        await Promise.all([
          fetchApplicationStatuses(),
          fetchJobTypes(),
          fetchCompanyJobs(compId)
        ]);
        
        // Fetch applications last to ensure all reference data is loaded
        await fetchApplications(compId);

      } catch (error) {
        setErrorMsg(`Failed to initialize component: ${error.message}`);
        console.error("Component Initialization Error:", error);
        setIsLoading(false);
      }
    };

    initializeComponent();
  }, []);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "Date not available";
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid date";
      
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Date error";
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-700">Loading applications...</p>
        </div>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="text-red-600 text-lg mb-4">{errorMsg}</div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-row bg-gradient-to-br from-blue-100 to-white py-10">
        <div className="p-6 w-fit">
          <SidebarMenu />
        </div>

        <div className="m-2 ml-8 w-4/5 max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="bg-white shadow-xl rounded-2xl p-8 mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Job Applications</h1>
            <p className="text-gray-600">Review applications for company's job postings</p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <StatsCard
              icon={<FaFileAlt />}
              label="Total Applications"
              value={stats.total}
              color="blue"
            />
            <StatsCard
              icon={<FaClock />}
              label="Applied"
              value={stats.applied}
              color="yellow"
            />
            <StatsCard
              icon={<FaCheck />}
              label="Approved"
              value={stats.approved}
              color="green"
            />
            <StatsCard
              icon={<FaTimes />}
              label="Rejected"
              value={stats.rejected}
              color="red"
            />
          </div>

          {/* Filters and Search */}
          <div className="bg-white shadow-xl rounded-2xl p-6 mb-8">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 min-w-64">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, job type, location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <FaFilter className="text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="applied">Applied</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              {/* Sort Options */}
              <div className="flex items-center gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="date">Sort by Date</option>
                  <option value="name">Sort by Name</option>
                  <option value="status">Sort by Status</option>
                  <option value="jobId">Sort by Job</option>
                </select>
                
                <button
                  onClick={() => setSortOrder(prev => prev === "asc" ? "desc" : "asc")}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500"
                >
                  {sortOrder === "asc" ? <FaSortAmountUp /> : <FaSortAmountDown />}
                </button>
              </div>
            </div>
          </div>

          {/* Applications List */}
          <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
            {filteredApplications.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {filteredApplications.map((application) => {
                  const jobDetails = getJobDetails(application.jobId);
                  const jobTypeName = getJobTypeName(jobDetails.jobType || jobDetails.jobTypeId);
                  const currentApplicationId = application.applicationId || application.id;
                  const currentStatus = application.applicationStatus || application.status;
                  const userDisplayName = getUserDisplayName(application.userId);
                  const userProfileImage = getUserProfileImage(application.userId);
                  const userProfile = userDetails[application.userId];
                  
                  return (
                    <div key={currentApplicationId} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-3">
                            <UserAvatar 
                              profileImageUrl={userProfileImage}
                              firstName={userProfile?.firstName}
                              lastName={userProfile?.lastName}
                              size="md"
                            />
                            <div>
                              <h3 className="text-lg font-semibold text-gray-800">
                                {userDisplayName}
                              </h3>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                              <p className="text-sm font-medium text-gray-700">Job Position</p>
                              <p className="text-gray-600">{jobTypeName}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-700">Location</p>
                              <p className="text-gray-600">{jobDetails.location || "Not specified"}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-700">Application Date</p>
                              <p className="text-gray-600 flex items-center gap-1">
                                <FaCalendarAlt className="text-xs" />
                                {formatDate(application.applicationDate || application.createdDate)}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <StatusBadge 
                            status={currentStatus} 
                            applicationStatuses={applicationStatuses}
                          />
                          
                          {/* Action Buttons - Updated to use new API endpoints with better error handling */}
                          <div className="flex gap-2">
                            {/* Applied Status (ID: 1) - Can move to Approved or Reject */}
                            {currentStatus === 1 && (
                              <>
                                <button
                                  onClick={() => openReviewModal(currentApplicationId, application.userId)}
                                  className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                                >
                                  <FaEye className="inline mr-1" />
                                  Review
                                </button>
                                <button
                                  onClick={() => approveApplication(currentApplicationId)}
                                  className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                                >
                                  <FaCheck className="inline mr-1" />
                                  Approve
                                </button>
                                <button
                                  onClick={() => rejectApplication(currentApplicationId)}
                                  className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                                >
                                  <FaTimes className="inline mr-1" />
                                  Reject
                                </button>
                              </>
                            )}
                            
                            {/* Approved Status (ID: 2) - Can view details or reject */}
                            {currentStatus === 2 && (
                              <>
                                <button
                                  onClick={() => openReviewModal(currentApplicationId, application.userId)}
                                  className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                                >
                                  <FaEye className="inline mr-1" />
                                  View Details
                                </button>
                                <button
                                  onClick={() => rejectApplication(currentApplicationId)}
                                  className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                                >
                                  <FaTimes className="inline mr-1" />
                                  Reject
                                </button>
                              </>
                            )}
                            
                            {/* Rejected Status (ID: 3) - Can view details or reset */}
                            {currentStatus === 3 && (
                              <>
                                <button
                                  onClick={() => openReviewModal(currentApplicationId, application.userId)}
                                  className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                                >
                                  <FaEye className="inline mr-1" />
                                  View Details
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <FaUsers className="text-6xl text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Applications Found</h3>
                <p className="text-gray-500">
                  {searchTerm || statusFilter !== "all" 
                    ? "Try adjusting your search or filter criteria" 
                    : "No applications have been submitted yet"
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Review Modal */}
      <ReviewModal
        isOpen={reviewModal.isOpen}
        onClose={closeReviewModal}
        applicationId={reviewModal.applicationId}
        userId={reviewModal.userId}
        onStatusUpdate={updateApplicationStatus}
      />
      <Footer />
    </>
  );
};

export default ApplicationReceived;