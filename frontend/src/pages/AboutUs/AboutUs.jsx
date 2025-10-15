import React from 'react';
import MainLayout from '../../components/common/Layout/MainLayout';
import SEOHead from '../../components/common/SEOHead/SEOHead';
import Button from '../../components/ui/Button/Button';
import Card from '../../components/ui/Card/Card';
import Badge from '../../components/ui/Badge/Badge';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import styles from './AboutUs.module.css';

const AboutUs = () => {
  const { t, isRTL } = useLanguage();
  
  return (
    <MainLayout>
      <SEOHead 
        title="About Us - Saudi Manpower | 25+ Years of Excellence"
        description="Discover our journey of 25+ years in providing exceptional manpower solutions across Saudi Arabia. Learn about our values, achievements, and commitment to workforce excellence."
        keywords="about Saudi manpower, company history, workforce solutions, Saudi Arabia, 25 years experience"
      />
      
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContainer}>
          <div className={styles.heroContent}>
            <div className={styles.heroBadge}>
              <span className={styles.badgeIcon}>🏆</span>
              <span>{t('about.established')}</span>
            </div>
            
            <h1 className={styles.heroTitle}>
              {t('about.hero.title')}
            </h1>
            
            <p className={styles.heroDescription}>
              {t('about.hero.description')}
            </p>
            
            <div className={styles.heroActions}>
              <Button variant="primary" size="large" as={Link} to="/services">
                {t('about.hero.cta.services')}
              </Button>
              <Button variant="outline" size="large" as={Link} to="/contact">
                {t('about.hero.cta.partner')}
              </Button>
            </div>
          </div>
          
          <div className={styles.heroVisual}>
            <div className={styles.timelineCard}>
              <div className={styles.timelineItem}>
                <div className={styles.timelineYear}>1999</div>
                <div className={styles.timelineTitle}>Company Founded</div>
              </div>
              <div className={styles.timelineItem}>
                <div className={styles.timelineYear}>2005</div>
                <div className={styles.timelineTitle}>1,000 Employees</div>
              </div>
              <div className={styles.timelineItem}>
                <div className={styles.timelineYear}>2015</div>
                <div className={styles.timelineTitle}>100+ Clients</div>
              </div>
              <div className={styles.timelineItem}>
                <div className={styles.timelineYear}>2024</div>
                <div className={styles.timelineTitle}>10,000+ Professionals</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className={styles.storySection}>
        <div className={styles.storyContainer}>
          <div className={styles.storyContent}>
            <h2 className={styles.sectionTitle}>Our Story</h2>
            <p className={styles.sectionDescription}>
              A journey of growth, innovation, and unwavering commitment to excellence
            </p>
          </div>
          
          <div className={styles.storyGrid}>
            <div className={styles.storyText}>
              <h3 className={styles.storySubtitle}>The Beginning</h3>
              <p className={styles.storyParagraph}>
                Founded in 1999 with a vision to transform workforce solutions in Saudi Arabia, 
                we started as a small team of dedicated professionals who believed in the power 
                of quality manpower services. Our founders recognized the growing need for 
                skilled professionals across various industries.
              </p>
              
              <h3 className={styles.storySubtitle}>Growth & Expansion</h3>
              <p className={styles.storyParagraph}>
                Over the years, we've expanded our services from local manpower supply to 
                comprehensive workforce solutions. Today, we serve clients across Jeddah, 
                Riyadh, Dammam, and Madina, providing skilled professionals for 8 major 
                industry sectors.
              </p>
              
              <h3 className={styles.storySubtitle}>Innovation & Excellence</h3>
              <p className={styles.storyParagraph}>
                We've continuously innovated our recruitment processes, implemented advanced 
                screening technologies, and developed specialized training programs. Our 
                commitment to quality has earned us the trust of 200+ leading organizations 
                across Saudi Arabia.
              </p>
            </div>
            
            <div className={styles.storyVisual}>
              <div className={styles.achievementCard}>
                <div className={styles.achievementIcon}>🎯</div>
                <div className={styles.achievementTitle}>Our Mission</div>
                <div className={styles.achievementDescription}>
                  To provide exceptional workforce solutions that drive business success 
                  and create meaningful career opportunities across Saudi Arabia.
                </div>
              </div>
              
              <div className={styles.achievementCard}>
                <div className={styles.achievementIcon}>👁️</div>
                <div className={styles.achievementTitle}>Our Vision</div>
                <div className={styles.achievementDescription}>
                  To be the leading manpower solutions provider in the Middle East, 
                  recognized for excellence, innovation, and positive impact on communities.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values & Culture */}
      <section className={styles.valuesSection}>
        <div className={styles.valuesContainer}>
          <div className={styles.valuesHeader}>
            <h2 className={styles.sectionTitle}>Our Values</h2>
            <p className={styles.sectionDescription}>
              The principles that guide everything we do
            </p>
          </div>
          
          <div className={styles.valuesGrid}>
            <Card className={styles.valueCard}>
              <div className={styles.valueIcon}>🤝</div>
              <h3 className={styles.valueTitle}>Integrity</h3>
              <p className={styles.valueDescription}>
                We conduct business with the highest ethical standards, ensuring 
                transparency and trust in all our relationships.
              </p>
            </Card>
            
            <Card className={styles.valueCard}>
              <div className={styles.valueIcon}>⭐</div>
              <h3 className={styles.valueTitle}>Excellence</h3>
              <p className={styles.valueDescription}>
                We strive for excellence in every aspect of our service, from 
                recruitment to ongoing support and career development.
              </p>
            </Card>
            
            <Card className={styles.valueCard}>
              <div className={styles.valueIcon}>🚀</div>
              <h3 className={styles.valueTitle}>Innovation</h3>
              <p className={styles.valueDescription}>
                We embrace new technologies and methodologies to continuously 
                improve our services and stay ahead of industry trends.
              </p>
            </Card>
            
            <Card className={styles.valueCard}>
              <div className={styles.valueIcon}>🌍</div>
              <h3 className={styles.valueTitle}>Respect</h3>
              <p className={styles.valueDescription}>
                We respect diversity, cultural differences, and individual 
                aspirations, creating an inclusive environment for all.
              </p>
            </Card>
            
            <Card className={styles.valueCard}>
              <div className={styles.valueIcon}>💪</div>
              <h3 className={styles.valueTitle}>Commitment</h3>
              <p className={styles.valueDescription}>
                We are committed to our clients' success and our employees' 
                growth, building long-term partnerships based on mutual trust.
              </p>
            </Card>
            
            <Card className={styles.valueCard}>
              <div className={styles.valueIcon}>🎓</div>
              <h3 className={styles.valueTitle}>Growth</h3>
              <p className={styles.valueDescription}>
                We invest in continuous learning and development, helping 
                individuals and organizations achieve their full potential.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className={styles.leadershipSection}>
        <div className={styles.leadershipContainer}>
          <div className={styles.leadershipHeader}>
            <h2 className={styles.sectionTitle}>Leadership Team</h2>
            <p className={styles.sectionDescription}>
              Experienced professionals leading our mission
            </p>
          </div>
          
          <div className={styles.leadershipGrid}>
            <Card className={styles.leaderCard}>
              <div className={styles.leaderAvatar}>
                <div className={styles.avatarPlaceholder}>👨‍💼</div>
              </div>
              <div className={styles.leaderInfo}>
                <h3 className={styles.leaderName}>Ahmed Al-Rashid</h3>
                <div className={styles.leaderTitle}>Chief Executive Officer</div>
                <p className={styles.leaderBio}>
                  With over 20 years in workforce solutions, Ahmed leads our strategic 
                  vision and drives innovation across all service lines.
                </p>
                <div className={styles.leaderStats}>
                  <span className={styles.leaderStat}>20+ Years</span>
                  <span className={styles.leaderStat}>Strategic Vision</span>
                </div>
              </div>
            </Card>
            
            <Card className={styles.leaderCard}>
              <div className={styles.leaderAvatar}>
                <div className={styles.avatarPlaceholder}>👩‍💼</div>
              </div>
              <div className={styles.leaderInfo}>
                <h3 className={styles.leaderName}>Fatima Al-Zahra</h3>
                <div className={styles.leaderTitle}>Chief Operations Officer</div>
                <p className={styles.leaderBio}>
                  Fatima oversees our operational excellence, ensuring quality service 
                  delivery and efficient workforce management across all locations.
                </p>
                <div className={styles.leaderStats}>
                  <span className={styles.leaderStat}>18+ Years</span>
                  <span className={styles.leaderStat}>Operations</span>
                </div>
              </div>
            </Card>
            
            <Card className={styles.leaderCard}>
              <div className={styles.leaderAvatar}>
                <div className={styles.avatarPlaceholder}>👨‍🎓</div>
              </div>
              <div className={styles.leaderInfo}>
                <h3 className={styles.leaderName}>Mohammed Al-Otaibi</h3>
                <div className={styles.leaderTitle}>Chief Technology Officer</div>
                <p className={styles.leaderBio}>
                  Mohammed drives our digital transformation, implementing cutting-edge 
                  technologies to enhance recruitment and workforce management processes.
                </p>
                <div className={styles.leaderStats}>
                  <span className={styles.leaderStat}>15+ Years</span>
                  <span className={styles.leaderStat}>Technology</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Achievements & Certifications */}
      <section className={styles.achievementsSection}>
        <div className={styles.achievementsContainer}>
          <div className={styles.achievementsHeader}>
            <h2 className={styles.sectionTitle}>Achievements & Certifications</h2>
            <p className={styles.sectionDescription}>
              Recognized excellence in workforce solutions
            </p>
          </div>
          
          <div className={styles.achievementsGrid}>
            <div className={styles.achievementItem}>
              <div className={styles.achievementIcon}>🏅</div>
              <h3 className={styles.achievementTitle}>ISO 9001:2015</h3>
              <p className={styles.achievementDescription}>
                Quality Management System Certification
              </p>
            </div>
            
            <div className={styles.achievementItem}>
              <div className={styles.achievementIcon}>🛡️</div>
              <h3 className={styles.achievementTitle}>ISO 45001:2018</h3>
              <p className={styles.achievementDescription}>
                Occupational Health & Safety Management
              </p>
            </div>
            
            <div className={styles.achievementItem}>
              <div className={styles.achievementIcon}>⭐</div>
              <h3 className={styles.achievementTitle}>Best Manpower Provider 2023</h3>
              <p className={styles.achievementDescription}>
                Saudi HR Excellence Awards
              </p>
            </div>
            
            <div className={styles.achievementItem}>
              <div className={styles.achievementIcon}>🏆</div>
              <h3 className={styles.achievementTitle}>Excellence in Workforce Solutions</h3>
              <p className={styles.achievementDescription}>
                Middle East Business Excellence Awards
              </p>
            </div>
            
            <div className={styles.achievementItem}>
              <div className={styles.achievementIcon}>🎯</div>
              <h3 className={styles.achievementTitle}>98% Client Satisfaction</h3>
              <p className={styles.achievementDescription}>
                Based on annual client feedback surveys
              </p>
            </div>
            
            <div className={styles.achievementItem}>
              <div className={styles.achievementIcon}>📈</div>
              <h3 className={styles.achievementTitle}>25 Years of Excellence</h3>
              <p className={styles.achievementDescription}>
                Continuous service since 1999
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Company Statistics */}
      <section className={styles.statsSection}>
        <div className={styles.statsContainer}>
          <div className={styles.statsHeader}>
            <h2 className={styles.sectionTitle}>By the Numbers</h2>
            <p className={styles.sectionDescription}>
              Our impact across Saudi Arabia
            </p>
          </div>
          
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>👥</div>
              <div className={styles.statNumber}>10,000+</div>
              <div className={styles.statLabel}>Skilled Professionals</div>
              <div className={styles.statDescription}>Currently employed across various industries</div>
            </div>
            
            <div className={styles.statCard}>
              <div className={styles.statIcon}>🏢</div>
              <div className={styles.statNumber}>200+</div>
              <div className={styles.statLabel}>Trusted Clients</div>
              <div className={styles.statDescription}>Leading organizations across Saudi Arabia</div>
            </div>
            
            <div className={styles.statCard}>
              <div className={styles.statIcon}>🏭</div>
              <div className={styles.statNumber}>8</div>
              <div className={styles.statLabel}>Industry Sectors</div>
              <div className={styles.statDescription}>From aviation to corporate excellence</div>
            </div>
            
            <div className={styles.statCard}>
              <div className={styles.statIcon}>📍</div>
              <div className={styles.statNumber}>4</div>
              <div className={styles.statLabel}>Major Cities</div>
              <div className={styles.statDescription}>Jeddah, Riyadh, Dammam, Madina</div>
            </div>
            
            <div className={styles.statCard}>
              <div className={styles.statIcon}>📅</div>
              <div className={styles.statNumber}>25+</div>
              <div className={styles.statLabel}>Years Experience</div>
              <div className={styles.statDescription}>Serving Saudi Arabia since 1999</div>
            </div>
            
            <div className={styles.statCard}>
              <div className={styles.statIcon}>🎓</div>
              <div className={styles.statNumber}>5,000+</div>
              <div className={styles.statLabel}>Training Hours</div>
              <div className={styles.statDescription}>Professional development annually</div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContainer}>
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>
              Ready to Partner with Us?
            </h2>
            <p className={styles.ctaDescription}>
              Join hundreds of organizations who trust Saudi Manpower for their workforce needs. 
              Let's discuss how our 25+ years of experience can benefit your business.
            </p>
            <div className={styles.ctaActions}>
              <Button variant="primary" size="large" as={Link} to="/contact">
                Get Started Today
              </Button>
              <Button variant="outline" size="large" as={Link} to="/careers">
                Explore Careers
              </Button>
            </div>
        </div>
      </div>
      </section>
    </MainLayout>
  );
};

export default AboutUs;