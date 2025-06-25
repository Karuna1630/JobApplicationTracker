import React from 'react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';

const AboutUs = () => {
  return (
    <>
      <Navbar />
      <main className="bg-gray-50 min-h-screen pt-10 px-6">
        {/* Hero Section */}
        <section className="max-w-5xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-800 mb-4">About Job Manager</h1>
          <p className="text-lg md:text-xl text-gray-700">
            Empowering your job search and hiring journey in Nepal – all in one place.
          </p>
        </section>

        {/* Mission Section */}
        <section className="max-w-5xl mx-auto mb-16">
          <h2 className="text-2xl font-semibold text-blue-700 mb-4">Our Mission</h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            Since its launch, <span className="font-semibold text-blue-800">Job Manager</span> has been dedicated to streamlining the hiring process for both job seekers and employers across Nepal.
            We aim to bridge the gap between opportunity and talent by providing an intuitive and accessible job tracking platform that puts users in control of their career journey.
          </p>
        </section>

        {/* Features Section */}
        <section className="max-w-5xl mx-auto mb-16">
          <h2 className="text-2xl font-semibold text-blue-700 mb-6">What We Offer</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white shadow p-6 rounded-xl">
              <h3 className="font-semibold text-lg mb-2">🔍 Smart Job Tracking</h3>
              <p className="text-gray-600">Track all your job applications in one organized dashboard.</p>
            </div>
            <div className="bg-white shadow p-6 rounded-xl">
              <h3 className="font-semibold text-lg mb-2">📢 For Employers</h3>
              <p className="text-gray-600">Easily post jobs, review applicants, and streamline hiring.</p>
            </div>
            <div className="bg-white shadow p-6 rounded-xl">
              <h3 className="font-semibold text-lg mb-2">📊 Insights & Reminders</h3>
              <p className="text-gray-600">Get insights on your job search with visual stats and automated reminders.</p>
            </div>
            <div className="bg-white shadow p-6 rounded-xl">
              <h3 className="font-semibold text-lg mb-2">🌐 Nepal-Focused</h3>
              <p className="text-gray-600">We focus on opportunities in Nepal, making the job hunt local and relevant.</p>
            </div>
          </div>
        </section>

        {/* Optional: Team Section */}
{/*         
        <section className="max-w-5xl mx-auto mb-16 text-center">
          <h2 className="text-2xl font-semibold text-blue-700 mb-6">Meet the Team</h2>
          <p className="text-gray-700 mb-4">A group of passionate developers and recruiters dedicated to transforming how Nepal finds work and talent.</p>
        </section>
        */}

        {/* Call to Action */}
        <section className="bg-blue-600 text-white py-12 text-center mt-14 mb-9 rounded-xl max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Ready to take control of your job journey?</h2>
          <p className="text-lg mb-6">Join thousands already tracking their career with Job Manager.</p>
          <a
            href="/registercomp"
            className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-blue-100 transition"
          >
            Get Started
          </a>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default AboutUs;
