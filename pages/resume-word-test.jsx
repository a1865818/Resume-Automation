import { useState } from "react";
import Layout from "./components/Layout";
import PdfSummaryTable from "./components/ResumeTest/PdfSummaryTable";
import HeroSection from "./components/pdfUpload/HeroSection";
import LoadingSection from "./components/pdfUpload/LoadingSection";
import UploadSection from "./components/pdfUpload/UploadSection";

export default function PdfUpload() {
  const [pdfText, setPdfText] = useState("");
  const [fileName, setFileName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  // New states for profile picture
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState("");
  const [profilePictureError, setProfilePictureError] = useState("");

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check if the file is a PDF
    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file");
      return;
    }

    setFileName(file.name);
    setIsLoading(true);
    setError("");
    setPdfText("");

    try {
      // Read the file as ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();
      
      // Use pdf.js to parse the PDF and extract text
      const pdfjsLib = window.pdfjsLib;
      // Set workerSrc to cdn
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
      
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      
      // Extract text from all pages
      let extractedText = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(" ");
        extractedText += `Page ${i}:\n${pageText}\n\n`;
      }
      
      setPdfText(extractedText);
    } catch (err) {
      console.error('Error processing PDF:', err);
      setError("Error processing PDF. Please try again with a different file.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfilePictureUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check if the file is an image
    if (!file.type.startsWith('image/')) {
      setProfilePictureError("Please upload an image file (JPG, PNG, etc.)");
      return;
    }

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setProfilePictureError("Image file size should be less than 5MB");
      return;
    }

    setProfilePictureError("");
    
    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setProfilePicturePreview(previewUrl);
    setProfilePicture(file);
  };

  const removeProfilePicture = () => {
    if (profilePicturePreview) {
      URL.revokeObjectURL(profilePicturePreview);
    }
    setProfilePicture(null);
    setProfilePicturePreview("");
    setProfilePictureError("");
    
    // Reset the file input
    const fileInput = document.getElementById('profile-picture-upload');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  return (
    <Layout>
      <HeroSection />

      <UploadSection
        fileName={fileName}
        error={error}
        profilePicturePreview={profilePicturePreview}
        profilePictureError={profilePictureError}
        onFileUpload={handleFileUpload}
        onProfilePictureUpload={handleProfilePictureUpload}
        onRemoveProfilePicture={removeProfilePicture}
      />

      {isLoading && <LoadingSection />}

      {/* PdfSummaryTable Component - Only show when PDF is processed */}
      {pdfText && (
        <div className="w-full">
          <PdfSummaryTable 
            pdfText={pdfText} 
            fileName={fileName} 
            profilePicture={profilePicture}
            profilePicturePreview={profilePicturePreview}
          />
        </div>
      )}
    </Layout>
  );
}