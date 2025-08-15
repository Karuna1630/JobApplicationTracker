import React, { useState, useEffect } from 'react';
import { MapPin, Users, Building, Globe, Calendar, DollarSign, Briefcase, Clock, Eye } from 'lucide-react';

const IndividualCompany = ({ companyId = "1" }) => { // Default companyId for demo
  const [activeTab, setActiveTab] = useState('about');
  const [companyData, setCompanyData] = useState(null);
  const [companyJobs, setCompanyJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [followersCount, setFollowersCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        setLoading(true);
        
        // Fetch company details
        const companyResponse = await fetch(`/getcompanybyid?id=${companyId}`);
        if (companyResponse.ok) {
          const company = await companyResponse.json();
          setCompanyData(company);
        }

        // Fetch company jobs
        const jobsResponse = await fetch(`/jobs/getjobsbycompanyid?companyId=${companyId}`);
        if (jobsResponse.ok) {
          const jobs = await jobsResponse.json();
          setCompanyJobs(Array.isArray(jobs) ? jobs : []);
        }
        
      } catch (error) {
        console.error('Error fetching company data:', error);
        // For demo purposes, set mock data
        setCompanyData({
          companyId: 1,
          companyName: "ASUS VIVOBook",
          description: "An IT Company",
          websiteUrl: "https://github.com/",
          companyLogo: "https://localhost:7047/images/companylogo/02cb522b-eb96-4819-9c24-58bbc083e49.jpg",
          location: "Itahari",
          contactEmail: null
        });
        
        setCompanyJobs([
          {
            jobId: 2,
            companyId: 1,
            postedByUserId: 2,
            jobType: "Business Development Officer",
            description: "this is thejob you want",
            location: "itahari",
            salaryRangeMin: 10000,
            salaryRangeMax: 50000,
            employmentType: "Part-Time",
            experienceRequired: "Mid",
            responsibilities: null,
            requirements: "all",
            benefits: null,
            postedAt: "2025-08-15T09:48:46.296667",
            applicationDeadline: "2025-08-27T00:00:00",
            status: "A",
            views: 0
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    if (companyId) {
      fetchCompanyData();
    }
  }, [companyId]);

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    setFollowersCount(prev => isFollowing ? prev - 1 : prev + 1);
  };

  const formatSalary = (min, max) => {
    if (!min && !max) return 'Salary not disclosed';
    if (min && max) return `NRs. ${min.toLocaleString()} - ${max.toLocaleString()} Monthly`;
    if (min) return `NRs. ${min.toLocaleString()}+ Monthly`;
    return 'Salary not disclosed';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  const getExperienceLevel = (experience) => {
    if (!experience) return 'Not specified';
    return experience;
  };

  const getEmploymentTypeLabel = (empType) => {
    switch(empType) {
      case 'Part-Time': return 'Part-Time';
      case 'Full-Time': return 'Full-Time';
      case 'Contract': return 'Contract';
      case 'Internship': return 'Internship';
      default: return 'Full-Time';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading company details...</p>
        </div>
      </div>
    );
  }

  if (!companyData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Company not found</h2>
          <p className="mt-2 text-gray-600">The company you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-900 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-blue-800 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" 
               style={{
                 backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)',
               }}>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-10 right-10 w-32 h-32 border-2 border-blue-300 rounded-full opacity-20"></div>
        <div className="absolute bottom-10 right-32 w-20 h-20 border-2 border-blue-300 rounded-full opacity-30"></div>
        <div className="absolute top-20 right-1/4 w-1 h-20 bg-blue-300 opacity-20 transform rotate-45"></div>

        <div className="container mx-auto px-4 py-12 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-white rounded-lg p-4 shadow-lg">
                {companyData.companyLogo ? (
                  <img 
                    src={companyData.companyLogo} 
                    alt={companyData.companyName}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-blue-100 rounded flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-2xl">
                      {companyData.companyName?.charAt(0) || 'C'}
                    </span>
                  </div>
                )}
                <div className="w-full h-full bg-blue-100 rounded flex items-center justify-center" style={{display: 'none'}}>
                  <span className="text-blue-600 font-bold text-2xl">
                    {companyData.companyName?.charAt(0) || 'C'}
                  </span>
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">
                  {companyData.companyName || 'Unknown Company'}
                </h1>
                <p className="text-blue-100 text-lg">
                  {companyData.description || 'No description available'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <span className="text-blue-100 text-sm">{followersCount} Followers</span>
              </div>
              <button
                onClick={handleFollow}
                className={`px-6 py-2 rounded-full font-medium transition-colors ${
                  isFollowing
                    ? 'bg-white text-blue-700 hover:bg-gray-100'
                    : 'bg-transparent text-white border-2 border-white hover:bg-white hover:text-blue-700'
                }`}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('about')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'about'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              About
            </button>
            <button
              onClick={() => setActiveTab('jobs')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'jobs'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Jobs
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {activeTab === 'about' && (
              <div className="bg-white rounded-lg shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">About Us</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Driven by a vision for a Cleaner, Greener Nepal
                    </h3>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      We envision a world where electronic waste is no longer a threat to the environment but a valuable resource that contributes to a cleaner, greener, and more sustainable future.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Our Mission
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {companyData.description || "We're not just managing e-waste—we're redefining it. With a vision for a cleaner Nepal, we turn discarded electronics into valuable resources through safe, sustainable, and innovative practices. Our services—from secure recycling to data protection—make responsible e-waste disposal easy and impactful. As tech use grows, we aim to keep e-waste processing within Nepal to ensure it's handled responsibly and benefits our environment and communities."}
                    </p>
                  </div>
                  
                  {companyData.websiteUrl && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Website
                      </h3>
                      <a 
                        href={companyData.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 flex items-center"
                      >
                        <Globe className="w-4 h-4 mr-2" />
                        {companyData.websiteUrl}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'jobs' && (
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Available Jobs</h2>
                  <p className="text-gray-600 mt-1">
                    Jobs posted by {companyData.companyName} ({companyJobs.length})
                  </p>
                </div>

                {companyJobs.length === 0 ? (
                  <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                    <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs available</h3>
                    <p className="text-gray-500">This company hasn't posted any jobs yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {companyJobs.map((job) => (
                      <div key={job.jobId} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow border border-gray-100">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center mb-3">
                              <div className="w-12 h-12 bg-blue-100 rounded-lg p-2 mr-4 flex-shrink-0">
                                {companyData.companyLogo ? (
                                  <img 
                                    src={companyData.companyLogo} 
                                    alt={companyData.companyName}
                                    className="w-full h-full object-contain"
                                    onError={(e) => {
                                      e.target.style.display = 'none';
                                      e.target.nextSibling.style.display = 'flex';
                                    }}
                                  />
                                ) : null}
                                <div className="w-full h-full bg-blue-200 rounded flex items-center justify-center">
                                  <span className="text-blue-600 font-semibold text-sm">
                                    {companyData.companyName?.charAt(0) || 'C'}
                                  </span>
                                </div>
                              </div>
                              <div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                                  {job.jobType || 'Job Position'}
                                </h3>
                                <p className="text-gray-600">{companyData.companyName}</p>
                              </div>
                            </div>

                            <div className="mb-4">
                              <div className="flex flex-wrap gap-2 mb-3">
                                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm flex items-center">
                                  <MapPin className="w-3 h-3 mr-1" />
                                  Key Skills
                                </span>
                                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                                  Organizational Development
                                </span>
                                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                                  Client Handling
                                </span>
                                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                                  Branding
                                </span>
                                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                                  Reliability
                                </span>
                                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                                  Research
                                </span>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div className="flex items-center text-sm text-gray-600">
                                <Briefcase className="w-4 h-4 mr-2" />
                                <span>{job.experienceRequired ? `${job.experienceRequired} Level` : 'More than 5 years'}</span>
                              </div>
                              <div className="flex items-center text-sm text-gray-600">
                                <Building className="w-4 h-4 mr-2" />
                                <span>{getEmploymentTypeLabel(job.employmentType)}</span>
                              </div>
                              <div className="flex items-center text-sm text-gray-600">
                                <DollarSign className="w-4 h-4 mr-2" />
                                <span>{formatSalary(job.salaryRangeMin, job.salaryRangeMax)}</span>
                              </div>
                              <div className="flex items-center text-sm text-gray-600">
                                <MapPin className="w-4 h-4 mr-2" />
                                <span>{job.location || companyData.location || 'Chamati, Kathmandu'}</span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                              <div className="flex items-center text-sm text-gray-500">
                                <Clock className="w-4 h-4 mr-1" />
                                <span>Apply Before: {job.applicationDeadline ? new Date(job.applicationDeadline).toLocaleDateString() : '2 weeks, 6 days from now'}</span>
                              </div>
                              <div className="flex items-center text-sm text-gray-500">
                                <Eye className="w-4 h-4 mr-1" />
                                <span>Views: {job.views || 40}</span>
                              </div>
                            </div>

                            {job.description && (
                              <div className="mt-4 pt-4 border-t border-gray-100">
                                <p className="text-gray-700 text-sm line-clamp-2">{job.description}</p>
                              </div>
                            )}
                          </div>
                          
                          <div className="ml-4">
                            <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors">
                              Apply Now
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">More Info</h3>
              
              <div className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Industry</dt>
                  <dd className="mt-1 text-sm text-gray-900">Other</dd>
                </div>

                <div>
                  <dt className="text-sm font-medium text-gray-500">Company Size</dt>
                  <dd className="mt-1 text-sm text-gray-900">10 - 50 employees</dd>
                </div>

                <div>
                  <dt className="text-sm font-medium text-gray-500">Location</dt>
                  <dd className="mt-1 text-sm text-gray-900 flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                    {companyData.location || 'imadol, balkumari'}
                  </dd>
                </div>

                {companyData.websiteUrl && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Website</dt>
                    <dd className="mt-1">
                      <a 
                        href={companyData.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                      >
                        <Globe className="w-4 h-4 mr-2" />
                        Visit Website
                      </a>
                    </dd>
                  </div>
                )}

                <div className="pt-4 border-t">
                  <div className="text-sm text-gray-500 mb-2">Active Jobs</div>
                  <div className="text-2xl font-bold text-gray-900">{companyJobs.length}</div>
                </div>

                {companyData.contactEmail && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Contact</dt>
                    <dd className="mt-1 text-sm text-gray-900">{companyData.contactEmail}</dd>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndividualCompany;