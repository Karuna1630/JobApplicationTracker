import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AiFillCheckCircle } from "react-icons/ai";
import crlogo from "../assets/CR.avif";
import Footer from "../Components/Footer";
import Navbar from "../Components/Navbar";
import { useFormik } from "formik";
import { CompanyUserSchema } from "../schemas/index2";


const CompanyR2=()=> {
  

  // Step 1: Load company data from localStorage
  const storedCompanyData = JSON.parse(localStorage.getItem("companyData"));

  // Step 2: Define full initialValues (merge company + recruiter)
  const initialValues = {
    userId: "0",
    companiesId: "",
    personName: "",
    email: "",
    number: "",
    password: "",
    confirmPassword: "",
    userType: "recruiter",
    createdAt: "",
    updatedAt: "",
    isActive: "",
    company: storedCompanyData || {
      companiesId: "0",
      companyName: "",
      companyLogo: "",
      industryId: "",
      website: "",
      location: "",
      description: "",
      createdAt: "",
      updatedAt: "",
    },
  };

  // Step 3: Formik setup
  const { values, handleBlur, handleChange, handleSubmit, errors, touched } = useFormik({
    initialValues,
    validationSchema: CompanyUserSchema,
    onSubmit: (values, actions) => {
      console.log("Final submitted data:", values); // <- shows both company + user data
      actions.resetForm();
      localStorage.removeItem("companyData"); // optional: clean up
    },
  });


  return (
    <>
    <Navbar/>
    <div className="min-h-screen font-sans flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-300 p-10">
      <div className="flex w-full max-w-6xl bg-black shadow-lg rounded-lg overflow-hidden">
        {/* Left image section */}
        <div className="hidden md:block md:w-1/2">
          <img
            src={crlogo} 
            className="object-cover w-full h-full"
          />
        </div>

        {/* Right form section */}
        <div className="w-full md:w-1/2 bg-white flex items-center justify-center p-8">
          <div className="max-w-sm w-full">
            
            <div className="text-center mb-6 " >
              <h2 className="text-2xl font-bold">2 easy steps of Company Registration</h2>
              <div className="flex justify-center items-center mt-6 relative">
               
                <div className="flex flex-col items-center z-10">
                  <div className="h-10 w-10 rounded-full bg-white text-black border border-black flex items-center">
                    <AiFillCheckCircle  className="text-green-600 text-6xl"/>
                  </div>
                  <span className="text-sm mt-1 font-medium">Organization</span>
                </div>

             
                <div className="flex-1 h-0.5 bg-green-500 mx-0 mt-0"></div>

              
                <div className="flex flex-col items-center z-10">
                  <div className="h-10 w-10 rounded-full bg-white text-black border border-black flex items-center justify-center font-bold">
                    2
                  </div>
                  <span className="text-sm mt-1 font-medium">Correspondence</span>
                </div>
                <div className="flex-1 h-0.5 bg-green-500 mx-0 mt-0"></div>
                <div className="flex flex-col items-center z-10">
                  <div className="h-10 w-10 rounded-full bg-white text-black border border-black flex items-center justify-center font-bold">
                    3
                  </div>
                  <span className="text-sm mt-1 font-medium">Sign Up</span>
                </div>
              </div>
              <div className="pt-4">
                <h2 className="text-1xl font-bold">Organization Details</h2>
                <h4 className="text-l"> Provide Recruitment focal personal contact detalis </h4>
                </div>

            </div>

       
            <form onSubmit={handleSubmit} className="space-y-5">
              <input
                type="text"
                name="personName"
                value={values.personName}
                onBlur={handleBlur}
                onChange={handleChange}
                placeholder="Person Name"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-md"
              />
             <div className="error_container">
                  {errors.personName &&  touched.personName &&
                    <p className="form_error">{errors.personName}</p>
                  }
                </div>

              <input
                type="tel"
                name="number"
                value={values.number}
                onBlur={handleBlur}
                onChange={handleChange}
                placeholder="person Phone Number"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-md"
              />
                <div className="error_container">
                  {errors.number &&  touched.number &&
                    <p className="form_error">{errors.number}</p>
                  }
                </div>
              <input
                type="text"
                name="email"
                value={values.email}
                onBlur={handleBlur}
                onChange={handleChange}
                placeholder="person Email"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-md"
                />
                  <div className="error_container">
                  {errors.email &&  touched.email &&
                    <p className="form_error">{errors.email}</p>
                  }
                </div>

                 <input
                type="password"
                name="password"
                value={values.password}
                onBlur={handleBlur}
                onChange={handleChange}
                placeholder="Password"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-md"
                />
                  <div className="error_container">
                  {errors.password &&  touched.password &&
                    <p className="form_error">{errors.password}</p>
                  }
                </div>
                  <input
                type="password"
                name="confirmPassword"
                value={values.confirmPassword}
                onBlur={handleBlur}
                onChange={handleChange}
                placeholder="Confirm Password"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-md"
                />
                  <div className="error_container">
                  {errors.confirmPassword &&  touched.confirmPassword &&
                    <p className="form_error">{errors.confirmPassword}</p>
                  }
                </div>

                <button 
                  type="submit"
                  className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-800 transition"
                >
                  Create Account
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
    <Footer/>
    </>
  );
}
export default CompanyR2