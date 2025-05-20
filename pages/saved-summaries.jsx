// pages/saved-summaries.js
import Link from 'next/link';
import Layout from './components/Layout';
import SavedSummaries from './components/SavedSummaries';

export default function SavedSummariesPage() {
  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Saved Resume Summaries</h1>
          <div className="flex space-x-4">
            <Link href="/">
              <span className="text-indigo-600 hover:text-indigo-800 cursor-pointer">
                ← Candidates
              </span>
            </Link>
            <Link href="/pdf-upload">
              <span className="text-indigo-600 hover:text-indigo-800 cursor-pointer">
                ← PDF Tool
              </span>
            </Link>
          </div>
        </div>

        <SavedSummaries />
      </div>
    </Layout>
  );
}