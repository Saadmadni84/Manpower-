import React, { useState, useEffect } from 'react';
import MainLayout from '../../components/common/Layout/MainLayout';
import SEOHead from '../../components/common/SEOHead/SEOHead';
import Button from '../../components/ui/Button/Button';
import Card from '../../components/ui/Card/Card';
import Badge from '../../components/ui/Badge/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner/LoadingSpinner';
import JobApplicationModal from '../../components/careers/JobApplicationModal/JobApplicationModal';
import CVBuilder from '../../components/careers/CVBuilder/CVBuilder';
import { useLanguage } from '../../context/LanguageContext';
import styles from './Careers.module.css';

const Careers = () => {
  const { t, isRTL } = useLanguage();
  const [activeTab, setActiveTab] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showCVBuilder, setShowCVBuilder] = useState(false);

  // Sample job data - in real app, this would come from API
  const jobCategories = [
    {
      id: 'airport',
      title: 'Airport Operations',
      icon: '✈️',
      jobs: [
        {
          id: 1,
          title: 'Ground Handling Agent',
          location: 'Jeddah',
          salary: '3,500-5,000 SAR',
          experience: 'Entry Level',
          type: 'Full-time',
          description: 'Handle aircraft ground operations, baggage handling, and customer service.',
          requirements: ['High school diploma', 'Good communication skills', 'Physical fitness'],
          deadline: '2024-02-15'
        },
        {
          id: 2,
          title: 'Security Personnel',
          location: 'Riyadh',
          salary: '4,000-6,000 SAR',
          experience: '1-2 years',
          type: 'Full-time',
          description: 'Ensure airport security compliance and passenger safety.',
          requirements: ['Security certification', 'Arabic & English', 'Clean record'],
          deadline: '2024-02-20'
        }
      ]
    },
    {
      id: 'construction',
      title: 'Construction & Infrastructure',
      icon: '🏗️',
      jobs: [
        {
          id: 3,
          title: 'Civil Engineer',
          location: 'Dammam',
          salary: '8,000-12,000 SAR',
          experience: '3-5 years',
          type: 'Full-time',
          description: 'Supervise construction projects and ensure quality standards.',
          requirements: ['Engineering degree', 'Project management', 'Saudi license'],
          deadline: '2024-02-25'
        }
      ]
    },
    {
      id: 'corporate',
      title: 'Corporate Offices',
      icon: '🏢',
      jobs: [
        {
          id: 4,
          title: 'HR Specialist',
          location: 'Madina',
          salary: '5,000-8,000 SAR',
          experience: '2-3 years',
          type: 'Full-time',
          description: 'Manage recruitment, employee relations, and HR policies.',
          requirements: ['HR degree', 'Arabic & English', 'Experience in HR'],
          deadline: '2024-03-01'
        }
      ]
    }
  ];

  const allJobs = jobCategories.flatMap(category => 
    category.jobs.map(job => ({ ...job, industry: category.id }))
  );

  const locations = ['all', 'Jeddah', 'Riyadh', 'Dammam', 'Madina'];
  const industries = ['all', 'airport', 'construction', 'corporate', 'catering', 'facility', 'logistics'];

  const testimonials = [
    {
      name: 'Ahmed Al-Rashid',
      position: 'Construction Supervisor',
      location: 'Riyadh',
      tenure: '8 Years',
      quote: 'Started as a construction worker 8 years ago, now supervising major projects in Riyadh. The company provided excellent training and career advancement opportunities.',
      growth: 'Worker → Supervisor',
      salaryGrowth: '60%'
    },
    {
      name: 'Fatima Al-Zahra',
      position: 'Airport Operations Manager',
      location: 'Jeddah',
      tenure: '5 Years',
      quote: 'Joined as ground handling agent, became team leader within 2 years. Great exposure to international operations and professional development.',
      growth: 'Agent → Manager',
      salaryGrowth: '80%'
    },
    {
      name: 'Mohammed Al-Otaibi',
      position: 'Facilities Engineer',
      location: 'Dammam',
      tenure: '6 Years',
      quote: 'The technical training programs helped me advance from maintenance technician to facilities engineer. Excellent career progression path.',
      growth: 'Technician → Engineer',
      salaryGrowth: '40%'
    }
  ];

  const benefits = [
    {
      category: 'Financial Benefits',
      icon: '💰',
      items: [
        'Competitive monthly salaries',
        'Annual salary increases',
        'Performance bonuses',
        'End-of-service benefits',
        'Transportation allowances'
      ]
    },
    {
      category: 'Health & Wellness',
      icon: '🏥',
      items: [
        'Medical insurance coverage',
        'Annual health checkups',
        'Workplace safety training',
        'Wellness programs'
      ]
    },
    {
      category: 'Professional Development',
      icon: '📚',
      items: [
        'Skills training programs',
        'English/Arabic language classes',
        'Technical certifications',
        'Leadership development',
        'Cross-industry experience'
      ]
    },
    {
      category: 'Work-Life Balance',
      icon: '⚖️',
      items: [
        'Flexible working hours',
        'Paid annual leave',
        'Religious holiday observance',
        'Family support programs'
      ]
    }
  ];

  useEffect(() => {
    filterJobs();
  }, [activeTab, selectedLocation, selectedIndustry, searchTerm]);

  const filterJobs = () => {
    let filtered = allJobs;

    if (selectedLocation !== 'all') {
      filtered = filtered.filter(job => job.location === selectedLocation);
    }

    if (selectedIndustry !== 'all') {
      filtered = filtered.filter(job => job.industry === selectedIndustry);
    }

    if (searchTerm) {
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredJobs(filtered);
  };

  const handleQuickApply = (job) => {
    setSelectedJob(job);
    setIsApplicationModalOpen(true);
  };

  const handleCloseApplicationModal = () => {
    setIsApplicationModalOpen(false);
    setSelectedJob(null);
  };

  return (
    <MainLayout>
      <SEOHead 
        title="Careers - Saudi Arabia's Leading Manpower Company"
        description="Join 10,000+ professionals working across Jeddah, Riyadh, Dammam, and Madina. Build your career with 25+ years of industry leadership."
        keywords="careers, jobs, manpower, Saudi Arabia, employment, recruitment"
      />
      <div className={styles.careers}>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Build Your Career with Saudi Arabia's Leading Manpower Company
          </h1>
          <p className={styles.heroSubtitle}>
            Join 10,000+ professionals working across Jeddah, Riyadh, Dammam, and Madina in exciting industries for 25+ years
          </p>
          
          <div className={styles.stats}>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>10,000+</span>
              <span className={styles.statLabel}>Employees</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>200+</span>
              <span className={styles.statLabel}>Clients</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>8</span>
              <span className={styles.statLabel}>Industries</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>4</span>
              <span className={styles.statLabel}>Major Cities</span>
            </div>
          </div>

          <div className={styles.heroActions}>
            <Button 
              variant="primary" 
              size="large"
              onClick={() => document.getElementById('job-listings').scrollIntoView({ behavior: 'smooth' })}
            >
              Browse Jobs
            </Button>
            <Button 
              variant="secondary" 
              size="large"
              onClick={() => setShowCVBuilder(true)}
            >
              Build Your CV
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className={styles.valueProposition}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Why Choose Us?</h2>
          <div className={styles.valueGrid}>
            <div className={styles.valueItem}>
              <span className={styles.valueIcon}>🏆</span>
              <h3>25+ Years of Industry Leadership</h3>
              <p>Established expertise and proven track record in manpower solutions</p>
            </div>
            <div className={styles.valueItem}>
              <span className={styles.valueIcon}>💵</span>
              <h3>Competitive Salaries & Benefits</h3>
              <p>Attractive compensation packages with comprehensive benefits</p>
            </div>
            <div className={styles.valueItem}>
              <span className={styles.valueIcon}>📈</span>
              <h3>Career Growth Opportunities</h3>
              <p>Clear advancement paths and professional development programs</p>
            </div>
            <div className={styles.valueItem}>
              <span className={styles.valueIcon}>🏢</span>
              <h3>Work with Renowned Companies</h3>
              <p>Opportunities with leading Saudi and international organizations</p>
            </div>
            <div className={styles.valueItem}>
              <span className={styles.valueIcon}>🌐</span>
              <h3>Multiple Industry Exposure</h3>
              <p>Diverse experience across construction, aviation, corporate, and more</p>
            </div>
            <div className={styles.valueItem}>
              <span className={styles.valueIcon}>🎓</span>
              <h3>Professional Development</h3>
              <p>Training programs, certifications, and skill enhancement opportunities</p>
            </div>
          </div>
        </div>
      </section>

      {/* Job Categories */}
      <section className={styles.jobCategories}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Available Job Categories</h2>
          <div className={styles.categoriesGrid}>
            {jobCategories.map(category => (
              <Card key={category.id} className={styles.categoryCard}>
                <div className={styles.categoryIcon}>{category.icon}</div>
                <h3 className={styles.categoryTitle}>{category.title}</h3>
                <p className={styles.categoryJobs}>{category.jobs.length} positions available</p>
                <Button 
                  variant="outline" 
                  size="small"
                  onClick={() => {
                    setSelectedIndustry(category.id);
                    document.getElementById('job-listings').scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  View Jobs
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Job Listings */}
      <section id="job-listings" className={styles.jobListings}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Current Job Openings</h2>
          
          {/* Search and Filters */}
          <div className={styles.searchFilters}>
            <div className={styles.searchBox}>
              <input
                type="text"
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
              <span className={styles.searchIcon}>🔍</span>
            </div>
            
            <div className={styles.filters}>
              <select 
                value={selectedLocation} 
                onChange={(e) => setSelectedLocation(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="all">All Locations</option>
                {locations.slice(1).map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
              
              <select 
                value={selectedIndustry} 
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="all">All Industries</option>
                <option value="airport">Airport Operations</option>
                <option value="construction">Construction</option>
                <option value="corporate">Corporate</option>
                <option value="catering">Catering</option>
                <option value="facility">Facility Management</option>
                <option value="logistics">Logistics</option>
              </select>
            </div>
          </div>

          {/* Job Cards */}
          <div className={styles.jobsGrid}>
            {loading ? (
              <LoadingSpinner />
            ) : filteredJobs.length > 0 ? (
              filteredJobs.map(job => (
                <Card key={job.id} className={styles.jobCard}>
                  <div className={styles.jobHeader}>
                    <h3 className={styles.jobTitle}>{job.title}</h3>
                    <Badge variant="secondary">{job.type}</Badge>
                  </div>
                  
                  <div className={styles.jobDetails}>
                    <div className={styles.jobDetail}>
                      <span className={styles.detailIcon}>📍</span>
                      <span>{job.location}</span>
                    </div>
                    <div className={styles.jobDetail}>
                      <span className={styles.detailIcon}>💰</span>
                      <span>{job.salary}</span>
                    </div>
                    <div className={styles.jobDetail}>
                      <span className={styles.detailIcon}>👨‍💼</span>
                      <span>{job.experience}</span>
                    </div>
                  </div>
                  
                  <p className={styles.jobDescription}>{job.description}</p>
                  
                  <div className={styles.jobRequirements}>
                    <h4>Key Requirements:</h4>
                    <ul>
                      {job.requirements.slice(0, 3).map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className={styles.jobFooter}>
                    <span className={styles.deadline}>
                      Apply by: {new Date(job.deadline).toLocaleDateString()}
                    </span>
                    <div className={styles.jobActions}>
                      <Button 
                        variant="outline" 
                        size="small"
                        onClick={() => console.log('View details for job:', job.id)}
                      >
                        View Details
                      </Button>
                      <Button 
                        variant="primary" 
                        size="small"
                        onClick={() => handleQuickApply(job)}
                      >
                        Quick Apply
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className={styles.noJobs}>
                <p>No jobs found matching your criteria.</p>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedLocation('all');
                    setSelectedIndustry('all');
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Employee Success Stories */}
      <section className={styles.testimonials}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Employee Success Stories</h2>
          <div className={styles.testimonialsGrid}>
            {testimonials.map((testimonial, index) => (
              <Card key={index} className={styles.testimonialCard}>
                <div className={styles.testimonialContent}>
                  <p className={styles.testimonialQuote}>"{testimonial.quote}"</p>
                  <div className={styles.testimonialAuthor}>
                    <h4>{testimonial.name}</h4>
                    <p>{testimonial.position}</p>
                    <div className={styles.testimonialDetails}>
                      <Badge variant="primary">{testimonial.location}</Badge>
                      <Badge variant="secondary">{testimonial.tenure}</Badge>
                      <Badge variant="success">{testimonial.growth}</Badge>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits & Perks */}
      <section className={styles.benefits}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Benefits & Perks</h2>
          <div className={styles.benefitsGrid}>
            {benefits.map((benefit, index) => (
              <Card key={index} className={styles.benefitCard}>
                <div className={styles.benefitHeader}>
                  <span className={styles.benefitIcon}>{benefit.icon}</span>
                  <h3>{benefit.category}</h3>
                </div>
                <ul className={styles.benefitList}>
                  {benefit.items.map((item, itemIndex) => (
                    <li key={itemIndex}>{item}</li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Application Process */}
      <section className={styles.applicationProcess}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Application Process</h2>
          <div className={styles.processSteps}>
            <div className={styles.processStep}>
              <div className={styles.stepNumber}>1</div>
              <h3>Browse Available Positions</h3>
              <p>Filter by industry, location, experience and view detailed job descriptions</p>
            </div>
            <div className={styles.processStep}>
              <div className={styles.stepNumber}>2</div>
              <h3>Submit Application</h3>
              <p>Complete online form, upload CV, add cover letter and provide references</p>
            </div>
            <div className={styles.processStep}>
              <div className={styles.stepNumber}>3</div>
              <h3>Initial Screening</h3>
              <p>Application review, phone/video interview and skills assessment</p>
            </div>
            <div className={styles.processStep}>
              <div className={styles.stepNumber}>4</div>
              <h3>Client Interview</h3>
              <p>Coordinate with client companies for interviews and demonstrations</p>
            </div>
            <div className={styles.processStep}>
              <div className={styles.stepNumber}>5</div>
              <h3>Placement & Onboarding</h3>
              <p>Job offer, contract signing, orientation and client integration</p>
            </div>
          </div>
        </div>
      </section>

      {/* CV Builder */}
      <section id="cv-builder" className={styles.cvBuilder}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Build Your Professional CV</h2>
          <div className={styles.cvBuilderContent}>
            <div className={styles.cvBuilderInfo}>
              <h3>Create an Impressive CV in Minutes</h3>
              <ul>
                <li>Step-by-step CV creation wizard</li>
                <li>Industry-specific templates</li>
                <li>Arabic/English language options</li>
                <li>Skills assessment integration</li>
                <li>Professional formatting</li>
              </ul>
              <Button 
                variant="primary" 
                size="large"
                onClick={() => setShowCVBuilder(true)}
              >
                Start Building CV
              </Button>
            </div>
            <div className={styles.cvBuilderPreview}>
              <div className={styles.cvPreview}>
                <div className={styles.cvHeader}>
                  <h4>Your Name</h4>
                  <p>Your Position</p>
                </div>
                <div className={styles.cvSection}>
                  <h5>Experience</h5>
                  <p>Your work history will appear here</p>
                </div>
                <div className={styles.cvSection}>
                  <h5>Skills</h5>
                  <p>Your skills will be listed here</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Job Alerts */}
      <section className={styles.jobAlerts}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Stay Updated with Job Alerts</h2>
          <div className={styles.alertFeatures}>
            <div className={styles.alertFeature}>
              <span className={styles.alertIcon}>📧</span>
              <h3>Email Notifications</h3>
              <p>Get notified when matching jobs are posted</p>
            </div>
            <div className={styles.alertFeature}>
              <span className={styles.alertIcon}>📱</span>
              <h3>SMS Alerts</h3>
              <p>Receive urgent position alerts on your phone</p>
            </div>
            <div className={styles.alertFeature}>
              <span className={styles.alertIcon}>💬</span>
              <h3>WhatsApp Integration</h3>
              <p>Quick updates and communication via WhatsApp</p>
            </div>
          </div>
          <div className={styles.alertSignup}>
            <input 
              type="email" 
              placeholder="Enter your email address"
              className={styles.alertInput}
            />
            <Button variant="primary">Subscribe to Alerts</Button>
          </div>
        </div>
      </section>

      {/* Location Information */}
      <section className={styles.locations}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Opportunities Across Saudi Arabia</h2>
          <div className={styles.locationsGrid}>
            <div className={styles.locationCard}>
              <h3>Jeddah Region</h3>
              <div className={styles.locationDetails}>
                <p><strong>Focus:</strong> Airport operations, corporate offices, catering</p>
                <p><strong>Major Clients:</strong> Airlines, hospitals, government offices</p>
                <p><strong>Salary Range:</strong> 3,000-8,000 SAR</p>
                <p><strong>Transportation:</strong> Company buses available</p>
              </div>
            </div>
            <div className={styles.locationCard}>
              <h3>Riyadh Region</h3>
              <div className={styles.locationDetails}>
                <p><strong>Focus:</strong> Construction, corporate, facility management</p>
                <p><strong>Major Clients:</strong> Construction companies, corporate towers</p>
                <p><strong>Salary Range:</strong> 3,500-10,000 SAR</p>
                <p><strong>Accommodation:</strong> Assistance provided</p>
              </div>
            </div>
            <div className={styles.locationCard}>
              <h3>Dammam Region</h3>
              <div className={styles.locationDetails}>
                <p><strong>Focus:</strong> Industrial, logistics, facility management</p>
                <p><strong>Major Clients:</strong> Industrial companies, logistics firms</p>
                <p><strong>Salary Range:</strong> 3,200-9,000 SAR</p>
                <p><strong>Benefits:</strong> Industrial allowances included</p>
              </div>
            </div>
            <div className={styles.locationCard}>
              <h3>Madina Region</h3>
              <div className={styles.locationDetails}>
                <p><strong>Focus:</strong> Hospitality, facility management, corporate</p>
                <p><strong>Major Clients:</strong> Hotels, government offices</p>
                <p><strong>Salary Range:</strong> 3,000-7,500 SAR</p>
                <p><strong>Special:</strong> Religious tourism sector opportunities</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className={styles.cta}>
        <div className={styles.container}>
          <div className={styles.ctaContent}>
            <h2>Ready to Start Your Career Journey?</h2>
            <p>Join thousands of professionals who have built successful careers with us</p>
            <div className={styles.ctaActions}>
              <Button variant="primary" size="large">
                Browse All Jobs
              </Button>
              <Button variant="secondary" size="large">
                Submit Your CV
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Job Application Modal */}
      <JobApplicationModal
        isOpen={isApplicationModalOpen}
        onClose={handleCloseApplicationModal}
        jobTitle={selectedJob?.title}
        jobId={selectedJob?.id}
      />

      {/* CV Builder Modal */}
      {showCVBuilder && (
        <div className={styles.cvBuilderModal}>
          <div className={styles.modalOverlay} onClick={() => setShowCVBuilder(false)}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h2>Build Your Professional CV</h2>
                <button 
                  className={styles.closeButton}
                  onClick={() => setShowCVBuilder(false)}
                >
                  ×
                </button>
              </div>
              <CVBuilder />
            </div>
          </div>
        </div>
      )}
      </div>
    </MainLayout>
  );
};

export default Careers;
