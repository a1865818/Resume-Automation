const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

class ApiService {
    constructor() {
        this.baseUrl = API_BASE_URL;
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        };

        try {
            const response = await fetch(url, config);

            if (!response.ok) {
                // Try to parse as JSON first, but handle cases where it's not JSON
                let errorData = {};
                try {
                    const contentType = response.headers.get('content-type');
                    if (contentType && contentType.includes('application/json')) {
                        errorData = await response.json();
                    }
                } catch (parseError) {
                    // If JSON parsing fails, create a generic error object
                    errorData = {
                        status: response.status,
                        statusText: response.statusText,
                        message: `HTTP error! status: ${response.status}`
                    };
                }

                // Don't log 404 errors as they are expected and handled gracefully
                if (response.status !== 404) {
                    console.error('API Error Details:', {
                        status: response.status,
                        statusText: response.statusText,
                        url: response.url,
                        errorData: errorData
                    });
                }

                // Create a custom error that includes the status code for proper handling
                const error = new Error(errorData.message || errorData.title || `HTTP error! status: ${response.status}`);
                error.status = response.status;
                error.statusText = response.statusText;
                throw error;
            }

            // Handle empty responses (like DELETE operations that return 204 No Content)
            if (response.status === 204 || response.headers.get('content-length') === '0') {
                return null;
            }

            // Check if response has content before trying to parse JSON
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                return null;
            }

            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    // Candidate endpoints
    async createCandidate(candidateData) {
        return this.request('/candidates', {
            method: 'POST',
            body: JSON.stringify(candidateData),
        });
    }

    async getCandidateById(id) {
        return this.request(`/candidates/${id}`);
    }

    async getCandidateByName(name) {
        return this.request(`/candidates/name/${encodeURIComponent(name)}`);
    }

    async updateCandidate(id, updateData) {
        return this.request(`/candidates/${id}`, {
            method: 'PUT',
            body: JSON.stringify(updateData),
        });
    }

    async deleteCandidate(id) {
        return this.request(`/candidates/${id}`, {
            method: 'DELETE',
        });
    }

    // Application endpoints
    async createApplication(applicationData) {
        return this.request('/applications', {
            method: 'POST',
            body: JSON.stringify(applicationData),
        });
    }

    async getApplicationById(id) {
        return this.request(`/applications/${id}`);
    }

    async getApplicationsByCandidateId(candidateId) {
        return this.request(`/applications/candidate/${candidateId}`);
    }

    async getApplicationByCandidateAndRole(candidateId, roleName) {
        const finalRoleName = roleName || 'default';
        return this.request(`/applications/candidate/${candidateId}/role/${encodeURIComponent(finalRoleName)}`);
    }

    // Document endpoints
    async createDocument(documentData) {
        console.log('Creating document with data:', documentData);
        return this.request('/documents', {
            method: 'POST',
            body: JSON.stringify(documentData),
        });
    }

    async getDocumentById(id) {
        return this.request(`/documents/${id}`);
    }

    async getDocumentsByApplicationId(applicationId) {
        return this.request(`/documents/application/${applicationId}`);
    }

    async getDocumentByCustomRoute(candidateName, roleName, documentType, documentId) {
        return this.request(
            `/documents/candidate/${encodeURIComponent(candidateName)}/roles/${encodeURIComponent(roleName)}/${documentType}/${documentId}`
        );
    }

    async updateDocument(id, updateData) {
        return this.request(`/documents/${id}`, {
            method: 'PUT',
            body: JSON.stringify(updateData),
        });
    }

    async updateApplication(id, updateData) {
        return this.request(`/applications/${id}`, {
            method: 'PUT',
            body: JSON.stringify(updateData),
        });
    }

    async deleteDocument(id) {
        return this.request(`/documents/${id}`, {
            method: 'DELETE',
        });
    }

    async addDocumentVersion(documentId, content) {
        return this.request(`/documents/${documentId}/versions`, {
            method: 'POST',
            body: JSON.stringify(content),
        });
    }

    async getDocumentVersions(documentId) {
        return this.request(`/documents/${documentId}/versions`);
    }

    // Helper methods for document management
    async saveResume(candidateName, resumeData, roleName = 'default', generationMode = 'Standard', templateType = 'Papps', jobDescription = null) {
        try {
            const finalRoleName = roleName || 'default';
            console.log('Starting saveResume:', { candidateName, roleName: finalRoleName, generationMode, templateType });

            // First, check if candidate exists, if not create one
            let candidate;
            try {
                console.log('Checking if candidate exists:', candidateName);
                candidate = await this.getCandidateByName(candidateName);
                console.log('Candidate found:', candidate);
            } catch (error) {
                console.log('Candidate not found, creating new candidate:', candidateName);
                // Candidate doesn't exist, create one
                candidate = await this.createCandidate({
                    name: candidateName,
                    email: resumeData.profile?.email || null,
                    phone: resumeData.profile?.phone || null,
                });
                console.log('Candidate created:', candidate);
            }

            // Check if application exists for this candidate and role, if not create one
            let application;
            try {
                console.log('Loading existing applications for candidate:', candidate.id);
                const applications = await this.getApplicationsByCandidateId(candidate.id);
                application = applications.find(app => app.roleName === finalRoleName);
            } catch (error) {
                console.warn('Could not load applications for candidate (treating as none):', error);
            }

            if (!application) {
                console.log('Application not found, creating new application:', { candidateId: candidate.id, roleName: finalRoleName });
                application = await this.createApplication({
                    roleName: finalRoleName,
                    description: `Application for ${finalRoleName} role`,
                    candidateId: candidate.id,
                    generationMode: generationMode,
                    templateType: templateType,
                    jobDescription: jobDescription,
                });
                console.log('Application created:', application);
            }

            // Check if resume document already exists for this application
            let document;
            try {
                console.log('Checking if document exists for application:', application.id);
                const documents = await this.getDocumentsByApplicationId(application.id);
                document = documents.find(doc => doc.documentType === 'Resume');
                console.log('Document found:', document);
            } catch (error) {
                console.log('No documents found for application:', application.id);
                // No documents found
            }

            if (!document) {
                console.log('Creating new document for application:', application.id);
                // Document doesn't exist, create one
                document = await this.createDocument({
                    title: `${candidateName} Resume`,
                    documentType: 'Resume',
                    applicationId: application.id,
                    content: JSON.stringify(resumeData),
                });
                console.log('Document created:', document);
            } else {
                // Document exists, add new version with content
                console.log('Document exists, adding new version:', document.id);
                await this.addDocumentVersion(document.id, JSON.stringify(resumeData));
                console.log('New version added successfully');
            }

            const result = {
                candidate,
                application,
                document,
                url: `/pdf-upload/${encodeURIComponent(candidateName)}/roles/${encodeURIComponent(finalRoleName)}/resume/${document.id}`,
            };
            console.log('SaveResume completed successfully:', result);
            return result;
        } catch (error) {
            console.error('Error saving resume:', error);
            throw error;
        }
    }

    async saveTenderResponse(candidateName, tenderData, roleName = 'default', generationMode = 'Tailored', templateType = 'Papps', jobDescription = null) {
        try {
            const finalRoleName = roleName || 'default';
            // First, check if candidate exists, if not create one
            let candidate;
            try {
                candidate = await this.getCandidateByName(candidateName);
            } catch (error) {
                // Candidate doesn't exist, create one
                candidate = await this.createCandidate({
                    name: candidateName,
                    email: null,
                    phone: null,
                });
            }

            // Check if application exists for this candidate and role, if not create one
            let application;
            try {
                const applications = await this.getApplicationsByCandidateId(candidate.id);
                application = applications.find(app => app.roleName === finalRoleName);
            } catch (error) {
                console.warn('Could not load applications for candidate (treating as none):', error);
            }

            if (!application) {
                application = await this.createApplication({
                    roleName: finalRoleName,
                    description: `Application for ${finalRoleName} role`,
                    candidateId: candidate.id,
                    generationMode: generationMode,
                    templateType: templateType,
                    jobDescription: jobDescription,
                });
            }

            // Check if tender response document already exists for this application
            let document;
            try {
                const documents = await this.getDocumentsByApplicationId(application.id);
                document = documents.find(doc => doc.documentType === 'TenderResponse');
            } catch (error) {
                // No documents found
            }

            if (!document) {
                // Document doesn't exist, create one
                document = await this.createDocument({
                    title: `${candidateName} Tender Response`,
                    documentType: 'TenderResponse',
                    applicationId: application.id,
                    content: JSON.stringify(tenderData),
                });
            } else {
                // Document exists, add new version with content
                await this.addDocumentVersion(document.id, JSON.stringify(tenderData));
            }

            return {
                candidate,
                application,
                document,
                url: `/pdf-upload/${encodeURIComponent(candidateName)}/roles/${encodeURIComponent(finalRoleName)}/tenderresponse/${document.id}`,
            };
        } catch (error) {
            console.error('Error saving tender response:', error);
            throw error;
        }
    }

    async saveProposalSummary(candidateName, proposalData, roleName = 'default', generationMode = 'Tailored', templateType = 'Papps', jobDescription = null) {
        try {
            const finalRoleName = roleName || 'default';
            // First, check if candidate exists, if not create one
            let candidate;
            try {
                candidate = await this.getCandidateByName(candidateName);
            } catch (error) {
                // Candidate doesn't exist, create one
                candidate = await this.createCandidate({
                    name: candidateName,
                    email: null,
                    phone: null,
                });
            }

            // Check if application exists for this candidate and role, if not create one
            let application;
            try {
                const applications = await this.getApplicationsByCandidateId(candidate.id);
                application = applications.find(app => app.roleName === finalRoleName);
            } catch (error) {
                console.warn('Could not load applications for candidate (treating as none):', error);
            }

            if (!application) {
                application = await this.createApplication({
                    roleName: finalRoleName,
                    description: `Application for ${finalRoleName} role`,
                    candidateId: candidate.id,
                    generationMode: generationMode,
                    templateType: templateType,
                    jobDescription: jobDescription,
                });
            }

            // Check if proposal summary document already exists for this application
            let document;
            try {
                const documents = await this.getDocumentsByApplicationId(application.id);
                document = documents.find(doc => doc.documentType === 'ProposalSummary');
            } catch (error) {
                // No documents found
            }

            if (!document) {
                // Document doesn't exist, create one
                document = await this.createDocument({
                    title: `${candidateName} Proposal Summary`,
                    documentType: 'ProposalSummary',
                    applicationId: application.id,
                    content: JSON.stringify(proposalData),
                });
            } else {
                // Document exists, add new version with content
                await this.addDocumentVersion(document.id, JSON.stringify(proposalData));
            }

            return {
                candidate,
                application,
                document,
                url: `/pdf-upload/${encodeURIComponent(candidateName)}/roles/${encodeURIComponent(finalRoleName)}/proposalsummary/${document.id}`,
            };
        } catch (error) {
            console.error('Error saving proposal summary:', error);
            throw error;
        }
    }

    async loadDocument(candidateName, roleName, documentType, documentId) {
        try {
            const document = await this.getDocumentByCustomRoute(candidateName, roleName, documentType, documentId);

            // Get the latest version content
            const versions = await this.getDocumentVersions(documentId);
            const latestVersion = versions.sort((a, b) => b.version - a.version)[0];

            if (!latestVersion) {
                throw new Error('No content found for this document');
            }

            return {
                ...document,
                content: JSON.parse(latestVersion.content),
                candidateName: candidateName,
            };
        } catch (error) {
            console.error('Error loading document:', error);
            throw error;
        }
    }
}

// Create a singleton instance
const apiService = new ApiService();

export default apiService; 