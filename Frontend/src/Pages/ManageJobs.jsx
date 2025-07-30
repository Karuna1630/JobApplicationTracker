import React, { useEffect, useState } from "react";
import axiosInstance from "../Utils/axiosInstance";

const ManageJobs = ({ onClose, reloadTrigger, companyId }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    try {
      if (!companyId) return;
      const res = await axiosInstance.get(`/api/Jobs/getjobsbyid?id=${companyId}`);
      setJobs(res.data);
    } catch (err) {
      console.error("Failed to fetch jobs", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [reloadTrigger, companyId]);

  if (loading) return <div className="p-6 text-center">Loading jobs...</div>;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-4xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-lg">✕</button>
        <h2 className="text-2xl font-bold mb-4">Manage Jobs</h2>
        {jobs.length === 0 ? (
          <p className="text-center text-gray-500">No jobs posted yet.</p>
        ) : (
          <table className="w-full text-left border">
            <thead>
              <tr className="border-b bg-gray-100">
                <th className="p-2">Title</th>
                <th className="p-2">Location</th>
                <th className="p-2">Salary</th>
                <th className="p-2">Deadline</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.jobId} className="border-b hover:bg-gray-50">
                  <td className="p-2">{job.title}</td>
                  <td className="p-2">{job.location}</td>
                  <td className="p-2">{job.salaryRangeMin} - {job.salaryRangeMax}</td>
                  <td className="p-2">{new Date(job.applicationDeadline).toLocaleDateString()}</td>
                  <td className="p-2">
                    <span className={`px-3 py-1 rounded-full text-sm ${job.status === "A" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>
                      {job.status === "A" ? "Active" : "Inactive"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
export default ManageJobs;
