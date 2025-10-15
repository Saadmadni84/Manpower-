import React, { useState, useEffect, useRef } from 'react';
import styles from './StatsDashboard.module.css';

const stats = [
  {
    id: 'employees',
    label: 'Active Employees',
    value: 10000,
    suffix: '+',
    color: '#3b82f6',
    icon: '👥',
    description: 'Skilled professionals across all industries'
  },
  {
    id: 'clients',
    label: 'Active Clients',
    value: 500,
    suffix: '+',
    color: '#10b981',
    icon: '🏢',
    description: 'Leading companies trust our services'
  },
  {
    id: 'projects',
    label: 'Projects Completed',
    value: 2000,
    suffix: '+',
    color: '#f97316',
    icon: '🏗️',
    description: 'Successful projects delivered on time'
  },
  {
    id: 'cities',
    label: 'Cities Served',
    value: 4,
    suffix: '',
    color: '#06b6d4',
    icon: '🌍',
    description: 'Major cities across Saudi Arabia'
  },
  {
    id: 'years',
    label: 'Years of Excellence',
    value: 25,
    suffix: '+',
    color: '#8b5cf6',
    icon: '⭐',
    description: 'Quarter century of trusted service'
  },
  {
    id: 'satisfaction',
    label: 'Client Satisfaction',
    value: 99,
    suffix: '%',
    color: '#ec4899',
    icon: '💯',
    description: 'Highly satisfied clients and partners'
  }
];

const StatsDashboard = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedStats, setAnimatedStats] = useState({
    employees: 0,
    clients: 0,
    projects: 0,
    cities: 0,
    years: 0,
    satisfaction: 0
  });
  const [hasAnimated, setHasAnimated] = useState(false);
  const dashboardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (dashboardRef.current) {
      observer.observe(dashboardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isVisible && !hasAnimated) {
      setHasAnimated(true);
      
      const animateValue = (key, start, end, duration) => {
        const startTime = performance.now();
        
        const animate = (currentTime) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          
          // Easing function for smooth animation
          const easeOutQuart = 1 - Math.pow(1 - progress, 4);
          const currentValue = Math.floor(start + (end - start) * easeOutQuart);
          
          setAnimatedStats(prev => ({
            ...prev,
            [key]: currentValue
          }));
          
          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            // Ensure final value is exactly the target
            setAnimatedStats(prev => ({
              ...prev,
              [key]: end
            }));
          }
        };
        
        requestAnimationFrame(animate);
      };

      // Animate each stat with different delays
      stats.forEach((stat, index) => {
        setTimeout(() => {
          animateValue(stat.id, 0, stat.value, 2000);
        }, index * 200);
      });
    }
  }, [isVisible, hasAnimated]);

  return (
    <section className={styles.dashboard} ref={dashboardRef}>
      <div className="container">
        <div className={styles.header}>
          <h2 className={styles.title}>Our Impact in Numbers</h2>
          <p className={styles.subtitle}>
            Real-time statistics showcasing our growth and success across Saudi Arabia
          </p>
        </div>

        <div className={styles.statsGrid}>
          {stats.map((stat, index) => (
            <div
              key={stat.id}
              className={`${styles.statCard} ${isVisible ? styles.visible : ''}`}
              style={{ 
                '--delay': `${index * 100}ms`,
                '--color': stat.color 
              }}
            >
              <div className={styles.cardHeader}>
                <div className={styles.iconContainer}>
                  <span className={styles.icon}>{stat.icon}</span>
                  <div className={styles.iconGlow}></div>
                </div>
                
                <div className={styles.statValue}>
                  <span className={styles.number}>
                    {animatedStats[stat.id].toLocaleString()}
                  </span>
                  <span className={styles.suffix}>{stat.suffix}</span>
                </div>
              </div>

              <div className={styles.cardContent}>
                <h3 className={styles.statLabel}>{stat.label}</h3>
                <p className={styles.statDescription}>{stat.description}</p>
                
                {/* Animated Progress Bar */}
                <div className={styles.progressContainer}>
                  <div 
                    className={styles.progressBar}
                    style={{ 
                      width: `${(animatedStats[stat.id] / stat.value) * 100}%`,
                      backgroundColor: stat.color
                    }}
                  ></div>
                </div>

                {/* Sparkline Chart */}
                <div className={styles.sparkline}>
                  <svg viewBox="0 0 100 40" className={styles.chart}>
                    <polyline
                      points="0,30 20,25 40,20 60,15 80,10 100,5"
                      fill="none"
                      stroke={stat.color}
                      strokeWidth="2"
                      className={styles.chartLine}
                    />
                    {[...Array(6)].map((_, i) => (
                      <circle
                        key={i}
                        cx={i * 20}
                        cy={30 - i * 2}
                        r="2"
                        fill={stat.color}
                        className={styles.chartPoint}
                        style={{ 
                          animationDelay: `${index * 100 + i * 100}ms`,
                          opacity: animatedStats[stat.id] > stat.value * (i / 5) ? 1 : 0
                        }}
                      />
                    ))}
                  </svg>
                </div>
              </div>

              {/* Hover Effects */}
              <div className={styles.hoverEffects}>
                <div className={styles.glowRing}></div>
                <div className={styles.particle}></div>
                <div className={styles.particle}></div>
                <div className={styles.particle}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Chart Section */}
        <div className={styles.chartSection}>
          <h3 className={styles.chartTitle}>Growth Over Time</h3>
          <div className={styles.interactiveChart}>
            <div className={styles.chartContainer}>
              <svg viewBox="0 0 800 300" className={styles.mainChart}>
                {/* Grid Lines */}
                <defs>
                  <pattern id="grid" width="40" height="30" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 30" fill="none" stroke="#e2e8f0" strokeWidth="0.5" opacity="0.3" />
                  </pattern>
                </defs>
                <rect width="800" height="300" fill="url(#grid)" />
                
                {/* Data Lines */}
                <polyline
                  points="50,250 150,200 250,180 350,150 450,120 550,100 650,80 750,60"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="3"
                  className={styles.dataLine}
                />
                
                <polyline
                  points="50,280 150,220 250,190 350,160 450,130 550,110 650,90 750,70"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="3"
                  className={styles.dataLine}
                />
                
                {/* Data Points */}
                {[...Array(8)].map((_, i) => (
                  <g key={i}>
                    <circle
                      cx={50 + i * 100}
                      cy={250 - i * 20}
                      r="6"
                      fill="#3b82f6"
                      className={styles.dataPoint}
                      style={{ animationDelay: `${i * 100}ms` }}
                    />
                    <circle
                      cx={50 + i * 100}
                      cy={280 - i * 20}
                      r="6"
                      fill="#10b981"
                      className={styles.dataPoint}
                      style={{ animationDelay: `${i * 100 + 50}ms` }}
                    />
                  </g>
                ))}
              </svg>
            </div>
            
            <div className={styles.chartLegend}>
              <div className={styles.legendItem}>
                <div className={styles.legendColor} style={{ backgroundColor: '#3b82f6' }}></div>
                <span className={styles.legendLabel}>Employees</span>
              </div>
              <div className={styles.legendItem}>
                <div className={styles.legendColor} style={{ backgroundColor: '#10b981' }}></div>
                <span className={styles.legendLabel}>Clients</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsDashboard;
