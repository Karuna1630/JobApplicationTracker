import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import axiosInstance from "../Utils/axiosInstance";

const CompanyIndividual = () => {
  const { companyId } = useParams(); // gets /company/:companyId
  const [searchParams] = useSearchParams();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(false);

  const activeTab = searchParams.get("tab") || "about";

  useEffect(() => {
    const fetchCompany = async () => {
      setLoading(true);
      try {
        const { data } = await axiosInstance.get(`/getcompany/${companyId}`);
        setCompany(data);
      } catch (err) {
        console.error("Failed to fetch company", err);
      } finally {
        setLoading(false);
      }
    };

    if (companyId) fetchCompany();
  }, [companyId]);

  if (loading) return <p>Loading...</p>;
  if (!company) return <p>No company found</p>;

  return (
    <div className="company-page">
      {/* Top section with logo + name */}
      <div className="company-header bg-blue-600 text-white p-6 rounded-lg">
        <div className="flex items-center gap-4">
          <img
            src={company.companyLogo || "/placeholder.png"}
            alt={company.companyName}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div>
            <h1 className="text-xl font-bold">{company.companyName}</h1>
            <p>{company.location}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs flex gap-6 mt-4 border-b">
        <button className={activeTab === "about" ? "font-bold" : ""}>
          About
        </button>
        <button className={activeTab === "jobs" ? "font-bold" : ""}>
          Jobs ({company.jobs?.length || 0})
        </button>
      </div>

      {/* Tab content */}
      <div className="tab-content mt-4">
        {activeTab === "about" && (
          <div>
            <h2 className="font-semibold">About {company.companyName}</h2>
            <p>{company.description || "No description available."}</p>
          </div>
        )}

        {activeTab === "jobs" && (
          <div className="grid gap-4">
            {company.jobs && company.jobs.length > 0 ? (
              company.jobs.map((job) => (
                <div
                  key={job.jobId}
                  className="border p-4 rounded-lg shadow-sm"
                >
                  <h3 className="font-semibold">{job.title}</h3>
                  <p>{job.description}</p>
                  <p className="text-sm text-gray-500">{job.location}</p>
                </div>
              ))
            ) : (
              <p>No jobs available.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyIndividual;
