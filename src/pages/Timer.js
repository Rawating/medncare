import React, { useState, useEffect, useRef } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { playAlarm, fmtRemaining } from '../utils/alarm';

export default function Timer() {
  const [alarms, setAlarms] = useLocalStorage('medncare_alarms', []);
  const [medicineName, setMedicineName] = useState('');
  const [timeDelay, setTimeDelay] = useState('30');
  const [countdown, setCountdown] = useState('No timer running');
  const countdownIntervalRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      let changed = false;
      const updated = alarms.map(a => {
        if (!a.fired && now >= a.targetTime) {
          a.fired = true;
          try { playAlarm(); } catch {}
          alert(`⏰ Reminder: Time to take your medicine: ${a.name}!`);
          changed = true;
        }
        return a;
      });
      if (changed) setAlarms(updated);
    }, 1000);
    return () => clearInterval(interval);
  }, [alarms, setAlarms]);

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
    const newAlarm = { id: Date.now(), name, targetTime, fired: false, createdAt: Date.now() };
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
        try { playAlarm(); } catch {}
        alert(`⏰ Reminder: Time to take your medicine: ${name}!`);
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
                return (
                  <div key={a.id} className="alarm-item">
                    <div className="item-main">
                      <div className="item-title">{a.name}</div>
                      <div className="item-meta">
                        <span className="chip">
                          Due {new Date(a.targetTime).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                        </span>
                        <span className={`chip ${due ? 'chip-due' : ''}`}>
                          {fmtRemaining(remaining)}
                        </span>
                      </div>
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

