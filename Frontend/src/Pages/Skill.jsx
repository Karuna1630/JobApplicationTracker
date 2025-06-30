import React from "react";
import { FaRegUserCircle, FaRegEdit } from "react-icons/fa";
import { FaTrashCan } from "react-icons/fa6";

const Skill = () => {
  return (
    <div className="bg-gradient-to-br from-blue-100 via-white to-blue-300 min-h-screen p-6">
      {/* Header */}
      <h2 className="text-3xl font-extrabold text-blue-800 mb-1 flex items-center gap-2">
        <FaRegUserCircle className="text-blue-600 text-2xl" />
        Skills
      </h2>
      <p className="text-gray-600 mb-6 text-sm italic">
        Showcase your expertise and track your professional development
      </p>

      {/* Summary Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border border-blue-200 p-4 rounded-lg mb-6 bg-white shadow-sm">
        {[
          { label: "Total Skills", value: 6, color: "text-blue-700" },
          { label: "Verified Skills", value: 3, color: "text-green-600" },
          { label: "Expert Level", value: 1, color: "text-purple-600" },
          { label: "Endorsements", value: 97, color: "text-yellow-500" }
        ].map((item, idx) => (
          <div key={idx} className="hover:scale-105 transition-transform">
            <p className="text-xs text-gray-500">{item.label}</p>
            <p className={`text-xl font-semibold ${item.color}`}>{item.value}</p>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {["All Skills (6)", "Technical (2)", "Design (1)", "Management (2)", "Communication (1)"].map((tab, idx) => (
          <button
            key={idx}
            className={`px-4 py-1.5 text-xs font-medium rounded-full border transition-all duration-200 ${
              tab.includes("Design")
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-gray-100 text-gray-800 border-gray-300 hover:bg-blue-100 hover:text-blue-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Skill Card */}
      <div className="bg-white p-5 rounded-lg shadow hover:shadow-md transition border border-gray-200 mb-6">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <FaRegUserCircle className="text-blue-500 text-xl" />
            <span className="text-blue-700 font-semibold text-sm">UI/UX Design</span>
            <span className="text-green-600 text-xs bg-green-100 px-2 py-0.5 rounded-full">(Verified)</span>
          </div>
          <div className="flex gap-3 text-gray-500">
            <FaRegEdit className="hover:text-blue-500 cursor-pointer" />
            <FaTrashCan className="hover:text-red-500 cursor-pointer" />
          </div>
        </div>
        <p className="text-sm text-blue-700 font-medium mb-1">Advanced</p>
        <p className="text-sm text-gray-600 mb-1">
          Expert in Figma, Adobe Creative Suite, user research, and prototyping
        </p>
        <p className="text-sm text-gray-500 mb-1">3 years experience</p>
        <p className="text-sm text-gray-500 mb-3">
          Recent Projects: <span className="text-gray-800 font-medium">Mobile App Design, Brand Identity</span> +1 more
        </p>
        <div className="flex items-center gap-1 text-yellow-500 text-sm">
          {[...Array(4)].map((_, i) => (
            <span key={i}>★</span>
          ))}
          <span className="ml-2 text-gray-600">18 endorsements</span>
        </div>
      </div>

      {/* Suggested Skills */}
      <div>
        <h3 className="text-sm font-semibold text-yellow-600 mb-2">Suggested Skills to Add</h3>
        <div className="flex flex-wrap gap-2">
          {[
            "Python", "React", "Machine Learning", "Digital Marketing", "Sales",
            "Content Writing", "Photography", "Video Editing", "Social Media Management", "Customer Service"
          ].map((skill, i) => (
            <span
              key={i}
              className="bg-gray-100 hover:bg-blue-100 hover:text-blue-800 transition text-sm px-3 py-1 rounded-full text-gray-800 cursor-pointer"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Back Button */}
      <div className="mt-6 text-center">
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full font-semibold transition-all">
          ← Back
        </button>
      </div>
    </div>
  );
};

export default Skill;
