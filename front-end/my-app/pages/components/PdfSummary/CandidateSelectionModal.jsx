import React, { useState, useEffect } from 'react';
import { Modal, List, Input, Button, Divider, message, Spin } from 'antd';
import { FolderOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons';
import apiService from '../../../utils/apiService';

const CandidateSelectionModal = ({ 
    visible, 
    onCancel, 
    onConfirm, 
    documentData, 
    documentType,
    roleName = 'default'
}) => {
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [showNewCandidateForm, setShowNewCandidateForm] = useState(false);
    const [newCandidateData, setNewCandidateData] = useState({
        name: '',
        email: '',
        phone: '',
        dateOfBirth: null,
        csidNumber: ''
    });
    const [creatingCandidate, setCreatingCandidate] = useState(false);

    useEffect(() => {
        if (visible) {
            loadCandidates();
        }
    }, [visible]);

    const loadCandidates = async () => {
        try {
            setLoading(true);
            const candidatesData = await apiService.request('/candidates');
            setCandidates(candidatesData);
        } catch (error) {
            console.error('Error loading candidates:', error);
            message.error('Failed to load candidates');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateCandidate = async () => {
        if (!newCandidateData.name.trim()) {
            message.error('Candidate name is required');
            return;
        }

        try {
            setCreatingCandidate(true);
            const candidate = await apiService.createCandidate(newCandidateData);
            message.success('Candidate created successfully');
            
            // Add the new candidate to the list
            setCandidates([...candidates, candidate]);
            setSelectedCandidate(candidate);
            setShowNewCandidateForm(false);
            setNewCandidateData({
                name: '',
                email: '',
                phone: '',
                dateOfBirth: null,
                csidNumber: ''
            });
        } catch (error) {
            console.error('Error creating candidate:', error);
            message.error('Failed to create candidate');
        } finally {
            setCreatingCandidate(false);
        }
    };

    const handleConfirm = async () => {
        if (!selectedCandidate) {
            message.error('Please select a candidate');
            return;
        }

        try {
            setLoading(true);
            let result;

            switch (documentType) {
                case 'resume':
                    result = await apiService.saveResume(selectedCandidate.name, documentData, roleName);
                    break;
                case 'tenderResponse':
                    result = await apiService.saveTenderResponse(selectedCandidate.name, documentData, roleName);
                    break;
                case 'proposalSummary':
                    result = await apiService.saveProposalSummary(selectedCandidate.name, documentData, roleName);
                    break;
                default:
                    throw new Error('Invalid document type');
            }

            message.success('Document saved successfully');
            onConfirm(result);
        } catch (error) {
            console.error('Error saving document:', error);
            message.error('Failed to save document');
        } finally {
            setLoading(false);
        }
    };

    const filteredCandidates = candidates.filter(candidate =>
        candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.csidNumber?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getDocumentTypeIcon = (type) => {
        switch (type) {
            case 'resume':
                return '📄';
            case 'tenderResponse':
                return '📋';
            case 'proposalSummary':
                return '📝';
            default:
                return '📄';
        }
    };

    const getDocumentTypeName = (type) => {
        switch (type) {
            case 'resume':
                return 'Resume';
            case 'tenderResponse':
                return 'Tender Response';
            case 'proposalSummary':
                return 'Proposal Summary';
            default:
                return type;
        }
    };

    return (
        <Modal
            title={`Save ${getDocumentTypeName(documentType)} - Move to:`}
            open={visible}
            onCancel={onCancel}
            footer={[
                <Button key="cancel" onClick={onCancel}>
                    Cancel
                </Button>,
                <Button 
                    key="confirm" 
                    type="primary" 
                    onClick={handleConfirm}
                    loading={loading}
                    disabled={!selectedCandidate}
                >
                    Done
                </Button>
            ]}
            width={500}
        >
            <div style={{ marginBottom: 16 }}>
                <Input
                    placeholder="Search candidates..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ marginBottom: 8 }}
                />
            </div>

            <Spin spinning={loading}>
                <List
                    dataSource={filteredCandidates}
                    renderItem={(candidate) => (
                        <List.Item
                            style={{
                                padding: '12px 16px',
                                cursor: 'pointer',
                                backgroundColor: selectedCandidate?.id === candidate.id ? '#f0f0f0' : 'transparent',
                                borderRadius: 4,
                                marginBottom: 4
                            }}
                            onClick={() => setSelectedCandidate(candidate)}
                        >
                            <List.Item.Meta
                                avatar={<FolderOutlined style={{ fontSize: 20, color: '#1890ff' }} />}
                                title={candidate.name}
                                description={
                                    <div>
                                        {candidate.email && <div>📧 {candidate.email}</div>}
                                        {candidate.phone && <div>📞 {candidate.phone}</div>}
                                        {candidate.csidNumber && <div>🆔 {candidate.csidNumber}</div>}
                                        {candidate.dateOfBirth && (
                                            <div>🎂 {new Date(candidate.dateOfBirth).toLocaleDateString()}</div>
                                        )}
                                    </div>
                                }
                            />
                        </List.Item>
                    )}
                />
            </Spin>

            <Divider />

            <List.Item
                style={{
                    padding: '12px 16px',
                    cursor: 'pointer',
                    backgroundColor: showNewCandidateForm ? '#f0f0f0' : 'transparent',
                    borderRadius: 4
                }}
                onClick={() => setShowNewCandidateForm(!showNewCandidateForm)}
            >
                <List.Item.Meta
                    avatar={<PlusOutlined style={{ fontSize: 20, color: '#52c41a' }} />}
                    title="New Candidate"
                    description="Create a new candidate"
                />
            </List.Item>

            {showNewCandidateForm && (
                <div style={{ marginTop: 16, padding: 16, backgroundColor: '#f9f9f9', borderRadius: 4 }}>
                    <Input
                        placeholder="Candidate Name *"
                        value={newCandidateData.name}
                        onChange={(e) => setNewCandidateData({ ...newCandidateData, name: e.target.value })}
                        style={{ marginBottom: 8 }}
                    />
                    <Input
                        placeholder="Email (optional)"
                        value={newCandidateData.email}
                        onChange={(e) => setNewCandidateData({ ...newCandidateData, email: e.target.value })}
                        style={{ marginBottom: 8 }}
                    />
                    <Input
                        placeholder="Phone (optional)"
                        value={newCandidateData.phone}
                        onChange={(e) => setNewCandidateData({ ...newCandidateData, phone: e.target.value })}
                        style={{ marginBottom: 8 }}
                    />
                    <Input
                        placeholder="CSID Number (optional)"
                        value={newCandidateData.csidNumber}
                        onChange={(e) => setNewCandidateData({ ...newCandidateData, csidNumber: e.target.value })}
                        style={{ marginBottom: 8 }}
                    />
                    <Button
                        type="primary"
                        onClick={handleCreateCandidate}
                        loading={creatingCandidate}
                        disabled={!newCandidateData.name.trim()}
                        block
                    >
                        Create Candidate
                    </Button>
                </div>
            )}

            {selectedCandidate && (
                <div style={{ 
                    marginTop: 16, 
                    padding: 12, 
                    backgroundColor: '#e6f7ff', 
                    borderRadius: 4,
                    border: '1px solid #91d5ff'
                }}>
                    <div style={{ fontWeight: 'bold', marginBottom: 4 }}>
                        {getDocumentTypeIcon(documentType)} {getDocumentTypeName(documentType)} will be saved to:
                    </div>
                    <div style={{ color: '#666' }}>
                        📁 {selectedCandidate.name} / {roleName}
                    </div>
                </div>
            )}
        </Modal>
    );
};

export default CandidateSelectionModal; 