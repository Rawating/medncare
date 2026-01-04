import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function Tracker() {
  const [items, setItems] = useLocalStorage('medncare_tracker_items', []);
  const [calEntries, setCalEntries] = useLocalStorage('medncare_calendar_v1', []);
  const [formData, setFormData] = useState({
    name: '', dosage: '', unit: 'mg', frequency: 'Once', every: '',
    start_date: '', start_time: '', notes: '', days: []
  });
  const [showCustom, setShowCustom] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Please enter a medicine name.');
      return;
    }
    const item = {
      id: Date.now(),
      ...formData,
      frequency: formData.frequency === 'Custom' && formData.every 
        ? `Every ${formData.every} hrs` 
        : formData.frequency
    };
    setItems([...items, item]);
    setFormData({ name: '', dosage: '', unit: 'mg', frequency: 'Once', every: '', start_date: '', start_time: '', notes: '', days: [] });
    setShowCustom(false);
  };

  const handleAddToCalendar = () => {
    if (!formData.name.trim()) {
      alert('Please enter a medicine name.');
      return;
    }
    const selectedDays = formData.days;
    if (selectedDays.length === 0) {
      alert('Select at least one day for the calendar.');
      return;
    }
    const freqLabel = formData.frequency === 'Custom' && formData.every 
      ? `Every ${formData.every} hrs` 
      : formData.frequency;
    const baseId = Date.now();
    const newEntries = selectedDays.map((day, idx) => ({
      id: `${baseId}-${DAYS.indexOf(day)}-${idx}`,
      day: DAYS.indexOf(day),
      name: formData.name,
      dosage: formData.dosage,
      unit: formData.unit,
      frequency: freqLabel,
      time: formData.start_time,
      createdAt: Date.now()
    }));
    setCalEntries([...calEntries, ...newEntries]);
  };

  const deleteItem = (id) => {
    setItems(items.filter(i => String(i.id) !== String(id)));
  };

  const deleteCalEntry = (id) => {
    setCalEntries(calEntries.filter(x => String(x.id) !== String(id)));
  };

  return (
    <main className="tracker-container">
      <h1 className="tracker-title">Medication Tracker</h1>
      <form className="tracker-card" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Medicine name</label>
          <input 
            type="text" 
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            placeholder="e.g., Amoxicillin" 
            required 
          />
        </div>
        <div className="input-row">
          <div className="form-group input-inline">
            <label>Dosage</label>
            <input 
              type="number" 
              value={formData.dosage}
              onChange={(e) => setFormData({...formData, dosage: e.target.value})}
              min="0" 
              required 
            />
          </div>
          <div className="form-group input-inline">
            <label>Unit</label>
            <select value={formData.unit} onChange={(e) => setFormData({...formData, unit: e.target.value})}>
              <option value="mg">mg</option>
              <option value="ml">ml</option>
              <option value="tablet">tablet</option>
              <option value="capsule">capsule</option>
              <option value="drops">drops</option>
            </select>
          </div>
        </div>
        <div className="input-row">
          <div className="form-group input-inline">
            <label>Frequency</label>
            <select 
              value={formData.frequency}
              onChange={(e) => {
                setFormData({...formData, frequency: e.target.value});
                setShowCustom(e.target.value === 'Custom');
              }}
            >
              <option>Once</option>
              <option>Daily</option>
              <option>Weekly</option>
              <option>Custom</option>
            </select>
          </div>
          {showCustom && (
            <div className="form-group input-inline">
              <label>Every (hours)</label>
              <input 
                type="number" 
                value={formData.every}
                onChange={(e) => setFormData({...formData, every: e.target.value})}
                min="1" 
                max="168" 
              />
            </div>
          )}
        </div>
        <div className="input-row">
          <div className="form-group input-inline">
            <label>Start date</label>
            <input 
              type="date" 
              value={formData.start_date}
              onChange={(e) => setFormData({...formData, start_date: e.target.value})}
            />
          </div>
          <div className="form-group input-inline">
            <label>Time</label>
            <input 
              type="time" 
              value={formData.start_time}
              onChange={(e) => setFormData({...formData, start_time: e.target.value})}
            />
          </div>
        </div>
        <div className="form-group">
          <label>Days of week (for calendar)</label>
          <div className="day-checkboxes">
            {DAYS.map(day => (
              <label key={day}>
                <input 
                  type="checkbox" 
                  checked={formData.days.includes(day)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFormData({...formData, days: [...formData.days, day]});
                    } else {
                      setFormData({...formData, days: formData.days.filter(d => d !== day)});
                    }
                  }}
                />
                {day}
              </label>
            ))}
          </div>
        </div>
        <div className="form-group">
          <label>Notes (optional)</label>
          <textarea 
            value={formData.notes}
            onChange={(e) => setFormData({...formData, notes: e.target.value})}
            rows="3"
          />
        </div>
        <div className="input-row">
          <button type="submit" className="btn btn-primary">Add medication</button>
          <button type="button" className="btn btn-secondary" onClick={handleAddToCalendar}>
            Add to calendar
          </button>
          <button type="reset" className="btn btn-secondary" onClick={() => {
            setFormData({ name: '', dosage: '', unit: 'mg', frequency: 'Once', every: '', start_date: '', start_time: '', notes: '', days: [] });
            setShowCustom(false);
          }}>Clear</button>
        </div>
      </form>
      <section className="tracker-list-section">
        <h2>Your medications</h2>
        <div className="tracker-grid">
          {items.length === 0 ? (
            <div className="tracker-empty">No medications added yet.</div>
          ) : (
            items.map(item => (
              <div key={item.id} className="tracker-item">
                <div className="item-main">
                  <div className="item-title">{item.name}</div>
                  <div className="item-meta">
                    <span className="chip">{item.dosage} {item.unit}</span>
                    <span className="chip">{item.frequency}</span>
                    {item.start_date && <span className="chip">{item.start_date}{item.start_time ? ' @ ' + item.start_time : ''}</span>}
                  </div>
                  {item.notes && <div className="item-notes">{item.notes}</div>}
                </div>
                <div className="item-actions">
                  <button className="btn-small btn-danger" onClick={() => deleteItem(item.id)}>Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
      <section className="calendar-section">
        <h2>Weekly calendar</h2>
        <div className="calendar-grid">
          {DAYS.map((day, idx) => {
            const dayItems = calEntries.filter(e => e.day === idx);
            return (
              <div key={day} className="calendar-day">
                <h3>{day}</h3>
                <div className="calendar-day-list">
                  {dayItems.length === 0 ? (
                    <div className="tracker-empty">No entries</div>
                  ) : (
                    dayItems.map(item => (
                      <div key={item.id} className="calendar-item">
                        <div className="item-main">
                          <div className="item-title">{item.name}</div>
                          <div className="item-meta">
                            <span className="chip">{item.dosage} {item.unit}</span>
                            <span className="chip">{item.frequency}</span>
                            {item.time && <span className="chip">{item.time}</span>}
                          </div>
                        </div>
                        <div className="item-actions">
                          <button className="btn-tiny btn-danger" onClick={() => deleteCalEntry(item.id)}>Delete</button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}

