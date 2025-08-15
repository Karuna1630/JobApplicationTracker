
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './Pages/Home'
import Login from './Pages/Login'
import SignUp from './Pages/SignUp'
import AboutUs from './Pages/AboutUs'
import RegisterComponent from './Components/RegisterComponent'
import Register from './Pages/Register'
import Companies from './Pages/Companies'
import Uploadresume from './Pages/Uploadresume.jsx'
import JobRecommendation from './Pages/JobRecommendation'
import CompanyR1 from './Pages/CompanyR1'
import MessagesInbox from './Pages/MessagesInbox'
import UserProfile from './Pages/UserProfile'
import CompanyR2 from './Pages/CompanyR2'
import CompanyR3 from './Pages/CompanyR3'
import ApplicationReceived from './Pages/ApplicationReceived'
import ContactUs from './Pages/ContactUs'
import EditProfile from './Pages/EditProfile.jsx'
import CompanyProfile from './Pages/CompanyProfile.jsx'
import Skill from './Components/Skill'
import CandidateScreening from './Pages/CandidateScreening.jsx'
import PostJob from './Pages/PostJob.jsx'
import CURegister from './Pages/CURegister'
import Admin from './Pages/Admin.jsx'
import ViewApplications from './Pages/ViewApplications'
import CompanyInsight from './Pages/CompanyInsight.jsx'
import Jobs from './Pages/Jobs'
import JobTypeComponents from './Components/JobTypeComponents'



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
          <Route path='/uploadresume' element={<Uploadresume/>}/>
          <Route path='/jobrecommendation' element={<JobRecommendation/>}/>
          <Route path='/companyR1' element={<CompanyR1/>}/>
          <Route path='/messagesinbox' element={<MessagesInbox/>}/>
          <Route path='/userProfile' element= {<UserProfile/>}/>
          <Route path='/companyR2' element={<CompanyR2/>}/>
          <Route path='/companyR3' element={<CompanyR3/>}/>
          <Route path='/applicationreceived' element={<ApplicationReceived/>}/>
          <Route path='/contactus' element={<ContactUs/>}/>
          <Route path='/editProfile' element={<EditProfile/>}/>
          <Route path='/companyprofile' element={<CompanyProfile/>}/>
          <Route path='/postjob' element={<PostJob/>}/>
          <Route path="/registerstaff" element={<CURegister />} />
          <Route path='/admin' element={<Admin/>}/>
          <Route path='/skill' element={<Skill/>}/>
          <Route path='/candidatescreening' element={<CandidateScreening/>}/>
          <Route path='/viewapplications' element={<ViewApplications/>}/>
          <Route path='/companyinsight' element={<CompanyInsight/>}/>
          <Route path='/curegister' element={<CURegister/>}/>
          <Route path='/jobTypeComponents' element={<JobTypeComponents/>}/>
          <Route path='/jobs' element={<Jobs/>}/>
         
        




    
        </Routes>
        </BrowserRouter>
      </div>
    </>
  )
}

export default App
