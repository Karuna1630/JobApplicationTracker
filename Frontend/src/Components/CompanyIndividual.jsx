import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../Utils/axiosInstance";
import Navbar from "./Navbar";
import Footer from "./Footer";

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
    <>
    <Navbar/>
    <div className="max-w-6xl mx-auto bg-gray-50 min-h-screen mb-12">
      {/* Banner */}
      <div className="relative bg-blue-700 h-48 flex items-center px-10 mt-5">
        {/* Logo */}
        <img
          src={company.companyLogo}
          alt={company.companyName}
          className="w-28 h-28 rounded-lg border-4 border-white shadow-lg bg-white"
        />

        {/* Company Info */}
        <div className="ml-6 text-white">
          <h1 className="text-2xl font-bold">{company.companyName}</h1>
          <p className="text-gray-200">{company.location}</p>
        </div>
      </div>

      {/* Tabs (About, Jobs) */}
      <div className="flex border-b px-10 bg-white">
        <button className="py-3 px-6 text-blue-600 font-semibold border-b-2 border-blue-600">
          About
        </button>
        <button className="py-3 px-6 text-gray-600 hover:text-blue-600">
          Jobs
        </button>
      </div>

      {/* Content Section */}
      <div className="mt-6 px-10 grid grid-cols-1 md:grid-cols-3 gap-6">
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
    <Footer/>
    </>
  );
};

export default CompanyIndividual;
