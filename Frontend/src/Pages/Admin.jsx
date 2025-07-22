import React, { useState } from "react";
import {FiUsers, FiCheckCircle, FiCalendar, FiEye, FiMail, FiHome, FiBriefcase, FiUser, FiHelpCircle, FiX,
} from "react-icons/fi";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

// Dummy Company List
const dummyCompanies = [
  {
    _id: "1",
    companyName: "Tech Solutions Ltd",
    companyEmail: "hr@techsolutions.com",
    createdAt: "2025-07-15",
    phone: "123-456-7890",
  },
  {
    _id: "2",
    companyName: "InnovateX",
    companyEmail: "contact@innovatex.com",
    createdAt: "2025-07-14",
    phone: "987-654-3210",
  },
  {
    _id: "3",
    companyName: "CodeNest Inc.",
    companyEmail: "jobs@codenest.io",
    createdAt: "2025-07-13",
    phone: "555-123-4567",
  },
];

// Dummy Jobseekers List
const dummyJobseekers = [
  {
    _id: "j1",
    name: "Alice Johnson",
    email: "alice@gmail.com",
    createdAt: "2025-07-10",
    phone: "555-987-6543",
    status: "Active",
  },
  {
    _id: "j2",
    name: "Bob Smith",
    email: "bob@gmail.com",
    createdAt: "2025-07-11",
    phone: "555-123-7890",
    status: "Blocked",
  },
  {
    _id: "j3",
    name: "Charlie Brown",
    email: "charlie.brown@gmail.com",
    createdAt: "2025-07-12",
    phone: "555-321-4567",
    status: "Active",
  },
];

// Chart Data
const chartData = [
  { month: "Jan", applications: 20, shortlisted: 10 },
  { month: "Feb", applications: 35, shortlisted: 15 },
  { month: "Mar", applications: 45, shortlisted: 20 },
  { month: "Apr", applications: 50, shortlisted: 30 },
  { month: "May", applications: 60, shortlisted: 40 },
  { month: "Jun", applications: 55, shortlisted: 35 },
  { month: "Jul", applications: 70, shortlisted: 45 },
  { month: "Aug", applications: 75, shortlisted: 50 },
  { month: "Sep", applications: 80, shortlisted: 55 },
  { month: "Oct", applications: 95, shortlisted: 65 },
  { month: "Nov", applications: 90, shortlisted: 60 },
  { month: "Dec", applications: 100, shortlisted: 70 },
];

function Admin() {
  const [searchTerm, setSearchTerm] = useState("");
  const [companies, setCompanies] = useState(dummyCompanies);
  const [jobseekers, setJobseekers] = useState(dummyJobseekers);
  const [approvedCompanies, setApprovedCompanies] = useState([]);
  const [approvedJobseekers, setApprovedJobseekers] = useState([]);
  const [rejectedCompanies, setRejectedCompanies] = useState([]);
  const [rejectedJobseekers, setRejectedJobseekers] = useState([]);

  const [selectedItem, setSelectedItem] = useState(null); // company or jobseeker object
  const [selectedType, setSelectedType] = useState(null); // "company" or "jobseeker"
  const [tab, setTab] = useState("dashboard");

  // Approve handler
  const handleApprove = (id) => {
    if (selectedType === "company") {
      const approved = companies.find((c) => c._id === id);
      if (approved) {
        setApprovedCompanies((prev) => [...prev, approved]);
        setCompanies((prev) => prev.filter((c) => c._id !== id));
      }
      alert(`Approved company with ID: ${id}`);
    } else if (selectedType === "jobseeker") {
      const approved = jobseekers.find((j) => j._id === id);
      if (approved) {
        setApprovedJobseekers((prev) => [...prev, approved]);
        setJobseekers((prev) => prev.filter((j) => j._id !== id));
      }
      alert(`Approved jobseeker with ID: ${id}`);
    }
    setSelectedItem(null);
  };

  // Reject handler
  const handleReject = (id) => {
    if (selectedType === "company") {
      const rejected = companies.find((c) => c._id === id);
      if (rejected) {
        setRejectedCompanies((prev) => [...prev, rejected]);
        setCompanies((prev) => prev.filter((c) => c._id !== id));
      }
      alert(`Rejected company with ID: ${id}`);
    } else if (selectedType === "jobseeker") {
      const rejected = jobseekers.find((j) => j._id === id);
      if (rejected) {
        setRejectedJobseekers((prev) => [...prev, rejected]);
        setJobseekers((prev) => prev.filter((j) => j._id !== id));
      }
      alert(`Rejected jobseeker with ID: ${id}`);
    }
    setSelectedItem(null);
  };

  // Filters
  const filteredCompanies = companies.filter((company) =>
    company.companyName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredJobseekers = jobseekers.filter((js) =>
    js.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredRejectedCompanies = rejectedCompanies.filter((company) =>
    company.companyName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredRejectedJobseekers = rejectedJobseekers.filter((js) =>
    js.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Components
  const StatBox = ({ title, count, percent, color }) => (
    <div className={`p-5 rounded-xl shadow bg-${color}-100 text-${color}-900`}>
      <div className="flex justify-between items-center mb-2">
        <p className="font-medium">{title}</p>
        <span className="text-sm font-semibold">{percent}</span>
      </div>
      <h2 className="text-2xl font-bold">{count}</h2>
    </div>
  );

  const CompanyCard = ({ company }) => (
    <div className="bg-white p-4 rounded-xl shadow hover:shadow-md transition">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center">
          <FiUsers className="mr-2" />
          {company.companyName}
        </h2>
        <button
          className="text-blue-600 hover:text-blue-800"
          onClick={() => {
            setSelectedItem(company);
            setSelectedType("company");
          }}
        >
          <FiEye className="inline mr-1" /> View
        </button>
      </div>
      <p className="text-sm text-gray-600">
        <FiMail className="inline mr-2" /> {company.companyEmail}
      </p>
      <p className="text-sm text-gray-600 mt-1">
        <FiCalendar className="inline mr-2" />
        Registered: {new Date(company.createdAt).toLocaleDateString()}
      </p>
    </div>
  );

  const JobseekerCard = ({ user }) => (
    <div className="bg-white p-4 rounded-xl shadow mb-4 flex justify-between items-center">
      <div>
        <p className="text-lg font-semibold">{user.name}</p>
        <p className="text-sm text-gray-600">{user.email}</p>
        <p className="text-sm text-gray-400">
          Registered: {new Date(user.createdAt).toLocaleDateString()}
        </p>
      </div>
      <div className="flex items-center gap-4">
        <div
          className={`px-3 py-1 rounded-full font-semibold ${
            user.status === "Active"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {user.status}
        </div>
        <button
          className="text-blue-600 hover:text-blue-800 flex items-center"
          onClick={() => {
            setSelectedItem(user);
            setSelectedType("jobseeker");
          }}
        >
          <FiEye className="inline mr-1" /> View
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-500 text-white p-6 space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-full" />
          <div>
            <p className="font-bold">Admin</p>
            <p className="text-sm">Anshu</p>
          </div>
        </div>
        <nav className="space-y-5 text-sm font-medium">
          <button
            className={`flex items-center gap-2 w-full ${
              tab === "dashboard" ? "text-yellow-300" : "hover:text-yellow-300"
            }`}
            onClick={() => setTab("dashboard")}
          >
            <FiHome /> Dashboard
          </button>
          <button
            className={`flex items-center gap-2 w-full ${
              tab === "companies" ? "text-yellow-300" : "hover:text-yellow-300"
            }`}
            onClick={() => setTab("companies")}
          >
            <FiBriefcase /> Companies
          </button>
          <button
            className={`flex items-center gap-2 w-full ${
              tab === "jobseekers" ? "text-yellow-300" : "hover:text-yellow-300"
            }`}
            onClick={() => setTab("jobseekers")}
          >
            <FiUser /> Jobseekers
          </button>
          <button
            className={`flex items-center gap-2 w-full ${
              tab === "approved" ? "text-yellow-300" : "hover:text-yellow-300"
            }`}
            onClick={() => setTab("approved")}
          >
            <FiCheckCircle /> Approved
          </button>
          <button
            className={`flex items-center gap-2 w-full ${
              tab === "rejected" ? "text-yellow-300" : "hover:text-yellow-300"
            }`}
            onClick={() => setTab("rejected")}
          >
            <FiX /> Rejected
          </button>
          <button className="flex items-center gap-2 w-full hover:text-yellow-300">
            <FiHelpCircle /> Support
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 space-y-8">
        {tab === "dashboard" && (
          <>
            <header className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
              <span className="text-gray-500">{new Date().toDateString()}</span>
            </header>

            {/* Stats */}
            <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <StatBox
                title="Applications"
                count="132.0K"
                percent="60%"
                color="blue"
              />
              <StatBox
                title="Shortlisted"
                count="10.9K"
                percent="50%"
                color="green"
              />
              <StatBox title="On Hold" count="03.1K" percent="34%" color="yellow" />
            </section>

            {/* Chart */}
            <section className="bg-white p-6 rounded-xl shadow">
              <h3 className="text-lg font-semibold mb-4">Active Jobs</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={chartData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="applications" fill="#6366f1" />
                  <Bar dataKey="shortlisted" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </section>
          </>
        )}

        {tab === "companies" && (
          <>
            <h3 className="text-xl font-bold mb-6 text-center"> Company Panel</h3>
            <input
              type="text"
              placeholder="Search company..."
              className="w-full border border-gray-300 rounded-md px-4 py-2 mb-6"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCompanies.map((company) => (
                <div key={company._id} className="bg-white rounded-xl shadow">
                  <CompanyCard company={company} />
                </div>
              ))}
            </div>
          </>
        )}

        {tab === "jobseekers" && (
          <>
            <h3 className="text-xl font-bold mb-6 text-center">Jobseekers Panel</h3>
            <input
              type="text"
              placeholder="Search jobseeker..."
              className="w-full border border-gray-300 rounded-md px-4 py-2 mb-6"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div>
              {filteredJobseekers.length > 0 ? (
                filteredJobseekers.map((user) => (
                  <div
                    key={user._id}
                    className="bg-white rounded-xl shadow mb-4  justify-between items-center"
                  >
                    <JobseekerCard user={user} />
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">No jobseekers found.</p>
              )}
            </div>
          </>
        )}

        {tab === "approved" && (
          <>
            <h3 className="text-xl font-bold mb-6 text-center">Approved Companies</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {approvedCompanies.length > 0 ? (
                approvedCompanies.map((company) => (
                  <CompanyCard key={company._id} company={company} />
                ))
              ) : (
                <p className="text-center text-gray-500 col-span-full">
                  No approved companies yet.
                </p>
              )}
            </div>

            <h3 className="text-xl font-bold mb-6 text-center">Approved Jobseekers</h3>
            <div>
              {approvedJobseekers.length > 0 ? (
                approvedJobseekers.map((user) => (
                  <JobseekerCard key={user._id} user={user} />
                ))
              ) : (
                <p className="text-center text-gray-500">No approved jobseekers yet.</p>
              )}
            </div>
          </>
        )}

        {tab === "rejected" && (
          <>
            <h3 className="text-xl font-bold mb-6 text-center">Rejected Companies</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {filteredRejectedCompanies.length > 0 ? (
                filteredRejectedCompanies.map((company) => (
                  <CompanyCard key={company._id} company={company} />
                ))
              ) : (
                <p className="text-center text-gray-500 col-span-full">
                  No rejected companies yet.
                </p>
              )}
            </div>

            <h3 className="text-xl font-bold mb-6 text-center">Rejected Jobseekers</h3>
            <div>
              {filteredRejectedJobseekers.length > 0 ? (
                filteredRejectedJobseekers.map((user) => (
                  <JobseekerCard key={user._id} user={user} />
                ))
              ) : (
                <p className="text-center text-gray-500">No rejected jobseekers yet.</p>
              )}
            </div>
          </>
        )}

        {/* Support Tab */}
        {tab === "support" && (
          <div className="text-center text-gray-500">
            <p>Support content goes here...</p>
          </div>
        )}
      </main>

      {/* Right Sidebar */}
      <aside className="w-80 bg-white border-l p-6 space-y-6 shadow-inner hidden lg:block">
        <div>
          <h3 className="text-lg font-semibold mb-2">Total Applications</h3>
          <ul className="text-sm space-y-2">
            <li>
              <span className="text-blue-600">■</span> Applications - 58%
            </li>
            <li>
              <span className="text-green-600">■</span> Shortlisted - 22%
            </li>
            <li>
              <span className="text-yellow-500">■</span> On Hold - 12%
            </li>
            <li>
              <span className="text-red-500">■</span> Rejected - 08%
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Scheduled Meetings</h3>
          <ul className="text-sm space-y-1">
            <li>Thu 8 - Interview (9:00am)</li>
            <li>Fri 10 - Org Meet (10:00am)</li>
            <li>Mon 17 - Team Meet (10:30am)</li>
            <li>Sat 18 - HR Briefing (9:00am)</li>
            <li>Fri 22 - Org Meet (10:00am)</li>
          </ul>
        </div>
      </aside>

      {/* Modal for Company or Jobseeker */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-xl p-6 relative shadow-xl">
            <button
              className="absolute top-4 right-4 text-gray-600 hover:text-black"
              onClick={() => setSelectedItem(null)}
            >
              <FiX size={20} />
            </button>

            {selectedType === "company" ? (
              <>
                <h2 className="text-2xl font-bold mb-4 text-center">
                  Company Details
                </h2>
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>Name:</strong> {selectedItem.companyName}
                  </p>
                  <p>
                    <strong>Email:</strong> {selectedItem.companyEmail}
                  </p>
                  <p>
                    <strong>Phone:</strong> {selectedItem.phone}
                  </p>
                  <p>
                    <strong>Registered:</strong>{" "}
                    {new Date(selectedItem.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="mt-6 flex justify-between">
                  <button
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                    onClick={() => handleApprove(selectedItem._id)}
                  >
                    <FiCheckCircle className="inline mr-1" /> Approve
                  </button>
                  <button
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                    onClick={() => handleReject(selectedItem._id)}
                  >
                    Reject
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-4 text-center">
                  Jobseeker Details
                </h2>
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>Name:</strong> {selectedItem.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {selectedItem.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {selectedItem.phone || "N/A"}
                  </p>
                  <p>
                    <strong>Registered:</strong>{" "}
                    {new Date(selectedItem.createdAt).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span
                      className={`font-semibold ${
                        selectedItem.status === "Active"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {selectedItem.status}
                    </span>
                  </p>
                </div>
                <div className="mt-6 flex justify-between">
                  <button
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                    onClick={() => handleApprove(selectedItem._id)}
                  >
                    <FiCheckCircle className="inline mr-1" /> Approve
                  </button>
                  <button
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                    onClick={() => handleReject(selectedItem._id)}
                  >
                    Reject
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;
