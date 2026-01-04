import React, { useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

export default function Records() {
  const [records, setRecords] = useLocalStorage('medncare_records', []);
  const [formData, setFormData] = useState({
    type: 'Blood Pressure',
    date: '',
    time: '',
    sys: '', dia: '', pulse: '',
    value: '', unit: '',
    label: '', other_value: '',
    notes: ''
  });
  const [fieldType, setFieldType] = useState('bp');

  useEffect(() => {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const hh = String(now.getHours()).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');
    setFormData(prev => ({
      ...prev,
      date: `${yyyy}-${mm}-${dd}`,
      time: `${hh}:${min}`
    }));
  }, []);

  useEffect(() => {
    const t = formData.type;
    if (t === 'Blood Pressure') {
      setFieldType('bp');
    } else if (['Blood Sugar', 'Weight', 'Temperature'].includes(t)) {
      setFieldType('value');
    } else {
      setFieldType('other');
    }
  }, [formData.type]);

  const handleSubmit = (e) => {
    e.preventDefault();
    let details = '';

    if (formData.type === 'Blood Pressure') {
      if (!formData.sys || !formData.dia) {
        alert('Enter systolic and diastolic values.');
        return;
      }
      details = `${formData.sys}/${formData.dia} mmHg${formData.pulse ? `, ${formData.pulse} bpm` : ''}`;
    } else if (['Blood Sugar', 'Weight', 'Temperature'].includes(formData.type)) {
      if (!formData.value) {
        alert('Enter a value.');
        return;
      }
      details = `${formData.value}${formData.unit ? ' ' + formData.unit : ''}`;
    } else {
      if (!formData.label || !formData.other_value) {
        alert('Enter label and value.');
        return;
      }
      details = `${formData.label}: ${formData.other_value}`;
    }

    const dt = formData.date ? new Date(`${formData.date}T${formData.time || '00:00'}`) : new Date();
    const rec = {
      id: Date.now(),
      type: formData.type,
      details,
      notes: formData.notes,
      datetime: dt.getTime()
    };
    setRecords([...records, rec]);
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const hh = String(now.getHours()).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');
    setFormData({
      type: 'Blood Pressure', date: `${yyyy}-${mm}-${dd}`, time: `${hh}:${min}`, sys: '', dia: '', pulse: '',
      value: '', unit: '', label: '', other_value: '', notes: ''
    });
  };

  const deleteRecord = (id) => {
    setRecords(records.filter(r => String(r.id) !== String(id)));
  };

  return (
    <main className="records-container">
      <h1 className="records-title">Past Health Records</h1>
      <form className="centered-form records-card" onSubmit={handleSubmit}>
        <div className="input-row">
          <div className="form-group input-inline">
            <label>Record type</label>
            <select 
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
              id="record-type"
              required
            >
              <option>Blood Pressure</option>
              <option>Blood Sugar</option>
              <option>Weight</option>
              <option>Temperature</option>
              <option>Other</option>
            </select>
          </div>
          <div className="form-group input-inline">
            <label>Date</label>
            <input 
              type="date" 
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              id="record-date"
              required
            />
          </div>
          <div className="form-group input-inline">
            <label>Time</label>
            <input 
              type="time" 
              value={formData.time}
              onChange={(e) => setFormData({...formData, time: e.target.value})}
              id="record-time"
            />
          </div>
        </div>

        {fieldType === 'bp' && (
          <div className="input-row" id="bp-fields">
            <div className="form-group input-inline">
              <label>Systolic (mmHg)</label>
              <input 
                type="number" 
                value={formData.sys}
                onChange={(e) => setFormData({...formData, sys: e.target.value})}
                id="sys"
                min="50" 
                max="300" 
                placeholder="e.g., 120"
              />
            </div>
            <div className="form-group input-inline">
              <label>Diastolic (mmHg)</label>
              <input 
                type="number" 
                value={formData.dia}
                onChange={(e) => setFormData({...formData, dia: e.target.value})}
                id="dia"
                min="30" 
                max="200" 
                placeholder="e.g., 80"
              />
            </div>
            <div className="form-group input-inline">
              <label>Pulse (bpm)</label>
              <input 
                type="number" 
                value={formData.pulse}
                onChange={(e) => setFormData({...formData, pulse: e.target.value})}
                id="pulse"
                min="20" 
                max="220" 
                placeholder="optional"
              />
            </div>
          </div>
        )}

        {fieldType === 'value' && (
          <div className="input-row" id="value-fields">
            <div className="form-group input-inline">
              <label>Value</label>
              <input 
                type="number" 
                value={formData.value}
                onChange={(e) => setFormData({...formData, value: e.target.value})}
                id="value"
                step="0.1" 
                placeholder="e.g., 98.6"
              />
            </div>
            <div className="form-group input-inline">
              <label>Unit</label>
              <input 
                type="text" 
                value={formData.unit}
                onChange={(e) => setFormData({...formData, unit: e.target.value})}
                id="unit"
                placeholder={
                  formData.type === 'Blood Sugar' ? 'mg/dL or mmol/L' :
                  formData.type === 'Weight' ? 'kg or lb' : '°C or °F'
                }
              />
            </div>
          </div>
        )}

        {fieldType === 'other' && (
          <div className="input-row" id="other-fields">
            <div className="form-group input-inline">
              <label>Label</label>
              <input 
                type="text" 
                value={formData.label}
                onChange={(e) => setFormData({...formData, label: e.target.value})}
                id="label"
                placeholder="e.g., Cholesterol"
              />
            </div>
            <div className="form-group input-inline">
              <label>Value</label>
              <input 
                type="text" 
                value={formData.other_value}
                onChange={(e) => setFormData({...formData, other_value: e.target.value})}
                id="other-value"
                placeholder="e.g., 180 mg/dL"
              />
            </div>
          </div>
        )}

        <div className="form-group">
          <label>Notes (optional)</label>
          <textarea 
            value={formData.notes}
            onChange={(e) => setFormData({...formData, notes: e.target.value})}
            id="rec-notes"
            rows="3"
          />
        </div>

        <div className="input-row">
          <button type="submit" className="btn btn-primary">Add record</button>
          <button type="reset" className="btn btn-secondary" onClick={() => {
            const now = new Date();
            const yyyy = now.getFullYear();
            const mm = String(now.getMonth() + 1).padStart(2, '0');
            const dd = String(now.getDate()).padStart(2, '0');
            const hh = String(now.getHours()).padStart(2, '0');
            const min = String(now.getMinutes()).padStart(2, '0');
            setFormData({
              type: 'Blood Pressure', date: `${yyyy}-${mm}-${dd}`, time: `${hh}:${min}`, sys: '', dia: '', pulse: '',
              value: '', unit: '', label: '', other_value: '', notes: ''
            });
          }}>Clear</button>
        </div>
      </form>

      <section className="records-table-section">
        <h2>Your past records</h2>
        <div className="table-wrap">
          <table className="records-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Details</th>
                <th>Notes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="records-tbody">
              {records.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{textAlign: 'center', padding: '20px', color: 'var(--muted)'}}>
                    No records added yet.
                  </td>
                </tr>
              ) : (
                records
                  .slice()
                  .sort((a, b) => b.datetime - a.datetime)
                  .map(r => {
                    const when = new Date(r.datetime).toLocaleString([], {
                      year: 'numeric', month: 'short', day: '2-digit',
                      hour: '2-digit', minute: '2-digit'
                    });
                    return (
                      <tr key={r.id}>
                        <td>{when}</td>
                        <td>{r.type}</td>
                        <td>{r.details}</td>
                        <td>{r.notes || ''}</td>
                        <td>
                          <button className="btn-small btn-danger" onClick={() => deleteRecord(r.id)}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

