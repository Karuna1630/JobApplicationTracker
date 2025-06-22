import { useState } from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Landing from './Landing'
import Login from './Login'
import SignUp from './SignUp'
import Header from './Header'
import Footer from './Footer'
import AboutUs from './AboutUs'
import RegisterComponent from './RegisterComponent'


function App() {
  

  return (
    <>
      <div>
        <BrowserRouter>
        <Routes>
          <Route path='/' element={<Landing/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/signup' element={<SignUp/>}/>
          <Route path='/header' element={<Header/>}/>
          <Route path='/footer' element={<Footer/>}/>
          <Route path='/aboutus' element={<AboutUs/>}/>
          <Route path='/registercomp' element={<RegisterComponent/>}/>
        </Routes>
        </BrowserRouter>
      </div>
    </>
  )
}

export default App
