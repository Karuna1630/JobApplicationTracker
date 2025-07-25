import React, { useState } from "react";
import { FaTrashCan } from "react-icons/fa6";

const Skill = () => {
  const [softSkills, setSoftSkills] = useState([]);
  const [technicalSkills, setTechnicalSkills] = useState([]);
  const [newSkill, setNewSkill] = useState("");
  const [category, setCategory] = useState("technical");

  const addSkill = () => {
    if (!newSkill.trim()) return;

    if (category === "soft") {
      setSoftSkills([...softSkills, newSkill.trim()]);
    } else {
      setTechnicalSkills([...technicalSkills, newSkill.trim()]);
    }

    setNewSkill("");
  };

  const deleteSkill = (skill, type) => {
    if (type === "soft") {
      setSoftSkills(softSkills.filter((s) => s !== skill));
    } else {
      setTechnicalSkills(technicalSkills.filter((s) => s !== skill));
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addSkill();
    }
  };

  return (
    <div className="p-4 border border-gray-300 rounded-md bg-gray-50">
      {/* Add Skill Form */}
      <div className="mb-4">
        <label className="text-sm text-gray-600">Add New Skill</label>
        <div className="flex flex-wrap gap-2 mt-1">
          <input
            type="text"
            className="border px-3 py-1 rounded w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter skill"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border px-3 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="technical">Technical</option>
            <option value="soft">Soft</option>
          </select>
          <button
            onClick={addSkill}
            className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition-colors"
          >
            Add
          </button>
        </div>
      </div>

      {/* Soft Skills */}
      <div className="mt-4">
        <h4 className="text-sm font-semibold text-gray-600 mb-2">Soft Skills</h4>
        {softSkills.length === 0 ? (
          <p className="text-gray-500 italic">No soft skills added.</p>
        ) : (
          <div className="space-y-2">
            {softSkills.map((skill, i) => (
              <div key={i} className="flex justify-between items-center bg-white p-2 rounded border">
                <span className="text-gray-800">{skill}</span>
                <FaTrashCan
                  className="text-red-500 cursor-pointer hover:text-red-700 transition-colors"
                  onClick={() => deleteSkill(skill, "soft")}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Technical Skills */}
      <div className="mt-6">
        <h4 className="text-sm font-semibold text-gray-600 mb-2">Technical Skills</h4>
        {technicalSkills.length === 0 ? (
          <p className="text-gray-500 italic">No technical skills added.</p>
        ) : (
          <div className="space-y-2">
            {technicalSkills.map((skill, i) => (
              <div key={i} className="flex justify-between items-center bg-white p-2 rounded border">
                <span className="text-gray-800">{skill}</span>
                <FaTrashCan
                  className="text-red-500 cursor-pointer hover:text-red-700 transition-colors"
                  onClick={() => deleteSkill(skill, "technical")}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Skill;