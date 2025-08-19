import React, { useState, useEffect } from 'react';
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Company Not Found</h2>
          <p className="text-gray-600">{errorCompany}</p>
        </div>
      </div>
    );
  }

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

export default CompanyPage;