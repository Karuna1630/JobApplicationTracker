import { useState } from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './Pages/Home'
import Login from './Pages/Login'
import SignUp from './Pages/SignUp'
import AboutUs from './Pages/AboutUs'
import RegisterComponent from './Components/RegisterComponent'
import Register from './Pages/Register'
import Companies from './Pages/Companies'
import ResumeManagement from './Pages/ResumeManagement'
import JobRecommendation from './Pages/JobRecommendation'
import CompanyR1 from './Pages/CompanyR1'
import MessagesInbox from './Pages/MessagesInbox'

import LoginC from './Pages/LoginC'
import UserProfile from './Pages/UserProfile'

import CompanyR2 from './Pages/CompanyR2'
import CompanyR3 from './Pages/CompanyR3'
import ApplicationReceived from './Pages/ApplicationReceived.jsx'


import ContactUs from './Pages/ContactUs'





function App() {
  

  return (
    <>
      <div>
        <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/signup' element={<SignUp/>}/>
          <Route path='/registeru' element={<Register/>}/>
          <Route path='/aboutus' element={<AboutUs/>}/>
          <Route path='/registercomp' element={<RegisterComponent/>}/>
          <Route path='/companies' element={<Companies/>}/>
          <Route path='/resumemanagement' element={<ResumeManagement/>}/>
          <Route path='/jobrecommendation' element={<JobRecommendation/>}/>
          <Route path='/companyR1' element={<CompanyR1/>}/>
          <Route path='/messagesinbox' element={<MessagesInbox/>}/>

          <Route path='/loginc' element= {<LoginC/>}/>
          <Route path='/userProfile' element= {<UserProfile/>}/>

          <Route path='/companyR2' element={<CompanyR2/>}/>
          <Route path='/companyR3' element={<CompanyR3/>}/>
          <Route path='/applicationreceived' element={<ApplicationReceived/>}/>
          <Route path='/contactus' element={<ContactUs/>}/>


    
        </Routes>
        </BrowserRouter>
      </div>
    </>
  )
}

export default App
