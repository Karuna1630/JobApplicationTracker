import React from 'react';
import UNDPlogo from "../assets/UNDP_logo.svg.png";
import Merojoblogo from "../assets/Merojob.jpg";
import GenerationNextCommunicationslogo from "../assets/GNC.jpg"; 
import Zegallogo from "../assets/Zegal.jpg";
import Innovativelogo from "../assets/Innovative.jpg";
import apexlogo from "../assets/apex.jpg";
import Modernlogo from "../assets/Modern.jpg";
import Evergreenlogo from "../assets/Evergreen.jpg";
import SameDaylogo from "../assets/SameDay.jpg";
import Soalteelogo from "../assets/Soaltee.jpg";
import Oracarelogo from "../assets/Oracare.jpg";
import Renewlogo from "../assets/Renew.jpg";
import Secondarylogo from "../assets/Secondary.jpg";
import Mayalogo from "../assets/Maya.jpg";
import SoonChandilogo from "../assets/SoonChandi.jpg";
import WorldLinklogo from "../assets/WorldLink.jpg";
import Header from '../Components/Header';
import Footer from '../Components/Footer';




const Home = () => {
  const topJobs = [
    {
      id: 1,
      company: "UNDP",
      logo: UNDPlogo,
      jobs: ["Country Economist"]
    },
    {
      id: 2,
      company: "Merojob",
      logo: Merojoblogo,
      jobs: ["Sales / Public Relations Jobs"]
    },
    {
      id: 3,
      company: "Generation Next Communications ",
      logo: GenerationNextCommunicationslogo,
      jobs: ["Marketing and Communication (Marcom) Officer"]
    },
    {
      id: 4,
      company: "Zegal ",
      logo: Zegallogo,
      jobs: ["Software Engineer (Frontend)"]
    },
    {
      id: 5,
      company: "Innovative Infinity IT Solution",
      logo: Innovativelogo,
      jobs: ["Marketing Executive"]
    },
    {
      id: 6,
      company: "Modern Servicing",
      logo: Modernlogo,
      jobs: ["Administrator - Visa Specialist"]
    },
    {
      id: 7,
      company: "Apex Legend Development",
      logo: apexlogo,
      jobs: ["Telemarketer"]
    },
    {
      id: 8,
      company: "Evergreen Energy &  Investment Pvt. Ltd.",
      logo: Evergreenlogo,
      jobs: ["Cashier"]
    },
    {
      id: 9,
      company: "Soaltee Hotel Limited",
      logo: Soalteelogo,
      jobs: ["Executive Assistant / Manager Executive Office"]
    },
    {
      id: 10,
      company: "Oracare Periodontal Clinic",
      logo: Oracarelogo,
      jobs: ["Receptionist"]
    },
    {
      id: 11,
      company: "Same Day Courier",
      logo: SameDaylogo,
      jobs: ["Sales Executive (For UK)"]
    },
    {
      id: 12,
      company: "Elite Grand School",
      logo: Secondarylogo,
      jobs: ["Secondary Level Science Teacher"]
    },
    {
      id: 13,
      company: "WorldLink",
      logo: WorldLinklogo,
      jobs: ["Junior Network Administrator"]
    },
    {
      id: 14,
      company: "Renew Holdings",
      logo: Renewlogo,
      jobs: ["Public Relations Officer"]
    },
    {
      id: 15,
      company: "Renew Holdings",
      logo: Renewlogo,
      jobs: ["Solar Engineer"]
    },
    {
      id: 16,
      company: "Maya Metro Hospital Pvt. Ltd.",
      logo: Mayalogo,
      jobs: ["Hospital Manager"]
    },
    {
      id: 17,
      company: "SoonChandi",
      logo: SoonChandilogo,
      jobs: ["Sales Executive"]
    },
    {
      id: 18,
      company: "Renew Holdings",
      logo: Renewlogo,
      jobs: ["Accounts / Admin Officer"]
    }
  ];

 return (   
  <>
  <Header/>
    {/* Main content container with same horizontal padding as header */}
  <div className="p-6 min-h-screen bg-gray-100 px-14 flex flex-col items-start">
    <h2 className="text-3xl font-bold mb-6">Top Jobs</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-6xl">
      {topJobs.map((job) => (
        <div
          key={job.id}
          className="border rounded-2xl p-4 bg-white shadow hover:shadow-md transition duration-300 flex flex-col items-center text-center"
        >
          <img src={job.logo} alt={job.company} className="w-20 h-20 object-contain mb-2" />
          <h4 className="text-lg font-semibold mb-1">{job.company}</h4>
          <ul className="text-gray-700 text-sm">
            {job.jobs.map((position, index) => (
              <li key={index}>• {position}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </div>
 <Footer/>
  </>
  );
};

export default Home;
