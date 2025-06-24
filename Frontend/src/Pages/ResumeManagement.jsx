import React from "react";
import editIcon from "../assets/edit.png";
import documentIcon from "../assets/document.png";
import downloadIcon from "../assets/download.png";
import viewIcon from "../assets/view.png";
import completeIcon from "../assets/complete.png";
import deleteIcon from "../assets/delete.png";


const ResumeManagement = () => {
  return (
    <div className="bg-gradient-to-br from-blue-100 via-white to-blue-300 px=20,py=20">
      {/* Title & Description for resume*/}
      <div className="mb-10 text-center flex flex-col items-center">
  <h2 className="text-4xl font-bold text-gray-800">Resume Management</h2>
  <p className="text-gray-600 text-sm mt-1 max-w-md">
    Upload, edit, and manage your resumes with detailed status tracking
  </p>
</div>

     {/* Upload Section */}
<div className="bg-white border border-dashed border-blue-300 rounded-xl p-7 mb-10 text-center shadow-sm max-w-2xl w-full mx-auto">
  <img src={documentIcon} alt="Upload" className="mx-auto h-10" />
  <p className="text-blue-800 text-base font-semibold mt-3">Drag & drop your resume here</p>
  <p className="text-sm text-gray-600">or click to browse files</p>
  <p className="text-xs text-gray-500 mt-1">Supported formats: PDF, DOC, DOCX (Max 5MB)</p>
</div>



      {/* Resume Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Resume 1 */}
<div className="bg-white rounded-xl shadow p-7 max-w-2xl w-full mx-auto">
  <div className="flex justify-between items-start">
    <div>
      <h3 className="text-xl font-semibold text-blue-900">Software Engineer Resume</h3>
      <p className="text-sm text-gray-500 mt-1">Updated 2 days ago • PDF • 245KB</p>
    </div>
    <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
      Active
    </span>
  </div>

  <div className="mt-4 text-sm text-gray-700 space-y-1">
    <p><strong className="text-blue-700">24</strong> Applications</p>
    <p><strong className="text-blue-700">6</strong> Responses</p>
    <p><strong className="text-blue-700">3</strong> Interviews</p>
  </div>

  <div className="flex gap-2 mt-4">
  <button className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded  hover:bg-blue-600 text-sm">
    <img src={editIcon} alt="Edit" className="w-4 h-4" /> Edit
  </button>
  <button className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm">
    <img src={downloadIcon} alt="Download" className="w-4 h-4" /> Download
  </button>
  <button className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm">
    <img src={viewIcon} alt="View" className="w-4 h-4" /> View
  </button>
   </div>


  
</div>


       {/* Resume 2 */}
<div className="bg-white rounded-xl shadow p-7 max-w-2xl w-full mx-auto">
  <div className="flex justify-between items-start">
    <div>
      <h3 className="text-xl font-semibold text-blue-900">Product Manager Resume</h3>
      <p className="text-sm text-gray-500 mt-1">Created 1 week ago • DOC • 189KB</p>
    </div>
    <span className="bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded-full font-medium">
      Draft
    </span>
  </div>

  <div className="mt-4 text-sm text-gray-700 space-y-1">
    <p>0 Applications</p>
    <p>0 Responses</p>
    <p>0 Interviews</p>
  </div>

  <div className="flex gap-2 mt-4">
    <button className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm">
      <img src={completeIcon} alt="Complete" className="w-4 h-4" /> Complete
    </button>
    <button className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm">
      <img src={editIcon} alt="Edit" className="w-4 h-4" /> Edit
    </button>
    <button className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm">
      <img src={deleteIcon} alt="Delete" className="w-4 h-4" /> Delete
    </button>
  </div>
</div>
</div>


      {/* Cancel Button */}
      <div className="mt-10 text-right">
        <button className="px-5 py-2 text-sm font-medium bg-blue-500 text-gray-800 rounded hover:bg-blue-600">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ResumeManagement;