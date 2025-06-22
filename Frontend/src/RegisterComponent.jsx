import React from 'react'
import Header from './Header'

const RegisterComponent = () => {
  return (
    <>
    <Header/>
    <div className='bg-sky-500 w-screen h-screen'>
    <div className='flex flex-col items-center space-y-2 py-5'>
    <h1 className='text-3xl font-semibold'>Create Account</h1>
    <p className='text-xl'>Choose your account type to get started</p>
    <p className='text-xl'>Or</p>
    </div>
    <div className='flex flex-row bg-white w-screen h-screen'>
    <div className='flex flex-col bg-red-600 w-full h-full'>
    <h1>Karuna</h1>
    </div>
    
    </div>
    </div>
    </>
  )
}

export default RegisterComponent
