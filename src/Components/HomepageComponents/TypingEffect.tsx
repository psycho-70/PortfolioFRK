'use client';
import { useState, useEffect } from 'react';

interface TypingEffectProps {
  texts: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  delayBetweenTexts?: number;
  loop?: boolean;
  cursor?: boolean;
  cursorChar?: string;
  className?: string;
}

const TypingEffect = ({ 
  texts, 
  typingSpeed = 100, 
  deletingSpeed = 50, 
  delayBetweenTexts = 2000,
  loop = true,
  cursor = true,
  cursorChar = "|",
  className = ""
}: TypingEffectProps) => {
  const [displayedText, setDisplayedText] = useState<string>('');
  const [textIndex, setTextIndex] = useState<number>(0);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [cursorVisible, setCursorVisible] = useState<boolean>(true);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Cursor blinking effect
  useEffect(() => {
    if (!cursor) return;
    
    const cursorInterval = setInterval(() => {
      setCursorVisible(prev => !prev);
    }, 500);
    
    return () => clearInterval(cursorInterval);
  }, [cursor]);

  // Typing effect
  useEffect(() => {
    if (isPaused) return;

    let typingInterval: NodeJS.Timeout;
    const currentText = texts[textIndex];
    
    if (isDeleting) {
      // Deleting text
      typingInterval = setInterval(() => {
        setDisplayedText(prev => {
          if (prev.length > 0) {
            return prev.slice(0, -1);
          } else {
            setIsDeleting(false);
            // Move to next text or loop back
            if (loop || textIndex < texts.length - 1) {
              setTextIndex(prevIndex => (prevIndex + 1) % texts.length);
            }
            clearInterval(typingInterval);
            setIsPaused(true);
            setTimeout(() => setIsPaused(false), delayBetweenTexts);
            return '';
          }
        });
      }, deletingSpeed);
    } else {
      // Typing text
      typingInterval = setInterval(() => {
        setDisplayedText(prev => {
          if (prev.length < currentText.length) {
            return currentText.slice(0, prev.length + 1);
          } else {
            setIsDeleting(true);
            clearInterval(typingInterval);
            setIsPaused(true);
            setTimeout(() => setIsPaused(false), delayBetweenTexts);
            return prev;
          }
        });
      }, typingSpeed);
    }

    return () => {
      clearInterval(typingInterval);
    };
  }, [textIndex, isDeleting, isPaused, texts, typingSpeed, deletingSpeed, delayBetweenTexts, loop]);

  return (
    <span className={className}>
      {displayedText}
      {cursor && (
        <span style={{ opacity: cursorVisible ? 1 : 0 }}>{cursorChar}</span>
      )}
    </span>
  );
};

export default TypingEffect;