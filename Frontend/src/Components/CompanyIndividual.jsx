import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../Utils/axiosInstance";

const CompanyIndividual = () => {
  const { companyId } = useParams();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCompany = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/getcompanybyid?id=${companyId}`);
      setCompany(response.data || {});
    } catch (err) {
      console.error("Failed to fetch company", err);
      setError("Failed to load company details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (companyId) fetchCompany();
  }, [companyId]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!company) return null;

  return (
    <div className="max-w-6xl mx-auto bg-gray-50 min-h-screen pb-10">
      {/* Banner */}
      <div className="relative">
        <div className="h-40 md:h-56 bg-blue-700"></div>
        <div className="absolute -bottom-12 left-10">
          <img
            src={company.companyLogo}
            alt={company.companyName}
            className="w-28 h-28 rounded-lg border-4 border-white shadow-lg"
          />
        </div>
      </div>

      {/* Company Name + Location */}
      <div className="mt-16 px-10">
        <h1 className="text-3xl font-bold">{company.companyName}</h1>
        <p className="text-gray-500">{company.location}</p>
      </div>

      {/* Content Section */}
      <div className="mt-8 px-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* About Us */}
        <div className="md:col-span-2 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-3">About Us</h2>
          <p className="text-gray-700 leading-relaxed">
            {company.description || "No description available."}
          </p>
        </div>

        {/* More Info */}
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="text-xl font-semibold mb-3">More Info</h2>

          <div>
            <h3 className="font-medium text-gray-800">📍 Location</h3>
            <p className="text-gray-600">{company.location}</p>
          </div>

          <div>
            <h3 className="font-medium text-gray-800">🌐 Website</h3>
            {company.websiteUrl ? (
              <a
                href={company.websiteUrl}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600"
              >
                {company.websiteUrl}
              </a>
            ) : (
              <p className="text-gray-500">Not Available</p>
            )}
          </div>

          <div>
            <h3 className="font-medium text-gray-800">📧 Contact</h3>
            <p className="text-gray-600">{company.contactEmail}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyIndividual;
