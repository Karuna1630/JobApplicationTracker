import React from "react";
import { Link } from "react-router-dom";

const UserSidebarMenu = ({
    showMyProfile = false,
    showMyStatus = false,
}) => {
    const menuItems = [
        {
            label: "My Status",
            key: "showMyStatus",
            active: showMyStatus,
            path: "/myStatus",
        },
        {
            label: "My Profile",
            key: "showMyProfile",
            active: showMyProfile,
            path: "/userProfile",
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
                            <span className="text-sm font-semibold">{item.label}</span>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserSidebarMenu;
