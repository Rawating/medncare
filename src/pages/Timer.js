import React, { useState, useEffect, useRef } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { playAlarm, fmtRemaining } from '../utils/alarm';
import AlarmConfirmation from '../components/AlarmConfirmation';

export default function Timer() {
  const [alarms, setAlarms] = useLocalStorage('medncare_alarms', []);
  const [medicineName, setMedicineName] = useState('');
  const [timeDelay, setTimeDelay] = useState('30');
  const [countdown, setCountdown] = useState('No timer running');
  const [activeAlarm, setActiveAlarm] = useState(null);
  const countdownIntervalRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      let changed = false;
      const updated = alarms.map(a => {
        if (!a.fired && !a.status && now >= a.targetTime) {
          a.fired = true;
          try { playAlarm(); } catch {}
          setActiveAlarm(a);
          changed = true;
        }
        return a;
      });
      if (changed) setAlarms(updated);
    }, 1000);
    return () => clearInterval(interval);
  }, [alarms, setAlarms]);

  const handleAlarmConfirm = (status, skipReason = '') => {
    if (!activeAlarm) return;
    
    const updated = alarms.map(a => {
      if (a.id === activeAlarm.id) {
        if (status === 'snooze') {
          // Snooze for 5 minutes
          return { ...a, targetTime: Date.now() + 5 * 60 * 1000, fired: false };
        } else {
          return { ...a, status, skipReason, confirmedAt: Date.now() };
        }
      }
      return a;
    });
    setAlarms(updated);
    setActiveAlarm(null);
  };

  const startTimer = () => {
    const name = medicineName.trim();
    if (!name) {
      alert("Please enter a medicine name.");
      return;
    }
    const delayMins = parseInt(timeDelay, 10);
    if (!Number.isFinite(delayMins) || delayMins <= 0) {
      alert("Please choose a valid delay.");
      return;
    }

    const targetTime = Date.now() + delayMins * 60 * 1000;
    const alarmId = Date.now();
    const newAlarm = { id: alarmId, name, targetTime, fired: false, status: null, createdAt: Date.now() };
    setAlarms([...alarms, newAlarm]);

    let remaining = delayMins * 60;
    clearInterval(countdownIntervalRef.current);
    setCountdown(`⏳ Timer set for ${name}. Counting down...`);

    countdownIntervalRef.current = setInterval(() => {
      remaining--;
      const mins = Math.floor(remaining / 60);
      const secs = String(remaining % 60).padStart(2, '0');
      setCountdown(`Time left for ${name}: ${mins}m ${secs}s`);

      if (remaining <= 0) {
        clearInterval(countdownIntervalRef.current);
        setCountdown(`⏰ Time to take your medicine: ${name}!`);
        // The useEffect will handle showing the confirmation modal
      }
    }, 1000);
  };

  const resetTimer = () => {
    clearInterval(countdownIntervalRef.current);
    setCountdown('Timer reset');
  };

  const deleteAlarm = (id) => {
    setAlarms(alarms.filter(a => String(a.id) !== String(id)));
  };

  return (
    <main className="timer-container">
      <AlarmConfirmation 
        alarm={activeAlarm} 
        onConfirm={handleAlarmConfirm}
        onClose={() => setActiveAlarm(null)}
      />
      <h1 className="timer-title">Medicine Reminder</h1>
      <section className="timer-card">
        <div className="input-row">
          <div className="form-group input-inline">
            <label>Medicine name</label>
            <input 
              type="text" 
              value={medicineName}
              onChange={(e) => setMedicineName(e.target.value)}
              placeholder="e.g., Vitamin D"
            />
          </div>
          <div className="form-group input-inline">
            <label>Reminder in</label>
            <select value={timeDelay} onChange={(e) => setTimeDelay(e.target.value)} id="timeDelay">
              <option value="5">5 minutes</option>
              <option value="10">10 minutes</option>
              <option value="30">30 minutes</option>
              <option value="60">1 hour</option>
              <option value="120">2 hours</option>
            </select>
          </div>
        </div>
        <div className="preset-chips">
          {[5, 10, 30, 60].map(mins => (
            <button 
              key={mins} 
              type="button" 
              className="chip preset" 
              onClick={() => setTimeDelay(String(mins))}
            >
              {mins === 60 ? '1h' : `${mins}m`}
            </button>
          ))}
        </div>
        <div className="countdown-display" id="countdown">{countdown}</div>
        <div className="timer-actions">
          <button id="startBtn" className="btn btn-primary" onClick={startTimer}>Start reminder</button>
          <button id="resetBtn" className="btn btn-secondary" onClick={resetTimer}>Reset</button>
        </div>
      </section>
      <p className="timer-note">Your browser will play a short alarm when it's time.</p>
      <section className="alarm-list-section">
        <h2>Your alarms</h2>
        <div className="alarm-grid">
          {alarms.length === 0 ? (
            <div className="tracker-empty">No alarms added yet.</div>
          ) : (
            alarms
              .sort((a, b) => a.targetTime - b.targetTime)
              .map(a => {
                const due = Date.now() >= a.targetTime;
                const remaining = a.targetTime - Date.now();
                const statusChip = a.status === 'taken' ? 'chip-success' : 
                                 a.status === 'skipped' ? 'chip-danger' : 
                                 a.status === 'snooze' ? 'chip-warning' : '';
                return (
                  <div key={a.id} className="alarm-item">
                    <div className="item-main">
                      <div className="item-title">{a.name}</div>
                      <div className="item-meta">
                        <span className="chip">
                          Due {new Date(a.targetTime).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                        </span>
                        {a.status ? (
                          <span className={`chip ${statusChip}`}>
                            {a.status === 'taken' ? '✅ Taken' : 
                             a.status === 'skipped' ? '❌ Skipped' : 
                             a.status === 'snooze' ? '⏰ Snoozed' : ''}
                          </span>
                        ) : (
                          <span className={`chip ${due ? 'chip-due' : ''}`}>
                            {fmtRemaining(remaining)}
                          </span>
                        )}
                      </div>
                      {a.skipReason && (
                        <div className="item-notes" style={{fontSize: '0.85rem', marginTop: '4px'}}>
                          Reason: {a.skipReason}
                        </div>
                      )}
                    </div>
                    <div className="item-actions">
                      <button className="btn-small btn-danger" onClick={() => deleteAlarm(a.id)}>Delete</button>
                    </div>
                  </div>
                );
              })
          )}
        </div>
      </section>
    </main>
  );
}

