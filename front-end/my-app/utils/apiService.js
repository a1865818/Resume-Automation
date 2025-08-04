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
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
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
        return this.request(`/applications/candidate/${candidateId}/role/${encodeURIComponent(roleName)}`);
    }

    // Document endpoints
    async createDocument(documentData) {
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
    async saveResume(candidateName, resumeData, roleName = 'default') {
        try {
            // First, check if candidate exists, if not create one
            let candidate;
            try {
                candidate = await this.getCandidateByName(candidateName);
            } catch (error) {
                // Candidate doesn't exist, create one
                candidate = await this.createCandidate({
                    name: candidateName,
                    email: resumeData.profile?.email || '',
                    phone: resumeData.profile?.phone || '',
                });
            }

            // Check if application exists for this candidate and role, if not create one
            let application;
            try {
                application = await this.getApplicationByCandidateAndRole(candidate.id, roleName);
            } catch (error) {
                // Application doesn't exist, create one
                application = await this.createApplication({
                    roleName: roleName,
                    description: `Application for ${roleName} role`,
                    candidateId: candidate.id,
                });
            }

            // Check if resume document already exists for this application
            let document;
            try {
                document = await this.getDocumentByCustomRoute(candidateName, roleName, 'Resume', 0);
            } catch (error) {
                // Document doesn't exist, create one
                document = await this.createDocument({
                    title: `${candidateName} Resume`,
                    documentType: 'Resume',
                    content: JSON.stringify(resumeData),
                    applicationId: application.id,
                });
            }

            // If document exists, add new version
            if (document && document.id) {
                await this.addDocumentVersion(document.id, JSON.stringify(resumeData));
            }

            return {
                candidate,
                application,
                document,
                url: `/pdf-upload/${encodeURIComponent(candidateName)}/roles/${encodeURIComponent(roleName)}/resume/${document.id}`,
            };
        } catch (error) {
            console.error('Error saving resume:', error);
            throw error;
        }
    }

    async saveTenderResponse(candidateName, tenderData, roleName = 'default') {
        try {
            // First, check if candidate exists, if not create one
            let candidate;
            try {
                candidate = await this.getCandidateByName(candidateName);
            } catch (error) {
                // Candidate doesn't exist, create one
                candidate = await this.createCandidate({
                    name: candidateName,
                    email: '',
                    phone: '',
                });
            }

            // Check if application exists for this candidate and role, if not create one
            let application;
            try {
                application = await this.getApplicationByCandidateAndRole(candidate.id, roleName);
            } catch (error) {
                // Application doesn't exist, create one
                application = await this.createApplication({
                    roleName: roleName,
                    description: `Application for ${roleName} role`,
                    candidateId: candidate.id,
                });
            }

            // Check if tender response document already exists for this application
            let document;
            try {
                document = await this.getDocumentByCustomRoute(candidateName, roleName, 'TenderResponse', 0);
            } catch (error) {
                // Document doesn't exist, create one
                document = await this.createDocument({
                    title: `${candidateName} Tender Response`,
                    documentType: 'TenderResponse',
                    content: JSON.stringify(tenderData),
                    applicationId: application.id,
                });
            }

            // If document exists, add new version
            if (document && document.id) {
                await this.addDocumentVersion(document.id, JSON.stringify(tenderData));
            }

            return {
                candidate,
                application,
                document,
                url: `/pdf-upload/${encodeURIComponent(candidateName)}/roles/${encodeURIComponent(roleName)}/tenderresponse/${document.id}`,
            };
        } catch (error) {
            console.error('Error saving tender response:', error);
            throw error;
        }
    }

    async saveProposalSummary(candidateName, proposalData, roleName = 'default') {
        try {
            // First, check if candidate exists, if not create one
            let candidate;
            try {
                candidate = await this.getCandidateByName(candidateName);
            } catch (error) {
                // Candidate doesn't exist, create one
                candidate = await this.createCandidate({
                    name: candidateName,
                    email: '',
                    phone: '',
                });
            }

            // Check if application exists for this candidate and role, if not create one
            let application;
            try {
                application = await this.getApplicationByCandidateAndRole(candidate.id, roleName);
            } catch (error) {
                // Application doesn't exist, create one
                application = await this.createApplication({
                    roleName: roleName,
                    description: `Application for ${roleName} role`,
                    candidateId: candidate.id,
                });
            }

            // Check if proposal summary document already exists for this application
            let document;
            try {
                document = await this.getDocumentByCustomRoute(candidateName, roleName, 'ProposalSummary', 0);
            } catch (error) {
                // Document doesn't exist, create one
                document = await this.createDocument({
                    title: `${candidateName} Proposal Summary`,
                    documentType: 'ProposalSummary',
                    content: JSON.stringify(proposalData),
                    applicationId: application.id,
                });
            }

            // If document exists, add new version
            if (document && document.id) {
                await this.addDocumentVersion(document.id, JSON.stringify(proposalData));
            }

            return {
                candidate,
                application,
                document,
                url: `/pdf-upload/${encodeURIComponent(candidateName)}/roles/${encodeURIComponent(roleName)}/proposalsummary/${document.id}`,
            };
        } catch (error) {
            console.error('Error saving proposal summary:', error);
            throw error;
        }
    }

    async loadDocument(candidateName, roleName, documentType, documentId) {
        try {
            const document = await this.getDocumentByCustomRoute(candidateName, roleName, documentType, documentId);
            return {
                ...document,
                content: JSON.parse(document.content),
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