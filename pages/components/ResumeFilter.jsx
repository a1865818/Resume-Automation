// components/ResumeFilter.js
import { useState } from 'react';

const ResumeFilter = ({ onFilter }) => {
  const [filters, setFilters] = useState({
    industry: '',
    location: '',
    experience: '',
    seniority: '',
    skill: ''
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter(filters);
  };
  
  const clearFilters = () => {
    setFilters({
      industry: '',
      location: '',
      experience: '',
      seniority: '',
      skill: ''
    });
    onFilter({});
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <h2 className="text-lg font-semibold mb-4">Filter Resumes</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">
              Industry
            </label>
            <input
              type="text"
              id="industry"
              name="industry"
              value={filters.industry}
              onChange={handleChange}
              placeholder="e.g. Technology, Finance"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm"
            />
          </div>
          
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={filters.location}
              onChange={handleChange}
              placeholder="e.g. New York, Remote"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm"
            />
          </div>
          
          <div>
            <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
              Minimum Years Experience
            </label>
            <select
              id="experience"
              name="experience"
              value={filters.experience}
              onChange={handleChange}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm"
            >
              <option value="">Any Experience</option>
              <option value="1">1+ Years</option>
              <option value="2">2+ Years</option>
              <option value="3">3+ Years</option>
              <option value="5">5+ Years</option>
              <option value="8">8+ Years</option>
              <option value="10">10+ Years</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="seniority" className="block text-sm font-medium text-gray-700 mb-1">
              Seniority Level
            </label>
            <select
              id="seniority"
              name="seniority"
              value={filters.seniority}
              onChange={handleChange}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm"
            >
              <option value="">Any Level</option>
              <option value="Junior">Junior</option>
              <option value="Mid-level">Mid-level</option>
              <option value="Senior">Senior</option>
            </select>
          </div>
          
          <div className="md:col-span-2">
            <label htmlFor="skill" className="block text-sm font-medium text-gray-700 mb-1">
              Skills
            </label>
            <input
              type="text"
              id="skill"
              name="skill"
              value={filters.skill}
              onChange={handleChange}
              placeholder="e.g. JavaScript, Python, Marketing"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm"
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={clearFilters}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium rounded-md"
          >
            Clear
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md"
          >
            Apply Filters
          </button>
        </div>
      </form>
    </div>
  );
};

export default ResumeFilter;