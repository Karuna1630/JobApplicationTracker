import React, { useState, useEffect } from "react";
import axiosInstance from "../Utils/axiosInstance";
import { getUserIdFromToken } from "../Utils/jwtUtils";
import { toast } from "react-toastify";

const PostJob = ({ onClose, onJobPosted, companyId }) => {
  const [formData, setFormData] = useState({
    jobTypeId: "",
    description: "",
    requirements: "",
    location: "",
    salaryRangeMin: "",
    salaryRangeMax: "",
    empolymentType: "",     
    experienceLevel: "",
    applicationDeadline: "",
  });

  const [jobTypes, setJobTypes] = useState([]);
  const [loadingJobTypes, setLoadingJobTypes] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      } else {
        toast.error("Failed to load job types");
      }
    } catch (error) {
      console.error("Error fetching job types:", error);
      toast.error("Failed to load job types");
    } finally {
      setLoadingJobTypes(false);
    }
  };

  useEffect(() => {
    fetchJobTypes();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.jobTypeId ||
      !formData.description ||
      !formData.location ||
      !formData.empolymentType ||
      !formData.experienceLevel ||
      !formData.applicationDeadline
    ) {
      setErrorMsg("Please fill all required fields.");
      return;
    }

    const effectiveCompanyId = companyId || localStorage.getItem("currentCompanyId");
    if (!effectiveCompanyId) {
      setErrorMsg("Company ID is missing.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMsg("");

      const token = localStorage.getItem("token");
      if (!token) {
        setErrorMsg("You must be logged in to post a job.");
        setIsSubmitting(false);
        return;
      }

      const userId = getUserIdFromToken(token);
      if (!userId) {
        setErrorMsg("Invalid user token.");
        setIsSubmitting(false);
        return;
      }

      const payload = {
        JobId: 0,
        PostedByUserId: userId,
        CompanyId: parseInt(effectiveCompanyId),
        JobType: formData.jobTypeId,
        Description: formData.description,
        Requirements: formData.requirements || "",
        Location: formData.location,
        EmpolymentType: formData.empolymentType,
        SalaryRangeMin: formData.salaryRangeMin ? parseFloat(formData.salaryRangeMin) : 0,
        SalaryRangeMax: formData.salaryRangeMax ? parseFloat(formData.salaryRangeMax) : 0,
        ExperienceLevel: formData.experienceLevel,
        Status: "A",
        PostedAt: new Date().toISOString(),
        ApplicationDeadline: new Date(formData.applicationDeadline).toISOString(),
      };

      console.log("Sending payload:", payload);

      // Make the POST request
      const response = await axiosInstance.post("/api/Jobs/submitjobs", payload);

      if (response.status === 200 || response.status === 201) {
        toast.success("Job posted successfully!");
        
        if (onJobPosted && typeof onJobPosted === 'function') {
          onJobPosted(response.data);
        }
        
        onClose();
      } else {
        setErrorMsg("Failed to post job. Please try again.");
      }

    } catch (err) {
      console.error("Post job error:", err);
      const errorMessage = err.response?.data?.message || "Failed to post job. Please try again.";
      setErrorMsg(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-8 relative max-h-[90vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          ✖
        </button>

        <h2 className="text-2xl font-bold mb-6">Post a New Job</h2>

        {errorMsg && <p className="text-red-500 mb-4">{errorMsg}</p>}

        {/* Job Type Dropdown */}
        {loadingJobTypes ? (
          <p className="text-gray-500 mb-4">Loading job types...</p>
        ) : (
          <select
            name="jobTypeId"
            value={formData.jobTypeId}
            onChange={handleChange}
            className="border p-2 w-full mb-4 rounded"
            required
          >
            <option value="">Select Job Type *</option>
            {jobTypes.map((jobType) => (
              <option key={jobType.id} value={jobType.id}>
                {jobType.name}
              </option>
            ))}
          </select>
        )}

        <textarea
          name="description"
          placeholder="Job Description *"
          value={formData.description}
          onChange={handleChange}
          className="border p-2 w-full mb-4 rounded"
          rows={4}
          required
        />

        <textarea
          name="requirements"
          placeholder="Requirements"
          value={formData.requirements}
          onChange={handleChange}
          className="border p-2 w-full mb-4 rounded"
          rows={3}
        />

        <input
          name="location"
          placeholder="Location *"
          value={formData.location}
          onChange={handleChange}
          className="border p-2 w-full mb-4 rounded"
          required
        />

        <div className="flex gap-4 mb-4">
          <input
            name="salaryRangeMin"
            placeholder="Min Salary"
            type="number"
            value={formData.salaryRangeMin}
            onChange={handleChange}
            className="border p-2 flex-1 rounded"
          />
          <input
            name="salaryRangeMax"
            placeholder="Max Salary"
            type="number"
            value={formData.salaryRangeMax}
            onChange={handleChange}
            className="border p-2 flex-1 rounded"
          />
        </div>

        <select
          name="EmpolymentType"
          value={formData.empolymentType}
          onChange={handleChange}
          className="border p-2 w-full mb-4 rounded"
          required
        >
          <option value="">Select Employment Type *</option>
          <option value="Full-Time">Full-Time</option>
          <option value="Part-Time">Part-Time</option>
          <option value="Remote">Remote</option>
        </select>

        <select
          name="experienceLevel"
          value={formData.experienceLevel}
          onChange={handleChange}
          className="border p-2 w-full mb-4 rounded"
          required
        >
          <option value="">Select Experience Level *</option>
          <option value="Entry">Entry</option>
          <option value="Mid">Mid</option>
          <option value="Senior">Senior</option>
        </select>

        <input
          name="applicationDeadline"
          type="date"
          value={formData.applicationDeadline}
          onChange={handleChange}
          className="border p-2 w-full mb-6 rounded"
          min={new Date().toISOString().split("T")[0]}
          required
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-800 disabled:bg-gray-400 w-full"
        >
          {isSubmitting ? "Posting..." : "Post Job"}
        </button>
      </form>
    </div>
  );
};

export default PostJob;