import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthModal from '../components/AuthModal';
import Hero from '../components/Hero';
import Features from '../components/Features';

export default function Home() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get('auth') === 'required') {
      setAuthModalOpen(true);
    }
  }, [searchParams]);

  const handleGetStarted = () => {
    if (isAuthenticated()) {
      navigate('/tracker');
    } else {
      setAuthModalOpen(true);
    }
  };

  return (
    <>
      <Hero onGetStarted={handleGetStarted} />
      <Features />
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </>
  );
}

