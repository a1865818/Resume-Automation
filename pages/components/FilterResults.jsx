// components/FilterResults.js
import CandidateCard from "./CandidateCard";

const FilterResults = ({ candidates }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Matching Candidates</h2>
        <span className="text-gray-500 text-sm">
          {candidates.length} {candidates.length === 1 ? "result" : "results"}{" "}
          found
        </span>
      </div>

      {candidates.length > 0 ? (
        <div className="space-y-4">
          {candidates.map((candidate) => (
            <CandidateCard key={candidate.id} candidate={candidate} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No candidates found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your filters to find more candidates.
          </p>
        </div>
      )}
    </div>
  );
};

export default FilterResults;
