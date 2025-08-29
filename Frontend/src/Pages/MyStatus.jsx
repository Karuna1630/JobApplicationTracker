import React, { useState, useEffect } from 'react';
import { User, Briefcase, Building, Filter } from 'lucide-react';
import axiosInstance from '../Utils/axiosInstance';
import { getUserIdFromToken } from "../Utils/jwtUtils";
import { toast } from "react-toastify";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import UserSidebarMenu from "../Components/UserSidebarMenu";

const MyStatus = () => {
  const [userId, setUserId] = useState('');
  const [applications, setApplications] = useState([]);
  const [jobTypes, setJobTypes] = useState({});
  const [companies, setCompanies] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Get user ID from token on component mount
  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      const userIdFromToken = getUserIdFromToken(token);
      if (userIdFromToken) {
        setUserId(userIdFromToken);
        fetchAllApplicationsData(userIdFromToken);
      }
    }
  }, []);

  // Fetch job types and return the map
  const fetchJobTypes = async () => {
    try {
      const response = await axiosInstance.get('/getalljobtypes');
      console.log('Job Types API Response:', response.data);
      const jobTypesMap = {};

      if (response.data && Array.isArray(response.data)) {
        response.data.forEach(jobType => {
          jobTypesMap[jobType.jobTypeId] = jobType.name;
        });
      }

      console.log('Job Types Map:', jobTypesMap);
      return jobTypesMap;
    } catch (error) {
      console.error('Error fetching job types:', error);
      return {};
    }
  };

  // Fetch all companies and create a map
  const fetchAllCompanies = async () => {
    try {
      const response = await axiosInstance.get('/getallcompanies');
      console.log('Companies API Response:', response.data);
      const companiesMap = {};

      if (response.data && Array.isArray(response.data)) {
        response.data.forEach(company => {
          companiesMap[company.companyId] = company;
        });
      }

      console.log('Companies Map:', companiesMap);
      return companiesMap;
    } catch (error) {
      console.error('Error fetching companies:', error);
      return {};
    }
  };

  // Fetch all jobs and create a map
  const fetchAllJobs = async () => {
    try {
      const response = await axiosInstance.get('/api/Jobs');
      console.log('Jobs API Response:', response.data);
      const jobsMap = {};

      if (response.data && Array.isArray(response.data)) {
        response.data.forEach(job => {
          jobsMap[job.jobId] = job;
        });
      }

      console.log('Jobs Map:', jobsMap);
      return jobsMap;
    } catch (error) {
      console.error('Error fetching jobs:', error);
      return {};
    }
  };

  // Enhanced fetch applications
  const fetchApplicationsByUserId = async (userIdValue) => {
    try {
      const endpoint = `/getjobapplicationsbyuserid?userId=${userIdValue}`;
      const response = await axiosInstance.get(endpoint);
      console.log('Applications API Response:', response.data);

      if (response.data && response.data.data && Array.isArray(response.data.data)) {
        return response.data.data;
      } else if (response.data && Array.isArray(response.data)) {
        return response.data;
      } else if (response.data) {
        return [response.data];
      } else {
        return [];
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      throw error;
    }
  };

  // Process applications with all the data
  const processApplicationsData = async (applicationsData, jobTypesMap, companiesMap, jobsMap) => {
    if (!applicationsData || applicationsData.length === 0) {
      return [];
    }

    return applicationsData.map((app, index) => {
      const job = jobsMap[app.jobId];
      const company = job ? companiesMap[job.companyId] : null;
      const jobTypeName = job ? jobTypesMap[parseInt(job.jobType)] : null;

      // Extract company name and location using correct API property names
      const companyName = company?.companyName || 'Unknown Company';
      const companyLocation = company?.location || 'Location not specified';
      const companyLogo = company?.companyLogo || null;

      // FIXED: Determine status and color from applicationStatus
      let status = 'Applied';
      let statusColor = 'bg-yellow-100 text-yellow-800';

      if (app.applicationStatus !== undefined && app.applicationStatus !== null) {
        switch (parseInt(app.applicationStatus)) {
          case 1:
            status = 'Applied';
            statusColor = 'bg-yellow-100 text-yellow-800';
            break;
          case 2:
            status = 'Approved';
            statusColor = 'bg-green-100 text-green-800';
            break;
          case 3:
            status = 'Rejected';
            statusColor = 'bg-red-100 text-red-800';
            break;
          default:
            status = 'Applied';
            statusColor = 'bg-yellow-100 text-yellow-800';
            break;
        }
      }

      // Create a job title from available job data
      const jobTitle = job?.jobTitle ||
        job?.title ||
        job?.description ||
        jobTypeName ||
        'Job Position';

      const processedApp = {
        ...app,
        status,
        jobTitle: jobTitle,
        companyName,
        companyLocation,
        companyLogo: companyLogo,
        jobTypeName: jobTypeName || 'Not specified',
        statusColor,
        applicationId: app.applicationId || app.id || 'N/A',
        salary: job ? `$${job.salaryRangeMin} - $${job.salaryRangeMax}` : null,
        description: job?.description || null
      };

      console.log(`Final processed app ${index + 1}:`, processedApp);
      return processedApp;
    });
  };

  // Main function to fetch all data
  const fetchAllApplicationsData = async (userIdValue) => {
    if (!userIdValue) return;

    setLoading(true);
    setError('');

    try {
      // Fetch all required data in parallel
      const [jobTypesMap, companiesMap, jobsMap, applicationsData] = await Promise.all([
        fetchJobTypes(),
        fetchAllCompanies(),
        fetchAllJobs(),
        fetchApplicationsByUserId(userIdValue)
      ]);
      // Store the maps in state
      setJobTypes(jobTypesMap);
      setCompanies(companiesMap);

      // Process applications with all the data
      const processedApplications = await processApplicationsData(
        applicationsData,
        jobTypesMap,
        companiesMap,
        jobsMap
      );

      setApplications(processedApplications);
      console.log('Final processed applications:', processedApplications);

    } catch (err) {
      console.error('API Error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Unknown error occurred';
      setError(`Error fetching applications: ${errorMessage}`);
      toast.error("Failed to fetch applications");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    if (userId) {
      fetchAllApplicationsData(userId);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";

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
      return "Date error";
    }
  };

  const getInitials = (name) => {
    if (!name) return 'NA';
    const words = name.split(' ');
    return words.length > 1 ? `${words[0][0]}${words[1][0]}` : words[0].substring(0, 2);
  };

  const getAvatarColor = (index) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-purple-500',
      'bg-orange-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-teal-500',
      'bg-red-500'
    ];
    return colors[index % colors.length];
  };

  // Helper function to render company logo or initials
  const renderCompanyAvatar = (application, index) => {
    // Check if company logo exists and is valid
    if (application.companyLogo) {
      return (
        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200 flex-shrink-0">
          <img
            src={application.companyLogo}
            alt={`${application.companyName} logo`}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback to initials if image fails to load
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div
            className={`w-full h-full rounded-full flex items-center justify-center text-white text-sm font-medium ${getAvatarColor(index)} hidden`}
          >
            {getInitials(application.companyName)}
          </div>
        </div>
      );
    }

    // Fallback to initials
    return (
      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-sm font-medium ${getAvatarColor(index)} flex-shrink-0`}>
        {getInitials(application.companyName)}
      </div>
    );
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white p-6">
        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-64 py-28">
            <UserSidebarMenu />
          </div>
          <div className="w-full max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900 mb-1">My Job Applications</h1>
                <p className="text-gray-600">View your job application status and details</p>
              </div>

              {userId && (
                <button
                  onClick={handleRefresh}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm font-medium transition-colors"
                >
                  {loading ? 'Refreshing...' : 'Refresh'}
                </button>
              )}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            {loading && (
              <div className="flex justify-center items-center py-20">
                <div className="text-center">
                  <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading applications...</p>
                </div>
              </div>
            )}

            {/* Applications Cards Container */}
            {applications.length > 0 && !loading && (
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                <div className="space-y-4">
                  {applications.map((application, index) => (
                    <div key={application.applicationId} className="bg-gray-50 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                      <div className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4">
                            {/* Company Avatar/Logo */}
                            {renderCompanyAvatar(application, index)}

                            {/* Main Info */}
                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                    {application.jobTitle}
                                  </h3>
                                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                                    <div className="flex items-center space-x-1">
                                      <Building className="w-4 h-4" />
                                      <span>{application.companyName}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <Briefcase className="w-4 h-4" />
                                      <span>{application.jobTypeName}</span>
                                    </div>
                                  </div>
                                  <p className="text-sm text-gray-500 mb-3">
                                    {application.companyLocation}
                                  </p>
                                </div>

                                {/* Status */}
                                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${application.statusColor}`}>
                                  {application.status}
                                </span>
                              </div>

                              {/* Additional Details */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-100">
                                <div>
                                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Applied Date</p>
                                  <p className="text-sm text-gray-900">
                                    {formatDate(application.applicationDate)}
                                  </p>
                                </div>

                                {application.salary && (
                                  <div>
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Salary</p>
                                    <p className="text-sm text-gray-900">{application.salary}</p>
                                  </div>
                                )}
                              </div>

                              {/* Description if available - ONLY BOTTOM SECTION */}
                              {application.description && (
                                <div className="mt-3">
                                  <p className="text-sm text-gray-600 line-clamp-2">{application.description}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {applications.length === 0 && !loading && !error && userId && (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center border">
                <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Applications Found</h3>
                <p className="text-gray-500">
                  You haven't applied to any jobs yet, or your applications are still pending review.
                </p>
              </div>
            )}

            {/* Authentication Required */}
            {!userId && !loading && (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center border">
                <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Authentication Required</h3>
                <p className="text-gray-500">
                  Please log in to view your job applications.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MyStatus;