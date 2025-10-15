import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import styles from './Footer.module.css';

const FooterSocialMedia = () => {
  const { language } = useLanguage();

  const socialLinks = [
    {
      platform: 'Facebook',
      url: 'https://facebook.com/saudimanpower',
      icon: 'facebook',
      color: '#1877F2',
      followers: '2.5K'
    },
    {
      platform: 'Twitter',
      url: 'https://twitter.com/saudimanpower',
      icon: 'twitter',
      color: '#1DA1F2',
      followers: '1.8K'
    },
    {
      platform: 'LinkedIn',
      url: 'https://linkedin.com/company/saudimanpower',
      icon: 'linkedin',
      color: '#0077B5',
      followers: '3.2K'
    },
    {
      platform: 'Instagram',
      url: 'https://instagram.com/saudimanpower',
      icon: 'instagram',
      color: '#E4405F',
      followers: '1.5K'
    },
    {
      platform: 'YouTube',
      url: 'https://youtube.com/saudimanpower',
      icon: 'youtube',
      color: '#FF0000',
      followers: '890'
    },
    {
      platform: 'WhatsApp',
      url: 'https://wa.me/966501234569',
      icon: 'whatsapp',
      color: '#25D366',
      followers: 'Business'
    }
  ];

  return (
    <div className={styles.socialMediaBar}>
      <div className="container">
        <div className={styles.socialContent}>
          {/* Social Media Header */}
          <div className={styles.socialHeader}>
            <h3 className={styles.socialTitle}>
              {language === 'en' ? 'Follow Us' : 'تابعنا'}
            </h3>
            <p className={styles.socialDescription}>
              {language === 'en' 
                ? 'Stay connected with us on social media for the latest updates and news'
                : 'ابق متصلاً معنا على وسائل التواصل الاجتماعي للحصول على أحدث التحديثات والأخبار'
              }
            </p>
          </div>

          {/* Social Media Links */}
          <div className={styles.socialLinks}>
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                style={{ '--social-color': social.color }}
                title={`${language === 'en' ? 'Follow us on' : 'تابعنا على'} ${social.platform}`}
              >
                <div className={styles.socialIcon}>
                  <span className="material-icons">{social.icon}</span>
                </div>
                <div className={styles.socialInfo}>
                  <span className={styles.socialPlatform}>{social.platform}</span>
                  <span className={styles.socialFollowers}>{social.followers}</span>
                </div>
                <div className={styles.socialArrow}>
                  <span className="material-icons">open_in_new</span>
                </div>
              </a>
            ))}
          </div>

          {/* Social Media Stats */}
          <div className={styles.socialStats}>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>10K+</span>
              <span className={styles.statLabel}>
                {language === 'en' ? 'Total Followers' : 'إجمالي المتابعين'}
              </span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>500+</span>
              <span className={styles.statLabel}>
                {language === 'en' ? 'Posts Shared' : 'منشورات مشاركة'}
              </span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>98%</span>
              <span className={styles.statLabel}>
                {language === 'en' ? 'Engagement Rate' : 'معدل التفاعل'}
              </span>
            </div>
          </div>

          {/* Recent Posts Preview */}
          <div className={styles.recentPosts}>
            <h4 className={styles.postsTitle}>
              {language === 'en' ? 'Recent Updates' : 'التحديثات الأخيرة'}
            </h4>
            <div className={styles.postsList}>
              <div className={styles.postItem}>
                <span className="material-icons">newspaper</span>
                <div className={styles.postContent}>
                  <span className={styles.postText}>
                    {language === 'en' 
                      ? 'New job opportunities in aviation sector' 
                      : 'فرص عمل جديدة في قطاع الطيران'
                    }
                  </span>
                  <span className={styles.postTime}>2 hours ago</span>
                </div>
              </div>
              <div className={styles.postItem}>
                <span className="material-icons">event</span>
                <div className={styles.postContent}>
                  <span className={styles.postText}>
                    {language === 'en' 
                      ? 'Career fair happening this weekend' 
                      : 'معرض وظائف هذا الأسبوع'
                    }
                  </span>
                  <span className={styles.postTime}>1 day ago</span>
                </div>
              </div>
              <div className={styles.postItem}>
                <span className="material-icons">emoji_events</span>
                <div className={styles.postContent}>
                  <span className={styles.postText}>
                    {language === 'en' 
                      ? 'Company wins Best Employer Award' 
                      : 'الشركة تفوز بجائزة أفضل صاحب عمل'
                    }
                  </span>
                  <span className={styles.postTime}>3 days ago</span>
                </div>
              </div>
            </div>
          </div>

          {/* Social Media CTA */}
          <div className={styles.socialCTA}>
            <p className={styles.ctaText}>
              {language === 'en' 
                ? 'Join our community and be the first to know about new opportunities!'
                : 'انضم إلى مجتمعنا وكن أول من يعرف عن الفرص الجديدة!'
              }
            </p>
            <div className={styles.ctaButtons}>
              <a href="/careers" className={styles.ctaButton}>
                <span className="material-icons">work</span>
                <span>{language === 'en' ? 'View Jobs' : 'عرض الوظائف'}</span>
              </a>
              <a href="/contact" className={styles.ctaButton}>
                <span className="material-icons">contact_support</span>
                <span>{language === 'en' ? 'Get Support' : 'احصل على الدعم'}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterSocialMedia;
