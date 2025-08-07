import React, { useState, useRef, useEffect } from "react";
import { IoClose, IoAdd } from "react-icons/io5";
import { Award } from "react-feather";

const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [showSkillSuggestions, setShowSkillSuggestions] = useState(false);

  const skillInputRef = useRef(null);

  const predefinedSkills = [
    "Communication",
    "Leadership",
    "Project Management",
    "JavaScript",
    "React",
    "Node.js",
    "Python",
    "Data Analysis",
    "Marketing",
    "Sales",
    "Customer Service",
    "Team Management",
    "Strategic Planning",
    "Problem Solving",
    "Creative Writing",
    "Social Media Marketing",
    "E-Commerce",
    "Community Outreach",
    "Public Speaking",
    "Negotiation",
    "Time Management",
    "Microsoft Office",
    "Adobe Creative Suite",
    "SQL",
    "HTML/CSS",
    "Agile Methodology",
    "Business Development",
    "Content Creation",
    "Digital Marketing",
    "Financial Analysis",
    "Quality Assurance",
    "UX/UI Design",
    "Machine Learning",
    "Cloud Computing",
    "DevOps",
    "TypeScript",
    "Angular",
    "Vue.js",
    "Docker",
    "Kubernetes",
    "AWS",
    "Azure",
    "Google Cloud",
    "MongoDB",
    "PostgreSQL",
    "MySQL",
    "Git",
    "REST APIs",
    "GraphQL",
    "Microservices",
    "Scrum",
    "Kanban",
  ];

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => (document.body.style.overflow = "auto");
  }, [showModal]);

  const openModal = () => {
    setShowModal(true);
    setShowSkillSuggestions(true);
    setSkillInput("");
  };

  const closeModal = () => {
    setShowModal(false);
    setSkillInput("");
    setShowSkillSuggestions(false);
  };

  const filterSkillSuggestions = () => {
    if (!skillInput.trim()) return predefinedSkills.slice(0, 10);

    const input = skillInput.toLowerCase();
    const existingSkills = skills.map((skill) => skill.toLowerCase());

    return predefinedSkills
      .filter(
        (skill) =>
          skill.toLowerCase().includes(input) &&
          !existingSkills.includes(skill.toLowerCase())
      )
      .slice(0, 8);
  };

  const handleSkillInputChange = (e) => {
    const value = e.target.value;
    setSkillInput(value);
  };

  const addSkill = (skillName) => {
    if (
      skillName.trim() &&
      !skills.some(
        (skill) => skill.toLowerCase() === skillName.toLowerCase()
      )
    ) {
      setSkills((prev) => [...prev, skillName.trim()]);
    }
    setSkillInput("");
    skillInputRef.current?.focus();
  };

  const removeSkill = (skillToRemove) => {
    setSkills((prev) => prev.filter((skill) => skill !== skillToRemove));
  };

  const handleSkillKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (skillInput.trim()) {
        addSkill(skillInput);
      }
    }
  };

  const handleSaveSkills = () => {
    closeModal();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        skillInputRef.current &&
        !skillInputRef.current.contains(event.target)
      ) {
        setShowSkillSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div>
      {/* Skills Section Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-gray-600 text-sm">
            Add skills to showcase your expertise and attract relevant opportunities
          </p>
        </div>
        <button
          onClick={openModal}
          className="flex items-center gap-2 px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-full hover:bg-blue-50 transition-colors font-medium"
        >
          <IoAdd size={20} />
          Add skills
        </button>
      </div>

      {/* Skills Display */}
      <div>
        {skills.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Award size={48} className="mx-auto mb-4 text-gray-300" />
            <p className="text-lg mb-2">No skills added yet</p>
            <p>Add skills to showcase your expertise and competencies</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-3">
            {skills.map((skill, index) => (
              <div
                key={index}
                className="group flex items-center gap-2 bg-blue-100 text-blue-800 rounded-full px-4 py-2 text-sm font-medium border border-blue-200 hover:bg-blue-200 transition-colors"
              >
                <span>{skill}</span>
                <button
                  onClick={() => removeSkill(skill)}
                  className="text-blue-600 hover:text-blue-900 opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label={`Remove skill ${skill}`}
                >
                  <IoClose size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-semibold">Add Skills</h3>
              <button
                type="button"
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <IoClose size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 flex-grow overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add Skills
                </label>
                <p className="text-sm text-gray-600 mb-4">
                  Start typing to search for skills or select from suggestions below
                </p>

                {/* Skill Input */}
                <div className="relative mb-6" ref={skillInputRef}>
                  <input
                    type="text"
                    value={skillInput}
                    onChange={handleSkillInputChange}
                    onKeyPress={handleSkillKeyPress}
                    placeholder="Type to search for skills..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                    autoFocus
                  />

                  {/* Skill Suggestions */}
                  {showSkillSuggestions && (
                    <div className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {filterSkillSuggestions().map((skill, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => addSkill(skill)}
                          className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                        >
                          {skill}
                        </button>
                      ))}

                      {skillInput.trim() &&
                        !predefinedSkills
                          .map((s) => s.toLowerCase())
                          .includes(skillInput.trim().toLowerCase()) && (
                          <button
                            type="button"
                            onClick={() => addSkill(skillInput)}
                            className="w-full px-4 py-3 text-left font-semibold text-blue-600 hover:bg-blue-50 border-b border-gray-100 transition-colors"
                          >
                            Add "{skillInput}"
                          </button>
                        )}
                    </div>
                  )}
                </div>

                {/* Display Added Skills */}
                {skills.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">
                      Your Skills ({skills.length})
                    </h4>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {skills.map((skill, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm font-medium"
                        >
                          <span>{skill}</span>
                          <button
                            type="button"
                            onClick={() => removeSkill(skill)}
                            className="text-blue-600 hover:text-blue-900 ml-1"
                            aria-label={`Remove skill ${skill}`}
                          >
                            <IoClose size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-4 p-6 border-t bg-gray-50">
              <button
                onClick={closeModal}
                className="px-6 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSkills}
                className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                Save Skills
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Skills;