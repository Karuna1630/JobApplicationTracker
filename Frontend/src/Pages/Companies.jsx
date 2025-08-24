import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaLocationDot } from "react-icons/fa6";
import axiosInstance from "../Utils/axiosInstance";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

const Companies = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [jobTypes, setJobTypes] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [companiesRes, jobTypesRes, jobsRes] = await Promise.all([
          axiosInstance.get("/getallcompanies"),
          axiosInstance.get("/getalljobtypes"),
          axiosInstance.get("/api/Jobs"),
        ]);

        setCompanies(companiesRes.data || []);
        setJobTypes(jobTypesRes.data || []);
        setJobs(jobsRes.data || []);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch data", err);
        setError("Failed to load companies. Please try again later.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Get company initials for logo placeholder
  const getCompanyInitials = (companyName) => {
    if (!companyName) return "CO";
    return companyName
      .split(" ")
      .slice(0, 2)
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase();
  };

  // Get jobs for a specific company
  const getCompanyJobs = (companyId) => {
    return jobs
      .filter((job) => job.companyId === companyId)
      .map((job) => {
        const jobType = jobTypes.find(
          (jt) => jt.jobTypeId === parseInt(job.jobType)
        );
        return {
          ...job,
          jobTypeName: jobType?.name || "Unknown Job Type",
        };
      });
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <div className="text-xl text-gray-700">Loading companies...</div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white flex items-center justify-center">
          <div className="text-center">
            <div className="text-xl text-red-600 mb-4">{error}</div>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300"
            >
              Try Again
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Companies</h1>
            <p className="text-gray-600">
              Discover amazing companies and their opportunities
            </p>
          </div>

          {companies.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-xl text-gray-600">No companies found</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {companies.map((company) => {
                const companyJobs = getCompanyJobs(company.companyId);

                return (
                  <div
                    key={company.companyId}
                    onClick={() => navigate(`/company/${company.companyId}`)}
                    className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer p-6 border-2 border-blue-200 hover:border-blue-400 transform hover:-translate-y-2 hover:scale-[1.02] group"
                  >
                    {/* Company Header */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                        {company.companyLogo ? (
                          <img
                            src={company.companyLogo }
                            alt={`${company.companyName} logo`}
                            className="w-12 h-12 object-contain rounded"
                            onError={(e) => {
                              e.target.style.display = "none";
                              e.target.nextSibling.style.display = "block";
                            }}
                          />
                        ) : null}
                        <span
                          className={`text-white font-bold text-xl ${
                            company.companyLogo || company.logo
                              ? "hidden"
                              : "block"
                          }`}
                        >
                          {getCompanyInitials(company.companyName)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-gray-800 truncate group-hover:text-blue-800 transition-colors duration-300">
                          {company.companyName}
                        </h3>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <FaLocationDot className="text-blue-500 text-xs" />
                          {company.location || "Location not specified"}
                        </p>
                      </div>
                    </div>

                    {/* Job Types */}
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        Available Positions:
                      </h4>
                      {companyJobs.length > 0 ? (
                        <div className="space-y-2">
                          {companyJobs.slice(0, 3).map((job) => (
                            <div
                              key={job.jobId}
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/job/${job.jobId}`);
                              }}
                              className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg hover:from-blue-50 hover:to-blue-100 transition-all duration-300 cursor-pointer border border-transparent hover:border-blue-200 transform hover:scale-[1.01]"
                            >
                              <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700">
                                {job.jobTypeName}
                              </span>
                              <span className="text-xs text-gray-500 flex items-center gap-1">
                                <FaLocationDot className="text-blue-400" />
                                {job.location}
                              </span>
                            </div>
                          ))}
                          {companyJobs.length > 3 && (
                            <div className="text-sm text-blue-600 font-semibold bg-blue-50 px-3 py-1 rounded-full inline-block">
                              +{companyJobs.length - 3} more positions
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">
                          No current openings
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Companies;
