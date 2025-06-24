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



function App() {
  

  return (
    <>
      <div>
        <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/signup' element={<SignUp/>}/>
          <Route path='/Register' element={<Register/>}/>
          <Route path='/aboutus' element={<AboutUs/>}/>
          <Route path='/registercomp' element={<RegisterComponent/>}/>
          <Route path='/companies' element={<Companies/>}/>

          <Route path='/resumemanagement' element={<ResumeManagement/>}/>
          <Route path='/jobrecommendation' element={<JobRecommendation/>}/>
          

          <Route path='/companyR1' element={<CompanyR1/>}/>

    
        </Routes>
        </BrowserRouter>
      </div>
    </>
  )
}

export default App
