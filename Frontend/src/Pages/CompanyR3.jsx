import React from "react";
import { Link } from "react-router-dom";
import { AiFillCheckCircle } from "react-icons/ai";
import crlogo from "../assets/CR.avif";
import { GoArrowLeft } from "react-icons/go";
import { GoArrowRight } from "react-icons/go";
import Footer from "../Components/Footer";
import Navbar from "../Components/Navbar";

const CompanyR3=()=> {
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
            {/* Step Indicator */}
            <div className="text-center mb-6 " >
              <h2 className="text-2xl font-bold">3 easy steps of Company Registration</h2>
              <div className="flex justify-center items-center mt-6 relative">
                {/* Step 1 */}
                <div className="flex flex-col items-center z-10">
                  <div className="h-10 w-10 rounded-full bg-white text-black border border-black flex items-center">
                    <AiFillCheckCircle  className="text-green-600 text-6xl"/>
                  </div>
                  <span className="text-sm mt-1 font-medium">Organization</span>
                </div>

                {/* Line between Step 1 and 2 */}
                <div className="flex-1 h-0.5 bg-green-500 mx-0 mt-0"></div>

                {/* Step 2 */}
                <div className="flex flex-col items-center z-10">
                  <div className="h-10 w-10 rounded-full bg-white text-black border border-black flex items-center">
                    <AiFillCheckCircle  className="text-green-600 text-6xl"/>
                  </div>
                  <span className="text-sm mt-1 font-medium">Correspondence</span>
                </div>

                {/* Line between Step 2 and 3 */}
                <div className="flex-1 h-0.5 bg-green-500 mx-0 mt-0"></div>

                {/* Step 3 */}
                <div className="flex flex-col items-center z-10">
                  <div className="h-10 w-10 rounded-full bg-white text-black border border-black flex items-center justify-center font-bold">
                    3
                  </div>
                  <span className="text-sm mt-1 font-medium">Sign Up</span>
                </div>
              </div>
              <div className="pt-4">
                <h2 className="text-1xl font-bold"> Login credentials</h2>
                <h4 className="text-l"> Provide official email and create account </h4>
              </div>

            </div>

            {/* Form Section */}
            <form className="space-y-5">
              {/*Organization Login Email */}
              <input
                type="text"
                name="Email"
                placeholder="Organization Email"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-md"
              />

              {/* Enter pasword */}
              <input
                type="text"
                name="Password"
                placeholder="Enter pasword"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-md"
              />

              {/* Industry Dropdown */}
              <input
                type="text"
                name="email"
                placeholder="Re-Enter pasword"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-md"
              />
              <p className="text-center text-sm">
                By clicking on 'Create an Company Account'
                below you are agreeing to the tearms and Privacy of Job tracker
              </p>

              <div className=" flex flex-row space-x-8 pl-44">
               <Link to ="/companyR2">
                <GoArrowLeft className="size-8  text-blue-800 hover:text-blue-600"/>
               </Link>
               {/* Continue Button */}
                <button onClick={()=> navigate("/companyR2")}
                  type="submit"
                  className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-800 transition"
                >
                  Create an Account
                </button>
              </div>

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
export default CompanyR3