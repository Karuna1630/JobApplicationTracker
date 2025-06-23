import { useState } from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './Pages/Home'
import Login from './Pages/Login'
import SignUp from './Pages/SignUp'
import AboutUs from './Pages/AboutUs'
import RegisterComponent from './Components/RegisterComponent'
import Signin from './Pages/Signin'
import Register from './Pages/Register'
import Companies from './Pages/Companies'


function App() {
  

  return (
    <>
      <div>
        <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/signup' element={<SignUp/>}/>
          <Route path='/signin' element={<Signin/>}/>
          <Route path='/Register' element={<Register/>}/>
          <Route path='/aboutus' element={<AboutUs/>}/>
          <Route path='/registercomp' element={<RegisterComponent/>}/>
          <Route path='/aboutus' element={<AboutUs/>}/>
          <Route path='/companies' element={<Companies/>}/>
    
        </Routes>
        </BrowserRouter>
      </div>
    </>
  )
}

export default App
