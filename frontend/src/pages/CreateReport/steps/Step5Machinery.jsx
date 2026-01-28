import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useReports } from '../../../context/ReportContext';

const Step5Machinery = ({ next, prev, formData, setFormData }) => {
    const { masterData } = useReports();
    const machineryItems = formData.machineryItems || [
        { id: '1', machineryName: 'Crane', count: '' },
        { id: '2', machineryName: 'Tower Wagon', count: '' }
    ];

    const updateItem = (id, field, value) => {
        const updated = machineryItems.map(item => item.id === id ? { ...item, [field]: value } : item);
        setFormData({ ...formData, machineryItems: updated });
    };

    const addItem = () => {
        setFormData({
            ...formData,
            machineryItems: [...machineryItems, { id: Date.now().toString(), machineryName: '', count: '' }]
        });
    };

    const removeItem = (id) => {
        if (machineryItems.length === 1) return;
        setFormData({
            ...formData,
            machineryItems: machineryItems.filter(item => item.id !== id)
        });
    };

    return (
        <div className="step-content animate-fade-in">
            <h2 className="step-title">Step 5: Machinery Details</h2>

            <div className="progress-table-container glass-card">
                <table className="progress-table">
                    <thead>
                        <tr>
                            <th style={{ width: '80px' }}>S.No</th>
                            <th>Machinery Name</th>
                            <th>Count</th>
                            <th style={{ width: '50px' }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {machineryItems.map((item, index) => (
                            <tr key={item.id}>
                                <td className="serial-no" data-label="S.No">{index + 1}</td>
                                <td data-label="Machinery">
                                    <input
                                        value={item.machineryName}
                                        onChange={(e) => updateItem(item.id, 'machineryName', e.target.value)}
                                        placeholder="e.g. Crane, Winching Machine"
                                        list="machinery-list"
                                    />
                                    <datalist id="machinery-list">
                                        {masterData.machinery.map((m, i) => (
                                            <option key={i} value={m.machineryName}>{m.description}</option>
                                        ))}
                                    </datalist>
                                </td>
                                <td data-label="Count">
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
                </table>

                <button className="add-row-btn" onClick={addItem}>
                    <Plus size={16} /> Add Machinery
                </button>
            </div>

            <div className="step-actions">
                <button className="btn-secondary" onClick={prev}>Previous</button>
                <button className="btn-primary" onClick={next}>Next: Inspection</button>
            </div>
        </div>
    );
};

export default Step5Machinery;
