import React, { useEffect, useState } from "react";
import axiosInstance from "../Utils/axiosInstance";

const Jobs = ({ onClose, reloadTrigger, companyId }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [workingEndpoint, setWorkingEndpoint] = useState("");

  const fetchJobs = async () => {
    try {
      if (!companyId) {
        console.log("No companyId provided");
        setError("No company ID provided");
        setLoading(false);
        return;
      }
      
      console.log("Fetching jobs for companyId:", companyId);
      
      // Use the correct working endpoint
      const endpoint = `/api/Jobs/getjobsbyid?id=${companyId}`;
      console.log(`Calling endpoint: ${endpoint}`);
      
      const res = await axiosInstance.get(endpoint);
      console.log(`✅ Success with endpoint: ${endpoint}`);
      setWorkingEndpoint(endpoint);
      
      // Handle the API response structure
      console.log("Jobs API response:", res.data);
      
      // Based on your working API, the response should be an array directly
      if (Array.isArray(res.data)) {
        console.log("Response is array, setting jobs directly");
        setJobs(res.data);
      } else {
        console.log("Unexpected response structure:", typeof res.data);
        setJobs([]);
      }
      
      // Clear any previous errors
      setError("");
      
    } catch (err) {
      console.error("Error fetching jobs:", err);
      
      // Enhanced error handling and messaging
      if (err.response) {
        console.error("Response status:", err.response.status);
        console.error("Response data:", err.response.data);
        console.error("Response headers:", err.response.headers);
        
        if (err.response.status === 404) {
          setError(`API endpoint not found. Please check if:\n1. Backend server is running\n2. API endpoint exists\n3. Company ID is valid: ${companyId}`);
        } else if (err.response.status === 500) {
          setError(`Server error. Please check backend logs.`);
        } else {
          setError(`API Error: ${err.response.status} - ${err.response.data?.message || 'Unknown error'}`);
        }
      } else if (err.request) {
        console.error("No response received:", err.request);
        setError("No response from server. Please check if the backend is running and accessible.");
      } else {
        console.error("Request setup error:", err.message);
        setError(`Request error: ${err.message}`);
      }
      
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("Jobs component mounted/updated with:", { companyId, reloadTrigger });
    if (companyId) {
      fetchJobs();
    } else {
      setLoading(false);
      setError("No company ID provided");
    }
  }, [reloadTrigger, companyId]);

  if (loading) return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-96 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-lg">Loading jobs...</p>
        <p className="text-sm text-gray-500 mt-2">Company ID: {companyId}</p>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-6xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
          title="Close"
        >
          ✕
        </button>
        
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Posted Jobs</h2>
        
        {/* Debug Info - Remove in production */}
        <div className="mb-4 p-3 bg-gray-50 rounded-lg text-sm border">
          <div className="grid grid-cols-2 gap-2">
            <p><strong>Company ID:</strong> {companyId || 'Not provided'}</p>
            <p><strong>Jobs Count:</strong> {jobs.length}</p>
            <p><strong>Reload Trigger:</strong> {reloadTrigger?.toString()}</p>
            <p><strong>Working Endpoint:</strong> {workingEndpoint || 'None found'}</p>
          </div>
          {error && (
            <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-700">
              <strong>Error:</strong> 
              <pre className="whitespace-pre-wrap text-xs mt-1">{error}</pre>
            </div>
          )}
        </div>

        {error ? (
          <div className="text-center p-6 bg-red-50 rounded-lg border border-red-200">
            <div className="text-red-600 mb-4">
              <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-semibold mb-2">Unable to Load Jobs</h3>
              <div className="text-sm">
                <pre className="whitespace-pre-wrap text-left bg-white p-3 rounded border max-w-md mx-auto">{error}</pre>
              </div>
            </div>
            <div className="space-x-2">
              <button 
                onClick={fetchJobs}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Retry
              </button>
              <button 
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center p-8">
            <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
            </svg>
            <p className="text-lg text-gray-500 mb-2">No jobs posted yet</p>
            <p className="text-sm text-gray-400">Jobs will appear here once they are created</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">
                Showing {jobs.length} job{jobs.length !== 1 ? 's' : ''}
              </p>
              <button 
                onClick={fetchJobs}
                className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
              >
                Refresh
              </button>
            </div>
            
            <div className="overflow-x-auto border rounded-lg">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="p-3 font-semibold text-gray-700">Title</th>
                    <th className="p-3 font-semibold text-gray-700">Description</th>
                    <th className="p-3 font-semibold text-gray-700">Location</th>
                    <th className="p-3 font-semibold text-gray-700">Salary Range</th>
                    <th className="p-3 font-semibold text-gray-700">Experience</th>
                    <th className="p-3 font-semibold text-gray-700">Deadline</th>
                    <th className="p-3 font-semibold text-gray-700">Status</th>
                    <th className="p-3 font-semibold text-gray-700">Posted</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job, index) => (
                    <tr key={job.jobId || job.id || index} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="p-3">
                        <div className="font-medium text-gray-900">
                          {job.title || job.jobTitle || 'No title'}
                        </div>
                      </td>
                      <td className="p-3">
                        <div 
                          className="max-w-xs truncate text-gray-600" 
                          title={job.description || job.jobDescription}
                        >
                          {job.description || job.jobDescription || 'No description'}
                        </div>
                      </td>
                      <td className="p-3 text-gray-600">
                        {job.location || job.jobLocation || 'Not specified'}
                      </td>
                      <td className="p-3 text-gray-600">
                        {job.salaryRangeMin && job.salaryRangeMax 
                          ? `$${job.salaryRangeMin.toLocaleString()} - $${job.salaryRangeMax.toLocaleString()}`
                          : job.salary 
                          ? `$${job.salary.toLocaleString()}`
                          : 'Not specified'
                        }
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                          {job.experienceLevel === 1 ? 'Entry Level' :
                           job.experienceLevel === 2 ? 'Mid Level' :
                           job.experienceLevel === 3 ? 'Senior Level' :
                           job.experience || 'Not specified'}
                        </span>
                      </td>
                      <td className="p-3 text-gray-600">
                        {job.applicationDeadline 
                          ? new Date(job.applicationDeadline).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })
                          : job.deadline
                          ? new Date(job.deadline).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })
                          : 'Not specified'
                        }
                      </td>
                      <td className="p-3">
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
                      </td>
                      <td className="p-3 text-gray-600">
                        {job.postedAt || job.createdAt || job.datePosted
                          ? new Date(job.postedAt || job.createdAt || job.datePosted).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })
                          : 'Not specified'
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;