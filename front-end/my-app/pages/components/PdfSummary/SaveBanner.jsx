
import { useState } from 'react';
import CandidateSelectionModal from './CandidateSelectionModal';

const SaveBanner = ({ 
    uploadedProfilePictureUrl, 
    isJobTailored, 
    showTenderOption,
    onGenerateTenderResponse, 
    isGeneratingTender,
    // Existing props for tender response navigation
    hasTenderResponse = false,
    onBackToTenderResponse = null,
    detectedSector = 'Government',
    // Props for Word download
    onDownloadWord = null,
    isWordLoading = false,
    // NEW: Props for proposal summary
    hasProposalSummary = false,
    onBackToProposalSummary = null,
    // NEW: Props for document saving
    onSaveResume = null,
    onSaveTenderResponse = null,
    onSaveProposalSummary = null,
    isSavingDocument = false,
    savedDocumentUrl = '',
    saveError = '',

    // NEW: Props for document data
    resumeData = null,
    tenderData = null,
    proposalData = null
  }) => {
    const [showCandidateModal, setShowCandidateModal] = useState(false);
    const [currentDocumentType, setCurrentDocumentType] = useState(null);
    const [currentDocumentData, setCurrentDocumentData] = useState(null);
    // Sector-specific button text
    const getTenderButtonText = () => {
      const sectorLabels = {
        'ICT': 'Generate ICT Criteria Statement',
        'Defence': 'Generate Defence Criteria Statement',
        'Finance': 'Generate Finance Criteria Statement',
        'Health': 'Generate Health Criteria Statement',
        'Education': 'Generate Education Criteria Statement',
        'Infrastructure': 'Generate Infrastructure Criteria Statement',
        'Environment': 'Generate Environment Criteria Statement',
        'Legal': 'Generate Legal Criteria Statement',
        'Government': 'Generate Criteria Statement'
      };
      return sectorLabels[detectedSector] || 'Generate Criteria Statement';
    };
  
    const getBackButtonText = () => {
      const sectorLabels = {
        'ICT': 'Back to ICT Criteria Statement',
        'Defence': 'Back to Defence Criteria Statement',
        'Finance': 'Back to Finance Criteria Statement',
        'Health': 'Back to Health Criteria Statement',
        'Education': 'Back to Education Criteria Statement',
        'Infrastructure': 'Back to Infrastructure Criteria Statement',
        'Environment': 'Back to Environment Criteria Statement',
        'Legal': 'Back to Legal Criteria Statement',
        'Government': 'Back to Criteria Statement'
      };
      return sectorLabels[detectedSector] || 'Back to Criteria Statement';
    };

    // NEW: Proposal summary button text
    const getProposalSummaryButtonText = () => {
      const sectorLabels = {
        'ICT': 'Back to ICT Proposal Summary',
        'Defence': 'Back to Defence Proposal Summary',
        'Finance': 'Back to Finance Proposal Summary',
        'Health': 'Back to Health Proposal Summary',
        'Education': 'Back to Education Proposal Summary',
        'Infrastructure': 'Back to Infrastructure Proposal Summary',
        'Environment': 'Back to Environment Proposal Summary',
        'Legal': 'Back to Legal Proposal Summary',
        'Government': 'Back to Proposal Summary'
      };
      return sectorLabels[detectedSector] || 'Back to Proposal Summary';
    };

    // Handler functions for save buttons
    const handleSaveResume = () => {
      setCurrentDocumentType('resume');
      setCurrentDocumentData(resumeData);
      setShowCandidateModal(true);
    };

    const handleSaveTenderResponse = () => {
      setCurrentDocumentType('tenderResponse');
      setCurrentDocumentData(tenderData);
      setShowCandidateModal(true);
    };

    const handleSaveProposalSummary = () => {
      setCurrentDocumentType('proposalSummary');
      setCurrentDocumentData(proposalData);
      setShowCandidateModal(true);
    };

    const handleCandidateModalConfirm = (result) => {
      setShowCandidateModal(false);
      // Call the original save handlers with the result
      if (onSaveResume && currentDocumentType === 'resume') {
        onSaveResume(result);
      } else if (onSaveTenderResponse && currentDocumentType === 'tenderResponse') {
        onSaveTenderResponse(result);
      } else if (onSaveProposalSummary && currentDocumentType === 'proposalSummary') {
        onSaveProposalSummary(result);
      }
    };

    const handleCandidateModalCancel = () => {
      setShowCandidateModal(false);
      setCurrentDocumentType(null);
      setCurrentDocumentData(null);
    };
  
    return (
      <div className="bg-white border-b border-gray-200 p-4 space-y-4 max-w-[1512px] flex flex-col  mx-auto">
        {/* Action Buttons Row */}
        <div className="flex flex-wrap gap-3 items-center justify-between">
          {/* Left side - Tender buttons */}
          <div className="flex flex-wrap gap-3">
            {/* Generate Tender Response Button */}
            {showTenderOption && (
              <button
                onClick={onGenerateTenderResponse}
                disabled={isGeneratingTender || isWordLoading}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                  isGeneratingTender || isWordLoading
                    ? 'bg-gray-100 text-gray-600 border border-gray-300 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700 border border-green-600 hover:border-green-700'
                }`}
              >
                {isGeneratingTender ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                    Generating...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span>📋</span>
                    {getTenderButtonText()}
                  </div>
                )}
              </button>
            )}
          </div>


  
          {/* Right side - Navigation and Save buttons */}
          <div className="flex flex-wrap gap-3">
            {/* Save buttons */}
            {onSaveResume && (
              <button
                onClick={handleSaveResume}
                disabled={isSavingDocument || isWordLoading}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                  isSavingDocument || isWordLoading
                    ? 'bg-gray-100 text-gray-600 border border-gray-300 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700 border border-blue-600 hover:border-blue-700'
                }`}
              >
                {isSavingDocument ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span>💾</span>
                    Save Resume
                  </div>
                )}
              </button>
            )}

            {onSaveTenderResponse && hasTenderResponse && (
              <button
                onClick={handleSaveTenderResponse}
                disabled={isSavingDocument || isWordLoading}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                  isSavingDocument || isWordLoading
                    ? 'bg-gray-100 text-gray-600 border border-gray-300 cursor-not-allowed'
                    : 'bg-purple-600 text-white hover:bg-purple-700 border border-purple-600 hover:border-purple-700'
                }`}
              >
                {isSavingDocument ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span>💾</span>
                    Save Criteria Statement
                  </div>
                )}
              </button>
            )}

            {onSaveProposalSummary && hasProposalSummary && (
              <button
                onClick={handleSaveProposalSummary}
                disabled={isSavingDocument || isWordLoading}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                  isSavingDocument || isWordLoading
                    ? 'bg-gray-100 text-gray-600 border border-gray-300 cursor-not-allowed'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 border border-indigo-600 hover:border-indigo-700'
                }`}
              >
                {isSavingDocument ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span>💾</span>
                    Save Proposal Summary
                  </div>
                )}
              </button>
            )}

            {/* Back to Tender Response button */}
            {hasTenderResponse && onBackToTenderResponse && (
              <button
                onClick={onBackToTenderResponse}
                className="px-4 py-2 rounded-lg font-medium text-sm bg-purple-600 text-white hover:bg-purple-700 border border-purple-600 hover:border-purple-700 transition-all duration-200"
              >
                <div className="flex items-center gap-2">
                  <span>📋</span>
                  {getBackButtonText()}
                </div>
              </button>
            )}

            {/* NEW: Back to Proposal Summary button */}
            {hasProposalSummary && onBackToProposalSummary && (
              <button
                onClick={onBackToProposalSummary}
                className="px-4 py-2 rounded-lg font-medium text-sm bg-indigo-600 text-white hover:bg-indigo-700 border border-indigo-600 hover:border-indigo-700 transition-all duration-200"
              >
                <div className="flex items-center gap-2">
                  <span>📑</span>
                  {getProposalSummaryButtonText()}
                </div>
              </button>
            )}
          </div>
        </div>
  
        {/* Information Row */}
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          {/* Resume Type Indicator */}
          <div className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${
              isJobTailored ? 'bg-green-500' : 'bg-blue-500'
            }`}></span>
            <span>
              {isJobTailored ? 'Tailored Resume' : 'Standard Resume'}
            </span>
          </div>
  
          {/* Sector Indicator */}
          {detectedSector && detectedSector !== 'Government' && (
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-indigo-500"></span>
              <span>{detectedSector} Sector</span>
            </div>
          )}
  
          {/* Profile Picture Status */}
          {uploadedProfilePictureUrl && (
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-green-500"></span>
              <span>Profile picture uploaded</span>
            </div>
          )}
  
          {/* Tender Response Status */}
          {hasTenderResponse && (
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-purple-500"></span>
              <span>{detectedSector} Criteria Statement generated</span>
            </div>
          )}

          {/* NEW: Proposal Summary Status */}
          {hasProposalSummary && (
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-indigo-500"></span>
              <span>{detectedSector} Proposal Summary generated</span>
            </div>
          )}
        </div>
  
        {/* Download Options Info */}
        {onDownloadWord && (
          <div className="text-xs text-gray-500 border-t border-gray-100 pt-3">
            <div className="flex items-start gap-2">
              <svg className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-medium text-gray-700 mb-1">Download Options:</p>
                <ul className="space-y-1">
                  <li>• <strong>Quick Download Word:</strong> Instant Microsoft Word compatible format</li>
                  <li>• <strong>Scroll down for more options:</strong> PDF download and advanced settings available below</li>
                </ul>
              </div>
            </div>
          </div>
        )}
  
        {/* Save Status */}
        {savedDocumentUrl && (
          <div className="text-xs text-green-600 border-t border-gray-100 pt-3">
            <div className="flex items-center gap-2">
              <span>✅</span>
              <span>Document saved successfully!</span>
              <a
                href={savedDocumentUrl}
                className="text-blue-600 hover:text-blue-800 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                View saved document
              </a>
            </div>
          </div>
        )}

        {saveError && (
          <div className="text-xs text-red-600 border-t border-gray-100 pt-3">
            <div className="flex items-center gap-2">
              <span>❌</span>
              <span>Error saving document: {saveError}</span>
            </div>
          </div>
        )}

        {/* Help Text */}
        <div className="text-xs text-gray-500 border-t border-gray-100 pt-3">
          <p>
            💡 <strong>Tip:</strong> 
            {isJobTailored 
              ? ` Your resume has been tailored for this specific ${detectedSector} role. Generate a Criteria Statement for a complete tender response${hasProposalSummary ? ', then create a Proposal Summary for narrative format.' : '.'}`
              : ` For government tenders, upload a job description to create a tailored resume first.`
            }
          </p>
          {/* NEW: Workflow guidance */}
          {isJobTailored && (
            <div className="mt-2 p-2 bg-blue-50 rounded-md">
              <p className="text-blue-800 text-xs">
                <strong>Complete Tender Workflow:</strong>
              </p>
              <div className="flex items-center gap-4 mt-1 text-xs text-blue-700">
                <span className={isJobTailored ? 'text-green-600' : 'text-gray-400'}>
                  ✓ Tailored Resume
                </span>
                <span className={hasTenderResponse ? 'text-green-600' : 'text-blue-600'}>
                  {hasTenderResponse ? '✓' : '→'} Criteria Statement
                </span>
                <span className={hasProposalSummary ? 'text-green-600' : 'text-blue-600'}>
                  {hasProposalSummary ? '✓' : '→'} Proposal Summary
                </span>
              </div>
            </div>
          )}
        </div>
          {/* Candidate Selection Modal */}
      <CandidateSelectionModal
        visible={showCandidateModal}
        onCancel={handleCandidateModalCancel}
        onConfirm={handleCandidateModalConfirm}
        documentData={currentDocumentData}
        documentType={currentDocumentType}
        roleName={'default'}
      />
      </div>

    
  );
};

export default SaveBanner;