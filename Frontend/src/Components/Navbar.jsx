import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoSearch } from "react-icons/io5";

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
    localStorage.removeItem("lastName")
    setIsLoggedIn(false);
    setRole(null);
    setDropdownOpen(false);
    navigate("/login");
  };

  return (
    <header className="flex flex-wrap items-center justify-between px-16 py-5 shadow-md bg-white gap-4">
      {/* Logo */}
      <Link to="/" className="flex items-center space-x-3">
        <span className="text-2xl md:text-3xl font-bold text-blue-800 hover:text-blue-600 cursor-pointer">
          Job Manager
        </span>
      </Link>

      {/* Search Bar */}
      <div className="flex flex-1 max-w-xl mx-4">
        <input
          type="text"
          placeholder="Search categories..."
          className="w-full h-10 md:h-12 px-4 text-sm md:text-base rounded-l-full text-gray-700 border border-gray-300 focus:outline-none"
        />
        <button className="bg-blue-600 h-10 md:h-12 px-4 rounded-r-full hover:bg-blue-700">
          <IoSearch className="text-white w-5 h-5" />
        </button>
      </div>

      <nav className="flex gap-6 text-xl text-blue-800 font-medium">
        {/* 👇 Only show these when NOT logged in */}
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

        {/* 👇 Role-specific links shown only when logged in */}
        {isLoggedIn && role === 4 && (
          <>
            <Link to="/applications" className="hover:text-blue-600 transition">
              My Applications
            </Link>
            {/* <Link to="/userProfile" className="hover:text-blue-600 transition">Profile</Link> */}
          </>
        )}

        {isLoggedIn && role === 2 && (
          <>
            <Link to="/companyProfile" className="hover:text-blue-600 transition">
              Dashboard
            </Link>
            <Link to="/postjob" className="hover:text-blue-600 transition">
              Add Job
            </Link>
            <Link to="/manage-jobs" className="hover:text-blue-600 transition">
              Manage Jobs
            </Link>
            <Link to="/companyinsight" className="hover:text-blue-600 transition">
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

      {/* Auth Buttons / Profile Dropdown */}
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
                className={`w-4 h-4 text-gray-500 transition-transform ${dropdownOpen ? "rotate-180" : ""
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
