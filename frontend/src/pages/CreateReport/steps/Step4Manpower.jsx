import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

const Step4Manpower = ({ next, prev, formData, setFormData }) => {
    const manpowerItems = formData.manpowerItems || [
        { id: '1', category: 'Skilled Labor', count: '' },
        { id: '2', category: 'Unskilled Labor', count: '' },
        { id: '3', category: 'Supervisors', count: '' }
    ];

    const updateItem = (id, field, value) => {
        const updated = manpowerItems.map(item => item.id === id ? { ...item, [field]: value } : item);
        setFormData({ ...formData, manpowerItems: updated });
    };

    const addItem = () => {
        setFormData({
            ...formData,
            manpowerItems: [...manpowerItems, { id: Date.now().toString(), category: '', count: '' }]
        });
    };

    const removeItem = (id) => {
        if (manpowerItems.length === 1) return;
        setFormData({
            ...formData,
            manpowerItems: manpowerItems.filter(item => item.id !== id)
        });
    };

    const totalCount = manpowerItems.reduce((acc, item) => acc + (parseInt(item.count) || 0), 0);

    return (
        <div className="step-content animate-fade-in">
            <h2 className="step-title">Step 4: Manpower Deployment</h2>

            <div className="progress-table-container glass-card">
                <table className="progress-table">
                    <thead>
                        <tr>
                            <th style={{ width: '80px' }}>S.No</th>
                            <th>Category</th>
                            <th>Man Count (Count)</th>
                            <th style={{ width: '50px' }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {manpowerItems.map((item, index) => (
                            <tr key={item.id}>
                                <td className="serial-no" data-label="S.No">{index + 1}</td>
                                <td data-label="Category">
                                    <input
                                        value={item.category}
                                        onChange={(e) => updateItem(item.id, 'category', e.target.value)}
                                        placeholder="e.g. Skilled Labor, SSE"
                                    />
                                </td>
                                <td data-label="Man Count">
                                    <input
                                        type="number"
                                        value={item.count}
                                        onChange={(e) => updateItem(item.id, 'count', e.target.value)}
                                        placeholder="0"
                                    />
                                </td>
                                <td data-label="Action">
                                    <button className="remove-btn" onClick={() => removeItem(item.id)}>
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan="2" style={{ textAlign: 'right', fontWeight: '700', padding: '1rem', color: 'var(--text-main)' }}>Total Manpower:</td>
                            <td style={{ padding: '1rem', fontWeight: '800', color: 'var(--accent)', fontSize: '1.2rem' }}>{totalCount}</td>
                            <td></td>
                        </tr>
                    </tfoot>
                </table>

                <button className="add-row-btn" onClick={addItem}>
                    <Plus size={16} /> Add Category
                </button>
            </div>

            <div className="step-actions">
                <button className="btn-secondary" onClick={prev}>Previous</button>
                <button className="btn-primary" onClick={next}>Next: Machinery</button>
            </div>
        </div>
    );
};

export default Step4Manpower;
