import React from 'react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import MissionImage from "../assets/home_bg.jpg";
import Anshu from "../assets/Anshu.jpg";
import Karuna from "../assets/Karuna.jpg";
import Akriti from "../assets/Akriti.jpg";

const AboutUs = () => {
  return (
    <>
      <Navbar />
      <main className="bg-gray-100 min-h-screen py-12 px-6">
        
        {/* Hero Section */}
        <section className="max-w-6xl mx-auto mb-16 bg-white shadow-lg rounded-xl p-10 grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="flex flex-col justify-center">
            <h1 className="text-4xl md:text-5xl font-bold text-blue-800 mb-4">About Job Manager</h1>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
              Empowering your job search and hiring journey in Nepal – all in one place.
            </p>
          </div>
          <div className="flex justify-center items-center">
            <img 
              src={MissionImage} 
              alt="Our Mission"
              className="rounded-lg shadow-md w-full max-w-md object-cover"
            />
          </div>
        </section>

        {/* Mission Section */}
        <section className="max-w-6xl mx-auto mb-16 bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold text-blue-700 mb-4">Our Mission</h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            Since its launch, <span className="font-semibold text-blue-800">Job Manager</span> has been dedicated to streamlining 
            the hiring process for both job seekers and employers across Nepal. 
            We aim to bridge the gap between opportunity and talent by providing 
            an intuitive and accessible job tracking platform that puts users in control of their career journey.
          </p>
        </section>

        {/* What We Offer */}
        <section className="max-w-6xl mx-auto mb-16 bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold text-blue-700 mb-6">What We Offer</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 shadow p-6 rounded-xl text-left">
              <h3 className="font-semibold text-lg mb-2">🔍 Smart Job Tracking</h3>
              <p className="text-gray-600">Track all your job applications in one organized dashboard.</p>
            </div>
            <div className="bg-gray-50 shadow p-6 rounded-xl text-left">
              <h3 className="font-semibold text-lg mb-2">📢 For Employers</h3>
              <p className="text-gray-600">Easily post jobs, review applicants, and streamline hiring.</p>
            </div>
            <div className="bg-gray-50 shadow p-6 rounded-xl text-left">
              <h3 className="font-semibold text-lg mb-2">📊 Insights & Reminders</h3>
              <p className="text-gray-600">Get insights on your job search with visual stats and automated reminders.</p> 
            </div>
            <div className="bg-gray-50 shadow p-6 rounded-xl text-left">
              <h3 className="font-semibold text-lg mb-2">🌐 Nepal-Focused</h3>
              <p className="text-gray-600">We focus on opportunities in Nepal, making the job hunt local and relevant.</p>
            </div>
          </div>
        </section> 

        {/* Team Section */}
        <section className="max-w-6xl mx-auto mb-16 bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold text-blue-700 mb-6">Meet the Team</h2>
          <p className="text-gray-700 mb-6">
            A group of passionate developers and recruiters dedicated to transforming how Nepal finds work and talent.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-6 shadow rounded-xl text-center">
              <img src={Anshu} alt="Team Member" className="w-40 h-40 object-cover mx-auto rounded-full mb-4" />
              <h3 className="font-semibold text-lg">Anshu Karki</h3>
              <p className="text-gray-500">Frontend Developer</p>
            </div>
            <div className="bg-gray-50 p-6 shadow rounded-xl text-center">
              <img src={Karuna} alt="Team Member" className="w-40 h-40 object-cover mx-auto rounded-full mb-4" />
              <h3 className="font-semibold text-lg">Karuna Giri</h3>
              <p className="text-gray-500">Frontend Developer</p>
            </div>
            <div className="bg-gray-50 p-6 shadow rounded-xl text-center">
              <img src={Akriti} alt="Team Member" className="w-40 h-40 object-cover mx-auto rounded-full mb-4" />
              <h3 className="font-semibold text-lg">Aakriti Kafle</h3>
              <p className="text-gray-500">Frontend Developer</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default AboutUs;
