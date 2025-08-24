import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { IoSearch, IoClose, IoBusinessOutline, IoBriefcaseOutline } from "react-icons/io5";
import axiosInstance from "../Utils/axiosInstance";

const SearchBar = ({ className = "" }) => {
  const navigate = useNavigate();
  const searchRef = useRef(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState({
    companies: [],
    jobs: []
  });
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Simple search - fetch data fresh every time
  const performSearch = async (query) => {
    if (query.trim().length < 3) {
      setShowResults(false);
      return;
    }

    setIsLoading(true);
    try {
      // Fetch all data fresh each time (simple approach)
      const [companiesRes, jobTypesRes, jobsRes] = await Promise.all([
        axiosInstance.get('/getallcompanies'),
        axiosInstance.get('/getalljobtypes'),
        axiosInstance.get('/api/Jobs')
      ]);

      const companies = companiesRes.data || [];
      const jobTypes = jobTypesRes.data || [];
      const jobs = jobsRes.data || [];

      // Simple filtering
      const queryLower = query.toLowerCase();

      // Filter companies
      const filteredCompanies = companies
        .filter(company => 
          company.companyName?.toLowerCase().includes(queryLower) ||
          company.location?.toLowerCase().includes(queryLower)
        )
        .slice(0, 5);

      // Filter jobs
      const filteredJobs = jobs
        .map(job => {
          // Find company and job type info
          const company = companies.find(c => c.companyId === job.companyId);
          const jobType = jobTypes.find(jt => jt.jobTypeId === parseInt(job.jobType));
          
          return {
            ...job,
            companyName: company?.companyName || 'Unknown Company',
            companyLocation: company?.location || '',
            jobTypeName: jobType?.name || 'Unknown Job Type'
          };
        })
        .filter(job => 
          job.jobTypeName.toLowerCase().includes(queryLower) ||
          job.companyName.toLowerCase().includes(queryLower) ||
          job.location?.toLowerCase().includes(queryLower) ||
          job.companyLocation.toLowerCase().includes(queryLower)
        )
        .slice(0, 5);

      setSearchResults({
        companies: filteredCompanies,
        jobs: filteredJobs
      });
      setShowResults(true);

    } catch (error) {
      console.error('Search error:', error);
      setSearchResults({ companies: [], jobs: [] });
    } finally {
      setIsLoading(false);
    }
  };

  // Debounced search
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      performSearch(searchQuery);
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [searchQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/jobs?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowResults(false);
      setSearchQuery("");
    }
  };

  const handleResultClick = (type, item) => {
    setShowResults(false);
    setSearchQuery("");

    if (type === 'company') {
      navigate(`/company/${item.companyId}`);
    } else if (type === 'job') {
      navigate(`/job/${item.jobId}`);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setShowResults(false);
  };

  const hasResults = searchResults.companies.length > 0 || searchResults.jobs.length > 0;

  return (
    <div className={`relative ${className}`} ref={searchRef}>
      <form onSubmit={handleSearchSubmit} className="flex w-full">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search companies and job types..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 md:h-12 px-4 pr-10 text-sm md:text-base rounded-l-full text-gray-700 border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <IoClose className="w-4 h-4" />
            </button>
          )}
        </div>
        <button
          type="submit"
          className="bg-gradient-to-r from-blue-600 to-blue-700 h-10 md:h-12 px-6 rounded-r-full hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
          ) : (
            <IoSearch className="text-white w-5 h-5" />
          )}
        </button>
      </form>

      {/* Search Results Dropdown */}
      {showResults && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 mt-2 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-6 text-center text-gray-500">
              <div className="flex items-center justify-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent"></div>
                <span className="text-lg">Searching...</span>
              </div>
            </div>
          ) : hasResults ? (
            <div className="py-2">
              {/* Jobs Section */}
              {searchResults.jobs.length > 0 && (
                <div className="mb-2">
                  <div className="px-4 py-3 text-xs font-bold text-gray-600 uppercase tracking-wide border-b bg-gradient-to-r from-purple-50 to-pink-50 flex items-center">
                    <IoBriefcaseOutline className="w-4 h-4 mr-2 text-purple-600" />
                    Jobs ({searchResults.jobs.length})
                  </div>
                  {searchResults.jobs.map((job, index) => (
                    <button
                      key={`job-${job.jobId || index}`}
                      onClick={() => handleResultClick('job', job)}
                      className="w-full text-left px-4 py-4 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-200 border-b border-gray-50 last:border-b-0 group"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:shadow-xl transition-shadow">
                          <span className="text-white font-bold text-lg">
                            {(job.jobTypeName || 'J').charAt(0)}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold text-gray-900 truncate text-lg group-hover:text-purple-700 transition-colors">
                            {job.jobTypeName || 'Job Position'}
                          </div>
                          <div className="text-sm text-gray-500 truncate">
                            {job.companyName}
                          </div>
                          <div className="text-xs text-gray-400 truncate mt-1">
                            📍 {job.location || job.companyLocation || 'Location not specified'}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Companies Section */}
              {searchResults.companies.length > 0 && (
                <div>
                  <div className="px-4 py-3 text-xs font-bold text-gray-600 uppercase tracking-wide border-b bg-gradient-to-r from-blue-50 to-indigo-50 flex items-center">
                    <IoBusinessOutline className="w-4 h-4 mr-2 text-blue-600" />
                    Companies ({searchResults.companies.length})
                  </div>
                  {searchResults.companies.map((company, index) => (
                    <button
                      key={`company-${company.companyId || index}`}
                      onClick={() => handleResultClick('company', company)}
                      className="w-full text-left px-4 py-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 flex items-center space-x-4 transition-all duration-200 border-b border-gray-50 last:border-b-0 group"
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:shadow-xl transition-shadow">
                        {company.companyLogo ? (
                          <img
                            src={company.companyLogo}
                            alt={company.companyName}
                            className="w-8 h-8 rounded-lg object-cover"
                          />
                        ) : (
                          <span className="text-white font-bold text-lg">
                            {(company.companyName || 'C').charAt(0)}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-gray-900 truncate text-lg group-hover:text-blue-700 transition-colors">
                          {company.companyName || 'Unknown Company'}
                        </div>
                        <div className="text-sm text-gray-500 truncate">
                          📍 {company.location || 'Location not specified'}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <div className="text-gray-300 mb-4">
                <IoSearch className="w-12 h-12 mx-auto" />
              </div>
              <div className="text-lg font-medium text-gray-600 mb-2">
                No results found for "{searchQuery}"
              </div>
              <div className="text-sm text-gray-400">
                Try searching for companies or job types
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;