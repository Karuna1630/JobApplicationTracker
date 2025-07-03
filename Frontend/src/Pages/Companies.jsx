import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

const Companies = () => {
  const [topJobs, setTopJobs] = useState([]);
  const [hotJobs, setHotJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const topJobsRes = await axios.get("https://dummyjson.com/users?limit=10");
        const hotJobsRes = await axios.get("https://dummyjson.com/products?limit=15");

        const topJobsData = topJobsRes.data.users.map((user, index) => ({
          id: user.id,
          company: user.company?.name || `${user.firstName} Pvt. Ltd.`,
          logo: `https://api.dicebear.com/7.x/identicon/svg?seed=${user.firstName}`, // dynamic avatar
          jobs: ["Marketing Executive", "Frontend Developer"].slice(0, 1 + (index % 2)),
        }));

        const hotJobsData = hotJobsRes.data.products.map((product) => ({
          id: product.id,
          company: product.brand,
          position: product.title,
          logo: `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(product.title)}`, // dynamic avatar
        }));

        setTopJobs(topJobsData);
        setHotJobs(hotJobsData);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch jobs", err);
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) return <div className="text-center mt-10 text-xl">Loading jobs...</div>;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-300 flex flex-col">
        <div className="w-full max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6">Top Jobs</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {topJobs.map((job) => (
              <div
                key={job.id}
                className="border rounded-2xl p-4 bg-white shadow hover:shadow-md transition duration-300 flex items-center gap-4 h-28"
              >
                <img
                  src={job.logo}
                  alt={job.company}
                  className="w-16 h-16 object-contain rounded"
                />
                <div>
                  <h4 className="text-md font-semibold">{job.company}</h4>
                  {job.jobs.map((position, index) => (
                    <p key={index} className="text-sm text-gray-700">
                      {position}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full max-w-6xl mx-auto px-4 mt-12">
          <h2 className="text-3xl font-bold mb-6">Hot Jobs</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {hotJobs.map((job) => (
              <div
                key={job.id}
                className="border rounded-2xl p-4 bg-white shadow hover:shadow-md transition duration-300 flex items-center gap-4 h-28"
              >
                <img
                  src={job.logo}
                  alt={job.company}
                  className="w-16 h-16 object-contain rounded"
                />
                <div>
                  <h4 className="text-md font-semibold">{job.company}</h4>
                  <p className="text-sm text-gray-700">{job.position}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Companies;
