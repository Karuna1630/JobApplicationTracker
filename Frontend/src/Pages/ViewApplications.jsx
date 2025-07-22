import React from "react";
import {
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaFileAlt,
  FaUserCheck,
  FaTimesCircle,
} from "react-icons/fa";


import { MdWork } from "react-icons/md";
import { HiStatusOnline } from "react-icons/hi";

const ViewApplications = () => {
  const applications = [
    {
      id: 1,
      name: "Applicant",
      role: "",
      location: "",
      email: "",
      phone: "",
      experience:
        "3+ years of experience in MERN stack applications, REST APIs and agile environments.",
      skills: ["React", "Node.js", "MongoDB", "Express", "Tailwind", "TypeScript"],
      resume: "#",
      status: "Applied",
    },
  ];

  const statusColors = {
    Applied: "bg-blue-100 text-blue-700",
    Interviewing: "bg-yellow-100 text-yellow-800",
    Rejected: "bg-red-100 text-red-700",
    Offer: "bg-green-100 text-green-800",
    Shortlisted: "bg-purple-100 text-purple-800",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 py-14 px-6">
      <h1 className="text-5xl font-extrabold text-center text-indigo-800 mb-16 drop-shadow">
        📥 Applications Overview
      </h1>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        {applications.map((applicant) => (
          <div
            key={applicant.id}
            className="relative group bg-white/40 backdrop-blur-lg border border-white/50 rounded-3xl p-8 shadow-2xl transition-all hover:shadow-3xl hover:scale-[1.015] duration-300"
          >
            {/* Gradient Border Effect */}
            <div className="absolute -top-1 -left-1 h-[102%] w-[102%] rounded-3xl border-4 border-transparent group-hover:border-indigo-300 transition duration-500"></div>

            {/* Header */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-800">{applicant.name}</h2>
              <div className="flex items-center text-base text-gray-600 mt-2 gap-2">
                <MdWork className="text-indigo-600 text-lg" />
                <span>{applicant.role || "Role not specified"}</span>
              </div>
              <div className="flex items-center text-sm text-gray-500 mt-1 gap-2">
                <FaMapMarkerAlt className="text-red-400" />
                <span>{applicant.location || "Location not provided"}</span>
              </div>
            </div>

            {/* Status */}
            <div className="mb-6">
              <span
                className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium ${
                  statusColors[applicant.status] || "bg-gray-100 text-gray-800"
                }`}
              >
                <HiStatusOnline className="text-lg" />
                {applicant.status}
              </span>
            </div>

            {/* Contact Info */}
            <div className="flex flex-col sm:flex-row gap-8 text-base text-gray-700 mb-6">
              <div className="flex items-center gap-2">
                <FaEnvelope className="text-indigo-600" />
                <span>{applicant.email || "Not provided"}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaPhoneAlt className="text-green-600" />
                <span>{applicant.phone || "Not provided"}</span>
              </div>
            </div>

            {/* Experience */}
            <div className="mb-6">
              <h3 className="text-base font-bold text-gray-700 mb-2">💼 Experience</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                {applicant.experience}
              </p>
            </div>

            {/* Skills */}
            <div className="flex flex-wrap gap-3 mb-8">
              {applicant.skills.map((skill) => (
                <span
                  key={skill}
                  className="bg-indigo-100 text-indigo-800 text-sm font-medium px-4 py-1.5 rounded-full shadow-sm"
                >
                  {skill}
                </span>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              <a
                href={applicant.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold py-2 px-5 rounded-xl transition"
              >
                <FaFileAlt />
                Resume
              </a>
              <button className="flex items-center gap-2 bg-green-100 hover:bg-green-200 text-green-800 text-sm font-semibold py-2 px-5 rounded-xl transition">
                <FaUserCheck />
                Shortlist
              </button>
              <button className="flex items-center gap-2 bg-red-100 hover:bg-red-200 text-red-700 text-sm font-semibold py-2 px-5 rounded-xl transition">
                <FaTimesCircle />
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewApplications;
