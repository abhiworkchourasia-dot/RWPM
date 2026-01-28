import React from 'react';

const Step6Inspection = ({ next, prev, formData, setFormData }) => {
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="step-content animate-fade-in">
            <h2 className="step-title">Step 6: Inspection & Instructions</h2>

            <div className="form-grid">
                <div className="form-group">
                    <label>Inspector Name</label>
                    <input
                        name="inspectorName"
                        placeholder="Official who inspected site"
                        value={formData.inspectorName || ''}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label>Designation</label>
                    <input
                        name="inspectorDesignation"
                        placeholder="Designation of official"
                        value={formData.inspectorDesignation || ''}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group full-width">
                    <label>Inspection Information / Instructions</label>
                    <textarea
                        name="inspectionInfo"
                        rows="4"
                        placeholder="Enter observations or instructions received during inspection..."
                        value={formData.inspectionInfo || ''}
                        onChange={handleChange}
                    />
                </div>

            </div>

            <div className="step-actions">
                <button className="btn-secondary" onClick={prev}>Previous</button>
                <button className="btn-primary" onClick={next}>
                    Next: Review Report
                </button>
            </div>
        </div>
    );
};

export default Step6Inspection;
