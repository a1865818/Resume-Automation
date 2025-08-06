import Layout from "@/pages/components/Layout";
import ProposalSummaryWrapper from "@/pages/components/ProposalSummary/ProposalSummaryWrapper";
import ResumeTemplate from "@/pages/components/ResumeTemplate";
import TenderResponseWrapper from "@/pages/components/TenderResponse/TenderResponseWrapper";
import apiService from "@/utils/apiService";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

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
                console.error("Error loading document:", err);
                setError(err.message || "Failed to load document");
            } finally {
                setLoading(false);
            }
        };

        loadDocument();
    }, [candidateName, roleName, documentType, documentId]);

    const handleBackToUpload = () => {
        router.push("/pdf-upload");
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
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">
                            Document Not Found
                        </h1>
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
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">
                            No Document Data
                        </h1>
                        <p className="text-gray-600 mb-4">
                            The document could not be loaded.
                        </p>
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
            case "resume":
                return (
                    <ResumeTemplate
                        resumeData={content}
                        onBackToSummary={handleBackToUpload}
                        viewMode="generate"
                    />
                );

            case "tenderresponse":
                return (
                    <TenderResponseWrapper
                        tenderData={content}
                        candidateName={documentData.candidateName || "Candidate"}
                        onBackToResume={handleBackToUpload}
                        isReadOnly={true}
                    />
                );

            case "proposalsummary":
                return (
                    <ProposalSummaryWrapper
                        proposalData={content}
                        candidateName={documentData.candidateName || "Candidate"}
                        onBackToTenderResponse={handleBackToUpload}
                        isReadOnly={true}
                    />
                );

            default:
                return (
                    <div className="text-center py-8">
                        <h1 className="text-2xl font-bold text-gray-800 mb-4">
                            Unknown Document Type
                        </h1>
                        <p className="text-gray-600 mb-4">
                            Document type &quot;{documentType}&quot; is not supported.
                        </p>
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
            <Head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
                <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />
            </Head>
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

                {/* Document content with appropriate width based on document type */}
                <div style={{
                    maxWidth: documentType.toLowerCase() === 'resume' ? '1512.8000488px' : '1012.8000488px',
                    margin: '0 auto',
                    // padding: '0 1rem',
                    backgroundColor: '#f3f4f6',
                    minHeight: '100vh'
                }}>
                    {renderDocument()}
                </div>
            </div>
        </Layout>
    );
}
