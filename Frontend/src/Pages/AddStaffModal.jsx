import React, { useState } from "react";
import { FaUser, FaTimes } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { FaPhone } from "react-icons/fa";
import { Formik, Form, Field } from "formik";
import { StaffRegisterSchema } from "../schemas/index3";
import { toast } from "react-toastify";
import { FaLocationDot } from "react-icons/fa6";
import axiosInstance from "../Utils/axiosInstance";

const AddStaffModal = ({ isOpen, onClose, companyId, onStaffAdded }) => {
  if (!isOpen) return null;

  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    location: "",
    userType: 3, // Staff = 3
    companyId: companyId || 1, // Use the passed companyId
  };

  const handleSubmit = async (values, actions) => {
    console.log("Staff values:", values);

    try {
      const response = await axiosInstance.post("registeruser", values);
      console.log("Staff Added:", response.data);

      if (response.data.isSuccess) {
        actions.resetForm();
        toast.success(
          response.data.message || "Staff registration successful!"
        );
        onStaffAdded(); // Callback to parent component
      } else {
        toast.error(response.data.message || "Registration failed.");
      }
    } catch (error) {
      console.log(error?.message);
      console.error("Error while doing register:", error);

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
          } else if (errorMessage.includes("Company with ID")) {
            toast.error(
              "Invalid company ID. Please contact your administrator."
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">Add Staff Member</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Form */}
        <div className="p-6">
          <p className="text-center text-gray-600 mb-6">
            Register a new staff member for your company
          </p>

          <Formik
            initialValues={initialValues}
            validationSchema={StaffRegisterSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched }) => (
              <Form className="space-y-4">
                {/* Hidden fields */}
                <Field type="hidden" name="userType" value={3} />
                <Field type="hidden" name="companyId" value={companyId} />

                {/* First Name */}
                <div>
                  <div className="flex items-center border border-gray-300 px-3 py-2 rounded-md">
                    <FaUser className="text-gray-500 mr-3" />
                    <Field
                      className="w-full outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-400"
                      type="text"
                      name="firstName"
                      placeholder="First Name"
                    />
                  </div>
                  {errors.firstName && touched.firstName && (
                    <p className="text-red-600 text-sm mt-1 ml-1 font-medium">
                      {errors.firstName}
                    </p>
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <div className="flex items-center border border-gray-300 px-3 py-2 rounded-md">
                    <FaUser className="text-gray-500 mr-3" />
                    <Field
                      className="w-full outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-400"
                      type="text"
                      name="lastName"
                      placeholder="Last Name"
                    />
                  </div>
                  {errors.lastName && touched.lastName && (
                    <p className="text-red-600 text-sm mt-1 ml-1 font-medium">
                      {errors.lastName}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <div className="flex items-center border border-gray-300 px-3 py-2 rounded-md">
                    <MdEmail className="text-gray-500 mr-3 text-lg" />
                    <Field
                      className="w-full outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-400"
                      type="email"
                      name="email"
                      placeholder="Email Address"
                    />
                  </div>
                  {errors.email && touched.email && (
                    <p className="text-red-600 text-sm mt-1 ml-1 font-medium">
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Phone Number */}
                <div>
                  <div className="flex items-center border border-gray-300 px-3 py-2 rounded-md">
                    <FaPhone className="text-gray-500 mr-3" />
                    <Field
                      className="w-full outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-400"
                      type="text"
                      name="phoneNumber"
                      placeholder="Phone Number"
                    />
                  </div>
                  {errors.phoneNumber && touched.phoneNumber && (
                    <p className="text-red-600 text-sm mt-1 ml-1 font-medium">
                      {errors.phoneNumber}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center border border-gray-300 px-3 py-2 rounded-md">
                    <RiLockPasswordFill className="text-gray-500 mr-3 text-lg" />
                    <Field
                      className="w-full outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-400"
                      type="password"
                      name="password"
                      placeholder="Password"
                    />
                  </div>
                  {errors.password && touched.password && (
                    <p className="text-red-600 text-sm mt-1 ml-1 font-medium">
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <div className="flex items-center border border-gray-300 px-3 py-2 rounded-md">
                    <RiLockPasswordFill className="text-gray-500 mr-3 text-lg" />
                    <Field
                      className="w-full outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-400"
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirm Password"
                    />
                  </div>
                  {errors.confirmPassword && touched.confirmPassword && (
                    <p className="text-red-600 text-sm mt-1 ml-1 font-medium">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                {/* Location */}
                <div>
                  <div className="flex items-center border border-gray-300 px-3 py-2 rounded-md">
                    <FaLocationDot className="text-gray-500 mr-3" />
                    <Field
                      className="w-full outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-400"
                      type="text"
                      name="location"
                      placeholder="Location"
                    />
                  </div>
                  {errors.location && touched.location && (
                    <p className="text-red-600 text-sm mt-1 ml-1 font-medium">
                      {errors.location}
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 bg-gray-500 text-white py-2 rounded-md text-lg font-medium hover:bg-gray-600 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 rounded-md text-lg font-medium hover:bg-blue-800 transition"
                  >
                    Add Staff
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default AddStaffModal;