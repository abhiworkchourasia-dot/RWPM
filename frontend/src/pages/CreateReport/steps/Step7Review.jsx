import React from 'react';
import { Send, FileCheck, Users, HardHat, ClipboardList, Info, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useReports } from '../../../context/ReportContext';
import { useNavigate } from 'react-router-dom';

const Step7Review = ({ prev, formData }) => {
    const { user } = useAuth();
    const { addReport } = useReports();
    const navigate = useNavigate();

    const submitReport = () => {
        addReport(formData, user.role);
        if (user.role === 'JE') {
            alert('Report submitted to Drafts for SSE Approval!');
        } else {
            alert('Report Finalized and Saved to Project Records (Master)!');
        }
        navigate('/');
    };

    const totalManpower = formData.manpowerItems?.reduce((acc, item) => acc + (parseInt(item.count) || 0), 0) || 0;

    return (
        <div className="step-content animate-fade-in">
            <div className="review-header-badge">
                <CheckCircle2 size={16} />
                <span>{user.role === 'JE' ? 'Draft Mode: Pending Approval' : 'Review Mode: Final Authorization'}</span>
            </div>

            <h2 className="step-title">Step 7: Final Review & Submission</h2>

            <div className="review-scroll-area">
                {/* Basic Info Section */}
                <div className="review-card glass-card">
                    <div className="review-card-header">
                        <Info size={18} className="text-info" />
                        <h4>Project Information</h4>
                    </div>
                    <div className="review-grid">
                        <div className="review-field"><span>Tender No:</span> <strong>{formData.tenderNo || 'N/A'}</strong></div>
                        <div className="review-field"><span>LOA No:</span> <strong>{formData.loaNo || 'N/A'}</strong></div>
                        <div className="review-field"><span>Project:</span> <strong>{formData.projectName || 'N/A'}</strong></div>
                        <div className="review-field"><span>Agency:</span> <strong>{formData.agencyName || 'N/A'}</strong></div>
                        <div className="review-field"><span>Section:</span> <strong>{formData.section || 'N/A'}</strong></div>
                        <div className="review-field"><span>Location:</span> <strong>{formData.location || 'N/A'}</strong></div>
                        <div className="review-field"><span>Date:</span> <strong>{formData.date || 'N/A'}</strong></div>
                        <div className="review-field"><span>Shift:</span> <strong>{formData.shift || 'N/A'}</strong></div>
                    </div>
                </div>

                {/* Progress Detail Table */}
                <div className="review-card glass-card">
                    <div className="review-card-header">
                        <ClipboardList size={18} className="text-accent" />
                        <h4>Progress Details</h4>
                    </div>
                    <div className="review-table-wrapper">
                        <table className="review-table">
                            <thead>
                                <tr>
                                    <th>S.No</th>
                                    <th>Work Description</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {formData.progressItems?.map((item, idx) => (
                                    <tr key={idx}>
                                        <td data-label="S.No">{idx + 1}</td>
                                        <td data-label="Work Description">{item.workDescription}</td>
                                        <td data-label="Status">{item.doneTillToday}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Material Detail Table */}
                <div className="review-card glass-card">
                    <div className="review-card-header">
                        <HardHat size={18} className="text-warning" />
                        <h4>Material Details</h4>
                    </div>
                    <div className="review-table-wrapper">
                        <table className="review-table">
                            <thead>
                                <tr>
                                    <th>S.No</th>
                                    <th>Material</th>
                                    <th>Quantity</th>
                                </tr>
                            </thead>
                            <tbody>
                                {formData.materialDetails?.map((item, idx) => (
                                    <tr key={idx}>
                                        <td data-label="S.No">{idx + 1}</td>
                                        <td data-label="Material">{item.name}</td>
                                        <td data-label="Quantity">{item.quantity}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Manpower Detail Table */}
                <div className="review-card glass-card">
                    <div className="review-card-header">
                        <Users size={18} className="text-success" />
                        <h4>Manpower Deployment</h4>
                    </div>
                    <div className="review-table-wrapper">
                        <table className="review-table">
                            <thead>
                                <tr>
                                    <th>S.No</th>
                                    <th>Category</th>
                                    <th>Count</th>
                                </tr>
                            </thead>
                            <tbody>
                                {formData.manpowerItems?.map((item, idx) => (
                                    <tr key={idx}>
                                        <td data-label="S.No">{idx + 1}</td>
                                        <td data-label="Category">{item.category}</td>
                                        <td data-label="Count">{item.count}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colSpan="2" style={{ textAlign: 'right', fontWeight: 'bold' }}>Total Manpower:</td>
                                    <td style={{ color: 'var(--accent)', fontWeight: '700' }}>{totalManpower}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>

                {/* Machinery Details */}
                <div className="review-card glass-card">
                    <div className="review-card-header">
                        <FileCheck size={18} className="text-info" />
                        <h4>Machinery Details</h4>
                    </div>
                    <div className="review-table-wrapper">
                        <table className="review-table">
                            <thead>
                                <tr>
                                    <th>S.No</th>
                                    <th>Machinery</th>
                                    <th>Count</th>
                                </tr>
                            </thead>
                            <tbody>
                                {formData.machineryItems?.map((item, idx) => (
                                    <tr key={idx}>
                                        <td data-label="S.No">{idx + 1}</td>
                                        <td data-label="Machinery">{item.machineryName}</td>
                                        <td data-label="Count">{item.count}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Inspection & Safety */}
                <div className="review-card glass-card">
                    <div className="review-card-header">
                        <FileCheck size={18} className="text-success" />
                        <h4>Inspection & Declaration</h4>
                    </div>
                    <div className="review-grid">
                        <div className="review-field full-width"><span>Inspector:</span> <strong>{formData.inspectorName} ({formData.inspectorDesignation})</strong></div>
                        <div className="review-field full-width"><span>Instructions:</span> <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--text-main)' }}>{formData.inspectionInfo || 'No instructions provided.'}</p></div>
                    </div>
                </div>
            </div>

            <div className="step-actions">
                <button className="btn-secondary" onClick={prev}>Back to Edit</button>
                <button className="btn-primary" onClick={submitReport} style={{ gap: '0.5rem', display: 'flex' }}>
                    <Send size={18} /> {user.role === 'JE' ? 'Submit for Approval' : 'Authorize & Finalize'}
                </button>
            </div>

            <style>{`
        .review-header-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: rgba(59, 130, 246, 0.1);
          border: 1px solid var(--info);
          color: var(--info);
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }
      `}</style>
        </div>
    );
};

export default Step7Review;
