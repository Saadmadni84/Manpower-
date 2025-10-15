import React, { useState } from 'react';
import MainLayout from '../../components/common/Layout/MainLayout';
import SEOHead from '../../components/common/SEOHead/SEOHead';
import Button from '../../components/ui/Button/Button';
import Card from '../../components/ui/Card/Card';
import Badge from '../../components/ui/Badge/Badge';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import styles from './Clients.module.css';

const Clients = () => {
  const { t, isRTL } = useLanguage();
  const [activeFilter, setActiveFilter] = useState('all');

  const clients = [
    {
      id: 1,
      name: 'Saudi Airlines',
      logo: '✈️',
      industry: 'aviation',
      category: 'Airport Operations',
      location: 'Jeddah, Riyadh',
      employees: '500+',
      testimonial: 'Saudi Manpower has been instrumental in providing skilled ground handling and customer service staff. Their professionalism and reliability have significantly improved our operational efficiency.',
      rating: 5,
      author: 'Ahmed Al-Rashid',
      position: 'Operations Manager',
      partnership: '8 Years'
    },
    {
      id: 2,
      name: 'NEOM',
      logo: '🏗️',
      industry: 'construction',
      category: 'Construction & Infrastructure',
      location: 'Tabuk',
      employees: '1,200+',
      testimonial: 'The quality of construction professionals provided by Saudi Manpower is exceptional. Their engineers and skilled workers have been crucial to our mega-project success.',
      rating: 5,
      author: 'Sarah Johnson',
      position: 'Project Director',
      partnership: '3 Years'
    },
    {
      id: 3,
      name: 'Red Sea Global',
      logo: '🏖️',
      industry: 'hospitality',
      category: 'Hospitality & Tourism',
      location: 'Red Sea Coast',
      employees: '800+',
      testimonial: 'From hospitality staff to facility management, Saudi Manpower delivers excellence. Their comprehensive service has been vital to our luxury tourism operations.',
      rating: 5,
      author: 'Mohammed Al-Otaibi',
      position: 'HR Director',
      partnership: '4 Years'
    },
    {
      id: 4,
      name: 'King Fahd International Airport',
      logo: '🛫',
      industry: 'aviation',
      category: 'Airport Operations',
      location: 'Dammam',
      employees: '300+',
      testimonial: 'Saudi Manpower understands the critical nature of airport operations. Their security personnel and ground staff meet the highest industry standards.',
      rating: 5,
      author: 'Fatima Al-Zahra',
      position: 'Security Manager',
      partnership: '6 Years'
    },
    {
      id: 5,
      name: 'SABIC',
      logo: '🏭',
      industry: 'manufacturing',
      category: 'Industrial & Manufacturing',
      location: 'Jubail, Yanbu',
      employees: '600+',
      testimonial: 'The technical expertise and safety consciousness of Saudi Manpower staff have been outstanding. They understand our complex manufacturing requirements.',
      rating: 5,
      author: 'Khalid Al-Mansouri',
      position: 'Plant Manager',
      partnership: '10 Years'
    },
    {
      id: 6,
      name: 'Aramco',
      logo: '🛢️',
      industry: 'energy',
      category: 'Energy & Utilities',
      location: 'Eastern Province',
      employees: '400+',
      testimonial: 'Saudi Manpower provides highly skilled professionals for our energy operations. Their commitment to safety and excellence aligns perfectly with our values.',
      rating: 5,
      author: 'Dr. Abdullah Al-Sheikh',
      position: 'Operations Director',
      partnership: '12 Years'
    }
  ];

  const industries = [
    { id: 'all', name: 'All Industries', icon: '🏢' },
    { id: 'aviation', name: 'Aviation', icon: '✈️' },
    { id: 'construction', name: 'Construction', icon: '🏗️' },
    { id: 'hospitality', name: 'Hospitality', icon: '🏖️' },
    { id: 'manufacturing', name: 'Manufacturing', icon: '🏭' },
    { id: 'energy', name: 'Energy', icon: '🛢️' }
  ];

  const filteredClients = activeFilter === 'all' 
    ? clients 
    : clients.filter(client => client.industry === activeFilter);

  return (
    <MainLayout>
      <SEOHead 
        title="Our Clients - Trusted by Leading Organizations | Saudi Manpower"
        description="Discover why 200+ leading organizations across Saudi Arabia trust Saudi Manpower for their workforce solutions. Read testimonials from our satisfied clients."
        keywords="Saudi Manpower clients, testimonials, satisfied customers, workforce solutions, Saudi Arabia companies"
      />
      
        {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContainer}>
            <div className={styles.heroContent}>
            <div className={styles.heroBadge}>
              <span className={styles.badgeIcon}>🤝</span>
              <span>{t('clients.hero.badge')}</span>
            </div>
            
              <h1 className={styles.heroTitle}>
              {t('clients.hero.title')}
            </h1>
            
            <p className={styles.heroDescription}>
              {t('clients.hero.description')}
            </p>
            
            <div className={styles.heroStats}>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>200+</div>
                <div className={styles.statLabel}>{t('clients.hero.stats.activeClients')}</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>98%</div>
                <div className={styles.statLabel}>{t('clients.hero.stats.satisfaction')}</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>25+</div>
                <div className={styles.statLabel}>{t('clients.hero.stats.partnership')}</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>8</div>
                <div className={styles.statLabel}>{t('clients.hero.stats.industries')}</div>
              </div>
            </div>
            
            <div className={styles.heroActions}>
              <Button variant="primary" size="large" as={Link} to="/contact">
                Become Our Partner
              </Button>
              <Button variant="outline" size="large" as={Link} to="/services">
                View Our Services
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Client Logos */}
      <section className={styles.logosSection}>
        <div className={styles.logosContainer}>
          <div className={styles.logosHeader}>
            <h2 className={styles.sectionTitle}>Our Client Portfolio</h2>
            <p className={styles.sectionDescription}>
              Leading organizations across various industries trust our workforce solutions
            </p>
          </div>
          
          <div className={styles.logosGrid}>
            <div className={styles.logoItem}>
              <div className={styles.logoIcon}>✈️</div>
              <div className={styles.logoName}>Saudi Airlines</div>
            </div>
            <div className={styles.logoItem}>
              <div className={styles.logoIcon}>🏗️</div>
              <div className={styles.logoName}>NEOM</div>
            </div>
            <div className={styles.logoItem}>
              <div className={styles.logoIcon}>🏖️</div>
              <div className={styles.logoName}>Red Sea Global</div>
            </div>
            <div className={styles.logoItem}>
              <div className={styles.logoIcon}>🏭</div>
              <div className={styles.logoName}>SABIC</div>
            </div>
            <div className={styles.logoItem}>
              <div className={styles.logoIcon}>🛢️</div>
              <div className={styles.logoName}>Aramco</div>
            </div>
            <div className={styles.logoItem}>
              <div className={styles.logoIcon}>🏛️</div>
              <div className={styles.logoName}>Ministry of Health</div>
            </div>
            <div className={styles.logoItem}>
              <div className={styles.logoIcon}>🎓</div>
              <div className={styles.logoName}>King Saud University</div>
            </div>
            <div className={styles.logoItem}>
              <div className={styles.logoIcon}>🏥</div>
              <div className={styles.logoName}>King Fahd Hospital</div>
            </div>
            <div className={styles.logoItem}>
              <div className={styles.logoIcon}>🏪</div>
              <div className={styles.logoName}>Alshaya Group</div>
            </div>
            <div className={styles.logoItem}>
              <div className={styles.logoIcon}>🏦</div>
              <div className={styles.logoName}>Al Rajhi Bank</div>
            </div>
            <div className={styles.logoItem}>
              <div className={styles.logoIcon}>🏢</div>
              <div className={styles.logoName}>PIF Companies</div>
            </div>
            <div className={styles.logoItem}>
              <div className={styles.logoIcon}>🏗️</div>
              <div className={styles.logoName}>Binladin Group</div>
            </div>
          </div>
        </div>
      </section>

      {/* Industry Filter */}
      <section className={styles.filterSection}>
        <div className={styles.filterContainer}>
          <div className={styles.filterHeader}>
            <h2 className={styles.sectionTitle}>Client Success Stories</h2>
            <p className={styles.sectionDescription}>
              Discover how we've helped organizations achieve their workforce goals
            </p>
          </div>
          
          <div className={styles.filterTabs}>
            {industries.map((industry) => (
              <button
                key={industry.id}
                className={`${styles.filterTab} ${activeFilter === industry.id ? styles.active : ''}`}
                onClick={() => setActiveFilter(industry.id)}
              >
                <span className={styles.tabIcon}>{industry.icon}</span>
                <span className={styles.tabName}>{industry.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Client Testimonials */}
      <section className={styles.testimonialsSection}>
        <div className={styles.testimonialsContainer}>
          <div className={styles.testimonialsGrid}>
            {filteredClients.map((client) => (
              <Card key={client.id} className={styles.testimonialCard}>
                <div className={styles.testimonialHeader}>
                  <div className={styles.clientLogo}>{client.logo}</div>
                  <div className={styles.clientInfo}>
                    <h3 className={styles.clientName}>{client.name}</h3>
                    <div className={styles.clientDetails}>
                      <Badge variant="secondary">{client.category}</Badge>
                      <span className={styles.clientLocation}>{client.location}</span>
                    </div>
                  </div>
                  <div className={styles.rating}>
                    {[...Array(client.rating)].map((_, i) => (
                      <span key={i} className={styles.star}>⭐</span>
                    ))}
                  </div>
                </div>
                
                <blockquote className={styles.testimonialText}>
                  "{client.testimonial}"
                </blockquote>
                
                <div className={styles.testimonialFooter}>
                  <div className={styles.authorInfo}>
                    <div className={styles.authorName}>{client.author}</div>
                    <div className={styles.authorPosition}>{client.position}</div>
                    <div className={styles.partnership}>Partnership: {client.partnership}</div>
                  </div>
                  <div className={styles.employeeCount}>
                    <div className={styles.employeeNumber}>{client.employees}</div>
                    <div className={styles.employeeLabel}>Staff Supplied</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Partnership Benefits */}
      <section className={styles.benefitsSection}>
        <div className={styles.benefitsContainer}>
          <div className={styles.benefitsHeader}>
            <h2 className={styles.sectionTitle}>Partnership Benefits</h2>
            <p className={styles.sectionDescription}>
              Why leading organizations choose Saudi Manpower as their workforce partner
            </p>
          </div>
          
          <div className={styles.benefitsGrid}>
            <div className={styles.benefitItem}>
              <div className={styles.benefitIcon}>⚡</div>
              <h3 className={styles.benefitTitle}>Rapid Response</h3>
              <p className={styles.benefitDescription}>
                Quick turnaround times with 24-48 hour placement for urgent requirements, 
                minimizing operational disruptions.
              </p>
            </div>
            
            <div className={styles.benefitItem}>
              <div className={styles.benefitIcon}>🎯</div>
              <h3 className={styles.benefitTitle}>Precision Matching</h3>
              <p className={styles.benefitDescription}>
                Advanced screening and matching processes ensure the right fit for every 
                role and organizational culture.
              </p>
            </div>
            
            <div className={styles.benefitItem}>
              <div className={styles.benefitIcon}>🛡️</div>
              <h3 className={styles.benefitTitle}>Compliance Assurance</h3>
              <p className={styles.benefitDescription}>
                Full compliance with Saudi labor laws, visa requirements, and industry-specific 
                regulations and standards.
              </p>
            </div>
            
            <div className={styles.benefitItem}>
              <div className={styles.benefitIcon}>📈</div>
              <h3 className={styles.benefitTitle}>Performance Excellence</h3>
              <p className={styles.benefitDescription}>
                Continuous monitoring and performance management to ensure consistent 
                service quality and productivity.
              </p>
            </div>
            
            <div className={styles.benefitItem}>
              <div className={styles.benefitIcon}>🎓</div>
              <h3 className={styles.benefitTitle}>Skill Development</h3>
              <p className={styles.benefitDescription}>
                Ongoing training and development programs to enhance skills and adapt 
                to changing business requirements.
              </p>
            </div>
            
            <div className={styles.benefitItem}>
              <div className={styles.benefitIcon}>💼</div>
              <h3 className={styles.benefitTitle}>Scalable Solutions</h3>
              <p className={styles.benefitDescription}>
                Flexible workforce solutions that scale with your business needs, 
                from small teams to large-scale deployments.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className={styles.caseStudiesSection}>
        <div className={styles.caseStudiesContainer}>
          <div className={styles.caseStudiesHeader}>
            <h2 className={styles.sectionTitle}>Success Case Studies</h2>
            <p className={styles.sectionDescription}>
              Real results from our partnerships with leading organizations
            </p>
          </div>
          
          <div className={styles.caseStudiesGrid}>
            <Card className={styles.caseStudyCard}>
              <div className={styles.caseStudyHeader}>
                <div className={styles.caseStudyIcon}>✈️</div>
                <div className={styles.caseStudyClient}>Saudi Airlines</div>
              </div>
              <h3 className={styles.caseStudyTitle}>
                Airport Operations Excellence
              </h3>
              <p className={styles.caseStudyDescription}>
                Supplied 500+ skilled professionals for ground handling, security, and customer service operations across 4 major airports.
              </p>
              <div className={styles.caseStudyResults}>
                <div className={styles.resultItem}>
                  <span className={styles.resultNumber}>35%</span>
                  <span className={styles.resultLabel}>Efficiency Increase</span>
                </div>
                <div className={styles.resultItem}>
                  <span className={styles.resultNumber}>500+</span>
                  <span className={styles.resultLabel}>Staff Deployed</span>
                </div>
                <div className={styles.resultItem}>
                  <span className={styles.resultNumber}>4</span>
                  <span className={styles.resultLabel}>Airports Served</span>
                </div>
              </div>
            </Card>
            
            <Card className={styles.caseStudyCard}>
              <div className={styles.caseStudyHeader}>
                <div className={styles.caseStudyIcon}>🏗️</div>
                <div className={styles.caseStudyClient}>NEOM</div>
              </div>
              <h3 className={styles.caseStudyTitle}>
                Mega Construction Workforce
              </h3>
              <p className={styles.caseStudyDescription}>
                Delivered 1,200+ skilled construction workers and engineers for landmark infrastructure projects in the NEOM region.
              </p>
              <div className={styles.caseStudyResults}>
                <div className={styles.resultItem}>
                  <span className={styles.resultNumber}>100%</span>
                  <span className={styles.resultLabel}>On-Time Delivery</span>
                </div>
                <div className={styles.resultItem}>
                  <span className={styles.resultNumber}>1,200+</span>
                  <span className={styles.resultLabel}>Workers Supplied</span>
                </div>
                <div className={styles.resultItem}>
                  <span className={styles.resultNumber}>3</span>
                  <span className={styles.resultLabel}>Years Partnership</span>
                </div>
              </div>
            </Card>
            
            <Card className={styles.caseStudyCard}>
              <div className={styles.caseStudyHeader}>
                <div className={styles.caseStudyIcon}>🏖️</div>
                <div className={styles.caseStudyClient}>Red Sea Global</div>
              </div>
              <h3 className={styles.caseStudyTitle}>
                Luxury Tourism Operations
              </h3>
              <p className={styles.caseStudyDescription}>
                Provided comprehensive hospitality and facility management services for luxury tourism destinations along the Red Sea coast.
              </p>
              <div className={styles.caseStudyResults}>
                <div className={styles.resultItem}>
                  <span className={styles.resultNumber}>98%</span>
                  <span className={styles.resultLabel}>Guest Satisfaction</span>
                </div>
                <div className={styles.resultItem}>
                  <span className={styles.resultNumber}>800+</span>
                  <span className={styles.resultLabel}>Staff Managed</span>
                </div>
                <div className={styles.resultItem}>
                  <span className={styles.resultNumber}>4</span>
                  <span className={styles.resultLabel}>Years Partnership</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContainer}>
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>
              Ready to Join Our Success Stories?
            </h2>
            <p className={styles.ctaDescription}>
              Join 200+ leading organizations who trust Saudi Manpower for their workforce needs. 
              Let's discuss how we can support your business objectives.
            </p>
            <div className={styles.ctaActions}>
              <Button variant="primary" size="large" as={Link} to="/contact">
                Start Partnership
              </Button>
              <Button variant="outline" size="large" as={Link} to="/services">
                View Services
              </Button>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Clients;