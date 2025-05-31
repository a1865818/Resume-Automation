// pages/saved-resumes.js
import Layout from './components/Layout';
import SavedResume from './components/SavedResume';

export default function SaveResumePage() {
  return (
    <Layout>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600/10 to-blue-600/10 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-900 to-purple-900 bg-clip-text text-transparent mb-6">
            Your Resume Templates
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Browse, manage, and download your professionally generated resume templates. 
            Each template is powered by AI and ready for immediate use.
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="py-12">
        <SavedResume />
      </div>
    </Layout>
  );
}