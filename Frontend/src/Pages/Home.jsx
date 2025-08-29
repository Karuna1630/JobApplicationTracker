import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaLocationDot, FaDollarSign, FaCalendarDays, FaClock } from "react-icons/fa6";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import axiosInstance from "../Utils/axiosInstance";

// Company Card Component
const CompanyCard = ({ company, onClick }) => {
  const [logoError, setLogoError] = useState(false);

  return (
    <div
      onClick={onClick}
      className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition transform hover:scale-105 cursor-pointer"
    >
      <div className="w-full h-28 mb-4 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
        {!logoError && company.companyLogo ? (
          <img
            src={company.companyLogo}
            alt={company.companyName}
            className="w-full h-full object-cover"
            onError={() => setLogoError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500 text-xl font-bold">
            {company.companyName?.charAt(0) || "C"}
          </div>
        )}
      </div>
      <h3 className="font-bold text-lg text-blue-800 line-clamp-1">
        {company.companyName}
      </h3>
      <p className="text-sm text-gray-600 flex items-center gap-2 line-clamp-1">
          <FaLocationDot className="w-3 h-3 text-blue-500" />
        {company.location || "Location not specified"}
      </p>
      {company.websiteUrl && (
        <a
          href={company.websiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:underline mt-2 inline-block"
          onClick={(e) => e.stopPropagation()}
        >
          Visit Website
        </a>
      )}
    </div>
  );
};

const Home = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [loadingCompanies, setLoadingCompanies] = useState(false);
  const [jobTypes, setJobTypes] = useState([]);
  
  // Add authentication state
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [role, setRole] = useState(Number(localStorage.getItem("role")));

  // Update authentication status when localStorage changes
  useEffect(() => {
    const updateAuthStatus = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
      setRole(Number(localStorage.getItem("role")));
    };

    updateAuthStatus();

    // Listen for storage changes (e.g., login/logout in other tabs)
    window.addEventListener("storage", updateAuthStatus);

    return () => {
      window.removeEventListener("storage", updateAuthStatus);
    };
  }, []);

   const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Fetch job types
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
       console.error("Failed to fetch jobs", error);
    }
  };

  // Fetch jobs
  const fetchJobs = async () => {
    setLoadingJobs(true);
    try {
      const { data } = await axiosInstance.get("/api/Jobs");
      setJobs(Array.isArray(data) ? data : []);
    } catch (error) {
       console.error("Failed to fetch jobs", error);
      setJobs([]);
    } finally {
      setLoadingJobs(false);
    }
  };

  // Fetch companies
  const fetchCompanies = async () => {
    setLoadingCompanies(true);
    try {
      const { data } = await axiosInstance.get("/getallcompanies");
      setCompanies(Array.isArray(data) ? data : []);
    } catch (error) {
       console.error("Failed to fetch companies", error);
      setCompanies([]);
    } finally {
      setLoadingCompanies(false);
    }
  };

  // Main useEffect
  useEffect(() => {
    fetchJobs();
    fetchCompanies();
    fetchJobTypes();
  }, []);

  // Get job type name by ID
  const getJobTypeName = (jobTypeId) => {
    if (!jobTypeId || jobTypes.length === 0) return "Job Title";
    const jobType = jobTypes.find(jt => jt.id === parseInt(jobTypeId));
    return jobType ? jobType.name : `Job Type ${jobTypeId}`;
  };

  // Function to find company by ID
  const findCompanyById = (companyId) => {
    if (!companyId || companies.length === 0) return null;
    return companies.find(company => company.companyId === companyId);
  };

  // Function to handle job navigation with company data
  const handleJobClick = (job) => {
    if (!job || !job.jobId) return;

    const company = findCompanyById(job.companyId);
    
    navigate(`/job/${job.jobId}`, {
      state: {
        company: company,
        job: job
      }
    });
  };



  return (
    <>
      <Navbar />
      <div className="bg-gray-50 min-h-screen">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white py-20 px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">
            Track Your Job Applications Easily
          </h1>
          <p className="text-lg mb-6">
            Stay organized and take control of your job search — all in one place.
          </p>
          
          {/* Conditional rendering based on login status */}
          {!isLoggedIn && (
            <div className="space-x-4">
              <button
                onClick={() => navigate("/registercomp")}
                className="bg-white text-blue-700 font-semibold px-6 py-3 rounded-xl hover:bg-blue-100 transition-colors"
              >
                Get Started
              </button>
              <button
                onClick={() => navigate("/login")}
                className="bg-blue-800 text-white px-6 py-3 rounded-xl hover:bg-blue-900 transition-colors"
              >
                Login
              </button>
            </div>
          )}
        </div>

        {/* Top Companies */}
        <section className="py-20 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-800 mb-10">Top Companies</h2>
            {loadingCompanies ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {[...Array(10)].map((_, index) => (
                  <div key={index} className="bg-white p-6 rounded-xl shadow animate-pulse">
                    <div className="w-full h-28 mb-4 rounded-lg bg-gray-200"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : companies.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {companies.map((company) => (
                  <CompanyCard
                    key={company.companyId}
                    company={company}
                    onClick={() => navigate(`/company/${company.companyId}`)}
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center">No companies found.</p>
            )}
          </div>
        </section>

        {/* Top Jobs */}
        <section className="py-20 px-6 bg-gray-100">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-800 mb-10">Top Jobs</h2>
            {loadingJobs ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(15)].map((_, index) => (
                  <div key={index} className="bg-white p-6 rounded-xl shadow animate-pulse">
                    <div className="h-6 bg-gray-200 rounded mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2 w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2 w-1/3"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4 w-1/4"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            ) : jobs.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {jobs.map((job) => {
                  if (!job || !job.jobId) return null;

                  const company = findCompanyById(job.companyId);
                  
                  return (
                    <div
                      key={job.jobId}
                      className="bg-white p-6 rounded-xl shadow hover:shadow-xl transition transform hover:-translate-y-2 cursor-pointer"
                      onClick={() => handleJobClick(job)}
                    >
                      {/* Company Info */}
                      {company && (
                        <div className="flex items-center mb-4">
                          {company.companyLogo && (
                            <img
                              src={company.companyLogo}
                              alt={company.companyName}
                              className="w-10 h-10 rounded-lg mr-3 object-cover border"
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                          )}
                          <div>
                            <p className="text-xl font-bold text-blue-800">
                              {company.companyName}
                            </p>
                            <div>
                            <p className="text-sm text-gray-500">
                              {company.location}
                            </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Job Title */}
                      <h3 className="font-semibold text-xl mb-3 text-gray-800 line-clamp-2">
                        {getJobTypeName(job.jobType)}
                      </h3>

                      {/* Job Description Preview */}
                      {job.description && (
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {job.description.length > 100 
                            ? `${job.description.substring(0, 100)}...` 
                            : job.description
                          }
                        </p>
                      )}

                      {/* Job Details */}
                      <div className="space-y-2 mb-4">
                        {/* Location */}
                        {job.location && (
                          <div className="flex items-center text-sm text-gray-600">
                            <FaLocationDot className="w-4 h-4 mr-2 text-blue-500" />
                            {job.location}
                          </div>
                        )}

                        {/* Salary */}
                        {(job.salaryRangeMin && job.salaryRangeMax) && (
                          <div className="flex items-center text-sm text-gray-600">
                            <FaDollarSign className="w-4 h-4 mr-2 text-green-500" />
                            ${job.salaryRangeMin.toLocaleString()} - ${job.salaryRangeMax.toLocaleString()}
                          </div>
                        )}

                        {/* Posted Date */}
                        <div className="flex items-center text-sm text-gray-600">
                          <FaCalendarDays className="w-4 h-4 mr-2 text-purple-500" />
                          Posted: {formatDate(job.postedAt)}
                        </div>

                        {/* Application Deadline */}
                        <div className="flex items-center text-sm text-red-600">
                          <FaClock className="w-4 h-4 mr-2 text-red-500" />
                          Deadline: {formatDate(job.applicationDeadline)}
                        </div>
                      </div>

                      {/* View Details Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleJobClick(job);
                        }}
                        className="w-full bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition font-medium"
                      >
                        View Details
                      </button>
                    </div>
                  );
                }).filter(Boolean)}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-gray-400 text-2xl">💼</span>
                </div>
                <p className="text-gray-500 text-lg">No jobs found.</p>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section - Only show when not logged in */}
        {!isLoggedIn && (
          <section className="bg-blue-700 text-white py-20 px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Join hundreds managing their job search smartly
            </h2>
            <button
              onClick={() => navigate("/registercomp")}
              className="bg-white text-blue-700 font-semibold px-8 py-3 rounded-xl hover:bg-blue-100 transition-colors"
            >
              Sign Up Now
            </button>
          </section>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Home;