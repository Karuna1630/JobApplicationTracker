import React from "react";
import { BarChart,Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,CartesianGrid,
} from "recharts";

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

// Reusable bar chart component
const CustomBarChart = ({ title, data, xKey, yKey }) => (
  <div className="bg-white rounded-2xl p-4 shadow hover:shadow-lg transition duration-300 ease-in-out">
    <h3 className="text-lg font-semibold text-gray-800 mb-3 text-center">{title}</h3>
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xKey} />
        <YAxis />
        <Tooltip />
        <Bar dataKey={yKey} fill="#60A5FA" barSize={40} radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

// Main insights section
export default function CompanyInsights() {
  return (
    <section className="bg-gradient-to-r from-blue-50 to-indigo-100 rounded-sm shadow-inner px-4 py-10 md:px-8 m-4 md:m-8">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
        Company Insights
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CustomBarChart
          title="Join Year Distribution"
          data={joinYearData}
          xKey="year"
          yKey="count"
        />
        <CustomBarChart
          title="Marital Status Breakdown"
          data={maritalData}
          xKey="status"
          yKey="count"
        />
        <CustomBarChart
          title="Gender Distribution"
          data={genderData}
          xKey="gender"
          yKey="count"
        />
        <CustomBarChart
          title="Province Wise Distribution"
          data={provinceData}
          xKey="province"
          yKey="count"
        />
      </div>
    </section>
  );
}
