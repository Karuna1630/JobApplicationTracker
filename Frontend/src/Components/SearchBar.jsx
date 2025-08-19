import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { IoSearch, IoClose, IoBusinessOutline, IoBriefcaseOutline } from "react-icons/io5";
import axiosInstance from "../Utils/axiosInstance";

const SearchBar = ({ className = "" }) => {
  const navigate = useNavigate();
  
  // Search functionality state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState({
    companies: [],
    jobTypes: []
  });
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef(null);

  // Close search results on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Search API calls using axiosInstance
  const searchCompanies = async () => {
    try {
      const response = await axiosInstance.get('/getallcompanies');
      console.log('Companies data received:', response.data);
      
      const data = response.data;
      const filtered = data.filter(company => {
        const name = company.companyName || '';
        const location = company.location || '';
        const description = company.description || '';
        
        const query = searchQuery.toLowerCase();
        return name.toLowerCase().includes(query) ||
               location.toLowerCase().includes(query) ||
               description.toLowerCase().includes(query);
      });
      
      console.log('Filtered companies:', filtered);
      return filtered;
    } catch (error) {
      console.error('Error searching companies:', error);
      return [];
    }
  };

  const searchJobTypes = async () => {
    try {
      const response = await axiosInstance.get('/getalljobstypes');
      console.log('Job types data received:', response.data);
      
      const data = response.data;
      const filtered = data.filter(jobType => {
        const name = jobType.name || '';
        const query = searchQuery.toLowerCase();
        return name.toLowerCase().includes(query);
      });
      
      console.log('Filtered job types:', filtered);
      return filtered;
    } catch (error) {
      console.error('Error searching job types:', error);
      return [];
    }
  };

  // Debounced search function
  useEffect(() => {
    const delayedSearch = setTimeout(async () => {
      if (searchQuery.trim().length > 2) {
        console.log('Starting search for:', searchQuery);
        setIsSearching(true);
        try {
          const [companies, jobTypes] = await Promise.all([
            searchCompanies(),
            searchJobTypes()
          ]);
          
          console.log('Search results:', { companies, jobTypes });
          
          setSearchResults({
            companies: companies.slice(0, 5), // Limit results
            jobTypes: jobTypes.slice(0, 5)
          });
          setShowSearchResults(true);
        } catch (error) {
          console.error('Search error:', error);
          // Show error state or empty results
          setSearchResults({ companies: [], jobTypes: [] });
          setShowSearchResults(true);
        } finally {
          setIsSearching(false);
        }
      } else {
        setShowSearchResults(false);
        setSearchResults({ companies: [], jobTypes: [] });
      }
    }, 300); // 300ms delay

    return () => clearTimeout(delayedSearch);
  }, [searchQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to a search results page with query
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearchResults(false);
      setSearchQuery("");
    }
  };

  const handleResultClick = (type, item) => {
    setShowSearchResults(false);
    setSearchQuery("");
    
    // Navigate based on result type
    switch (type) {
      case 'company':
        // Navigate to individual company page using companyId
        navigate(`/company/${item.companyId}`);
        break;
      case 'jobType':
        // Navigate to jobs filtered by job type
        navigate(`/jobs?type=${item.jobTypeId}`);
        break;
      default:
        break;
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setShowSearchResults(false);
  };

  const hasResults = searchResults.companies.length > 0 || 
                   searchResults.jobTypes.length > 0;

  return (
    <div className={`relative ${className}`} ref={searchRef}>
      <form onSubmit={handleSearchSubmit} className="flex w-full">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search companies, jobs..."
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
          disabled={isSearching}
        >
          {isSearching ? (
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
          ) : (
            <IoSearch className="text-white w-5 h-5" />
          )}
        </button>
      </form>

      {/* Enhanced Search Results Dropdown */}
      {showSearchResults && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 mt-2 max-h-96 overflow-y-auto backdrop-blur-sm">
          {isSearching ? (
            <div className="p-6 text-center text-gray-500">
              <div className="flex items-center justify-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent"></div>
                <span className="text-lg">Searching...</span>
              </div>
            </div>
          ) : hasResults ? (
            <div className="py-2">
              {/* Companies Section */}
              {searchResults.companies.length > 0 && (
                <div className="mb-2">
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
                        {company.location && (
                          <div className="text-sm text-gray-500 truncate">
                            📍 {company.location}
                          </div>
                        )}
                        {company.description && (
                          <div className="text-xs text-gray-400 truncate mt-1">
                            {company.description}
                          </div>
                        )}
                      </div>
                      <div className="text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        →
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Job Types Section */}
              {searchResults.jobTypes.length > 0 && (
                <div className="mb-2">
                  <div className="px-4 py-3 text-xs font-bold text-gray-600 uppercase tracking-wide border-b bg-gradient-to-r from-green-50 to-emerald-50 flex items-center">
                    <IoBriefcaseOutline className="w-4 h-4 mr-2 text-green-600" />
                    Job Types ({searchResults.jobTypes.length})
                  </div>
                  {searchResults.jobTypes.map((jobType, index) => (
                    <button
                      key={`jobtype-${jobType.jobTypeId || index}`}
                      onClick={() => handleResultClick('jobType', jobType)}
                      className="w-full text-left px-4 py-4 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 transition-all duration-200 border-b border-gray-50 last:border-b-0 group"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:shadow-xl transition-shadow">
                          <span className="text-white font-bold text-lg">
                            {(jobType.name || 'J').charAt(0)}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold text-gray-900 truncate text-lg group-hover:text-green-700 transition-colors">
                            {jobType.name || 'Unknown Job Type'}
                          </div>
                          <div className="text-xs text-gray-400">
                            Browse all {jobType.name} positions
                          </div>
                        </div>
                        <div className="text-green-400 opacity-0 group-hover:opacity-100 transition-opacity">
                          →
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* View All Results */}
              <div className="border-t mt-2 bg-gray-50">
                <button
                  onClick={handleSearchSubmit}
                  className="w-full px-4 py-4 text-blue-600 hover:bg-blue-100 font-semibold text-center transition-colors rounded-b-xl flex items-center justify-center space-x-2"
                >
                  <IoSearch className="w-4 h-4" />
                  <span>View all results for "{searchQuery}"</span>
                </button>
              </div>
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