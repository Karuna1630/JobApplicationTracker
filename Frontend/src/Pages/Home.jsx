import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';

const Home = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div className="bg-gray-50 min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-500 to-blue-700 text-white py-20 px-4">
          <div className="max-w-5xl mx-auto text-center space-y-6">
            <h1 className="text-5xl font-bold">Track Your Job Applications Easily</h1>
            <p className="text-lg">Stay organized and take control of your job search — all in one place.</p>
            <div className="space-x-4">
              <button onClick={() => navigate('/registercomp')} className="bg-white text-blue-700 font-semibold px-6 py-3 rounded-xl hover:bg-blue-100">Get Started</button>
              <button onClick={() => navigate('/login')} className="bg-blue-800 text-white px-6 py-3 rounded-xl hover:bg-blue-900">Login</button>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 px-6 bg-white">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-gray-800 mb-12">How It Works</h2>
            <div className="grid  grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-12 ">
              {[{
                title: '📝 Add Job Applications',
                desc: 'Log your job applications with all necessary details like company, position, and status.'
              }, {
                title: '📈 Track Status',
                desc: 'Update statuses such as Applied, Interview, Offer, and Rejected.'
              }, {
                title: '⏰ Set Reminders',
                desc: 'Set follow-up reminders to never miss an important step in your application process.'
              }, {
                title: '📊 Get Insights',
                desc: 'Visualize your progress with charts and stats to stay motivated.'
              }].map((item, idx) => (
                <div key={idx} className="bg-gray-50  p-6 rounded-xl shadow hover:shadow-lg transition">
                  <h3 className="font-semibold text-xl mb-2">{item.title}</h3>
                  <p className="text-gray-600 mt-3 text-lg">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 px-6 bg-gray-100">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-gray-800 mb-12">Why Choose Job Manager</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
              {["Centralized job tracking", "Easy to manage applications", "Smart reminders", "Secure & user-friendly"].map((feature, idx) => (
                <div key={idx} className="bg-white p-6 shadow rounded-xl text-blue-700 font-medium border border-blue-100">
                  ✅ {feature}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Company Showcase */}
        <section className="py-20 px-6 bg-white">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-gray-800 mb-10">Companies Our Users Apply To</h2>
            <div className="flex flex-wrap justify-center gap-6 text-gray-700 text-lg">
              {["Google", "Microsoft", "Amazon", "Meta", "Netflix"].map((company, idx) => (
                <span key={idx} className="bg-gray-100 px-6 py-3 rounded-xl shadow text-base md:text-lg">{company}</span>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-blue-700 text-white py-20 px-4">
          <div className="max-w-5xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">Join hundreds managing their job search smartly</h2>
            <button onClick={() => navigate('/registercomp')} className="bg-white text-blue-700 font-semibold px-8 py-3 rounded-xl hover:bg-blue-100">
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
