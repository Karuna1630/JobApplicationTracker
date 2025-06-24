import React from 'react'
import Header from './Navbar'
import { BsFillPersonFill } from "react-icons/bs";
import { BsBuildingsFill } from "react-icons/bs";
import Footer from './Footer';
import { Link ,useNavigate } from 'react-router-dom';

const RegisterComponent = () => {
   const navigate = useNavigate();
  return (
    <>
    <Header/>
    <div className='bg-gradient-to-br from-blue-100 via-white to-blue-300 min-h-screen'>
      {/* Header Section */}
      <div className='flex flex-col items-center space-y-4 pt-12 pb-8'>
        <h1 className='text-5xl font-extrabold text-gray-800'>Create Account</h1>
        <p className='text-xl text-gray-600'>Choose your account type to get started</p>
        <p className='text-2xl text-gray-500'>or</p>
      </div>

      {/* Main Content Section */}
      <div className='flex justify-center px-8 pb-16'>
        <div className='flex items-center bg-white/60 backdrop-blur-sm rounded-2xl shadow-xl p-8 max-w-6xl w-full'>
          
          {/* Job Seeker Section */}
          <div className='flex flex-col space-y-6 flex-1 items-center px-8'>
             <BsFillPersonFill className="size-64" />
            <h1 className="font-bold text-3xl text-gray-800">Job Seeker</h1>
            <p className="text-xl text-gray-600 text-center">Register to Find your dream job</p>
            <button onClick={() => navigate('/registeru')} className="bg-blue-600 text-white text-lg font-semibold px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md">
              Register
            </button>  
          </div>

          {/* Vertical Divider */}
          <div className="w-1 bg-gray-400 to-transparent self-stretch"></div>
          {/* Company Section */}
          <div className='flex flex-col space-y-6 flex-1 items-center px-8'>
            <BsBuildingsFill className="size-60" />
            <h1 className="font-bold text-3xl text-gray-800">Company</h1>
            <p className="text-xl text-gray-600 text-center">Register to Find great talent</p>
            <button onClick={() => navigate("/companyR1")} className="bg-blue-600 text-white text-lg font-semibold px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md">
              Register
            </button>  
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div className='text-center pb-12'>
        <p className='text-2xl text-gray-600'>
          Already have an account? 
          <Link to ="/logincomp">
          <span className='text-blue-600 hover:text-blue-700 cursor-pointer font-semibold ml-2 hover:underline'>
            Login
          </span>
          </Link>
        </p>
      </div>
    </div>
    <Footer/>
    </>
  )
}

export default RegisterComponent