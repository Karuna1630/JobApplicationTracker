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
} from "react-icons/fa";

const InfoCard = ({ icon, label, value, color = "gray" }) => (
  <div className="flex items-center bg-white shadow-md rounded-xl p-5 w-full sm:w-[260px] gap-4 border border-gray-100 hover:scale-[1.02] transition duration-300 ease-in-out">
    <div className={text-3xl p-4 rounded-full bg-${color}-100 text-${color}-700 shadow-inner}>
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

  const [jobPosts, setJobPosts] = useState([]); // New state for jobs
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

        const profileResponse = await axiosInstance.get(/profile/${userId});
        const profileData = profileResponse.data;

        if (profileData && profileData.companyProfile) {
          setCompanyInfo({
            companyName: profileData.companyProfile.companyName || "Unnamed Company",
            description: profileData.companyProfile.description || "No description available",
            location: profileData.companyProfile.location || "No location",
            email: profileData.email || "No email provided",
            phone: profileData.jobSeekerProfile?.phoneNumber || "No phone number",
            firstName: profileData.jobSeekerProfile?.firstName || "No first name",
            lastName: profileData.jobSeekerProfile?.lastName || "No last name",
          });

          const compId = profileData.companyProfile.companyId;
          setCompanyId(compId);

          const jobsResponse = await axiosInstance.get(/getcompanybyid?id=${compId});
          const jobsData = jobsResponse.data;

          if (jobsData.jobs) {
            setJobPosts(jobsData.jobs);
          } else {
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
             Jobs
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
                <InfoCard icon={<FaSuitcase />} label="Total Jobs Posted" value={jobPosts.length} color="blue" />
                <InfoCard icon={<FaUsers />} label="Total Applications" value="1,240" color="green" />
                <InfoCard icon={<FaUserCheck />} label="Hired Candidates" value="120" color="indigo" />
                <InfoCard icon={<FaUserClock />} label="Pending Interviews" value="45" color="yellow" />
              </div>
            </div>

            {/* Job Posts Section */}
            <div className="bg-white rounded-2xl shadow-xl p-6 mb-12">
              <h2 className="text-2xl font-semibold mb-6 text-gray-700">Job Posts</h2>
              {jobPosts.length > 0 ? (
                <ul className="space-y-4">
                  {jobPosts.map((job) => (
                    <li key={job.jobId} className="p-4 border rounded-xl hover:bg-gray-50">
                      <h4 className="text-lg font-bold">{job.title}</h4>
                      <p className="text-gray-600">{job.description}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No job posts available.</p>
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
          onJobPosted={(newJob) => {
            setJobPosts((prev) => [newJob, ...prev]); 
            setReloadJobs(prev => !prev); 
          }}
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
