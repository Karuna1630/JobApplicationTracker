import React, { useState, useEffect } from "react";
import axiosInstance from "../Utils/axiosInstance";
import { getUserIdFromToken } from "../Utils/jwtUtils";
import ApplicationReceived from "./ApplicationReceived";
import PostJob from "./PostJob";
import CompanyInsight from "./CompanyInsight";
import Jobs from "./Jobs";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
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

const InfoCard = ({ icon, label, value, color = "gray" }) => (
  <div className="flex items-center bg-white shadow-md rounded-xl p-5 w-full sm:w-[260px] gap-4 border border-gray-100 hover:scale-[1.02] transition duration-300 ease-in-out">
    <div className={`text-3xl p-4 rounded-full bg-${color}-100 text-${color}-700 shadow-inner`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-gray-700">{value}</p>
    </div>
  </div>
);

const CompanyProfile = () => {
  const [showApplications, setShowApplications] = useState(false);
  const [showPostJob, setShowPostJob] = useState(false);
  const [showJobs, setShowJobs] = useState(false);
  const [showCompanyInsight, setShowCompanyInsight] = useState(false);
  const [reloadJobs, setReloadJobs] = useState(false);

  const [companyId, setCompanyId] = useState(null);
  const [companyInfo, setCompanyInfo] = useState({
    companyName: "",
    email: "",
    phone: "",
    location: "",
    description: "",
    firstName: "",
    lastName: "",
  });

  const [jobPosts, setJobPosts] = useState([]);
  const [totalJobsCount, setTotalJobsCount] = useState(0); // New state for total jobs count
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchProfileAndJobs = async () => {
      try {
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
            companyName: profileData.companyProfile.companyName || "Unnamed Company",
            description: profileData.companyProfile.description || "No description available",
            location: profileData.companyProfile.location || "No location",
            email: profileData.email || "No email provided",
            phone: profileData.phoneNumber || "No phone number",
            firstName: profileData.firstName || "No first name",
            lastName: profileData.lastName || "No last name",
            
          });

          const compId = profileData.companyProfile.companyId;
          setCompanyId(compId);

          // Fetch all jobs for the company to get the total count and display data
          const jobsResponse = await axiosInstance.get(`/api/Jobs/getjobsbycompanyid?companyId=${compId}`);
          const jobsData = jobsResponse.data;

          if (Array.isArray(jobsData) && jobsData.length > 0) {
            setTotalJobsCount(jobsData.length); // Set the total count
            setJobPosts(jobsData); // Set all jobs for potential use
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

  // Handle job posting success
  const handleJobPosted = (newJob) => {
    setJobPosts((prev) => [newJob, ...prev]); 
    setTotalJobsCount((prev) => prev + 1); // Increment the count
    setReloadJobs(prev => !prev); 
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

  // Get only the first 2 jobs for display in the Job Posts section
  const displayedJobs = jobPosts.slice(0, 2);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white flex items-center justify-center">
        <div className="w-full max-w-6xl bg-white rounded-2xl shadow-md overflow-hidden relative mb-12 mt-12">
          {/* Banner */}
          <div className="h-56 flex items-end justify-between px-6 py-4 relative bg-gradient-to-r from-indigo-300 to-pink-200">
            <div className="opacity-10 rounded-t-2xl"></div>
          </div>

          {/* Main Info */}
          <div className="pt-28 px-8 pb-4 relative z-30">
            <h2 className="text-3xl font-bold text-gray-800">{companyInfo.companyName}</h2>
            <p className="text-base text-gray-600 mt-2">{companyInfo.description}</p>
          </div>

          <hr className="border-gray-300 w-11/12 mx-auto mb-6" />

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 px-6 mb-6">
            <button
              onClick={() => setShowApplications(true)}
              className="px-4 bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-800 transition"
            >
              View Applications
            </button>

            <button
              onClick={() => setShowPostJob(true)}
              className="px-4 bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-800 transition"
            >
              Add Job
            </button>

            <button
              onClick={() => setShowJobs(true)}
              className="px-4 bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-800 transition"
            >
              Jobs ({totalJobsCount})
            </button>

            <button
              onClick={() => setShowCompanyInsight(true)}
              className="px-4 bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-800 transition"
            >
              Company Insights
            </button>
          </div>

          {/* Company Details */}
          <div className="px-12 pb-12 space-y-8 relative z-30 ">
            <section>
              <h3 className="text-xl font-semibold text-gray-700 mb-3">Company Information</h3>
              <ul className="flex flex-wrap gap-x-32 text-gray-600 text-lg">
                <li>
                  <strong>Recruiter Name:</strong>{" "}
                  <span>{companyInfo.firstName} {companyInfo.lastName}</span>
                </li>
                <li>
                  <strong>Email:</strong> <span>{companyInfo.email}</span>
                </li>
                <li>
                  <strong>Phone:</strong> <span>{companyInfo.phone}</span>
                </li>
                <li>
                  <strong>Location:</strong> <span>{companyInfo.location}</span>
                </li>
              </ul>
            </section>

            {/* Dashboard Cards */}
            <div className="bg-white rounded-2xl shadow-xl p-6 mb-12">
              <h2 className="text-2xl font-semibold mb-6 text-gray-700">Company Dashboard</h2>
              <div className="flex flex-wrap justify-center gap-6">
                <InfoCard icon={<FaSuitcase />} label="Total Jobs Posted" value={totalJobsCount} color="blue" />
                <InfoCard icon={<FaUsers />} label="Total Applications" value="1,240" color="green" />
                <InfoCard icon={<FaUserCheck />} label="Hired Candidates" value="120" color="indigo" />
                <InfoCard icon={<FaUserClock />} label="Pending Interviews" value="45" color="yellow" />
              </div>
            </div>

            {/* Job Posts Section - Show only first 2 jobs */}
            <div className="bg-white rounded-2xl shadow-xl p-6 mb-12">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-700">Recent Job Posts</h2>
                {totalJobsCount > 2 && (
                  <button
                    onClick={() => setShowJobs(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                  >
                    <FaEye />
                    View All ({totalJobsCount})
                  </button>
                )}
              </div>
              
              {displayedJobs.length > 0 ? (
                <div className="space-y-4">
                  {displayedJobs.map((job) => (
                    <div key={job.jobId || job.id} className="p-4 border rounded-xl hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-lg font-bold text-gray-800">
                          {job.title || job.jobTitle || 'Untitled Position'}
                        </h4>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            job.status === "A" || job.status === "active" || job.isActive
                              ? "bg-green-100 text-green-700"
                              : job.status === "I" || job.status === "inactive" || job.isActive === false
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {job.status === "A" || job.status === "active" || job.isActive ? "Active" : 
                           job.status === "I" || job.status === "inactive" || job.isActive === false ? "Inactive" : 
                           job.status || "Unknown"}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-2">
                        {job.description || job.jobDescription || 'No description available'}
                      </p>
                      <div className="flex gap-4 text-sm text-gray-500">
                        <span>📍 {job.location || job.jobLocation || 'Location not specified'}</span>
                        {(job.salaryRangeMin && job.salaryRangeMax) && (
                          <span>💰 ${job.salaryRangeMin.toLocaleString()} - ${job.salaryRangeMax.toLocaleString()}</span>
                        )}
                        {job.salary && (
                          <span>💰 ${job.salary.toLocaleString()}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FaSuitcase className="text-4xl text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No job posts available.</p>
                  <button
                    onClick={() => setShowPostJob(true)}
                    className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Post Your First Job
                  </button>
                </div>
              )}
            </div>

            {/* User Insights */}
            <div className="bg-white rounded-2xl shadow-xl p-6 mb-12">
              <h2 className="text-2xl font-semibold mb-6 text-gray-700">User Insights</h2>
              <div className="flex flex-wrap justify-center gap-6">
                <InfoCard icon={<FaUserTie />} label="Recruiters" value="18" color="purple" />
                <InfoCard icon={<FaGlobe />} label="Website Visitors" value="5,230" color="cyan" />
                <InfoCard icon={<FaChartLine />} label="HR Staff" value="6" color="pink" />
                <InfoCard icon={<FaUserPlus />} label="New Signups (30d)" value="14" color="orange" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showApplications && <ApplicationReceived onClose={() => setShowApplications(false)} />}
      {showPostJob && (
        <PostJob
          onClose={() => setShowPostJob(false)}
          onJobPosted={handleJobPosted}
        />
      )}

      {showJobs && (
        <Jobs
          onClose={() => setShowJobs(false)}
          reloadTrigger={reloadJobs}
          companyId={companyId}
        />
      )}
      {showCompanyInsight && <CompanyInsight onClose={() => setShowCompanyInsight(false)} />}

      <Footer />
    </>
  );
};

export default CompanyProfile;
