import React, { useState } from "react";
import { FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { FaPhone } from "react-icons/fa";
import registerimage from "../assets/registerimage.png";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { useFormik } from "formik";
import { RegisterSchema } from "../schemas";
const Register = () => {
  const [formData, setFormData] = useState({
    UserId: "0",
    FirstName: "",
    LastName: "",
    Email: "",
    MobileNo: "",
    Password: "",
    ConfirmPassword: "",
    UserType: "3",
    UserStatus: "active",
    company: {
      CompanyId: "0",
      CompanyName: "",
      Address: "",
      PhoneNo: "",
      Email: "",
    },
  });
  const { values, handleBlur, handleChange, handleSubmit, errors, touched } =
    useFormik({
      initialValues: formData,
      validationSchema: RegisterSchema,
      onSubmit: (values, actions) => {
        console.log(values);
        actions.resetForm();
      },
    });
  console.log(touched);
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

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center border border-gray-300 px-3 py-2 rounded-md">
                <FaUser className="text-gray-500 mr-3" />
                <input
                  type="text"
                  name="FirstName"
                  value={values.FirstName}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="First Name"
                  className="w-full outline-none bg-transparent text-base"
                  
                />
              </div>
              <div className="error_container">
                {errors.FirstName && touched.FirstName && (
                  <p className="form_error">{errors.FirstName}</p>
                )}
              </div>

              <div className="flex items-center border border-gray-300 px-3 py-2 rounded-md">
                <FaUser className="text-gray-500 mr-3" />
                <input
                  type="text"
                  name="LastName"
                  placeholder="Last Name"
                  value={values.LastName}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  className="w-full outline-none bg-transparent text-base"
                  
                />
              </div>
               <div className="error_container">
                {errors.LastName && touched.LastName && (
                  <p className="form_error">{errors.LastName}</p>
                )}
              </div>

              <div className="flex items-center border border-gray-300 px-3 py-2 rounded-md">
                <MdEmail className="text-gray-500 mr-3 text-lg" />
                <input
                  type="email"
                  name="Email"
                  placeholder="Email Address"
                  value={values.Email}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  className="w-full outline-none bg-transparent text-base"
                  
                />
              </div>
               <div className="error_container">
                {errors.Email && touched.Email && (
                  <p className="form_error">{errors.Email}</p>
                )}
              </div>

              <div className="flex items-center border border-gray-300 px-3 py-2 rounded-md">
                <RiLockPasswordFill className="text-gray-500 mr-3 text-lg" />
                <input
                  type="password"
                  name="Password"
                  placeholder="Password"
                  value={values.Password}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  className="w-full outline-none bg-transparent text-base"
                
                />
              </div>
               <div className="error_container">
                {errors.Password && touched.Password && (
                  <p className="form_error">{errors.Password}</p>
                )}
              </div>

              <div className="flex items-center border border-gray-300 px-3 py-2 rounded-md">
                <RiLockPasswordFill className="text-gray-500 mr-3 text-lg" />
                <input
                  type="password"
                  name="ConfirmPassword"
                  placeholder="Confirm Password"
                  value={values.ConfirmPassword}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  className="w-full outline-none bg-transparent text-base"
                  
                />
              </div>
               <div className="error_container">
                {errors.ConfirmPassword && touched.ConfirmPassword && (
                  <p className="form_error">{errors.ConfirmPassword}</p>
                )}
              </div>

              <div className="flex items-center border border-gray-300 px-3 py-2 rounded-md">
                <FaPhone className="text-gray-500 mr-3" />
                <input
                  type="phonenumber"
                  name="MobileNo"
                  value={values.MobileNo}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  className="w-full outline-none bg-transparent text-base"
                  
                />
              </div>
               <div className="error_container">
                {errors.MobileNo && touched.MobileNo && (
                  <p className="form_error">{errors.MobileNo}</p>
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
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Register;
