import { useState } from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Landing from './Landing'
import Login from './Login'
import SignUp from './SignUp'

function App() {
  

  return (
    <>
      <div>
        <BrowserRouter>
        <Routes>
          <Route path='/' element={<Landing/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/signup' element={<SignUp/>}/>
        </Routes>
        </BrowserRouter>
      </div>
    </>
  )
}

export default App
