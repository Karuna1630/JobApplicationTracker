import { useState } from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Landing from './Landing'
import Login from './Login'
import SignUp from './SignUp'
import Header from './Header'
import Footer from './Footer'
import AboutUs from './AboutUs'
import Signin from './Signin'
import Register from './Register'

function App() {
  

  return (
    <>
      <div>
        <BrowserRouter>
        <Routes>
          <Route path='/' element={<Landing/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/signup' element={<SignUp/>}/>
          <Route path='/signin' element={<Signin/>}/>
          <Route path='/Register' element={<Register/>}/>
          <Route path='/header' element={<Header/>}/>
          <Route path='/footer' element={<Footer/>}/>
            <Route path='/aboutus' element={<AboutUs/>}/>
            
        </Routes>
        </BrowserRouter>
      </div>
    </>
  )
}

export default App
