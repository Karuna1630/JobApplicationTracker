import { useState } from "react";
import crlogo from "../assets/CR.avif";
import { Navigate, useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { useFormik } from "formik";


const CompanyR1 = () => {
  const navigate = useNavigate();
  const initialValues ={
    userId: "0",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    location:"",
    bio:"",
    userType: "",
    createdAt:"",
    updatedAt:"",
    isActive: "",
    company: {
      companiesId: "0",
      companyName: "",
      companyLogo:"",
      industryId:"0",
      website:"",
      location: "",
      description:"",
      createdAt:"",
      updatedAt:"",

    },
  }
  const {values, handleBlur, handleChange, handleSubmit} =useFormik({
    initialValues,
    onSubmit: (values)=>{
      console.log(values)
    }
  })
  console.log(formik)

  return (
    <>
      <Navbar />
      <div className="min-h-screen font-sans flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-300 p-10">
        <div className="flex w-full max-w-6xl shadow-lg rounded-lg overflow-hidden">
          {/* Left image section */}
          <div className="hidden md:block md:w-1/2">
            <img src={crlogo} className="object-cover w-full h-full" />
          </div>

          <div className="w-full md:w-1/2 bg-white flex items-center justify-center p-8">
            <div className="max-w-sm w-full">
              {/* Step Indicator */}
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold">Company Registration</h2>
                {/* <div className="flex justify-center items-center mt-6 relative">
                Step 1
                <div className="flex flex-col items-center z-10">
                  <div className="h-10 w-10 rounded-full bg-blue-500 text-black border border-black flex items-center justify-center">
                    1
                  </div>
                  <span className="text-sm mt-1 font-medium">Organization</span>
                </div> */}

                {/* Line between Step 1 and 2 
                <div className="flex-1 h-0.5 bg-green-500 mx-0 mt-0"></div>

                {/* Step 2
                <div className="flex flex-col items-center z-10">
                  <div className="h-10 w-10 rounded-full bg-white text-black border border-black flex items-center justify-center font-bold">
                    2
                  </div>
                  <span className="text-sm mt-1 font-medium">Correspondence</span>
                </div>

                {/* Line between Step 2 and 3 
                <div className="flex-1 h-0.5 bg-green-500 mx-0 mt-0"></div> */}

                {/* Step 3
                <div className="flex flex-col items-center z-10">
                  <div className="h-10 w-10 rounded-full bg-white text-black border border-black flex items-center justify-center font-bold">
                    3
                  </div>
                  <span className="text-sm mt-1 font-medium">Sign Up</span>
                </div>
              </div> */}
                <div className="pt-4">
                  <h2 className="text-1xl font-bold">
                    Organization Information
                  </h2>
                  <h4 className="text-l"> Provide your company details </h4>
                </div>
              </div>

              {/* Form Section */}
              <form  className="space-y-5">
                {/* Organization Name */}
                <input
                  type="text"
                  name="companyName"
                  value={formData.company.companyName}
                  onChange={handleChange}
                  placeholder=" Company Name"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-md"
                />
                {/* Address */}
                <input
                  type="text"
                  name="location"
                  value={formData.company.location}
                  onChange={handleChange}
                  placeholder="Location"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-md"
                />

                {/* Phone */}
                <input
                  type="text"
                  name="description"
                  value={formData.company.description}
                  onChange={handleChange}
                  placeholder=" Description"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-md"
                />

                {/* Company logo */}
                <input
                  type=""
                  name=""companyLogo
                  value={formData.company.companyLogo}
                  onChange={handleChange}
                  placeholder="Company Logo"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-md"
                />

                {/* Industry Dropdown */}
                <select
                  name="industry"
                  className="w-full px-4 py-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-md"
                >
                  <option value="">Select Industry</option>
                  <option value="1">Education</option>
                  <option value="2">Healthcare</option>
                  <option value="3">Information Technology</option>
                  <option value="4">Finance</option>
                  <option value="5">Construction</option>
                </select>

                {/* Continue Button */}
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-800 transition"
                >
                  Continue
                </button>

                {/* Login link */}
                <p className="text-center text-sm mt-4">
                  Already have a company account?{" "}
                  <a href="/login" className="text-blue-600 hover:underline">
                    Login Here
                  </a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
export default CompanyR1;
