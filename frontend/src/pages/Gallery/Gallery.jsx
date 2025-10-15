import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Search, 
  FilterList, 
  GridView, 
  ViewList,
  Image,
  Category,
  LocationOn,
  Person,
  CalendarToday
} from '@mui/icons-material';
import MainLayout from '../../components/common/Layout/MainLayout';
import SEOHead from '../../components/common/SEOHead/SEOHead';
import styles from './Gallery.module.css';

const Gallery = () => {
  const { t, isRTL } = useLanguage();
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // Sample gallery data for demonstration
  const sampleImages = [
    {
      id: 1,
      title: 'Company Training Session',
      description: 'Professional training session for our workforce',
      category: 'Training Sessions',
      url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=500&h=300&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=300&h=200&fit=crop',
      location: 'Riyadh Office',
      photographer: 'Ahmed Al-Rashid',
      tags: ['training', 'workforce', 'professional'],
      createdAt: '2024-01-15',
      fileSize: 2048000
    },
    {
      id: 2,
      title: 'Safety Equipment Demonstration',
      description: 'Demonstrating proper safety equipment usage',
      category: 'Safety Programs',
      url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=500&h=300&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=300&h=200&fit=crop',
      location: 'Jeddah Site',
      photographer: 'Mohammed Al-Sayed',
      tags: ['safety', 'equipment', 'demonstration'],
      createdAt: '2024-01-12',
      fileSize: 1856000
    },
    {
      id: 3,
      title: 'Company Event Celebration',
      description: 'Annual company celebration event',
      category: 'Company Events',
      url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=500&h=300&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=300&h=200&fit=crop',
      location: 'Dammam Office',
      photographer: 'Fatima Al-Zahra',
      tags: ['celebration', 'event', 'company'],
      createdAt: '2024-01-10',
      fileSize: 2560000
    },
    {
      id: 4,
      title: 'Workforce at Construction Site',
      description: 'Our skilled workforce at a major construction project',
      category: 'Workforce in Action',
      url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500&h=300&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&h=200&fit=crop',
      location: 'Madina Project',
      photographer: 'Omar Al-Hassan',
      tags: ['construction', 'workforce', 'project'],
      createdAt: '2024-01-08',
      fileSize: 1920000
    },
    {
      id: 5,
      title: 'Regional Office - Jeddah',
      description: 'Our modern regional office in Jeddah',
      category: 'Regional Offices',
      url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500&h=300&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&h=200&fit=crop',
      location: 'Jeddah',
      photographer: 'Sarah Al-Mansouri',
      tags: ['office', 'jeddah', 'regional'],
      createdAt: '2024-01-05',
      fileSize: 2240000
    },
    {
      id: 6,
      title: 'Achievement Award Ceremony',
      description: 'Recognizing outstanding employees',
      category: 'Achievement Awards',
      url: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=500&h=300&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=300&h=200&fit=crop',
      location: 'Riyadh Convention Center',
      photographer: 'Khalid Al-Mutairi',
      tags: ['awards', 'achievement', 'recognition'],
      createdAt: '2024-01-03',
      fileSize: 2688000
    }
  ];

  const categories = [
    { id: 'all', name: 'All Categories', count: sampleImages.length },
    { id: 'Training Sessions', name: 'Training Sessions', count: 1 },
    { id: 'Safety Programs', name: 'Safety Programs', count: 1 },
    { id: 'Company Events', name: 'Company Events', count: 1 },
    { id: 'Workforce in Action', name: 'Workforce in Action', count: 1 },
    { id: 'Regional Offices', name: 'Regional Offices', count: 1 },
    { id: 'Achievement Awards', name: 'Achievement Awards', count: 1 }
  ];

  // Filter images based on search and category
  const filteredImages = sampleImages.filter(image => {
    const matchesSearch = !searchQuery || 
      image.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      image.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      image.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || image.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <MainLayout>
      <SEOHead 
        title="Company Gallery - Saudi Manpower"
        description="Explore our workforce, training programs, and company achievements through our comprehensive gallery showcasing 25+ years of excellence in manpower supply across Saudi Arabia."
        keywords="company gallery, workforce photos, training sessions, safety programs, company events, Saudi Arabia manpower"
      />
      
      <div className={styles.galleryContainer}>
        {/* Header Section */}
        <motion.div 
          className={styles.galleryHeader}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className={styles.headerContent}>
          <h1 className={styles.galleryTitle}>
            {t('gallery.title')}
          </h1>
          <p className={styles.gallerySubtitle}>
            {t('gallery.subtitle')}
          </p>
          </div>
        </motion.div>

      {/* Controls Section */}
      <motion.div 
        className={styles.controlsSection}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className={styles.controlsContainer}>
          {/* Search */}
          <div className={styles.searchContainer}>
            <div className={styles.searchInputContainer}>
              <Search className={styles.searchIcon} />
              <input
                type="text"
                placeholder={t('gallery.search.placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
            </div>
          </div>

          {/* Filters */}
          <div className={styles.filterControls}>
            <button 
              className={`${styles.filterButton} ${showFilters ? styles.active : ''}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <FilterList />
              {t('gallery.filters')}
            </button>

            <div className={styles.viewControls}>
              <button 
                className={`${styles.viewButton} ${viewMode === 'grid' ? styles.active : ''}`}
                onClick={() => setViewMode('grid')}
                title={t('gallery.gridView')}
              >
                <GridView />
              </button>
              <button 
                className={`${styles.viewButton} ${viewMode === 'list' ? styles.active : ''}`}
                onClick={() => setViewMode('list')}
                title={t('gallery.listView')}
              >
                <ViewList />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <motion.div 
            className={styles.filterPanel}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className={styles.filterContent}>
              <div className={styles.filterSection}>
                <h4 className={styles.sectionTitle}>
                  {t('gallery.filter.categories')}
                </h4>
                <div className={styles.categoryGrid}>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      className={`${styles.categoryButton} ${selectedCategory === category.id ? styles.active : ''}`}
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      <div className={styles.categoryContent}>
                        <span className={styles.categoryLabel}>
                          {category.name}
                        </span>
                        <span className={styles.categoryCount}>
                          {category.count}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Gallery Grid */}
      <motion.div 
        className={styles.galleryContent}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        {filteredImages.length === 0 ? (
          <div className={styles.noResults}>
            <h3>{t('gallery.noResults.title')}</h3>
            <p>{t('gallery.noResults.message')}</p>
          </div>
        ) : (
          <div className={`${styles.galleryGrid} ${viewMode === 'list' ? styles.listView : ''}`}>
            {filteredImages.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  duration: 0.4, 
                  delay: index * 0.05
                }}
                className={styles.galleryItemWrapper}
              >
                <div className={styles.galleryItem}>
                  <div className={styles.imageContainer}>
                    <img
                      src={image.thumbnail}
                      alt={image.title}
                      className={styles.image}
                    />
                    <div className={styles.categoryBadge}>
                      {image.category}
                    </div>
                  </div>
                  
                  <div className={styles.itemContent}>
                    <h3 className={styles.title}>{image.title}</h3>
                    <p className={styles.description}>{image.description}</p>
                    
                    <div className={styles.metadata}>
                      <div className={styles.metaItem}>
                        <CalendarToday className={styles.metaIcon} />
                        <span>{formatDate(image.createdAt)}</span>
                      </div>
                      
                      {image.location && (
                        <div className={styles.metaItem}>
                          <LocationOn className={styles.metaIcon} />
                          <span>{image.location}</span>
                        </div>
                      )}
                      
                      {image.photographer && (
                        <div className={styles.metaItem}>
                          <Person className={styles.metaIcon} />
                          <span>{image.photographer}</span>
                        </div>
                      )}
                    </div>

                    {image.tags && image.tags.length > 0 && (
                      <div className={styles.tags}>
                        {image.tags.slice(0, 3).map((tag, tagIndex) => (
                          <span key={tagIndex} className={styles.tag}>
                            #{tag}
                          </span>
                        ))}
                        {image.tags.length > 3 && (
                          <span className={styles.moreTags}>
                            +{image.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
      </div>
    </MainLayout>
  );
};

export default Gallery;
