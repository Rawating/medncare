import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function AuthModal({ isOpen, onClose }) {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [policy, setPolicy] = useState(false);
  const [error, setError] = useState('');
  const { signup, login } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (searchParams.get('auth') === 'required') {
      setIsSignup(false);
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const formIsSignup = e.target.closest('.form-box').classList.contains('signup');
    try {
      if (formIsSignup) {
        if (!policy) {
          setError('Please agree to the Terms & Conditions.');
          return;
        }
        signup(email, password);
      } else {
        login(email, password);
      }
      onClose();
      setEmail('');
      setPassword('');
      setPolicy(false);
      // Redirect if needed
      const redirect = searchParams.get('redirect');
      if (redirect) {
        navigate(redirect);
      }
    } catch (err) {
      setError(err.message || 'Operation failed.');
    }
  };

  if (!isOpen) return null;

  if (!isOpen) return null;

  return (
    <>
      <div className={`blur-bg-overlay ${isOpen ? 'show-popup' : ''}`} onClick={onClose}></div>
      <div className={`form-popup ${isOpen ? 'show-popup' : ''} ${isSignup ? 'show-signup' : ''}`}>
        <span className="close-btn material-symbols-rounded" onClick={onClose}>close</span>
        <div className="form-box login">
          <div className="form-details">
            <h2>Welcome Back</h2>
            <p>Please log in using your personal information to stay connected with us.</p>
          </div>
          <div className="form-content">
            <h2>LOGIN</h2>
            {error && !isSignup && <div style={{color: 'red', marginBottom: '10px', fontSize: '0.9rem'}}>{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="input-field">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
                <label>Email</label>
              </div>
              <div className="input-field">
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
                <label>Password</label>
              </div>
              <a href="#" className="forgot-pass-link" onClick={(e) => e.preventDefault()}>Forgot password?</a>
              <button type="submit">Log In</button>
            </form>
            <div className="bottom-link">
              Don't have an account? <a href="#" id="signup-link" onClick={(e) => { e.preventDefault(); setIsSignup(true); setError(''); }}>Signup</a>
            </div>
          </div>
        </div>
        <div className="form-box signup">
          <div className="form-details">
            <h2>Create Account</h2>
            <p>To become a part of our community, please sign up using your personal information.</p>
          </div>
          <div className="form-content">
            <h2>SIGNUP</h2>
            {error && isSignup && <div style={{color: 'red', marginBottom: '10px', fontSize: '0.9rem'}}>{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="input-field">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
                <label>Enter your email</label>
              </div>
              <div className="input-field">
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
                <label>Create password</label>
              </div>
              <div className="policy-text">
                <input 
                  type="checkbox" 
                  id="policy" 
                  checked={policy}
                  onChange={(e) => setPolicy(e.target.checked)}
                />
                <label htmlFor="policy">
                  I agree the <a href="#" className="option" onClick={(e) => e.preventDefault()}>Terms & Conditions</a>
                </label>
              </div>
              <button type="submit">Sign Up</button>
            </form>
            <div className="bottom-link">
              Already have an account? <a href="#" id="login-link" onClick={(e) => { e.preventDefault(); setIsSignup(false); setError(''); }}>Login</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

