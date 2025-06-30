import { useState } from "react";
import crlogo from "../assets/CR.avif";
import { Navigate, useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";


const CompanyR1=()=> {
   const [formData, setFormData] = useState({
      UserId:"0",
      FirstName:"",
      LastName:"",
      Email:"",
      MobileNo:"",
      Password:"",
      UserType:"3",
      UserStatus:"active",
      company: {
        CompanyId: "0",
        CompanyName: "",
        Address:"",
        PhoneNo:"",
        Email: "",
     }
    });
     const handleSubmit = (e) => {
      e.preventDefault();
      console.log("Submitted", formData);
    };
  const handleChange = (e) => {
  const { name, value } = e.target;

  
  if (["CompanyName", "Address", "PhoneNo", "Email"].includes(name)) {
    setFormData((prevFormData) => ({
      ...prevFormData,
      company: {
        ...prevFormData.company,
        [name]: value,
      },
    }));
  } else {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  }
};


  const navigate = useNavigate();
  return (
    <>
   <Navbar/>
    <div className="min-h-screen font-sans flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-300 p-10">
      <div className="flex w-full max-w-6xl shadow-lg rounded-lg overflow-hidden">
        {/* Left image section */}
        <div className="hidden md:block md:w-1/2">
          <img
            src={crlogo} 
            className="object-cover w-full h-full"
          />
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
                <h2 className="text-1xl font-bold">Organization Information</h2>
                <h4 className="text-l"> Provide your company details </h4>
                </div>
            </div>

            {/* Form Section */}
            <form  onSubmit={handleSubmit} className="space-y-5">
              {/* Organization Name */}
              <input
                type="text"
                name="CompanyName"
                value={formData.company.CompanyName}
                onChange={handleChange}
                placeholder=" Company Name"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-md"
              />
                 {/* Address */}
              <input
                type="text"
                name="Address"
                value={formData.company.Address}
                onChange={handleChange}
                placeholder="Address"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-md"
              />

           
               {/* Phone */}
              <input
                type="tel"
                name="PhoneNo"
                value={formData.company.PhoneNo}
                onChange={handleChange}
                placeholder=" Phone Number"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-md"
              />

                 {/* Email */}
              <input
                type="email"
                name="Email"
                value={formData.company.Email}
                onChange={handleChange}
                placeholder=" Email"
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
                Create an account
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
export default CompanyR1
