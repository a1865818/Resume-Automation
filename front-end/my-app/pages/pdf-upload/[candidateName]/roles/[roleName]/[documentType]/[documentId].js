import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../../../components/Layout';
import ResumeTemplate from '../../../../components/ResumeTemplate';
import TenderResponseWrapper from '../../../../components/TenderResponse/TenderResponseWrapper';
import ProposalSummaryWrapper from '../../../../components/ProposalSummary/ProposalSummaryWrapper';
import apiService from '../../../../utils/apiService';

export default function DocumentViewer() {
    const router = useRouter();
    const { candidateName, roleName, documentType, documentId } = router.query;

    const [documentData, setDocumentData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!candidateName || !roleName || !documentType || !documentId) {
            return;
        }

        const loadDocument = async () => {
            try {
                setLoading(true);
                setError(null);

                const data = await apiService.loadDocument(
                    decodeURIComponent(candidateName),
                    decodeURIComponent(roleName),
                    documentType,
                    documentId
                );

                setDocumentData(data);
            } catch (err) {
                console.error('Error loading document:', err);
                setError(err.message || 'Failed to load document');
            } finally {
                setLoading(false);
            }
        };

        loadDocument();
    }, [candidateName, roleName, documentType, documentId]);

    const handleBackToUpload = () => {
        router.push('/pdf-upload');
    };

    if (loading) {
        return (
            <Layout>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-lg text-gray-600">Loading document...</p>
                    </div>
                </div>
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <div className="text-red-600 text-6xl mb-4">⚠️</div>
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">Document Not Found</h1>
                        <p className="text-gray-600 mb-4">{error}</p>
                        <button
                            onClick={handleBackToUpload}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Back to Upload
                        </button>
                    </div>
                </div>
            </Layout>
        );
    }

    if (!documentData) {
        return (
            <Layout>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <div className="text-gray-600 text-6xl mb-4">📄</div>
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">No Document Data</h1>
                        <p className="text-gray-600 mb-4">The document could not be loaded.</p>
                        <button
                            onClick={handleBackToUpload}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Back to Upload
                        </button>
                    </div>
                </div>
            </Layout>
        );
    }

    // Render the appropriate component based on document type
    const renderDocument = () => {
        const content = documentData.content;

        switch (documentType.toLowerCase()) {
            case 'resume':
                return (
                    <ResumeTemplate
                        resumeData={content}
                        onBackToSummary={handleBackToUpload}
                        isReadOnly={true}
                    />
                );

            case 'tenderresponse':
                return (
                    <TenderResponseWrapper
                        tenderData={content}
                        candidateName={documentData.candidateName || 'Candidate'}
                        onBackToResume={handleBackToUpload}
                        isReadOnly={true}
                    />
                );

            case 'proposalsummary':
                return (
                    <ProposalSummaryWrapper
                        proposalData={content}
                        candidateName={documentData.candidateName || 'Candidate'}
                        onBackToTenderResponse={handleBackToUpload}
                        isReadOnly={true}
                    />
                );

            default:
                return (
                    <div className="text-center py-8">
                        <h1 className="text-2xl font-bold text-gray-800 mb-4">Unknown Document Type</h1>
                        <p className="text-gray-600 mb-4">Document type "{documentType}" is not supported.</p>
                        <button
                            onClick={handleBackToUpload}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Back to Upload
                        </button>
                    </div>
                );
        }
    };

    return (
        <Layout>
            <div className="w-full">
                {/* Header with document info */}
                <div className="bg-white shadow-sm border-b px-6 py-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-xl font-semibold text-gray-800">
                                    {documentData.title}
                                </h1>
                                <p className="text-sm text-gray-600">
                                    {candidateName} • {roleName} • {documentType}
                                </p>
                            </div>
                            <button
                                onClick={handleBackToUpload}
                                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm"
                            >
                                Back to Upload
                            </button>
                        </div>
                    </div>
                </div>

                {/* Document content */}
                <div className="max-w-6xl mx-auto">
                    {renderDocument()}
                </div>
            </div>
        </Layout>
    );
} 