import React from "react";
import {
  FaClipboardList,
  FaBriefcase,
  FaPlusCircle,
  FaChartBar,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const SidebarMenu = ({
  showApplications = false,
  showJobs = false,
  showPostJob = false,
  showCompanyInsight = false,
            }) => {
  const menuItems = [
    {
      label: "Applications",
      icon: <FaClipboardList />,
      key: "showApplications",
      active: showApplications,
      path: "/applicationreceived",
    },
    {
      label: "Jobs",
      icon: <FaBriefcase />,
      key: "showJobs",
      active: showJobs,
      path: "/jobs",
    },
    {
      label: "Post Job",
      icon: <FaPlusCircle />,
      key: "showPostJob",
      active: showPostJob,
      path: "/postjob",
    },
    {
      label: "Insights",
      icon: <FaChartBar />,
      key: "showCompanyInsight",
      active: showCompanyInsight,
      path: "/companyInsight",
    },
  ];

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 w-64">
      <ul className="space-y-4">
        {menuItems.map((item) => (
          <li
            key={item.key}
            className={`flex items-center gap-3 cursor-pointer px-4 py-2 rounded-lg transition-all duration-200
              ${item.active
                ? "bg-blue-600 text-white"
                : "text-gray-600 hover:bg-blue-100 hover:text-blue-700"
              }`}
          >
            <Link to={item.path} className="flex items-center gap-3 w-full">
              <span className="text-lg">{item.icon}</span>
              <span className="text-sm font-semibold">{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SidebarMenu;
