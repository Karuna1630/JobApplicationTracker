import React from 'react';
import AnshuP from "../assets/Anshu.jpg";
import Footer from "../Components/Footer";
import Navbar from "../Components/Navbar";

const UserProfile = () => {
  return (
    <>
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-300">
        <Navbar />

            {/* Main content (takes up available space) */}
            <main className="flex-grow flex items-center justify-center p-8">
                <div className="w-full max-w-2xl bg-white border-2 border-black shadow-xl rounded-xl p-4">
                    <div className="flex flex-col items-center">
                        {/* Profile Image */}
                        <img
                            src={AnshuP} 
                            className="w-32 h-32 rounded-full object-cover"
                        />
                        {/* Name */}
                        <h2 className="mt-3 text-2xl font-semibold">Anshu Karki</h2>

                        {/* Contact Information */}
                        <div className="mt-6 w-full text-sm text-gray-700 px-3">
                            <h3 className="font-semibold text-black">CONTACT INFORMATION</h3>
                            <p>
                            <span className="font-medium">Email id : </span>{' '}
                            <a href="anshukarki533@gmail.com" className="text-blue-600">
                                anshukarki533@gmail.com
                            </a>
                            </p>
                            <p><span className="font-medium">Phone :</span> 9811234567</p>
                            <p><span className="font-medium">Address :</span> Belbari-02, Nepal</p>

                            {/* Basic Information */}
                            <h3 className="mt-4 font-semibold text-gray-600">BASIC INFORMATION</h3>
                            <p><span className="font-medium">Gender :</span> Female</p>
                            <p><span className="font-medium">Birthday :</span> 2004-11-13</p>
                        </div>

                        {/* Edit Button */}
                        <button className="mt-6 px-6 py-2 border border-black text-black bg-blue-500 rounded hover:bg-blue-800">
                            Edit
                        </button>
                    </div>
                </div>
            </main>
        <Footer />
      </div>
    </>
  );
};

export default UserProfile;
