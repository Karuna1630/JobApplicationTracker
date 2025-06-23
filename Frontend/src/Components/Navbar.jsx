import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoSearch } from 'react-icons/io5';
import logo from '../assets/logof.png';

const Navbar = () => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    navigate('/login');
  };

  return (
    <header className="flex flex-wrap items-center justify-between px-16 py-4 shadow-md bg-white gap-4">
      {/* Logo */}
      <Link to="/" className="flex items-center space-x-3">
        {/* <img src={logo} alt="Logo" className="h-12" /> */}
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
      <nav className="flex gap-6 text-xl  text-blue-800 font-medium ">
        <Link to="/" className="hover:text-blue-600 transition">Home</Link>
        <Link to="/companies" className="hover:text-blue-600 transition">Companies</Link>
        <Link to="/aboutus" className="hover:text-blue-600 transition">About Us</Link>
        {isLoggedIn && (
          <>
            <Link to="/dashboard" className="hover:text-blue-600 transition">Dashboard</Link>
            <Link to="/add-job" className="hover:text-blue-600 transition">Add Job</Link>
          </>
        )}
      </nav>

      {/* Auth Buttons */}
      <div className="flex items-center gap-4 text-xl ">
        {!isLoggedIn ? (
          <>
            <Link to="/login" className="text-blue-800 font-semibold hover:text-blue-600 transition">Login</Link>
            <Link to="/register" className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-xl hover:bg-blue-700 transition">Register</Link>
          </>
        ) : (
          <button onClick={handleLogout} className="text-red-600 font-semibold hover:text-red-800 transition">Logout</button>
        )}
      </div>
    </header>
  );
};

export default Navbar;
