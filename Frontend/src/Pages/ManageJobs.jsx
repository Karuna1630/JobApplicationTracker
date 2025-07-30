
import React, { useState } from 'react';

const dummyApplications = [
  {
    id: 1,
    applicationId: '22955',
    firstName: 'Amish',
    lastName: 'Tiwari',
    email: 'ami.t@hotmail.com',
    phone: '+91673987990',
    jobId: 'demoaccount2017',
    usp: 'Handle all type of account and payroll activities',
    ctc: '',
    status: 'initiated',
    comments: 'No feedback',
  },
  {
    id: 2,
    applicationId: '22953',
    firstName: 'Vedant',
    lastName: 'Prasad',
    email: 'prasad.xyz@hotmail.com',
    phone: '+9198507893',
    jobId: 'democontent2017',
    usp: 'Social media understanding and know which works best for which type of business',
    ctc: '600000',
    status: 'initiated',
    comments: 'No feedback',
  },
  {
    id: 3,
    applicationId: '22951',
    firstName: 'Sneha',
    lastName: 'Lamba',
    email: 'snehal.659@live.com',
    phone: '+91767789887',
    jobId: 'demowpdev2017',
    usp: 'Analytical thinking',
    ctc: '500000',
    status: 'initiated',
    comments: 'No feedback',
  },
];

const ManageJobs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filteredApps = dummyApplications.filter((app) => {
    const fullText = `${app.firstName} ${app.lastName} ${app.email} ${app.jobId} ${app.status}`.toLowerCase();
    return (
      fullText.includes(searchTerm.toLowerCase()) &&
      (statusFilter === '' || app.status === statusFilter)
    );
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-300 px-4">
      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-7xl">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-1">
          Manage Jobs
        </h1>
        <p className="text-center text-gray-500 mb-6">
          List of all the candidates
        </p>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <input
            type="text"
            placeholder="Search"
            className="border border-gray-300 px-4 py-2 rounded-md w-full md:w-1/2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="border border-gray-300 px-4 py-2 rounded-md w-full md:w-1/3"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Select Application Status</option>
            <option value="initiated">Initiated</option>
            <option value="interviewing">Interviewing</option>
            <option value="offer">Offer</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-700 border border-gray-200">
            <thead className="text-xs text-white uppercase bg-blue-500">
              <tr>
                <th className="px-4 py-3">SNo</th>
                <th className="px-4 py-3">Application ID</th>
                <th className="px-4 py-3">First Name</th>
                <th className="px-4 py-3">Last Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Job ID</th>
                <th className="px-4 py-3">My USP</th>
                <th className="px-4 py-3">CTC</th>
                <th className="px-4 py-3">Application Status</th>
                <th className="px-4 py-3">Comments</th>
              </tr>
            </thead>
            <tbody>
              {filteredApps.map((app, index) => (
                <tr key={app.id} className="bg-white border-b hover:bg-gray-100">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2 text-gray-500 font-semibold">{app.applicationId}</td>
                  <td className="px-4 py-2">{app.firstName}</td>
                  <td className="px-4 py-2">{app.lastName}</td>
                  <td className="px-4 py-2">{app.email}</td>
                  <td className="px-4 py-2">{app.phone}</td>
                  <td className="px-4 py-2">{app.jobId}</td>
                  <td className="px-4 py-2">{app.usp}</td>
                  <td className="px-4 py-2">{app.ctc || '-'}</td>
                  <td className="px-4 py-2 capitalize">{app.status}</td>
                  <td className="px-4 py-2">{app.comments}</td>
                </tr>
              ))}
              {filteredApps.length === 0 && (
                <tr>
                  <td colSpan="11" className="text-center py-4 text-gray-500">
                    No matching applications found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

import React, { useEffect, useState } from "react";
import axiosInstance from "../Utils/axiosInstance";

const ManageJobs = ({ onClose, reloadTrigger, companyId }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    try {
      if (!companyId) return;
      const res = await axiosInstance.get(`/api/Jobs/getjobsbyid?id=${companyId}`);
      setJobs(res.data);
    } catch (err) {
      console.error("Failed to fetch jobs", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [reloadTrigger, companyId]);


  if (loading) return <div className="p-6 text-center">Loading jobs...</div>;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-4xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-lg">✕</button>
        <h2 className="text-2xl font-bold mb-4">Manage Jobs</h2>
        {jobs.length === 0 ? (
          <p className="text-center text-gray-500">No jobs posted yet.</p>
        ) : (
          <table className="w-full text-left border">
            <thead>
              <tr className="border-b bg-gray-100">
                <th className="p-2">Title</th>
                <th className="p-2">Location</th>
                <th className="p-2">Salary</th>
                <th className="p-2">Deadline</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.jobId} className="border-b hover:bg-gray-50">
                  <td className="p-2">{job.title}</td>
                  <td className="p-2">{job.location}</td>
                  <td className="p-2">{job.salaryRangeMin} - {job.salaryRangeMax}</td>
                  <td className="p-2">{new Date(job.applicationDeadline).toLocaleDateString()}</td>
                  <td className="p-2">
                    <span className={`px-3 py-1 rounded-full text-sm ${job.status === "A" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>
                      {job.status === "A" ? "Active" : "Inactive"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
export default ManageJobs;
