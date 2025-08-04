
const ErrorMessage = ({ error }) => {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700 mb-2">
              {error}
            </p>
            {error.includes('API key') && (
              <div className="text-sm text-red-600">
                <p className="mb-2">To use AI generation, please:</p>
                <ol className="list-decimal list-inside space-y-1 ml-2">
                  <li>Get your API key from <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline hover:text-red-800">Google AI Studio</a></li>
                  <li>Add <code className="bg-red-100 px-1 rounded">NEXT_PUBLIC_GEMINI_API_KEY=your_api_key</code> to your .env.local file</li>
                  <li>Restart your development server</li>
                </ol>
                <p className="mt-2">Alternatively, you can use mock data to test the resume template.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };
  
  export default ErrorMessage;