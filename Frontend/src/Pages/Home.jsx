import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import axiosInstance from '../Utils/axiosInstance';

const Home = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [loadingCompanies, setLoadingCompanies] = useState(false);
  const [errorJobs, setErrorJobs] = useState(null);
  const [errorCompanies, setErrorCompanies] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoadingJobs(true);
        const response = await axiosInstance.get('/api/Jobs'); // Correct API path
        setJobs(response.data);
        setLoadingJobs(false);
      } catch (err) {
        console.error('Failed to fetch jobs', err);
        setErrorJobs('Failed to load jobs.');
        setLoadingJobs(false);
      }
    };

    const fetchCompanies = async () => {
      try {
        setLoadingCompanies(true);
        const response = await axiosInstance.get('/getallcompanies'); // Correct API path
        setCompanies(response.data);
        setLoadingCompanies(false);
      } catch (err) {
        console.error('Failed to fetch companies', err);
        setErrorCompanies('Failed to load companies.');
        setLoadingCompanies(false);
      }
    };

    fetchJobs();
    fetchCompanies();
  }, []);

  return (
    <>
      <Navbar />
      <div className="bg-gray-50 min-h-screen">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white py-20 px-4">
          <div className="max-w-5xl mx-auto text-center space-y-6">
            <h1 className="text-5xl font-bold">Track Your Job Applications Easily</h1>
            <p className="text-lg">Stay organized and take control of your job search — all in one place.</p>
            <div className="space-x-4">
              <button
                onClick={() => navigate('/registercomp')}
                className="bg-white text-blue-700 font-semibold px-6 py-3 rounded-xl hover:bg-blue-100"
              >
                Get Started
              </button>
              <button
                onClick={() => navigate('/login')}
                className="bg-blue-800 text-white px-6 py-3 rounded-xl hover:bg-blue-900"
              >
                Login
              </button>
            </div>
          </div>
        </div>

        {/* Top Companies */}
        <section className="py-20 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-800 mb-10 text-left">Top Companies</h2>

            {loadingCompanies && <p className="text-gray-500">Loading companies...</p>}
            {errorCompanies && <p className="text-red-500">{errorCompanies}</p>}

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 justify-items-center">
              {companies.map(company => (
                <div
                  key={company.companyId}
                  className="bg-gray-50 p-6 rounded-xl shadow hover:shadow-lg transition transform hover:scale-105 cursor-pointer text-center"
                >
                  <h3 className="font-semibold text-lg text-blue-700">{company.name}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Top Jobs */}
        <section className="py-20 px-6 bg-gray-100">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-800 mb-10 text-left">Top Jobs</h2>

            {loadingJobs && <p className="text-gray-500">Loading jobs...</p>}
            {errorJobs && <p className="text-red-500">{errorJobs}</p>}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {jobs.map(job => (
                <div
                  key={job.jobId}
                  className="bg-white p-6 rounded-xl shadow hover:shadow-xl transition transform hover:-translate-y-2 cursor-pointer"
                >
                  <h3 className="font-semibold text-xl mb-2 text-blue-700">{job.title}</h3>
                  <p className="text-gray-600 mb-2">{job.companyName}</p>
                  <p className="text-gray-700 mb-1">{job.location}</p>
                  <p className="text-gray-500 text-sm">Posted on: {new Date(job.postedDate).toLocaleDateString()}</p>
                  <button
                    onClick={() => navigate(`/job/${job.jobId}`)}
                    className="mt-4 bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800"
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-blue-700 text-white py-20 px-4">
          <div className="max-w-5xl mx-auto text-left space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">Join hundreds managing their job search smartly</h2>
            <button
              onClick={() => navigate('/registercomp')}
              className="bg-white text-blue-700 font-semibold px-8 py-3 rounded-xl hover:bg-blue-100"
            >
              Sign Up Now
            </button>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default Home;
