
import React from "react";
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
import Hotellogo from "../assets/Hotel.jpg";
import Garimalogo from "../assets/Garima.jpg";
import ABlogo from "../assets/AB.jpg";
import Infologo from "../assets/Info.jpg";
import RGlogo from "../assets/RG.jpg";
import Agralogo from "../assets/Agra.jpg";
import Himallogo from "../assets/Himal.jpg";
import ARClogo from "../assets/ARC.jpg";
import Carewindslogo from "../assets/Carewinds.jpg";
import Archiplanlogo from "../assets/Archiplan.jpg";
import Flintlogo from "../assets/Flint.jpg";
import Lotuslogo from "../assets/Lotus.jpg";
import linklogo from "../assets/J.link.jpg";
import Techmindslogo from "../assets/Techminds.jpg";
import Alchilogo from "../assets/Alchi.jpg";
import Winsomelogo from "../assets/Winsome.jpg";
import Header from "../Components/Navbar";
import Footer from "../Components/Footer";

const Companies = () => {
  const topJobs = [
    {
      id: 1,
      company: "UNDP",
      logo: UNDPlogo,
      jobs: ["Country Economist"],
    },
    {
      id: 2,
      company: "Merojob",
      logo: Merojoblogo,
      jobs: ["Sales / Public Relations Jobs"],
    },
    {
      id: 3,
      company: "Generation Next Communications ",
      logo: GenerationNextCommunicationslogo,
      jobs: ["Marketing and Communication (Marcom) Officer"],
    },
    {
      id: 4,
      company: "Zegal ",
      logo: Zegallogo,
      jobs: ["Software Engineer (Frontend)"],
    },
    {
      id: 5,
      company: "Innovative Infinity IT Solution",
      logo: Innovativelogo,
      jobs: ["Marketing Executive"],
    },
    {
      id: 6,
      company: "Modern Servicing",
      logo: Modernlogo,
      jobs: ["Administrator - Visa Specialist"],
    },
    {
      id: 7,
      company: "Apex Legend Development",
      logo: apexlogo,
      jobs: ["Telemarketer"],
    },
    {
      id: 8,
      company: "Evergreen Energy &  Investment Pvt. Ltd.",
      logo: Evergreenlogo,
      jobs: ["Cashier"],
    },
    {
      id: 9,
      company: "Soaltee Hotel Limited",
      logo: Soalteelogo,
      jobs: ["Executive Assistant / Manager Executive Office"],
    },
    {
      id: 10,
      company: "Oracare Periodontal Clinic",
      logo: Oracarelogo,
      jobs: ["Receptionist"],
    },
    {
      id: 11,
      company: "Same Day Courier",
      logo: SameDaylogo,
      jobs: ["Sales Executive (For UK)"],
    },
    {
      id: 12,
      company: "Elite Grand School",
      logo: Secondarylogo,
      jobs: ["Secondary Level Science Teacher"],
    },
    {
      id: 13,
      company: "WorldLink",
      logo: WorldLinklogo,
      jobs: ["Junior Network Administrator"],
    },
    {
      id: 14,
      company: "Renew Holdings",
      logo: Renewlogo,
      jobs: ["Public Relations Officer"],
    },
    {
      id: 15,
      company: "Renew Holdings",
      logo: Renewlogo,
      jobs: ["Solar Engineer"],
    },
    {
      id: 16,
      company: "Maya Metro Hospital Pvt. Ltd.",
      logo: Mayalogo,
      jobs: ["Hospital Manager"],
    },
    {
      id: 17,
      company: "SoonChandi",
      logo: SoonChandilogo,
      jobs: ["Sales Executive"],
    },
    {
      id: 18,
      company: "Renew Holdings",
      logo: Renewlogo,
      jobs: ["Accounts / Admin Officer"],
    },
  ];
  const hotJobs = [
    {
      id: 1,
      company: "Hotel Lotus Gems",
      position: "Receptionist",
      logo: Hotellogo,
    },
    {
      id: 2,
      company: "AB & Associates",
      position: "Accounts Assistant",
      logo: ABlogo,
    },
    {
      id: 3,
      company: "Garima Capital Limited",
      position: "Marketing Manager, Business Analyst",
      logo: Garimalogo,
    },
    {
      id: 4,
      company: "RG Creations Nepal",
      position: "Senior Architect",
      logo: RGlogo,
    },
    {
      id: 5,
      company: "ARC Design Corp",
      position: "Interior Designer",
      logo: ARClogo,
    },
    {
      id: 6,
      company: "InfoDevelopers",
      position: "HR Manager",
      logo: Infologo,
    },
    {
      id: 7,
      company: "Agra Industries",
      position: "Sales and Marketing Executive",
      logo: Agralogo,
    },
    {
      id: 8,
      company: "Himal Trade Link",
      position: "Mechanical Technician",
      logo: Himallogo,
    },
    {
      id: 9,
      company: "Carewinds Medical Solutions",
      position: "Admin Officer",
      logo: Carewindslogo,
    },
    {
      id: 10,
      company: "Hotel Lotus Gems",
      position: "Receptionist",
      logo: Lotuslogo,
    },
    {
      id: 11,
      company: "J.link International Education",
      position: "Receptionist",
      logo: linklogo,
    },
    {
      id: 12,
      company: "Techminds Network",
      position: "Administrative Officer",
      logo: Techmindslogo,
    },
    {
      id: 13,
      company: "Archiplan-SBT",
      position: "Senior Architect",
      logo: Archiplanlogo,
    },
    {
      id: 14,
      company: "Flint Group",
      position: "Loan Associate",
      logo: Flintlogo,
    },
    {
      id: 15,
      company: "Alchi",
      position: "Sales Representative",
      logo: Alchilogo,
    },
    {
      id: 16,
      company: "Winsome English Boarding School",
      position: "Teacher",
      logo: Winsomelogo,
    },
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <div className="w-full max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6">Top Jobs</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {topJobs.map((job) => (
              <div
                key={job.id}
                className="border rounded-2xl p-4 bg-white shadow hover:shadow-md transition duration-300 flex items-center gap-4 h-28"
              >
                <img
                  src={job.logo}
                  alt={job.company}
                  className="w-16 h-16 object-contain rounded"
                />
                <div>
                  <h4 className="text-md font-semibold">{job.company}</h4>
                  {job.jobs.map((position, index) => (
                    <p key={index} className="text-sm text-gray-700">
                      {position}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full max-w-6xl mx-auto px-4 mt-12">
          <h2 className="text-3xl font-bold mb-6">Hot Jobs</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {hotJobs.map((job) => (
              <div
                key={job.id}
                className="border rounded-2xl p-4 bg-white shadow hover:shadow-md transition duration-300 flex items-center gap-4 h-28"
              >
                <img
                  src={job.logo}
                  alt={job.company}
                  className="w-16 h-16 object-contain rounded"
                />
                <div>
                  <h4 className="text-md font-semibold">{job.company}</h4>
                  <p className="text-sm text-gray-700">{job.position}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Companies;
