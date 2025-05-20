// components/CandidateFilterForm.js
import { useState } from "react";
import FormSection from "./FormSection.jsx";
import RangeInput from "./inputs/RangeInput.jsx";
import SelectInput from "./inputs/SelectInput.jsx";
import SkillsInput from "./inputs/SkillsInput.jsx";
import TextInput from "./inputs/TextInput.jsx";

const CandidateFilterForm = ({ onFilter }) => {
  const [formData, setFormData] = useState({
    location: "",
    minExperience: "",
    title: "",
    education: "",
    skills: [],
  });

  const handleChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter(formData);
  };

  const resetForm = () => {
    setFormData({
      location: "",
      minExperience: "",
      title: "",
      education: "",
      skills: [],
    });
    onFilter({
      location: "",
      minExperience: "",
      title: "",
      education: "",
      skills: [],
    });
  };

  const educationOptions = [
    { value: "", label: "Any Education" },
    { value: "High School", label: "High School" },
    { value: "Associates", label: "Associates Degree" },
    { value: "Bachelors", label: "Bachelors Degree" },
    { value: "Masters", label: "Masters Degree" },
    { value: "PhD", label: "PhD" },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6">Filter Candidates</h2>

      <form onSubmit={handleSubmit}>
        <FormSection title="Location">
          <TextInput
            label="Location"
            name="location"
            value={formData.location}
            onChange={(value) => handleChange("location", value)}
            placeholder="Enter city, state, or country"
          />
        </FormSection>

        <FormSection title="Job Details">
          <TextInput
            label="Job Title"
            name="title"
            value={formData.title}
            onChange={(value) => handleChange("title", value)}
            placeholder="Enter job title"
          />

          <RangeInput
            label="Minimum Experience (years)"
            name="minExperience"
            value={formData.minExperience}
            onChange={(value) => handleChange("minExperience", value)}
            min={0}
            max={20}
          />
        </FormSection>

        <FormSection title="Qualifications">
          <SelectInput
            label="Education Level"
            name="education"
            value={formData.education}
            onChange={(value) => handleChange("education", value)}
            options={educationOptions}
          />

          <SkillsInput
            label="Required Skills"
            value={formData.skills}
            onChange={(value) => handleChange("skills", value)}
          />
        </FormSection>

        <div className="mt-8 flex space-x-4">
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md font-medium transition duration-150 ease-in-out"
          >
            Apply Filters
          </button>

          <button
            type="button"
            onClick={resetForm}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md font-medium transition duration-150 ease-in-out"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default CandidateFilterForm;
