
import PdfUploadCard from './PdfUploadCard';
import ProfilePictureUploadCard from './ProfilePictureUploadCard';

const UploadSection = ({
  fileName,
  error,
  profilePicturePreview,
  profilePictureError,
  onFileUpload,
  onProfilePictureUpload,
  onRemoveProfilePicture,
  ocrProgress = null,
  isOCRProcessing = false
}) => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <PdfUploadCard
          fileName={fileName}
          error={error}
          onFileUpload={onFileUpload}
          ocrProgress={ocrProgress}
          isOCRProcessing={isOCRProcessing}
        />

        <ProfilePictureUploadCard
          profilePicturePreview={profilePicturePreview}
          profilePictureError={profilePictureError}
          onProfilePictureUpload={onProfilePictureUpload}
          onRemoveProfilePicture={onRemoveProfilePicture}
        />
      </div>
    </div>
  );
};

export default UploadSection;