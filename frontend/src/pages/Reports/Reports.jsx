import React, { useState } from 'react';
import { useReports } from '../../context/ReportContext';
import { useAuth } from '../../context/AuthContext';
import {
    FileText,
    CheckCircle,
    XCircle,
    Clock,
    ChevronRight,
    Search,
    Filter,
    X,
    ClipboardList,
    Users,
    HardHat,
    Info,
    ArrowRight
} from 'lucide-react';
import './Reports.css';

const Reports = () => {
    const { reports, isLoading, updateReportStatus } = useReports();
    const { user } = useAuth();
    const [filter, setFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedReport, setSelectedReport] = useState(null);

    const filteredReports = reports.filter(report => {
        const matchesFilter = filter === 'All' || report.status === filter;
        const matchesSearch = report.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            report.tenderNo.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const handleStatusUpdate = (id, newStatus) => {
        const confirmMsg = newStatus === 'Approved' ? 'Approve this report and move to Master Records?' : 'Reject this report?';
        if (window.confirm(confirmMsg)) {
            updateReportStatus(id, newStatus, user.role);
        }
    };

    return (
        <div className="reports-page animate-fade-in">
            <div className="page-header">
                <h1 className="page-title">Project Reports</h1>
                <p className="subtitle">Manage and review site engineering documentation.</p>
            </div>

            {isLoading && (
                <div className="loading-overlay">
                    <div className="loader"></div>
                    <p>Loading reports...</p>
                </div>
            )}

            <div className="reports-controls glass-panel">
                <div className="search-box">
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Search by project or tender..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="filter-tabs">
                    {['All', 'Pending', 'Approved', 'Rejected'].map(status => (
                        <button
                            key={status}
                            className={`filter-btn ${filter === status ? 'active' : ''}`}
                            onClick={() => setFilter(status)}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            <div className="reports-list">
                {filteredReports.length > 0 ? (
                    filteredReports.map(report => (
                        <div key={report.id} className="report-card glass-panel">
                            <div className="report-info">
                                <div className="report-icon">
                                    <FileText size={24} />
                                </div>
                                <div className="report-details">
                                    <h3 className="project-name">{report.projectName}</h3>
                                    <div className="meta-info">
                                        <span>ID: {report.id}</span>
                                        <span>Tender: {report.tenderNo}</span>
                                        <span>Submitted By: {report.submittedBy}</span>
                                        <span>Date: {report.date}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="report-status-actions">
                                <div className={`status-pill ${report.status.toLowerCase()}`}>
                                    {report.status === 'Pending' && <Clock size={14} />}
                                    {report.status === 'Approved' && <CheckCircle size={14} />}
                                    {report.status === 'Rejected' && <XCircle size={14} />}
                                    {report.status}
                                </div>

                                {user.role === 'SSE' && report.status === 'Pending' && (
                                    <div className="action-buttons">
                                        <button
                                            className="approve-btn"
                                            onClick={() => handleStatusUpdate(report.id, 'Approved')}
                                        >
                                            <CheckCircle size={18} /> Approve
                                        </button>
                                        <button
                                            className="reject-btn"
                                            onClick={() => handleStatusUpdate(report.id, 'Rejected')}
                                        >
                                            <XCircle size={18} /> Reject
                                        </button>
                                    </div>
                                )}

                                <button
                                    className="view-details-btn"
                                    onClick={() => setSelectedReport(report)}
                                >
                                    Details <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="empty-state glass-panel">
                        <FileText size={48} />
                        <h3>No reports found</h3>
                        <p>Adjust your search or filters to see more results.</p>
                    </div>
                )}
            </div>

            {/* Detailed View Modal */}
            {selectedReport && (
                <div className="modal-overlay animate-fade-in" onClick={() => setSelectedReport(null)}>
                    <div className="modal-content glass-panel animate-slide-up" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <div className="header-info">
                                <h2>Report Summary: {selectedReport.id}</h2>
                                <p>{selectedReport.projectName}</p>
                            </div>
                            <button className="close-modal" onClick={() => setSelectedReport(null)}>
                                <X size={24} />
                            </button>
                        </div>

                        <div className="modal-scroll-area">
                            <div className="review-grid-compact">
                                <div className="review-item"><span>Tender No</span><strong>{selectedReport.tenderNo}</strong></div>
                                <div className="review-item"><span>Date</span><strong>{selectedReport.date}</strong></div>
                                <div className="review-item"><span>Shift</span><strong>{selectedReport.shift}</strong></div>
                                <div className="review-item"><span>Location</span><strong>{selectedReport.location}</strong></div>
                                <div className="review-item"><span>Agency</span><strong>{selectedReport.agencyName}</strong></div>
                                <div className="review-item"><span>Submitted By</span><strong>{selectedReport.submittedBy}</strong></div>
                            </div>

                            {/* Work Progress Section */}
                            <div className="modal-section">
                                <h4 className="section-title"><ClipboardList size={16} /> Work Progress</h4>
                                <div className="mini-table-wrapper">
                                    <table className="mini-table">
                                        <thead><tr><th>Description</th><th>Achievement</th></tr></thead>
                                        <tbody>
                                            {selectedReport.data?.progressItems?.map((item, i) => (
                                                <tr key={i}><td>{item.workDescription}</td><td>{item.doneTillToday}</td></tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Materials Section */}
                            <div className="modal-section-row">
                                <div className="modal-section half">
                                    <h4 className="section-title"><HardHat size={16} /> Materials Used</h4>
                                    <ul className="simple-list">
                                        {selectedReport.data?.materialDetails?.map((item, i) => (
                                            <li key={i}><span>{item.name}</span><strong>{item.quantity}</strong></li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="modal-section half">
                                    <h4 className="section-title"><Users size={16} /> Manpower</h4>
                                    <ul className="simple-list">
                                        {selectedReport.data?.manpowerItems?.map((item, i) => (
                                            <li key={i}><span>{item.category}</span><strong>{item.count}</strong></li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Machinery Section */}
                            <div className="modal-section">
                                <h4 className="section-title"><FileText size={16} /> Machinery Detail</h4>
                                <div className="machinery-tags">
                                    {selectedReport.data?.machineryItems?.map((item, i) => (
                                        <span key={i} className="machinery-tag">{item.machineryName}: {item.count}</span>
                                    ))}
                                </div>
                            </div>

                            {/* Instructions Section */}
                            <div className="modal-section highlight">
                                <h4 className="section-title"><Info size={16} /> Site Instructions</h4>
                                <p>"{selectedReport.data?.inspectionInfo || 'No instructions provided.'}"</p>
                                <div className="safety-badge">Safety Declaration Confirmed</div>
                            </div>
                        </div>

                        {user.role === 'SSE' && selectedReport.status === 'Pending' && (
                            <div className="modal-footer">
                                <button className="modal-reject-btn" onClick={() => { handleStatusUpdate(selectedReport.id, 'Rejected'); setSelectedReport(null); }}>Reject Draft</button>
                                <button className="modal-approve-btn" onClick={() => { handleStatusUpdate(selectedReport.id, 'Approved'); setSelectedReport(null); }}>Approve & Move to Master</button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Reports;
