import React from 'react'
import { IoSearch } from "react-icons/io5";

const SearchBar = () => {
  return (
    <div>
       <div className="relative bg-sky-500 text-white py-16 px-4 sm:px-8 md:px-16">
      {/* Background pattern overlay (optional) */}
      <div className="absolute inset-0 bg-[url('/your-pattern.svg')] opacity-10 pointer-events-none"></div>


      {/* Centered Content */}
      <div className="text-center max-w-2xl mx-auto relative z-10">
        <h1 className="md:text-5xl font-bold mb-4">
         Start Your Career Journey
        </h1>
        <p className="text-xl mb-8">
         Search jobs based on your skills, interests, and values
        </p>

        {/* Search Bar */}
        <div className="flex items-center justify-center">
          <input
            type="text"
            placeholder="Search categories..."
            className="w-full h-16 py-3 px-4 text-xl rounded-l-full text-gray-700 focus:outline-none"
          />
          <button className="bg-sky-700 py-3 px-4  h-16 rounded-r-full">
           <IoSearch  className="text-white w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
    </div>
  )
}

export default SearchBar
