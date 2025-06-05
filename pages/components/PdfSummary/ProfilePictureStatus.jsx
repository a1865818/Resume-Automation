// components/pdfSummary/ProfilePictureStatus.js
const ProfilePictureStatus = ({ profilePicturePreview, isUploadingImage }) => {
    if (!profilePicturePreview && !isUploadingImage) return null;
  
    return (
      <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            {isUploadingImage ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            ) : (
              <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            )}
          </div>
          <div className="ml-3 flex items-center space-x-4">
            <div>
              <p className="text-sm font-medium text-blue-800">
                {isUploadingImage ? 'Uploading profile picture...' : 'Profile picture ready'}
              </p>
              <p className="text-sm text-blue-600">
                {isUploadingImage ? 'Please wait while we process your image.' : 'Your profile picture will be included in the generated resume.'}
              </p>
            </div>
            {profilePicturePreview && !isUploadingImage && (
              <img 
                src={profilePicturePreview} 
                alt="Profile preview" 
                className="w-12 h-12 object-cover rounded-lg border-2 border-blue-200"
              />
            )}
          </div>
        </div>
      </div>
    );
  };
  
  export default ProfilePictureStatus