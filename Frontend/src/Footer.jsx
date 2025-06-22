import React from 'react'
import { FaFacebook, FaTwitter, FaYoutube, FaLinkedin, FaMapMarkerAlt, FaApple } from 'react-icons/fa';
import AboutUs from './AboutUs';

const Footer = () => {
  return (
     <footer className="bg-gray-800 text-gray-300  px-14 py-4">
        <div className="  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 space-x-28 mb-8 ">
          {/* Company Description */}
          <div className="lg:col-span-1">
            <p className="text-sm leading-relaxed">
            Since its launch, Job Manager has been dedicated to streamlining the hiring process for both job seekers and employers across Nepal. Our mission is to offer a seamless platform where candidates can easily discover opportunities, and organizations can efficiently find the right talent. Over the years, we’ve built a reputation as a trusted partner in recruitment, helping to bridge the gap between qualified professionals and growing businesses, and establishing Job Manager as a go-to solution in the employment landscape
            </p>
            <a href="/aboutUs" className="text-blue-400 hover:text-blue-300 text-sm mt-2 inline-block">
              Read more...
            </a>
          </div>

          {/* For Jobseeker */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">FOR JOBSEEKER</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">Search Jobs</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">Blog</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* For Employer */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">FOR EMPLOYER</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">Post a Job</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">Pricing</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">Recruitment Services</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">HR Insider</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* About Us & Contact */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">ABOUT US</h3>
            <ul className="space-y-2 mb-6">
              <li><a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">About jobManager</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">Facebook</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">Twitter</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">LinkedIn</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">Contact us</a></li>
            </ul>
            </div>

            <div>
            <h3 className="text-white  font-semibold text-lg mb-4">CONTACT US</h3>
            <div className="space-y-2">
              <p className="text-sm">Tower Block</p>
              <p className="text-sm">Dulari Highway</p>
              <p className="text-sm">Itahari-11</p>
              <p className="text-sm">Morang, Nepal</p>
              <p className="text-sm">📞 +977 1234566</p>
              <p className="text-sm">✉️ info@jobmanager.com</p>
           </div>
          </div>
        </div>

         {/* Bottom Section */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center">
            {/* Social Media Icons */}
            <div className="flex space-x-4 mb-4 lg:mb-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaYoutube size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaLinkedin size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaMapMarkerAlt size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaApple size={20} />
              </a>
            </div>


            {/* Copyright */}
            <div className="text-sm text-gray-400">
              <span>Terms | Privacy | © 2025 All Rights with </span>
              <span className="text-blue-400">JobManager</span>
            </div>
          </div>
        </div>
     
    </footer>
  )
}

export default Footer
