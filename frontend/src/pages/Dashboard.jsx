import React from 'react';
import {
    TrendingUp,
    FileCheck,
    Clock,
    AlertCircle,
    ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useReports } from '../context/ReportContext';
import './Dashboard.css';

const Dashboard = () => {
    const { user } = useAuth();
    const { reports, isLoading } = useReports();

    const pendingCount = reports.filter(r => r.status === 'Pending').length;
    const approvedCount = reports.filter(r => r.status === 'Approved').length;

    const stats = [
        { label: 'Total Reports', value: reports.length.toString(), icon: <FileCheck className="text-info" />, trend: '+12%' },
        { label: 'Pending Approvals', value: pendingCount.toString(), icon: <Clock className="text-warning" />, trend: 'Manual Action' },
        { label: 'Approved Reports', value: approvedCount.toString(), icon: <TrendingUp className="text-success" />, trend: 'Steady' },
    ];

    const recentActivity = reports.slice(0, 3).map(r => ({
        id: r.id,
        tender: r.tenderNo,
        SSE: r.submittedBy,
        date: r.date,
        status: r.status
    }));

    return (
        <div className="dashboard animate-fade-in">
            <div className="welcome-section">
                <h1 className="page-title">Operational Overview</h1>
                <p className="subtitle">Welcome back, {user?.name}. Here's what's happening across your projects.</p>
            </div>

            {isLoading && (
                <div className="loading-overlay">
                    <div className="loader"></div>
                    <p>Fetching project status...</p>
                </div>
            )}

            <div className="stats-grid">
                {stats.map((stat, i) => (
                    <div key={i} className="stat-card glass-panel">
                        <div className="stat-header">
                            <div className="stat-icon-wrapper">{stat.icon}</div>
                            <span className="stat-trend">{stat.trend}</span>
                        </div>
                        <div className="stat-body">
                            <h3 className="stat-value">{stat.value}</h3>
                            <p className="stat-label">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="dashboard-grid">
                <div className="activity-section glass-panel">
                    <div className="section-header">
                        <h2>Recent Submissions</h2>
                        <button className="view-all">View All <ArrowRight size={16} /></button>
                    </div>
                    <div className="activity-list">
                        {recentActivity.map(item => (
                            <div key={item.id} className="activity-item">
                                <div className="item-info">
                                    <span className="item-tender">{item.tender}</span>
                                    <p className="item-meta">By {item.SSE} • {item.date}</p>
                                </div>
                                <span className={`status-badge ${item.status.toLowerCase().replace(' ', '-')}`}>
                                    {item.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="project-health glass-panel">
                    <div className="section-header">
                        <h2>Project Progress</h2>
                    </div>
                    <div className="progress-list">
                        <div className="progress-item">
                            <div className="progress-info">
                                <span>RE/TRD/2023/45 - Section GHY</span>
                                <span>85%</span>
                            </div>
                            <div className="progress-bar-bg">
                                <div className="progress-bar-fill" style={{ width: '85%' }}></div>
                            </div>
                        </div>
                        <div className="progress-item">
                            <div className="progress-info">
                                <span>CORE/OHE/GHY-02 - Site LKG</span>
                                <span>42%</span>
                            </div>
                            <div className="progress-bar-bg">
                                <div className="progress-bar-fill" style={{ width: '42%' }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
