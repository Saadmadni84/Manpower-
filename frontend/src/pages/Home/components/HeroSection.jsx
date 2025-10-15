import React, { useState, useEffect, useRef } from 'react';
import Button from '../../../components/ui/Button/Button';
import styles from './HeroSection.module.css';

const HeroSection = () => {
  const [currentCounter, setCurrentCounter] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const heroRef = useRef(null);
  
  const counters = [
    { label: 'Years of Excellence', value: '25+', suffix: '' },
    { label: 'Active Employees', value: '10,000+', suffix: '' },
    { label: 'Major Cities', value: '4', suffix: '' }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isVisible) {
      const interval = setInterval(() => {
        setCurrentCounter((prev) => (prev + 1) % counters.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isVisible, counters.length]);

  return (
    <section className={styles.hero} ref={heroRef}>
      {/* Background Video */}
      <div className={styles.videoBackground}>
        {!videoError && (
          <video 
            autoPlay 
            muted 
            loop 
            playsInline
            onError={() => {
              console.log('Video failed to load, using background fallback');
              setVideoError(true);
            }}
          >
            <source src="/videos/workers-industries.mp4" type="video/mp4" />
          </video>
        )}
        <div className={styles.videoOverlay}></div>
      </div>

      {/* Floating Particles */}
      <div className={styles.particles}>
        <div className={styles.particle} data-category="construction"></div>
        <div className={styles.particle} data-category="airport"></div>
        <div className={styles.particle} data-category="catering"></div>
        <div className={styles.particle} data-category="construction"></div>
        <div className={styles.particle} data-category="airport"></div>
        <div className={styles.particle} data-category="catering"></div>
      </div>

      {/* 3D Globe Container */}
      <div className={styles.globeContainer}>
        <div className={styles.globe}>
          <div className={styles.saudiHighlight}></div>
          <div className={styles.workerIcon} data-city="riyadh"></div>
          <div className={styles.workerIcon} data-city="jeddah"></div>
          <div className={styles.workerIcon} data-city="dammam"></div>
          <div className={styles.workerIcon} data-city="madina"></div>
        </div>
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 10 }}>
        <div className={styles.content}>
          {/* Animated Counter */}
          <div className={styles.counterSection}>
            <div className={styles.counterDisplay}>
              <span className={styles.counterValue}>
                {counters[currentCounter].value}
              </span>
              <span className={styles.counterSuffix}>
                {counters[currentCounter].suffix}
              </span>
            </div>
            <div className={styles.counterLabel}>
              {counters[currentCounter].label}
            </div>
            <div className={styles.counterDots}>
              {counters.map((_, index) => (
                <span
                  key={index}
                  className={`${styles.dot} ${
                    index === currentCounter ? styles.active : ''
                  }`}
                ></span>
              ))}
            </div>
          </div>

          {/* Bold Gradient Headline */}
          <h1 className={styles.title}>
            <span className={styles.gradientText}>
              Powering Saudi Arabia's Industries
            </span>
            <span className={styles.highlightText}>for 25 Years</span>
          </h1>

          <p className={styles.subtitle}>
            Leading manpower supply company serving major industries across Saudi Arabia with 10,000+ skilled professionals
          </p>

          {/* Call-to-Action Button */}
          <div className={styles.actions}>
            <Button 
              variant="primary" 
              size="large" 
              className={styles.ctaButton}
            >
              <span className={styles.buttonText}>Discover Our Workforce</span>
              <span className={styles.buttonIcon}>→</span>
            </Button>
            <Button variant="outline" size="large" className={styles.secondaryButton}>
              Watch Our Story
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className={styles.trustIndicators}>
            <div className={styles.trustItem}>
              <span className={styles.trustNumber}>500+</span>
              <span className={styles.trustLabel}>Active Clients</span>
            </div>
            <div className={styles.trustItem}>
              <span className={styles.trustNumber}>99%</span>
              <span className={styles.trustLabel}>Client Satisfaction</span>
            </div>
            <div className={styles.trustItem}>
              <span className={styles.trustNumber}>24/7</span>
              <span className={styles.trustLabel}>Support Available</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className={styles.scrollIndicator}>
        <div className={styles.scrollText}>Scroll to explore</div>
        <div className={styles.scrollArrow}></div>
      </div>
    </section>
  );
};

export default HeroSection;