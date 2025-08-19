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
=======
import { Building2, MapPin, Users, Globe, Calendar, Clock, DollarSign, BookOpen, Mail } from 'lucide-react';

// Job Card Component
const JobCard = ({ job }) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{job.title}</h3>
          <div className="flex items-center text-gray-600 mb-2">
            <MapPin className="w-4 h-4 mr-2" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center text-gray-600 mb-2">
            <Clock className="w-4 h-4 mr-2" />
            <span>{job.type}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500 mb-1">Posted</div>
          <div className="text-sm font-medium text-gray-700">{job.postedDate}</div>
        </div>
      </div>
      
      <div className="mb-4">
        <p className="text-gray-700 text-sm line-clamp-3">{job.description}</p>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <DollarSign className="w-4 h-4 mr-1 text-green-600" />
          <span className="text-sm font-medium text-green-600">{job.salary}</span>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
          Apply Now
        </button>
      </div>
    </div>
  );
};

// Jobs List Component
const JobsList = ({ jobs, loading, error }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading jobs...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  if (!jobs || jobs.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
        <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 text-lg">No jobs available at this time</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
};

// Company Header Component
const CompanyHeader = ({ company }) => {
  return (
    <div className="relative bg-gradient-to-r from-blue-800 via-blue-700 to-blue-600 text-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 rounded-full border-2 border-white"></div>
        <div className="absolute top-20 right-20 w-24 h-24 rounded-full border border-white"></div>
        <div className="absolute bottom-10 left-1/4 w-16 h-16 rounded-full border border-white"></div>
      </div>
      
      <div className="relative container mx-auto px-6 py-12">
        <div className="flex items-center mb-6">
          {/* Company Logo */}
          <div className="bg-white p-3 rounded-lg mr-4">
            {company.companyLogo ? (
              <img 
                src={company.companyLogo} 
                alt={`${company.companyName} logo`}
                className="w-8 h-8 object-contain"
              />
            ) : (
              <Building2 className="w-8 h-8 text-blue-700" />
            )}
          </div>
          
          {/* Company Name */}
          <div>
            <h1 className="text-3xl font-bold">{company.companyName}</h1>
          </div>
        </div>
        
        {/* Location */}
        <div className="flex items-center text-sm">
          <MapPin className="w-4 h-4 mr-2" />
          <span>{company.location}</span>
        </div>
      </div>
    </div>
  );
};

// Company Tabs Component
const CompanyTabs = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'about', label: 'About' },
    { id: 'jobs', label: 'Jobs' }
  ];

  return (
    <div className="border-b border-gray-200 bg-white">
      <div className="container mx-auto px-6">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

// About Company Component
const AboutCompany = ({ company }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">About {company.companyName}</h2>
      
      {/* Company Description */}
      <div className="prose max-w-none">
        <p className="text-gray-700 leading-relaxed text-lg">
          {company.description}
        </p>
      </div>
    </div>
  );
};

// Main Company Page Component
const CompanyPage = ({ companyId }) => {
  const [activeTab, setActiveTab] = useState('about');
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loadingCompany, setLoadingCompany] = useState(true);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [errorCompany, setErrorCompany] = useState('');
  const [errorJobs, setErrorJobs] = useState('');

  // Sample company data based on your endpoint structure
  const sampleCompany = {
    companyId: 1,
    companyName: "MRD",
    description: "Health organization and jjshfj",
    websiteUrl: null,
    companyLogo: "https://localhost:7047/images/companylogo/dd6ab4c8-f139-4ea8-baba-f7b7c40f028a.jpg",
    location: "Biratnagar",
    contactEmail: "ak@gmail.com"
  };

  // Sample jobs data
  const sampleJobs = [
    {
      id: 1,
      title: "Senior Network Engineer",
      location: "Biratnagar, Nepal",
      type: "Full Time",
      salary: "NPR 80,000 - 120,000",
      postedDate: "2 days ago",
      description: "We are looking for an experienced Network Engineer to join our team."
    },
    {
      id: 2,
      title: "Project Manager",
      location: "Kathmandu, Nepal",
      type: "Full Time",
      salary: "NPR 100,000 - 150,000",
      postedDate: "1 week ago",
      description: "Seeking a dynamic Project Manager to oversee projects from conception to completion."
    }
  ];

  // Fetch company details
  const fetchCompany = async (id) => {
    try {
      setLoadingCompany(true);
      setErrorCompany('');
      
      const response = await axiosInstance.get(`/getcompanybyid?id=${id}`);
      setCompany(response.data);
    } catch (err) {
      console.error("Failed to fetch company", err);
      setErrorCompany("Failed to load company information.");
    } finally {
      setLoadingCompany(false);
    }
  };

  // Fetch jobs for this company
  const fetchJobs = async (companyId) => {
    try {
      setLoadingJobs(true);
      setErrorJobs('');
      
      const response = await axiosInstance.get(`/api/Jobs/getjobsbyid?id=${companyId}`);
      setJobs(response.data || []);
    } catch (err) {
      console.error("Failed to fetch jobs", err);
      setErrorJobs("Failed to load jobs.");
    } finally {
      setLoadingJobs(false);
    }
  };

  // Load company data on component mount
  useEffect(() => {
    if (companyId) {
      fetchCompany(companyId);
    }
  }, [companyId]);

  // Load jobs when switching to jobs tab
  useEffect(() => {
    if (activeTab === 'jobs' && companyId && jobs.length === 0) {
      fetchJobs(companyId);
    }
  }, [activeTab, companyId]);

  // Loading state for company
  if (loadingCompany) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading company information...</p>
        </div>

      </div>
    );
  }

  // Error state for company
  if (errorCompany) {
    return (

      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Company not found</p>

      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Company Not Found</h2>
          <p className="text-gray-600">{errorCompany}</p>
        </div>

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

  // No company data
  if (!company) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Company Not Found</h2>
          <p className="text-gray-600">The requested company could not be found.</p>

        </div>
      </div>
    );
  }


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

  return (
    <div className="min-h-screen bg-gray-50">
      <CompanyHeader company={company} />
      <CompanyTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="container mx-auto px-6 py-8">
        <div className="flex gap-8">
          <main className="flex-1">
            {activeTab === 'about' && <AboutCompany company={company} />}
            {activeTab === 'jobs' && (
              <div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Open Positions</h2>
                  <p className="text-gray-600 mt-2">Join our team and be part of {company.companyName}</p>
                </div>
                <JobsList jobs={jobs} loading={loadingJobs} error={errorJobs} />
              </div>
            )}
          </main>
          
          <aside className="w-80">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">More Info</h3>
              
              <div className="space-y-4">
                {/* Location */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Location</h4>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{company.location}</span>
                  </div>
                </div>
                
                {/* Website URL */}
                {company.websiteUrl && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Website</h4>
                    <div className="flex items-center text-sm text-blue-600 hover:text-blue-800">
                      <Globe className="w-4 h-4 mr-2" />
                      <a 
                        href={company.websiteUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        Visit Website
                      </a>
                    </div>
                  </div>
                )}
                
                {/* Contact Email */}
                {company.contactEmail && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Contact Email</h4>
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="w-4 h-4 mr-2" />
                      <a 
                        href={`mailto:${company.contactEmail}`}
                        className="hover:text-blue-600 hover:underline"
                      >
                        {company.contactEmail}
                      </a>
                    </div>
                  </div>
                )}
              </div>
              
              <button className="w-full mt-6 bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
                Follow Company
              </button>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
};


export default IndividualCompany;

export default CompanyPage;

