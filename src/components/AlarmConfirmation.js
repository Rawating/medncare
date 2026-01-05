import React, { useState } from 'react';

export default function AlarmConfirmation({ alarm, onConfirm, onClose }) {
  const [skipReason, setSkipReason] = useState('');
  const [showSkipReason, setShowSkipReason] = useState(false);

  const handleTaken = () => {
    onConfirm('taken');
  };

  const handleSnooze = () => {
    onConfirm('snooze');
  };

  const handleSkip = () => {
    if (!showSkipReason) {
      setShowSkipReason(true);
      return;
    }
    onConfirm('skipped', skipReason);
  };

  if (!alarm) return null;

  return (
    <>
      <div className="blur-bg-overlay show-popup" onClick={onClose}></div>
      <div className="alarm-confirmation-modal">
        <div className="alarm-confirmation-content">
          <h2>⏰ Medicine Reminder</h2>
          <p className="alarm-medicine-name">{alarm.name}</p>
          <p className="alarm-time">Time to take your medicine!</p>
          
          {!showSkipReason ? (
            <div className="confirmation-actions">
              <button className="btn btn-success" onClick={handleTaken}>
                ✅ Taken
              </button>
              <button className="btn btn-warning" onClick={handleSnooze}>
                ⏰ Snooze (5 min)
              </button>
              <button className="btn btn-danger" onClick={handleSkip}>
                ❌ Skipped
              </button>
            </div>
          ) : (
            <div className="skip-reason-section">
              <label>Reason for skipping (optional)</label>
              <textarea
                value={skipReason}
                onChange={(e) => setSkipReason(e.target.value)}
                placeholder="e.g., Not feeling well, Already took it, etc."
                rows="3"
              />
              <div className="confirmation-actions">
                <button className="btn btn-danger" onClick={handleSkip}>
                  Confirm Skip
                </button>
                <button className="btn btn-secondary" onClick={() => setShowSkipReason(false)}>
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

