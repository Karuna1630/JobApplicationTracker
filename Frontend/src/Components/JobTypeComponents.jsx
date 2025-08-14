import React, { useState, useEffect } from "react";
import axiosInstance from "../Utils/axiosInstance";
import { toast } from "react-toastify";

const JobTypeComponents = ({ selectedJobType, onChange }) => {
  const [jobTypes, setJobTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all job types
  const fetchJobTypes = async () => {
    try {
      const response = await axiosInstance.get(`/getalljobtypes`);
      if (response.data && Array.isArray(response.data)) {
        // Map backend response
        const mappedJobTypes = response.data.map(job => ({
          id: job.jobTypeId,
          name: job.name
        }));
        setJobTypes(mappedJobTypes);
      } else {
        toast.error("Invalid job types data");
      }
    } catch (error) {
      console.error("Error fetching job types:", error);
      toast.error("Failed to load job types");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobTypes();
  }, []);

  if (loading) {
    return <p className="text-gray-500">Loading job types...</p>;
  }

  return (
    <select
      value={selectedJobType || ""}
      onChange={(e) => onChange(e.target.value)}
      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="">Select Job Type</option>
      {jobTypes.map((jobType) => (
        <option key={jobType.id} value={jobType.id}>
          {jobType.name}
        </option>
      ))}
    </select>
  );
};

export default JobTypeComponents;
