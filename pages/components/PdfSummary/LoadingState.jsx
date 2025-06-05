
const LoadingState = ({ profilePicturePreview }) => {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
        <p className="text-gray-600">Generating professional resume with Gemini AI...</p>
        {profilePicturePreview && (
          <p className="text-gray-500 text-sm mt-2">Including your uploaded profile picture...</p>
        )}
      </div>
    );
  };
  
  export default LoadingState;