import React from 'react';
import { Link } from 'react-router-dom';
import { useTypewriter } from '../hooks/useTypewriter';

export default function Hero({ onGetStarted }) {
  const typedText = useTypewriter([' Helper', ' Reminder', ' Recorder']);

  return (
    <section className="hero">
      <div className="hero-inner">
        <div className="hero-left">
          <h1>Your Health</h1>
          <p className="hero-typed"><span id="text2">{typedText}</span></p>
          <p className="hero-subtitle">
            <b>MednCare</b> is your all-in-one digital space to take charge of your wellness journey.
            Record your medical history, set smart medication timers, and manage your medicines — all in one place.
          </p>
          <div className="hero-ctas">
            <button id="button-home" className="btn btn-primary" onClick={onGetStarted}>
              Get Started
            </button>
            <Link to="/tracker" className="btn btn-secondary">View Tracker</Link>
          </div>
        </div>
        <div className="hero-right">
          <div className="hero-graphic" aria-hidden="true"></div>
        </div>
      </div>
    </section>
  );
}

