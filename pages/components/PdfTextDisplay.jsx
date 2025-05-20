// components/PdfTextDisplay.js
import { useState } from "react";

const PdfTextDisplay = ({ pdfText }) => {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Split text into pages based on "Page X:" markers
  const pages = pdfText
    .split(/Page \d+:/g)
    .filter(page => page.trim().length > 0)
    .map(page => page.trim());
  
  const pageHeaders = pdfText.match(/Page \d+:/g) || [];
  
  // Combine headers with content
  const pdfPages = pageHeaders.map((header, index) => ({
    header: header.replace(':', ''),
    content: pages[index] || ''
  }));
  
  // Filter pages based on search term
  const filteredPages = searchTerm
    ? pdfPages.filter(page => 
        page.content.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : pdfPages;
  
  const highlightSearchTerm = (text) => {
    if (!searchTerm) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  };

  return (
    <div>
      <div className="mb-4">
        <label 
          htmlFor="search" 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Search within PDF
        </label>
        <input
          type="text"
          id="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for text..."
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-3 py-2 text-sm"
        />
      </div>
      
      <div className="space-y-4 mt-4">
        {filteredPages.length > 0 ? (
          filteredPages.map((page, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 bg-white">
              <h3 className="font-semibold text-gray-700 mb-2">{page.header}</h3>
              <div 
                className="text-gray-600 whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: highlightSearchTerm(page.content) }}
              />
            </div>
          ))
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-500">
              {searchTerm 
                ? "No matching text found. Try a different search term." 
                : "No PDF content to display."}
            </p>
          </div>
        )}
      </div>
      
      <div className="mt-4 text-sm text-gray-500">
        {filteredPages.length > 0 && (
          <p>
            {searchTerm 
              ? `Showing ${filteredPages.length} of ${pdfPages.length} pages with matches for "${searchTerm}"`
              : `Displaying all ${pdfPages.length} pages`}
          </p>
        )}
      </div>
    </div>
  );
};

export default PdfTextDisplay;