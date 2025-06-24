import React from "react";
import { FiMail } from "react-icons/fi";
import { FaRegCheckCircle } from "react-icons/fa";

const messages = [
  {
    name: "Sarah Johnson",
    message:
      "Thank you for considering my application. I wanted to follow up on the next steps...",
    time: "2 hours ago",
  },
  {
    name: "Michael Chen",
    message:
      "I’ve attached my portfolio as requested. Looking forward to hearing from you...",
    time: "1 day ago",
  },
  {
    name: "Emily Rodriguez",
    message:
      "Confirming our interview scheduled for tomorrow at 2 PM. Should I prepare anything specific?",
    time: "2 days ago",
  },
  {
    name: "Alex Thompson",
    message:
      "Thank you for the feedback on my technical assessment. I’ve made the requested changes...",
    time: "3 days ago",
  },
  {
    name: "Lisa Wang",
    message:
      "I’m very interested in the Product Manager position. When can we schedule a call?",
    time: "1 week ago",
  },
];

// Helper to get user initials
const getInitials = (name) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

const MessagesInbox = () => {
  return (
    <div className="bg-gradient-to-br from-blue-100 via-white to-blue-300 flex justify-center items-start px-6 py-12">
      <div className="bg-white w-full max-w-3xl p-8 rounded-xl shadow-md">
        {/* Header */}
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Messages & Inbox</h2>
        <p className="text-gray-500 text-sm mb-6">
          Communication with candidates and team
        </p>

        {/* Message List */}
        <div className="space-y-3">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 flex items-start gap-3 hover:shadow-md transition"
            >
              {/* Avatar */}
              <div className="w-10 h-10 flex items-center justify-center bg-blue-200 text-blue-800 rounded-full font-semibold text-sm">
                {getInitials(msg.name)}
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <p className="font-semibold text-gray-800">{msg.name}</p>
                  <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
                    {msg.time}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {msg.message}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="mt-8 flex gap-3">
          <button className="flex items-center gap-2 bg-blue-800 hover:bg-blue-600 text-white px-5 py-2.5 text-sm rounded-md transition">
            <FiMail />
            Compose Message
          </button>
          <button className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-5 py-2.5 text-sm rounded-md transition">
            <FaRegCheckCircle />
            Mark all as Read
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessagesInbox;
