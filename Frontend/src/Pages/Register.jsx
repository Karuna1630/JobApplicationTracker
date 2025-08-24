import { FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { FaPhone } from "react-icons/fa";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import registerimage from "../assets/registerimage.png";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { Formik, Form, Field } from "formik";
import { RegisterSchema } from "../schemas";
import { toast } from "react-toastify";
import { FaLocationDot } from "react-icons/fa6";
import axiosInstance from "../Utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Register = () => {
  const navigate = useNavigate();

  // State for toggling password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    location: "",
    userType: 4, // Default to normal user
  };

  const handleSubmit = async (values, actions) => {
    try {
      const response = await axiosInstance.post("registeruser", values);

      if (response.data.isSuccess) {
        actions.resetForm();
        navigate("/login");
        toast.success(
          response.data.message || "User registration successfully!"
        );
      } else {
        toast.error(response.data.message || "Registration failed.");
      }
    } catch (error) {
      if (error.response && error.response.data) {
        const errorData = error.response.data;
        const errorMessage =
          errorData.message ||
          errorData.Message ||
          "Registration failed. Please try again.";

        if (errorData.statusCode === 400) {
          if (errorMessage.includes("Email is already registered")) {
            toast.error(
              "This email is already registered. Please use a different email or try logging in."
            );
          } else if (errorMessage.includes("phone number is already in use")) {
            toast.error(
              "This phone number is already in use. Please use a different number or try logging in."
            );
          } else {
            toast.error(errorMessage);
          }
        } else {
          toast.error(errorMessage);
        }
      } else if (error.request) {
        toast.error(
          "Network error. Please check your connection and try again."
        );
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
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
                <Form className="space-y-4">
                  {/* Hidden UserType field */}
                  <Field
                    type="hidden"
                    name="userType"
                    value={4}
                  />

                  {/* First Name */}
                  <div className="flex items-center border border-gray-300 px-3 py-2 rounded-md">
                    <FaUser className="text-gray-500 mr-3" />
                    <Field
                      className="w-full outline-none"
                      type="text"
                      name="firstName"
                      placeholder="First Name"
                    />
                  </div>
                  {errors.firstName && touched.firstName && (
                    <p className="text-red-600 text-sm">{errors.firstName}</p>
                  )}

                  {/* Last Name */}
                  <div className="flex items-center border border-gray-300 px-3 py-2 rounded-md">
                    <FaUser className="text-gray-500 mr-3" />
                    <Field
                      className="w-full outline-none"
                      type="text"
                      name="lastName"
                      placeholder="Last Name"
                    />
                  </div>
                  {errors.lastName && touched.lastName && (
                    <p className="text-red-600 text-sm">{errors.lastName}</p>
                  )}

                  {/* Email */}
                  <div className="flex items-center border border-gray-300 px-3 py-2 rounded-md">
                    <MdEmail className="text-gray-500 mr-3 text-lg" />
                    <Field
                      className="w-full outline-none"
                      type="email"
                      name="email"
                      placeholder="Email Address"
                    />
                  </div>
                  {errors.email && touched.email && (
                    <p className="text-red-600 text-sm">{errors.email}</p>
                  )}

                  {/* Password */}
                  <div className="flex items-center border border-gray-300 px-3 py-2 rounded-md relative">
                    <RiLockPasswordFill className="text-gray-500 mr-3 text-lg" />
                    <Field
                      className="w-full outline-none"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Password"
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 cursor-pointer text-gray-500"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                  {errors.password && touched.password && (
                    <p className="text-red-600 text-sm">{errors.password}</p>
                  )}

                  {/* Confirm Password */}
                  <div className="flex items-center border border-gray-300 px-3 py-2 rounded-md relative">
                    <RiLockPasswordFill className="text-gray-500 mr-3 text-lg" />
                    <Field
                      className="w-full outline-none"
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="Confirm Password"
                    />
                    <span
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 cursor-pointer text-gray-500"
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                  {errors.confirmPassword && touched.confirmPassword && (
                    <p className="text-red-600 text-sm">
                      {errors.confirmPassword}
                    </p>
                  )}

                  {/* Phone Number */}
                  <div className="flex items-center border border-gray-300 px-3 py-2 rounded-md">
                    <FaPhone className="text-gray-500 mr-3" />
                    <Field
                      className="w-full outline-none"
                      type="text"
                      name="phoneNumber"
                      placeholder="Phone Number"
                    />
                  </div>
                  {errors.phoneNumber && touched.phoneNumber && (
                    <p className="text-red-600 text-sm">{errors.phoneNumber}</p>
                  )}

                  {/* Location */}
                  <div className="flex items-center border border-gray-300 px-3 py-2 rounded-md">
                    <FaLocationDot className="text-gray-500 mr-3" />
                    <Field
                      className="w-full outline-none"
                      type="text"
                      name="location"
                      placeholder="Location"
                    />
                  </div>
                  {errors.location && touched.location && (
                    <p className="text-red-600 text-sm">{errors.location}</p>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded-md text-lg font-medium hover:bg-blue-800 transition"
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