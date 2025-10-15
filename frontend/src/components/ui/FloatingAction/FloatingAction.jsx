import React, { useState, useEffect } from 'react';
import styles from './FloatingAction.module.css';

const FloatingAction = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentPosition = window.pageYOffset;
      setScrollPosition(currentPosition);
      setIsVisible(currentPosition > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const handleQuickAction = (action) => {
    // Handle different quick actions
    switch (action) {
      case 'job':
        // Navigate to job application
        window.location.href = '/careers';
        break;
      case 'quote':
        // Open contact form or quote modal
        window.location.href = '/contact';
        break;
      case 'chat':
        // Open live chat
        console.log('Opening live chat...');
        break;
      default:
        break;
    }
    setIsExpanded(false);
  };

  const getButtonText = () => {
    if (scrollPosition < 1000) return 'Apply for Job';
    if (scrollPosition < 2000) return 'Get Quote';
    return 'Contact Us';
  };

  const getButtonIcon = () => {
    if (scrollPosition < 1000) return '💼';
    if (scrollPosition < 2000) return '💰';
    return '📞';
  };

  if (!isVisible) return null;

  return (
    <div className={styles.floatingContainer}>
      {/* Quick Action Buttons */}
      <div className={`${styles.quickActions} ${isExpanded ? styles.expanded : ''}`}>
        <button
          className={`${styles.quickButton} ${styles.jobButton}`}
          onClick={() => handleQuickAction('job')}
          title="Apply for Job"
        >
          <span className={styles.quickIcon}>💼</span>
          <span className={styles.quickLabel}>Apply for Job</span>
        </button>

        <button
          className={`${styles.quickButton} ${styles.quoteButton}`}
          onClick={() => handleQuickAction('quote')}
          title="Get Quote"
        >
          <span className={styles.quickIcon}>💰</span>
          <span className={styles.quickLabel}>Get Quote</span>
        </button>

        <button
          className={`${styles.quickButton} ${styles.chatButton}`}
          onClick={() => handleQuickAction('chat')}
          title="Live Chat"
        >
          <span className={styles.quickIcon}>💬</span>
          <span className={styles.quickLabel}>Live Chat</span>
        </button>
      </div>

      {/* Main Floating Action Button */}
      <button
        className={`${styles.fab} ${isExpanded ? styles.expanded : ''}`}
        onClick={toggleExpanded}
        title={getButtonText()}
      >
        <div className={styles.fabContent}>
          <span className={styles.fabIcon}>{getButtonIcon()}</span>
          <span className={styles.fabText}>{getButtonText()}</span>
        </div>
        
        {/* Ripple Effect */}
        <div className={styles.ripple}></div>
        
        {/* Pulse Animation */}
        <div className={styles.pulse}></div>
      </button>

      {/* Scroll Progress Indicator */}
      <div className={styles.scrollProgress}>
        <div 
          className={styles.progressBar}
          style={{ height: `${(scrollPosition / document.documentElement.scrollHeight) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

export default FloatingAction;
