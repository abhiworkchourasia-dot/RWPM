import React, { useEffect, useState } from 'react';
import { Search, CloudSun, Database, Loader2, CheckCircle2 } from 'lucide-react';
import { useReports } from '../../../context/ReportContext';

const Step1BasicInfo = ({ next, formData, setFormData }) => {
    const { masterData, reports } = useReports();
    const [weather, setWeather] = useState('Detecting...');
    const [isFetching, setIsFetching] = useState(false);
    const [detailsFetched, setDetailsFetched] = useState(!!formData.projectName);

    useEffect(() => {
        // Mocking weather API detection
        setTimeout(() => setWeather('Sunny, 24°C'), 1500);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Reset fetch state if tender or date changes
        if (name === 'tenderNo' || name === 'date') {
            setDetailsFetched(false);
        }
    };

    const fetchProjectDetails = () => {
        if (!formData.tenderNo || !formData.date) {
            alert("Please enter both Tender Number and Date to fetch details.");
            return;
        }

        if (!masterData || !masterData.tenders) {
            console.warn("Master data not yet loaded.");
            return;
        }

        setIsFetching(true);

        setTimeout(() => {
            // 1. Fetch Static Project Details
            const tender = masterData.tenders.find(t =>
                t.tenderNo.toLowerCase() === formData.tenderNo.toLowerCase()
            );

            // 2. Check for an Existing Daily Report for this Date + Tender
            const existingReport = reports.find(r =>
                r.tenderNo.toLowerCase() === formData.tenderNo.toLowerCase() &&
                r.date === formData.date
            );

            if (tender) {
                const baseData = {
                    projectName: tender.projectName,
                    agencyName: tender.agencyName,
                    loaNo: tender.loaNo || '',
                    section: tender.section || ''
                };

                if (existingReport) {
                    // Load everything from the existing report
                    setFormData({
                        ...formData,
                        ...baseData,
                        ...existingReport.data, // Merges progressItems, materials, etc.
                        location: existingReport.location || formData.location,
                        shift: existingReport.shift || formData.shift,
                        inspectorName: existingReport.inspectorName || formData.inspectorName,
                        id: existingReport.id // Keep the same ID for updates
                    });
                    alert(`Existing report found for ${formData.date}. Data has been loaded.`);
                } else {
                    // Just load basic project info
                    setFormData({
                        ...formData,
                        ...baseData
                    });
                }
                setDetailsFetched(true);
            } else {
                alert("Tender not found in Master Data. Please enter details manually.");
                setDetailsFetched(true);
            }
            setIsFetching(false);
        }, 800);
    };

    const canProceed = detailsFetched && formData.tenderNo && formData.date && formData.shift && formData.projectName && formData.agencyName && formData.loaNo && formData.section;

    return (
        <div className="step-content">
            <h2 className="step-title">Step 1: Project Initialization</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.875rem' }}>
                Enter Tender Number and Date to fetch the Project Name. Once fetched, you can enter the remaining site details.
            </p>

            <div className="form-grid">
                {/* Primary Search Fields */}
                <div className="form-group">
                    <label>Tender Number</label>
                    <div className="input-with-icon">
                        <Search size={18} />
                        <input
                            name="tenderNo"
                            placeholder="e.g. CORE/RE/GHY/01"
                            value={formData.tenderNo || ''}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>Date of Work</label>
                    <input
                        type="date"
                        name="date"
                        value={formData.date || ''}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group full-width">
                    <button
                        className={`fetch-btn ${(!formData.tenderNo || !formData.date) ? 'disabled' : ''} ${detailsFetched ? 'success' : ''}`}
                        onClick={fetchProjectDetails}
                        disabled={!formData.tenderNo || !formData.date || isFetching}
                    >
                        {isFetching ? <Loader2 className="animate-spin" size={18} /> :
                            detailsFetched ? <CheckCircle2 size={18} /> : <Database size={18} />}
                        {isFetching ? 'Fetching Project Details...' :
                            detailsFetched ? 'Details Applied' : 'Auto-Fetch (Tender + Date)'}
                    </button>
                </div>

                {detailsFetched && (
                    <>
                        <div className="form-group full-width">
                            <label>Project Name (Fetched)</label>
                            <input
                                name="projectName"
                                value={formData.projectName || ''}
                                readOnly
                                className="readonly-input"
                            />
                        </div>

                        <div className="form-group">
                            <label>LOA No.</label>
                            <input
                                name="loaNo"
                                placeholder="Enter LOA Number"
                                value={formData.loaNo || ''}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Agency Name</label>
                            <input
                                name="agencyName"
                                placeholder="Enter Agency Name"
                                value={formData.agencyName || ''}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Section / Site</label>
                            <input
                                name="section"
                                placeholder="e.g. GHY-LKG"
                                value={formData.section || ''}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Location (KM)</label>
                            <input
                                name="location"
                                placeholder="e.g. 142/0-145/0"
                                value={formData.location || ''}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Shift</label>
                            <select name="shift" value={formData.shift || ''} onChange={handleChange}>
                                <option value="">Select Shift</option>
                                <option value="Day">Day Shift</option>
                                <option value="Night">Night Shift</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Weather (Auto-detected)</label>
                            <div className="weather-badge glass-card">
                                <CloudSun size={18} />
                                <span>{weather}</span>
                            </div>
                        </div>
                    </>
                )}
            </div>

            <div className="step-actions">
                <button
                    className="btn-primary"
                    onClick={next}
                    disabled={!canProceed}
                >
                    Next: Progress Detail
                </button>
            </div>

        </div>
    );
};

export default Step1BasicInfo;
