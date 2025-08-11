import React from "react";
import Navbar from "../Components/Navbar";
import SidebarMenu from "../Components/SidebarMenu";
import Footer from "../Components/Footer";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  FaUserTie,
  FaRing,
  FaVenusMars,
  FaMapMarkedAlt,
} from "react-icons/fa";

// Sample data
const joinYearData = [
  { year: "2074", count: 2 },
  { year: "2079", count: 3 },
  { year: "2080", count: 17 },
  { year: "2081", count: 47 },
  { year: "2082", count: 3 },
];

const maritalData = [
  { status: "Single", count: 31 },
  { status: "Married", count: 28 },
];

const genderData = [
  { gender: "Male", count: 43 },
  { gender: "Female", count: 34 },
];

const provinceData = [
  { province: "Koshi", count: 30 },
  { province: "Madhesh", count: 4 },
  { province: "Bagmati", count: 2 },
  { province: "Gandaki", count: 2 },
  { province: "Lumbini", count: 45 },
  { province: "Karnali", count: 25 },
  { province: "Sudurpashchim", count: 4 },
];

// Reusable line chart component
const CustomLineChart = ({ title, data, xKey, yKey }) => (
  <div className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-transform transform hover:scale-[1.02] duration-300">
    <h3 className="text-xl font-semibold text-gray-700 mb-4 text-center drop-shadow">
      {title}
    </h3>
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xKey} tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip
          contentStyle={{ fontSize: "14px" }}
          cursor={{ stroke: "#6366F1", strokeWidth: 2 }}
        />
        <Line
          type="monotone"
          dataKey={yKey}
          stroke="#6366F1"
          strokeWidth={3}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

const CompanyInsight = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-row bg-gradient-to-br from-blue-100 to-white py-10">
        <div className="p-6 w-fit">
          <SidebarMenu />
        </div>

        <div className="m-2 ml-8 w-4/5 max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Company Insights
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <CustomLineChart
              title={
                <span className="flex items-center justify-center gap-2">
                  <FaUserTie className="text-gray-600" />
                  Join Year Distribution
                </span>
              }
              data={joinYearData}
              xKey="year"
              yKey="count"
            />
            <CustomLineChart
              title={
                <span className="flex items-center justify-center gap-2">
                  <FaRing className="text-gray-600" />
                  Marital Status Breakdown
                </span>
              }
              data={maritalData}
              xKey="status"
              yKey="count"
            />
            <CustomLineChart
              title={
                <span className="flex items-center justify-center gap-2">
                  <FaVenusMars className="text-gray-600" />
                  Gender Distribution
                </span>
              }
              data={genderData}
              xKey="gender"
              yKey="count"
            />
            <CustomLineChart
              title={
                <span className="flex items-center justify-center gap-2">
                  <FaMapMarkedAlt className="text-gray-600" />
                  Province Wise Distribution
                </span>
              }
              data={provinceData}
              xKey="province"
              yKey="count"
            />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CompanyInsight;
