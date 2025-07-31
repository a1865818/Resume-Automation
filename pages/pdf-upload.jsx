import { useState } from "react";
import Layout from "./components/Layout";
import PdfSummary from "./components/PdfSummary/PdfSummary";
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
    let file = null;
    let extractedText = null;

    // If event.target.files exists, it's a real file input event (PDF)
    if (event.target && event.target.files && event.target.files[0]) {
      file = event.target.files[0];
    }
    // If event.target.value exists, it's a synthetic event from Word extraction
    else if (event.target && event.target.value && event.target.file) {
      file = event.target.file;
      extractedText = event.target.value;
    } else {
      setError("No file selected or invalid upload event.");
      return;
    }

    // If we already have extracted text (Word), just set it
    if (extractedText) {
      setFileName(file.name);
      setPdfText(extractedText);
      setError("");
      setIsLoading(false);
      return;
    }

    // Otherwise, process as PDF using enhanced function with OCR support
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
        useComprehensiveOCR: true, // Use the comprehensive OCR approach (same as testComprehensiveOCR)
        preferGemini: true, // Use Tesseract + Gemini skills detection
        fallbackToTesseract: true, // Fallback to Tesseract if Gemini fails
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

      {/* PdfSummary Component - Only show when PDF is processed */}
      {pdfText && (
        <div className="w-full">
          <PdfSummary 
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