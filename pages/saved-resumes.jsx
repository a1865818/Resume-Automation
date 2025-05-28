// pages/saved-summaries.js
import Layout from './components/Layout';
import SavedResume from './components/SavedResume';

export default function SaveResumePage() {
  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Saved Resume Templates</h1>
        </div>
      </div>
      <SavedResume />

    </Layout>
  );
}