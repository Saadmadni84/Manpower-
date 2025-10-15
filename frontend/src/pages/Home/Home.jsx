import React from 'react';
import MainLayout from '../../components/common/Layout/MainLayout';
import SEOHead from '../../components/common/SEOHead/SEOHead';
import Button from '../../components/ui/Button/Button';
import Card from '../../components/ui/Card/Card';
import Badge from '../../components/ui/Badge/Badge';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import styles from './Home.module.css';

const Home = () => {
  const { t, isRTL } = useLanguage();
  
  return (
    <MainLayout>
      <SEOHead 
        title="Saudi Manpower - Leading Workforce Solutions in Saudi Arabia"
        description="25+ years of excellence in manpower supply across Saudi Arabia. Serving 10,000+ professionals in Jeddah, Riyadh, Dammam, and Madina with comprehensive workforce solutions."
        keywords="manpower supply, workforce solutions, Saudi Arabia, employment, recruitment, Jeddah, Riyadh, Dammam, Madina"
      />
      
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContainer}>
          <div className={styles.heroContent}>
            <div className={styles.heroBadge}>
              <span className={styles.badgeIcon}>🏆</span>
              <span>{t('home.hero.stats.experience')}</span>
            </div>
            
            <h1 className={styles.heroTitle}>
              {t('home.hero.title')}
            </h1>
            
            <p className={styles.heroDescription}>
              {t('home.hero.description')}
            </p>
            
            <div className={styles.heroStats}>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>10,000+</div>
                <div className={styles.statLabel}>{t('home.hero.stats.employees')}</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>200+</div>
                <div className={styles.statLabel}>{t('home.hero.stats.clients')}</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>4</div>
                <div className={styles.statLabel}>{t('home.hero.stats.regions')}</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>8</div>
                <div className={styles.statLabel}>{t('home.hero.stats.industries')}</div>
              </div>
            </div>
            
            <div className={styles.heroActions}>
              <Button variant="primary" size="large" as={Link} to="/services">
                {t('home.hero.cta')}
              </Button>
              <Button variant="outline" size="large" as={Link} to="/contact">
                {t('common.getStarted')}
              </Button>
            </div>
          </div>
          
          <div className={styles.heroVisual}>
            <div className={styles.visualCard}>
              <div className={styles.cardHeader}>
                <div className={styles.cardIcon}>👥</div>
                <div className={styles.cardTitle}>{t('home.hero.visual.title')}</div>
              </div>
              <div className={styles.cardStats}>
                <div className={styles.cardStat}>
                  <span className={styles.cardStatNumber}>98%</span>
                  <span className={styles.cardStatLabel}>{t('home.hero.visual.satisfaction')}</span>
                </div>
                <div className={styles.cardStat}>
                  <span className={styles.cardStatNumber}>24/7</span>
                  <span className={styles.cardStatLabel}>{t('home.hero.visual.support')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className={styles.trustSection}>
        <div className={styles.trustContainer}>
          <div className={styles.trustContent}>
            <h2 className={styles.trustTitle}>
              {t('home.trust.title')}
            </h2>
            <p className={styles.trustDescription}>
              {t('home.trust.description')}
            </p>
          </div>
          
          <div className={styles.trustLogos}>
            <div className={styles.logoGrid}>
              <div className={styles.logoItem}>Saudi Airlines</div>
              <div className={styles.logoItem}>NEOM</div>
              <div className={styles.logoItem}>Red Sea Global</div>
              <div className={styles.logoItem}>King Fahd Airport</div>
              <div className={styles.logoItem}>SABIC</div>
              <div className={styles.logoItem}>Aramco</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className={styles.servicesSection} id="services">
        <div className={styles.servicesContainer}>
          <div className={styles.servicesHeader}>
            <h2 className={styles.sectionTitle}>
              {t('home.services.title')}
            </h2>
            <p className={styles.sectionDescription}>
              {t('home.services.subtitle')}
            </p>
          </div>
          
          <div className={styles.servicesGrid}>
            <Card className={styles.serviceCard}>
              <div className={styles.serviceIcon}>✈️</div>
              <h3 className={styles.serviceTitle}>{t('home.services.airport.title')}</h3>
              <p className={styles.serviceDescription}>
                {t('home.services.airport.description')}
              </p>
              <div className={styles.serviceStats}>
                <span className={styles.serviceStat}>{t('home.services.airport.stats.staff')}</span>
                <span className={styles.serviceStat}>{t('home.services.airport.stats.airports')}</span>
              </div>
            </Card>
            
            <Card className={styles.serviceCard}>
              <div className={styles.serviceIcon}>🏢</div>
              <h3 className={styles.serviceTitle}>{t('home.services.corporate.title')}</h3>
              <p className={styles.serviceDescription}>
                {t('home.services.corporate.description')}
              </p>
              <div className={styles.serviceStats}>
                <span className={styles.serviceStat}>{t('home.services.corporate.stats.staff')}</span>
                <span className={styles.serviceStat}>{t('home.services.corporate.stats.companies')}</span>
              </div>
            </Card>
            
            <Card className={styles.serviceCard}>
              <div className={styles.serviceIcon}>🍽️</div>
              <h3 className={styles.serviceTitle}>{t('home.services.catering.title')}</h3>
              <p className={styles.serviceDescription}>
                {t('home.services.catering.description')}
              </p>
              <div className={styles.serviceStats}>
                <span className={styles.serviceStat}>{t('home.services.catering.stats.staff')}</span>
                <span className={styles.serviceStat}>{t('home.services.catering.stats.venues')}</span>
              </div>
            </Card>
            
            <Card className={styles.serviceCard}>
              <div className={styles.serviceIcon}>🏗️</div>
              <h3 className={styles.serviceTitle}>{t('home.services.construction.title')}</h3>
              <p className={styles.serviceDescription}>
                {t('home.services.construction.description')}
              </p>
              <div className={styles.serviceStats}>
                <span className={styles.serviceStat}>{t('home.services.construction.stats.staff')}</span>
                <span className={styles.serviceStat}>{t('home.services.construction.stats.projects')}</span>
              </div>
            </Card>
            
            <Card className={styles.serviceCard}>
              <div className={styles.serviceIcon}>🏭</div>
              <h3 className={styles.serviceTitle}>{t('home.services.facility.title')}</h3>
              <p className={styles.serviceDescription}>
                {t('home.services.facility.description')}
              </p>
              <div className={styles.serviceStats}>
                <span className={styles.serviceStat}>{t('home.services.facility.stats.staff')}</span>
                <span className={styles.serviceStat}>{t('home.services.facility.stats.facilities')}</span>
              </div>
            </Card>
            
            <Card className={styles.serviceCard}>
              <div className={styles.serviceIcon}>📦</div>
              <h3 className={styles.serviceTitle}>{t('home.services.logistics.title')}</h3>
              <p className={styles.serviceDescription}>
                {t('home.services.logistics.description')}
              </p>
              <div className={styles.serviceStats}>
                <span className={styles.serviceStat}>{t('home.services.logistics.stats.staff')}</span>
                <span className={styles.serviceStat}>{t('home.services.logistics.stats.warehouses')}</span>
              </div>
            </Card>
          </div>
          
          <div className={styles.servicesAction}>
            <Button variant="primary" size="large" as={Link} to="/services">
              {t('home.services.viewAll')}
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className={styles.whyChooseSection}>
        <div className={styles.whyChooseContainer}>
          <div className={styles.whyChooseContent}>
            <h2 className={styles.sectionTitle}>
              {t('home.whyChoose.title')}
            </h2>
            <p className={styles.sectionDescription}>
              {t('home.whyChoose.description')}
            </p>
          </div>
          
          <div className={styles.featuresGrid}>
            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>🎯</div>
              <h3 className={styles.featureTitle}>{t('home.whyChoose.features.precision.title')}</h3>
              <p className={styles.featureDescription}>
                {t('home.whyChoose.features.precision.description')}
              </p>
            </div>
            
            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>⚡</div>
              <h3 className={styles.featureTitle}>{t('home.whyChoose.features.rapid.title')}</h3>
              <p className={styles.featureDescription}>
                {t('home.whyChoose.features.rapid.description')}
              </p>
            </div>
            
            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>🛡️</div>
              <h3 className={styles.featureTitle}>{t('home.whyChoose.features.compliance.title')}</h3>
              <p className={styles.featureDescription}>
                {t('home.whyChoose.features.compliance.description')}
              </p>
            </div>
            
            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>📈</div>
              <h3 className={styles.featureTitle}>{t('home.whyChoose.features.support.title')}</h3>
              <p className={styles.featureDescription}>
                {t('home.whyChoose.features.support.description')}
              </p>
            </div>
            
            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>🌍</div>
              <h3 className={styles.featureTitle}>{t('home.whyChoose.features.expertise.title')}</h3>
              <p className={styles.featureDescription}>
                {t('home.whyChoose.features.expertise.description')}
              </p>
            </div>
            
            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>💎</div>
              <h3 className={styles.featureTitle}>{t('home.whyChoose.features.quality.title')}</h3>
              <p className={styles.featureDescription}>
                {t('home.whyChoose.features.quality.description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className={styles.successSection}>
        <div className={styles.successContainer}>
          <div className={styles.successHeader}>
            <h2 className={styles.sectionTitle}>
              {t('home.successStories.title')}
            </h2>
            <p className={styles.sectionDescription}>
              {t('home.successStories.subtitle')}
            </p>
          </div>
          
          <div className={styles.storiesGrid}>
            <Card className={styles.storyCard}>
              <div className={styles.storyHeader}>
                <div className={styles.storyIcon}>✈️</div>
                <div className={styles.storyClient}>{t('home.successStories.stories.airport.title')}</div>
              </div>
              <h3 className={styles.storyTitle}>
                {t('home.successStories.stories.airport.subtitle')}
              </h3>
              <p className={styles.storyDescription}>
                {t('home.successStories.stories.airport.description')}
              </p>
              <div className={styles.storyResults}>
                <div className={styles.resultItem}>
                  <span className={styles.resultNumber}>35%</span>
                  <span className={styles.resultLabel}>{t('home.successStories.stories.airport.stats.efficiency')}</span>
                </div>
                <div className={styles.resultItem}>
                  <span className={styles.resultNumber}>500+</span>
                  <span className={styles.resultLabel}>{t('home.successStories.stories.airport.stats.staff')}</span>
                </div>
              </div>
            </Card>
            
            <Card className={styles.storyCard}>
              <div className={styles.storyHeader}>
                <div className={styles.storyIcon}>🏢</div>
                <div className={styles.storyClient}>{t('home.successStories.stories.corporate.title')}</div>
              </div>
              <h3 className={styles.storyTitle}>
                {t('home.successStories.stories.corporate.subtitle')}
              </h3>
              <p className={styles.storyDescription}>
                {t('home.successStories.stories.corporate.description')}
              </p>
              <div className={styles.storyResults}>
                <div className={styles.resultItem}>
                  <span className={styles.resultNumber}>98%</span>
                  <span className={styles.resultLabel}>{t('home.successStories.stories.corporate.stats.satisfaction')}</span>
                </div>
                <div className={styles.resultItem}>
                  <span className={styles.resultNumber}>150+</span>
                  <span className={styles.resultLabel}>{t('home.successStories.stories.corporate.stats.staff')}</span>
                </div>
              </div>
            </Card>
            
            <Card className={styles.storyCard}>
              <div className={styles.storyHeader}>
                <div className={styles.storyIcon}>🏗️</div>
                <div className={styles.storyClient}>{t('home.successStories.stories.construction.title')}</div>
              </div>
              <h3 className={styles.storyTitle}>
                {t('home.successStories.stories.construction.subtitle')}
              </h3>
              <p className={styles.storyDescription}>
                {t('home.successStories.stories.construction.description')}
              </p>
              <div className={styles.storyResults}>
                <div className={styles.resultItem}>
                  <span className={styles.resultNumber}>100%</span>
                  <span className={styles.resultLabel}>{t('home.successStories.stories.construction.stats.quality')}</span>
                </div>
                <div className={styles.resultItem}>
                  <span className={styles.resultNumber}>800+</span>
                  <span className={styles.resultLabel}>{t('home.successStories.stories.construction.stats.workers')}</span>
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
              {t('home.cta.title')}
            </h2>
            <p className={styles.ctaDescription}>
              {t('home.cta.subtitle')}
            </p>
            <div className={styles.ctaActions}>
              <Button variant="primary" size="large" as={Link} to="/contact">
                {t('home.cta.getStarted')}
              </Button>
              <Button variant="outline" size="large" as={Link} to="/careers">
                {t('home.cta.exploreCareers')}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Home;