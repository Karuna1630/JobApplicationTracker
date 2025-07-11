import React from 'react';
import { IoSearchSharp, IoCalendarOutline } from "react-icons/io5";
import { CiLocationOn } from "react-icons/ci";
import Footer from '../Components/Footer';
import Navbar from '../Components/Navbar';

const jobs = [
  {
    title: "Senior Frontend Developer",
    company: "TechCorp Inc.",
    location: "Bhaktapur, Nepal",
    salary: "Rs.120,000 - Rs.160,000",
    posted: "2 days ago",
    type: "Full-time",
    badgeColor: "bg-blue-600",
    description: "Looking for an experienced frontend developer to join our growing team...",
  },
  {
    title: "React Developer",
    company: "StartupXYZ",
    location: "Dharan",
    salary: "Rs.90,000 - Rs.120,000",
    posted: "1 week ago",
    type: "Full-time",
    badgeColor: "bg-blue-600",
    description: "Join our innovative team building the next generation of web applications...",
  },
  {
    title: "UI/UX Developer",
    company: "Design Studio",
    location: "Kathmandu",
    salary: "Rs.85,000 - Rs.110,000",
    posted: "3 days ago",
    type: "Contract",
    badgeColor: "bg-yellow-500",
    description: "We are seeking a creative UI/UX designer to help shape our product experience...",
  },
  {
    title: ".NET Developer",
    company: "CodeMatrix Solutions",
    location: "Biratnagar, Nepal",
    salary: "Rs.100,000 - Rs.130,000",
    posted: "5 days ago",
    type: "Full-time",
    badgeColor: "bg-blue-600",
    description: "We are looking for a skilled .NET developer to maintain and expand our enterprise applications...",
  },
];

const JobRecommendation = () => {
  return (
    <>
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-300">
        <Navbar />

        {/* All content wrapped in one div */}
        <div className="flex flex-col items-center justify-start px-4 py-10">
          {/* Title & Description */}
          <div className="mb-10 text-center">
            <h2 className="text-4xl font-bold text-gray-800">Job Recommendations</h2>
            <p className="text-gray-600 text-sm mt-1 max-w-md">
              Personalized job suggestions based on your profile
            </p>
          </div>

          {/* Job Cards */}
          <div className="grid md:grid-cols-2 gap-6 w-full max-w-6xl">
            {jobs.map((job, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow p-7 w-full"
              >
                {/* Job Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold text-blue-900">{job.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{job.company}</p>
                  </div>
                  <span
                    className={`${job.badgeColor} text-white text-xs px-2 py-1 rounded-full font-medium`}
                  >
                    {job.type}
                  </span>
                </div>

                {/* Job Info */}
                <div className="mt-4 text-sm text-gray-700 space-y-1">
                  <div className="flex items-center gap-2">
                    <CiLocationOn className="w-4 h-4 text-gray-500" />
                    <span>{job.location}</span>
                  </div>
                  <div>{job.salary}</div>
                  <div className="flex items-center gap-2">
                    <IoCalendarOutline className="w-4 h-4 text-gray-500" />
                    <span>{job.posted}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-700 mt-4">{job.description}</p>

                {/* Buttons */}
                <div className="flex gap-2 mt-4">
                  <button className="px-3 py-1 bg-white text-gray-700 border border-gray-300 rounded hover:bg-gray-100 text-sm">
                    View Details
                  </button>
                  <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Cancel Button */}
          <div className="mt-10 w-full max-w-6xl text-right">
            <button className="px-5 py-2 text-sm font-medium bg-blue-500 text-white rounded hover:bg-blue-600">
              Cancel
            </button>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default JobRecommendation;
