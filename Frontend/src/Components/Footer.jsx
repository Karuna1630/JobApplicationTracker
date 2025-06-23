import React from 'react';
import { FaFacebook, FaTwitter, FaYoutube, FaLinkedin, FaMapMarkerAlt, FaApple } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 px-6 py-10 md:px-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10">
        {/* Company Info */}
        <div className="lg:col-span-1">
          <h2 className="text-white text-xl font-bold mb-4">Job Manager</h2>
          <p className="text-sm leading-relaxed">
            Since its launch, Job Manager has been streamlining hiring in Nepal.
            Our platform bridges the gap between skilled professionals and growing businesses.
          </p>
          <a href="/aboutus" className="text-blue-400 hover:text-blue-300 text-sm mt-2 inline-block">
            Read more...
          </a>
        </div>

        {/* Jobseeker Links */}
        <div>
          <h3 className="text-white font-semibold text-lg mb-4">Jobseeker</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-white">Search Jobs</a></li>
            <li><a href="#" className="hover:text-white">Blog</a></li>
            <li><a href="#" className="hover:text-white">FAQ</a></li>
          </ul>
        </div>

        {/* Employer Links */}
        <div>
          <h3 className="text-white font-semibold text-lg mb-4">Employer</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-white">Post a Job</a></li>
            <li><a href="#" className="hover:text-white">Pricing</a></li>
            <li><a href="#" className="hover:text-white">Recruitment Services</a></li>
            <li><a href="#" className="hover:text-white">HR Insider</a></li>
            <li><a href="#" className="hover:text-white">FAQ</a></li>
          </ul>
        </div>

        {/* About Links */}
        <div>
          <h3 className="text-white font-semibold text-lg mb-4">About</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-white">About Us</a></li>
            <li><a href="#" className="hover:text-white">Contact</a></li>
            <li><a href="#" className="hover:text-white">Social Media</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-white font-semibold text-lg mb-4">Contact Us</h3>
          <ul className="text-sm space-y-1">
            <li>📍 Tower Block, Dulari Highway, Itahari-11, Morang</li>
            <li>📞 +977 1234566</li>
            <li>✉️ info@jobmanager.com</li>
          </ul>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="mt-10 border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center">
        {/* Socials */}
        <div className="flex space-x-4 mb-4 md:mb-0">
          <a href="#" className="text-gray-400 hover:text-white"><FaFacebook /></a>
          <a href="#" className="text-gray-400 hover:text-white"><FaTwitter /></a>
          <a href="#" className="text-gray-400 hover:text-white"><FaYoutube /></a>
          <a href="#" className="text-gray-400 hover:text-white"><FaLinkedin /></a>
          <a href="#" className="text-gray-400 hover:text-white"><FaMapMarkerAlt /></a>
          <a href="#" className="text-gray-400 hover:text-white"><FaApple /></a>
        </div>

        {/* Copyright */}
        <div className="text-sm text-gray-400">
          Terms | Privacy | © 2025 <span className="text-blue-400 font-semibold">JobManager</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;