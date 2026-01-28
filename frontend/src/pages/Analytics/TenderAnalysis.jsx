import React, { useState, useMemo } from 'react';
import { useReports } from '../../context/ReportContext';
import {
    Calendar,
    Search,
    BarChart,
    Activity,
    HardHat,
    Construction,
    TrendingUp,
    Filter,
    ArrowUpRight,
    Users,
    Truck,
    ClipboardList,
    ShieldAlert,
    MessageSquare,
    MapPin
} from 'lucide-react';
import './TenderAnalysis.css';

const TenderAnalysis = () => {
    const { reports, isLoading } = useReports();
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [selectedTender, setSelectedTender] = useState(null);

    const uniqueTenders = [...new Set(reports.map(r => r.tenderNo))];

    const filteredReports = useMemo(() => {
        return reports.filter(report => {
            const matchesTender = selectedTender ? report.tenderNo === selectedTender : true;
            const reportDate = new Date(report.date);
            const start = dateRange.start ? new Date(dateRange.start) : null;
            const end = dateRange.end ? new Date(dateRange.end) : null;

            let matchesDate = true;
            if (start && end) {
                matchesDate = reportDate >= start && reportDate <= end;
            } else if (start) {
                matchesDate = reportDate >= start;
            } else if (end) {
                matchesDate = reportDate <= end;
            }
            return matchesTender && matchesDate;
        });
    }, [reports, selectedTender, dateRange]);

    // Deep Data Aggregation
    const stats = useMemo(() => {
        if (filteredReports.length === 0) return null;

        const materialMap = {};
        const manpowerMap = {};
        const machineryMap = {};
        const weatherMap = {};
        const agencyMap = {};
        const shiftMap = { Day: 0, Night: 0 };
        const locationSet = new Set();
        const instructions = [];
        let totalManpower = 0;
        let safetyTrue = 0;

        filteredReports.forEach(r => {
            // Weather & Environment
            const w = r.data?.weather || 'Sunny';
            weatherMap[w] = (weatherMap[w] || 0) + 1;

            // Agency & Logistics
            const agency = r.agencyName || 'Contractor N/A';
            agencyMap[agency] = (agencyMap[agency] || 0) + 1;

            // Shift Distribution
            if (r.shift) shiftMap[r.shift] = (shiftMap[r.shift] || 0) + 1;

            // Location Span
            if (r.location) locationSet.add(r.location);

            // Material Aggregation - Dynamic Categories
            r.data?.materialDetails?.forEach(mat => {
                if (!mat.name) return;
                const qty = parseFloat(mat.quantity) || 0;
                materialMap[mat.name] = (materialMap[mat.name] || 0) + qty;
            });

            // Manpower Aggregation - Dynamic Categories
            r.data?.manpowerItems?.forEach(man => {
                if (!man.category) return;
                const count = parseInt(man.count) || 0;
                manpowerMap[man.category] = (manpowerMap[man.category] || 0) + count;
                totalManpower += count;
            });

            // Machinery Aggregation - Dynamic Categories
            r.data?.machineryItems?.forEach(mach => {
                if (!mach.machineryName) return;
                const count = parseInt(mach.count) || 1;
                machineryMap[mach.machineryName] = (machineryMap[mach.machineryName] || 0) + count;
            });

            // Inspection Logs
            if (r.data?.inspectionInfo) {
                instructions.push({
                    date: r.date,
                    text: r.data.inspectionInfo,
                    inspector: r.inspectorName,
                    id: r.id
                });
            }

            if (r.data?.safetyDeclared) safetyTrue++;
        });

        const materials = Object.entries(materialMap).map(([name, qty]) => ({ name, qty }));
        const maxMat = Math.max(...materials.map(m => m.qty), 1);

        return {
            totalReports: filteredReports.length,
            materials,
            maxMat,
            manpower: Object.entries(manpowerMap).map(([cat, count]) => ({ cat, count })),
            machinery: Object.entries(machineryMap).map(([name, count]) => ({ name, count })),
            weather: Object.entries(weatherMap).map(([condition, count]) => ({ condition, count })),
            agencies: Object.entries(agencyMap).map(([name, count]) => ({ name, count })),
            shifts: shiftMap,
            locations: Array.from(locationSet),
            avgManpower: Math.round(totalManpower / filteredReports.length),
            safetyRate: Math.round((safetyTrue / filteredReports.length) * 100),
            instructions: instructions.slice(0, 5),
            totalProgressItems: filteredReports.reduce((acc, r) => acc + (r.data?.progressItems?.length || 0), 0)
        };
    }, [filteredReports]);

    return (
        <div className="analysis-page animate-fade-in">
            <div className="page-header">
                <h1 className="page-title">Master Project Dashboard</h1>
                <p className="subtitle">Consolidated operational data across all field activities.</p>
            </div>

            {isLoading && (
                <div className="loading-overlay">
                    <div className="loader"></div>
                    <p>Fetching latest data from Google Sheets...</p>
                </div>
            )}

            {/* Comprehensive Controls */}
            <div className="analysis-controls glass-panel">
                <div className="control-group">
                    <label><Search size={14} /> Filter by Tender</label>
                    <select value={selectedTender || ''} onChange={(e) => setSelectedTender(e.target.value)} className="analysis-select">
                        <option value="">All Tenders</option>
                        {uniqueTenders.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>
                <div className="control-group">
                    <label><Calendar size={14} /> From</label>
                    <input type="date" value={dateRange.start} onChange={(e) => setDateRange(p => ({ ...p, start: e.target.value }))} />
                </div>
                <div className="control-group">
                    <label><Calendar size={14} /> To</label>
                    <input type="date" value={dateRange.end} onChange={(e) => setDateRange(p => ({ ...p, end: e.target.value }))} />
                </div>
                <button className="reset-btn" onClick={() => { setSelectedTender(null); setDateRange({ start: '', end: '' }); }}>Reset Fields</button>
            </div>

            {stats ? (
                <>
                    {/* Top KPI Grid */}
                    <div className="analysis-stats-grid">
                        <div className="analysis-card glass-panel">
                            <div className="card-top"><Activity className="text-info" /> <span className="trend positive">ACTIVE</span></div>
                            <h3>{stats.totalReports}</h3>
                            <p>Total Phase Reports</p>
                        </div>
                        <div className="analysis-card glass-panel">
                            <div className="card-top"><Users className="text-success" /> <span className="trend positive">AVG {stats.avgManpower}</span></div>
                            <h3>{stats.manpower.reduce((a, b) => a + b.count, 0)}</h3>
                            <p>Total Workforce Days</p>
                        </div>
                        <div className="analysis-card glass-panel">
                            <div className="card-top"><ClipboardList className="text-accent" /> <span className="trend positive">Live</span></div>
                            <h3>{stats.totalProgressItems}</h3>
                            <p>Work Items Completed</p>
                        </div>
                    </div>

                    <div className="dashboard-layout-complex">
                        {/* Material & Machinery Section */}
                        <div className="dashboard-column">
                            <div className="analysis-section glass-panel">
                                <div className="section-header"><h2><HardHat size={18} /> Material Consumption</h2></div>
                                <div className="detail-list">
                                    {stats.materials.map((m, i) => (
                                        <div key={i} className="detail-row">
                                            <span className="row-label">{m.name}</span>
                                            <span className="row-value">{m.qty}</span>
                                            <div className="row-progress">
                                                <div
                                                    className="row-bar"
                                                    style={{ width: `${(m.qty / stats.maxMat) * 100}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="analysis-section glass-panel">
                                <div className="section-header"><h2><Truck size={18} /> Machinery Fleet Usage</h2></div>
                                <div className="machinery-grid">
                                    {stats.machinery.map((m, i) => (
                                        <div key={i} className="machinery-box">
                                            <span className="machinery-count">{m.count}</span>
                                            <span className="machinery-name">{m.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Manpower & Instructions */}
                        <div className="dashboard-column">
                            <div className="analysis-section glass-panel">
                                <div className="section-header"><h2><Users size={18} /> Workforce Breakdown</h2></div>
                                <div className="manpower-stats">
                                    {stats.manpower.map((m, i) => (
                                        <div key={i} className="manpower-item">
                                            <div className="manpower-info">
                                                <span>{m.cat}</span>
                                                <strong>{m.count}</strong>
                                            </div>
                                            <div className="manpower-bar-bg"><div className="manpower-bar-fill" style={{ height: `${(m.count / stats.manpower.reduce((a, b) => a + b.count, 0)) * 100}%` }}></div></div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="analysis-section glass-panel">
                                <div className="section-header"><h2><Activity size={18} /> Operational Distribution</h2></div>
                                <div className="distribution-grid">
                                    <div className="dist-item">
                                        <span className="dist-label">Total Locations Checked</span>
                                        <span className="dist-value">{stats.locations.length}</span>
                                    </div>
                                    <div className="dist-item">
                                        <span className="dist-label">Day vs Night Count</span>
                                        <span className="dist-value">{stats.shifts.Day}D / {stats.shifts.Night}N</span>
                                    </div>
                                    <div className="dist-item">
                                        <span className="dist-label">Primary Weather</span>
                                        <span className="dist-value">{stats.weather[0]?.condition || 'N/A'}</span>
                                    </div>
                                    <div className="dist-item">
                                        <span className="dist-label">Contracting Agencies</span>
                                        <span className="dist-value">{stats.agencies.length}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="analysis-section glass-panel">
                                <div className="section-header"><h2><MessageSquare size={18} /> Recent Site Instructions</h2></div>
                                <div className="instructions-list">
                                    {stats.instructions.length > 0 ? (
                                        stats.instructions.map((ins, i) => (
                                            <div key={i} className="instruction-card">
                                                <p>"{ins.text}"</p>
                                                <div className="ins-footer">
                                                    <span>{ins.inspector}</span>
                                                    <span>{ins.date}</span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="no-data-text">No instructions recorded in this range.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Full Interactive Timeline */}
                    <div className="analysis-full-section glass-panel">
                        <div className="section-header"><h2><ClipboardList size={18} /> Comprehensive Site Logs</h2></div>
                        <div className="logs-table-wrapper">
                            <table className="logs-table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Location</th>
                                        <th>Shift</th>
                                        <th>Work Summary</th>
                                        <th>Manpower</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredReports.map(r => (
                                        <tr key={r.id}>
                                            <td>{r.date}</td>
                                            <td><div className="loc-cell"><MapPin size={12} /> {r.location}</div></td>
                                            <td className={`shift-${r.shift.toLowerCase()}`}>{r.shift}</td>
                                            <td>{r.data?.progressItems?.[0]?.workDescription}...</td>
                                            <td>{r.data?.manpowerItems?.reduce((a, b) => a + (parseInt(b.count) || 0), 0)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            ) : (
                <div className="no-data-state glass-panel">
                    <Filter size={48} />
                    <h3>No Operational Records</h3>
                    <p>Select a different range to load project analytics.</p>
                </div>
            )}
        </div>
    );
};

export default TenderAnalysis;
