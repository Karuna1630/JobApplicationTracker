import React, { useState, useEffect } from 'react';
import { MapPin, Building, Globe, Calendar, DollarSign, Briefcase, Clock, Eye } from 'lucide-react';

const IndividualCompany = ({ companyId = "1" }) => {
  const [activeTab, setActiveTab] = useState('about');
  const [companyData, setCompanyData] = useState(null);
  const [companyJobs, setCompanyJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        setLoading(true);

        // ✅ Fetch company details
        const companyResponse = await fetch(`/getcompanybyid?id=${companyId}`);
        if (companyResponse.ok) {
          const company = await companyResponse.json();
          setCompanyData(company);
        }

        // ✅ Fetch jobs by company id
        const jobsResponse = await fetch(`/api/Jobs/getjobsbyid?id=${companyId}`);
        if (jobsResponse.ok) {
          const jobs = await jobsResponse.json();
          setCompanyJobs(Array.isArray(jobs) ? jobs : [jobs]); // handle both array or single obj
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (companyId) fetchCompanyData();
  }, [companyId]);

  const formatSalary = (min, max) => {
    if (!min && !max) return 'Salary not disclosed';
    if (min && max) return `NRs. ${min.toLocaleString()} - ${max.toLocaleString()} Monthly`;
    if (min) return `NRs. ${min.toLocaleString()}+ Monthly`;
    return 'Salary not disclosed';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Loading company details...</p>
      </div>
    );
  }

  if (!companyData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Company not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-900 px-6 py-10">
        <div className="flex items-center space-x-6">
          <div className="w-24 h-24 bg-white rounded-lg p-2 shadow">
            {companyData.companyLogo ? (
              <img
                src={companyData.companyLogo}
                alt={companyData.companyName}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-blue-100 rounded">
                <span className="text-blue-600 text-2xl font-bold">
                  {companyData.companyName?.charAt(0) || "C"}
                </span>
              </div>
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">{companyData.companyName}</h1>
            <p className="text-blue-100">{companyData.description}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 flex space-x-6">
          <button
            onClick={() => setActiveTab('about')}
            className={`py-3 px-2 ${activeTab === 'about' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
          >
            About
          </button>
          <button
            onClick={() => setActiveTab('jobs')}
            className={`py-3 px-2 ${activeTab === 'jobs' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
          >
            Jobs
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Section */}
        <div className="lg:col-span-2">
          {activeTab === 'about' && (
            <div className="bg-white p-6 rounded shadow">
              <h2 className="text-2xl font-bold mb-4">About Us</h2>
              <p className="text-gray-700 mb-4">
                {companyData.description || "No description available"}
              </p>

              {companyData.websiteUrl && (
                <p className="text-sm text-blue-600">
                  <a href={companyData.websiteUrl} target="_blank" rel="noreferrer">
                    <Globe className="inline w-4 h-4 mr-1" /> {companyData.websiteUrl}
                  </a>
                </p>
              )}
            </div>
          )}

          {activeTab === 'jobs' && (
            <div>
              <h2 className="text-2xl font-bold mb-4">
                Jobs at {companyData.companyName} ({companyJobs.length})
              </h2>

              {companyJobs.length === 0 ? (
                <div className="bg-white p-6 rounded shadow text-center">
                  <p>No jobs available</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {companyJobs.map((job) => (
                    <div key={job.jobId} className="bg-white p-6 rounded shadow">
                      <h3 className="text-xl font-semibold">{job.jobType}</h3>
                      <p className="text-gray-600 mb-2">{job.location}</p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-700 mb-3">
                        <div><Briefcase className="inline w-4 h-4 mr-1" /> {job.experienceLevel || "Not specified"}</div>
                        <div><Building className="inline w-4 h-4 mr-1" /> {job.empolymentType || "N/A"}</div>
                        <div><DollarSign className="inline w-4 h-4 mr-1" /> {formatSalary(job.salaryRangeMin, job.salaryRangeMax)}</div>
                        <div><Calendar className="inline w-4 h-4 mr-1" /> Apply before: {job.applicationDeadline ? new Date(job.applicationDeadline).toLocaleDateString() : "N/A"}</div>
                      </div>

                      {job.description && <p className="text-gray-700 mb-2">{job.description}</p>}

                      {job.requirements && (
                        <div className="mt-2">
                          <h4 className="font-semibold">Requirements:</h4>
                          <p className="text-gray-700 whitespace-pre-line">{job.requirements}</p>
                        </div>
                      )}

                      <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
                        <span><Eye className="inline w-4 h-4 mr-1" /> Views: {job.views}</span>
                        <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
                          Apply Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-lg font-semibold mb-4">More Info</h3>
          <p><span className="font-medium">Location:</span> {companyData.location}</p>
          {companyData.contactEmail && <p><span className="font-medium">Email:</span> {companyData.contactEmail}</p>}
          {companyData.websiteUrl && (
            <p>
              <a href={companyData.websiteUrl} target="_blank" rel="noreferrer" className="text-blue-600">
                Visit Website
              </a>
            </p>
          )}
          <p><span className="font-medium">Active Jobs:</span> {companyJobs.length}</p>
        </div>
      </div>
    </div>
  );
};

export default IndividualCompany;
