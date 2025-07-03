import React, { useState } from "react";
import { FiEdit } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import AnshuImage from "../assets/Anshu.jpg";
import BackgroundImage from "../assets/background.avif";

const suggestedSkills = [
  "Engineering",
  "Project Management",
  "English",
  "Research Skills",
  "Training",
  "Communication",
  "Strategy",
  "Amazon Web Services (AWS)",
  "Analytical Skills",
  "Finance",
];

const UserProfile = () => {
  const [showFullExperience, setShowFullExperience] = useState(false);
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("");
  const [softSkills, setSoftSkills] = useState([]);
  const [resumeFile, setResumeFile] = useState(null);

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white flex items-center justify-center p-6">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg overflow-hidden relative">
        {/* Banner */}
        <div
          className="h-56 flex items-end justify-between px-6 py-4 relative bg-cover bg-center"
          style={{ backgroundImage: `url(${BackgroundImage})` }}
        >
          <div className="absolute inset-0 bg-black opacity-40"></div>
        </div>

        {/* Top Right Buttons */}
        <div className="absolute top-64 right-4 flex gap-2 z-20">
          <button className="bg-blue-600 hover:bg-blue-900 text-white text-sm font-medium px-4 border rounded-md shadow-lg">
            Add profile section
          </button>
          <button className="bg-white hover:bg-gray-100 text-sm font-medium px-3 py-1.5 border border-gray-300 rounded-md shadow-sm">
            More
          </button>
          <button
            onClick={() => navigate("/editCompanyProfile")}
            className="bg-white hover:bg-gray-100 text-gray-700 p-2 border border-gray-300 rounded-full shadow"
            title="Edit Profile"
          >
            <FiEdit className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Picture */}
        <div className="absolute top-32 left-8 z-20">
          <img
            src={AnshuImage}
            className="w-40 h-40 rounded-full border-4 border-white shadow-md"
            alt="Profile"
          />
        </div>

        {/* Header */}
        <div className="pt-28 px-8 pb-8 relative z-30">
          <h2 className="text-3xl font-semibold text-gray-800">Anshu Karki</h2>
          <p className="text-base text-gray-600 mt-2">Frontend Developer | UI/UX Specialist</p>
        </div>

        {/* Body */}
        <div className="px-12 pb-12 space-y-8 relative z-30">
          {/* Contact */}
          <section>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Contact Information</h3>
            <ul className="space-y-2 text-gray-600 text-lg">
              <li><strong>Email:</strong> example@email.com</li>
              <li><strong>Phone:</strong> 123-456-7890</li>
              <li><strong>Location:</strong> Belbari, Nepal</li>
            </ul>
          </section>

          {/* Experience */}
          <section>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Experience Summary</h3>
            <p className={`text-gray-700 leading-relaxed text-lg transition-all duration-300 ease-in-out ${showFullExperience ? "" : "line-clamp-3"}`}>
              Over 2 years of experience building modern, scalable, and user-centric web applications using
              React, TypeScript, and other cutting-edge technologies. Worked in dynamic startup environments
              solving real-world problems through design-focused engineering. Passionate about building accessible,
              high-performance interfaces that create real value for users.
            </p>
            <button
              onClick={() => setShowFullExperience(!showFullExperience)}
              className="mt-3 text-base text-indigo-600 hover:underline"
            >
              {showFullExperience ? "See Less" : "See More"}
            </button>
          </section>

          {/* Education */}
          <section>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xl font-semibold text-gray-800">Education</h3>
              <span className="text-2xl text-gray-500 cursor-pointer hover:text-gray-700">+</span>
            </div>
            <img className="w-full rounded-lg shadow-md" />
          </section>

          {/* Skills */}
          <section>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Skills</h3>
            <p className="text-gray-600 text-sm mb-4">Skills data to fill their roles</p>
            <div className="border-t border-b border-gray-200 py-4">
              <p className="text-gray-500 mb-2">Soft skills</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {softSkills.length > 0 ? (
                  softSkills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-gray-400">No skills added yet.</p>
                )}
              </div>
              <hr className="my-2 border-gray-200" />
              <p className="text-gray-500">Technical skills</p>
            </div>
            <div className="pt-4">
              <button
                onClick={() => setShowSkillModal(true)}
                className="px-4 py-2 border border-blue-500 text-blue-600 rounded-full hover:bg-blue-50 text-sm"
              >
                Add skills
              </button>
            </div>
          </section>

          {/* Upload Resume */}
          <section className="border-t border-gray-200 pt-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">📄 Upload Resume</h3>
            <p className="text-sm text-gray-600 mb-4">
              Upload your latest CV or resume to share with recruiters.
            </p>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              className="block w-full text-sm text-gray-700 border border-gray-300 rounded-md cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setResumeFile(file);
                  console.log("Resume uploaded:", file.name);
                }
              }}
            />
            {resumeFile && (
              <p className="mt-2 text-sm text-green-600">
                Selected: {resumeFile.name}
              </p>
            )}
          </section>
        </div>
      </div>

      {/* Skill Modal */}
      {showSkillModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-2xl rounded-lg shadow-lg p-6 relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Add Skill</h2>
              <button
                onClick={() => {
                  setShowSkillModal(false);
                  setSelectedSkill("");
                }}
                className="text-gray-500 text-2xl hover:text-gray-700"
              >
                ×
              </button>
            </div>

            <label className="block text-sm font-medium mb-2">Skill*</label>
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              placeholder="Skill (ex: Project Management)"
              className="w-full border border-gray-300 px-4 py-2 rounded-md mb-4"
            />

            <div>
              <p className="font-semibold mb-2">Suggested based on your profile</p>
              <div className="flex flex-wrap gap-3">
                {suggestedSkills.map((skill) => (
                  <span
                    key={skill}
                    onClick={() => setSelectedSkill(skill)}
                    className={`px-4 py-2 border rounded-full text-sm cursor-pointer ${
                      selectedSkill === skill
                        ? "bg-blue-100 text-blue-700 border-blue-500"
                        : "text-gray-700 border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setShowSkillModal(false)}
                className="px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (selectedSkill && !softSkills.includes(selectedSkill)) {
                    setSoftSkills([...softSkills, selectedSkill]);
                  }
                  setShowSkillModal(false);
                  setSelectedSkill("");
                  setSkillInput("");
                }}
                className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
