import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiFillCheckCircle } from "react-icons/ai";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import crlogo from "../assets/CR.avif";
import Footer from "../Components/Footer";
import Navbar from "../Components/Navbar";
import { useFormik } from "formik";
import { CompanyUserSchema } from "../schemas/index2";
import axiosInstance from "../Utils/axiosInstance";
import { toast } from "react-toastify";

const CompanyR2 = () => {
  const navigate = useNavigate();
  const storedCompanyData = JSON.parse(localStorage.getItem("companyData"));

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (!storedCompanyData) {
      toast.error("Company information is missing. Please complete step 1.");
      navigate("/companyR1");
    }
  }, []);

  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  };

  const { values, handleBlur, handleChange, handleSubmit, errors, touched } =
    useFormik({
      initialValues,
      validationSchema: CompanyUserSchema,
      onSubmit: async (values, actions) => {
        try {
          const payload = {
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            phoneNumber: values.phoneNumber,
            password: values.password,
            companyDto: {
              companyName: storedCompanyData.companyName,
              location: storedCompanyData.location,
              description: storedCompanyData.description,
            },
          };

          const response = await axiosInstance.post("/registeruser", payload);

          if (response.data?.isSuccess) {
            toast.success("Company and recruiter registered successfully!");
            actions.resetForm();
            localStorage.removeItem("companyData");
            navigate("/login");
          } else {
            toast.error(response.data.message || "Something went wrong.");
          }
        } catch (error) {
          console.error("Registration failed:", error);
          toast.error(
            error.response?.data?.message ||
              "Failed to register. Please try again."
          );
        }
      },
    });

  return (
    <>
      <Navbar />
      <div className="min-h-screen font-sans flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-300 p-10">
        <div className="flex w-full max-w-6xl bg-black shadow-lg rounded-lg overflow-hidden">
          <div className="hidden md:block md:w-1/2">
            <img src={crlogo} className="object-cover w-full h-full" />
          </div>

          <div className="w-full md:w-1/2 bg-white flex items-center justify-center p-8">
            <div className="max-w-sm w-full">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold">
                  2 easy steps of Company Registration
                </h2>
                <div className="flex justify-center items-center mt-6 relative">
                  <div className="flex flex-col items-center z-10">
                    <div className="h-10 w-10 rounded-full bg-white text-black border border-black flex items-center">
                      <AiFillCheckCircle className="text-green-600 text-6xl" />
                    </div>
                    <span className="text-sm mt-1 font-medium">
                      Organization
                    </span>
                  </div>

                  <div className="flex-1 h-0.5 bg-green-500 mx-0 mt-0"></div>

                  <div className="flex flex-col items-center z-10">
                    <div className="h-10 w-10 rounded-full bg-white text-black border border-black flex items-center justify-center font-bold">
                      2
                    </div>
                    <span className="text-sm mt-1 font-medium">Sign Up</span>
                  </div>
                </div>
                <div className="pt-4">
                  <h2 className="text-1xl font-bold">Recruiter Details</h2>
                  <h4 className="text-l">
                    Provide recruitment focal person's contact details
                  </h4>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <input
                  type="text"
                  name="firstName"
                  value={values.firstName}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="First Name"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-md"
                />
                {errors.firstName && touched.firstName && (
                  <p className="text-red-600 text-sm mt-1 ml-1 font-medium">
                    {errors.firstName}
                  </p>
                )}

                <input
                  type="text"
                  name="lastName"
                  value={values.lastName}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="Last Name"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-md"
                />
                {errors.lastName && touched.lastName && (
                  <p className="text-red-600 text-sm mt-1 ml-1 font-medium">
                    {errors.lastName}
                  </p>
                )}

                <input
                  type="tel"
                  name="phoneNumber"
                  value={values.phoneNumber}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-md"
                />
                {errors.phoneNumber && touched.phoneNumber && (
                  <p className="text-red-600 text-sm mt-1 ml-1 font-medium">
                    {errors.phoneNumber}
                  </p>
                )}

                <input
                  type="text"
                  name="email"
                  value={values.email}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="Email"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-md"
                />
                {errors.email && touched.email && (
                  <p className="text-red-600 text-sm mt-1 ml-1 font-medium">
                    {errors.email}
                  </p>
                )}

                {/* Password with eye toggle */}
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={values.password}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Password"
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-md pr-10"
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 cursor-pointer text-gray-500"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
                {errors.password && touched.password && (
                  <p className="text-red-600 text-sm mt-1 ml-1 font-medium">
                    {errors.password}
                  </p>
                )}

                {/* Confirm Password with eye toggle */}
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={values.confirmPassword}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Confirm Password"
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-md pr-10"
                  />
                  <span
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    className="absolute right-3 top-3 cursor-pointer text-gray-500"
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
                {errors.confirmPassword && touched.confirmPassword && (
                  <p className="text-red-600 text-sm mt-1 ml-1 font-medium">
                    {errors.confirmPassword}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-800 transition"
                >
                  Create Account
                </button>

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

export default CompanyR2;
