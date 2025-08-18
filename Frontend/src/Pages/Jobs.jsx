import React, { useEffect, useState } from "react";
import { FaSuitcase } from "react-icons/fa";
import axiosInstance from "../Utils/axiosInstance";
import SidebarMenu from "../Components/SidebarMenu";
import PostJob from "./PostJob";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

const Jobs = ({ reloadTrigger, companyId: propCompanyId }) => {
  const [showPostJob, setShowPostJob] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [jobTypes, setJobTypes] = useState([]);
  const [allSkills, setAllSkills] = useState([]); // ✅ Add skills state
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [localReloadTrigger, setLocalReloadTrigger] = useState(0);

  // Get companyId from props or localStorage
  const getCompanyId = () => {
    if (propCompanyId) return propCompanyId;

    // Get from localStorage (set by CompanyProfile)
    const storedCompanyId = localStorage.getItem('currentCompanyId');
    return storedCompanyId;
  };

  const companyId = getCompanyId();

  const getJobTypeName = (jobTypeId) => {
    const jobType = jobTypes.find(jt => jt.id === parseInt(jobTypeId));
    return jobType ? jobType.name : `Job Type ${jobTypeId}`;
  };

  // ✅ New function to get skill names from skill IDs
  const getSkillNames = (skillsString) => {
    if (!skillsString || !allSkills.length) return [];
    
    try {
      // Parse the skills JSON string [1,2,3] to get skill IDs
      const skillIds = JSON.parse(skillsString);
      if (!Array.isArray(skillIds)) return [];
      
      // Map skill IDs to skill names
      return skillIds
        .map(skillId => {
          const skill = allSkills.find(s => s.id === skillId);
          return skill ? skill.skillName : null;
        })
        .filter(Boolean); // Remove null values
    } catch (error) {
      console.error('Error parsing skills:', error);
      return [];
    }
  };

  const isJobActive = (job) => {
    if (!job.applicationDeadline) return false;
    const deadlineDate = new Date(job.applicationDeadline);
    const today = new Date();
    // Normalize times for day comparison
    deadlineDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    return deadlineDate >= today;
  };

  // Fetch Job Types
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

  // ✅ Fetch all available skills
  const fetchAllSkills = async () => {
    try {
      const response = await axiosInstance.get(`/api/skills/getallskills`);
      if (response.data && Array.isArray(response.data)) {
        const mappedSkills = response.data.map(skill => ({
          id: skill.skillId,
          skillName: skill.skill
        }));
        setAllSkills(mappedSkills);
      }
    } catch (error) {
      console.error('Error fetching all skills:', error);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        // Fetch job types and skills first
        await Promise.all([fetchJobTypes(), fetchAllSkills()]);

        if (!companyId) {
          if (isMounted) {
            setErrorMsg("No company ID found. Please ensure you're logged in properly.");
            setIsLoading(false);
          }
          return;
        }

        const response = await axiosInstance.get(
          `/api/Jobs/getjobsbycompanyid?companyId=${companyId}`
        );
        const jobsData = response.data;

        if (isMounted) {
          if (Array.isArray(jobsData) && jobsData.length > 0) {
            setJobs(jobsData);
            setErrorMsg("");
          } else {
            setJobs([]);
            setErrorMsg("No jobs found for this company.");
          }
        }
      } catch (error) {
        if (isMounted) {
          console.error("Jobs Fetch Error:", error);

          if (error.response?.status === 401) {
            setErrorMsg("Authentication failed. Please log in again.");
          } else if (error.response?.status === 404) {
            setErrorMsg("No jobs found for this company.");
          } else if (error.response?.status >= 500) {
            setErrorMsg("Server error. Please try again later.");
          } else {
            setErrorMsg("Failed to fetch jobs. Please try again.");
          }
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [reloadTrigger, companyId, localReloadTrigger]);

  // Handle job posting success - FIXED VERSION
  const handleJobPosted = (newJob) => {
    // Add the new job to the existing jobs array
    setJobs((prev) => [newJob, ...prev]);
    
    // Trigger a refetch to ensure data consistency
    setLocalReloadTrigger(prev => prev + 1);
  };

  // Filter jobs based on search term and status
  const filteredJobs = jobs.filter((job) => {
    const jobTypeName = getJobTypeName(job.jobType);
    const skillNames = getSkillNames(job.skills);
    
    const matchesSearch =
      !searchTerm ||
      (job.title || job.jobTitle || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (job.description || job.jobDescription || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (job.location || job.jobLocation || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      jobTypeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      skillNames.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())); // ✅ Added skills to search

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && isJobActive(job)) ||
      (filterStatus === "inactive" && !isJobActive(job));

    return matchesSearch && matchesStatus;
  });

  const handleDeleteJob = async (jobId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this job? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      // Call the new API endpoint
      await axiosInstance.delete(`/api/Jobs/delete/${jobId}`);

      // Remove the deleted job from state
      setJobs((prevJobs) => prevJobs.filter((job) => (job.jobId || job.id) !== jobId));
      alert("Job deleted successfully!");
    } catch (error) {
      console.error("Delete job error:", error);
      alert(
        error.response?.data?.message ||
        "Failed to delete job. Please try again."
      );
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="bg-white rounded-2xl shadow-lg p-6 w-96 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg">Loading jobs...</p>
        </div>
      </div>
    );

  if (errorMsg && jobs.length === 0)
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="bg-white rounded-2xl shadow-lg p-6 w-96 text-center">
          <div className="text-red-600 mb-4">
            <svg
              className="w-12 h-12 mx-auto mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-lg font-semibold mb-2">Error</h3>
            <p className="text-sm">{errorMsg}</p>
          </div>
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-row bg-gradient-to-br from-blue-100 to-white py-10">
        {/* Sidebar */}
        <div className="p-6 w-fit">
          <SidebarMenu />
        </div>

        {/* Main Content */}
        <div className="m-2 ml-8 w-4/5 max-w-6xl mx-auto gap-4">
          {/* Page Title */}
          <div className="relative bg-white shadow-xl rounded-2xl p-8 mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Job Management</h1>
            <p className="text-gray-600">
              Showing {filteredJobs.length} of {jobs.length}{" "}
              {jobs.length === 1 ? "Job" : "Jobs"}
            </p>
            <button
              onClick={() => setShowPostJob(true)}
              className="px-4 absolute top-9 right-10  bg-blue-600 text-white font-semibold py-2 rounded-xl hover:bg-blue-800 "
            >
              Add Job
            </button>
          </div>

          {/* Search + Filter */}
          {jobs.length > 0 && (
            <div className="bg-white shadow-xl rounded-2xl p-8 mb-8">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search jobs by title, description, location, or skills..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="sm:w-48">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active Only</option>
                    <option value="inactive">Inactive Only</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Jobs List */}
          <div className="bg-white shadow-xl rounded-2xl p-8 mb-8">
            {filteredJobs.length === 0 ? (
              jobs.length === 0 ? (
                // Case 1: No jobs at all
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
              ) : (
                // Case 2: Jobs exist but none match search/filter
                <div className="text-center py-8">
                  <svg
                    className="w-16 h-16 mx-auto text-gray-300 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6"
                    />
                  </svg>
                  <p className="text-gray-500">No jobs match your search criteria.</p>
                </div>
              )
            ) : (
              <div className="space-y-6">
                {filteredJobs.map((job, index) => {
                  const jobId = job.jobId || job.id;
                  const isActive = isJobActive(job);
                  const jobTypeName = getJobTypeName(job.jobType);
                  const skillNames = getSkillNames(job.skills); // ✅ Get skill names

                  return (
                    <div
                      key={jobId || index}
                      className="p-6 border rounded-xl hover:bg-gray-50 transition"
                    >
                      {/* Title & Status */}
                      <div className="flex items-start justify-between mb-4">
                        <h2 className="text-xl font-semibold text-gray-800 flex-1">
                          {jobTypeName}
                        </h2>
                        <div className="flex items-center gap-2 ml-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                              }`}
                          >
                            {isActive ? "Active" : "Inactive"}
                          </span>
                          <button
                            onClick={() => handleDeleteJob(jobId)}
                            className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>

                      {/* Description */}
                      <div className="mb-4">
                        <h3 className="font-semibold text-gray-700 mb-2">Description:</h3>
                        <p className="text-gray-600 leading-relaxed">
                          {job.description ||
                            job.jobDescription ||
                            "No description available"}
                        </p>
                      </div>

                      {/* ✅ Skills Section */}
                      {skillNames.length > 0 && (
                        <div className="mb-4">
                          <h3 className="font-semibold text-gray-700 mb-2">Required Skills:</h3>
                          <div className="flex flex-wrap gap-2">
                            {skillNames.map((skillName, skillIndex) => (
                              <span
                                key={`skill-${jobId}-${skillIndex}`}
                                className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium border border-green-200"
                              >
                                {skillName}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Job Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm mb-4">
                        <div>
                          <span className="font-semibold text-gray-700">Location:</span>
                          <p className="text-gray-600 mt-1">
                            {job.location ||
                              job.jobLocation ||
                              "Not specified"}
                          </p>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-700">Salary:</span>
                          <p className="text-gray-600 mt-1">
                            {job.salaryRangeMin && job.salaryRangeMax
                              ?  `$${job.salaryRangeMin.toLocaleString()} - $${job.salaryRangeMax.toLocaleString()}`
                              : job.salary
                                ? `$${job.salary.toLocaleString()}`
                                : "Not specified"}
                          </p>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-700">Experience Level:</span>
                          <span className="block px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 mt-1 w-fit">
                            {job.experienceLevel || job.experience || "Not specified"}
                          </span>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-700">Employment Type:</span>
                          <span className="block px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800 mt-1 w-fit">
                            {job.empolymentType || job.employType || "Not specified"}
                          </span>
                        </div>
                      </div>

                      {/* Dates */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm pt-4 border-t border-gray-200">
                        <div>
                          <span className="font-semibold text-gray-700">Application Deadline:</span>
                          <p className="text-gray-600 mt-1">
                            {job.applicationDeadline
                              ? new Date(job.applicationDeadline).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })
                              : job.deadline
                                ? new Date(job.deadline).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })
                                : "Not specified"}
                          </p>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-700">Posted Date:</span>
                          <p className="text-gray-600 mt-1">
                            {job.postedAt || job.createdAt || job.datePosted
                              ? new Date(
                                job.postedAt ||
                                job.createdAt ||
                                job.datePosted
                              ).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })
                              : "Not specified"}
                          </p>
                        </div>
                      </div>

                      {/* Requirements */}
                      {(job.requirements || job.qualifications) && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <h3 className="font-semibold text-gray-700 mb-2">Requirements:</h3>
                          <p className="text-gray-600 text-sm">
                            {job.requirements ||
                              job.qualifications}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {showPostJob && (
        <PostJob
          onClose={() => setShowPostJob(false)}
          onJobPosted={handleJobPosted}
          companyId={companyId}
        />
      )}
      <Footer />
    </>
  );
};

export default Jobs;