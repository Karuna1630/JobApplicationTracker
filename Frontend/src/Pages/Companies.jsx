import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import axiosInstance from "../Utils/axiosInstance";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

const Companies = () => {
   const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await axiosInstance.get("/getallcompanies");
        const companiesData = response.data;
        
        setCompanies(companiesData);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch companies", err);
        setError("Failed to load companies. Please try again later.");
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  // Generate dynamic logo based on company name
  const generateLogo = (companyName) => {
    return `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(companyName)}`;
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-300 flex items-center justify-center">
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
        <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-300 flex items-center justify-center">
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
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-300 flex flex-col">
        <div className="w-full max-w-6xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Companies</h1>
            <p className="text-gray-600">Discover amazing companies and their opportunities</p>
          </div>

          {companies.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-xl text-gray-600">No companies found</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {companies.map((company) => (
                <div
                  key={company.id || company.companyId}
                  className="border rounded-2xl p-6 bg-white shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-1"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={company.logo || generateLogo(company.name || company.companyName)}
                      alt={`${company.name || company.companyName} logo`}
                      className="w-16 h-16 object-contain rounded-lg"
                      onError={(e) => {
                        e.target.src = generateLogo(company.name || company.companyName);
                      }}
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {(company.name || company.companyName || '').replace(/[<>]/g, '')}
                      </h3>
                      {company.industry && (
                        <p className="text-sm text-gray-600">{company.industry.replace(/[<>]/g, '')}</p>
                      )}
                    </div>
                  </div>

                  {company.description && (
                    <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                      {company.description.replace(/[<>]/g, '')}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-2 mb-4">
                    {company.location && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        📍 {company.location.replace(/[<>]/g, '')}
                      </span>
                    )}
                    {company.size && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        👥 {company.size.toString().replace(/[<>]/g, '')}
                      </span>
                    )}
                    {company.founded && (
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                        📅 {company.founded.toString().replace(/[<>]/g, '')}
                      </span>
                    )}
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                      {company.jobCount || company.openPositions ? (
                        <span>{company.jobCount || company.openPositions} open positions</span>
                      ) : (
                        <span>View opportunities</span>
                      )}
                    </div>
                    <button onClick={() => navigate('/jobs')} className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition duration-300">
                      View Jobs
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Companies;