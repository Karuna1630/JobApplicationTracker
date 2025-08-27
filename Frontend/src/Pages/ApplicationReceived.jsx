import React, { useState, useEffect } from "react";
import axiosInstance from "../Utils/axiosInstance";
import { getUserIdFromToken } from "../Utils/jwtUtils";
import SidebarMenu from "../Components/SidebarMenu";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import ReviewModal from "./ReviewModal";
import { toast } from "react-toastify";
import {
  FaUser,
  FaCalendarAlt,
  FaEye,
  FaCheck,
  FaTimes,
  FaClock,
  FaSearch,
  FaFilter,
  FaSortAmountDown,
  FaSortAmountUp,
  FaFileAlt,
  FaUsers,
} from "react-icons/fa";

const StatusBadge = ({ status }) => {
  const getStatusInfo = (status) => {
    switch (status) {
      case 1:
        return { text: "Pending", color: "yellow", bgColor: "bg-yellow-100", textColor: "text-yellow-800" };
      case 2:
        return { text: "Reviewed", color: "blue", bgColor: "bg-blue-100", textColor: "text-blue-800" };
      case 3:
        return { text: "Accepted", color: "green", bgColor: "bg-green-100", textColor: "text-green-800" };
      case 4:
        return { text: "Rejected", color: "red", bgColor: "bg-red-100", textColor: "text-red-800" };
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

  // Review Modal State
  const [reviewModal, setReviewModal] = useState({
    isOpen: false,
    applicationId: null,
    userId: null
  });

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    reviewed: 0,
    accepted: 0,
    rejected: 0
  });

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

  const fetchCompanyJobs = async (companyId) => {
    try {
      const response = await axiosInstance.get(`/api/Jobs/getjobsbycompanyid?companyId=${companyId}`);
      if (response.data && Array.isArray(response.data)) {
        setJobs(response.data);
      }
    } catch (error) {
      console.error("Error fetching company jobs:", error);
    }
  };

  // Get job type name by ID
  const getJobTypeName = (jobTypeId) => {
    const jobType = jobTypes.find(jt => jt.id === parseInt(jobTypeId));
    return jobType ? jobType.name : `Job Type ${jobTypeId}`;
  };

  // Get job details by job ID
  const getJobDetails = (jobId) => {
    const job = jobs.find(j => j.jobId === jobId || j.id === jobId);
    return job || {};
  };

  // Fetch applications by company ID
  const fetchApplications = async (companyId) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(`/getapplicationsbycompanyid?companyId=${companyId}`);
      
      if (response.data && response.data.data && Array.isArray(response.data.data)) {
        const applicationsData = response.data.data;
        setApplications(applicationsData);
        setFilteredApplications(applicationsData);
        
        // Calculate statistics
        const newStats = {
          total: applicationsData.length,
          pending: applicationsData.filter(app => app.applicationStatus === 1).length,
          reviewed: applicationsData.filter(app => app.applicationStatus === 2).length,
          accepted: applicationsData.filter(app => app.applicationStatus === 3).length,
          rejected: applicationsData.filter(app => app.applicationStatus === 4).length,
        };
        setStats(newStats);
        
        toast.success(`Found ${applicationsData.length} applications`);
      } else {
        setApplications([]);
        setFilteredApplications([]);
        toast.info("No applications found for this company");
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
      setErrorMsg("Failed to fetch applications");
      toast.error("Failed to fetch applications");
      setApplications([]);
      setFilteredApplications([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Update application status
  const updateApplicationStatus = async (applicationId, newStatus) => {
    try {
      const response = await axiosInstance.put(`/updateapplicationstatus`, {
        applicationId: applicationId,
        status: newStatus
      });
      
      if (response.data.isSuccess) {
        // Update the application in the state
        setApplications(prev => 
          prev.map(app => 
            app.applicationId === applicationId 
              ? { ...app, applicationStatus: newStatus }
              : app
          )
        );
        
        // Update filtered applications as well
        setFilteredApplications(prev => 
          prev.map(app => 
            app.applicationId === applicationId 
              ? { ...app, applicationStatus: newStatus }
              : app
          )
        );
        
        toast.success("Application status updated successfully");
        
        // Recalculate stats
        const updatedApps = applications.map(app => 
          app.applicationId === applicationId 
            ? { ...app, applicationStatus: newStatus }
            : app
        );
        
        const newStats = {
          total: updatedApps.length,
          pending: updatedApps.filter(app => app.applicationStatus === 1).length,
          reviewed: updatedApps.filter(app => app.applicationStatus === 2).length,
          accepted: updatedApps.filter(app => app.applicationStatus === 3).length,
          rejected: updatedApps.filter(app => app.applicationStatus === 4).length,
        };
        setStats(newStats);
      } else {
        toast.error(response.data.message || "Failed to update application status");
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
        
        return (
          app.userId?.toString().includes(searchTerm.toLowerCase()) ||
          app.applicationId?.toString().includes(searchTerm.toLowerCase()) ||
          jobTypeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          jobDetails.location?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }
    
    // Apply status filter
    if (statusFilter !== "all") {
      const statusMap = {
        "pending": 1,
        "reviewed": 2,
        "accepted": 3,
        "rejected": 4
      };
      filtered = filtered.filter(app => app.applicationStatus === statusMap[statusFilter]);
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case "date":
          aValue = new Date(a.applicationDate);
          bValue = new Date(b.applicationDate);
          break;
        case "status":
          aValue = a.applicationStatus;
          bValue = b.applicationStatus;
          break;
        case "jobId":
          aValue = a.jobId;
          bValue = b.jobId;
          break;
        default:
          aValue = a.applicationId;
          bValue = b.applicationId;
      }
      
      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    setFilteredApplications(filtered);
  }, [applications, searchTerm, statusFilter, sortBy, sortOrder, jobTypes, jobs]);

  // Initialize component
  useEffect(() => {
    const initializeComponent = async () => {
      try {
        // Get company ID from token or localStorage
        const token = localStorage.getItem("token");
        const userId = getUserIdFromToken(token);
        
        if (!userId || userId === 0) {
          setErrorMsg("User ID missing or invalid. Please log in again.");
          setIsLoading(false);
          return;
        }

        // First try to get companyId from localStorage
        let compId = localStorage.getItem("currentCompanyId");
        
        if (!compId) {
          // If not in localStorage, fetch from profile
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
          fetchJobTypes(),
          fetchCompanyJobs(compId),
          fetchApplications(compId)
        ]);

      } catch (error) {
        setErrorMsg("Failed to initialize component.");
        console.error("Component Initialization Error:", error);
        setIsLoading(false);
      }
    };

    initializeComponent();
  }, []);

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
      <div className="flex justify-center items-center min-h-screen text-red-600 text-lg">
        {errorMsg}
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
            <p className="text-gray-600">review applications for company's job postings</p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <StatsCard
              icon={<FaFileAlt />}
              label="Total Applications"
              value={stats.total}
              color="blue"
            />
            <StatsCard
              icon={<FaClock />}
              label="Pending"
              value={stats.pending}
              color="yellow"
            />
            <StatsCard
              icon={<FaCheck />}
              label="Accepted"
              value={stats.accepted}
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
                  placeholder="Search applications..."
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
                  <option value="pending">Pending</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="accepted">Accepted</option>
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
                  
                  return (
                    <div className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-3">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                              <FaUser className="text-blue-600 text-lg" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-800">
                              </h3>
                              <p className="text-sm text-gray-600"></p>
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
                                {formatDate(application.applicationDate)}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <StatusBadge status={application.applicationStatus} />
                          
                          {/* Action Buttons */}
                          <div className="flex gap-2">
                            {application.applicationStatus === 1 && (
                              <>
                                <button
                                  onClick={() => openReviewModal(application.applicationId, application.userId)}
                                  className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                                >
                                  <FaEye className="inline mr-1" />
                                  Review
                                </button>
                                <button
                                  onClick={() => updateApplicationStatus(application.applicationId, 3)}
                                  className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                                >
                                  <FaCheck className="inline mr-1" />
                                  Accept
                                </button>
                                <button
                                  onClick={() => updateApplicationStatus(application.applicationId, 4)}
                                  className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                                >
                                  <FaTimes className="inline mr-1" />
                                  Reject
                                </button>
                              </>
                            )}
                            
                            {application.applicationStatus === 2 && (
                              <>
                                <button
                                  onClick={() => openReviewModal(application.applicationId, application.userId)}
                                  className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                                >
                                  <FaEye className="inline mr-1" />
                                  View Details
                                </button>
                                <button
                                  onClick={() => updateApplicationStatus(application.applicationId, 3)}
                                  className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                                >
                                  <FaCheck className="inline mr-1" />
                                  Accept
                                </button>
                                <button
                                  onClick={() => updateApplicationStatus(application.applicationId, 4)}
                                  className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                                >
                                  <FaTimes className="inline mr-1" />
                                  Reject
                                </button>
                              </>
                            )}
                            
                            {(application.applicationStatus === 3 || application.applicationStatus === 4) && (
                              <>
                                <button
                                  onClick={() => openReviewModal(application.applicationId, application.userId)}
                                  className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                                >
                                  <FaEye className="inline mr-1" />
                                  View Details
                                </button>
                                <button
                                  onClick={() => updateApplicationStatus(application.applicationId, 1)}
                                  className="px-3 py-1 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                                >
                                  Reset to Pending
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
                    ? "No applications match your current filters." 
                    : "No applications have been submitted for your company's job postings yet."}
                </p>
                {(searchTerm || statusFilter !== "all") && (
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setStatusFilter("all");
                    }}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Clear Filters
                  </button>
                )}
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