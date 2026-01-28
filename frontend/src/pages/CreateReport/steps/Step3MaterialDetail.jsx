import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useReports } from '../../../context/ReportContext';

const Step3MaterialDetail = ({ next, prev, formData, setFormData }) => {
    const { masterData } = useReports();
    const materials = formData.materialDetails || [{ id: Date.now(), name: '', quantity: '' }];

    const updateItem = (id, field, value) => {
        const updated = materials.map(item => item.id === id ? { ...item, [field]: value } : item);
        setFormData({ ...formData, materialDetails: updated });
    };

    const addItem = () => {
        setFormData({
            ...formData,
            materialDetails: [...materials, { id: Date.now(), name: '', quantity: '' }]
        });
    };

    const removeItem = (id) => {
        if (materials.length === 1) return;
        setFormData({
            ...formData,
            materialDetails: materials.filter(item => item.id !== id)
        });
    };

    return (
        <div className="step-content animate-fade-in">
            <h2 className="step-title">Step 3: Material Detail</h2>

            <div className="progress-table-container glass-card">
                <table className="progress-table">
                    <thead>
                        <tr>
                            <th style={{ width: '80px' }}>S.No</th>
                            <th>Material Name</th>
                            <th>Quantity</th>
                            <th style={{ width: '50px' }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {materials.map((item, index) => (
                            <tr key={item.id}>
                                <td className="serial-no" data-label="S.No">{index + 1}</td>
                                <td data-label="Material Name">
                                    <input
                                        value={item.name}
                                        onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                                        placeholder="e.g. OHE Mast, Contact Wire"
                                        list="material-list"
                                    />
                                    <datalist id="material-list">
                                        {masterData.materials.map((m, i) => (
                                            <option key={i} value={m.materialName}>{m.unit}</option>
                                        ))}
                                    </datalist>
                                </td>
                                <td data-label="Quantity">
                                    <input
                                        value={item.quantity}
                                        onChange={(e) => updateItem(item.id, 'quantity', e.target.value)}
                                        placeholder="e.g. 10 Nos, 500m"
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
                    <Plus size={16} /> Add Material
                </button>
            </div>

            <div className="step-actions">
                <button className="btn-secondary" onClick={prev}>Previous</button>
                <button className="btn-primary" onClick={next}>Next: Manpower</button>
            </div>
        </div>
    );
};

export default Step3MaterialDetail;
