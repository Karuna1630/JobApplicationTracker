import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import SearchBar from "../Components/SearchBar"; 
import NotificationBell from "../Components/NotificationBell"; 

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [role, setRole] = useState(Number(localStorage.getItem("role")));
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Update when token/role changes in localStorage
  useEffect(() => {
    const updateAuthStatus = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
      setRole(Number(localStorage.getItem("role")));
    };

    updateAuthStatus(); // Run on mount

    // Optional: listen for changes across tabs
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
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("firstName");
    localStorage.removeItem("lastName");
    localStorage.removeItem("profileImageUrl");
    setIsLoggedIn(false);
    setRole(null);
    setDropdownOpen(false);
    navigate("/login");
  };

  return (
    <header className="flex flex-wrap items-center justify-between px-4 md:px-8 lg:px-16 py-4 shadow-md bg-white gap-4">
      {/* Logo */}
      <Link to="/" className="flex items-center space-x-3 flex-shrink-0">
        <span className="text-xl md:text-2xl lg:text-3xl font-bold text-blue-800 hover:text-blue-600 cursor-pointer transition-colors">
          Job Manager
        </span>
      </Link>

      {/* Search Bar Component - Hidden on small screens when logged in */}
      <div className={`flex-1 max-w-xl mx-4 ${isLoggedIn ? 'hidden md:flex' : 'flex'}`}>
        <SearchBar className="w-full" />
      </div>

      {/* Navigation Links */}
      <nav className="hidden lg:flex gap-6 text-lg text-blue-800 font-medium">
        {/* Links for non-logged in users */}
        {!isLoggedIn && (
          <>
            <Link to="/" className="hover:text-blue-600 transition-colors">
              Home
            </Link>
            <Link to="/companies" className="hover:text-blue-600 transition-colors">
              Companies
            </Link>
            <Link to="/aboutus" className="hover:text-blue-600 transition-colors">
              About Us
            </Link>
            <Link to="/contactus" className="hover:text-blue-600 transition-colors">
              Contact Us
            </Link>
          </>
        )}

        {/* Role-specific links for logged in users */}
        {isLoggedIn && role === 4 && (
          <>
           
            <Link to="/companies" className="hover:text-blue-600 transition-colors">
              Companies
            </Link>
            <Link to="/userprofile" className="hover:text-blue-600 transition-colors">
              My Profile
            </Link>
            <Link to="/myStatus" className="hover:text-blue-600 transition">
              My Status
            </Link>
          </>
        )}

        {isLoggedIn && (role === 2 || role === 3) && (
          <>
            <Link to="/companyprofile" className="hover:text-blue-600 transition-colors">
              Dashboard
            </Link>
            <Link to="/companies" className="hover:text-blue-600 transition-colors">
              Companies
            </Link>
            <Link to="/companyinsight" className="hover:text-blue-600 transition-colors">
              Company Insights
            </Link>
          </>
        )}

        {isLoggedIn && role === 1 && (
          <>
            <Link to="/admin" className="hover:text-blue-600 transition-colors">
              Admin Dashboard
            </Link>
            <Link to="/manage-users" className="hover:text-blue-600 transition-colors">
              Manage Users
            </Link>
            <Link to="/reports" className="hover:text-blue-600 transition-colors">
              Reports
            </Link>
          </>
        )}
      </nav>

      {/* Right Side Actions */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {/* Notification Bell - Only show when logged in */}
        {isLoggedIn && (
          <div className="flex items-center">
            <NotificationBell />
          </div>
        )}

        {/* Auth Buttons / Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          {!isLoggedIn ? (
            <div className="flex items-center gap-3 text-lg">
              <Link
                to="/login"
                className="text-blue-800 font-semibold hover:text-blue-600 transition-colors px-3 py-2 rounded-lg hover:bg-blue-50"
              >
                Login
              </Link>
              <Link
                to="/registercomp"
                className="bg-blue-800 text-white font-semibold px-4 py-2 rounded-xl hover:bg-blue-600 transition-colors shadow-md hover:shadow-lg"
              >
                Register
              </Link>
            </div>
          ) : (
            <div className="relative inline-block text-left">
              <div
                className="flex items-center gap-2 cursor-pointer select-none p-1 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => setDropdownOpen((prev) => !prev)}
              >
                {profileImageUrl ? (
                  <img
                    src={profileImageUrl}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover border-2 border-blue-500 shadow-sm"
                    title={`${firstName} ${lastName}`}
                  />
                ) : (
                  <div
                    className="bg-gradient-to-br from-blue-600 to-blue-700 text-white font-semibold w-10 h-10 rounded-full flex items-center justify-center shadow-md"
                    title={`${firstName} ${lastName}`}
                  >
                    {initials}
                  </div>
                )}

                <svg
                  className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
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
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 z-50 py-2">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm text-gray-600">Signed in as</p>
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {firstName} {lastName}
                    </p>
                  </div>
                  
                  <Link
                    to="/userprofile"
                    className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Profile Settings
                  </Link>

                  {/* Add Notifications link */}
                  <Link
                    to="/notifications"
                    className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM9 17h5l-5 5v-5zM3 7l3-3v6l-3-3zM21 7l-3-3v6l3-3z" />
                    </svg>
                    All Notifications
                  </Link>

                  <div className="border-t border-gray-100 mt-2 pt-2">
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu Button - Only show when logged in for navigation */}
        {isLoggedIn && (
          <button 
            className="lg:hidden p-2 text-blue-800 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            onClick={() => {/* Add mobile menu logic if needed */}}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}
      </div>

      {/* Mobile Search Bar - Show below navbar when logged in on small screens */}
      {isLoggedIn && (
        <div className="w-full md:hidden mt-2">
          <SearchBar className="w-full" />
        </div>
      )}
    </header>
  );
};

export default Navbar;