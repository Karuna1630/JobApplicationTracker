import React, { useEffect, useState } from "react";
import axiosInstance from "../Utils/axiosInstance";

const Jobs = ({ onClose, reloadTrigger, companyId }) => {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        if (!companyId) {
          setErrorMsg("No company ID provided");
          return;
        }
        
        const response = await axiosInstance.get(/api/Jobs/getjobsbycompanyid?companyId=${companyId});
        const jobsData = response.data;

        if (Array.isArray(jobsData) && jobsData.length > 0) {
          setJobs(jobsData);
        } else {
          setJobs([]);
          setErrorMsg("No jobs found for this company.");
        }
      } catch (error) {
        setErrorMsg("Failed to fetch jobs.");
        console.error("Jobs Fetch Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, [reloadTrigger, companyId]);

  if (isLoading) return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-96 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-lg">Loading jobs...</p>
      </div>
    </div>
  );

  if (errorMsg) return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-96 text-center">
        <div className="text-red-600 mb-4">
          <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-semibold mb-2">Error</h3>
          <p className="text-sm">{errorMsg}</p>
        </div>
        <button 
          onClick={onClose}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl relative max-h-[95vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">
            Job Details ({jobs.length} {jobs.length === 1 ? 'Job' : 'Jobs'})
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 text-xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            title="Close"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {jobs.length === 0 ? (
            <div className="text-center p-8">
              <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
              </svg>
              <p className="text-lg text-gray-500 mb-2">No jobs found</p>
              <p className="text-sm text-gray-400">This company hasn't posted any jobs yet</p>
            </div>
          ) : (
            <div className="space-y-6">
              {jobs.map((job, index) => (
                <div key={job.jobId || job.id || index} className="bg-gray-50 rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-800 flex-1">
                      {job.title || job.jobTitle || 'Untitled Position'}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ml-4 ${
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
                  
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-700 mb-2">Description:</h4>
                    <p className="text-gray-600 leading-relaxed">
                      {job.description || job.jobDescription || 'No description available'}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm mb-4">
                    <div>
                      <span className="font-semibold text-gray-700">Location:</span>
                      <p className="text-gray-600 mt-1">{job.location || job.jobLocation || 'Not specified'}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Salary:</span>
                      <p className="text-gray-600 mt-1">
                        {job.salaryRangeMin && job.salaryRangeMax 
                          ? $${job.salaryRangeMin.toLocaleString()} - $${job.salaryRangeMax.toLocaleString()}
                          : job.salary 
                          ? $${job.salary.toLocaleString()}
                          : 'Not specified'
                        }
                      </p>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Experience:</span>
                      <span className="block px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 mt-1 w-fit">
                        {job.experienceLevel === 1 ? 'Entry Level' :
                         job.experienceLevel === 2 ? 'Mid Level' :
                         job.experienceLevel === 3 ? 'Senior Level' :
                         job.experience || 'Not specified'}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Job Type:</span>
                      <p className="text-gray-600 mt-1">{job.jobType || job.type || 'Not specified'}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm pt-4 border-t border-gray-200">
                    <div>
                      <span className="font-semibold text-gray-700">Application Deadline:</span>
                      <p className="text-gray-600 mt-1">
                        {job.applicationDeadline 
                          ? new Date(job.applicationDeadline).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })
                          : job.deadline
                          ? new Date(job.deadline).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })
                          : 'Not specified'
                        }
                      </p>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Posted Date:</span>
                      <p className="text-gray-600 mt-1">
                        {job.postedAt || job.createdAt || job.datePosted
                          ? new Date(job.postedAt || job.createdAt || job.datePosted).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })
                          : 'Not specified'
                        }
                      </p>
                    </div>
                  </div>

                  {/* Additional fields if available */}
                  {(job.requirements || job.qualifications || job.skills) && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h4 className="font-semibold text-gray-700 mb-2">Requirements:</h4>
                      <p className="text-gray-600 text-sm">
                        {job.requirements || job.qualifications || job.skills}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Jobs;
