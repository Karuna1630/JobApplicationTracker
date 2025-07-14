import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoSearch } from 'react-icons/io5';
import logo from '../assets/logof.png';

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userRole = localStorage.getItem('role');

    setIsLoggedIn(loggedIn);
    setRole(userRole);

    // Listen for localStorage changes from other tabs
    const handleStorageChange = () => {
      setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
      setRole(localStorage.getItem('role'));
    };

    window.addEventListener('storage', handleStorageChange);

    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggleDropdown = () => {
    setDropdownOpen(prev => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('role');
    localStorage.removeItem('fullName');
    setIsLoggedIn(false);
    setRole(null);
    setDropdownOpen(false);
    navigate('/login');
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

      {/* Nav Links */}
      <nav className="flex gap-6 text-xl text-blue-800 font-medium">
        <Link to="/" className="hover:text-blue-600 transition">Home</Link>
        <Link to="/companies" className="hover:text-blue-600 transition">Companies</Link>
        <Link to="/aboutus" className="hover:text-blue-600 transition">About Us</Link>
        <Link to="/contactus" className="hover:text-blue-600 transition">Contact Us</Link>

        {isLoggedIn && role === 'JobSeeker' && (
          <>
            <Link to="/applications" className="hover:text-blue-600 transition">My Applications</Link>
            <Link to="/userProfile" className="hover:text-blue-600 transition">Profile</Link>
          </>
        )}

        {isLoggedIn && role === 'Company' && (
          <>
            <Link to="/dashboard" className="hover:text-blue-600 transition">Dashboard</Link>
            <Link to="/add-job" className="hover:text-blue-600 transition">Add Job</Link>
            <Link to="/manage-jobs" className="hover:text-blue-600 transition">Manage Jobs</Link>
          </>
        )}

        {isLoggedIn && role === 'Admin' && (
          <>
            <Link to="/admin" className="hover:text-blue-600 transition">Admin Dashboard</Link>
            <Link to="/manage-users" className="hover:text-blue-600 transition">Manage Users</Link>
            <Link to="/reports" className="hover:text-blue-600 transition">Reports</Link>
          </>
        )}

        {isLoggedIn && role === 'Recruiter' && (
          <>
            <Link to="/recruiter-dashboard" className="hover:text-blue-600 transition">Recruiter Dashboard</Link>
          </>
        )}
      </nav>

      {/* Auth Buttons and Dropdown */}
      <div className="relative" ref={dropdownRef}>
        {!isLoggedIn ? (
          <div className="flex items-center gap-4 text-xl">
            <Link to="/login" className="text-blue-800 font-semibold hover:text-blue-600 transition">Login</Link>
            <Link to="/registercomp" className="bg-blue-800 text-white font-semibold px-4 py-2 rounded-xl hover:bg-blue-600 transition">Register</Link>
          </div>
        ) : (
          <div className="relative inline-block text-left">
            <div
              className="flex items-center gap-2 cursor-pointer select-none"
              onClick={handleToggleDropdown}
            >
              <div className="bg-blue-600 text-white font-semibold w-10 h-10 rounded-full flex items-center justify-center">
                {localStorage.getItem("fullName")?.[0]?.toUpperCase()}
              </div>
              <span className="text-blue-800 font-semibold">
                {localStorage.getItem("fullName")}
              </span>
              <svg
                className={`w-4 h-4 text-gray-500 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-md z-10">
                <Link
                  to="/userprofile"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={() => setDropdownOpen(false)}
                >
                  <i className="fas fa-user mr-2"></i> Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  <i className="fas fa-sign-out-alt mr-2"></i> Logout
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
