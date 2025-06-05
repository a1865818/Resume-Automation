const LoadingSection = () => {
    return (
      <div className="flex justify-center my-12">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600/20 border-t-blue-600 mb-4"></div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Processing Your Resume</h3>
            <p className="text-slate-600 text-center">
              Our AI is analyzing your document and extracting information...
            </p>
          </div>
        </div>
      </div>
    );
  };
  
  export default LoadingSection;