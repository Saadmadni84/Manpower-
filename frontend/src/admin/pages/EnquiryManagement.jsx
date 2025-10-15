import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/Layout/AdminLayout';
import Button from '../../components/ui/Button/Button';
import Input from '../../components/ui/Input/Input';
import Select from '../../components/ui/Select/Select';
import Modal from '../../components/ui/Modal/Modal';
import TextArea from '../../components/ui/Input/TextArea';
import Badge from '../../components/ui/Badge/Badge';
import { contactAPI } from '../../services/api/contactAPI';
import { useNotificationContext } from '../../context/NotificationContext';
import styles from './EnquiryManagement.module.css';

const EnquiryManagement = () => {
  const navigate = useNavigate();
  const { success, error } = useNotificationContext();
  
  // State management
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('view'); // view, respond, note, followup
  const [stats, setStats] = useState({});
  
  // Filters and pagination
  const [filters, setFilters] = useState({
    status: '',
    serviceType: '',
    inquiryType: '',
    priority: '',
    search: '',
    page: 1,
    limit: 10
  });
  const [pagination, setPagination] = useState({});
  
  // Form data for different modals
  const [responseData, setResponseData] = useState({
    responseMessage: '',
    responseMethod: 'email'
  });
  const [noteData, setNoteData] = useState({
    note: '',
    isInternal: false
  });
  const [followUpData, setFollowUpData] = useState({
    scheduledDate: '',
    notes: '',
    assignedTo: ''
  });

  // Load enquiries
  const loadEnquiries = async () => {
    try {
      setLoading(true);
      console.log('Loading enquiries with filters:', filters);
      console.log('Auth token from localStorage:', localStorage.getItem('authToken'));
      const response = await contactAPI.getMessages(filters);
      console.log('API Response:', response);
      
      if (response.success) {
        console.log('Setting enquiries:', response.data.enquiries);
        setEnquiries(response.data.enquiries || []);
        setPagination({
          totalCount: response.data.totalCount,
          currentPage: response.data.currentPage,
          totalPages: response.data.totalPages,
          hasNextPage: response.data.hasNextPage,
          hasPrevPage: response.data.hasPrevPage
        });
      } else {
        console.error('API returned success: false', response);
      }
    } catch (error) {
      console.error('Error loading enquiries:', error);
      console.error('Error details:', error.response?.data);
      error('Failed to load enquiries');
    } finally {
      setLoading(false);
    }
  };

  // Load stats
  const loadStats = async () => {
    try {
      const response = await contactAPI.getEnquiryStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  useEffect(() => {
    loadEnquiries();
    loadStats();
  }, [filters]);

  // Filter handlers
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filtering
    }));
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      serviceType: '',
      inquiryType: '',
      priority: '',
      search: '',
      page: 1,
      limit: 10
    });
  };

  // Modal handlers
  const openModal = (enquiry, mode) => {
    setSelectedEnquiry(enquiry);
    setModalMode(mode);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedEnquiry(null);
    setResponseData({ responseMessage: '', responseMethod: 'email' });
    setNoteData({ note: '', isInternal: false });
    setFollowUpData({ scheduledDate: '', notes: '', assignedTo: '' });
  };

  // Status update
  const updateStatus = async (enquiryId, status, notes = '') => {
    try {
      const response = await contactAPI.updateEnquiryStatus(enquiryId, { status, notes });
      if (response.success) {
        success('Status updated successfully');
        loadEnquiries();
        loadStats();
      }
    } catch (error) {
      console.error('Error updating status:', error);
      error('Failed to update status');
    }
  };

  // Add response
  const handleAddResponse = async () => {
    try {
      const response = await contactAPI.respondToEnquiry(selectedEnquiry.id, responseData);
      if (response.success) {
        success('Response sent successfully');
        closeModal();
        loadEnquiries();
      }
    } catch (error) {
      console.error('Error sending response:', error);
      error('Failed to send response');
    }
  };

  // Add note
  const handleAddNote = async () => {
    try {
      const response = await contactAPI.addEnquiryNote(selectedEnquiry.id, noteData);
      if (response.success) {
        success('Note added successfully');
        closeModal();
        loadEnquiries();
      }
    } catch (error) {
      console.error('Error adding note:', error);
      error('Failed to add note');
    }
  };

  // Schedule follow-up
  const handleScheduleFollowUp = async () => {
    try {
      const response = await contactAPI.scheduleFollowUp(selectedEnquiry.id, followUpData);
      if (response.success) {
        success('Follow-up scheduled successfully');
        closeModal();
        loadEnquiries();
      }
    } catch (error) {
      console.error('Error scheduling follow-up:', error);
      error('Failed to schedule follow-up');
    }
  };

  // Delete enquiry
  const deleteEnquiry = async (enquiryId) => {
    if (window.confirm('Are you sure you want to delete this enquiry?')) {
      try {
        const response = await contactAPI.deleteEnquiry(enquiryId);
        if (response.success) {
          success('Enquiry deleted successfully');
          loadEnquiries();
          loadStats();
        }
      } catch (error) {
        console.error('Error deleting enquiry:', error);
        error('Failed to delete enquiry');
      }
    }
  };

  // Export enquiries
  const exportEnquiries = async () => {
    try {
      const response = await contactAPI.exportEnquiries(filters);
      if (response.success) {
        success('Export completed successfully');
      }
    } catch (error) {
      console.error('Error exporting enquiries:', error);
      error('Failed to export enquiries');
    }
  };

  // Get status badge variant
  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'new': return 'primary';
      case 'read': return 'info';
      case 'in-progress': return 'warning';
      case 'responded': return 'success';
      case 'closed': return 'secondary';
      case 'spam': return 'danger';
      default: return 'secondary';
    }
  };

  // Get priority badge variant
  const getPriorityBadgeVariant = (priority) => {
    switch (priority) {
      case 'urgent': return 'danger';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  return (
    <AdminLayout>
      <div className={styles.enquiryManagement}>
        <div className={styles.header}>
          <div>
            <h1>Contact Enquiry Management</h1>
            <p>Manage and respond to customer enquiries</p>
          </div>
          <div className={styles.headerActions}>
            <Button variant="outline" onClick={exportEnquiries}>
              Export
            </Button>
            <Button variant="primary" onClick={() => loadEnquiries()}>
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <h3>Total Enquiries</h3>
            <p className={styles.statNumber}>{stats.total || 0}</p>
          </div>
          <div className={styles.statCard}>
            <h3>New Enquiries</h3>
            <p className={styles.statNumber}>{stats.byStatus?.new || 0}</p>
          </div>
          <div className={styles.statCard}>
            <h3>Pending</h3>
            <p className={styles.statNumber}>
              {(stats.byStatus?.new || 0) + (stats.byStatus?.read || 0) + (stats.byStatus?.['in-progress'] || 0)}
            </p>
          </div>
          <div className={styles.statCard}>
            <h3>Urgent</h3>
            <p className={styles.statNumber}>{stats.byPriority?.urgent || 0}</p>
          </div>
        </div>

        {/* Filters */}
        <div className={styles.filters}>
          <div className={styles.filterRow}>
            <Input
              placeholder="Search enquiries..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className={styles.searchInput}
            />
            <Select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              options={[
                { value: '', label: 'All Status' },
                { value: 'new', label: 'New' },
                { value: 'read', label: 'Read' },
                { value: 'in-progress', label: 'In Progress' },
                { value: 'responded', label: 'Responded' },
                { value: 'closed', label: 'Closed' },
                { value: 'spam', label: 'Spam' }
              ]}
            />
            <Select
              value={filters.serviceType}
              onChange={(e) => handleFilterChange('serviceType', e.target.value)}
              options={[
                { value: '', label: 'All Services' },
                { value: 'General Inquiry', label: 'General Inquiry' },
                { value: 'Airport Operations', label: 'Airport Operations' },
                { value: 'Corporate Offices', label: 'Corporate Offices' },
                { value: 'Catering Services', label: 'Catering Services' },
                { value: 'Logistics & Warehousing', label: 'Logistics & Warehousing' },
                { value: 'Construction & Engineering', label: 'Construction & Engineering' },
                { value: 'Facility Management', label: 'Facility Management' }
              ]}
            />
            <Select
              value={filters.priority}
              onChange={(e) => handleFilterChange('priority', e.target.value)}
              options={[
                { value: '', label: 'All Priorities' },
                { value: 'low', label: 'Low' },
                { value: 'medium', label: 'Medium' },
                { value: 'high', label: 'High' },
                { value: 'urgent', label: 'Urgent' }
              ]}
            />
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        </div>

        {/* Enquiries Table */}
        <div className={styles.tableContainer}>
          {loading ? (
            <div className={styles.loading}>Loading enquiries...</div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Subject</th>
                  <th>Service Type</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {enquiries.map((enquiry) => (
                  <tr key={enquiry.id}>
                    <td>
                      <div className={styles.nameCell}>
                        <strong>{enquiry.personalInfo?.name || 'N/A'}</strong>
                        {enquiry.personalInfo?.company && (
                          <span className={styles.company}>{enquiry.personalInfo.company}</span>
                        )}
                      </div>
                    </td>
                    <td>{enquiry.personalInfo?.email || 'N/A'}</td>
                    <td>{enquiry.personalInfo?.phone || 'N/A'}</td>
                    <td className={styles.subjectCell}>
                      <div className={styles.subject}>
                        {enquiry.subject || 'N/A'}
                        {enquiry.message && enquiry.message.length > 100 && (
                          <span className={styles.truncated}>...</span>
                        )}
                      </div>
                    </td>
                    <td>{enquiry.serviceType || 'N/A'}</td>
                    <td>
                      <Badge variant={getStatusBadgeVariant(enquiry.status)}>
                        {enquiry.status || 'N/A'}
                      </Badge>
                    </td>
                    <td>{enquiry.createdAt ? new Date(enquiry.createdAt).toLocaleDateString() : 'Invalid Date'}</td>
                    <td>
                      <div className={styles.actionButtons}>
                        <Button
                          size="small"
                          variant="outline"
                          onClick={() => openModal(enquiry, 'view')}
                        >
                          View
                        </Button>
                        <Button
                          size="small"
                          variant="primary"
                          onClick={() => updateStatus(enquiry.id, 'responded')}
                        >
                          Respond
                        </Button>
                        <Button
                          size="small"
                          variant="danger"
                          onClick={() => deleteEnquiry(enquiry.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className={styles.pagination}>
            <Button
              variant="outline"
              disabled={!pagination.hasPrevPage}
              onClick={() => handleFilterChange('page', pagination.currentPage - 1)}
            >
              Previous
            </Button>
            <span>
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            <Button
              variant="outline"
              disabled={!pagination.hasNextPage}
              onClick={() => handleFilterChange('page', pagination.currentPage + 1)}
            >
              Next
            </Button>
          </div>
        )}

        {/* Modal */}
        {showModal && selectedEnquiry && (
          <Modal isOpen={showModal} onClose={closeModal} size="large">
            <div className={styles.modalContent}>
              {modalMode === 'view' && (
                <div>
                  <h2>Enquiry Details</h2>
                  <div className={styles.enquiryDetails}>
                    <div className={styles.detailSection}>
                      <h3>Personal Information</h3>
                      <p><strong>Name:</strong> {selectedEnquiry.personalInfo?.name}</p>
                      <p><strong>Email:</strong> {selectedEnquiry.personalInfo?.email}</p>
                      <p><strong>Phone:</strong> {selectedEnquiry.personalInfo?.phone}</p>
                      {selectedEnquiry.personalInfo?.company && (
                        <p><strong>Company:</strong> {selectedEnquiry.personalInfo.company}</p>
                      )}
                      {selectedEnquiry.personalInfo?.position && (
                        <p><strong>Position:</strong> {selectedEnquiry.personalInfo.position}</p>
                      )}
                    </div>
                    
                    <div className={styles.detailSection}>
                      <h3>Inquiry Details</h3>
                      <p><strong>Subject:</strong> {selectedEnquiry.subject}</p>
                      <p><strong>Service Type:</strong> {selectedEnquiry.serviceType}</p>
                      <p><strong>Inquiry Type:</strong> {selectedEnquiry.inquiryType}</p>
                      <p><strong>Priority:</strong> {selectedEnquiry.priority}</p>
                      <p><strong>Message:</strong></p>
                      <div className={styles.message}>{selectedEnquiry.message}</div>
                    </div>

                    {selectedEnquiry.location && (
                      <div className={styles.detailSection}>
                        <h3>Location</h3>
                        <p><strong>City:</strong> {selectedEnquiry.location.city}</p>
                        {selectedEnquiry.location.region && (
                          <p><strong>Region:</strong> {selectedEnquiry.location.region}</p>
                        )}
                        <p><strong>Country:</strong> {selectedEnquiry.location.country}</p>
                      </div>
                    )}

                    {selectedEnquiry.projectDetails && (
                      <div className={styles.detailSection}>
                        <h3>Project Details</h3>
                        {selectedEnquiry.projectDetails.budget && (
                          <p><strong>Budget:</strong> {selectedEnquiry.projectDetails.budget}</p>
                        )}
                        {selectedEnquiry.projectDetails.timeline && (
                          <p><strong>Timeline:</strong> {selectedEnquiry.projectDetails.timeline}</p>
                        )}
                        {selectedEnquiry.projectDetails.requirements && (
                          <p><strong>Requirements:</strong> {selectedEnquiry.projectDetails.requirements}</p>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className={styles.modalActions}>
                    <Button variant="primary" onClick={() => setModalMode('respond')}>
                      Respond
                    </Button>
                    <Button variant="outline" onClick={() => setModalMode('note')}>
                      Add Note
                    </Button>
                    <Button variant="outline" onClick={() => setModalMode('followup')}>
                      Schedule Follow-up
                    </Button>
                  </div>
                </div>
              )}

              {modalMode === 'respond' && (
                <div>
                  <h2>Respond to Enquiry</h2>
                  <div className={styles.formSection}>
                    <TextArea
                      label="Response Message"
                      value={responseData.responseMessage}
                      onChange={(e) => setResponseData(prev => ({ ...prev, responseMessage: e.target.value }))}
                      rows={6}
                      required
                    />
                    <Select
                      label="Response Method"
                      value={responseData.responseMethod}
                      onChange={(e) => setResponseData(prev => ({ ...prev, responseMethod: e.target.value }))}
                      options={[
                        { value: 'email', label: 'Email' },
                        { value: 'phone', label: 'Phone' },
                        { value: 'in-person', label: 'In Person' },
                        { value: 'other', label: 'Other' }
                      ]}
                    />
                  </div>
                  <div className={styles.modalActions}>
                    <Button variant="primary" onClick={handleAddResponse}>
                      Send Response
                    </Button>
                    <Button variant="outline" onClick={closeModal}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {modalMode === 'note' && (
                <div>
                  <h2>Add Admin Note</h2>
                  <div className={styles.formSection}>
                    <TextArea
                      label="Note"
                      value={noteData.note}
                      onChange={(e) => setNoteData(prev => ({ ...prev, note: e.target.value }))}
                      rows={4}
                      required
                    />
                    <div className={styles.checkboxField}>
                      <label>
                        <input
                          type="checkbox"
                          checked={noteData.isInternal}
                          onChange={(e) => setNoteData(prev => ({ ...prev, isInternal: e.target.checked }))}
                        />
                        Internal Note (not visible to customer)
                      </label>
                    </div>
                  </div>
                  <div className={styles.modalActions}>
                    <Button variant="primary" onClick={handleAddNote}>
                      Add Note
                    </Button>
                    <Button variant="outline" onClick={closeModal}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {modalMode === 'followup' && (
                <div>
                  <h2>Schedule Follow-up</h2>
                  <div className={styles.formSection}>
                    <Input
                      type="datetime-local"
                      label="Scheduled Date & Time"
                      value={followUpData.scheduledDate}
                      onChange={(e) => setFollowUpData(prev => ({ ...prev, scheduledDate: e.target.value }))}
                      required
                    />
                    <TextArea
                      label="Follow-up Notes"
                      value={followUpData.notes}
                      onChange={(e) => setFollowUpData(prev => ({ ...prev, notes: e.target.value }))}
                      rows={3}
                    />
                  </div>
                  <div className={styles.modalActions}>
                    <Button variant="primary" onClick={handleScheduleFollowUp}>
                      Schedule Follow-up
                    </Button>
                    <Button variant="outline" onClick={closeModal}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Modal>
        )}
      </div>
    </AdminLayout>
  );
};

export default EnquiryManagement;
