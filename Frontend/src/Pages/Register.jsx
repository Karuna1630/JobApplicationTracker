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
const Register = () => {
  const initialValues ={
    userId: "0",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    userType: "3",
    userStatus: "active",
    company: {
      companyId: "0",
      companyName: "",
      address: "",
      phoneNo: "",
      email: "",
    },
  }
  
  
  const onSubmit = (values, actions) => {
        console.log(values);
        actions.resetForm();
      }


  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-300">
        <div className="bg-white rounded-2xl shadow-xl flex flex-col md:flex-row w-full max-w-5xl overflow-hidden">
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

            <Formik  initialValues={initialValues} validationSchema={RegisterSchema}  onSubmit= {onSubmit}>
              {({errors, touched}) =>(
                  <Form className="space-y-4">
                <div className="flex items-center border border-gray-300 px-3 py-2 rounded-md">
                  <FaUser className="text-gray-500 mr-3" />
                  <Field type="text" name="firstName"   placeholder="First Name"/>
                </div>
                <div className="error_container">
                  {errors.firstName && touched.firstName && (
                    <p className="form_error">{errors.firstName}</p>
                  )}
                </div>
                <div className="flex items-center border border-gray-300 px-3 py-2 rounded-md">
                  <FaUser className="text-gray-500 mr-3" />
                    <Field type="text" name="lastName"   placeholder="Last Name"/>
                </div>
                 <div className="error_container">
                  {errors.lastName && touched.lastName && (
                    <p className="form_error">{errors.lastName}</p>
                  )}
                </div>
                <div className="flex items-center border border-gray-300 px-3 py-2 rounded-md">
                  <MdEmail className="text-gray-500 mr-3 text-lg" />
                  <Field type="email" name="email" placeholder="Email Address"/>
                </div>
                 <div className="error_container">
                  {errors.email && touched.email && (
                    <p className="form_error">{errors.email}</p>
                  )}
                </div>
                <div className="flex items-center border border-gray-300 px-3 py-2 rounded-md">
                  <RiLockPasswordFill className="text-gray-500 mr-3 text-lg" />
                  <Field type="password" name="password" placeholder="Password"/>
                </div>
                 <div className="error_container">
                  {errors.password && touched.password && (
                    <p className="form_error">{errors.password}</p>
                  )}
                </div>
                <div className="flex items-center border border-gray-300 px-3 py-2 rounded-md">
                  <RiLockPasswordFill className="text-gray-500 mr-3 text-lg" />
                   <Field type="password" name="confirmPassword" placeholder="Confirm Password"/>
                </div>
                 <div className="error_container">
                  {errors.confirmPassword && touched.confirmPassword && (
                    <p className="form_error">{errors.confirmPassword}</p>
                  )}
                </div>
                <div className="flex items-center border border-gray-300 px-3 py-2 rounded-md">
                  <FaPhone className="text-gray-500 mr-3" />
                  <Field type="phonenumber" name="phone"  placeholder="Phone Number"/>
                </div>
                 <div className="error_container">
                  {errors.phone && touched.phone && (
                    <p className="form_error">{errors.phone}</p>
                  )}
                </div>
                <button
                  type="submit"
                  className="w-full bg-purple-600 text-white py-2 rounded-md text-lg font-medium hover:bg-purple-700 transition"
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
