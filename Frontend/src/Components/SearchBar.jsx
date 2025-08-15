import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { IoSearch, IoClose } from "react-icons/io5";

const SearchBar = ({ className = "" }) => {
  const navigate = useNavigate();
  
  // Search functionality state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState({
    companies: [],
    jobTypes: [],
    skills: []
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

  // Search API calls
  const searchCompanies = async () => {
    try {
      const response = await fetch('https://localhost:7047/getallcompanies');
      console.log('Companies API response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Companies data received:', data);
        
        const filtered = data.filter(company => {
          const name = company.companyName || '';
          const id = company.companyId || '';
          
          return name.toLowerCase().includes(searchQuery.toLowerCase());
        });
        
        console.log('Filtered companies:', filtered);
        return filtered;
      } else {
        console.error('Companies API failed with status:', response.status);
      }
    } catch (error) {
      console.error('Error searching companies:', error);
    }
    return [];
  };

  const searchJobTypes = async () => {
    try {
      const response = await fetch('https://localhost:7047/getalljobstypes');
      console.log('Job types API response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Job types data received:', data);
        
        const filtered = data.filter(jobType => {
          const name = jobType.name || '';
          
          return name.toLowerCase().includes(searchQuery.toLowerCase());
        });
        
        console.log('Filtered job types:', filtered);
        return filtered;
      } else {
        console.error('Job types API failed with status:', response.status);
      }
    } catch (error) {
      console.error('Error searching job types:', error);
    }
    return [];
  };

  const searchSkills = async () => {
    try {
      const response = await fetch('https://localhost:7047/api/skills/getallskills');
      console.log('Skills API response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Skills data received:', data);
        
        const filtered = data.filter(skill => {
          const skillName = skill.skill || '';
          
          return skillName.toLowerCase().includes(searchQuery.toLowerCase());
        });
        
        console.log('Filtered skills:', filtered);
        return filtered;
      } else {
        console.error('Skills API failed with status:', response.status);
      }
    } catch (error) {
      console.error('Error searching skills:', error);
    }
    return [];
  };

  // Debounced search function
  useEffect(() => {
    const delayedSearch = setTimeout(async () => {
      if (searchQuery.trim().length > 2) {
        console.log('Starting search for:', searchQuery);
        setIsSearching(true);
        try {
          const [companies, jobTypes, skills] = await Promise.all([
            searchCompanies(),
            searchJobTypes(),
            searchSkills()
          ]);
          
          console.log('Search results:', { companies, jobTypes, skills });
          
          setSearchResults({
            companies: companies.slice(0, 5), // Limit results
            jobTypes: jobTypes.slice(0, 5),
            skills: skills.slice(0, 5)
          });
          setShowSearchResults(true);
        } catch (error) {
          console.error('Search error:', error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setShowSearchResults(false);
        setSearchResults({ companies: [], jobTypes: [], skills: [] });
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
    }
  };

  const handleResultClick = (type, item) => {
    setShowSearchResults(false);
    setSearchQuery("");
    
    // Navigate based on result type
    switch (type) {
      case 'company':
        navigate(`/company/${item.companyId}`);
        break;
      case 'jobType':
        navigate(`/jobs?type=${item.jobTypeId}`);
        break;
      case 'skill':
        navigate(`/jobs?skill=${item.skillId}`);
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
                   searchResults.jobTypes.length > 0 || 
                   searchResults.skills.length > 0;

  return (
    <div className={`relative ${className}`} ref={searchRef}>
      <form onSubmit={handleSearchSubmit} className="flex w-full">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search companies, jobs, skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 md:h-12 px-4 pr-8 text-sm md:text-base rounded-l-full text-gray-700 border border-gray-300 focus:outline-none focus:border-blue-500"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <IoClose className="w-4 h-4" />
            </button>
          )}
        </div>
        <button 
          type="submit"
          className="bg-blue-600 h-10 md:h-12 px-4 rounded-r-full hover:bg-blue-700 disabled:opacity-50 transition-colors"
          disabled={isSearching}
        >
          <IoSearch className="text-white w-5 h-5" />
        </button>
      </form>

      {/* Search Results Dropdown */}
      {showSearchResults && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 mt-1 max-h-96 overflow-y-auto">
          {isSearching ? (
            <div className="p-4 text-center text-gray-500">
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                <span>Searching...</span>
              </div>
            </div>
          ) : hasResults ? (
            <div className="py-2">
              {/* Companies */}
              {searchResults.companies.length > 0 && (
                <div className="mb-2">
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase border-b bg-gray-50">
                    Companies ({searchResults.companies.length})
                  </div>
                  {searchResults.companies.map((company, index) => (
                    <button
                      key={`company-${company.companyId || index}`}
                      onClick={() => handleResultClick('company', company)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center space-x-3 transition-colors"
                    >
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-600 font-semibold text-sm">
                          {(company.companyName || 'C').charAt(0)}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-gray-900 truncate">
                          {company.companyName || 'Unknown Company'}
                        </div>
                        <div className="text-sm text-gray-500 truncate">
                          Company ID: {company.companyId}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Job Types */}
              {searchResults.jobTypes.length > 0 && (
                <div className="mb-2">
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase border-b bg-gray-50">
                    Job Types ({searchResults.jobTypes.length})
                  </div>
                  {searchResults.jobTypes.map((jobType, index) => (
                    <button
                      key={`jobtype-${jobType.jobTypeId || index}`}
                      onClick={() => handleResultClick('jobType', jobType)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-green-600 font-semibold text-sm">
                            {(jobType.name || 'J').charAt(0)}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-gray-900 truncate">
                            {jobType.name || 'Unknown Job Type'}
                          </div>
                          <div className="text-sm text-gray-500 truncate">
                            Job Type ID: {jobType.jobTypeId}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Skills */}
              {searchResults.skills.length > 0 && (
                <div className="mb-2">
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase border-b bg-gray-50">
                    Skills ({searchResults.skills.length})
                  </div>
                  {searchResults.skills.map((skill, index) => (
                    <button
                      key={`skill-${skill.skillId || index}`}
                      onClick={() => handleResultClick('skill', skill)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-purple-600 font-semibold text-sm">
                            {(skill.skill || 'S').charAt(0)}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-gray-900 truncate">
                            {skill.skill || 'Unknown Skill'}
                          </div>
                          <div className="text-sm text-gray-500 truncate">
                            Skill ID: {skill.skillId}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* View All Results */}
              <div className="border-t mt-2">
                <button
                  onClick={handleSearchSubmit}
                  className="w-full px-4 py-3 text-blue-600 hover:bg-blue-50 font-medium text-center transition-colors"
                >
                  View all results for "{searchQuery}"
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">
              <div className="text-gray-400 mb-2">
                <IoSearch className="w-8 h-8 mx-auto" />
              </div>
              <div>No results found for "{searchQuery}"</div>
              <div className="text-sm mt-1">Try searching for companies, job types, or skills</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;