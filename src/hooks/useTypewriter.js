import { useEffect, useState, useRef } from 'react';

export function useTypewriter(words, typingSpeed = 180, deletingSpeed = 100, holdTime = 1400) {
  const [text, setText] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const word = words[wordIndex % words.length];
    
    if (!isDeleting && text === word) {
      timeoutRef.current = setTimeout(() => setIsDeleting(true), holdTime);
    } else if (isDeleting && text === '') {
      setIsDeleting(false);
      setWordIndex((prev) => prev + 1);
      timeoutRef.current = setTimeout(() => {}, typingSpeed);
    } else {
      const nextText = isDeleting ? word.slice(0, text.length - 1) : word.slice(0, text.length + 1);
      setText(nextText);
      timeoutRef.current = setTimeout(() => {}, isDeleting ? deletingSpeed : typingSpeed);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [text, wordIndex, isDeleting, words, typingSpeed, deletingSpeed, holdTime]);

  return text;
}

