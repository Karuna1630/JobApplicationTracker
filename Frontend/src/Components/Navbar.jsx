import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoSearch, IoClose } from "react-icons/io5";

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [role, setRole] = useState(Number(localStorage.getItem("role")));
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  
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

  // Update when token/role changes in localStorage
  useEffect(() => {
    const updateAuthStatus = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
      setRole(Number(localStorage.getItem("role")));
    };

    updateAuthStatus();
    window.addEventListener("storage", updateAuthStatus);
    return () => {
      window.removeEventListener("storage", updateAuthStatus);
    };
  }, []);

  const firstName = localStorage.getItem("firstName") || "";
  const lastName = localStorage.getItem("lastName") || "";
  const profileImageUrl = localStorage.getItem("profileImageUrl");

  let initials = "U";
  if (firstName && lastName) {
    initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  } else if (firstName) {
    initials = `${firstName.charAt(0)}`.toUpperCase();
  }

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
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
      const response = await fetch('/api/getallcompanies');
      if (response.ok) {
        const data = await response.json();
        return data.filter(company => 
          company.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          company.industry?.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
    } catch (error) {
      console.error('Error searching companies:', error);
    }
    return [];
  };

  const searchJobTypes = async () => {
    try {
      const response = await fetch('/api/getalljobstypes');
      if (response.ok) {
        const data = await response.json();
        return data.filter(jobType => 
          jobType.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          jobType.description?.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
    } catch (error) {
      console.error('Error searching job types:', error);
    }
    return [];
  };

  const searchSkills = async () => {
    try {
      const response = await fetch('/api/skills/getallskills');
      if (response.ok) {
        const data = await response.json();
        return data.filter(skill => 
          skill.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          skill.category?.toLowerCase().includes(searchQuery.toLowerCase())
        );
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
        setIsSearching(true);
        try {
          const [companies, jobTypes, skills] = await Promise.all([
            searchCompanies(),
            searchJobTypes(),
            searchSkills()
          ]);
          
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
        navigate(`/company/${item.id}`);
        break;
      case 'jobType':
        navigate(`/jobs?type=${item.id}`);
        break;
      case 'skill':
        navigate(`/jobs?skill=${item.id}`);
        break;
      default:
        break;
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setShowSearchResults(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("firstName");
    localStorage.removeItem("lastName");
    setIsLoggedIn(false);
    setRole(null);
    setDropdownOpen(false);
    navigate("/login");
  };

  const hasResults = searchResults.companies.length > 0 || 
                   searchResults.jobTypes.length > 0 || 
                   searchResults.skills.length > 0;

  return (
    <header className="flex flex-wrap items-center justify-between px-16 py-5 shadow-md bg-white gap-4">
      {/* Logo */}
      <Link to="/" className="flex items-center space-x-3">
        <span className="text-2xl md:text-3xl font-bold text-blue-800 hover:text-blue-600 cursor-pointer">
          Job Manager
        </span>
      </Link>

      {/* Search Bar */}
      <div className="flex flex-1 max-w-xl mx-4 relative" ref={searchRef}>
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
            className="bg-blue-600 h-10 md:h-12 px-4 rounded-r-full hover:bg-blue-700 disabled:opacity-50"
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
                Searching...
              </div>
            ) : hasResults ? (
              <div className="py-2">
                {/* Companies */}
                {searchResults.companies.length > 0 && (
                  <div className="mb-2">
                    <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase border-b">
                      Companies
                    </div>
                    {searchResults.companies.map((company, index) => (
                      <button
                        key={`company-${index}`}
                        onClick={() => handleResultClick('company', company)}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-3"
                      >
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold text-sm">
                            {company.name?.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{company.name}</div>
                          {company.industry && (
                            <div className="text-sm text-gray-500">{company.industry}</div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Job Types */}
                {searchResults.jobTypes.length > 0 && (
                  <div className="mb-2">
                    <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase border-b">
                      Job Types
                    </div>
                    {searchResults.jobTypes.map((jobType, index) => (
                      <button
                        key={`jobtype-${index}`}
                        onClick={() => handleResultClick('jobType', jobType)}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50"
                      >
                        <div className="font-medium text-gray-900">{jobType.name}</div>
                        {jobType.description && (
                          <div className="text-sm text-gray-500 truncate">{jobType.description}</div>
                        )}
                      </button>
                    ))}
                  </div>
                )}

                {/* Skills */}
                {searchResults.skills.length > 0 && (
                  <div>
                    <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase border-b">
                      Skills
                    </div>
                    {searchResults.skills.map((skill, index) => (
                      <button
                        key={`skill-${index}`}
                        onClick={() => handleResultClick('skill', skill)}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50"
                      >
                        <div className="font-medium text-gray-900">{skill.name}</div>
                        {skill.category && (
                          <div className="text-sm text-gray-500">{skill.category}</div>
                        )}
                      </button>
                    ))}
                  </div>
                )}

                {/* View All Results */}
                <div className="border-t mt-2">
                  <button
                    onClick={handleSearchSubmit}
                    className="w-full px-4 py-3 text-blue-600 hover:bg-blue-50 font-medium text-center"
                  >
                    View all results for "{searchQuery}"
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 text-center text-gray-500">
                No results found for "{searchQuery}"
              </div>
            )}
          </div>
        )}
      </div>

      <nav className="flex gap-6 text-xl text-blue-800 font-medium">
        {/* Navigation links remain the same */}
        {!isLoggedIn && (
          <>
            <Link to="/" className="hover:text-blue-600 transition">
              Home
            </Link>
            <Link to="/companies" className="hover:text-blue-600 transition">
              Companies
            </Link>
            <Link to="/aboutus" className="hover:text-blue-600 transition">
              About Us
            </Link>
            <Link to="/contactus" className="hover:text-blue-600 transition">
              Contact Us
            </Link>
          </>
        )}

        {isLoggedIn && role === 4 && (
          <>
            <Link to="/applications" className="hover:text-blue-600 transition">
              Overview
            </Link>
            <Link to="/companies" className="hover:text-blue-600 transition">
              Companies
            </Link>
            <Link to="/userprofile" className="hover:text-blue-600 transition">
              My Profile
            </Link>
            <Link to="/status" className="hover:text-blue-600 transition">
              My Status
            </Link>
          </>
        )}

        {isLoggedIn && role === 2 && (
          <>
            <Link
              to="/companyprofile"
              className="hover:text-blue-600 transition"
            >
              Dashboard
            </Link>
             <Link to="/companies" className="hover:text-blue-600 transition">
              Companies
            </Link>
            <Link
              to="/companyinsight"
              className="hover:text-blue-600 transition"
            >
              Company Insights
            </Link>
          </>
        )}

        {isLoggedIn && role === 1 && (
          <>
            <Link to="/admin" className="hover:text-blue-600 transition">
              Admin Dashboard
            </Link>
            <Link to="/manage-users" className="hover:text-blue-600 transition">
              Manage Users
            </Link>
            <Link to="/reports" className="hover:text-blue-600 transition">
              Reports
            </Link>
          </>
        )}
      </nav>

      {/* Auth Buttons / Profile Dropdown remains the same */}
      <div className="relative" ref={dropdownRef}>
        {!isLoggedIn ? (
          <div className="flex items-center gap-4 text-xl">
            <Link
              to="/login"
              className="text-blue-800 font-semibold hover:text-blue-600 transition"
            >
              Login
            </Link>
            <Link
              to="/registercomp"
              className="bg-blue-800 text-white font-semibold px-4 py-2 rounded-xl hover:bg-blue-600 transition"
            >
              Register
            </Link>
          </div>
        ) : (
          <div className="relative inline-block text-left">
            <div
              className="flex items-center gap-2 cursor-pointer select-none"
              onClick={() => setDropdownOpen((prev) => !prev)}
            >
              {profileImageUrl ? (
                <img
                  src={profileImageUrl}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover border border-blue-500"
                  title={`${firstName} ${lastName}`}
                />
              ) : (
                <div
                  className="bg-blue-600 text-white font-semibold w-10 h-10 rounded-full flex items-center justify-center"
                  title={`${firstName} ${lastName}`}
                >
                  {initials}
                </div>
              )}

              <svg
                className={`w-4 h-4 text-gray-500 transition-transform ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-md z-10">
                <Link
                  to="/userprofile"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={() => setDropdownOpen(false)}
                >
                  Profile
                </Link>
              
                <Link
                  to="/settings"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={() => setDropdownOpen(false)}
                >
                  Settings
                </Link>
                  <button
                  onClick={handleLogout}
                  className="w-full text-left block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;