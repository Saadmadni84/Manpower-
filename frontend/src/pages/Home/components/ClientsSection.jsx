import React, { useState, useEffect } from 'react';
import Card from '../../../components/ui/Card/Card';
import ClientLogo from '../../../components/ui/ClientLogo';
import { clientIndustries, clientTestimonials, geographicCoverage, performanceMetrics, trustIndicators } from '../../../data/clientsData';
import styles from './ClientsSection.module.css';

const ClientsSection = () => {
  const [activeIndustry, setActiveIndustry] = useState('all');
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Use imported client data
  const clientData = clientIndustries;

  // Use imported testimonials
  const testimonials = clientTestimonials;

  // Key statistics from performance metrics
  const keyStats = [
    { label: "Satisfied Clients", value: "200+", icon: "👥" },
    { label: "Employees Deployed", value: "10,000+", icon: "👷" },
    { label: "Industries Served", value: `${performanceMetrics.industriesServed}+`, icon: "🏭" },
    { label: "Cities Covered", value: performanceMetrics.citiesCovered.toString(), icon: "🏙️" },
    { label: "Contract Value", value: `${performanceMetrics.totalContractValue}M+ SAR`, icon: "💰" },
    { label: "Client Retention", value: `${performanceMetrics.clientRetention}%`, icon: "🔄" }
  ];

  // Use imported geographic data
  const geographicData = geographicCoverage;

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const industries = Object.keys(clientData);
  const currentClients = activeIndustry === 'all' 
    ? Object.values(clientData).flatMap(category => category.clients)
    : clientData[activeIndustry]?.clients || [];

  return (
    <section id="clients" className={styles.clientsSection}>
      {/* Hero Statement */}
      <div className={styles.heroSection}>
        <div className="container">
          <h2 className={styles.primaryHeadline}>
            Trusted by Industry Leaders Across Saudi Arabia
          </h2>
          <p className={styles.subheadline}>
            For 25 years, we've been the preferred manpower partner for leading companies across Jeddah, Riyadh, Dammam, and Madina
          </p>
          <div className={styles.heroStats}>
            <span className={styles.statItem}>200+ Satisfied Clients</span>
            <span className={styles.statDivider}>|</span>
            <span className={styles.statItem}>10,000+ Employees Deployed</span>
            <span className={styles.statDivider}>|</span>
            <span className={styles.statItem}>8 Industries Served</span>
          </div>
        </div>
      </div>

      {/* Key Statistics */}
      <div className={styles.statsSection}>
        <div className="container">
          <div className={styles.statsGrid}>
            {keyStats.map((stat, index) => (
              <div key={index} className={styles.statCard}>
                <div className={styles.statIcon}>{stat.icon}</div>
                <div className={styles.statValue}>{stat.value}</div>
                <div className={styles.statLabel}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Client Logo Showcase */}
      <div className={styles.logoSection}>
        <div className="container">
          <h3 className={styles.sectionTitle}>Our Valued Clients</h3>
          <div className={styles.logoMarquee}>
            <div className={styles.logoContainer}>
              {currentClients.map((client, index) => (
                <ClientLogo
                  key={index}
                  name={client.name}
                  logo={client.logo}
                  location={client.location}
                  industry={clientData[activeIndustry]?.title}
                  contractValue={client.contractValue}
                  duration={client.duration}
                  isVisible={true}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Industry Categories */}
      <div className={styles.industrySection}>
        <div className="container">
          <h3 className={styles.sectionTitle}>Industries We Serve</h3>
          <div className={styles.industryTabs}>
            <button 
              className={`${styles.tab} ${activeIndustry === 'all' ? styles.active : ''}`}
              onClick={() => setActiveIndustry('all')}
            >
              All Industries
            </button>
            {industries.map(industry => (
              <button 
                key={industry}
                className={`${styles.tab} ${activeIndustry === industry ? styles.active : ''}`}
                onClick={() => setActiveIndustry(industry)}
              >
                {clientData[industry].icon} {clientData[industry].title}
              </button>
            ))}
          </div>
          
          {activeIndustry !== 'all' && (
            <div className={styles.industryStats}>
              <div className={styles.industryStat}>
                <span className={styles.industryStatValue}>{clientData[activeIndustry].stats.clients}</span>
                <span className={styles.industryStatLabel}>Active Clients</span>
              </div>
              <div className={styles.industryStat}>
                <span className={styles.industryStatValue}>{clientData[activeIndustry].stats.employees}</span>
                <span className={styles.industryStatLabel}>Deployed Employees</span>
              </div>
              <div className={styles.industryStat}>
                <span className={styles.industryStatValue}>{clientData[activeIndustry].stats.contracts}</span>
                <span className={styles.industryStatLabel}>Active Contracts</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Featured Testimonials */}
      <div className={styles.testimonialsSection}>
        <div className="container">
          <h3 className={styles.sectionTitle}>What Our Clients Say</h3>
          <div className={styles.testimonialContainer}>
            <div className={styles.testimonialCard}>
              <div className={styles.testimonialAvatar}>
                {testimonials[currentTestimonial].avatar}
              </div>
              <div className={styles.testimonialContent}>
                <blockquote className={styles.testimonialQuote}>
                  "{testimonials[currentTestimonial].quote}"
                </blockquote>
                <div className={styles.testimonialAuthor}>
                  <h4 className={styles.authorName}>{testimonials[currentTestimonial].author}</h4>
                  <p className={styles.authorPosition}>{testimonials[currentTestimonial].position}</p>
                  <p className={styles.authorCompany}>{testimonials[currentTestimonial].company}</p>
                </div>
                <div className={styles.testimonialDetails}>
                  <div className={styles.testimonialDetail}>
                    <span className={styles.detailLabel}>Industry:</span>
                    <span className={styles.detailValue}>{testimonials[currentTestimonial].industry}</span>
                  </div>
                  <div className={styles.testimonialDetail}>
                    <span className={styles.detailLabel}>Location:</span>
                    <span className={styles.detailValue}>{testimonials[currentTestimonial].location}</span>
                  </div>
                  <div className={styles.testimonialDetail}>
                    <span className={styles.detailLabel}>Duration:</span>
                    <span className={styles.detailValue}>{testimonials[currentTestimonial].duration}</span>
                  </div>
                  <div className={styles.testimonialDetail}>
                    <span className={styles.detailLabel}>Contract Value:</span>
                    <span className={styles.detailValue}>{testimonials[currentTestimonial].contractValue}</span>
                  </div>
                  <div className={styles.testimonialDetail}>
                    <span className={styles.detailLabel}>Team Size:</span>
                    <span className={styles.detailValue}>{testimonials[currentTestimonial].teamSize}</span>
                  </div>
                  {testimonials[currentTestimonial].achievements && (
                    <div className={styles.achievementsSection}>
                      <h5 className={styles.achievementsTitle}>Key Achievements:</h5>
                      <ul className={styles.achievementsList}>
                        {testimonials[currentTestimonial].achievements.map((achievement, idx) => (
                          <li key={idx} className={styles.achievementItem}>{achievement}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className={styles.testimonialControls}>
              {testimonials.map((_, index) => (
                <button 
                  key={index}
                  className={`${styles.testimonialDot} ${index === currentTestimonial ? styles.active : ''}`}
                  onClick={() => setCurrentTestimonial(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Geographic Coverage */}
      <div className={styles.geographicSection}>
        <div className="container">
          <h3 className={styles.sectionTitle}>Our Geographic Coverage</h3>
          <div className={styles.geographicGrid}>
            {geographicData.map((city, index) => (
              <div key={index} className={styles.cityCard}>
                <div className={styles.cityImage}>
                  <div className={styles.cityPlaceholder}>
                    {city.city}
                  </div>
                </div>
                <div className={styles.cityInfo}>
                  <h4 className={styles.cityName}>{city.city}</h4>
                  <div className={styles.cityStats}>
                    <div className={styles.cityStat}>
                      <span className={styles.cityStatValue}>{city.clients}</span>
                      <span className={styles.cityStatLabel}>Active Clients</span>
                    </div>
                    <div className={styles.cityStat}>
                      <span className={styles.cityStatValue}>{city.employees}</span>
                      <span className={styles.cityStatLabel}>Deployed Employees</span>
                    </div>
                  </div>
                  <div className={styles.citySectors}>
                    {city.sectors.map((sector, sectorIndex) => (
                      <span key={sectorIndex} className={styles.sectorTag}>{sector}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trust Indicators */}
      <div className={styles.trustSection}>
        <div className="container">
          <h3 className={styles.sectionTitle}>Trust & Excellence</h3>
          <div className={styles.trustGrid}>
            {trustIndicators.map((indicator, index) => (
              <div key={index} className={styles.trustCard}>
                <div className={styles.trustIcon}>{indicator.icon}</div>
                <h4 className={styles.trustTitle}>{indicator.title}</h4>
                <p className={styles.trustDescription}>{indicator.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className={styles.ctaSection}>
        <div className="container">
          <div className={styles.ctaContent}>
            <h3 className={styles.ctaTitle}>Join 200+ Satisfied Clients</h3>
            <p className={styles.ctaDescription}>
              Experience the difference that 25 years of excellence makes. Let us be your trusted manpower partner.
            </p>
            <div className={styles.ctaButtons}>
              <button className={styles.primaryCta}>Request Client References</button>
              <button className={styles.secondaryCta}>Schedule Consultation</button>
              <button className={styles.tertiaryCta}>Contact Us Today</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClientsSection;
