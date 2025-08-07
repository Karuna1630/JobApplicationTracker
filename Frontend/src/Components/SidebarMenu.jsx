import React from "react";
import {
  FaClipboardList,
  FaBriefcase,
  FaPlusCircle,
  FaChartBar,
} from "react-icons/fa";

const SidebarMenu = ({
  showApplications = false,
  setShowApplications = () => {},
  showJobs = false,
  setShowJobs = () => {},
  showPostJob = false,
  setShowPostJob = () => {},
  showCompanyInsight = false,
  setShowCompanyInsight = () => {},
}) => {
  const menuItems = [
    {
      label: "Applications",
      icon: <FaClipboardList />,
      key: "showApplications",
      active: showApplications,
      onClick: () => {
        setShowApplications(true);
        setShowJobs(false);
        setShowPostJob(false);
        setShowCompanyInsight(false);
      },
    },
    {
      label: "Jobs",
      icon: <FaBriefcase />,
      key: "showJobs",
      active: showJobs,
      onClick: () => {
        setShowApplications(false);
        setShowJobs(true);
        setShowPostJob(false);
        setShowCompanyInsight(false);
      },
    },
    {
      label: "Post Job",
      icon: <FaPlusCircle />,
      key: "showPostJob",
      active: showPostJob,
      onClick: () => {
        setShowApplications(false);
        setShowJobs(false);
        setShowPostJob(true);
        setShowCompanyInsight(false);
      },
    },
    {
      label: "Insights",
      icon: <FaChartBar />,
      key: "showCompanyInsight",
      active: showCompanyInsight,
      onClick: () => {
        setShowApplications(false);
        setShowJobs(false);
        setShowPostJob(false);
        setShowCompanyInsight(true);
      },
    },
  ];

  return (
    <div className="  bg-blue-900  text-white w-full md:w-1/5 lg:w-1/6 px-4 py-6">
      <ul className="space-y-4">
        {menuItems.map((item) => (
          <li
            key={item.key}
            className={`flex items-center gap-3 px-4 py-2 rounded-md cursor-pointer transition ${
              item.active
                ? "bg-blue-600 text-white"
                : "hover:bg-blue-700 hover:text-white text-gray-300"
            }`}
            onClick={item.onClick}
          >
            {item.icon}
            <span className="text-sm font-medium">{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SidebarMenu;
