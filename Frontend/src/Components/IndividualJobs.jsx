import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Eye, Calendar, DollarSign, Briefcase, Users, Building } from 'lucide-react';
import axiosInstance from '../Utils/axiosInstance';
import Navbar from "./Navbar";
import Footer from "./Footer";

const IndividualJobs = ({ companyId = 1 }) => {
  const [jobsData, setJobsData] = useState([]);
  const [companyData, setCompanyData] = useState(null);
  const [jobTypes, setJobTypes] = useState([]);
  const [allSkills, setAllSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('jobs'); // 'about' or 'jobs'

  // Get job type name by ID - same as Jobs component
  const getJobTypeName = (jobTypeId) => {
    const jobType = jobTypes.find(jt => jt.id === parseInt(jobTypeId));
    return jobType ? jobType.name : `Job Type ${jobTypeId}`;
  };

  // Get skill names from skills string - same as Jobs component
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

  // Check if job is active - same as Jobs component
  const isJobActive = (job) => {
    if (!job.applicationDeadline) return false;
    const deadlineDate = new Date(job.applicationDeadline);
    const today = new Date();
    // Normalize times for day comparison
    deadlineDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    return deadlineDate >= today;
  };

  // Fetch Job Types - same as Jobs component
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

  // Fetch All Skills - same as Jobs component
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
    const fetchData = async () => {
      try {
        // Fetch job types and skills first - same pattern as Jobs component
        await Promise.all([fetchJobTypes(), fetchAllSkills()]);
        
        // Fetch jobs by company ID
        const jobsResponse = await axiosInstance.get(`/api/Jobs/getjobsbycompanyid?companyId=${companyId}`);
        setJobsData(jobsResponse.data);
        
        // Fetch company details
        const companyResponse = await axiosInstance.get(`/getcompanybyid?id=${companyId}`);
        setCompanyData(companyResponse.data);
        
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [companyId]);

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatSalary = (min, max) => {
    if (min && max) {
      return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
    }
    return "Not specified";
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!companyData) return null;

  return (
    <>
      <Navbar/>
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white py-10">
        <div className="max-w-screen-2xl mx-auto">
          <div className="relative bg-blue-700 h-48 flex items-center px-10 mt-2">
            <img
              src={companyData.companyLogo}
              alt={companyData.companyName}
              className="w-28 h-28 rounded-lg border-4 border-white shadow-lg bg-white"
            />

            {/* Company Info */}
            <div className="ml-6 text-white">
              <h1 className="text-2xl font-bold">{companyData.companyName}</h1>
              <p className="text-gray-200">{companyData.location}</p>
            </div>
          </div>

          {/* Tabs (About, Jobs) - matching CompanyIndividual */}
          <div className="flex border-b px-10 bg-white">
            <button 
              onClick={() => setActiveTab('about')}
              className={`py-3 px-6 font-semibold ${activeTab === 'about' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
            >
              About
            </button>
            <button 
              onClick={() => setActiveTab('jobs')}
              className={`py-3 px-6 font-semibold ${activeTab === 'jobs' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
            >
              Jobs ({jobsData.length})
            </button>
          </div>

          {/* Content Section - matching CompanyIndividual structure */}
          <div className="mt-6 px-10 grid grid-cols-1 lg:grid-cols-4 gap-6">
            {activeTab === 'about' ? (
              <>
                {/* About Us */}
                <div className="lg:col-span-3 bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold mb-3">About Us</h2>
                  <p className="text-gray-700 leading-relaxed">
                    {companyData.description || "No description available."}
                  </p>
                </div>

                {/* More Info */}
                <div className="bg-white rounded-lg shadow p-6 space-y-4">
                  <h2 className="text-xl font-semibold mb-3">More Info</h2>

                  <div>
                    <h3 className="font-medium text-gray-800">📍 Location</h3>
                    <p className="text-gray-600">{companyData.location}</p>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-800">🌐 Website</h3>
                    {companyData.websiteUrl ? (
                      <a
                        href={companyData.websiteUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600"
                      >
                        {companyData.websiteUrl}
                      </a>
                    ) : (
                      <p className="text-gray-500">Not Available</p>
                    )}
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-800">📧 Contact</h3>
                    <p className="text-gray-600">{companyData.contactEmail}</p>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-800">💼 Total Jobs</h3>
                    <p className="text-gray-600">{jobsData.length} {jobsData.length === 1 ? 'position' : 'positions'} available</p>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Jobs Section */}
                <div className="lg:col-span-3 bg-white rounded-lg shadow p-6 ">
                  <h2 className="text-xl font-semibold mb-3">Available Jobs ({jobsData.length})</h2>
                  
                  {jobsData.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                        <Briefcase className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No Jobs Available</h3>
                      <p className="text-gray-600">This company hasn't posted any jobs yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {jobsData.map((job) => {
                        const isActive = isJobActive(job);
                        const jobTypeName = getJobTypeName(job.jobType);
                        const skillNames = getSkillNames(job.skills);

                        return (
                          <div key={job.jobId} className="p-6 border rounded-xl hover:bg-gray-50 transition">
                            {/* Title & Status - matching Jobs component style */}
                            <div className="flex items-start justify-between mb-4">
                              <h2 className="text-xl font-semibold text-gray-800 flex-1">
                                {jobTypeName}
                              </h2>
                              <div className="flex items-center gap-2 ml-4">
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                                    isActive
                                      ? "bg-green-100 text-green-700"
                                      : "bg-red-100 text-red-700"
                                  }`}
                                >
                                  {isActive ? "Active" : "Inactive"}
                                </span>
                                <div className="flex items-center space-x-2 text-sm text-gray-500">
                                  <Eye className="w-4 h-4" />
                                  <span>{job.views || 0}</span>
                                </div>
                              </div>
                            </div>

                            <p className="text-blue-600 font-medium mb-4">{companyData?.companyName}</p>
                            
                            {/* Description - matching Jobs component style */}
                            <div className="mb-4">
                              <h3 className="font-semibold text-gray-700 mb-2">Description:</h3>
                              <p className="text-gray-600 leading-relaxed">
                                {job.description || job.jobDescription || "No description available"}
                              </p>
                            </div>

                            {/* Skills Section - matching Jobs component style */}
                            {skillNames.length > 0 && (
                              <div className="mb-4">
                                <h3 className="font-semibold text-gray-700 mb-2">Required Skills:</h3>
                                <div className="flex flex-wrap gap-2">
                                  {skillNames.map((skillName, skillIndex) => (
                                    <span
                                      key={`skill-${job.jobId}-${skillIndex}`}
                                      className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium border border-green-200"
                                    >
                                      {skillName}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Job Details - matching Jobs component style */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm mb-4">
                              <div>
                                <span className="font-semibold text-gray-700">Location:</span>
                                <p className="text-gray-600 mt-1">
                                  {job.location || job.jobLocation || "Not specified"}
                                </p>
                              </div>
                              <div>
                                <span className="font-semibold text-gray-700">Salary:</span>
                                <p className="text-gray-600 mt-1">
                                  {job.salaryRangeMin && job.salaryRangeMax
                                    ? `$${job.salaryRangeMin.toLocaleString()} - $${job.salaryRangeMax.toLocaleString()}`
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

                            {/* Dates - matching Jobs component style */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm pt-4 border-t border-gray-200 mb-4">
                              <div>
                                <span className="font-semibold text-gray-700">Application Deadline:</span>
                                <p className="text-gray-600 mt-1">
                                  {formatDate(job.applicationDeadline || job.deadline)}
                                </p>
                              </div>
                              <div>
                                <span className="font-semibold text-gray-700">Posted Date:</span>
                                <p className="text-gray-600 mt-1">
                                  {formatDate(job.postedAt || job.createdAt || job.datePosted)}
                                </p>
                              </div>
                            </div>

                            {/* Requirements - matching Jobs component style */}
                            {(job.requirements || job.qualifications) && (
                              <div className="mb-4 pt-4 border-t border-gray-200">
                                <h3 className="font-semibold text-gray-700 mb-2">Requirements:</h3>
                                <p className="text-gray-600 text-sm">
                                  {job.requirements || job.qualifications}
                                </p>
                              </div>
                            )}

                            {/* Action Buttons */}
                            <div className="mt-4 flex space-x-3">
                              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                                Apply Now
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* More Info Sidebar for Jobs Tab */}
                <div className="bg-white rounded-lg shadow p-6 space-y-4">
                  <h2 className="text-xl font-semibold mb-3">Company Info</h2>

                  <div>
                    <h3 className="font-medium text-gray-800">📍 Location</h3>
                    <p className="text-gray-600">{companyData.location}</p>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-800">🌐 Website</h3>
                    {companyData.websiteUrl ? (
                      <a
                        href={companyData.websiteUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600"
                      >
                        {companyData.websiteUrl}
                      </a>
                    ) : (
                      <p className="text-gray-500">Not Available</p>
                    )}
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-800">📧 Contact</h3>
                    <p className="text-gray-600">{companyData.contactEmail}</p>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-800">💼 Total Jobs</h3>
                    <p className="text-gray-600">{jobsData.length} {jobsData.length === 1 ? 'position' : 'positions'} available</p>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-800">📄 About Company</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {companyData.description && companyData.description.length > 100 
                        ? `${companyData.description.substring(0, 100)}...` 
                        : companyData.description || "No description available."
                      }
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default IndividualJobs;