import React from "react";
import { FiX } from "react-icons/fi";

const applications = [
  {
    title: "Senior Fronted Developer",
    name: "Sarah Johnson",
    experience: "2 years experience",
    time: "Applied 2 hours ago",
    skills: ["React", "Typescript", "Node.js"],
    status: "NEW",
    statusStyle: "bg-green-100 text-green-700",
    btnPrimary: "Review Application",
    btnSecondary: "Quick Reject",
  },
  {
    title: "UX/UI Designer",
    name: "Michael Chen",
    experience: "4 years experience",
    time: "Applied 1 day ago",
    skills: ["Figma", "Adobe Suite", "Prototyping"],
    status: "UNDER REVIEW",
    statusStyle: "bg-yellow-100 text-yellow-700",
    btnPrimary: "Confirm Review",
    btnSecondary: "Scheduled Interview",
  },
  {
    title: "Backend Developer",
    name: "Emily Rodriguez",
    experience: "5 years experience",
    time: "Applied 3 days ago",
    skills: ["Python", "Django", "PostgreSQL"],
    status: "INTERVIEW SCHEDULED",
    statusStyle: "bg-green-100 text-green-700",
    btnPrimary: "View Details",
    btnSecondary: "Reschedule",
  },
];

const ApplicationReceived = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl p-6 relative">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <FiX size={20} />
        </button>

        {/* Header */}
        <div className="mb-6 border-b pb-3">
          <h2 className="text-2xl font-bold text-gray-800">Applications Received</h2>
          <p className="text-gray-600 text-sm">Manage and review all job applications</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4 shadow text-center">
            <h3 className="text-2xl font-bold">47</h3>
            <p className="text-sm text-gray-600">Total Applications</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 shadow text-center">
            <h3 className="text-2xl font-bold">12</h3>
            <p className="text-sm text-gray-600">New Applications</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 shadow text-center">
            <h3 className="text-2xl font-bold">18</h3>
            <p className="text-sm text-gray-600">Under Review</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 shadow text-center">
            <h3 className="text-2xl font-bold">8</h3>
            <p className="text-sm text-gray-600">Interview Scheduled</p>
          </div>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search applications"
          className="w-full p-3 mb-6 rounded-md border border-gray-200 shadow-sm"
        />

        {/* Applications List */}
        <div className="max-h-80 overflow-y-auto pr-2">
          {applications.map((app, index) => (
            <div key={index} className="bg-gray-50 p-5 rounded-lg shadow-sm mb-4">
              <div className="flex justify-between items-start mb-1">
                <h3 className="text-lg font-semibold">{app.title}</h3>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${app.statusStyle}`}>
                  {app.status}
                </span>
              </div>
              <p className="text-sm text-gray-700 mb-1">
                {app.name} - {app.experience}
              </p>
              <p className="text-sm text-gray-500 mb-3">
                {app.time} · {app.skills.join(", ")}
              </p>
              <div className="flex gap-3">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700">
                  {app.btnPrimary}
                </button>
                <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm hover:bg-gray-300">
                  {app.btnSecondary}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ApplicationReceived;
