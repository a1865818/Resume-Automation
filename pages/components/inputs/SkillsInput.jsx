// components/inputs/SkillsInput.js
import { useState } from "react";

const SkillsInput = ({ label, value, onChange }) => {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      if (!value.includes(inputValue.trim())) {
        const newSkills = [...value, inputValue.trim()];
        onChange(newSkills);
      }
      setInputValue("");
    }
  };

  const removeSkill = (skillToRemove) => {
    const newSkills = value.filter((skill) => skill !== skillToRemove);
    onChange(newSkills);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="flex flex-wrap gap-2 mb-2">
        {value.map((skill, index) => (
          <div
            key={index}
            className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-1 rounded flex items-center"
          >
            {skill}
            <button
              type="button"
              className="ml-1.5 text-indigo-600 hover:text-indigo-900"
              onClick={() => removeSkill(skill)}
            >
              <svg
                className="w-3 h-3"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
          </div>
        ))}
      </div>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type skill and press Enter"
        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-3 py-2 text-sm"
      />
      <p className="mt-1 text-xs text-gray-500">Press Enter to add a skill</p>
    </div>
  );
};

export default SkillsInput;
