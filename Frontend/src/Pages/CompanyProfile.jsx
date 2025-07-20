import React from "react";
import {
  FaSuitcase, FaUsers, FaUserCheck, FaUserClock, FaUserTie,
  FaGlobe, FaChartLine, FaUserPlus
} from "react-icons/fa";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  CartesianGrid, ResponsiveContainer
} from "recharts";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import Logo from "../assets/logoc.png";
import BannerBg from "../assets/banner.png";

const dummyApplicationData = [
  { month: "Jan", applications: 50 },
  { month: "Feb", applications: 80 },
  { month: "Mar", applications: 65 },
  { month: "Apr", applications: 90 },
  { month: "May", applications: 110 },
];

const dummyHiresData = [
  { department: "Tech", hires: 30 },
  { department: "Sales", hires: 15 },
  { department: "HR", hires: 8 },
  { department: "Marketing", hires: 12 },
];

const recentJobs = [
  { title: "Frontend Developer", department: "Tech", postedOn: "2025-06-30", status: "Open" },
  { title: "UI/UX Designer", department: "Design", postedOn: "2025-06-28", status: "Closed" },
];

const recentApplications = [
  { name: "John Doe", job: "Frontend Developer", date: "2025-07-01", status: "Pending" },
  { name: "Jane Smith", job: "UI/UX Designer", date: "2025-07-02", status: "Interview Scheduled" },
];

const hrMembers = [
  { name: "Ram Sharma", role: "HR Manager", email: "ram@example.com" },
  { name: "Sita Rai", role: "Recruiter", email: "sita@example.com" },
];

const InfoCard = ({ icon, label, value, color }) => (
  <div className="flex items-center bg-white shadow-lg rounded-2xl p-5 w-full sm:w-[260px] gap-4 border border-gray-100 hover:scale-[1.02] transition duration-300 ease-in-out">
    <div className={`text-3xl p-4 rounded-full bg-${color}-100 text-${color}-700 shadow-inner`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

const CompanyProfile = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col">
        <div className="flex-grow px-6 pt-24 pb-20 max-w-7xl mx-auto bg-gradient-to-br from-blue-100 via-white to-blue-200 w-full">
          
          <div className="relative h-56 bg-cover bg-center" style={{ backgroundImage: `url(${BannerBg})` }}>
            <img
              src={Logo}
              alt="Company Logo"
              className="w-28 h-28 rounded-full border-4 border-white shadow-lg absolute left-2/2 transform -translate-x-2/2 bottom-[-2rem] bg-white object-cover z-20"
            />
          </div>

          {/* Company Info */}
          <div className="text-left mb-6 mt-12 px-4">
            <h1 className="font-extrabold text-2xl text-gray-800">Anshu Pvt. Ltd.</h1>
            <p className="text-gray-600 mt-1">Empowering digital transformation through innovation.</p>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 mt-4">
              <button onClick={() => navigate("/postjob")} className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700">
                Post Job
              </button>
              <button onClick={() => navigate("/viewapplications")} className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700">
                View Applications
              </button>
              <button onClick={() => navigate("/insight")} className="bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700">
                Company Insight
              </button>
              <button onClick={() => navigate("/registerstaff")} className="bg-purple-600 text-white px-4 py-2 rounded-xl hover:bg-purple-700">
                Staff Register
              </button>
            </div>
          </div>

          {/* Company Dashboard */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-gray-700">Company Dashboard</h2>
            <div className="flex flex-wrap justify-center gap-6">
              <InfoCard icon={<FaSuitcase />} label="Total Jobs Posted" value="42" color="blue" />
              <InfoCard icon={<FaUsers />} label="Total Applications" value="1,240" color="green" />
              <InfoCard icon={<FaUserCheck />} label="Hired Candidates" value="120" color="indigo" />
              <InfoCard icon={<FaUserClock />} label="Pending Interviews" value="45" color="yellow" />
            </div>
          </div>

          {/* User Insights */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-gray-700">User Insights</h2>
            <div className="flex flex-wrap justify-center gap-6">
              <InfoCard icon={<FaUserTie />} label="Recruiters" value="18" color="purple" />
              <InfoCard icon={<FaGlobe />} label="Website Visitors" value="5,230" color="cyan" />
              <InfoCard icon={<FaChartLine />} label="HR Staff" value="6" color="pink" />
              <InfoCard icon={<FaUserPlus />} label="New Signups (30d)" value="14" color="orange" />
            </div>
          </div>

          {/* Analytics Section */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-gray-700">Analytics Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-xl p-5">
                <h3 className="text-lg font-medium text-gray-600 mb-3">Applications per Month</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={dummyApplicationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="applications" fill="#3b82f6" radius={[5, 5, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-gray-50 rounded-xl p-5">
                <h3 className="text-lg font-medium text-gray-600 mb-3">Hires by Department</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={dummyHiresData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="department" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="hires" fill="#10b981" radius={[5, 5, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Recent Jobs Posted */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-12">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Recent Job Postings</h2>
            <table className="w-full text-left text-sm">
              <thead className="text-gray-500 border-b">
                <tr>
                  <th className="py-2">Job Title</th>
                  <th className="py-2">Department</th>
                  <th className="py-2">Posted On</th>
                  <th className="py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentJobs.map((job, i) => (
                  <tr key={i} className="border-b hover:bg-gray-50">
                    <td className="py-2">{job.title}</td>
                    <td>{job.department}</td>
                    <td>{job.postedOn}</td>
                    <td>{job.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Recent Applications */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-12">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Recent Applications</h2>
            <table className="w-full text-left text-sm">
              <thead className="text-gray-500 border-b">
                <tr>
                  <th className="py-2">Candidate</th>
                  <th className="py-2">Job</th>
                  <th className="py-2">Date</th>
                  <th className="py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentApplications.map((app, i) => (
                  <tr key={i} className="border-b hover:bg-gray-50">
                    <td className="py-2">{app.name}</td>
                    <td>{app.job}</td>
                    <td>{app.date}</td>
                    <td>{app.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* HR Team */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-12">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">HR Team</h2>
            <ul className="grid sm:grid-cols-2 gap-4">
              {hrMembers.map((member, i) => (
                <li key={i} className="border p-4 rounded-xl hover:shadow-md">
                  <p className="font-semibold">{member.name}</p>
                  <p className="text-sm text-gray-600">{member.role}</p>
                  <p className="text-sm text-gray-500">{member.email}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Inline Staff Registration Form */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-12">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Register New Staff</h2>
            <form className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input type="text" placeholder="Full Name" className="border p-2 rounded" />
              <input type="email" placeholder="Email" className="border p-2 rounded" />
              <input type="text" placeholder="Role (e.g., HR, Recruiter)" className="border p-2 rounded" />
              <input type="password" placeholder="Password" className="border p-2 rounded" />
              <div className="sm:col-span-2">
                <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
                  Register Staff
                </button>
              </div>
            </form>
          </div>

        </div>
        <Footer />
      </div>
    </>
  );
};

export default CompanyProfile;
