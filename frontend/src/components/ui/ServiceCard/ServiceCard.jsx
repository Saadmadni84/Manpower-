import React, { useState, useRef, useEffect } from 'react';
import styles from './ServiceCard.module.css';

const ServiceCard = ({ 
  icon, 
  title, 
  description, 
  stats, 
  color = '#3b82f6',
  delay = 0 
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleMouseEnter = () => {
    setIsFlipped(true);
  };

  const handleMouseLeave = () => {
    setIsFlipped(false);
  };

  return (
    <div
      ref={cardRef}
      className={`${styles.card} ${isVisible ? styles.visible : ''}`}
      style={{ '--delay': `${delay}ms`, '--color': color }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={`${styles.cardInner} ${isFlipped ? styles.flipped : ''}`}>
        {/* Front of Card */}
        <div className={styles.cardFront}>
          <div className={styles.iconContainer}>
            <div className={styles.icon} style={{ color }}>
              {icon}
            </div>
            <div className={styles.iconGlow} style={{ backgroundColor: `${color}20` }}></div>
          </div>
          
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.description}>{description}</p>
          
          <div className={styles.hoverIndicator}>
            <span>Hover for details</span>
            <div className={styles.arrow}>→</div>
          </div>
        </div>

        {/* Back of Card */}
        <div className={styles.cardBack}>
          <div className={styles.statsContainer}>
            <h4 className={styles.statsTitle}>Key Statistics</h4>
            
            {stats.map((stat, index) => (
              <div key={index} className={styles.statItem}>
                <div className={styles.statValue} style={{ color }}>
                  {stat.value}
                </div>
                <div className={styles.statLabel}>{stat.label}</div>
                <div className={styles.statProgress}>
                  <div 
                    className={styles.progressBar}
                    style={{ 
                      backgroundColor: color,
                      width: `${stat.percentage || 100}%`
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.backActions}>
            <button 
              className={styles.actionButton}
              style={{ borderColor: color, color }}
            >
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Hover Effects */}
      <div className={styles.hoverEffects}>
        <div className={styles.glowRing} style={{ borderColor: color }}></div>
        <div className={styles.particle} style={{ backgroundColor: color }}></div>
        <div className={styles.particle} style={{ backgroundColor: color }}></div>
        <div className={styles.particle} style={{ backgroundColor: color }}></div>
      </div>
    </div>
  );
};

export default ServiceCard;
