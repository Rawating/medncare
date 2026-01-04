import React from 'react';

export default function Features() {
  return (
    <section className="features" aria-label="Key features">
      <div className="feature-grid">
        <div className="feature-card">
          <div className="feature-icon" aria-hidden="true">📝</div>
          <h3>Record History</h3>
          <p>Easily log and revisit prescriptions, treatments, symptoms, and more — safely in one place.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon" aria-hidden="true">⏰</div>
          <h3>Smart Timers</h3>
          <p>Never miss a dose. Set medicine reminders tailored to your routine.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon" aria-hidden="true">🔐</div>
          <h3>Secure Account</h3>
          <p>Sign up or log in to access your personalized health dashboard anywhere.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon" aria-hidden="true">💊</div>
          <h3>Track Medications</h3>
          <p>Add, view, and update the medicines you're taking — from one-offs to daily routines.</p>
        </div>
      </div>
    </section>
  );
}

