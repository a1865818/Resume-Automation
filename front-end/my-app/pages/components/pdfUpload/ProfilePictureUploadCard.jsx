const ProfilePictureUploadCard = ({
    profilePicturePreview,
    profilePictureError,
    onProfilePictureUpload,
    onRemoveProfilePicture
  }) => {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-slate-200/50 p-8 hover:shadow-2xl transition-all duration-300">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Add Profile Picture</h2>
          <p className="text-slate-600">Optional professional headshot for your resume</p>
        </div>
  
        {!profilePicturePreview ? (
          <div className="mb-6">
            <label
              htmlFor="profile-picture-upload"
              className="group flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-slate-300 rounded-2xl cursor-pointer bg-slate-50/50 hover:bg-slate-100/50 transition-all duration-300"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  className="w-12 h-12 mb-4 text-slate-400 group-hover:text-purple-500 transition-colors duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  ></path>
                </svg>
                <p className="mb-2 text-lg font-semibold text-slate-700 group-hover:text-purple-600 transition-colors duration-300">
                  Upload your photo
                </p>
                <p className="text-sm text-slate-500">JPG, PNG files only (Max 5MB)</p>
              </div>
              <input 
                id="profile-picture-upload" 
                type="file" 
                className="hidden" 
                accept="image/*" 
                onChange={onProfilePictureUpload} 
              />
            </label>
          </div>
        ) : (
          <div className="mb-6">
            <div className="relative group">
              <img
                src={profilePicturePreview}
                alt="Profile preview"
                className="w-full h-64 object-cover rounded-2xl border-2 border-slate-200"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl flex items-center justify-center">
                <button
                  onClick={onRemoveProfilePicture}
                  className="bg-red-500 text-white p-3 rounded-full hover:bg-red-600 transition-colors duration-200"
                  title="Remove image"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                  </svg>
                  <span className="text-green-800 font-medium">Photo uploaded successfully!</span>
                </div>
                <button
                  onClick={() => document.getElementById('profile-picture-upload').click()}
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                >
                  Change Photo
                </button>
              </div>
              <input 
                id="profile-picture-upload" 
                type="file" 
                className="hidden" 
                accept="image/*" 
                onChange={onProfilePictureUpload} 
              />
            </div>
          </div>
        )}
        
        {profilePictureError && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
              </svg>
              <span className="text-red-800">{profilePictureError}</span>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  export default ProfilePictureUploadCard;