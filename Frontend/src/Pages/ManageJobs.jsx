import React from "react";

const ManageJobs = ({ onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
    <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-4xl relative">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-lg"
      >
        ✕
      </button>
      {/* Your existing component content here */}
    </div>
  </div>
);

export default ManageJobs;
