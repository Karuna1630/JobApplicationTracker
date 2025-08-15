import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import axiosInstance from "../Utils/axiosInstance";

const Home = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [loadingCompanies, setLoadingCompanies] = useState(false);
  const [errorJobs, setErrorJobs] = useState(null);
  const [errorCompanies, setErrorCompanies] = useState(null);
  const [imageErrors, setImageErrors] = useState(new Set()); // Track failed images

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoadingJobs(true);
        const response = await axiosInstance.get("/api/Jobs");
        setJobs(response.data || []);
      } catch (err) {
        console.error("Failed to fetch jobs", err);
        setErrorJobs("Failed to load jobs.");
      } finally {
        setLoadingJobs(false);
      }
    };

    const fetchCompanies = async () => {
      try {
        setLoadingCompanies(true);
        const response = await axiosInstance.get("/getallcompanies");
        setCompanies(response.data || []);
      } catch (err) {
        console.error("Failed to fetch companies", err);
        setErrorCompanies("Failed to load companies.");
      } finally {
        setLoadingCompanies(false);
      }
    };

    fetchJobs();
    fetchCompanies();
  }, []);

  // Handle image error with fallback prevention
  const handleImageError = (companyId, e) => {
    const imageKey = `company-${companyId}`;
    if (imageErrors.has(imageKey)) {
      // Already tried fallback, hide image completely
      e.currentTarget.style.display = 'none';
      return;
    }
    
    // Mark this image as failed and set fallback
    setImageErrors(prev => new Set(prev).add(imageKey));
    // Use a more reliable placeholder or data URL
    e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjEyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzlDQTNBRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkNvbXBhbnkgTG9nbzwvdGV4dD48L3N2Zz4=';
  };

  return (
    <>
      <Navbar />
      <div className="bg-gray-50 min-h-screen">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white py-20 px-4">
          <div className="max-w-5xl mx-auto text-center space-y-6">
            <h1 className="text-5xl font-bold">Track Your Job Applications Easily</h1>
            <p className="text-lg">Stay organized and take control of your job search — all in one place.</p>
            <div className="space-x-4">
              <button
                onClick={() => navigate("/registercomp")}
                className="bg-white text-blue-700 font-semibold px-6 py-3 rounded-xl hover:bg-blue-100"
              >
                Get Started
              </button>
              <button
                onClick={() => navigate("/login")}
                className="bg-blue-800 text-white px-6 py-3 rounded-xl hover:bg-blue-900"
              >
                Login
              </button>
            </div>
          </div>
        </div>

        {/* Top Companies */}
        <section className="py-20 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-800 mb-10 text-left">Top Companies</h2>

            {loadingCompanies && <p className="text-gray-500">Loading companies...</p>}
            {errorCompanies && <p className="text-red-500">{errorCompanies}</p>}

            {companies.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {companies.map((company) => (
                  <div
                    key={company.companyId}
                    className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition transform hover:scale-105 cursor-pointer"
                  >
                    <div className="w-full h-28 mb-4 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                      {company.companyLogo && company.companyLogo.startsWith("http") ? (
                        <img
                          src={company.companyLogo}
                          alt={company.companyName}
                          className="w-full h-full object-cover"
                          onError={(e) => handleImageError(company.companyId, e)}
                        />
                      ) : (
                        // Show a CSS-based placeholder instead of broken image
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                          {company.companyName?.charAt(0)?.toUpperCase() || 'C'}
                        </div>
                      )}
                    </div>
                    <h3 className="font-semibold text-lg text-blue-700 line-clamp-1">
                      {company.companyName}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-1">
                      {company.location || "Location not specified"}
                    </p>
                    {company.websiteUrl && (
                      <a
                        href={company.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline mt-2 inline-block"
                      >
                        Visit Website
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              !loadingCompanies && <p className="text-gray-500">No companies found.</p>
            )}
          </div>
        </section>

        {/* Top Jobs */}
        <section className="py-20 px-6 bg-gray-100">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-800 mb-10 text-left">Top Jobs</h2>

            {loadingJobs && <p className="text-gray-500">Loading jobs...</p>}
            {errorJobs && <p className="text-red-500">{errorJobs}</p>}

            {jobs.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {jobs.map((job) => (
                  <div
                    key={job.jobId}
                    className="bg-white p-6 rounded-xl shadow hover:shadow-xl transition transform hover:-translate-y-2"
                  >
                    <h3 className="font-semibold text-xl mb-2 text-blue-700 line-clamp-1">
                      {job.title}
                    </h3>
                    <p className="text-gray-600 mb-2 line-clamp-1">{job.companyName}</p>
                    <p className="text-gray-700 mb-1 line-clamp-1">{job.location}</p>
                    <p className="text-gray-500 text-sm">
                      Posted on: {job.postedDate ? new Date(job.postedDate).toLocaleDateString() : "—"}
                    </p>
                    <button
                      onClick={() => navigate(`/job/${job.jobId}`)}
                      className="mt-4 bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800"
                    >
                      View Details
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              !loadingJobs && <p className="text-gray-500">No jobs found.</p>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-blue-700 text-white py-20 px-4">
          <div className="max-w-5xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">Join hundreds managing their job search smartly</h2>
            <button
              onClick={() => navigate("/registercomp")}
              className="bg-white text-blue-700 font-semibold px-8 py-3 rounded-xl hover:bg-blue-100"
            >
              Sign Up Now
            </button>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default Home;