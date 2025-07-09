import React, { useState } from "react";
import { FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { FaPhone } from "react-icons/fa";
import registerimage from "../assets/registerimage.png";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { Formik, Form, Field } from "formik";
import { RegisterSchema } from "../schemas";
import { toast } from "react-toastify";
import { FaLocationDot } from "react-icons/fa6";
import { IoPersonCircleSharp } from "react-icons/io5";
import axiosInstance from '../Utils/axiosInstance'
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const initialValues = {
    // userId: "0",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    location: "",
    
    // userType: "",
    // createdAt: "",
    // updatedAt: "",
    // isActive: "",
    // company: {
    //   companiesId: "0",
    //   companyName: "",
    //   companyLogo: "",
    //   industryId: "",
    //   website: "",
    //   location: "",
    //   description: "",
    //   createdAt: "",
    //   updatedAt: "",
    // },
  };

  //fetching backend data uisng API
  const handleSubmit = async (values, actions) => {
    console.log("values", values);
    console.log(actions);
    
    try {
      const response = await axiosInstance.post("addjobseeker", values);
      console.log("User Added:", response.data);
      actions.resetForm();
      navigate('/login')
      toast.success("User registration successfully!");
    } catch (error) {

      console.log(error?.message);
      console.error("Error while doing register:", error);
      toast.error("Failed to register user.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-300">
        <div className="bg-white rounded-2xl shadow-xl flex flex-col md:flex-row w-full max-w-5xl overflow-hidden mb-8 mt-8">
          <div className="md:w-1/2 hidden md:block">
            <img
              src={registerimage}
              alt="Visual"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="md:w-1/2 w-full p-8 flex flex-col justify-center">
            <h2 className="text-2xl font-bold text-center mb-1">
              Create Account
            </h2>
            <p className="text-center text-gray-600 mb-6">
              Get started with your job journey
            </p>

            <Formik
              initialValues={initialValues}
              validationSchema={RegisterSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched }) => (
                <Form className="space-y-4  ">
                  <div className="flex items-center border border-gray-300 px-3 py-2 rounded-md ">
                    <FaUser className="text-gray-500 mr-3" />
                    <Field className= "w-full outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-400 rounded-md"

                      type="text"
                      name="firstName"
                      placeholder="First Name"
                    />
                  </div>
                  <div className="error_container">
                    {errors.firstName && touched.firstName && (
                      <p className="form_error text-red-600 text-sm mt-1 ml-1 font-medium">
                        {errors.firstName}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center border border-gray-300 px-3 py-2 rounded-md">
                    <FaUser className="text-gray-500 mr-3" />
                    <Field className= "w-full outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-400 rounded-md"
                      type="text"
                      name="lastName"
                      placeholder="Last Name"
                    />
                  </div>
                  <div className="error_container">
                    {errors.lastName && touched.lastName && (
                      <p className="form_error text-red-600 text-sm mt-1 ml-1 font-medium">
                        {errors.lastName}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center border border-gray-300 px-3 py-2 rounded-md">
                    <MdEmail className="text-gray-500 mr-3 text-lg" />
                    <Field className= "w-full outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-400 rounded-md"
                      type="email"
                      name="email"
                      placeholder="Email Address"
                    />
                  </div>
                  <div className="error_container">
                    {errors.email && touched.email && (
                      <p className="form_error text-red-600 text-sm mt-1 ml-1 font-medium">
                        {errors.email}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center border border-gray-300 px-3 py-2 rounded-md">
                    <RiLockPasswordFill className="text-gray-500 mr-3 text-lg" />
                    <Field
                      type="password"
                      name="password"
                      placeholder="Password"
                    />
                  </div>
                  <div className="error_container">
                    {errors.password && touched.password && (
                      <p className="form_error text-red-600 text-sm mt-1 ml-1 font-medium">
                        {errors.password}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center border border-gray-300 px-3 py-2 rounded-md">
                    <RiLockPasswordFill className="text-gray-500 mr-3 text-lg" />
                    <Field className= "w-full outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-400 rounded-md"
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirm Password"
                    />
                  </div>
                  <div className="error_container">
                    {errors.confirmPassword && touched.confirmPassword && (
                      <p className="form_error text-red-600 text-sm mt-1 ml-1 font-medium">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center border border-gray-300 px-3 py-2 rounded-md">
                    <FaPhone className="text-gray-500 mr-3" />
                    <Field className= "w-full outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-400 rounded-md"
                      type="text"
                      name="phoneNumber"
                      placeholder="Phone Number"
                    />
                  </div>
                  <div className="error_container">
                    {errors.phoneNumber && touched.phoneNumber && (
                      <p className="form_error text-red-600 text-sm mt-1 ml-1 font-medium">
                        {errors.phoneNumber}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center border border-gray-300 px-3 py-2 rounded-md">
                    <FaLocationDot className="text-gray-500 mr-3" />
                    <Field className= "w-full outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-400 rounded-md" type="text" name="location" placeholder="Location" />
                  </div>
                  <div className="error_container">
                    {errors.location && touched.location && (
                      <p className="form_error text-red-600 text-sm mt-1 ml-1 font-medium">
                        {errors.location}
                      </p>
                    )}
                  </div>
                  {/* <div className="flex items-center border border-gray-300 px-3 py-2 rounded-md">
                    <IoPersonCircleSharp className="text-gray-500 mr-3" />
                    <Field type="text" name="bio" placeholder="Bio" />
                  </div>
                  <div className="error_container">
                    {errors.bio && touched.bio && (
                      <p className="form_error text-red-600 text-sm mt-1 ml-1 font-medium">
                        {errors.bio}
                      </p>
                    )}
                  </div> */}

                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded-md text-lg font-medium hover:bg-blue-800   transition"
                  >
                    Create Account
                  </button>
                  <p className="text-center text-sm mt-4">
                    Already have an account?{" "}
                    <a href="#" className="text-cyan-600 hover:underline">
                      Sign in here
                    </a>
                  </p>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Register;
