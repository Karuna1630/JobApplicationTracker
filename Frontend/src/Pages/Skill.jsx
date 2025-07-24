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

  return (
    <div className="p-4 border border-gray-300 rounded-md bg-white">
      {/* Add Skill Form */}
      <div className="mb-4">
        <label className="text-sm text-gray-600">Add New Skill</label>
        <div className="flex flex-wrap gap-2 mt-1">
          <input
            type="text"
            className="border px-3 py-1 rounded w-1/3"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder="Enter skill"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border px-3 py-1 rounded"
          >
            <option value="technical">Technical</option>
            <option value="soft">Soft</option>
          </select>
          <button
            onClick={addSkill}
            className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
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
          <ul className="list-disc ml-6 text-gray-800">
            {softSkills.map((skill, i) => (
              <li key={i} className="flex justify-between items-center">
                {skill}
                <FaTrashCan
                  className="text-red-500 cursor-pointer"
                  onClick={() => deleteSkill(skill, "soft")}
                />
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Technical Skills */}
      <div className="mt-6">
        <h4 className="text-sm font-semibold text-gray-600 mb-2">Technical Skills</h4>
        {technicalSkills.length === 0 ? (
          <p className="text-gray-500 italic">No technical skills added.</p>
        ) : (
          <ul className="list-disc ml-6 text-gray-800">
            {technicalSkills.map((skill, i) => (
              <li key={i} className="flex justify-between items-center">
                {skill}
                <FaTrashCan
                  className="text-red-500 cursor-pointer"
                  onClick={() => deleteSkill(skill, "technical")}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Skill;
