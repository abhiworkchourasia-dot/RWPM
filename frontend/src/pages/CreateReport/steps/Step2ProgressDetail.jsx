import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

const Step2ProgressDetail = ({ next, prev, formData, setFormData }) => {
  const progressItems = formData.progressItems || [{ id: Date.now(), workDescription: '', doneTillToday: '' }];

  const updateItem = (id, field, value) => {
    const updated = progressItems.map(item => item.id === id ? { ...item, [field]: value } : item);
    setFormData({ ...formData, progressItems: updated });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      progressItems: [...progressItems, { id: Date.now(), workDescription: '', doneTillToday: '' }]
    });
  };

  const removeItem = (id) => {
    if (progressItems.length === 1) return;
    setFormData({
      ...formData,
      progressItems: progressItems.filter(item => item.id !== id)
    });
  };

  return (
    <div className="step-content animate-fade-in">
      <h2 className="step-title">Step 2: Progress Detail</h2>

      <div className="progress-table-container glass-card">
        <table className="progress-table">
          <thead>
            <tr>
              <th style={{ width: '80px' }}>S.No</th>
              <th>Work Description</th>
              <th>Done Till Today</th>
              <th style={{ width: '50px' }}></th>
            </tr>
          </thead>
          <tbody>
            {progressItems.map((item, index) => (
              <tr key={item.id}>
                <td className="serial-no" data-label="S.No">{index + 1}</td>
                <td data-label="Work Description">
                  <input
                    value={item.workDescription}
                    onChange={(e) => updateItem(item.id, 'workDescription', e.target.value)}
                    placeholder="Brief description of work"
                  />
                </td>
                <td data-label="Done Till Today">
                  <input
                    value={item.doneTillToday}
                    onChange={(e) => updateItem(item.id, 'doneTillToday', e.target.value)}
                    placeholder="Status/Progress"
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
          <Plus size={16} /> Add Row
        </button>
      </div>

      <div className="step-actions">
        <button className="btn-secondary" onClick={prev}>Previous</button>
        <button className="btn-primary" onClick={next}>Next: Material Detail</button>
      </div>
    </div>
  );
};

export default Step2ProgressDetail;
