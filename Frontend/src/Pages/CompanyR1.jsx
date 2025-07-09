import { useState } from "react";
import crlogo from "../assets/CR.avif";
import { Navigate, useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { useFormik, Formik, Form, Field } from "formik";
import { companyRegister } from "../schemas/index1";
import { AiFillCheckCircle } from "react-icons/ai";

const CompanyR1 = () => {
  const navigate = useNavigate();
  const initialValues = {
    userId: "0",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    location: "",
    bio: "",
    userType: "",
    createdAt: "",
    updatedAt: "",
    isActive: "",
    company: {
      companiesId: "0",
      companyName: "",
      companyLogo: "",
      industryId: "0",
      website: "",
      location: "",
      description: "",
      createdAt: "",
      updatedAt: "",
    },
  };
  const { values, handleBlur, handleChange, handleSubmit, errors, touched } =
    useFormik({
      initialValues,
      validationSchema: companyRegister,
      onSubmit: (values) => {
        // Save company data to localStorage
        localStorage.setItem("companyData", JSON.stringify(values.company));

        // Navigate to the next step
        navigate("/companyR2");
      },
    });

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
              <div className="text-center mb-6 " >
                <h2 className="text-2xl font-bold">3 easy steps of Company Registration</h2>
                <div className="flex justify-center items-center mt-6 relative">
                  {/* Step 1 */}
                  <div className="flex flex-col items-center z-10">
                    <div className="h-10 w-10 rounded-full bg-white text-black border border-black flex items-center justify-center">
                      1
                    </div>
                    <span className="text-sm mt-1 font-medium">Organization</span>
                  </div>

                  {/* Line between Step 1 and 2 */}
                  <div className="w-1/3 h-0.5 bg-green-500 mx-2"></div>

                  {/* Step 2 */}
                  <div className="flex flex-col items-center z-10">
                    <div className="h-10 w-10 rounded-full bg-white text-black border border-black flex items-center justify-center">
                      2
                    </div>
                    <span className="text-sm mt-1 font-medium">Sign Up</span>
                  </div>
                </div>

                <div className="pt-4">
                  <h2 className="text-1xl font-bold">
                    Organization Information
                  </h2>
                  <h4 className="text-l"> Provide your company details </h4>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <input
                  type="text"
                  name="company.companyName"
                  value={values.company?.companyName}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder=" Company Name"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-md"
                />
                <div className="error_container">
                  {errors.company?.companyName &&
                    touched.company?.companyName && (
                      <p className="form_error text-red-600 text-sm mt-1 ml-1 font-medium">
                        {errors.company.companyName}
                      </p>
                    )}
                </div>

                <input
                  type="text"
                  name="company.location"
                  value={values.company?.location}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="Location"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-md"
                />
                <div className="error_container">
                  {errors.company?.location && touched.company?.location && (
                    <p className="form_error text-red-600 text-sm mt-1 ml-1 font-medium">
                      {errors.company.location}
                    </p>
                  )}
                </div>

                <input
                  type="text"
                  name="company.description"
                  value={values.company?.description}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder=" Description"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-md"
                />
                <div className="error_container">
                  {errors.company?.description &&
                    touched.company?.description && (
                      <p className="form_error text-red-600 text-sm mt-1 ml-1 font-medium">
                        {errors.company.description}
                      </p>
                    )}
                </div>

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
