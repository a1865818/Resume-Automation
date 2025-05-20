// pages/index.js
import { useState } from "react";
import CandidateFilterForm from "./components/CandidateFilterForm";
import FilterResults from "./components/FilterResults";
import Layout from "./components/Layout";

// Mock data for demonstration
const mockCandidates = [
  {
    id: 1,
    name: "Jane Doe",
    location: "New York",
    experience: 5,
    title: "Software Engineer",
    education: "Masters",
  },
  {
    id: 2,
    name: "John Smith",
    location: "San Francisco",
    experience: 3,
    title: "Product Manager",
    education: "Bachelors",
  },
  {
    id: 3,
    name: "Emily Johnson",
    location: "Chicago",
    experience: 7,
    title: "Data Scientist",
    education: "PhD",
  },
  {
    id: 4,
    name: "Michael Brown",
    location: "Boston",
    experience: 2,
    title: "UI Designer",
    education: "Bachelors",
  },
  {
    id: 5,
    name: "Sarah Williams",
    location: "Seattle",
    experience: 4,
    title: "Full Stack Developer",
    education: "Masters",
  },
];

export default function Home() {
  const [filters, setFilters] = useState({
    location: "",
    minExperience: "",
    title: "",
    education: "",
    skills: [],
  });

  const [filteredCandidates, setFilteredCandidates] = useState(mockCandidates);

  const handleFilter = (formData) => {
    setFilters(formData);

    // Filter candidates based on form data
    const filtered = mockCandidates.filter((candidate) => {
      // Location filter
      if (
        formData.location &&
        !candidate.location
          .toLowerCase()
          .includes(formData.location.toLowerCase())
      ) {
        return false;
      }

      // Experience filter
      if (
        formData.minExperience &&
        candidate.experience < parseInt(formData.minExperience)
      ) {
        return false;
      }

      // Title filter
      if (
        formData.title &&
        !candidate.title.toLowerCase().includes(formData.title.toLowerCase())
      ) {
        return false;
      }

      // Education filter
      if (formData.education && candidate.education !== formData.education) {
        return false;
      }

      // All filters passed
      return true;
    });

    setFilteredCandidates(filtered);
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">
          Find Your Ideal Candidate
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <CandidateFilterForm onFilter={handleFilter} />
          </div>
          <div className="lg:col-span-2">
            <FilterResults candidates={filteredCandidates} />
          </div>
        </div>
      </div>
    </Layout>
  );
}
