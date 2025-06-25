import React, { useState } from 'react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all fields");
      return;
    }

    // Simulate submission (replace with actual backend later)
    toast.success("Message sent successfully!");

    // Reset form
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <>
      <Navbar />

      <section className="bg-gray-50 min-h-screen py-16 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-blue-800 mb-2">Get in Touch</h2>
            <p className="text-gray-700 text-lg">
              Have a question, suggestion, or need help? We're here to support you on your career journey.
            </p>
            <div className="space-y-4 text-gray-700">
              <p><strong>📍 Address:</strong> Tower Block, Dulari Highway, Itahari-11, Morang</p>
              <p><strong>📞 Phone:</strong> +977 1234566</p>
              <p><strong>📧 Email:</strong> info@jobmanager.com</p>
            </div>
            <div className="flex gap-4 pt-4">
              <a href="#" className="text-blue-600 hover:text-blue-800">Facebook</a>
              <a href="#" className="text-blue-600 hover:text-blue-800">Twitter</a>
              <a href="#" className="text-blue-600 hover:text-blue-800">LinkedIn</a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 rounded-xl shadow-md">
            <h3 className="text-2xl font-semibold text-blue-700 mb-6">Send us a message</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Your Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Your Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="4"
                  className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Write your message here..."
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Toast Container */}
      <ToastContainer position="top-center" autoClose={3000} theme="colored" />

      <Footer />
    </>
  );
};

export default ContactUs;
