import React, { useState } from 'react';
import MainLayout from '../../components/common/Layout/MainLayout';
import SEOHead from '../../components/common/SEOHead/SEOHead';
import Button from '../../components/ui/Button/Button';
import Card from '../../components/ui/Card/Card';
import Badge from '../../components/ui/Badge/Badge';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import styles from './Services.module.css';

const Services = () => {
  const { t, isRTL } = useLanguage();
  const [activeService, setActiveService] = useState('airport');

  const services = [
    {
      id: 'airport',
      title: 'Airport Operations',
      icon: '✈️',
      description: 'Complete workforce solutions for airport operations, ensuring smooth and efficient aviation services.',
      features: [
        'Ground Handling Agents',
        'Security Personnel',
        'Customer Service Representatives',
        'Baggage Handling Specialists',
        'Airline Support Staff',
        'Customs & Immigration Support'
      ],
      stats: {
        employees: '2,500+',
        clients: '15+',
        locations: '4 Airports'
      },
      locations: ['King Fahd International Airport', 'King Khalid International Airport', 'King Abdulaziz International Airport', 'Prince Mohammed Bin Abdulaziz Airport']
    },
    {
      id: 'construction',
      title: 'Construction & Infrastructure',
      icon: '🏗️',
      description: 'Skilled professionals for construction projects, infrastructure development, and engineering services.',
      features: [
        'Civil Engineers',
        'Construction Workers',
        'Heavy Equipment Operators',
        'Site Supervisors',
        'Safety Officers',
        'Project Coordinators'
      ],
      stats: {
        employees: '3,000+',
        clients: '50+',
        locations: '4 Cities'
      },
      locations: ['NEOM', 'Red Sea Global', 'Qiddiya', 'Riyadh Metro', 'Various Infrastructure Projects']
    },
    {
      id: 'corporate',
      title: 'Corporate Offices',
      icon: '🏢',
      description: 'Professional staffing solutions for corporate environments and business operations.',
      features: [
        'Administrative Assistants',
        'HR Specialists',
        'Accountants',
        'Reception Staff',
        'Data Entry Clerks',
        'Office Managers'
      ],
      stats: {
        employees: '1,800+',
        clients: '150+',
        locations: '4 Cities'
      },
      locations: ['Corporate Towers', 'Government Offices', 'Financial Institutions', 'Consulting Firms', 'Tech Companies']
    },
    {
      id: 'catering',
      title: 'Catering Services',
      icon: '🍽️',
      description: 'Food service professionals for restaurants, hotels, events, and institutional catering.',
      features: [
        'Chefs & Cooks',
        'Kitchen Assistants',
        'Food Service Staff',
        'Catering Supervisors',
        'Nutritionists',
        'Food Safety Officers'
      ],
      stats: {
        employees: '1,200+',
        clients: '75+',
        locations: '50+ Venues'
      },
      locations: ['5-Star Hotels', 'Restaurants', 'Corporate Events', 'Educational Institutions', 'Healthcare Facilities']
    },
    {
      id: 'facility',
      title: 'Facility Management',
      icon: '🏭',
      description: 'Comprehensive facility management services for buildings, complexes, and industrial facilities.',
      features: [
        'Maintenance Technicians',
        'Cleaning Supervisors',
        'Security Guards',
        'HVAC Technicians',
        'Electrical Technicians',
        'Landscaping Staff'
      ],
      stats: {
        employees: '1,500+',
        clients: '100+',
        locations: '200+ Facilities'
      },
      locations: ['Shopping Malls', 'Office Buildings', 'Residential Complexes', 'Industrial Facilities', 'Healthcare Centers']
    },
    {
      id: 'logistics',
      title: 'Logistics & Inventory',
      icon: '📦',
      description: 'Supply chain professionals for warehouse operations, distribution, and inventory management.',
      features: [
        'Warehouse Supervisors',
        'Forklift Operators',
        'Inventory Controllers',
        'Logistics Coordinators',
        'Shipping Clerks',
        'Supply Chain Assistants'
      ],
      stats: {
        employees: '800+',
        clients: '40+',
        locations: '75+ Warehouses'
      },
      locations: ['Distribution Centers', 'E-commerce Warehouses', 'Manufacturing Plants', 'Retail Chains', 'Import/Export Facilities']
    }
  ];

  const selectedService = services.find(service => service.id === activeService);

  return (
    <MainLayout>
      <SEOHead 
        title="Services - Comprehensive Workforce Solutions | Saudi Manpower"
        description="Professional workforce solutions across 8 industries in Saudi Arabia. From airport operations to corporate excellence, we provide skilled professionals for your business needs."
        keywords="workforce solutions, manpower services, airport operations, construction, corporate staffing, catering, facility management, logistics, Saudi Arabia"
      />
      
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContainer}>
          <div className={styles.heroContent}>
            <div className={styles.heroBadge}>
              <span className={styles.badgeIcon}>🏭</span>
              <span>8 Industry Sectors</span>
            </div>
            
            <h1 className={styles.heroTitle}>
              Comprehensive 
              <span className={styles.highlight}> Workforce Solutions</span>
            </h1>
            
            <p className={styles.heroDescription}>
              From specialized airport operations to corporate excellence, we provide 
              skilled professionals across 8 key industries, serving businesses 
              throughout Saudi Arabia with unmatched expertise and reliability.
            </p>
            
            <div className={styles.heroStats}>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>8</div>
                <div className={styles.statLabel}>Industry Sectors</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>10,000+</div>
                <div className={styles.statLabel}>Skilled Professionals</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>200+</div>
                <div className={styles.statLabel}>Active Clients</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>25+</div>
                <div className={styles.statLabel}>Years Experience</div>
              </div>
            </div>
            
            <div className={styles.heroActions}>
              <Button variant="primary" size="large" as={Link} to="/contact">
                Get Custom Quote
              </Button>
              <Button variant="outline" size="large" as={Link} to="/careers">
                Join Our Team
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className={styles.servicesOverview}>
        <div className={styles.servicesContainer}>
          <div className={styles.servicesHeader}>
            <h2 className={styles.sectionTitle}>{t('services.portfolio.title')}</h2>
            <p className={styles.sectionDescription}>
              {t('services.portfolio.description')}
            </p>
          </div>
          
          <div className={styles.servicesGrid}>
            {services.map((service) => (
              <Card 
                key={service.id}
                className={`${styles.serviceCard} ${activeService === service.id ? styles.active : ''}`}
                onClick={() => setActiveService(service.id)}
              >
                <div className={styles.serviceIcon}>{service.icon}</div>
                <h3 className={styles.serviceTitle}>{service.title}</h3>
                <p className={styles.serviceDescription}>{service.description}</p>
                <div className={styles.serviceStats}>
                  <div className={styles.serviceStat}>
                    <span className={styles.serviceStatNumber}>{service.stats.employees}</span>
                    <span className={styles.serviceStatLabel}>{t('services.stats.staff')}</span>
                  </div>
                  <div className={styles.serviceStat}>
                    <span className={styles.serviceStatNumber}>{service.stats.clients}</span>
                    <span className={styles.serviceStatLabel}>{t('services.stats.clients')}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Service View */}
      <section className={styles.serviceDetail}>
        <div className={styles.detailContainer}>
          <div className={styles.detailHeader}>
            <div className={styles.detailIcon}>{selectedService?.icon}</div>
            <div className={styles.detailTitle}>
              <h2>{selectedService?.title}</h2>
              <p>{selectedService?.description}</p>
            </div>
          </div>
          
          <div className={styles.detailContent}>
            <div className={styles.detailFeatures}>
              <h3 className={styles.featuresTitle}>{t('services.detail.positions')}</h3>
              <div className={styles.featuresGrid}>
                {selectedService?.features.map((feature, index) => (
                  <div key={index} className={styles.featureItem}>
                    <span className={styles.featureIcon}>✓</span>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className={styles.detailStats}>
              <h3 className={styles.statsTitle}>{t('services.detail.statistics')}</h3>
              <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                  <div className={styles.statIcon}>👥</div>
                  <div className={styles.statNumber}>{selectedService?.stats.employees}</div>
                  <div className={styles.statLabel}>{t('services.detail.activeStaff')}</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statIcon}>🏢</div>
                  <div className={styles.statNumber}>{selectedService?.stats.clients}</div>
                  <div className={styles.statLabel}>{t('services.detail.clientCompanies')}</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statIcon}>📍</div>
                  <div className={styles.statNumber}>{selectedService?.stats.locations}</div>
                  <div className={styles.statLabel}>{t('services.detail.serviceLocations')}</div>
                </div>
              </div>
            </div>
            
            <div className={styles.detailLocations}>
              <h3 className={styles.locationsTitle}>{t('services.detail.locations')}</h3>
              <div className={styles.locationsGrid}>
                {selectedService?.locations.map((location, index) => (
                  <div key={index} className={styles.locationItem}>
                    <span className={styles.locationIcon}>📍</span>
                    <span>{location}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Process */}
      <section className={styles.processSection}>
        <div className={styles.processContainer}>
          <div className={styles.processHeader}>
            <h2 className={styles.sectionTitle}>Our Service Process</h2>
            <p className={styles.sectionDescription}>
              A streamlined approach to delivering exceptional workforce solutions
            </p>
          </div>
          
          <div className={styles.processSteps}>
            <div className={styles.processStep}>
              <div className={styles.stepNumber}>1</div>
              <div className={styles.stepContent}>
                <h3 className={styles.stepTitle}>Requirements Analysis</h3>
                <p className={styles.stepDescription}>
                  We analyze your specific workforce needs, including skill requirements, 
                  quantity, timeline, and location preferences.
                </p>
              </div>
            </div>
            
            <div className={styles.processStep}>
              <div className={styles.stepNumber}>2</div>
              <div className={styles.stepContent}>
                <h3 className={styles.stepTitle}>Talent Sourcing</h3>
                <p className={styles.stepDescription}>
                  Our recruitment team sources qualified candidates from our extensive 
                  database and active recruitment channels.
                </p>
              </div>
            </div>
            
            <div className={styles.processStep}>
              <div className={styles.stepNumber}>3</div>
              <div className={styles.stepContent}>
                <h3 className={styles.stepTitle}>Screening & Selection</h3>
                <p className={styles.stepDescription}>
                  Comprehensive screening including interviews, skill assessments, 
                  background checks, and compliance verification.
                </p>
              </div>
            </div>
            
            <div className={styles.processStep}>
              <div className={styles.stepNumber}>4</div>
              <div className={styles.stepContent}>
                <h3 className={styles.stepTitle}>Deployment</h3>
                <p className={styles.stepDescription}>
                  Rapid deployment of qualified professionals to your location with 
                  complete documentation and onboarding support.
                </p>
              </div>
            </div>
            
            <div className={styles.processStep}>
              <div className={styles.stepNumber}>5</div>
              <div className={styles.stepContent}>
                <h3 className={styles.stepTitle}>Ongoing Support</h3>
                <p className={styles.stepDescription}>
                  Continuous monitoring, performance management, and support services 
                  to ensure optimal workforce performance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Benefits */}
      <section className={styles.benefitsSection}>
        <div className={styles.benefitsContainer}>
          <div className={styles.benefitsHeader}>
            <h2 className={styles.sectionTitle}>Why Choose Our Services?</h2>
            <p className={styles.sectionDescription}>
              Comprehensive benefits that deliver value beyond expectations
            </p>
          </div>
          
          <div className={styles.benefitsGrid}>
            <div className={styles.benefitItem}>
              <div className={styles.benefitIcon}>⚡</div>
              <h3 className={styles.benefitTitle}>Rapid Deployment</h3>
              <p className={styles.benefitDescription}>
                24-48 hour placement for urgent requirements with minimal disruption to your operations.
              </p>
            </div>
            
            <div className={styles.benefitItem}>
              <div className={styles.benefitIcon}>🎯</div>
              <h3 className={styles.benefitTitle}>Precision Matching</h3>
              <p className={styles.benefitDescription}>
                Advanced matching algorithms ensure the right fit for every role and company culture.
              </p>
            </div>
            
            <div className={styles.benefitItem}>
              <div className={styles.benefitIcon}>🛡️</div>
              <h3 className={styles.benefitTitle}>Full Compliance</h3>
              <p className={styles.benefitDescription}>
                Complete adherence to Saudi labor laws, visa requirements, and industry regulations.
              </p>
            </div>
            
            <div className={styles.benefitItem}>
              <div className={styles.benefitIcon}>📈</div>
              <h3 className={styles.benefitTitle}>Performance Monitoring</h3>
              <p className={styles.benefitDescription}>
                Regular performance reviews and feedback systems to maintain service quality.
              </p>
            </div>
            
            <div className={styles.benefitItem}>
              <div className={styles.benefitIcon}>🎓</div>
              <h3 className={styles.benefitTitle}>Training & Development</h3>
              <p className={styles.benefitDescription}>
                Ongoing training programs to enhance skills and adapt to changing requirements.
              </p>
            </div>
            
            <div className={styles.benefitItem}>
              <div className={styles.benefitIcon}>💰</div>
              <h3 className={styles.benefitTitle}>Cost Optimization</h3>
              <p className={styles.benefitDescription}>
                Flexible pricing models that optimize costs while maintaining service quality.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Industry Expertise */}
      <section className={styles.expertiseSection}>
        <div className={styles.expertiseContainer}>
          <div className={styles.expertiseHeader}>
            <h2 className={styles.sectionTitle}>Industry Expertise</h2>
            <p className={styles.sectionDescription}>
              Deep understanding of sector-specific requirements and challenges
            </p>
          </div>
          
          <div className={styles.expertiseGrid}>
            <div className={styles.expertiseCard}>
              <div className={styles.expertiseIcon}>🏛️</div>
              <h3 className={styles.expertiseTitle}>Government & Public Sector</h3>
              <p className={styles.expertiseDescription}>
                Specialized staffing for government offices, ministries, and public institutions 
                with full compliance to public sector requirements.
              </p>
              <div className={styles.expertiseStats}>
                <span>50+ Government Clients</span>
                <span>25+ Years Experience</span>
              </div>
            </div>
            
            <div className={styles.expertiseCard}>
              <div className={styles.expertiseIcon}>🏭</div>
              <h3 className={styles.expertiseTitle}>Industrial & Manufacturing</h3>
              <p className={styles.expertiseDescription}>
                Skilled workforce for manufacturing plants, industrial facilities, and production 
                lines with safety-first approach.
              </p>
              <div className={styles.expertiseStats}>
                <span>100+ Industrial Clients</span>
                <span>5,000+ Industrial Staff</span>
              </div>
            </div>
            
            <div className={styles.expertiseCard}>
              <div className={styles.expertiseIcon}>🏥</div>
              <h3 className={styles.expertiseTitle}>Healthcare & Medical</h3>
              <p className={styles.expertiseDescription}>
                Professional medical and healthcare support staff with specialized training 
                and certification requirements.
              </p>
              <div className={styles.expertiseStats}>
                <span>30+ Healthcare Clients</span>
                <span>500+ Medical Staff</span>
              </div>
            </div>
            
            <div className={styles.expertiseCard}>
              <div className={styles.expertiseIcon}>🎓</div>
              <h3 className={styles.expertiseTitle}>Education & Training</h3>
              <p className={styles.expertiseDescription}>
                Educational support staff, administrative personnel, and specialized trainers 
                for academic institutions.
              </p>
              <div className={styles.expertiseStats}>
                <span>40+ Educational Clients</span>
                <span>300+ Education Staff</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContainer}>
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>
              Ready to Transform Your Workforce?
            </h2>
            <p className={styles.ctaDescription}>
              Let's discuss how our specialized workforce solutions can meet your unique 
              business requirements and drive operational excellence.
            </p>
            <div className={styles.ctaActions}>
              <Button variant="primary" size="large" as={Link} to="/contact">
                Get Custom Quote
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

export default Services;