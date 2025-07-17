import React, { useState } from "react";
import {
  FiUsers,
  FiCheckCircle,
  FiCalendar,
  FiEye,
  FiMail,
} from "react-icons/fi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

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

function adminCompany() {
  const [searchTerm, setSearchTerm] = useState("");
  const [companies, setCompanies] = useState(dummyCompanies);
  const [selectedCompany, setSelectedCompany] = useState(null);

  const handleApprove = (id) => {
    alert(`Approved company with ID: ${id}`);
    setSelectedCompany(null);
  };

  const handleReject = (id) => {
    alert(`Rejected company with ID: ${id}`);
    setSelectedCompany(null);
  };

  const filteredCompanies = companies.filter((company) =>
    company.companyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const StatBox = ({ title, count, percent }) => (
    <div className="bg-white p-4 rounded shadow">
      <p>{title}</p>
      <h2 className="text-xl font-bold">{count}</h2>
      <p className="text-sm">{percent}</p>
    </div>
  );

  const CompanyCard = ({ company }) => (
    <div className="bg-gray-50 p-4 rounded shadow">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-semibold text-gray-800">
          <FiUsers className="inline mr-2" />
          {company.companyName}
        </h2>
        <button
          className="text-blue-500 hover:text-blue-700"
          onClick={() => setSelectedCompany(company)}
        >
          <FiEye className="inline mr-1" /> View
        </button>
      </div>
      <p className="text-sm text-gray-600">
        <FiMail className="inline mr-2" /> {company.companyEmail}
      </p>
      <p className="text-sm text-gray-600">
        <FiCalendar className="inline mr-2" />
        Registered: {new Date(company.createdAt).toLocaleDateString()}
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-900 text-white p-4 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-full" />
          <div>
            <p className="font-bold">Joblly Admin</p>
            <p className="text-sm">Johen Doe</p>
          </div>
        </div>
        <nav className="space-y-3 text-sm">
          <div>Dashboard</div>
          <div>Jobs</div>
          <div>Applications</div>
          <div>Team</div>
          <div>Profile</div>
          <div>Billing</div>
          <div>Support</div>
        </nav>
      </aside>

      {/* Main Dashboard */}
      <main className="flex-1 p-6 space-y-6">
        <header className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <span className="text-sm text-gray-600">
            {new Date().toDateString()}
          </span>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatBox title="Applications" count="132.0K" percent="60%" />
          <StatBox title="Shortlisted" count="10.9K" percent="50%" />
          <StatBox title="On Hold" count="03.1K" percent="34%" />
        </section>

        <section className="bg-white p-6 rounded shadow">
          <h3 className="text-lg font-semibold mb-4">Active Jobs</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="applications" fill="#6b5b95" />
              <Bar dataKey="shortlisted" fill="#88b04b" />
            </BarChart>
          </ResponsiveContainer>
        </section>

        <section className="bg-white p-6 rounded shadow">
          <h3 className="text-2xl font-semibold text-center mb-4">
            Admin Company Panel
          </h3>
          <input
            type="text"
            placeholder="Search company..."
            className="w-full border border-gray-300 rounded px-4 py-2 mb-6"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompanies.map((company) => (
              <CompanyCard key={company._id} company={company} />
            ))}
          </div>

          {selectedCompany && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white w-full max-w-md rounded-lg p-6 relative shadow-xl">
                <h2 className="text-2xl font-bold mb-4 text-center">
                  Company Details
                </h2>
                <p className="mb-2">
                  <strong>Name:</strong> {selectedCompany.companyName}
                </p>
                <p className="mb-2">
                  <strong>Email:</strong> {selectedCompany.companyEmail}
                </p>
                <p className="mb-2">
                  <strong>Phone:</strong> {selectedCompany.phone}
                </p>
                <p className="mb-4">
                  <strong>Registered:</strong>{" "}
                  {new Date(selectedCompany.createdAt).toLocaleDateString()}
                </p>
                <div className="flex justify-between">
                  <button
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                    onClick={() => handleApprove(selectedCompany._id)}
                  >
                    <FiCheckCircle className="inline mr-1" /> Approve
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                    onClick={() => handleReject(selectedCompany._id)}
                  >
                    Reject
                  </button>
                  <button
                    className="absolute top-2 right-4 text-gray-600 hover:text-black text-xl"
                    onClick={() => setSelectedCompany(null)}
                  >
                    &times;
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Right Sidebar */}
      <aside className="w-80 p-6 bg-white border-l space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Total Applications</h3>
          <ul className="text-sm space-y-1">
            <li><span className="text-purple-500">■</span> Applications - 58%</li>
            <li><span className="text-green-500">■</span> Shortlisted - 22%</li>
            <li><span className="text-yellow-500">■</span> On Hold - 12%</li>
            <li><span className="text-red-500">■</span> Rejected - 08%</li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Scheduled Meetings</h3>
          <ul className="text-sm space-y-1">
            <li>Thu 8 - Interview (9:00am - 11:30am)</li>
            <li>Fri 10 - Organizational Meet (10:00am)</li>
            <li>Mon 17 - Team Meeting (10:30am)</li>
            <li>Sat 18 - HR Briefing (9:00am)</li>
            <li>Fri 22 - Organizational Meet (10:00am)</li>
          </ul>
        </div>
      </aside>
    </div>
  );
}

export default adminCompany;
