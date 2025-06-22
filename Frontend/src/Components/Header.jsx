import React from "react";
import logo from "../assets/logof.png";
import SearchBar from "./SearchBar";


const Header = () => {
  return (
    <>
    <header className="flex items-center justify-between px-14 py-4 shadow-md bg-white">
      {/* Logo & Brand */}
      <div className="flex flex-col items-center">
        <img src={logo} alt="Logo" className="h-20" />
        {/* <p className="text-xs text-gray-500 mb-3 ">
          Track. Apply. Succeed.
        </p> */}
      </div>

      {/* Nav Links */}
      <nav className="flex gap-6 text-black text-2xl">
        <div className="cursor-pointer hover:text-blue-600">Browse Jobs ▾</div>
        <div className="cursor-pointer hover:text-blue-600">Post A job</div>
        <div className="cursor-pointer hover:text-blue-600">Training ▾</div>
      </nav>

      {/* Right Side Actions */}
      <div className="flex flex-row items-center gap-6  h-28 ">

        {/* Login & Register Buttons */}
        <button className="bg-sky-500 text-white font-semibold w-44 text-2xl px-10 py-4 rounded-3xl hover:bg-sky-600">
          Login
        </button>
        <button className="bg-sky-500 text-white font-semiboldw-44 text-2xl px-10 py-4 rounded-3xl hover:bg-sky-600">
          Register
        </button>

        {/* Employer Zone */}
        <span className="text-gray-700 font-semibold text-2xl cursor-pointer">
          Employer Zone
        </span>
      </div>
    </header>
    <SearchBar/>
    
    </>
  );
};

export default Header;
