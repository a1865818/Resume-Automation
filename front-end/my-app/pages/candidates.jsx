import { useState, useEffect } from 'react';
import { Card, Button, Input, Modal, Form, message, Spin, Empty, DatePicker } from 'antd';
import { PlusOutlined, UserOutlined, FileTextOutlined, EditOutlined, DeleteOutlined, CalendarOutlined, IdcardOutlined } from '@ant-design/icons';
import apiService from '@/utils/apiService';
import dayjs from 'dayjs';

const { Search } = Input;

export default function CandidatesPage() {
    const [candidates, setCandidates] = useState([]);
    const [applications, setApplications] = useState({});
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [candidateToEdit, setCandidateToEdit] = useState(null);
    const [form] = Form.useForm();
    const [editForm] = Form.useForm();

    useEffect(() => {
        loadCandidates();
    }, []);

    const loadCandidates = async () => {
        try {
            setLoading(true);
            const candidatesData = await apiService.request('/candidates');
            setCandidates(candidatesData);
            
            // Load applications for each candidate
            const applicationsData = {};
            for (const candidate of candidatesData) {
                try {
                    const candidateApplications = await apiService.getApplicationsByCandidateId(candidate.id);
                    applicationsData[candidate.id] = candidateApplications;
                } catch (error) {
                    applicationsData[candidate.id] = [];
                }
            }
            setApplications(applicationsData);
        } catch (error) {
            console.error('Error loading candidates:', error);
            message.error('Failed to load candidates');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateCandidate = async (values) => {
        try {
            // Convert dayjs date to ISO string if present
            const candidateData = {
                ...values,
                dateOfBirth: values.dateOfBirth ? values.dateOfBirth.format('YYYY-MM-DD') : null
            };
            
            await apiService.createCandidate(candidateData);
            message.success('Candidate created successfully');
            setIsModalVisible(false);
            form.resetFields();
            loadCandidates();
        } catch (error) {
            console.error('Error creating candidate:', error);
            message.error('Failed to create candidate');
        }
    };

    const handleCreateApplication = async (candidateId, roleName) => {
        try {
            await apiService.createApplication({
                roleName,
                description: `Application for ${roleName} role`,
                candidateId,
            });
            message.success('Application created successfully');
            loadCandidates();
        } catch (error) {
            console.error('Error creating application:', error);
            message.error('Failed to create application');
        }
    };

    const showEditModal = (candidate) => {
        setCandidateToEdit(candidate);
        // Prepopulate form
        editForm.setFieldsValue({
            name: candidate.name,
            email: candidate.email,
            phone: candidate.phone,
            dateOfBirth: candidate.dateOfBirth ? dayjs(candidate.dateOfBirth) : null,
            csidNumber: candidate.csidNumber,
        });
        setEditModalVisible(true);
    };

    const handleUpdateCandidate = async (values) => {
        if (!candidateToEdit) return;
        try {
            const updateData = {
                ...values,
                dateOfBirth: values.dateOfBirth ? values.dateOfBirth.format('YYYY-MM-DD') : null,
            };
            await apiService.updateCandidate(candidateToEdit.id, updateData);
            message.success('Candidate updated successfully');
            setEditModalVisible(false);
            setCandidateToEdit(null);
            editForm.resetFields();
            loadCandidates();
        } catch (error) {
            console.error('Error updating candidate:', error);
            message.error('Failed to update candidate');
        }
    };

    const handleDeleteCandidate = async (candidateId) => {
        try {
            await apiService.deleteCandidate(candidateId);
            message.success('Candidate deleted successfully');
            loadCandidates();
        } catch (error) {
            console.error('Error deleting candidate:', error);
            message.error('Failed to delete candidate');
        }
    };

    const handleDeleteApplication = async (applicationId) => {
        try {
            await apiService.request(`/applications/${applicationId}`, { method: 'DELETE' });
            message.success('Application deleted successfully');
            loadCandidates();
        } catch (error) {
            console.error('Error deleting application:', error);
            message.error('Failed to delete application');
        }
    };

    const filteredCandidates = candidates.filter(candidate =>
        candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.csidNumber?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatDate = (dateString) => {
        if (!dateString) return 'Not provided';
        return new Date(dateString).toLocaleDateString();
    };

    const getDocumentTypeIcon = (documentType) => {
        if (!documentType || typeof documentType !== 'string') {
            console.warn('Invalid documentType:', documentType, typeof documentType);
            return '📄';
        }
        
        switch (documentType.toLowerCase()) {
            case 'resume':
                return '📄';
            case 'tenderresponse':
                return '📋';
            case 'proposalsummary':
                return '📝';
            default:
                console.warn('Unknown documentType:', documentType);
                return '📄';
        }
    };

    const getDocumentTypeName = (documentType) => {
        if (!documentType || typeof documentType !== 'string') {
            return 'Document';
        }
        
        switch (documentType.toLowerCase()) {
            case 'resume':
                return 'Resume';
            case 'tenderresponse':
                return 'Tender Response';
            case 'proposalsummary':
                return 'Proposal Summary';
            default:
                return documentType;
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ marginBottom: '24px' }}>
                <h1 style={{ marginBottom: '16px', color: '#1890ff' }}>
                    <UserOutlined /> Candidate Management
                </h1>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <Search
                        placeholder="Search candidates by name, email, or CSID number..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ flex: 1, maxWidth: '400px' }}
                    />
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => setIsModalVisible(true)}
                    >
                        Add Candidate
                    </Button>
                </div>
            </div>

            {filteredCandidates.length === 0 ? (
                <Empty
                    description="No candidates found"
                    style={{ marginTop: '48px' }}
                />
            ) : (
                <div style={{ display: 'grid', gap: '24px' }}>
                    {filteredCandidates.map((candidate) => (
                        <Card
                            key={candidate.id}
                            title={
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <UserOutlined style={{ color: '#1890ff' }} />
                                    <span>{candidate.name}</span>
                                </div>
                            }
                            extra={
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <Button
                                        icon={<EditOutlined />}
                                        onClick={() => showEditModal(candidate)}
                                        size="small"
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        danger
                                        icon={<DeleteOutlined />}
                                        onClick={() => handleDeleteCandidate(candidate.id)}
                                        size="small"
                                    >
                                        Delete
                                    </Button>
                                </div>
                            }
                            style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                        >
                            <div style={{ marginBottom: '16px' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                                    <div>
                                        <p><strong>Email:</strong> {candidate.email || 'Not provided'}</p>
                                        <p><strong>Phone:</strong> {candidate.phone || 'Not provided'}</p>
                                    </div>
                                    <div>
                                        <p>
                                            <CalendarOutlined style={{ marginRight: '4px', color: '#1890ff' }} />
                                            <strong>Date of Birth:</strong> {formatDate(candidate.dateOfBirth)}
                                        </p>
                                        <p>
                                            <IdcardOutlined style={{ marginRight: '4px', color: '#1890ff' }} />
                                            <strong>CSID Number:</strong> {candidate.csidNumber || 'Not provided'}
                                        </p>
                                    </div>
                                </div>
                                <p style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
                                    <strong>Created:</strong> {new Date(candidate.createdAt).toLocaleDateString()}
                                </p>
                            </div>

                            <div>
                                <h4 style={{ marginBottom: '12px', color: '#1890ff' }}>
                                    <FileTextOutlined /> Applications
                                </h4>
                                
                                {applications[candidate.id]?.length > 0 ? (
                                    <div style={{ display: 'grid', gap: '12px' }}>
                                        {applications[candidate.id].map((application) => (
                                            <Card
                                                key={application.id}
                                                size="small"
                                                title={
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        <span style={{ fontWeight: 'bold' }}>{application.roleName}</span>
                                                        <Button
                                                            danger
                                                            size="small"
                                                            icon={<DeleteOutlined />}
                                                            onClick={() => handleDeleteApplication(application.id)}
                                                        />
                                                    </div>
                                                }
                                            >
                                                <p style={{ marginBottom: '8px' }}>
                                                    {application.description || 'No description'}
                                                </p>
                                                
                                                {application.documents?.length > 0 ? (
                                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                                        {application.documents.map((document) => {
                                                            console.log('Document data:', document);
                                                            return (
                                                            <Button
                                                                key={document.id}
                                                                size="small"
                                                                icon={getDocumentTypeIcon(document.documentType)}
                                                                onClick={() => {
                                                                    const documentType = document.documentType && typeof document.documentType === 'string' 
                                                                        ? document.documentType.toLowerCase() 
                                                                        : 'resume';
                                                                    const url = `/pdf-upload/${encodeURIComponent(candidate.name)}/roles/${encodeURIComponent(application.roleName)}/${documentType}/${document.id}`;
                                                                    window.open(url, '_blank');
                                                                }}
                                                            >
                                                                {getDocumentTypeName(document.documentType)}
                                                            </Button>
                                                            );
                                                        })}
                                                    </div>
                                                ) : (
                                                    <p style={{ color: '#999', fontSize: '12px' }}>
                                                        No documents yet
                                                    </p>
                                                )}
                                            </Card>
                                        ))}
                                    </div>
                                ) : (
                                    <p style={{ color: '#999', fontSize: '12px' }}>
                                        No applications yet
                                    </p>
                                )}

                                <Button
                                    type="dashed"
                                    icon={<PlusOutlined />}
                                    onClick={() => {
                                        const roleName = prompt('Enter role name:');
                                        if (roleName) {
                                            handleCreateApplication(candidate.id, roleName);
                                        }
                                    }}
                                    style={{ marginTop: '12px' }}
                                >
                                    Add Application
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            <Modal
                title="Add New Candidate"
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleCreateCandidate}
                >
                    <Form.Item
                        name="name"
                        label="Name"
                        rules={[{ required: true, message: 'Please enter candidate name' }]}
                    >
                        <Input placeholder="Enter candidate name" />
                    </Form.Item>
                    
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[{ type: 'email', message: 'Please enter a valid email' }]}
                    >
                        <Input placeholder="Enter email address" />
                    </Form.Item>
                    
                    <Form.Item
                        name="phone"
                        label="Phone"
                    >
                        <Input placeholder="Enter phone number" />
                    </Form.Item>

                    <Form.Item
                        name="dateOfBirth"
                        label="Date of Birth"
                    >
                        <DatePicker 
                            placeholder="Select date of birth" 
                            style={{ width: '100%' }}
                            format="YYYY-MM-DD"
                        />
                    </Form.Item>

                    <Form.Item
                        name="csidNumber"
                        label="CSID Number"
                    >
                        <Input placeholder="Enter CSID number" />
                    </Form.Item>
                    
                    <Form.Item>
                        <Button type="primary" htmlType="submit" style={{ marginRight: '8px' }}>
                            Create Candidate
                        </Button>
                        <Button onClick={() => setIsModalVisible(false)}>
                            Cancel
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Edit Candidate Modal */}
            <Modal
                title="Edit Candidate"
                open={editModalVisible}
                onCancel={() => {
                    setEditModalVisible(false);
                    setCandidateToEdit(null);
                    editForm.resetFields();
                }}
                footer={null}
            >
                <Form
                    form={editForm}
                    layout="vertical"
                    onFinish={handleUpdateCandidate}
                >
                    <Form.Item
                        name="name"
                        label="Name"
                        rules={[{ required: true, message: 'Please enter candidate name' }]}
                    >
                        <Input placeholder="Enter candidate name" />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[{ type: 'email', message: 'Please enter a valid email' }]}
                    >
                        <Input placeholder="Enter email address" />
                    </Form.Item>

                    <Form.Item
                        name="phone"
                        label="Phone"
                    >
                        <Input placeholder="Enter phone number" />
                    </Form.Item>

                    <Form.Item
                        name="dateOfBirth"
                        label="Date of Birth"
                    >
                        <DatePicker
                            placeholder="Select date of birth"
                            style={{ width: '100%' }}
                            format="YYYY-MM-DD"
                        />
                    </Form.Item>

                    <Form.Item
                        name="csidNumber"
                        label="CSID Number"
                    >
                        <Input placeholder="Enter CSID number" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" style={{ marginRight: '8px' }}>
                            Update Candidate
                        </Button>
                        <Button
                            onClick={() => {
                                setEditModalVisible(false);
                                setCandidateToEdit(null);
                                editForm.resetFields();
                            }}
                        >
                            Cancel
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
} 