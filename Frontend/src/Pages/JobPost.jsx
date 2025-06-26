import React from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

function JobPost() {
  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-300 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white rounded shadow-lg">
        {/* Header */}
        <div className="bg-blue-500 text-white p-4 rounded-t">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <span className="text-2xl"></span>
            Add Job Post
          </h2>
          <p className="text-sm">Post new opportunities and attract top talent</p>
        </div>

        {/* Form */}
        <form className="bg-blue-50 p-6 space-y-4 rounded-b">
          <div>
            <label className="block font-medium mb-1">Job Title</label>
            <input
              type="text"
              placeholder="e.g. Senior Software Engineer"
              className="w-full px-4 py-2 rounded bg-blue-100 outline-none"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Department</label>
            <input
              type="text"
              placeholder="e.g. Engineering"
              className="w-full px-4 py-2 rounded bg-blue-100 outline-none"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Location</label>
            <input
              type="text"
              placeholder="e.g. Biratnagar, Nepal"
              className="w-full px-4 py-2 rounded bg-blue-100 outline-none"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Job Type</label>
            <input
              type="text"
              placeholder="Full-Time"
              className="w-full px-4 py-2 rounded bg-blue-100 outline-none"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Salary Range</label>
            <input
              type="text"
              placeholder="e.g. Rs.50,000 - Rs.120,000"
              className="w-full px-4 py-2 rounded bg-blue-100 outline-none"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Status</label>
            <input
              type="text"
              placeholder="Active"
              className="w-full px-4 py-2 rounded bg-blue-100 outline-none"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Job Description</label>
            <textarea
              rows="3"
              placeholder="Describe the role, responsibilities, and what makes this opportunity exciting..."
              className="w-full px-4 py-2 rounded bg-blue-100 outline-none resize-none"
            ></textarea>
          </div>

          <div>
            <label className="block font-medium mb-1">Requirements</label>
            <textarea
              rows="3"
              placeholder="List the required skills, experience, and qualifications..."
              className="w-full px-4 py-2 rounded bg-blue-100 outline-none resize-none"
            ></textarea>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              className="px-4 py-2 bg-white border border-gray-400 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-800 text-white rounded hover:bg-blue-600"
            >
              Post Job
            </button>
          </div>
        </form>
      </div>
    </div>
    <Footer/>
    </>
  );
}

export default JobPost;
