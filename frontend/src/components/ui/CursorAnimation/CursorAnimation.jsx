import React, { useState, useEffect } from 'react';
import styles from './CursorAnimation.module.css';

const CursorAnimation = () => {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [cursorType, setCursorType] = useState('default');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateCursorPosition = (e) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };

    const updateCursorType = (e) => {
      const target = e.target;
      
      // Check for specific sections or elements
      if (target.closest('[data-section="construction"]')) {
        setCursorType('construction');
      } else if (target.closest('[data-section="airport"]')) {
        setCursorType('airport');
      } else if (target.closest('[data-section="catering"]')) {
        setCursorType('catering');
      } else if (target.closest('a, button, [role="button"]')) {
        setCursorType('pointer');
      } else {
        setCursorType('default');
      }
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    document.addEventListener('mousemove', updateCursorPosition);
    document.addEventListener('mousemove', updateCursorType);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', updateCursorPosition);
      document.removeEventListener('mousemove', updateCursorType);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const getCursorIcon = () => {
    switch (cursorType) {
      case 'construction':
        return '🔧';
      case 'airport':
        return '✈️';
      case 'catering':
        return '🍽️';
      case 'pointer':
        return '👆';
      default:
        return '💼';
    }
  };

  return (
    <div
      className={`${styles.cursor} ${styles[cursorType]} ${isVisible ? styles.visible : ''}`}
      style={{
        left: cursorPosition.x,
        top: cursorPosition.y,
      }}
    >
      <div className={styles.cursorInner}>
        <span className={styles.cursorIcon}>{getCursorIcon()}</span>
      </div>
      
      {/* Trailing effect */}
      <div className={styles.cursorTrail}></div>
    </div>
  );
};

export default CursorAnimation;
