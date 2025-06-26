import React from "react";
import Footer from "../Components/Footer";
import Navbar from "../Components/Navbar";

const EditProfile = () => {
    
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-300">
        <Navbar />
        <div className="max-w-3xl mx-auto mt-10 mb-6 p-12 bg-white rounded-md shadow-xl border border-gray-200">
        <h2 className="text-xl font-semibold mb-2">Edit Profile</h2>
        <p className="text-sm text-gray-500 mb-4">
            Update your personal information and profile details
        </p>

        {/* Profile Picture */}
        <div className="border p-4 border-black shadow-xl rounded mb-6">
            <label className="block font-medium mb-2 ">Profile Picture</label>
            <div className="flex gap-4">
            <button className="px-4 py-1 bg-indigo-200 text-indigo-800 rounded hover:bg-indigo-300">
                Upload New Photo
            </button>
            <button className="px-4 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">
                Remove Photo
            </button>
            </div>
        </div>

        {/* Personal Information */}
        <div className="border p-4 shadow-xl rounded mb-6">
                <h3 className="font-medium mb-4 border-black shadow-xl">Personal Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input type="text" defaultValue="" placeholder="First Name" className="p-2 border border-black shadow-xl rounded bg-gray-100" />
                <input type="text" defaultValue="" placeholder="Last Name" className="p-2 border border-black shadow-xl rounded bg-gray-100" />
                <input type="email" defaultValue="" placeholder="Email Address" className="p-2 border border-black shadow-xl rounded bg-gray-100" />
                <input type="text" defaultValue="" placeholder="Phone Number" className="p-2 border border-black shadow-xl rounded bg-gray-100" />
                <input type="text" defaultValue="" placeholder="Job Title" className="p-2 border border-black shadow-xl rounded bg-gray-100" />
                <input type="text" defaultValue="" placeholder="Department" className="p-2 border border-black shadow-xl rounded bg-gray-100" />
                <input type="text" defaultValue="" placeholder="Location" className="p-2 border border-black shadow-xl rounded bg-gray-100 w-full mt-4"/>
                </div>
                <textarea placeholder="Bio" className="p-2 border border-black shadow-xl rounded bg-gray-100 w-full mt-4 h-24"> </textarea>
        </div>

        {/* Social Links */}

        {/* Buttons */}
        <div className="flex justify-end gap-4">
            <button onClick={()=> navigate("/editProfile")}
                type="submit"
                className="px-6 bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-800 transition"
            >
                Cancel
            </button>
            <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Save Changes
            </button>
        </div>
        </div>
        <Footer />
    </div>   
  );
};

export default EditProfile;
