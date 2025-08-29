import React, { useState } from 'react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ContactUs = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
  e.preventDefault();
  const { name, email, message } = formData;

  if (!name || !email || !message) {
    toast.error("Please fill in all fields.");
    return;
  }

  console.log("Contact Form Data:", formData); // 

  toast.success("Message sent successfully!");
  setFormData({ name: '', email: '', message: '' });
};


  return (
    <>
      <Navbar />
      <section className="bg-blue-50 min-h-screen py-16 px-4 md:px-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 bg-white p-8 rounded-xl shadow-lg">
          {/* Left Side - Info */}
          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-blue-800">Contact Us</h2>
            <p className="text-lg text-gray-700">
              We'd love to hear from you! Fill out the form or contact us using the details below.
            </p>
            <div className="text-gray-600 space-y-2 text-base">
              <p><strong>📍 Address:</strong> Itahari, Mahendra Highway, Itahari-11, Morang</p>
              <p><strong>📞 Phone:</strong> +977 1234566</p>
              <p><strong>📧 Email:</strong> info@jobmanager.com</p>
            </div>
            <div className="flex gap-4 pt-2 text-blue-700">
              <a href="#">Facebook</a>
              <a href="#">Twitter</a>
              <a href="#">LinkedIn</a>
            </div>
          </div>

          {/* Right Side - Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your full name"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Message</label>
              <textarea
                name="message"
                rows="4"
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Write your message here..."
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-md transition duration-200"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>

      <ToastContainer position="top-center" autoClose={3000} />
      <Footer />
    </>
  );
};

export default ContactUs;
