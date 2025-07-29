import React, { useEffect, useState } from "react";
import axiosInstance from "../Utils/axiosInstance";

const ManageJobs = ({ onClose }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    try {
      const res = await axiosInstance.get("/api/Jobs/getalljobs");
      setJobs(res.data);
    } catch (err) {
      console.error("Failed to fetch jobs", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  if (loading) return <div className="p-6 text-center">Loading jobs...</div>;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-4xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-lg"
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold mb-4">Manage Jobs</h2>
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
              <tr key={job.jobId} className="border-b">
                <td className="p-2">{job.title}</td>
                <td className="p-2">{job.location}</td>
                <td className="p-2">{job.salaryRangeMin} - {job.salaryRangeMax}</td>
                <td className="p-2">{new Date(job.applicationDeadline).toLocaleDateString()}</td>
                <td className="p-2">{job.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageJobs;
