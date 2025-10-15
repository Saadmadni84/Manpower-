import React from 'react';
import ServiceCard from '../../../components/ui/ServiceCard/ServiceCard';
import IndustryMap from '../../../components/ui/IndustryMap/IndustryMap';
import styles from './ServicesOverview.module.css';

const ServicesOverview = () => {

  const services = [
    {
      icon: '✈️',
      title: 'Airport Operations',
      description: 'Professional staff for airport ground services, passenger assistance, and cargo handling across major Saudi airports.',
      stats: [
        { value: '2,500+', label: 'Airport Staff', percentage: 85 },
        { value: '15', label: 'Airports Served', percentage: 100 },
        { value: '99.2%', label: 'On-time Performance', percentage: 99 }
      ],
      color: '#06b6d4',
      delay: 0
    },
    {
      icon: '🏢',
      title: 'Corporate Offices',
      description: 'Administrative support, reception services, and office management professionals for leading companies.',
      stats: [
        { value: '3,200+', label: 'Office Staff', percentage: 90 },
        { value: '200+', label: 'Corporate Clients', percentage: 95 },
        { value: '24/7', label: 'Support Available', percentage: 100 }
      ],
      color: '#3b82f6',
      delay: 200
    },
    {
      icon: '🍽️',
      title: 'Catering Services',
      description: 'Chefs, kitchen staff, and service personnel for corporate and institutional catering operations.',
      stats: [
        { value: '1,800+', label: 'Catering Staff', percentage: 88 },
        { value: '50+', label: 'Kitchens Managed', percentage: 92 },
        { value: '4.9/5', label: 'Service Rating', percentage: 98 }
      ],
      color: '#10b981',
      delay: 400
    },
    {
      icon: '🔨',
      title: 'Construction',
      description: 'Skilled construction workers, supervisors, and project management professionals for major projects.',
      stats: [
        { value: '2,000+', label: 'Construction Workers', percentage: 82 },
        { value: '150+', label: 'Projects Completed', percentage: 100 },
        { value: '0.02%', label: 'Safety Incident Rate', percentage: 99 }
      ],
      color: '#f97316',
      delay: 600
    }
  ];

  return (
    <section className={styles.servicesOverview} data-section="services">
      <div className="container">
        <div className={styles.header}>
          <h2 className={styles.title}>Industries We Serve</h2>
          <p className={styles.subtitle}>
            Professional manpower solutions across diverse sectors in Saudi Arabia with 25+ years of excellence
          </p>
        </div>

        {/* Service Cards Grid */}
        <div className={styles.servicesGrid}>
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              icon={service.icon}
              title={service.title}
              description={service.description}
              stats={service.stats}
              color={service.color}
              delay={service.delay}
            />
          ))}
        </div>

        {/* Interactive Industry Map */}
        <div className={styles.mapSection}>
          <IndustryMap />
        </div>

        {/* Additional Services List */}
        <div className={styles.additionalServices}>
          <h3 className={styles.additionalTitle}>Additional Specializations</h3>
          <div className={styles.servicesList}>
            <div className={styles.serviceItem} data-category="logistics">
              <span className={styles.serviceIcon}>📦</span>
              <span className={styles.serviceName}>Inventory & Logistics</span>
            </div>
            <div className={styles.serviceItem} data-category="facility">
              <span className={styles.serviceIcon}>🏭</span>
              <span className={styles.serviceName}>Facility Management</span>
            </div>
            <div className={styles.serviceItem} data-category="security">
              <span className={styles.serviceIcon}>🛡️</span>
              <span className={styles.serviceName}>Security Services</span>
            </div>
            <div className={styles.serviceItem} data-category="healthcare">
              <span className={styles.serviceIcon}>🏥</span>
              <span className={styles.serviceName}>Healthcare Support</span>
            </div>
            <div className={styles.serviceItem} data-category="education">
              <span className={styles.serviceIcon}>🎓</span>
              <span className={styles.serviceName}>Educational Services</span>
            </div>
            <div className={styles.serviceItem} data-category="retail">
              <span className={styles.serviceIcon}>🛍️</span>
              <span className={styles.serviceName}>Retail & Hospitality</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesOverview;