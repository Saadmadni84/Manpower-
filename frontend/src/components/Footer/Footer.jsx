import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaLinkedin, 
  FaFacebook, 
  FaInstagram, 
  FaPhone, 
  FaEnvelope, 
  FaMapMarkerAlt 
} from 'react-icons/fa';
import styles from './Footer.module.css';

const Footer = () => {
  const [footerData, setFooterData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Default footer data (fallback)
  const defaultFooterData = {
    company: {
      name: 'Manpower Excellence Company',
      tagline: '25 Years of Manpower Excellence in Saudi Arabia',
      logo: '/logo.png'
    },
    quickLinks: [
      { label: 'Home', path: '/' },
      { label: 'About Us', path: '/about' },
      { label: 'Our Services', path: '/services' },
      { label: 'Clients', path: '/clients' },
      { label: 'Careers', path: '/careers' },
      { label: 'Contact Us', path: '/contact' }
    ],
    contact: {
      address: 'Riyadh, Kingdom of Saudi Arabia',
      phone: '+966 XX XXX XXXX',
      email: 'info@manpowerexcellence.com'
    },
    socialMedia: [
      { platform: 'LinkedIn', url: 'https://linkedin.com/company/yourcompany', icon: 'linkedin' },
      { platform: 'Facebook', url: 'https://facebook.com/yourcompany', icon: 'facebook' },
      { platform: 'Instagram', url: 'https://instagram.com/yourcompany', icon: 'instagram' }
    ],
    copyright: {
      year: new Date().getFullYear(),
      text: 'All rights reserved.'
    }
  };

  useEffect(() => {
    fetchFooterData();
  }, []);

  const fetchFooterData = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/footer/content`);
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          setFooterData(result.data);
        } else {
          setFooterData(defaultFooterData);
        }
      } else {
        setFooterData(defaultFooterData);
      }
    } catch (error) {
      console.error('Error fetching footer data:', error);
      setFooterData(defaultFooterData);
    } finally {
      setLoading(false);
    }
  };

  const getSocialIcon = (platform) => {
    switch (platform.toLowerCase()) {
      case 'linkedin':
        return <FaLinkedin />;
      case 'facebook':
        return <FaFacebook />;
      case 'instagram':
        return <FaInstagram />;
      default:
        return null;
    }
  };

  if (loading) {
    return null; // Or a loading skeleton
  }

  const data = footerData || defaultFooterData;

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        {/* Company Section */}
        <div className={styles.footerSection}>
          <div className={styles.companyInfo}>
            <div className={styles.logoSection}>
              <img 
                src={data.company.logo} 
                alt={data.company.name} 
                className={styles.logo}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <h3 className={styles.companyName}>{data.company.name}</h3>
            </div>
            <p className={styles.tagline}>{data.company.tagline}</p>
            <p className={styles.description}>
              Trusted partner in delivering exceptional manpower solutions across Saudi Arabia. 
              We connect skilled professionals with leading organizations.
            </p>
          </div>
        </div>

        {/* Quick Links Section */}
        <div className={styles.footerSection}>
          <h4 className={styles.sectionTitle}>Quick Links</h4>
          <ul className={styles.linkList}>
            {data.quickLinks.map((link, index) => (
              <li key={index}>
                <Link to={link.path} className={styles.footerLink}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Section */}
        <div className={styles.footerSection}>
          <h4 className={styles.sectionTitle}>Contact Us</h4>
          <ul className={styles.contactList}>
            <li className={styles.contactItem}>
              <FaMapMarkerAlt className={styles.contactIcon} />
              <span>{data.contact.address}</span>
            </li>
            <li className={styles.contactItem}>
              <FaPhone className={styles.contactIcon} />
              <a href={`tel:${data.contact.phone}`} className={styles.contactLink}>
                {data.contact.phone}
              </a>
            </li>
            <li className={styles.contactItem}>
              <FaEnvelope className={styles.contactIcon} />
              <a href={`mailto:${data.contact.email}`} className={styles.contactLink}>
                {data.contact.email}
              </a>
            </li>
          </ul>
        </div>

        {/* Social Media Section */}
        <div className={styles.footerSection}>
          <h4 className={styles.sectionTitle}>Follow Us</h4>
          <div className={styles.socialMedia}>
            {data.socialMedia.map((social, index) => (
              <a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialIcon}
                aria-label={social.platform}
              >
                {getSocialIcon(social.platform)}
              </a>
            ))}
          </div>
          <p className={styles.socialText}>
            Connect with us on social media for the latest updates and opportunities.
          </p>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className={styles.footerBottom}>
        <div className={styles.divider}></div>
        <p className={styles.copyright}>
          © {data.copyright.year} {data.company.name}. {data.copyright.text}
        </p>
      </div>
    </footer>
  );
};

export default Footer;

