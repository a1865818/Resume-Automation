import { useState } from "react";
import Layout from "./components/Layout";
import PdfSummaryTable from "./components/ResumeTest/PdfSummaryTable";
import HeroSection from "./components/pdfUpload/HeroSection";
import LoadingSection from "./components/pdfUpload/LoadingSection";
import UploadSection from "./components/pdfUpload/UploadSection";
import { extractTextFromPDF } from "./utils/pdfUtils";

export default function PdfUpload() {
  const [pdfText, setPdfText] = useState("");
  const [fileName, setFileName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  // New states for profile picture
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState("");
  const [profilePictureError, setProfilePictureError] = useState("");
  
  // New states for OCR progress
  const [ocrProgress, setOcrProgress] = useState(null);
  const [isOCRProcessing, setIsOCRProcessing] = useState(false);

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
    setOcrProgress(null);
    setIsOCRProcessing(false);

    try {
      // Use the enhanced extractTextFromPDF function with OCR support
      const extractedText = await extractTextFromPDF(file, {
        useOCR: true,
        verbose: true,
        progressCallback: (progress) => {
          console.log(`Processing page ${progress.current}/${progress.total} - ${progress.stage}`);
          setOcrProgress(progress);
          if (progress.stage === 'ocr') {
            setIsOCRProcessing(true);
          }
        }
      });
      
      setPdfText(extractedText);
    } catch (err) {
      console.error('Error processing PDF:', err);
      setError("Error processing PDF. Please try again with a different file.");
    } finally {
      setIsLoading(false);
      setIsOCRProcessing(false);
      setOcrProgress(null);
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
        ocrProgress={ocrProgress}
        isOCRProcessing={isOCRProcessing}
      />

      {isLoading && <LoadingSection progress={ocrProgress} isOCR={isOCRProcessing} />}

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