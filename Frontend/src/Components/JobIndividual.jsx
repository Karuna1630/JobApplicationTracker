import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  MapPin,
  Clock,
  Eye,
  Calendar,
  DollarSign,
  Briefcase,
  Users,
  Building,
  ExternalLink,
  ArrowLeft,
} from "lucide-react";
import axiosInstance from "../Utils/axiosInstance";
import Navbar from "./Navbar";
import Footer from "./Footer";

const JobIndividual = () => {
  const { jobId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [company, setCompany] = useState(null);
  const [jobTypes, setJobTypes] = useState([]);
  const [allSkills, setAllSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [companyLoading, setCompanyLoading] = useState(false);

  // Get company and job data from navigation state if available
  const passedCompany = location.state?.company;
  const passedJob = location.state?.job;

  // Get job type name by ID
  const getJobTypeName = (jobTypeId) => {
    const jobType = jobTypes.find((jt) => jt.id === parseInt(jobTypeId));
    return jobType ? jobType.name : `Job Type ${jobTypeId}`;
  };

  // Get skill names from skills string
  const getSkillNames = (skillsString) => {
    if (!skillsString || !allSkills.length) return [];

    try {
      const skillIds = JSON.parse(skillsString);
      if (!Array.isArray(skillIds)) return [];

      return skillIds
        .map((skillId) => {
          const skill = allSkills.find((s) => s.id === skillId);
          return skill ? skill.skillName : null;
        })
        .filter(Boolean);
    } catch (error) {
      console.error("Error parsing skills:", error);
      return [];
    }
  };

  // Check if job is active
  const isJobActive = (job) => {
    if (!job.applicationDeadline) return false;
    const deadlineDate = new Date(job.applicationDeadline);
    const today = new Date();
    deadlineDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    return deadlineDate >= today;
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Fetch Job Types
  const fetchJobTypes = async () => {
    try {
      const response = await axiosInstance.get("/getalljobtypes");
      if (response.data && Array.isArray(response.data)) {
        const mappedJobTypes = response.data.map((job) => ({
          id: job.jobTypeId,
          name: job.name,
        }));
        setJobTypes(mappedJobTypes);
      }
    } catch (error) {
      console.error("Error fetching job types:", error);
    }
  };

  // Fetch All Skills
  const fetchAllSkills = async () => {
    try {
      const response = await axiosInstance.get(`/api/skills/getallskills`);
      if (response.data && Array.isArray(response.data)) {
        const mappedSkills = response.data.map((skill) => ({
          id: skill.skillId,
          skillName: skill.skill,
        }));
        setAllSkills(mappedSkills);
      }
    } catch (error) {
      console.error("Error fetching all skills:", error);
    }
  };

  // ✅ Simplified fetchCompany
  const fetchCompany = async (companyId) => {
    if (!companyId) return;

    setCompanyLoading(true);
    try {
      const response = await axiosInstance.get(
        `/getcompanybyid?id=${companyId}`
      );
      setCompany(response.data || null);
    } catch (err) {
      console.error("Failed to fetch company:", err);
      setCompany(null);
    } finally {
      setCompanyLoading(false);
    }
  };

  // ✅ Simplified fetchJob (no fallback to /api/Jobs)
  const fetchJob = async () => {
    try {
      let jobData;

      // Use passed job if available and matches jobId
      if (passedJob && passedJob.jobId.toString() === jobId) {
        jobData = passedJob;
      } else {
        const response = await axiosInstance.get(
          `/api/Jobs/getjobsbyid?jobId=${jobId}`
        );
        jobData = response.data;
      }

      // Set job
      setJob(jobData);

      // Handle company
      if (passedCompany) {
        setCompany(passedCompany);
      } else if (jobData?.companyId) {
        await fetchCompany(jobData.companyId);
      }
    } catch (error) {
      console.error(`❌ Failed to fetch job with ID ${jobId}:`, error);
      setJob(null);
      setCompany(null);
    }
  };

  // Main fetch function
  useEffect(() => {
    const fetchData = async () => {
      if (!jobId) return;

      try {
        setLoading(true);
        setError(null);

        // Fetch job types and skills first
        await Promise.all([fetchJobTypes(), fetchAllSkills()]);

        // Then fetch job data (which will handle company data)
        await fetchJob();
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message || "Failed to load job details.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [jobId]);

  if (loading)
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading job details...</p>
            <p className="text-sm text-gray-400 mt-2">Job ID: {jobId}</p>
          </div>
        </div>
      </>
    );

  if (error)
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center max-w-md mx-auto p-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-red-600 text-2xl">⚠</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Job Not Found
            </h2>
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={() => navigate("/")}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Browse All Jobs
            </button>
          </div>
        </div>
      </>
    );

  if (!job)
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Briefcase className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-600 text-lg">Job not found.</p>
            <button
              onClick={() => navigate("/")}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Browse All Jobs
            </button>
          </div>
        </div>
      </>
    );

  const isActive = isJobActive(job);
  const jobTypeName = getJobTypeName(job.jobType);
  const skillNames = getSkillNames(job.skills);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white py-8">
        <div className="max-w-screen-2xl mx-auto px-4">
          {/* Job Header Banner */}
          <div className="relative bg-gradient-to-r from-blue-700 to-blue-800 rounded-lg shadow-lg p-8 mb-6 text-white">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-6">
                {/* Company Logo */}
                {company && company.companyLogo ? (
                  <img
                    src={company.companyLogo}
                    alt={company.companyName}
                    className="w-20 h-20 rounded-lg border-4 border-white shadow-lg bg-white object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-lg border-4 border-white shadow-lg bg-white flex items-center justify-center">
                    <Building className="w-8 h-8 text-gray-400" />
                  </div>
                )}

                {/* Job Info */}
                <div className="flex-1">
                  {/* Company Info */}
                  <div className="mb-4">
                    <h2 className="text-xl font-semibold text-blue-100 mb-1">
                      {company.companyName}
                    </h2>
                    <p className="text-blue-200 flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {company.location}
                    </p>
                  </div>
                </div>
              </div>

              {/* Status and Views */}
              <div className="flex flex-col items-end gap-3">
                <span
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>

            {/* Apply Button */}
            <div className="flex flex-row justify-between items-center mt-6">
              <h1 className="text-3xl font-bold mb-2">{jobTypeName}</h1>

              <button onClick={() => navigate("/jobApplicationForm")} 
                className="bg-white hover:bg-gray-100 text-blue-700 px-8 py-3 rounded-lg font-semibold transition-colors shadow-lg">
                Apply Now
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Job Description */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <span className="w-2 h-6 bg-blue-600 rounded-full mr-3"></span>
                  Job Description
                </h3>
                <div className="prose max-w-none text-gray-700">
                  {job.description  ? (
                    <div className="whitespace-pre-wrap leading-relaxed">
                      {job.description}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">
                      No description available.
                    </p>
                  )}
                </div>
              </div>

              {/* Required Skills */}
              {skillNames.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <span className="w-2 h-6 bg-green-600 rounded-full mr-3"></span>
                    Required Skills
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {skillNames.map((skillName, index) => (
                      <span
                        key={`skill-${index}`}
                        className="px-4 py-2 bg-gradient-to-r from-green-100 to-green-50 text-green-800 rounded-full text-sm font-medium border border-green-200 hover:shadow-md transition-shadow"
                      >
                        {skillName}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Requirements */}
              {(job.requirements) && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <span className="w-2 h-6 bg-purple-600 rounded-full mr-3"></span>
                    Requirements
                  </h3>
                  <div className="prose max-w-none text-gray-700">
                    <div className="whitespace-pre-wrap leading-relaxed">
                      {job.requirements}
                    </div>
                  </div>
                </div>
              )}

              {/* Responsibilities */}
              {job.responsibilities && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <span className="w-2 h-6 bg-orange-600 rounded-full mr-3"></span>
                    Responsibilities
                  </h3>
                  <div className="prose max-w-none text-gray-700">
                    <div className="whitespace-pre-wrap leading-relaxed">
                      {job.responsibilities}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Job Information */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Briefcase className="w-5 h-5 mr-2 text-blue-600" />
                  Job Information
                </h3>
                <div className="space-y-4">
                  <div className="border-l-4 border-blue-200 pl-4">
                    <h4 className="font-medium text-gray-800 flex items-center mb-1">
                      <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                      Location
                    </h4>
                    <p className="text-gray-600">
                      {job.location || "Not specified"}
                    </p>
                  </div>

                  <div className="border-l-4 border-green-200 pl-4">
                    <h4 className="font-medium text-gray-800 flex items-center mb-1">
                      <DollarSign className="w-4 h-4 mr-2 text-green-600" />
                      Salary
                    </h4>
                    <p className="text-gray-600">
                      {job.salaryRangeMin && job.salaryRangeMax
                        ? `${job.salaryRangeMin.toLocaleString()} - ${job.salaryRangeMax.toLocaleString()}`
                        : job.salary
                        ? `${job.salary.toLocaleString()}`
                        : "Not specified"}
                    </p>
                  </div>

                  <div className="border-l-4 border-purple-200 pl-4">
                    <h4 className="font-medium text-gray-800 flex items-center mb-1">
                      <Briefcase className="w-4 h-4 mr-2 text-purple-600" />
                      Experience Level
                    </h4>
                    <p className="text-gray-600">
                      {job.experienceLevel ||  "Not specified"}
                    </p>
                  </div>

                  <div className="border-l-4 border-orange-200 pl-4">
                    <h4 className="font-medium text-gray-800 flex items-center mb-1">
                      <Clock className="w-4 h-4 mr-2 text-orange-600" />
                      Employment Type
                    </h4>
                    <p className="text-gray-600">
                      {job.empolymentType ||  "Not specified"}
                    </p>
                  </div>

                  <div className="border-l-4 border-red-200 pl-4">
                    <h4 className="font-medium text-gray-800 flex items-center mb-1">
                      <Calendar className="w-4 h-4 mr-2 text-red-600" />
                      Application Deadline
                    </h4>
                    <p className="text-red-600 font-medium">
                      {formatDate(job.applicationDeadline)}
                    </p>
                  </div>

                  <div className="border-l-4 border-gray-200 pl-4">
                    <h4 className="font-medium text-gray-800 flex items-center mb-1">
                      <Calendar className="w-4 h-4 mr-2 text-gray-600" />
                      Posted Date
                    </h4>
                    <p className="text-gray-600">
                      {formatDate(
                        job.postedAt
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Company Information */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Building className="w-5 h-5 mr-2 text-blue-600" />
                  Company Information
                </h3>

                {companyLoading ? (
                  <div className="animate-pulse space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                        <div className="h-3 bg-gray-200 rounded w-20"></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  </div>
                ) : company ? (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      {company.companyLogo ? (
                        <img
                          src={company.companyLogo}
                          alt={company.companyName}
                          className="w-12 h-12 rounded-lg object-cover border"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                          <Building className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                      <div>
                        <h4 className="font-semibold text-gray-800">
                          {company.companyName}
                        </h4>
                        <p className="text-gray-600 text-sm">
                          {company.location}
                        </p>
                      </div>
                    </div>

                    {company.description && (
                      <div>
                        <h4 className="font-medium text-gray-800 mb-2">
                          About Company
                        </h4>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {company.description.length > 150
                            ? `${company.description.substring(0, 150)}...`
                            : company.description}
                        </p>
                      </div>
                    )}

                    {company.websiteUrl && (
                      <div>
                        <h4 className="font-medium text-gray-800 mb-2">
                          Website
                        </h4>
                        <a
                          href={company.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-sm flex items-center"
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          {company.websiteUrl.replace(/^https?:\/\//, "")}
                        </a>
                      </div>
                    )}

                    {company.contactEmail && (
                      <div>
                        <h4 className="font-medium text-gray-800 mb-2">
                          Contact
                        </h4>
                        <p className="text-gray-600 text-sm">
                          {company.contactEmail}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Building className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-sm">
                      Company information not available
                    </p>
                  </div>
                )}
              </div>

              {/* Apply Button (Mobile) */}
              <div className="lg:hidden">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                  Apply Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default JobIndividual;
