import React from 'react';
import styles from './ClientLogo.module.css';

const ClientLogo = ({ 
  name, 
  logo, 
  location, 
  industry, 
  contractValue, 
  duration, 
  isVisible = true 
}) => {
  const initials = name
    .split(' ')
    .map(word => word[0])
    .join('')
    .slice(0, 3)
    .toUpperCase();

  return (
    <div 
      className={`${styles.clientLogo} ${isVisible ? styles.visible : styles.hidden}`}
      data-industry={industry}
      data-location={location}
    >
      <div className={styles.logoContainer}>
        {logo ? (
          <img 
            src={logo} 
            alt={`${name} logo`} 
            className={styles.logoImage}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div 
          className={styles.logoPlaceholder}
          style={{ display: logo ? 'none' : 'flex' }}
        >
          {initials}
        </div>
      </div>
      
      <div className={styles.clientInfo}>
        <h4 className={styles.clientName}>{name}</h4>
        <div className={styles.clientDetails}>
          <span className={styles.clientLocation}>
            📍 {location}
          </span>
          {industry && (
            <span className={styles.clientIndustry}>
              🏭 {industry}
            </span>
          )}
          {contractValue && (
            <span className={styles.clientValue}>
              💰 {contractValue}
            </span>
          )}
          {duration && (
            <span className={styles.clientDuration}>
              ⏱️ {duration}
            </span>
          )}
        </div>
      </div>
      
      <div className={styles.hoverOverlay}>
        <div className={styles.overlayContent}>
          <h5 className={styles.overlayTitle}>Partnership Details</h5>
          <div className={styles.overlayDetails}>
            {location && <p>📍 {location}</p>}
            {industry && <p>🏭 {industry}</p>}
            {contractValue && <p>💰 {contractValue}</p>}
            {duration && <p>⏱️ {duration}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientLogo;
